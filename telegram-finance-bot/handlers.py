"""Telegram command and conversation handlers.

Contains all the user-facing logic: parsing input, formatting replies, and
wiring the /new and /edit conversations together. Sheet access goes through
sheet.py and math goes through calculations.py.
"""

from __future__ import annotations

import csv
import io
import re
from datetime import datetime
from zoneinfo import ZoneInfo

from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputFile,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    Update,
)
from telegram.constants import ParseMode
from telegram.ext import (
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

import config
import sheet
from calculations import calculate_entry

# Conversation states shared by the /new and /edit flows
CONFIRM_DUPLICATE, GROSS, GAS, FOOD, EDIT_CHOOSE_FIELD, EDIT_VALUE = range(6)

# Main reply-keyboard button labels
BTN_NEW = "➕ New Entry"
BTN_TODAY = "📅 Today"
BTN_SUMMARY = "📊 This Month"
BTN_EDIT = "✏️ Edit Today"
BTN_EXPORT = "📄 Export CSV"

MAIN_MENU = ReplyKeyboardMarkup(
    [[BTN_NEW], [BTN_TODAY, BTN_SUMMARY], [BTN_EDIT, BTN_EXPORT]],
    resize_keyboard=True,
)

# Callback data for inline buttons
CB_DUP_EDIT = "dup_edit"
CB_DUP_CREATE = "dup_create"
CB_EDIT_GROSS = "edit_field_gross"
CB_EDIT_GAS = "edit_field_gas"
CB_EDIT_FOOD = "edit_field_food"

EDIT_FIELD_LABELS = {CB_EDIT_GROSS: "Gross", CB_EDIT_GAS: "Gas", CB_EDIT_FOOD: "Food"}

HELP_TEXT = (
    "Personal finance tracker.\n\n"
    "Use the buttons below, or these commands:\n"
    "/new - Add today's earnings entry\n"
    "/today - Show today's latest entry\n"
    "/summary - Show this month's totals\n"
    "/edit - Edit today's entry\n"
    "/export - Export all entries as CSV\n"
)


def _button_filter(label: str) -> filters.BaseFilter:
    """Build an exact-match filter for a main-menu button's text."""
    return filters.Regex(f"^{re.escape(label)}$")


def _now() -> datetime:
    """Return the current time in the configured timezone."""
    return datetime.now(ZoneInfo(config.TIMEZONE))


def _date_iso(moment: datetime) -> str:
    """Sortable date key used as the sheet's Date column, e.g. '2026-07-29'."""
    return moment.strftime("%Y-%m-%d")


def _date_display(moment: datetime) -> str:
    """Human-friendly date used in bot replies, e.g. 'July 29, 2026'."""
    return f"{moment.strftime('%B')} {moment.day}, {moment.year}"


def _date_display_from_iso(date_iso: str) -> str:
    """Human-friendly date built from a stored 'YYYY-MM-DD' string."""
    return _date_display(datetime.strptime(date_iso, "%Y-%m-%d"))


def _parse_amount(text: str, default: float | None = None) -> float | None:
    """Parse a user-entered amount.

    Returns the default when the message is empty (used for Gas/Food, whose
    default is 0), or None if the input isn't a valid non-negative number.
    """
    text = text.strip().replace(",", ".")
    if text == "" and default is not None:
        return default
    try:
        value = float(text)
    except ValueError:
        return None
    if value < 0:
        return None
    return value


def _format_entry(date_display: str, values: dict[str, float]) -> str:
    """Render one entry with bold titles, emojis, and two-decimal money."""
    symbol = config.CURRENCY_SYMBOL
    return (
        f"<b>{date_display}</b>\n\n"
        f"💰 Gross: {symbol}{values['gross']:.2f}\n"
        f"⛽ Gas: {symbol}{values['gas']:.2f}\n"
        f"🍔 Food: {symbol}{values['food']:.2f}\n\n"
        f"🤝 15%: {symbol}{values['percent']:.2f}\n\n"
        f"━━━━━━━━━━━━\n"
        f"✅ <b>CLEAR: {symbol}{values['clear']:.2f}</b>"
    )


def _row_to_values(row: list[str]) -> dict[str, float]:
    """Convert a raw sheet row into the values dict used by formatting."""
    return {
        "gross": float(row[1]),
        "gas": float(row[2]),
        "food": float(row[3]),
        "base": float(row[4]),
        "percent": float(row[5]),
        "clear": float(row[6]),
    }


def _edit_field_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [
            [InlineKeyboardButton("Gross", callback_data=CB_EDIT_GROSS)],
            [InlineKeyboardButton("Gas", callback_data=CB_EDIT_GAS)],
            [InlineKeyboardButton("Food", callback_data=CB_EDIT_FOOD)],
        ]
    )


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start and /help - show usage instructions and the main menu."""
    await update.message.reply_text(HELP_TEXT, reply_markup=MAIN_MENU)


# ---------------------------------------------------------------------------
# /new - create an entry, with duplicate-of-today protection
# ---------------------------------------------------------------------------


async def new_entry_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /new - begin the gross/gas/food conversation.

    If today already has an entry, ask whether to edit it or add another
    instead of silently creating a second row.
    """
    context.user_data.clear()
    now = _now()
    date_iso = _date_iso(now)

    try:
        existing_row = sheet.get_latest_entry_for_date(date_iso)
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(
            f"Could not read Google Sheets: {exc}", reply_markup=MAIN_MENU
        )
        return ConversationHandler.END

    if existing_row is not None:
        context.user_data["edit_row"] = existing_row
        context.user_data["edit_date_iso"] = date_iso
        keyboard = InlineKeyboardMarkup(
            [
                [
                    InlineKeyboardButton("✏️ Edit existing", callback_data=CB_DUP_EDIT),
                    InlineKeyboardButton("➕ Create another", callback_data=CB_DUP_CREATE),
                ]
            ]
        )
        await update.message.reply_text(
            "You already have an entry for today.", reply_markup=keyboard
        )
        return CONFIRM_DUPLICATE

    await update.message.reply_text("Gross earnings?", reply_markup=ReplyKeyboardRemove())
    return GROSS


