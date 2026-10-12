"""Summarize matched policy differences and finite-grid extrema from saved runs."""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict
from pathlib import Path

from toy_economy.adoption_analysis import SeedOutcome, bounded_maximum, compare_paired

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs/adoption"


def main() -> None:
    source = OUTPUT / "results.json"
    data = json.loads(source.read_text())
    policies = data["timing_uncertainty"]
    comparisons = {}
    for treatment, control in (
        ("hourly_shared", "hourly"),
        ("myopic_flexible", "myopic_hourly"),
        ("myopic_protected", "protected"),
        ("myopic_hourly", "hourly"),
    ):
        sets = []
        for key in (treatment, control):
            sets.append(
                tuple(
                    SeedOutcome(
                        row["seed"],
                        row["stop_reason"] is not None,
                        row["cumulative_real_gdp_through_stop"],
                        row["cumulative_worker_real_consumption_through_stop"],
                    )
                    for row in policies[key]["summaries"]
                )
            )
        comparisons[f"{treatment}_minus_{control}"] = asdict(compare_paired(*sets))
    grid = data["sensitivity_grid"]
    extrema = {}
    for objective in ("last_real_gdp", "last_worker_real_consumption"):
        optimum = bounded_maximum(
            tuple((row[objective], row["stop_reason"] is not None) for row in grid)
        )
        extrema[objective] = (
            None
            if optimum is None
            else {"value": optimum[0], "source_grid_index": optimum[1], "case": grid[optimum[1]]}
        )
    report = {
        "results_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "paired_scope": "Differences in cumulative real GDP and cumulative worker real consumption over all 80 rounds, treatment minus control on identical seeds completing both policies. Stop outcomes are separate, not imputed.",
        "paired_comparisons": comparisons,
        "grid_scope": "192 declared points. Highest completed endpoint only; not a global optimum, welfare ranking, or an optimization over time paths.",
        "grid_stopped": sum(row["stop_reason"] is not None for row in grid),
        "grid_completed": sum(row["stop_reason"] is None for row in grid),
        "grid_maxima": extrema,
    }
    (OUTPUT / "analysis.json").write_text(json.dumps(report, indent=2) + "\n")
    for name, comparison in comparisons.items():
        print(
            name,
            "common",
            comparison["both_completed"],
            "excluded",
            comparison["excluded_from_full_horizon_differences"],
            "Cumulative real GDP difference over 80 rounds",
            comparison["cumulative_real_gdp_difference"],
        )


if __name__ == "__main__":
    main()
