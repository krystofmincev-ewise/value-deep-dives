"""Generate named paths, a declared sensitivity grid and paired timing experiments."""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import asdict, replace
from pathlib import Path
from time import perf_counter
from typing import Any

from toy_economy.adoption import AdoptionParameters, AdoptionShock, simulate_adoption
from toy_economy.adoption_experiments import (
    distribution,
    ramp_schedule,
    random_availability,
    summarize,
)

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "outputs/adoption"
Case = tuple[str, AdoptionParameters, tuple[AdoptionShock, ...]]


def cases() -> dict[str, Case]:
    base = AdoptionParameters(periods=80)
    gentle = ramp_schedule()
    full = ramp_schedule(stages=(0.2, 0.4, 0.6, 0.8, 1.0))
    one = ramp_schedule(firms=("consumer_a",))
    return {
        "baseline": ("No AI adoption", base, ()),
        "half_time_smooth": (
            "Half the paid time, shared evenly every round",
            replace(base, pay_contract="hourly_pay", capacity_use="take_time"),
            ramp_schedule(stages=(0.5,)),
        ),
        "half_time_rotating": (
            "Half the paid time, rotating who is on duty",
            replace(
                base,
                pay_contract="hourly_pay",
                capacity_use="take_time",
                worker_shift_pattern="rotating",
            ),
            ramp_schedule(stages=(0.5,)),
        ),
        "myopic_layoff_smallstep": (
            "Whole jobs; a cautious 10% adoption step",
            replace(
                base,
                adoption_rule="bounded_myopic",
                adoption_step=0.1,
                pay_contract="layoffs",
                capacity_use="redeploy",
            ),
            ramp_schedule(stages=(0.4,)),
        ),
        "myopic_layoff_largerstep": (
            "Whole jobs; a 20% adoption step",
            replace(
                base,
                adoption_rule="bounded_myopic",
                adoption_step=0.2,
                pay_contract="layoffs",
                capacity_use="redeploy",
            ),
            ramp_schedule(stages=(0.4,)),
        ),
        "myopic_protected": (
            "Firms choose whether to adopt; protected pay",
            replace(base, adoption_rule="bounded_myopic"),
            gentle,
        ),
        "myopic_hourly": (
            "Firms choose whether to adopt; hourly pay",
            replace(
                base,
                adoption_rule="bounded_myopic",
                pay_contract="hourly_pay",
                capacity_use="take_time",
            ),
            gentle,
        ),
        "myopic_free_ai": (
            "Firms choose whether to adopt; free AI and protected pay",
            replace(base, adoption_rule="bounded_myopic", ai_fee_per_task_hour=0),
            gentle,
        ),
        "myopic_expensive_ai": (
            "Firms choose whether to adopt; expensive AI",
            replace(
                base,
                adoption_rule="bounded_myopic",
                pay_contract="hourly_pay",
                capacity_use="take_time",
                ai_fee_per_task_hour=9,
            ),
            gentle,
        ),
        "protected_redeploy": ("Both adopt gradually; protect pay, expand capacity", base, gentle),
        "protected_time": (
            "Both adopt; same pay, shorter contracted hours",
            replace(base, capacity_use="take_time"),
            gentle,
        ),
        "hourly_time": (
            "Both adopt; shorter hours, hourly pay",
            replace(base, capacity_use="take_time", pay_contract="hourly_pay"),
            gentle,
        ),
        "layoffs": (
            "Both adopt; six jobs instead of ten",
            replace(base, capacity_use="take_time", pay_contract="layoffs"),
            gentle,
        ),
        "one_full_rigid": (
            "One shop fully automates; rival keeps its payroll",
            replace(base, pay_contract="hourly_pay", capacity_use="take_time"),
            ramp_schedule(stages=(0.2, 0.4, 0.6, 0.8, 1.0), firms=("consumer_a",)),
        ),
        "one_full_flexible": (
            "One shop fully automates; rival adjusts paid hours to sales",
            replace(
                base,
                pay_contract="hourly_pay",
                capacity_use="take_time",
                labor_demand_rule="lagged_sales",
            ),
            ramp_schedule(stages=(0.2, 0.4, 0.6, 0.8, 1.0), firms=("consumer_a",)),
        ),
        "myopic_flexible": (
            "Firms choose adoption and adjust paid hours to sales",
            replace(
                base,
                adoption_rule="bounded_myopic",
                pay_contract="hourly_pay",
                capacity_use="take_time",
                labor_demand_rule="lagged_sales",
            ),
            full,
        ),
        "one_protected": ("One adopts; both protect pay", base, one),
        "one_hourly": (
            "One adopts; its paid hours fall",
            replace(base, capacity_use="take_time", pay_contract="hourly_pay"),
            one,
        ),
        "staggered": (
            "The rival adopts ten rounds later",
            base,
            one + ramp_schedule(start=15, firms=("consumer_b",)),
        ),
        "sudden": ("Both jump directly to 40% task automation", base, ramp_schedule(stages=(0.4,))),
        "slow": ("Both reach 40% automation later", base, ramp_schedule(spacing=15)),
        "no_price_cuts": (
            "Productivity gains with unchanged prices",
            replace(base, price_pass_through=0),
            gentle,
        ),
        "full_price_cuts": (
            "All normal cost savings pass into prices",
            replace(base, price_pass_through=1),
            gentle,
        ),
        "slow_prices": ("Prices adjust slowly", replace(base, price_adjustment_speed=0.2), gentle),
        "free_ai": ("AI fee is zero", replace(base, ai_fee_per_task_hour=0), gentle),
        "expensive_ai": (
            "AI task-hour fee rises from 3 to 9",
            replace(base, ai_fee_per_task_hour=9),
            gentle,
        ),
        "scarce_ai": (
            "AI can supply only three task-hours per round",
            replace(base, ai_service_capacity=3),
            gentle,
        ),
        "no_spare_equipment": (
            "Consumer equipment starts with no spare capacity",
            replace(base, consumer_capital_capacity=40, depreciation_rate=0.25),
            gentle,
        ),
        "full_automation_hourly": (
            "Gradually automate all tasks; hourly pay disappears",
            replace(base, capacity_use="take_time", pay_contract="hourly_pay"),
            full,
        ),
        "full_automation_redeploy": (
            "No workers; deploy all available machine capacity",
            replace(base, capacity_use="redeploy", pay_contract="layoffs"),
            full,
        ),
        "full_automation_protected": (
            "Automate all tasks but continue salary payments",
            base,
            full,
        ),
        "owners_spend_all": (
            "Owners spend all dividends, after equipment funding",
            replace(
                base,
                owner_spending_propensity=1,
                capacity_use="take_time",
                pay_contract="hourly_pay",
            ),
            full,
        ),
        "sales_responsive": (
            "Equipment orders follow last round's sales",
            replace(
                base,
                investment_rule="sales_responsive",
                capacity_use="take_time",
                pay_contract="hourly_pay",
            ),
            full,
        ),
        "shared_ownership": (
            "Workers receive 60% of all cash dividends",
            replace(
                base,
                worker_ownership_share=0.6,
                worker_ownership_start_period=25,
                capacity_use="take_time",
                pay_contract="hourly_pay",
            ),
            full,
        ),
        "shared_ownership_expand": (
            "No jobs; gifted dividend rights and ample AI capacity",
            replace(
                base,
                worker_ownership_share=0.6,
                worker_ownership_start_period=25,
                capacity_use="redeploy",
                pay_contract="layoffs",
                ai_service_capacity=25,
            ),
            full,
        ),
        "full_automation_ample_ai": (
            "No jobs; ample AI capacity, owners receive dividends",
            replace(base, capacity_use="redeploy", pay_contract="layoffs", ai_service_capacity=25),
            full,
        ),
        "shared_ownership_responsive": (
            "Shared dividends and sales-responsive investment",
            replace(
                base,
                worker_ownership_share=0.6,
                worker_ownership_start_period=25,
                investment_rule="sales_responsive",
                capacity_use="take_time",
                pay_contract="hourly_pay",
            ),
            full,
        ),
    }


