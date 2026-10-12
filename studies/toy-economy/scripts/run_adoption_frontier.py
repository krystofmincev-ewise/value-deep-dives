"""A fine assigned-adoption grid; completed endpoints are not global optima."""

from __future__ import annotations

import hashlib
import json
from collections.abc import Callable
from dataclasses import asdict, dataclass, replace
from math import fsum, isclose
from pathlib import Path
from time import perf_counter
from typing import Literal

from toy_economy.adoption import (
    CONSUMERS,
    AdoptionParameters,
    AdoptionResult,
    AdoptionShock,
    CapacityUse,
    Pair,
    PayContract,
    simulate_adoption,
)

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "outputs/adoption/frontier.json"
TOLERANCE = 1e-8
Objective = Literal[
    "final_real_gdp",
    "final_worker_real_consumption",
    "cumulative_real_gdp_through_stop",
    "cumulative_worker_real_consumption_through_stop",
]
OBJECTIVES: tuple[Objective, ...] = (
    "final_real_gdp",
    "final_worker_real_consumption",
    "cumulative_real_gdp_through_stop",
    "cumulative_worker_real_consumption_through_stop",
)


@dataclass(frozen=True)
class FrontierPoint:
    automation: float
    completed: bool
    requested_rounds: int
    recorded_rounds: int
    last_recorded_round: int
    stop_reason: str | None
    final_nominal_gdp: float
    final_real_gdp: float
    final_real_consumption: float
    final_investment: float
    final_worker_real_consumption: float
    cumulative_real_gdp_through_stop: float
    cumulative_worker_real_consumption_through_stop: float
    final_wages_paid: float
    final_consumer_prices: Pair
    final_consumer_surpluses: Pair
    final_consumer_cash: Pair
    final_ai_utilization: float
    tail_rounds: int
    tail_consumer_cash_change: Pair
    tail_minimum_consumer_surplus: float
    tail_nominal_gdp_change: float
    tail_real_gdp_change: float
    tail_no_consumer_buffer_draw: bool
    final_wage_arrears: float
    final_ai_invoice_arrears: float


@dataclass(frozen=True)
class LocalPeak:
    value: float
    automation_start: float
    automation_end: float
    first_grid_index: int
    last_grid_index: int
    left_value: float | None
    right_value: float | None
    boundary: str


def objective_value(point: FrontierPoint, objective: Objective) -> float:
    return float(getattr(point, objective))


def completed(point: FrontierPoint) -> bool:
    return point.completed


def completed_without_tail_draw(point: FrontierPoint) -> bool:
    return point.completed and point.tail_no_consumer_buffer_draw


def describe(result: AdoptionResult, automation: float) -> FrontierPoint:
    """Keep failed rounds and expose cash-financed endpoint pseudo-stability."""
    rows = result.periods
    last = rows[-1]
    tail = rows[-10:]
    cash_change = tuple(
        last.closing_balances[firm] - tail[0].opening_balances[firm] for firm in CONSUMERS
    )
    minimum_surplus = min(firm.gross_surplus for row in tail for firm in row.firms)
    return FrontierPoint(
        automation,
        result.stop_reason is None and len(rows) == result.parameters.periods,
        result.parameters.periods,
        len(rows),
        last.period,
        result.stop_reason,
        last.nominal_gdp,
        last.real_gdp,
        last.real_consumption,
        last.investment,
        last.worker_real_consumption,
        fsum(row.real_gdp for row in rows),
        fsum(row.worker_real_consumption for row in rows),
        last.wages_paid,
        (last.firms[0].price, last.firms[1].price),
        (last.firms[0].gross_surplus, last.firms[1].gross_surplus),
        (last.closing_balances[CONSUMERS[0]], last.closing_balances[CONSUMERS[1]]),
        last.ai_service_utilization,
        len(tail),
        (cash_change[0], cash_change[1]),
        minimum_surplus,
        last.nominal_gdp - tail[0].nominal_gdp,
        last.real_gdp - tail[0].real_gdp,
        minimum_surplus >= -TOLERANCE and min(cash_change) >= -TOLERANCE,
        last.wage_arrears,
        fsum(firm.ai_fees - firm.ai_fees_paid for firm in last.firms),
    )


