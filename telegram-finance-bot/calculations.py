"""Pure math functions for computing a daily earnings breakdown.

Kept separate from Telegram and Google Sheets code so the formulas can be
tested and reasoned about on their own.
"""

from __future__ import annotations

# Percentage taken off the base amount (e.g. taxes/fees withheld per entry)
PERCENT_RATE: float = 0.15


def round_money(value: float) -> float:
    """Round a monetary value to two decimal places."""
    return round(value, 2)


def calculate_entry(gross: float, gas: float, food: float) -> dict[str, float]:
    """Compute Base, 15% payment, and Clear amount for one daily entry.

    Base = Gross - Gas
    PercentPayment = Base * 15%
    Clear = Base - PercentPayment - Food
    """
    base = round_money(gross - gas)
    percent_payment = round_money(base * PERCENT_RATE)
    clear = round_money(base - percent_payment - food)

    return {
        "gross": round_money(gross),
        "gas": round_money(gas),
        "food": round_money(food),
        "base": base,
        "percent": percent_payment,
        "clear": clear,
    }
