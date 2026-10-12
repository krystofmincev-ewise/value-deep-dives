"""Offline command line: run a named suite; no credentials or network calls."""

import argparse
import csv
import json
from pathlib import Path
from typing import Any

from .scenarios import build_results, explorer_grid


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, indent=2, allow_nan=False) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("outputs"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    results = build_results()
    write_json(args.output / "results.json", results)
    write_json(args.output / "explorer.json", explorer_grid())
    with (args.output / "equilibrium.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            (
                "scenario",
                "status",
                "nominal_gdp",
                "real_gdp",
                "consumption",
                "investment",
                "wages",
                "gross_surplus",
                "worker_consumption",
                "owner_consumption",
            )
        )
        for name, case in results["equilibrium"].items():
            result = case["result"]
            accounts = result["accounts"]
            keys = (
                "nominal_gdp",
                "real_gdp",
                "consumption",
                "investment",
                "wages",
                "gross_surplus",
                "worker_consumption",
                "owner_consumption",
            )
            writer.writerow(
                (name, result["status"], *(accounts[key] if accounts else "" for key in keys))
            )
    print(
        f"Wrote {len(results['equilibrium'])} equilibrium cases, {len(results['dynamics'])} dynamic paths, four automated-growth cases and 3,168 explorer records to {args.output}."
    )


if __name__ == "__main__":
    main()