def local_peaks(points: tuple[FrontierPoint, ...], objective: Objective) -> tuple[LocalPeak, ...]:
    """Find adjacent-grid peaks/flat peaks among completed runs only.

    A failed run breaks a neighborhood. One-sided maxima are labeled rather
    than represented as interior first-order optima. Tolerance only groups
    numerically equal output levels; it is not a confidence interval.
    """
    peaks = []
    index = 0
    while index < len(points):
        if not points[index].completed:
            index += 1
            continue
        first = last = index
        value = objective_value(points[first], objective)
        while (
            last + 1 < len(points)
            and points[last + 1].completed
            and isclose(
                objective_value(points[last + 1], objective),
                value,
                rel_tol=1e-10,
                abs_tol=TOLERANCE,
            )
        ):
            last += 1
        left = (
            objective_value(points[first - 1], objective)
            if first > 0 and points[first - 1].completed
            else None
        )
        right = (
            objective_value(points[last + 1], objective)
            if last + 1 < len(points) and points[last + 1].completed
            else None
        )
        if all(neighbor is None or value > neighbor + TOLERANCE for neighbor in (left, right)):
            boundary = (
                "two_sided"
                if left is not None and right is not None
                else "grid_edge"
                if first == 0 or last == len(points) - 1
                else "survival_edge"
            )
            peaks.append(
                LocalPeak(
                    value,
                    points[first].automation,
                    points[last].automation,
                    first,
                    last,
                    left,
                    right,
                    boundary,
                )
            )
        index = last + 1
    return tuple(peaks)


def finite_maximum(
    points: tuple[FrontierPoint, ...],
    objective: Objective,
    eligible: Callable[[FrontierPoint], bool] = completed,
) -> dict[str, object] | None:
    candidates = tuple((i, point) for i, point in enumerate(points) if eligible(point))
    if not candidates:
        return None
    best = max(objective_value(point, objective) for _, point in candidates)
    ties = tuple(
        (i, point)
        for i, point in candidates
        if isclose(objective_value(point, objective), best, rel_tol=1e-10, abs_tol=TOLERANCE)
    )
    return {
        "value": best,
        "automation_values": [point.automation for _, point in ties],
        "grid_indices": [i for i, _ in ties],
        "first_maximizing_point": asdict(ties[0][1]),
    }


def profiles() -> tuple[tuple[str, AdoptionParameters], ...]:
    rows = []
    base = AdoptionParameters(periods=80, adoption_rule="scheduled")
    pay_contracts: tuple[PayContract, ...] = ("salary_protected", "hourly_pay")
    uses: tuple[CapacityUse, ...] = ("redeploy", "take_time")
    for pay in pay_contracts:
        for use in uses:
            for ai_capacity in (10, 25):
                name = f"{pay}_{use}_ai{ai_capacity}_fee3"
                rows.append(
                    (
                        name,
                        replace(
                            base,
                            pay_contract=pay,
                            capacity_use=use,
                            ai_service_capacity=ai_capacity,
                        ),
                    )
                )
    for ai_capacity in (10, 25):
        rows.append(
            (
                f"salary_protected_redeploy_ai{ai_capacity}_fee0",
                replace(
                    base,
                    ai_service_capacity=ai_capacity,
                    ai_fee_per_task_hour=0,
                ),
            )
        )
    return tuple(rows)


def run_profile(parameters: AdoptionParameters) -> tuple[FrontierPoint, ...]:
    points = []
    for tick in range(101):
        automation = tick / 100
        shocks = tuple(
            AdoptionShock(period, firm, stage)
            for period, stage in ((5, automation / 2), (10, automation))
            for firm in CONSUMERS
        )
        points.append(describe(simulate_adoption(parameters, shocks=shocks), automation))
    return tuple(points)


def static_physical_upper_bound(parameters: AdoptionParameters) -> dict[str, object]:
    """An inherited-resource envelope, independent of demand, prices and finance.

    Reference staffing supplies ten human task-hours; either human or AI input
    completes eight tasks per hour. This calculation permits the task share to
    vary freely and assumes all workers are retained and redeployed.
    """
    human_hours = 10.0
    units_per_task_hour = 8.0
    capital = len(CONSUMERS) * parameters.consumer_capital_capacity
    quantity = min(capital, units_per_task_hour * (human_hours + parameters.ai_service_capacity))
    share_interval = (
        [
            max(0.0, 1 - units_per_task_hour * human_hours / quantity),
            min(1.0, units_per_task_hour * parameters.ai_service_capacity / quantity),
        ]
        if quantity > 0
        else [0.0, 1.0]
    )
    return {
        "human_task_hours": human_hours,
        "ai_task_hours": parameters.ai_service_capacity,
        "units_per_task_hour": units_per_task_hour,
        "inherited_consumer_capital_capacity": capital,
        "maximum_consumer_quantity": quantity,
        "maximizing_task_share_interval": share_interval,
        "equipment_purchases_assumed": parameters.autonomous_investment,
        "potential_real_gdp_if_equipment_delivered": quantity + parameters.autonomous_investment,
        "scope": (
            "Static inherited-capacity envelope with retained/redeployed labor and freely chosen "
            "task share. No claim of affordable demand, cash feasibility, profitable prices, "
            "long-run sustainability, net output, welfare or optimal investment."
        ),
    }


def main() -> None:
    started = perf_counter()
    dependencies = (
        Path(__file__),
        ROOT / "src/toy_economy/adoption.py",
        ROOT / "src/toy_economy/adoption_engine.py",
        ROOT / "src/toy_economy/adoption_decisions.py",
        ROOT / "src/toy_economy/ledger.py",
        ROOT / "src/toy_economy/closure.py",
    )
    source_hashes = {
        str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in dependencies
    }
    results = {}
    for name, parameters in profiles():
        points = run_profile(parameters)
        results[name] = {
            "parameters": asdict(parameters),
            "completed": sum(point.completed for point in points),
            "stopped": sum(not point.completed for point in points),
            "finite_grid_maxima_completed_only": {
                objective: finite_maximum(points, objective) for objective in OBJECTIVES
            },
            "endpoint_maxima_without_tail_consumer_buffer_draw": {
                objective: finite_maximum(points, objective, completed_without_tail_draw)
                for objective in OBJECTIVES[:2]
            },
            "local_maxima_or_plateaus_completed_only": {
                objective: [asdict(peak) for peak in local_peaks(points, objective)]
                for objective in OBJECTIVES[:2]
            },
            "points": [asdict(point) for point in points],
        }
        print(name, "completed", results[name]["completed"], flush=True)
    for path in dependencies:
        if (
            hashlib.sha256(path.read_bytes()).hexdigest()
            != source_hashes[str(path.relative_to(ROOT))]
        ):
            raise RuntimeError(f"source changed during frontier run: {path.name}")
    output = {
        "schema_version": 1,
        "description": "Assigned adoption at101 terminal stages; no global equilibrium optimum.",
        "source_sha256": source_hashes,
        "grid": {"automation_min": 0, "automation_max": 1, "step": 0.01, "points": 101},
        "schedule": {"half_terminal_stage_round": 5, "terminal_stage_round": 10, "rounds": 80},
        "interpretation": {
            "endpoint_scope": "Completed80-round runs only; stopped rows retained separately.",
            "cumulative_scope": "Totals through stop retained for every run; only completed runs ranked together.",
            "local_scope": "Adjacent declared grid points; stopped runs break neighborhoods. Edges labeled.",
            "cash_scope": "No tail buffer draw is a last10-round diagnostic, not proof of stationary sustainability.",
            "uncertainty": "No randomness or empirical probabilities in this grid.",
            "objective": "Base-price gross GDP and worker consumption, not net income or welfare.",
        },
        "physical_upper_bound": {
            f"ai{capacity}": static_physical_upper_bound(
                AdoptionParameters(ai_service_capacity=capacity)
            )
            for capacity in (10, 25)
        },
        "profiles": results,
    }
    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    DESTINATION.write_text(json.dumps(output, indent=2) + "\n")
    print(
        "saved",
        DESTINATION.name,
        "runs",
        101 * len(results),
        "seconds",
        round(perf_counter() - started, 2),
        flush=True,
    )


if __name__ == "__main__":
    main()
