"""Append bank teaching figures using the saved, tested simulation records."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from visual_figures import BLUE, GOLD, GREEN, INK, MUTED, OUT, RED, Drawing

ROOT = Path(__file__).resolve().parents[1]
PURPLE = "#75608c"


def row(data: dict[str, Any], case: str, period: int) -> dict[str, Any]:
    return next(r for r in data["paths"][case]["periods"] if r["period"] == period)


def opening(data: dict[str, Any]) -> Drawing:
    bank = data["paths"]["baseline_no_credit"]["opening_bank"]
    d = Drawing(
        "13-bank-opening",
        "Fund the bank from the same town",
        "Workers keep 60 in deposits, owners 40 and firms 80. Customer deposits total 180. Firm buffers supply the bank's 20 equity, ultimately owned by the town's owners. The bank holds the inherited 200 settlement asset. Credit-on and credit-off comparisons start identically.",
        675,
    )
    d.stage(
        "Use existing money",
        "Before any loans, firm cash buffers supply 20 to establish bank capital. The owners ultimately own both the firms and the bank. Firm deposits fall from 100 to 80; this is not new wealth.",
    )
    d.text(24, 43, "Firm buffers: 100 before → 80 after", 27, BLUE)
    d.arrow(280, 67, 280, 112, GOLD)
    d.card(110, 130, 340, "Bank owners' capital", f"{bank['equity']:g} at risk", GOLD)
    d.stage(
        "Count the spendable deposits",
        "Workers have 60, owners 40 and firms 80 in customer accounts. That adds to 180 of spendable deposits. Bank equity is a different kind of claim; it is not another deposit to spend.",
    )
    d.text(24, 323, "Customer deposits after funding", 28)
    d.rect(24, 348, 512, 124)
    d.text(45, 392, "Workers 60 + owners 40", 29)
    d.text(45, 441, "+ firms 80 = deposits 180", 29)
    d.stage(
        "Keep the comparison matched",
        "The bank holds the original settlement asset of 200, backing deposits of 180 and bank equity of 20. Do not add the backing asset to its claims and call that 400 of money. Both compared towns have exactly this opening bank; only lending is switched on or off.",
    )
    d.text(280, 532, "Bank’s base cash: 200", 28, PURPLE, "middle")
    d.text(280, 579, "Deposits 180 + equity 20 = 200", 27, INK, "middle")
    d.text(280, 634, "Same opening with credit on or off.", 26, MUTED, "middle")
    return d


def creation(data: dict[str, Any]) -> Drawing:
    amount = sum(
        c["advanced"] for c in row(data, "equipment_freeze_5_zero_interest", 7)["credit_decisions"]
    )
    d = Drawing(
        "14-bank-money",
        "A loan creates money—and a promise",
        "The bank creates a deposit of 2 and a matching debt of 2. Paying workers transfers that deposit. Repaying principal later removes deposit money and debt together. The loan itself is not GDP.",
        680,
    )
    d.stage(
        "Approve the loan",
        "At the first payroll shortfall, the bank lends 2 across the two equipment firms. Their combined bank balance rises by 2. They also owe 2. This is new deposit money, not income earned from production.",
    )
    d.text(24, 43, "1. The bank approves the loan", 28, PURPLE)
    d.card(24, 68, 246, "Firm deposits", f"+{amount:g}", BLUE)
    d.card(290, 68, 246, "Firm debt", f"+{amount:g}", PURPLE)
    d.stage(
        "Pay the wages",
        "The firms transfer the borrowed deposit money to workers. The money changes hands; the firms still owe the bank. The arrow shows a transfer, not a second loan.",
    )
    d.text(24, 235, "2. The firms pay their workers", 28)
    d.text(45, 295, "Firms", 29, BLUE)
    d.arrow(160, 286, 362, 286, GREEN)
    d.text(400, 295, "Workers", 28, GREEN)
    d.text(280, 347, "Same deposit money. New holder.", 27, MUTED, "middle")
    d.stage(
        "Repay after earning revenue",
        "Later revenue can provide money to repay the bank. For every 2 of principal repaid, deposit money and loan principal both fall by 2. Interest is a separate payment, omitted from this zero-interest illustration.",
    )
    d.text(24, 421, "3. Later, repay the principal", 28, PURPLE)
    d.card(24, 450, 246, "Deposits", f"−{amount:g}", BLUE)
    d.card(290, 450, 246, "Debt", f"−{amount:g}", PURPLE)
    d.text(280, 624, "The loan itself is not new output.", 27, INK, "middle")
    return d


def payroll(data: dict[str, Any]) -> Drawing:
    case = "equipment_freeze_5_zero_interest"
    principal = [row(data, case, t)["closing_bank"]["loans"] for t in (7, 9, 10, 13)]
    d = Drawing(
        "15-bank-bridge",
        "Can the firms reach the next order?",
        "Matched bank experiment. Without credit, wages first go unpaid in round 7. With zero-interest credit, loans total 14 by round 9, fall to 10 when orders return in round 10, and reach zero in round 13. Every wage is paid.",
        740,
    )
    d.stage(
        "Orders pause",
        "Equipment orders pause in rounds 5 through 9. In the matched run without lending, the equipment firms first miss wages in round 7. The bank-enabled firms borrow 2 and make those payments.",
    )
    d.text(24, 42, "Same town. Same opening balances.", 27)
    d.rect(24, 66, 512, 126)
    d.text(44, 105, "No credit: round 7", 29, RED)
    d.text(44, 155, "58 of 60 wages paid; 2 unpaid", 28, RED)
    d.text(24, 236, "With credit: every wage is paid", 28, GREEN)
    d.card(24, 263, 246, "Round 7 debt", f"{principal[0]:g}", PURPLE)
    d.stage(
        "The bridge gets longer",
        "Borrowing continues while orders are absent. By round 9, outstanding principal is 14. This is debt still owed at that date, not extra GDP.",
    )
    d.card(290, 263, 246, "Round 9 debt", f"{principal[1]:g}", PURPLE)
    d.stage(
        "Orders return",
        "Orders return in round 10. The firms begin paying down debt from operating surplus before distributing profits. In this zero-interest version, debt falls to 10 that round.",
    )
    d.text(280, 432, "Orders return in round 10", 28, BLUE, "middle")
    d.arrow(280, 452, 280, 485, BLUE)
    d.card(24, 507, 246, "Round 10 debt", f"{principal[2]:g}", PURPLE)
    d.stage(
        "Finish repaying",
        "By round 13 the debt is gone. This loan bridges a temporary gap successfully. At the separate 1%-per-round rate, repayment also finishes in round 13, with about 0.43 of total interest.",
    )
    d.card(290, 507, 246, "Round 13 debt", f"{principal[3]:g}", PURPLE)
    d.text(280, 687, "Future sales make the bridge work.", 27, INK, "middle")
    return d


def households(data: dict[str, Any]) -> Drawing:
    case = "worker_gap_2_one_percent"
    values = [row(data, case, t)["worker_consumption"] for t in (6, 8, 19)]
    d = Drawing(
        "16-bank-households",
        "Today's bridge has a later bill",
        "Worker households borrow during a temporary wage gap. Purchases are maintained at 60. Once wages return, full debt service of 12 leaves 48 for the next round's purchases. After repayment, purchases return to 60. These are group totals.",
        660,
    )
    d.stage(
        "Borrow during the wage gap",
        "Worker households together borrow 120 across two rounds to maintain purchases of 60 each round. The 120 is total new loans, not peak closing debt: repayment begins before the second borrowing round ends.",
    )
    d.bar(44, "During the gap: purchases", [(values[0], GREEN)], f"{values[0]:g} for goods", 60)
    d.text(24, 174, "Borrowing covers missing paychecks.", 26, MUTED)
    d.stage(
        "Service the debt after wages return",
        "Once wages return to 60, up to 12 of current income goes toward principal and interest. During full repayment rounds, only 48 is left for the next round's purchases. Purple is debt service, not household goods.",
    )
    d.bar(
        257,
        "During full repayment: wage 60",
        [(values[1], GREEN), (60 - values[1], PURPLE)],
        "48 goods + 12 debt service",
        60,
    )
    d.text(24, 387, "The missing slice pays the bank.", 26, MUTED)
    d.stage(
        "Return to the old spending level",
        "At 1% interest per round, all debt is repaid in round 17. Purchases return to 60 in round 19. Total interest over the loan is about 6.35. The bank smooths spending; it does not give the households a permanent extra income.",
    )
    d.bar(469, "After repayment: purchases", [(values[2], GREEN)], f"{values[2]:g} for goods", 60)
    d.text(24, 610, "Same people. Different dates.", 27, INK)
    return d


def loss(data: dict[str, Any]) -> Drawing:
    summary = data["summaries"]["worker_permanent_loss_forecast_error_limit_20"]
    lost = summary["total_principal_forgiven"]
    remaining = summary["minimum_bank_equity"]
    d = Drawing(
        "17-bank-loss",
        "What if the expected income never arrives?",
        "The bank mistakenly expects wages to return. It lends 20, which borrowers spend. At maturity, unpayable principal is forgiven. The 20 loss consumes the bank's 20 equity. Customer deposits are not erased. The experiment stops at zero bank capital.",
        660,
    )
    d.stage(
        "Make a mistaken forecast",
        "The bank expects wages to recover and lends 20. Workers buy goods; the deposit money moves to sellers. This is a forecast error, not a bank knowingly lending to a borrower with no repayment income.",
    )
    d.text(24, 43, "The bank expects income to return.", 27)
    d.card(24, 70, 246, "Bank lends", f"{lost:g}", PURPLE)
    d.card(290, 70, 246, "Workers spend", f"{lost:g}", GREEN)
    d.stage(
        "Recognize the failed promise",
        "Wages never return. At maturity, the model explicitly forgives the unpayable 20 principal with zero recovery. The bank loses its loan asset and workers no longer owe that principal. This is not repayment.",
    )
    d.text(280, 259, "Income never returns.", 30, RED, "middle")
    d.arrow(280, 286, 280, 330, RED)
    d.text(280, 381, "Unpayable loan is forgiven.", 29, RED, "middle")
    d.stage(
        "Let the bank owners bear the loss",
        "The 20 loss absorbs the bank's 20 equity, leaving zero. Forgiveness does not erase customer deposits; the original receipts may have changed hands again. The simulation stops here; it supplies no recapitalization, bailout or deposit haircut.",
    )
    d.card(24, 424, 246, "Bank capital", "20 → 0", GOLD)
    d.card(290, 424, 246, "Capital left", f"{remaining:g}", RED)
    d.text(280, 598, "Customer deposits are not erased.", 28, INK, "middle")
    return d


def main() -> None:
    data = json.loads((ROOT / "outputs/banking/results.json").read_text())
    manifest = OUT / "manifest.json"
    records = [r for r in json.loads(manifest.read_text()) if int(r["id"][:2]) <= 12]
    records.extend(build(data).finish() for build in (opening, creation, payroll, households, loss))
    manifest.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print("Built five bank diagrams from saved results.")


if __name__ == "__main__":
    main()
