# Telegram Finance Bot

A tiny, single-user Telegram bot that tracks daily work earnings (gross,
gas, food) and stores every entry as a row in a Google Sheet. No database,
no web UI - just Python and a spreadsheet.

## How it works

- A reply-keyboard menu (➕ New Entry, 📅 Today, 📊 This Month, ✏️ Edit
  Today, 📄 Export CSV) appears after `/start` and after every completed
  action, so you rarely need to type a command.
- `/new` (or ➕ New Entry) walks you through entering gross earnings, gas
  expense, and food expense for the day. Leaving Gas or Food blank counts
  as $0. If today already has an entry, the bot asks whether to edit it or
  add another instead of silently creating a duplicate row.
- The bot calculates:
  - `Base = Gross - Gas`
  - `15% = Base * 0.15`
  - `Clear = Base - 15% - Food`
- The completed entry is appended as a new row in your Google Sheet.
- `/today` shows today's latest entry, `/summary` shows totals for the
  current month, `/edit` lets you correct a value on today's entry
  (recalculating and overwriting that row in place, never a new one), and
  `/export` sends every saved entry as a CSV file.

## Project structure

```
main.py           # entry point, starts the bot
config.py         # the only file you need to edit
sheet.py          # Google Sheets read/write
handlers.py       # Telegram commands, menu, and the /new + /edit conversations
calculations.py   # Base / 15% / Clear math
requirements.txt  # dependencies
```

## Setup

### 1. Create a Telegram bot with BotFather

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow the prompts (choose a name and a username).
3. BotFather will reply with a **bot token** - copy it.

### 2. Get your bot token

You already have it from step 1. You'll paste it into `config.py` in step 8.

### 3. Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet (e.g. name it "Finance Tracker").
2. Copy the **Sheet ID** from its URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit`

The bot will create the header row (`Date, Gross, Gas, Food, Base, 15%,
Clear`) automatically the first time it runs, so you don't need to type
anything into the sheet yourself.

### 4. Create a Google Cloud Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or reuse an existing one).
3. Go to **IAM & Admin > Service Accounts > Create Service Account**.
4. Give it any name (e.g. "finance-bot"). You don't need to grant it any
   project-level roles - just create it.
5. Open the new service account, go to the **Keys** tab, click **Add Key >
   Create new key**, choose **JSON**, and download it.
6. Rename the downloaded file to `service_account.json` and place it in
   this project folder (next to `main.py`). It is already excluded from git
   via `.gitignore` - never commit it.

### 5. Enable the Google Sheets API

1. In the same Google Cloud project, go to **APIs & Services > Library**.
2. Search for **Google Sheets API** and click **Enable**.

### 6. Share the sheet with the service account

1. Open the `service_account.json` file and copy the `client_email` value
   (looks like `finance-bot@your-project.iam.gserviceaccount.com`).
2. Open your Google Sheet, click **Share**, paste that email address, give
   it **Editor** access, and send the invite.

### 7. Install requirements

Requires Python 3.12.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 8. Configure

Copy the template and fill in your real values. `config.py` is git-ignored
so your token and Sheet ID never get committed:

```bash
cp config.example.py config.py
```

Open `config.py` and fill in:

```python
BOT_TOKEN = "123456:ABC-your-real-token"
GOOGLE_SHEET_ID = "your-sheet-id-from-step-3"
GOOGLE_SERVICE_ACCOUNT_JSON = "service_account.json"
TIMEZONE = "America/Phoenix"   # any IANA timezone name
CURRENCY_SYMBOL = "$"
```

### 9. Run the bot

```bash
python main.py
```

Open Telegram, find your bot, and send `/start`.

## Commands

- `/start` - show help and the main menu
- `/new` - add a new daily entry (gross -> gas -> food); warns instead of
  duplicating if today already has one
- `/edit` - change Gross, Gas, or Food on today's entry (updates the
  existing row, does not create a new one)
- `/cancel` - cancel an in-progress `/new` or `/edit` conversation
- `/today` - show today's latest entry
- `/summary` - show totals for the current month (gross, gas, food, 15%,
  clear, working days)
- `/export` - send a CSV file of every saved entry

Every one of these is also available as a button on the reply keyboard
that appears after `/start` - no new setup or dependencies are needed for
this, it's all built from the existing `python-telegram-bot` and Python's
built-in `csv` module.

## Notes

- The bot is designed for a single user; anyone who knows the bot's
  username can technically message it and write to your sheet, since there
  is no login step. If you want to restrict it, add a check in
  `handlers.py` comparing `update.effective_user.id` to your own Telegram
  user ID.
- All money values are rounded to two decimal places.