async def dup_confirm_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle the Edit existing / Create another choice for a duplicate day."""
    query = update.callback_query
    await query.answer()

    if query.data == CB_DUP_CREATE:
        await query.edit_message_text("Okay, let's add another entry for today.")
        await query.message.reply_text("Gross earnings?", reply_markup=ReplyKeyboardRemove())
        return GROSS

    # CB_DUP_EDIT - reuse the row already fetched in new_entry_start
    await query.edit_message_text(
        "Which value would you like to change?", reply_markup=_edit_field_keyboard()
    )
    return EDIT_CHOOSE_FIELD


async def receive_gross(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for gross earnings."
        )
        return GROSS

    context.user_data["gross"] = value
    await update.message.reply_text("Gas expense?\n(Leave empty for $0)")
    return GAS


async def receive_gas(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text, default=0.0)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for gas expense (or leave empty for $0)."
        )
        return GAS

    context.user_data["gas"] = value
    await update.message.reply_text("Food expense?\n(Leave empty for $0)")
    return FOOD


async def receive_food(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text, default=0.0)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for food expense (or leave empty for $0)."
        )
        return FOOD

    context.user_data["food"] = value
    result = calculate_entry(
        gross=context.user_data["gross"],
        gas=context.user_data["gas"],
        food=context.user_data["food"],
    )

    now = _now()
    try:
        sheet.append_entry(_date_iso(now), result)
    except Exception as exc:  # noqa: BLE001 - surface any Sheets failure, don't crash
        await update.message.reply_text(
            f"Could not save to Google Sheets: {exc}", reply_markup=MAIN_MENU
        )
        context.user_data.clear()
        return ConversationHandler.END

    message = "✅ Entry saved successfully.\n\n" + _format_entry(_date_display(now), result)
    await update.message.reply_text(message, parse_mode=ParseMode.HTML, reply_markup=MAIN_MENU)
    context.user_data.clear()
    return ConversationHandler.END


# ---------------------------------------------------------------------------
# /edit - change a value on today's existing entry, in place
# ---------------------------------------------------------------------------


async def edit_entry_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /edit - find today's entry and ask which field to change."""
    context.user_data.clear()
    now = _now()
    date_iso = _date_iso(now)

    try:
        row = sheet.get_latest_entry_for_date(date_iso)
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(
            f"Could not read Google Sheets: {exc}", reply_markup=MAIN_MENU
        )
        return ConversationHandler.END

    if row is None:
        await update.message.reply_text("No entry found for today.", reply_markup=MAIN_MENU)
        return ConversationHandler.END

    context.user_data["edit_row"] = row
    context.user_data["edit_date_iso"] = date_iso
    await update.message.reply_text(
        "Which value would you like to change?", reply_markup=_edit_field_keyboard()
    )
    return EDIT_CHOOSE_FIELD


