"""Render saved bank records; the browser contains no economic simulator."""

from __future__ import annotations

import html
import json
from math import fsum
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CASE_TEXT = {
    "equipment_freeze_5_one_percent": (
        "Temporary equipment pause · credit at 1%",
        "Equipment orders pause in rounds 5–9 and return in round 10. Firms keep their payroll commitments. Loans cover wage shortfalls; later operating surplus services the debt before dividends.",
    ),
    "equipment_freeze_5_no_credit": (
        "Same equipment pause · no credit",
        "The bank and starting balances are identical, but lending is disabled. The run stops at the first unpaid wage; no later bankruptcy or recovery is invented.",
    ),
    "equipment_freeze_5_zero_interest": (
        "Same equipment pause · zero-interest credit",
        "The same finite credit rules, with no interest. Principal must still be repaid.",
    ),
    "equipment_freeze_10_finite_credit": (
        "Longer equipment pause · finite credit",
        "Equipment orders are scheduled to return in round 15. The credit limits remain finite. Check whether the firms can reach that restart without missed payroll.",
    ),
    "equipment_permanent_optimistic_forecast": (
        "Equipment orders never return · forecast was wrong",
        "The bank initially expects orders to return in round 10. They do not. The lending window is not extended silently, and later obligations are not assumed away.",
    ),
    "worker_gap_2_no_credit": (
        "Temporary wage gap · no credit",
        "Wages stop in rounds 5–6 and return in round 7. Purchases follow earlier income, so the spending gap comes later than the first missing wage.",
    ),
    "worker_gap_2_one_percent": (
        "Same wage gap · credit at 1%",
        "Loans aim to maintain worker purchases of 60 during the gap. Once income returns, up to 20% of current income services debt, leaving less for subsequent purchases.",
    ),
    "worker_gap_2_zero_interest": (
        "Same wage gap · zero-interest credit",
        "Removing interest isolates the timing effect. Compare the temporary spending floor with consumption during repayment, not just the first few rounds.",
    ),
    "worker_gap_2_partial_bridge_limit_20": (
        "Same wage gap · smaller 20 credit limit",
        "The smaller loan can cover only part of the gap. Income does return, allowing repayment. Compare with the mistaken-forecast case using the same limit.",
    ),
    "worker_income_restored_by_ownership": (
        "Income returns through ownership · no wages",
        "Wages stay at zero. From round 7, workers instead receive 60% of firm dividends. This changes their source of repayment income; it is not credit creating permanent income by itself.",
    ),
    "worker_permanent_loss_prudent_refusal": (
        "Wages never return · prudent refusal",
        "The bank has no credible forecast of future worker income and refuses unsecured lending. This run keeps equipment purchases at 20, so it tests the earlier smaller-economy ending.",
    ),
    "worker_permanent_loss_forecast_error_limit_20": (
        "Recovery forecast fails · 20 loan limit",
        "The bank expects wages to return, but they never do. At maturity, unpayable debt is forgiven with zero recovery. The loss falls on bank capital; the deposit total is not erased.",
    ),
    "worker_permanent_loss_forecast_error_limit_120": (
        "Recovery forecast fails · 120 loan limit",
        "The same mistaken recovery forecast with larger exposure. If the bank becomes insolvent, the run stops with remaining obligations visible. There is no hidden bailout or deposit guarantee.",
    ),
    "worker_gap_capacity_constraint": (
        "Credit with a physical production limit",
        "Lower productivity limits what the town can make. Prices are fixed, so excess orders are rationed. A larger account balance cannot manufacture missing capacity.",
    ),
    "worker_gap_capacity_constraint_no_credit": (
        "Same physical limit · no credit",
        "The same lower productivity and initial accounts, with lending disabled. Compare the production ceiling with the credit-enabled run.",
    ),
    "baseline_no_credit": (
        "No shock · lending disabled",
        "The starting purchases continue: workers 60, owners 20 and new equipment 20.",
    ),
    "baseline_credit_unused": (
        "No shock · credit available but unused",
        "Making a bank available does not force anyone to borrow. Without a financing gap, credit is unused.",
    ),
}


def compact_row(row: dict[str, Any]) -> dict[str, Any]:
    """Keep auditable values; only sum recorded financial flows for display."""
    services = row["debt_service"]
    return {
        "period": row["period"],
        "gdp": row["production"]["nominal_gdp"],
        "worker_consumption": row["worker_consumption"],
        "owner_consumption": row["owner_consumption"],
        "investment": row["production"]["investment"],
        "opening_deposits": row["opening_bank"]["deposits"],
        "deposits": row["closing_bank"]["deposits"],
        "principal": row["closing_bank"]["loans"],
        "equity": row["closing_bank"]["equity"],
        "unpaid_interest": row["unpaid_interest"],
        "total_debt": row["total_debt_owed"],
        "new_credit": fsum(d["advanced"] for d in row["credit_decisions"]),
        "principal_repaid": fsum(d["principal_paid"] for d in services),
        "interest_paid": fsum(d["interest_paid"] for d in services),
        "forgiven": fsum(d["principal_forgiven"] for d in services),
        "bank_dividend": row["bank_profit_distribution"],
        "wages_paid": row["wages_paid"],
        "wage_arrears": row["wage_arrears"],
        "opening_balances": row["opening_balances"],
        "closing_balances": row["closing_balances"],
        "closing_bank": row["closing_bank"],
        "loans": row["loans"],
        "decisions": row["credit_decisions"],
    }


def main() -> None:
    source = json.loads((ROOT / "outputs/banking/results.json").read_text())
    cases = {}
    # Put the clearest matched comparison first; retain every additional saved case.
    ordering = list(CASE_TEXT) + [key for key in source["paths"] if key not in CASE_TEXT]
    for name in ordering:
        if name not in source["paths"]:
            continue
        path = source["paths"][name]
        label, description = CASE_TEXT.get(
            name, (name.replace("_", " "), "See the declared assumptions below.")
        )
        cases[name] = {
            "label": label,
            "description": description,
            "rows": [compact_row(row) for row in path["periods"]],
            "summary": source["summaries"][name],
            "inputs": {"parameters": path["parameters"], "shocks": path["shocks"]},
        }
    data = json.dumps({"cases": cases}, separators=(",", ":"), allow_nan=False).replace(
        "<", "\\u003c"
    )
    options = "".join(
        f'<option value="{html.escape(name)}">{html.escape(case["label"])}</option>'
        for name, case in cases.items()
    )
    template = (ROOT / "site/banking.template.html").read_text()
    (ROOT / "site/banking.html").write_text(
        template.replace("{{CASE_OPTIONS}}", options).replace("{{BANK_DATA}}", data)
    )
    print(f"Built the bank explorer with {len(cases)} saved experiments.")


if __name__ == "__main__":
    main()
