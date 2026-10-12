"""Recompute the optional bank experiment without third-party dependencies."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from toy_economy.bank_cases import build_bank_results


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "outputs/banking/results.json",
    )
    args = parser.parse_args()
    results = build_bank_results()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(results, indent=2, sort_keys=True, allow_nan=False) + "\n")
    print(f"Saved {len(results['paths'])} named bank paths to {args.output}")


if __name__ == "__main__":
    main()
