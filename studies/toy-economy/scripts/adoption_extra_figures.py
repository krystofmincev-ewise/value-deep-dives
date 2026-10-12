"""Two final teaching pictures for the separately bounded experiments."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from visual_figures import BLUE, GOLD, GREEN, INK, MUTED, PALE, Drawing


def number(value: float) -> str:
    return str(round(value)) if abs(value - round(value)) < 1e-8 else f"{value:.1f}"


def transaction_picture(data: dict[str, Any]) -> tuple[Drawing, dict[str, Any]]:
    def row(name: str) -> dict[str, Any]:
        reference = data["teaching_rows"][name]
        return data["scenarios"][reference["scenario"]]["periods"][reference["period"]]

    purchase, build, operating = [
        row(name) for name in ("purchase_existing_shop", "buy_new_equipment", "entrant_first_sales")
    ]
    d = Drawing(
        "10-ai-enters",
        "Buying a shop and building one are different",
        "A separate controlled experiment holds household budgets and prices fixed. "
        "An acquisition transfers existing equity and adds no GDP. New equipment "
        "is production. The new business then shares the same consumer spending.",
        960,
    )
    d.text(24, 47, "What does the AI company buy?", 30)
    d.text(24, 91, "Same customers. Same budgets.", 26, MUTED)
    d.stage(
        "Buy an existing shop",
        "The AI provider pays from its existing cash to the original owner. Ownership "
        "changes, but no new basket or machine has been produced by the transaction.",
    )
    d.rect(24, 128, 512, 212)
    d.text(44, 172, "Buy the existing shop", 29, GOLD)
    d.text(44, 217, "AI company", 26)
    d.arrow(218, 208, 313, 208, GOLD)
    d.text(331, 217, "Old owner", 26)
    amount = purchase["acquisition_payment_excluded_from_gdp"]
    d.text(44, 265, f"Purchase price: {number(amount)} coins", 27)
    d.text(44, 310, f"GDP stays {number(purchase['real_gdp'])}", 29, GOLD)
    d.stage(
        "Build an additional business",
        "Here the provider instead pays the equipment maker for a newly produced "
        "asset. It is investment this round and becomes productive next round.",
    )
    d.rect(24, 365, 512, 212)
    d.text(44, 409, "Buy newly made equipment", 29, BLUE)
    d.text(44, 454, "AI company", 26)
    d.arrow(218, 445, 274, 445, BLUE)
    d.text(291, 454, "Equip. maker", 26)
    d.text(44, 502, f"New investment: {number(build['entry_setup_investment'])} coins", 27)
    d.text(44, 547, f"GDP rises to {number(build['real_gdp'])} this round", 28, BLUE)
    d.stage(
        "Follow the next round",
        "Customers still buy eighty baskets at the fixed prices. The entrant wins "
        "sales from the incumbents. Additional replacement equipment raises gross "
        "GDP, but it replaces the additional capital wearing out.",
    )
    d.text(24, 636, "Next round: the new shop opens", 28)
    sales = [f["consumption_quantity"] for f in operating["firms"]]
    d.text(
        24, 683, f"Households still buy {number(operating['real_consumption'])} baskets", 28, GREEN
    )
    d.text(24, 727, "The three sellers share those orders.", 26)
    d.line(24, 764, 536, 764, PALE, 3)
    d.text(24, 809, f"GDP = baskets {number(operating['real_consumption'])}", 28)
    d.text(
        24,
        851,
        f"+ replacement {number(operating['investment'])} = {number(operating['real_gdp'])}",
        28,
    )
    d.text(24, 905, "More replacement equipment.", 26, MUTED)
    d.text(24, 945, "No extra baskets.", 26, MUTED)
    return d, {
        "source_cases": ["acquisition_no_synergy", "funded_entry"],
        "source_periods": {
            "acquisition_no_synergy": purchase["period"],
            "funded_entry": operating["period"],
        },
        "displayed_values": {
            "acquisition_price": amount,
            "acquisition_round_gdp": purchase["real_gdp"],
            "entry_setup_investment": build["entry_setup_investment"],
            "entry_setup_round_gdp": build["real_gdp"],
            "operating_consumption": operating["real_consumption"],
            "operating_investment": operating["investment"],
            "operating_gdp": operating["real_gdp"],
            "operating_firm_quantities": sales,
        },
    }


def capacity_picture(data: dict[str, Any]) -> tuple[Drawing, dict[str, Any]]:
    key = "salary_protected_redeploy_ai10_fee3"
    profile = data["profiles"][key]
    peak = profile["finite_grid_maxima_completed_only"]["final_real_gdp"]["first_maximizing_point"]
    physical = data["physical_upper_bound"]["ai10"]
    possible = physical["maximum_consumer_quantity"]
    actual = peak["final_real_consumption"]
    d = Drawing(
        "11-capacity-and-customers",
        "Room to produce still needs a customer",
        "At the highest completed endpoint in the protected-pay, standard-AI-capacity "
        "grid, half of tasks use AI. The static physical envelope allows 160 baskets, "
        "but the saved run sells about 94.1. The price and demand rules matter. "
        "A physical upper bound is not a financeable market equilibrium.",
        780,
    )
    d.text(24, 47, "How much could the town make?", 30)
    d.text(24, 92, "Protected pay · room for more sales", 26, MUTED)
    d.stage(
        "Count the physical room",
        "Ten human shifts plus ten AI task-shifts can perform the work for 160 "
        "baskets when half the tasks are automated. Installed consumer equipment "
        "can handle that quantity. This is a physical bound, not promised sales.",
    )
    d.text(24, 160, "Physical room to make baskets", 27, BLUE)
    d.rect(24, 187, 512, 47, BLUE, 0)
    d.text(536, 285, f"{number(possible)} baskets", 33, BLUE, "end")
    d.stage(
        "Look at actual purchases",
        "At the prices chosen by the shops, household budgets buy much less "
        "than the physical limit. This is the highest completed GDP endpoint "
        "in this particular one-percentage-point automation grid.",
    )
    d.text(24, 359, "Baskets actually bought", 27, GREEN)
    d.rect(24, 386, 512, 47, PALE, 0)
    d.rect(24, 386, 512 * actual / possible, 47, GREEN, 0)
    d.text(536, 484, f"{number(actual)} baskets", 33, GREEN, "end")
    d.stage(
        "Keep the maximum conditional",
        "This selected run pays all obligations without drawing down shop buffers "
        "at the endpoint. A larger AI supplier, different prices, different "
        "spending or a different contract changes the comparison. It is not a "
        "universal optimal automation percentage.",
    )
    d.line(24, 536, 536, 536, PALE, 3)
    d.text(24, 587, f"AI does {number(100 * peak['automation'])}% of tasks here.", 28)
    d.text(24, 632, f"Real GDP: {number(peak['final_real_gdp'])}", 28, INK)
    d.text(24, 678, f"Including {number(peak['final_investment'])} equipment units.", 26, MUTED)
    d.text(24, 738, "A peak under these rules, not all rules.", 26)
    return d, {
        "source_cases": [key],
        "source_periods": {key: peak["last_recorded_round"]},
        "displayed_values": {
            "automation": peak["automation"],
            "real_consumption": actual,
            "real_gdp": peak["final_real_gdp"],
            "investment": peak["final_investment"],
            "physical_basket_upper_bound": possible,
            "physical_bound_inputs": physical,
        },
    }


def build_extras(root: Path) -> list[dict[str, Any]]:
    records = []
    for name, builder in (("structure", transaction_picture), ("frontier", capacity_picture)):
        source = root / f"outputs/adoption/{name}.json"
        raw = source.read_bytes()
        drawing, values = builder(json.loads(raw))
        record = drawing.finish()
        record.update(values)
        record.update(
            source_results=str(source.relative_to(root)),
            source_sha256=hashlib.sha256(raw).hexdigest(),
            interpretation="Controlled toy experiment; no empirical or universal optimum claim.",
        )
        records.append(record)
    return records
