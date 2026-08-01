"""Google Sheets storage layer for the finance bot.

All reads and writes to the spreadsheet go through this module so the rest
of the bot never has to know about gspread or the Google API directly.
"""

from __future__ import annotations

import gspread
from google.oauth2.service_account import Credentials

import config

# Sheets API scope needed to read and append rows
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Column order used both for the header row and for every appended entry
HEADERS = ["Date", "Gross", "Gas", "Food", "Base", "15%", "Clear"]


def _get_worksheet() -> gspread.Worksheet:
    """Authenticate with Google and return the first worksheet.

    Writes the header row if the sheet is empty or the header doesn't match,
    so a brand-new spreadsheet works with no manual setup.
    """
    credentials = Credentials.from_service_account_file(
        config.GOOGLE_SERVICE_ACCOUNT_JSON, scopes=SCOPES
    )
    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(config.GOOGLE_SHEET_ID)
    worksheet = spreadsheet.sheet1

    if worksheet.row_values(1) != HEADERS:
        worksheet.update("A1", [HEADERS])

    return worksheet


def append_entry(date_iso: str, values: dict[str, float]) -> None:
    """Append one completed entry as a new row.

    `date_iso` is stored as YYYY-MM-DD so rows sort naturally and can be
    matched exactly by /today and /summary.
    """
    worksheet = _get_worksheet()
    worksheet.append_row(
        [
            date_iso,
            values["gross"],
            values["gas"],
            values["food"],
            values["base"],
            values["percent"],
            values["clear"],
        ]
    )


def get_latest_entry_for_date(date_iso: str) -> list[str] | None:
    """Return the most recent row matching the given ISO date, or None."""
    worksheet = _get_worksheet()
    rows = worksheet.get_all_values()[1:]  # skip header row
    matches = [row for row in rows if row and row[0] == date_iso]
    return matches[-1] if matches else None


def get_entries_for_month(year: int, month: int) -> list[list[str]]:
    """Return all rows whose Date falls within the given year and month."""
    worksheet = _get_worksheet()
    rows = worksheet.get_all_values()[1:]  # skip header row
    prefix = f"{year:04d}-{month:02d}"
    return [row for row in rows if row and row[0].startswith(prefix)]
