"""Named, uncalibrated experiments and reproducible parameter sweeps."""

from dataclasses import asdict, replace
from typing import Any

from .closure import ClosureParameters, investment_for_target, solve_equilibrium
from .dynamics import DynamicsParameters, simulate
from .growth import GrowthParameters, automated_growth
from .production import allocate_production


def equilibrium_cases() -> dict[str, ClosureParameters]:
    baseline = ClosureParameters()
    cases = {
        f"layoffs_{lost}": replace(baseline, employed_workers=10 - lost)
        for lost in (0, 1, 3, 5, 10)
    }
    cases.update(
        {
            "worker_saving_baseline": replace(
                baseline, worker_spending_propensity=0.9, investment=26
            ),
            "worker_saving_zero_jobs": replace(
                baseline, worker_spending_propensity=0.9, investment=26, employed_workers=0
            ),
            "capacity_doubles": replace(baseline, real_capacity=400),
            "half_prices": replace(baseline, price=0.5),
            "prices_up_25_percent": replace(baseline, price=1.25),
            "owners_spend_80_percent": replace(baseline, owner_spending_propensity=0.8),
            "owners_spend_20_percent": replace(baseline, owner_spending_propensity=0.2),
            "zero_jobs_investment_50": replace(baseline, employed_workers=0, investment=50),
            "zero_jobs_transfer_60": replace(
                baseline, employed_workers=0, owner_to_worker_transfer=60
            ),
            "zero_jobs_no_investment": replace(baseline, employed_workers=0, investment=0),
            "all_income_spent_no_investment": replace(
                baseline, owner_spending_propensity=1, investment=0
            ),
            "binding_capacity": replace(baseline, real_capacity=80),
            "unfunded_payroll": replace(
                baseline,
                investment=0,
                owner_spending_propensity=0.5,
                worker_spending_propensity=0.9,
            ),
        }
    )
    return cases


def dynamics_cases() -> dict[str, DynamicsParameters]:
    baseline = DynamicsParameters(periods=25)
    return {
        "baseline": baseline,
        **{
            f"layoffs_{lost}": replace(baseline, employed_workers=10 - lost)
            for lost in (1, 3, 5, 10)
        },
        "saving_not_recycled": replace(baseline, owner_equity_financing=False),
        "saving_not_recycled_no_depreciation": replace(
            baseline, owner_equity_financing=False, depreciation_rate=0
        ),
        "zero_jobs_no_investment": replace(baseline, employed_workers=0, autonomous_investment=0),
        "zero_jobs_owner_spends_all": replace(
            baseline,
            employed_workers=0,
            autonomous_investment=0,
            owner_spending_propensity=1,
            depreciation_rate=0,
        ),
        "zero_jobs_60_percent_worker_ownership": replace(
            baseline, employed_workers=0, worker_ownership_share=0.6
        ),
        "zero_jobs_transfer_60": replace(
            baseline, employed_workers=0, owner_to_worker_transfer=60, initial_owner_cash=100
        ),
        "zero_jobs_owner_autonomous_spending_10": replace(
            baseline, employed_workers=0, autonomous_investment=0, owner_autonomous_consumption=10
        ),
        "layoffs_5_investment_reacts": replace(
            baseline, employed_workers=5, utilization_investment_sensitivity=0.2
        ),
        "no_initial_money": replace(
            baseline, initial_worker_cash=0, initial_owner_cash=0, initial_firm_cash=0
        ),
    }


def build_results() -> dict[str, Any]:
    """Serialize assumptions and exact outputs together; never hide failures."""
    baseline = ClosureParameters()
    static = {
        name: {"parameters": asdict(p), "result": asdict(solve_equilibrium(p))}
        for name, p in equilibrium_cases().items()
    }
    dynamics = {name: asdict(simulate(p)) for name, p in dynamics_cases().items()}
    ledger_examples = {}
    for name, simulation in dynamics.items():
        for row in simulation["periods"]:
            if row["period"] == 0 and name in ("baseline", "layoffs_10"):
                ledger_examples[name] = row["payments"]
            row.pop("payments")
            row["production"].pop("firms")
            row["production"].pop("intermediate_sales")
    growth = {
        name: {"parameters": asdict(p), "periods": [asdict(row) for row in automated_growth(p)]}
        for name, p in {
            "owner_consumption_and_growth": GrowthParameters(),
            "replacement_only": GrowthParameters(investment_share=0.2),
            "no_replacement": GrowthParameters(investment_share=0),
            "machines_only": GrowthParameters(investment_share=1),
        }.items()
    }
    thresholds = [
        {
            "layoffs": lost,
            "investment_for_gdp_100": investment_for_target(
                100, replace(baseline, employed_workers=10 - lost)
            ),
        }
        for lost in range(11)
    ]
    return {
        "schema_version": 1,
        "status": "uncalibrated_educational_experiment",
        "source_cutoff": "2026-10-10",
        "units": "invented money and base-price output units; periods are not calendar years",
        "equilibrium": static,
        "investment_thresholds": thresholds,
        "baseline_supply_chain": asdict(allocate_production(80, 20, wage_bill=60)),
        "dynamics": dynamics,
        "ledger_examples": ledger_examples,
        "automated_growth": growth,
    }


def explorer_grid() -> dict[str, Any]:
    """Python is the sole economic engine; the browser selects solved records."""
    rows: dict[str, Any] = {}
    for lost in range(11):
        for price in (0.5, 0.75, 1.0, 1.25):
            for investment in (0, 10, 20, 30, 40, 50):
                for owner_spending in (0.2, 0.5, 0.8, 1.0):
                    for transfer in (0, 30, 60):
                        p = ClosureParameters(
                            employed_workers=10 - lost,
                            price=price,
                            investment=investment,
                            owner_spending_propensity=owner_spending,
                            owner_to_worker_transfer=transfer,
                        )
                        key = f"{lost}|{price:g}|{investment}|{owner_spending:g}|{transfer}"
                        rows[key] = asdict(solve_equilibrium(p))
    return {
        "fixed": {"nominal_wage": 6, "worker_spending_propensity": 1, "real_capacity": 200},
        "rows": rows,
    }