def compact_run(result: Any) -> dict[str, Any]:
    data = asdict(result)
    for row in data["periods"]:
        row.pop("payments")
    return data


def named_paths() -> dict[str, Any]:
    paths = {}
    for name, (label, parameters, schedule) in cases().items():
        result = simulate_adoption(parameters, shocks=schedule)
        paths[name] = {
            "label": label,
            "summary": asdict(summarize(result)),
            **compact_run(result),
        }
    return paths


def sensitivities() -> list[dict[str, Any]]:
    rows = []
    for pay in ("salary_protected", "hourly_pay"):
        for use in ("take_time", "redeploy"):
            for fee in (0, 3, 6, 9):
                for pass_through in (0, 0.5, 1):
                    for final_stage in (0.2, 0.4, 0.8, 1):
                        p = AdoptionParameters(
                            periods=80,
                            pay_contract=pay,
                            capacity_use=use,
                            ai_fee_per_task_hour=fee,
                            price_pass_through=pass_through,
                        )
                        schedule = ramp_schedule(stages=(final_stage / 2, final_stage))
                        result = simulate_adoption(p, shocks=schedule)
                        rows.append(
                            {
                                "pay_contract": pay,
                                "capacity_use": use,
                                "ai_fee": fee,
                                "price_pass_through": pass_through,
                                "final_stage": final_stage,
                                **asdict(summarize(result)),
                            }
                        )
    return rows


