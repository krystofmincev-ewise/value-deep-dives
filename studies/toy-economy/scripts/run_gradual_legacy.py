"""Reproduce the original ten-firm model's gradual employment comparisons."""

import json
from pathlib import Path

from toy_economy.dynamics import DynamicsParameters, simulate
from toy_economy.shocks import ParameterShock


def main() -> None:
    schedules = {
        "unchanged": (),
        "sudden": (ParameterShock(5, employed_workers=0),),
        "gradual_fast": tuple(
            ParameterShock(5 + 2 * i, employed_workers=8 - 2 * i) for i in range(5)
        ),
        "gradual_slow": tuple(
            ParameterShock(5 + 8 * i, employed_workers=8 - 2 * i) for i in range(5)
        ),
    }
    rows = []
    for rule in ("fixed_utilization", "replacement_adjustment"):
        for name, schedule in schedules.items():
            run = simulate(DynamicsParameters(periods=100, investment_rule=rule), shocks=schedule)
            series = [
                {
                    "period": r.period,
                    "workers": r.active_policy.employed_workers,
                    "gdp": r.production.nominal_gdp,
                    "consumption": r.production.consumption,
                    "investment": r.production.investment,
                    "wages": r.wages_paid,
                    "insolvency": r.insolvency,
                }
                for r in run.periods
            ]
            rows.append(
                {
                    "schedule": name,
                    "investment_rule": rule,
                    "series": series,
                    "summary": {
                        "last_gdp": series[-1]["gdp"],
                        "minimum_gdp": min(r["gdp"] for r in series),
                        "cumulative_gdp": sum(r["gdp"] for r in series),
                        "periods": len(series),
                    },
                }
            )
    destination = Path(__file__).resolve().parents[1] / "outputs/adoption/legacy-gradual.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(rows, indent=2) + "\n")


if __name__ == "__main__":
    main()
