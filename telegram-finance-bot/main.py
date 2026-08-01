"""Entry point: builds the Telegram application and starts polling.

Run with: python main.py
"""

from __future__ import annotations

import logging

from telegram.ext import Application, CommandHandler, MessageHandler

import config
from handlers import (
    BTN_EXPORT,
    BTN_SUMMARY,
    BTN_TODAY,
    _button_filter,
    build_entry_conversation,
    export_command,
    start_command,
    summary_command,
    today_command,
)

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


def main() -> None:
    application = Application.builder().token(config.BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", start_command))
    application.add_handler(build_entry_conversation())

    application.add_handler(CommandHandler("today", today_command))
    application.add_handler(MessageHandler(_button_filter(BTN_TODAY), today_command))

    application.add_handler(CommandHandler("summary", summary_command))
    application.add_handler(MessageHandler(_button_filter(BTN_SUMMARY), summary_command))

    application.add_handler(CommandHandler("export", export_command))
    application.add_handler(MessageHandler(_button_filter(BTN_EXPORT), export_command))

    application.run_polling()


if __name__ == "__main__":
    main()