def timing_experiments(samples: int) -> dict[str, Any]:
    rules = {
        "myopic_protected": AdoptionParameters(periods=80, adoption_rule="bounded_myopic"),
        "myopic_hourly": AdoptionParameters(
            periods=80,
            adoption_rule="bounded_myopic",
            pay_contract="hourly_pay",
            capacity_use="take_time",
        ),
        "protected": AdoptionParameters(periods=80),
        "hourly": AdoptionParameters(
            periods=80, pay_contract="hourly_pay", capacity_use="take_time"
        ),
        "hourly_shared": AdoptionParameters(
            periods=80,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            worker_ownership_share=0.6,
            worker_ownership_start_period=5,
        ),
    }
    rules["myopic_flexible"] = AdoptionParameters(
        periods=80,
        adoption_rule="bounded_myopic",
        pay_contract="hourly_pay",
        capacity_use="take_time",
        labor_demand_rule="lagged_sales",
    )
    output = {}
    for name, parameters in rules.items():
        summaries = []
        for seed in range(samples):
            result = simulate_adoption(parameters, shocks=random_availability(seed))
            summaries.append({"seed": seed, **asdict(summarize(result))})
        completed = [row for row in summaries if row["stop_reason"] is None]
        selected = sorted(completed, key=lambda row: row["cumulative_real_gdp_through_stop"])
        representative = (
            {
                label: selected[round((len(selected) - 1) * probability)]["seed"]
                for label, probability in (
                    ("low_cumulative_output", 0.05),
                    ("middle_cumulative_output", 0.5),
                    ("high_cumulative_output", 0.95),
                )
            }
            if selected
            else {}
        )
        output[name] = {
            "parameters": asdict(parameters),
            "samples": samples,
            "completed": len(completed),
            "stopped": samples - len(completed),
            "stop_fraction": (samples - len(completed)) / samples,
            "distribution_scope": "Completed 80-period runs only; stopped cases separately retained below.",
            "final_real_gdp": distribution(tuple(row["last_real_gdp"] for row in completed)),
            "final_worker_real_consumption": distribution(
                tuple(row["last_worker_real_consumption"] for row in completed)
            ),
            "cumulative_real_gdp": distribution(
                tuple(row["cumulative_real_gdp_through_stop"] for row in completed)
            ),
            "representative_seeds": representative,
            "representative_paths": {
                label: {
                    "seed": seed,
                    **compact_run(simulate_adoption(parameters, shocks=random_availability(seed))),
                }
                for label, seed in representative.items()
            },
            "completed_fraction_below_baseline_real_gdp": sum(
                row["last_real_gdp"] < 100 - 1e-8 for row in completed
            )
            / len(completed)
            if completed
            else None,
            "completed_fraction_below_baseline_worker_consumption": sum(
                row["last_worker_real_consumption"] < 60 - 1e-8 for row in completed
            )
            / len(completed)
            if completed
            else None,
            "summaries": summaries,
        }
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=200)
    parser.add_argument("--skip-grid", action="store_true")
    args = parser.parse_args()
    if args.samples < 1:
        parser.error("--samples must be positive")
    started = perf_counter()
    DESTINATION.mkdir(parents=True, exist_ok=True)
    results = {
        "schema_version": 1,
        "description": "Uncalibrated four-firm town; periods are not calendar years.",
        "source_sha256": {
            str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest()
            for path in sorted(
                [
                    *(
                        ROOT / "src/toy_economy" / name
                        for name in (
                            "adoption.py",
                            "adoption_engine.py",
                            "adoption_decisions.py",
                            "adoption_experiments.py",
                        )
                    ),
                    Path(__file__).resolve(),
                ]
            )
        },
        "cases": named_paths(),
        "sensitivity_grid": [] if args.skip_grid else sensitivities(),
        "timing_uncertainty": timing_experiments(args.samples),
        "randomness": {
            "kind": "Independent firm-specific availability opportunities, paired across policies",
            "opportunity_probability_per_period": 0.25,
            "start_period": 5,
            "stages": [0.2, 0.4, 0.6, 0.8],
            "seed_range": [0, args.samples - 1],
            "interpretation": "Illustrative timing distribution, not a forecast probability.",
        },
    }
    (DESTINATION / "results.json").write_text(json.dumps(results, indent=2) + "\n")
    print(
        json.dumps(
            {
                "cases": len(results["cases"]),
                "grid": len(results["sensitivity_grid"]),
                "timing_runs": args.samples * len(results["timing_uncertainty"]),
                "elapsed_seconds": round(perf_counter() - started, 2),
            }
        )
    )


if __name__ == "__main__":
    main()
