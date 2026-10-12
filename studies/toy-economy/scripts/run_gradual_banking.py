"""Gradual income loss and restoration in the independently audited bank town."""

import json
from dataclasses import replace
from pathlib import Path

from toy_economy.bank_cases import summarize_bank_run
from toy_economy.bank_dynamics import BankParameters, simulate_bank
from toy_economy.dynamics import DynamicsParameters
from toy_economy.shocks import ParameterShock


def main() -> None:
    base = BankParameters(
        economy=DynamicsParameters(periods=100, initial_firm_cash=80),
        payroll_credit_limit_per_firm=0,
        household_consumption_floor=60,
        credit_end_period=15,
        expected_income_return_period=15,
        household_credit_limit=120,
    )
    ramp = tuple(ParameterShock(5 + 2 * i, employed_workers=8 - 2 * i) for i in range(5))
    scenarios = {
        "permanent_gradual_no_credit": (replace(base, credit_enabled=False), ramp),
        "permanent_gradual_prudent_bank": (replace(base, expected_income_return_period=None), ramp),
        "permanent_gradual_mistaken_forecast": (base, ramp),
        "gradual_then_wages_return_no_credit": (
            replace(base, credit_enabled=False),
            (*ramp, ParameterShock(15, employed_workers=10)),
        ),
        "gradual_then_wages_return_credit": (
            base,
            (*ramp, ParameterShock(15, employed_workers=10)),
        ),
        "gradual_then_ownership_income": (
            base,
            (*ramp, ParameterShock(15, worker_ownership_share=0.6)),
        ),
    }
    results = []
    for name, (parameters, schedule) in scenarios.items():
        run = simulate_bank(parameters, shocks=schedule)
        results.append(
            {
                "summary": summarize_bank_run(name, run),
                "periods": [
                    {
                        "period": r.economy.period,
                        "workers": r.economy.active_policy.employed_workers,
                        "gdp": r.economy.production.nominal_gdp,
                        "worker_consumption": r.worker_consumption,
                        "debt": r.closing_bank.loans,
                        "bank_equity": r.closing_bank.equity,
                    }
                    for r in run.periods
                ],
            }
        )
    path = Path(__file__).resolve().parents[1] / "outputs/adoption/legacy-gradual-banking.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(results, indent=2) + "\n")


if __name__ == "__main__":
    main()
