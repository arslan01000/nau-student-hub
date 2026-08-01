"""Telegram command and conversation handlers.

Contains all the user-facing logic: parsing input, formatting replies, and
wiring the /new conversation together. Sheet access goes through sheet.py
and math goes through calculations.py.
"""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from telegram import ReplyKeyboardRemove, Update
from telegram.ext import (
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

import config
import sheet
from calculations import calculate_entry

# Conversation states for the /new flow
GROSS, GAS, FOOD = range(3)

HELP_TEXT = (
    "Personal finance tracker.\n\n"
    "/new - Add today's earnings entry\n"
    "/today - Show today's latest entry\n"
    "/summary - Show this month's totals\n"
)


def _now() -> datetime:
    """Return the current time in the configured timezone."""
    return datetime.now(ZoneInfo(config.TIMEZONE))


def _date_iso(moment: datetime) -> str:
    """Sortable date key used as the sheet's Date column, e.g. '2026-07-29'."""
    return moment.strftime("%Y-%m-%d")


def _date_display(moment: datetime) -> str:
    """Human-friendly date used in bot replies, e.g. 'July 29'."""
    return f"{moment.strftime('%B')} {moment.day}"


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
    """Render one entry in the exact layout requested for bot replies."""
    symbol = config.CURRENCY_SYMBOL
    return (
        f"{date_display}\n\n"
        f"Gross: {symbol}{values['gross']:.2f}\n"
        f"Gas: {symbol}{values['gas']:.2f}\n"
        f"Food: {symbol}{values['food']:.2f}\n\n"
        f"15%: {symbol}{values['percent']:.2f}\n\n"
        f"--------------------\n"
        f"CLEAR: {symbol}{values['clear']:.2f}"
    )


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start and /help - show usage instructions."""
    await update.message.reply_text(HELP_TEXT)


async def new_entry_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /new - begin the gross/gas/food conversation."""
    context.user_data.clear()
    await update.message.reply_text("Gross earnings?", reply_markup=ReplyKeyboardRemove())
    return GROSS


async def receive_gross(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for gross earnings."
        )
        return GROSS

    context.user_data["gross"] = value
    await update.message.reply_text("Gas expense?\n(Default = 0)")
    return GAS


async def receive_gas(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text, default=0.0)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for gas expense (or 0)."
        )
        return GAS

    context.user_data["gas"] = value
    await update.message.reply_text("Food expense?\n(Default = 0)")
    return FOOD


async def receive_food(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    value = _parse_amount(update.message.text, default=0.0)
    if value is None:
        await update.message.reply_text(
            "Please enter a valid non-negative number for food expense (or 0)."
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
            f"Could not save to Google Sheets: {exc}"
        )
        context.user_data.clear()
        return ConversationHandler.END

    await update.message.reply_text(_format_entry(_date_display(now), result))
    context.user_data.clear()
    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle /cancel - abort an in-progress /new conversation."""
    context.user_data.clear()
    await update.message.reply_text("Cancelled.", reply_markup=ReplyKeyboardRemove())
    return ConversationHandler.END


async def today_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /today - show today's latest saved entry."""
    now = _now()

    try:
        row = sheet.get_latest_entry_for_date(_date_iso(now))
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(f"Could not read Google Sheets: {exc}")
        return

    if row is None:
        await update.message.reply_text("No entry for today yet. Use /new to add one.")
        return

    values = {
        "gross": float(row[1]),
        "gas": float(row[2]),
        "food": float(row[3]),
        "base": float(row[4]),
        "percent": float(row[5]),
        "clear": float(row[6]),
    }
    await update.message.reply_text(_format_entry(_date_display(now), values))


async def summary_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /summary - show current month totals across all saved entries."""
    now = _now()

    try:
        rows = sheet.get_entries_for_month(now.year, now.month)
    except Exception as exc:  # noqa: BLE001
        await update.message.reply_text(f"Could not read Google Sheets: {exc}")
        return

    if not rows:
        await update.message.reply_text("No entries yet this month.")
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
        f"Summary for {now.strftime('%B %Y')}\n\n"
        f"Gross: {symbol}{totals['gross']:.2f}\n"
        f"Gas: {symbol}{totals['gas']:.2f}\n"
        f"Food: {symbol}{totals['food']:.2f}\n"
        f"15%: {symbol}{totals['percent']:.2f}\n"
        f"Clear: {symbol}{totals['clear']:.2f}\n\n"
        f"Working days: {len(rows)}"
    )
    await update.message.reply_text(message)


def build_new_entry_conversation() -> ConversationHandler:
    """Build the /new conversation handler (gross -> gas -> food -> save)."""
    return ConversationHandler(
        entry_points=[CommandHandler("new", new_entry_start)],
        states={
            GROSS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_gross)],
            GAS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_gas)],
            FOOD: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_food)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )
