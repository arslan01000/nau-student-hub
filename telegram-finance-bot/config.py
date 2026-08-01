"""Configuration for the personal finance Telegram bot.

Only the values below need to change. See README.md for setup instructions.
"""

# Telegram bot token from @BotFather
BOT_TOKEN: str = "PUT_YOUR_TELEGRAM_BOT_TOKEN_HERE"

# The ID of your Google Sheet (found in its URL, between /d/ and /edit)
GOOGLE_SHEET_ID: str = "PUT_YOUR_GOOGLE_SHEET_ID_HERE"

# Path to the Google service account JSON key file
GOOGLE_SERVICE_ACCOUNT_JSON: str = "service_account.json"

# IANA timezone name used for dating entries (e.g. "America/Phoenix")
TIMEZONE: str = "America/Phoenix"

# Symbol prefixed to all displayed money amounts
CURRENCY_SYMBOL: str = "$"
