"""Export the separate, controlled entry/acquisition payment experiment."""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, replace
from hashlib import sha256
from math import fsum
from pathlib import Path

from toy_economy.adoption_structure import StructureParameters, StructureResult, simulate_structure

ROOT = Path(__file__).resolve().parents[1]


def structure_cases() -> dict[str, StructureParameters]:
    base = StructureParameters()
    entry = replace(base, mode="funded_entry")
    return {
        "control": base,
        "acquisition_no_synergy": replace(base, mode="acquisition_no_synergy"),
        "acquisition_then_automation": replace(base, mode="acquisition_then_automation"),
        "automation_only": replace(base, mode="automation_only"),
        "acquisition_then_full_automation": replace(
            base, mode="acquisition_then_automation", automation_fraction=1
        ),
        "full_automation_only": replace(base, mode="automation_only", automation_fraction=1),
        "funded_entry": entry,
        "entry_cheaper_goods": replace(entry, entry_price=0.7),
        "entry_payroll_stress": replace(entry, entry_price=1.1, periods=50),
        "entry_no_wear": replace(entry, entry_depreciation_rate=0),
        "entry_ai_unavailable": replace(entry, ai_service_capacity=0),
        "entry_cash_refused": replace(entry, entry_equipment=26),
        "entry_capacity_refused": replace(entry, entry_equipment=21),
        "acquisition_cash_refused": replace(
            base, mode="acquisition_no_synergy", acquisition_price=26
        ),
    }


def summary(result: StructureResult) -> dict[str, object]:
    last = result.periods[-1]
    return {
        "recorded_periods": len(result.periods),
        "requested_periods": result.parameters.periods,
        "completed_horizon": len(result.periods) == result.parameters.periods
        and result.stop_reason is None,
        "stop_reason": result.stop_reason,
        "last_recorded_period": last.period,
        "last_nominal_gdp": last.nominal_gdp,
        "last_real_gdp": last.real_gdp,
        "last_net_domestic_product": last.net_domestic_product,
        "last_real_consumption": last.real_consumption,
        "last_worker_consumption": last.worker_consumption,
        "last_owner_consumption": last.owner_consumption,
        "last_human_hours": last.actual_human_hours,
        "last_entry_capital": last.closing_entry_capital,
        "last_wages_paid": last.wages_paid,
        "last_wage_arrears": last.wage_arrears,
        "minimum_nominal_gdp": min(row.nominal_gdp for row in result.periods),
        "peak_nominal_gdp": max(row.nominal_gdp for row in result.periods),
        "cumulative_new_investment_through_stop": fsum(row.investment for row in result.periods),
        "cumulative_acquisition_payments": fsum(
            row.acquisition_payment_excluded_from_gdp for row in result.periods
        ),
        "maximum_money_error": max(
            abs(fsum(row.closing_balances.values()) - result.money_stock) for row in result.periods
        ),
        "maximum_value_added_error": max(
            abs(fsum(f.value_added for f in row.firms) - row.nominal_gdp) for row in result.periods
        ),
    }


def build_structure_results() -> dict[str, object]:
    paths = {}
    for name, p in structure_cases().items():
        result = simulate_structure(p)
        paths[name] = {"summary": summary(result), **asdict(result)}
    sensitivities = []
    for price in (0.7, 1, 1.1):
        for depreciation in (0, 0.1):
            for capacity in (0, 1, 10):
                p = StructureParameters(
                    mode="funded_entry",
                    periods=50,
                    entry_price=price,
                    entry_depreciation_rate=depreciation,
                    ai_service_capacity=capacity,
                )
                result = simulate_structure(p)
                sensitivities.append({"parameters": asdict(p), "summary": summary(result)})
    sources = ("src/toy_economy/adoption_structure.py", "scripts/run_adoption_structure.py")
    return {
        "schema_version": 1,
        "experiment": "Separate controlled entry/acquisition accounting; not an integrated strategic competition model.",
        "opening_money": 200,
        "fixed_household_budgets": {"workers": 60, "owners": 20},
        "prices": {"incumbents": 1, "entry_default": 1},
        "assumptions": [
            "Protected incumbent wages60; actual work may fall. Customer budgets are fixed subject to cash.",
            "Existing equity purchase is a financial transfer; only produced equipment enters investment GDP.",
            "Entrant capital is delivered after production and becomes operational next round.",
            "Provider infrastructure is inherited; finite AI capacity, no separately modeled resource costs.",
            "Entrant replacement is funded from existing provider cash before current sales; no new money or credit.",
            "All final dividends reach one pooled owner household; acquired subsidiary dividends are not provider value added.",
            "Operating losses use incumbent buffers; no automatic cross-firm rescue or modeled exit after arrears.",
        ],
        "source_sha256": {name: sha256((ROOT / name).read_bytes()).hexdigest() for name in sources},
        "teaching_rows": {
            "purchase_existing_shop": {"scenario": "acquisition_no_synergy", "period": 5},
            "buy_new_equipment": {"scenario": "funded_entry", "period": 5},
            "entrant_first_sales": {"scenario": "funded_entry", "period": 6},
            "subsequent_automation": {"scenario": "acquisition_then_automation", "period": 10},
            "technology_without_acquisition": {"scenario": "automation_only", "period": 10},
            "protected_payroll_failure": {"scenario": "entry_payroll_stress", "period": 31},
        },
        "scenarios": paths,
        "sensitivities": sensitivities,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "outputs/adoption/structure.json")
    args = parser.parse_args()
    data = build_structure_results()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")
    print(f"Wrote structure paths and sensitivity summaries to {args.output}")


if __name__ == "__main__":
    main()