async def edit_field_selected(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle the Gross / Gas / Food choice, then ask for the new value."""
    query = update.callback_query
    await query.answer()

    field_label = EDIT_FIELD_LABELS[query.data]
    context.user_data["edit_field"] = field_label.lower()

    await query.edit_message_text(f"Selected: {field_label}")
    await query.message.reply_text(
        f"Enter new value for {field_label}:", reply_markup=ReplyKeyboardRemove()
    )
    return EDIT_VALUE


async def edit_value_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle the new value, recalculate, and overwrite today's sheet row."""
    field = context.user_data["edit_field"]  # "gross", "gas", or "food"
    default = None if field == "gross" else 0.0
    value = _parse_amount(update.message.text, default=default)

    if value is None:
        await update.message.reply_text(
            f"Please enter a valid non-negative number for {field}."
        )
        return EDIT_VALUE

    row = context.user_data["edit_row"]
    current = _row_to_values(row)
    current[field] = value

    result = calculate_entry(gross=current["gross"], gas=current["gas"], food=current["food"])
    date_iso = context.user_data["edit_date_iso"]

    try:
        updated = sheet.update_entry_for_date(date_iso, result)
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(
            f"Could not update Google Sheets: {exc}", reply_markup=MAIN_MENU
        )
        context.user_data.clear()
        return ConversationHandler.END

    if not updated:
        await update.message.reply_text(
            "Could not find today's row to update - it may have been removed.",
            reply_markup=MAIN_MENU,
        )
        context.user_data.clear()
        return ConversationHandler.END

    message = "✅ Entry updated successfully.\n\n" + _format_entry(
        _date_display_from_iso(date_iso), result
    )
    await update.message.reply_text(message, parse_mode=ParseMode.HTML, reply_markup=MAIN_MENU)
    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /cancel - abort an in-progress /new or /edit conversation."""
    context.user_data.clear()
    await update.message.reply_text("Cancelled.", reply_markup=MAIN_MENU)
    return ConversationHandler.END


# ---------------------------------------------------------------------------
# Stateless commands: /today, /summary, /export
# ---------------------------------------------------------------------------


async def today_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /today - show today's latest saved entry."""
    now = _now()

    try:
        row = sheet.get_latest_entry_for_date(_date_iso(now))
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(f"Could not read Google Sheets: {exc}", reply_markup=MAIN_MENU)
        return

    if row is None:
        await update.message.reply_text(
            "No entry for today yet. Use /new to add one.", reply_markup=MAIN_MENU
        )
        return

    message = _format_entry(_date_display(now), _row_to_values(row))
    await update.message.reply_text(message, parse_mode=ParseMode.HTML, reply_markup=MAIN_MENU)


async def summary_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /summary - show current month totals across all saved entries."""
    now = _now()

    try:
        rows = sheet.get_entries_for_month(now.year, now.month)
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(f"Could not read Google Sheets: {exc}", reply_markup=MAIN_MENU)
        return

    if not rows:
        await update.message.reply_text("No entries yet this month.", reply_markup=MAIN_MENU)
        return

    totals = {"gross": 0.0, "gas": 0.0, "food": 0.0, "percent": 0.0, "clear": 0.0}
    for row in rows:
        totals["gross"] += float(row[1])
        totals["gas"] += float(row[2])
        totals["food"] += float(row[3])
        totals["percent"] += float(row[5])
        totals["clear"] += float(row[6])

    symbol = config.CURRENCY_SYMBOL
    message = (
        f"<b>{now.strftime('%B %Y')}</b>\n\n"
        f"📅 Working Days: {len(rows)}\n\n"
        f"💰 Gross: {symbol}{totals['gross']:.2f}\n"
        f"⛽ Gas: {symbol}{totals['gas']:.2f}\n"
        f"🍔 Food: {symbol}{totals['food']:.2f}\n"
        f"🤝 15% Paid: {symbol}{totals['percent']:.2f}\n\n"
        f"━━━━━━━━━━━━\n"
        f"✅ <b>CLEAR: {symbol}{totals['clear']:.2f}</b>"
    )
    await update.message.reply_text(message, parse_mode=ParseMode.HTML, reply_markup=MAIN_MENU)


async def export_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /export - send every saved entry as a CSV file."""
    try:
        rows = sheet.get_all_entries()
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(f"Could not read Google Sheets: {exc}", reply_markup=MAIN_MENU)
        return

    if not rows:
        await update.message.reply_text("No entries to export yet.", reply_markup=MAIN_MENU)
        return

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(sheet.HEADERS)
    writer.writerows(rows)
    csv_bytes = buffer.getvalue().encode("utf-8")

    filename = f"finance_export_{_date_iso(_now())}.csv"
    document = InputFile(io.BytesIO(csv_bytes), filename=filename)
    await update.message.reply_document(
        document=document, caption="📄 Here is your full export.", reply_markup=MAIN_MENU
    )


# ---------------------------------------------------------------------------
# Wiring
# ---------------------------------------------------------------------------


def build_entry_conversation() -> ConversationHandler:
    """Build the combined /new + /edit conversation handler.

    Both flows share one state machine so a duplicate-day prompt from /new
    can hand off directly into the edit flow without a second conversation.
    """
    return ConversationHandler(
        entry_points=[
            CommandHandler("new", new_entry_start),
            MessageHandler(_button_filter(BTN_NEW), new_entry_start),
            CommandHandler("edit", edit_entry_start),
            MessageHandler(_button_filter(BTN_EDIT), edit_entry_start),
        ],
        states={
            CONFIRM_DUPLICATE: [CallbackQueryHandler(dup_confirm_callback)],
            GROSS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_gross)],
            GAS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_gas)],
            FOOD: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_food)],
            EDIT_CHOOSE_FIELD: [CallbackQueryHandler(edit_field_selected)],
            EDIT_VALUE: [MessageHandler(filters.TEXT & ~filters.COMMAND, edit_value_received)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )
