"""Paired finite-horizon comparisons that keep stopped simulations visible."""

from __future__ import annotations

from dataclasses import dataclass

from .adoption_experiments import distribution


@dataclass(frozen=True)
class SeedOutcome:
    seed: int
    stopped: bool
    cumulative_real_gdp: float
    cumulative_worker_real_consumption: float


@dataclass(frozen=True)
class PairedComparison:
    samples: int
    both_completed: int
    treatment_only_stopped: int
    control_only_stopped: int
    both_stopped: int
    excluded_from_full_horizon_differences: int
    cumulative_real_gdp_difference: dict[str, float] | None
    cumulative_worker_real_consumption_difference: dict[str, float] | None
    fraction_common_runs_with_higher_cumulative_worker_consumption: float | None


def compare_paired(
    treatment: tuple[SeedOutcome, ...], control: tuple[SeedOutcome, ...]
) -> PairedComparison:
    """Treatment-minus-control for identical seeds; no post-stop imputation."""
    by_seed = {row.seed: row for row in control}
    if len(by_seed) != len(control) or len({row.seed for row in treatment}) != len(treatment):
        raise ValueError("each policy must contain unique seeds")
    if {row.seed for row in treatment} != set(by_seed):
        raise ValueError("paired policies must contain the same seeds")
    statuses: dict[tuple[bool, bool], int] = {
        (False, False): 0,
        (True, False): 0,
        (False, True): 0,
        (True, True): 0,
    }
    gdp, consumption = [], []
    for a in treatment:
        b = by_seed[a.seed]
        statuses[(a.stopped, b.stopped)] += 1
        if not a.stopped and not b.stopped:
            gdp.append(a.cumulative_real_gdp - b.cumulative_real_gdp)
            consumption.append(
                a.cumulative_worker_real_consumption - b.cumulative_worker_real_consumption
            )
    complete = statuses[(False, False)]
    return PairedComparison(
        len(treatment),
        complete,
        statuses[(True, False)],
        statuses[(False, True)],
        statuses[(True, True)],
        len(treatment) - complete,
        distribution(tuple(gdp)),
        distribution(tuple(consumption)),
        sum(value > 1e-8 for value in consumption) / complete if complete else None,
    )


def bounded_maximum(observations: tuple[tuple[float, bool], ...]) -> tuple[float, int] | None:
    """Return the highest completed endpoint and its source index in a finite grid."""
    complete = [(value, i) for i, (value, stopped) in enumerate(observations) if not stopped]
    return max(complete, key=lambda row: row[0]) if complete else None
