"""Draw the combined paper's cash-buffer illustration from retained evidence."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import visual_figures as visual

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs/combined"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    visual.OUT = OUT
    source = ROOT / "outputs/adoption/frontier.json"
    note = ROOT / "research/adoption-frontier.md"
    data = json.loads(source.read_text())
    point = data["profiles"]["salary_protected_redeploy_ai25_fee3"][
        "finite_grid_maxima_completed_only"
    ]["final_real_gdp"]["first_maximizing_point"]
    if point["automation"] != 0.58 or "wage arrears at round 90" not in note.read_text():
        raise ValueError("The source comparison changed; review the manuscript and illustration.")
    cash = point["final_consumer_cash"][0]
    loss = -point["final_consumer_surpluses"][0]
    drawing = visual.Drawing(
        "01-buffer",
        "Steady output. Shrinking reserves.",
        "One protected-pay path completes 80 rounds while each shop loses money. "
        "Each has about 3.27 coins left after round 79; extending the run gives wage arrears in round 90.",
        610,
    )
    drawing.stage("The output chart", "Production has settled, and the original 80-round run finishes.")
    drawing.card(24, 20, 512, "After 80 recorded rounds", "Still producing", visual.GREEN)
    drawing.text(42, 166, "The GDP chart looks steady.", 25)
    drawing.stage(
        "The cash account",
        f"Each shop is losing about {loss:.2f} coins a round. Its remaining cash is about {cash:.2f} coins.",
    )
    drawing.card(24, 210, 512, "Cash left in EACH shop", f"{cash:.2f} coins", visual.GOLD)
    drawing.text(42, 356, f"Losing {loss:.2f} coins each round.", 25)
    drawing.stage("Run it longer", "The unchanged path misses payroll in round 90. A completed run was not proof of sustainability.")
    drawing.card(24, 400, 512, "Extend the same experiment", "Payroll fails", visual.RED)
    drawing.text(42, 546, "Round 90: a payment goes unpaid.", 25)
    record = drawing.finish()
    record["displayed_values"] = {"cash_per_shop": cash, "loss_per_round_per_shop": loss, "failure_round": 90}
    record["source_sha256"] = {
        str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in (source, note)
    }
    record["interpretation"] = "Snapshot values from saved grid; extension failure from the frontier verification note."
    (OUT / "manifest.json").write_text(json.dumps([record], indent=2) + "\n")


if __name__ == "__main__":
    main()
