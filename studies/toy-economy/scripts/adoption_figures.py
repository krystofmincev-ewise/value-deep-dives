"""Readable adoption diagrams, regenerated entirely from saved model records.

Run from the study directory with ``.venv/bin/python scripts/adoption_figures.py``.
The older teaching renderer and its output files remain unchanged. Geometry is
shared between SVG and PNG, and SVG stages support the optional step reader.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import visual_figures as visual
from PIL import ImageFont

ROOT = Path(__file__).resolve().parents[1]
Drawing = visual.Drawing
INK, GREEN, GOLD, BLUE = visual.INK, visual.GREEN, visual.GOLD, visual.BLUE
RED, PALE, WHITE, MUTED = visual.RED, visual.PALE, visual.WHITE, visual.MUTED


def number(value: float, digits: int = 1) -> str:
    """Retain useful detail without printing floating-point noise."""
    if abs(value - round(value)) < 1e-8:
        return str(round(value))
    return f"{value:.{digits}f}"


def text_width(text: str, size: int = 26) -> float:
    font = ImageFont.truetype(str(visual.FONT), size * 2)
    return font.getlength(visual.readable(text)) / 2


def lines(
    d: Drawing,
    x: float,
    y: float,
    text: str,
    width: float = 512,
    size: int = 26,
    color: str = INK,
    spacing: int = 36,
) -> float:
    """Word-wrap using the same font metrics as the PNG renderer."""
    words = text.split()
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and text_width(candidate, size) > width:
            d.text(x, y, current, size, color)
            y += spacing
            current = word
        else:
            current = candidate
    if current:
        d.text(x, y, current, size, color)
    return y


def circle(d: Drawing, x: float, y: float, radius: float, color: str) -> None:
    d.parts.append(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{color}"/>')
    d.draw.ellipse(
        ((x - radius) * 2, (y - radius) * 2, (x + radius) * 2, (y + radius) * 2),
        fill=color,
    )


def people(d: Drawing, x: int, y: int, count: int, spacing: int = 42) -> None:
    for i in range(count):
        cx = x + i * spacing
        circle(d, cx, y, 8, GREEN)
        d.rect(cx - 9, y + 12, 18, 24, GREEN, 5)


def shop(d: Drawing, x: int, y: int, name: str) -> None:
    d.rect(x, y, 246, 115)
    for i in range(6):
        d.rect(x + 20 + i * 34, y + 22, 34, 16, INK if i % 2 else BLUE, 0)
    d.rect(x + 27, y + 49, 42, 44, BLUE, 2)
    d.rect(x + 84, y + 49, 40, 44, WHITE, 2)
    d.text(x + 231, y + 79, name, 30, INK, "end")


def final(data: dict[str, Any], key: str) -> dict[str, Any]:
    return data["cases"][key]["periods"][-1]


def metadata(
    d: Drawing,
    cases: list[str],
    periods: dict[str, int],
    values: dict[str, Any],
) -> Drawing:
    d.adoption_metadata = {  # type: ignore[attr-defined]
        "source_cases": cases,
        "source_periods": periods,
        "displayed_values": values,
    }
    return d


def town(data: dict[str, Any]) -> Drawing:
    row = data["cases"]["baseline"]["periods"][0]
    firms = row["firms"]
    wages, surplus = row["wages_paid"], row["gross_surplus"]
    consumption, investment = row["nominal_consumption"], row["investment"]
    money = data["cases"]["baseline"]["money_stock"]
    d = Drawing(
        "01-adoption-town",
        "The same starting town",
        f"Two consumer shops employ {sum(f['headcount'] for f in firms)} workers. "
        f"The AI supplier and equipment maker are already automated. Baseline household "
        f"purchases {number(consumption)} plus equipment {number(investment)} equal GDP "
        f"{number(row['nominal_gdp'])}. Wages {number(wages)} plus gross surplus "
        f"{number(surplus)} are the income from that same output. Total cash is {number(money)}.",
        835,
    )
    d.text(24, 47, "The same starting town", 32)
    d.stage(
        "Two shops and their workers",
        "Each consumer shop starts with five workers. Each of the ten workers has a separate cash account.",
    )
    for x, firm, name in zip([24, 290], firms, ["Shop A", "Shop B"], strict=True):
        shop(d, x, 83, name)
        people(d, x + 39, 232, firm["headcount"])
        d.text(x + 123, 307, f"{firm['headcount']} workers", 26, GREEN, "middle")
    d.stage(
        "Two automated suppliers",
        "The equipment maker produces investment goods. The AI supplier is present from the beginning, but receives no AI fees before adoption.",
    )
    for x, title in [(24, "AI supplier"), (290, "Equipment maker")]:
        d.rect(x, 343, 246, 116)
        d.text(x + 123, 385, title, 26, BLUE, "middle")
        d.text(x + 123, 429, "Automated", 26, MUTED, "middle")
    d.stage(
        "Count output and income",
        "Final purchases and the income they create are two views of the same GDP. The cash stock is a separate quantity; money can circulate more than once.",
    )
    d.text(24, 516, "One period’s final purchases", 26, MUTED)
    d.rect(24, 538, 512, 76)
    d.text(
        280,
        586,
        f"Baskets {number(consumption)} + equipment {number(investment)}",
        27,
        INK,
        "middle",
    )
    d.text(24, 665, f"Wages {number(wages)} + gross surplus {number(surplus)}", 27)
    d.text(24, 707, f"= the same GDP {number(row['nominal_gdp'])}", 30)
    d.line(24, 744, 536, 744, PALE, 3)
    d.text(24, 791, f"Total cash in the town: {number(money)}", 28, MUTED)
    return metadata(
        d,
        ["baseline"],
        {"baseline": row["period"]},
        {
            "wages": wages,
            "gross_surplus": surplus,
            "consumption": consumption,
            "investment": investment,
            "gdp": row["nominal_gdp"],
            "money_stock": money,
            "workers_per_firm": [f["headcount"] for f in firms],
        },
    )


def shifts(data: dict[str, Any]) -> Drawing:
    baseline = data["cases"]["baseline"]["periods"][0]
    candidates = data["cases"]["protected_time"]["periods"]
    selected: list[dict[str, Any]] = []
    seen: set[float] = set()
    for row in candidates:
        fractions = {f["automation_fraction"] for f in row["firms"]}
        if len(fractions) == 1:
            fraction = next(iter(fractions))
            if fraction not in seen:
                seen.add(fraction)
                selected.append(row)
    selected = selected[:3]
    count = sum(f["headcount"] for f in baseline["firms"])
    d = Drawing(
        "02-adoption-shifts",
        "Same baskets, fewer human shifts",
        f"For the baseline {number(baseline['real_consumption'])} baskets, the recorded "
        "reference labor requirement falls as tasks move to AI. Each block is one full "
        "shift of tasks, not one person. Whether jobs or pay fall is a separate rule.",
        740,
    )
    d.text(24, 45, "Same baskets.", 32)
    d.text(24, 88, "Fewer human shifts.", 32)
    d.text(24, 140, f"{number(baseline['real_consumption'])} baskets in every row", 26, MUTED)
    values = []
    for i, row in enumerate(selected):
        y = 198 + i * 152
        fraction = row["firms"][0]["automation_fraction"]
        hours = sum(f["reference_required_hours"] for f in row["firms"])
        d.stage(
            f"AI does {number(fraction * 100)}% of tasks",
            f"For the same baseline output, human work is {number(hours)} full-shift equivalents. These are reference task requirements, not this period’s actual production or headcount.",
        )
        d.text(24, y, f"AI does {number(fraction * 100)}% of tasks", 26)
        slot_width = (512 - (count - 1) * 8) / count
        for j in range(count):
            d.rect(
                24 + j * (slot_width + 8),
                y + 23,
                slot_width,
                36,
                GREEN if j < round(hours) else BLUE,
                4,
            )
        d.text(24, y + 102, f"{number(hours)} human shifts", 29, GREEN)
        values.append(
            {
                "period": row["period"],
                "automation_fraction": fraction,
                "reference_human_shifts": hours,
            }
        )
    d.stage(
        "A task is not a job",
        "People, agreed working time, actual productive time, and pay are different variables. AI task replacement alone does not choose an employment contract.",
    )
    d.rect(24, 645, 24, 24, GREEN, 3)
    d.text(60, 666, "Human", 26, GREEN)
    d.rect(273, 645, 24, 24, BLUE, 3)
    d.text(309, 666, "AI", 26, BLUE)
    d.text(24, 718, "A shift is time, not a person.", 28)
    return metadata(
        d,
        ["baseline", "protected_time"],
        {
            "baseline": baseline["period"],
            "protected_time": selected[-1]["period"],
        },
        {"fixed_baskets": baseline["real_consumption"], "stages": values},
    )


def one_shop(data: dict[str, Any]) -> Drawing:
    case = data["cases"]["one_protected"]
    step_period = max(s["period"] for s in case["shocks"])
    row = next(r for r in case["periods"] if r["period"] == step_period)
    baseline = data["cases"]["baseline"]["periods"][0]
    d = Drawing(
        "03-one-shop",
        "One shop goes first",
        f"In period {row['period']}, shop A has adopted AI and shop B has not. "
        "Both protect salaries. The imposed price and demand rules give different "
        "prices, sales and capacities; this is not an optimizing competition model.",
        700,
    )
    d.text(24, 46, "One shop goes first", 32)
    d.text(24, 94, f"Same period: {row['period']}", 26, MUTED)
    vals = []
    for x, firm, name, old in zip(
        [24, 290], row["firms"], ["Shop A", "Shop B"], baseline["firms"], strict=True
    ):
        d.stage(
            name,
            f"{name}: AI handles {number(firm['automation_fraction'] * 100)}% of tasks. Price is {number(firm['price'], 2)} per basket; sales are {number(firm['quantity'])} baskets, compared with {number(old['quantity'])} before adoption. Physical capacity is {number(firm['quantity_capacity'])} baskets.",
        )
        d.rect(x, 128, 246, 402)
        d.text(x + 123, 174, name, 30, INK, "middle")
        d.text(
            x + 123, 216, f"AI: {number(firm['automation_fraction'] * 100)}%", 26, BLUE, "middle"
        )
        d.text(x + 123, 287, number(firm["price"], 2), 44, INK, "middle")
        d.text(x + 123, 326, "price per basket", 26, MUTED, "middle")
        d.text(x + 123, 394, number(firm["quantity"]), 44, INK, "middle")
        d.text(x + 123, 433, "baskets sold", 26, MUTED, "middle")
        d.text(x + 123, 496, f"Capacity {number(firm['quantity_capacity'])}", 26, BLUE, "middle")
        vals.append(
            {
                k: firm[k]
                for k in [
                    "firm_id",
                    "automation_fraction",
                    "price",
                    "quantity",
                    "quantity_capacity",
                ]
            }
        )
    d.stage(
        "Follow the whole town",
        f"The town buys {number(row['real_consumption'])} baskets in this period, versus {number(baseline['real_consumption'])} initially. Sales moving between businesses and changes in total output are separate effects.",
    )
    d.text(
        24,
        582,
        f"Before AI: {number(baseline['firms'][0]['quantity'])} baskets per shop",
        26,
        MUTED,
    )
    d.text(24, 630, f"Town buys {number(row['real_consumption'])} baskets", 30)
    d.text(24, 672, "Prices follow a chosen model rule.", 26, MUTED)
    return metadata(
        d,
        ["one_protected", "baseline"],
        {"one_protected": row["period"], "baseline": 0},
        {
            "firms": vals,
            "real_consumption": row["real_consumption"],
            "wages_paid": row["wages_paid"],
        },
    )


def private_choice(data: dict[str, Any]) -> Drawing:
    key = "myopic_hourly"
    case = data["cases"][key]
    first = next(
        row
        for row in case["periods"]
        if any(
            choice["chosen_automation"] > choice["previous_automation"]
            for choice in row["adoption_decisions"]
        )
    )
    last = case["periods"][-1]
    choices = first["adoption_decisions"]
    candidate_stage = choices[0]["candidate_automation"] * 100
    last_stage = last["firms"][0]["automation_fraction"] * 100
    d = Drawing(
        "03-private-choice",
        "A tempting choice can disappoint both shops",
        f"At their first accepted adoption decision in period {first['period']}, each shop "
        "forecasts its own operating surplus with the rival’s inherited price and "
        "automation held fixed. Both choose AI. The later recorded surplus, after "
        f"both reach {number(last_stage)}% automation, is lower. This compares an "
        "initial one-step incentive with a later outcome, not a forecast for that later period.",
        865,
    )
    d.text(24, 46, "A tempting choice.", 32)
    d.text(24, 89, "A weaker result.", 32)
    d.stage(
        "Each forecasts its own gain",
        "Each shop compares its own predicted operating surplus before and after one adoption step, holding the household spending budget and the rival’s inherited price and automation fixed. Neither forecasts later wage-demand feedback or rival responses.",
    )
    d.text(24, 146, f"First forecast, at {number(candidate_stage)}% AI", 27, MUTED)
    for x, name, choice in zip([24, 290], ["Shop A", "Shop B"], choices, strict=True):
        d.rect(x, 178, 246, 139)
        d.text(x + 123, 221, name, 28, INK, "middle")
        before = number(choice["predicted_current_surplus"])
        after = number(choice["predicted_candidate_surplus"])
        d.text(x + 123, 278, f"{before} → {after}", 39, GREEN, "middle")
    d.text(24, 361, "Predicted profit before → after", 26, MUTED)
    d.stage(
        "Both choose before seeing the other’s choice",
        "The two shops choose simultaneously. Their pay rules shorten hours and reduce wages. Later customer spending responds to those lower wages; the private forecast did not include this feedback.",
    )
    d.text(280, 419, "Both choose to adopt", 30, INK, "middle")
    d.arrow(280, 440, 280, 479, BLUE)
    d.stage(
        "Read the later outcome",
        f"In period {last['period']}, after both reach {number(last_stage)}% task automation, their operating surpluses are {[number(f['gross_surplus']) for f in last['firms']]}. Profit here is sales minus wages and AI fees, before equipment investment or depreciation. The earlier forecast was for the first step, not this later period.",
    )
    for x, name, firm in zip([24, 290], ["Shop A", "Shop B"], last["firms"], strict=True):
        d.rect(x, 495, 246, 145)
        d.text(x + 123, 537, name, 28, INK, "middle")
        d.text(x + 123, 590, number(firm["gross_surplus"]), 42, RED, "middle")
        d.text(x + 123, 625, "later profit", 26, MUTED, "middle")
    d.text(24, 696, f"Both now use AI for {number(last_stage)}% of tasks.", 26)
    d.text(24, 741, "Wage cuts weaken customer spending.", 26, MUTED)
    d.text(24, 782, "AI fees also cost the shops.", 26, MUTED)
    d.line(24, 807, 536, 807, PALE, 3)
    d.text(24, 846, "Profit is before replacing equipment.", 26, MUTED)
    return metadata(
        d,
        [key],
        {"first_accepted_choice": first["period"], "last_recorded_outcome": last["period"]},
        {
            "initial_adoption_decisions": choices,
            "later_firms": [
                {k: f[k] for k in ["firm_id", "automation_fraction", "gross_surplus"]}
                for f in last["firms"]
            ],
            "forecast_scope": "First adoption step; rival and spending budget held fixed. Not a forecast of the terminal period.",
        },
    )


POLICIES = [
    ("protected_redeploy", "Same pay; more capacity"),
    ("protected_time", "Same pay; less time"),
    ("hourly_time", "Hourly pay; less time"),
    ("layoffs", "Layoffs"),
]


def worker_baskets(data: dict[str, Any]) -> Drawing:
    entries = [("baseline", "Before AI"), *POLICIES]
    rows = [(key, label, final(data, key)) for key, label in entries]
    maximum = math.ceil(max(row["worker_real_consumption"] for _, _, row in rows) / 10) * 10
    d = Drawing(
        "04-worker-baskets",
        "What can worker households buy?",
        "Baskets purchased by all worker households together. The four adoption cases "
        "use the same task automation path, but different pay and time rules. Values "
        "are from each case’s last recorded period; they are not welfare scores.",
        775,
    )
    d.text(24, 46, "What can workers buy?", 32)
    d.text(24, 94, "Baskets for the whole worker group", 26, MUTED)
    values = []
    for i, (key, label, row) in enumerate(rows):
        y = 158 + i * 111
        value = row["worker_real_consumption"]
        color = MUTED if key == "baseline" else GREEN
        d.stage(
            label,
            f"In the last recorded period, worker households buy {number(value)} baskets under this rule. The baseline is {number(rows[0][2]['worker_real_consumption'])} baskets. Household groups are aggregates; this does not show who within the group receives income.",
        )
        d.text(24, y, label, 26, color)
        d.text(536, y, number(value), 30, color, "end")
        d.rect(24, y + 20, 512, 31, PALE, 0)
        d.rect(24, y + 20, 512 * value / maximum, 31, color, 0)
        values.append({"case": key, "period": row["period"], "worker_baskets": value})
    d.text(24, 745, "Same AI. Different contracts.", 29)
    return metadata(
        d,
        [key for key, _, _ in rows],
        {key: row["period"] for key, _, row in rows},
        {
            "worker_baskets": values,
            "shared_bar_scale": maximum,
        },
    )


def paid_work(data: dict[str, Any]) -> Drawing:
    d = Drawing(
        "05-paid-work",
        "People, agreed time and work done",
        "For each matched adoption case, compare headcount, contracted hours, and "
        "actual productive hours. Time is expressed as full-shift equivalents for "
        "the whole worker group. A person can remain employed while their hours fall.",
        980,
    )
    d.text(24, 46, "People and time are different", 31)
    d.text(24, 92, "Time is in full-shift units", 26, MUTED)
    values = []
    for i, (key, label) in enumerate(POLICIES):
        row = final(data, key)
        headcount = sum(f["headcount"] for f in row["firms"])
        contracted = sum(f["contracted_hours"] for f in row["firms"])
        actual = sum(f["actual_hours"] for f in row["firms"])
        y = 124 + i * 185
        d.stage(
            label,
            f"{label}: {headcount} employed people, {number(contracted)} contracted full-shift equivalents, and {number(actual)} full-shift equivalents of actual productive work. Actual time can be below agreed time when demand or physical capacity binds.",
        )
        d.rect(24, y, 512, 164)
        d.text(42, y + 39, label, 27, GREEN)
        for cx, title, value in [
            (104, "People", headcount),
            (280, "Contract", contracted),
            (456, "Work done", actual),
        ]:
            d.text(cx, y + 83, title, 26, MUTED, "middle")
            d.text(cx, y + 136, number(value), 39, INK, "middle")
        values.append(
            {
                "case": key,
                "period": row["period"],
                "headcount": headcount,
                "contracted_shifts": contracted,
                "productive_shifts": actual,
            }
        )
    d.stage(
        "Read each measure literally",
        "Contract means agreed working time. Work done means time actually used to produce goods. A reduction in actual productive time is not automatically free leisure.",
    )
    d.text(24, 911, "Contract = agreed time.", 26, MUTED)
    d.text(24, 953, "Work done = productive time.", 26, MUTED)
    return metadata(
        d, [key for key, _ in POLICIES], {v["case"]: v["period"] for v in values}, {"labor": values}
    )


def ai_fee(data: dict[str, Any]) -> Drawing:
    key = "protected_redeploy"
    row = final(data, key)
    receipts = sum(f["revenue"] for f in row["firms"])
    shops_va = sum(f["value_added"] for f in row["firms"])
    ai_va = row["ai_provider_value_added"]
    equipment_va = row["equipment_producer_value_added"]
    d = Drawing(
        "06-ai-fee",
        "The AI bill has a destination",
        f"Consumer shops receive {number(receipts)} and pay {number(ai_va)} to the "
        f"domestic AI supplier. Their value added is {number(shops_va)}; adding AI "
        f"value added {number(ai_va)} and equipment {number(equipment_va)} reconciles "
        f"to nominal GDP {number(row['nominal_gdp'])}. The AI fee is already included.",
        765,
    )
    d.text(24, 46, "The AI bill goes somewhere", 31)
    d.stage(
        "Start with shop sales",
        "Household payments are consumer-shop revenue. Part of that revenue pays the AI supplier for an intermediate service.",
    )
    d.rect(105, 91, 350, 118)
    d.text(280, 134, "Shops receive", 28, INK, "middle")
    d.text(280, 185, number(receipts), 42, INK, "middle")
    d.stage(
        "Split the receipt",
        "Shop value added is revenue minus the AI bill. The domestic AI supplier receives that bill as its own revenue and value added. Under this case’s rules, it distributes its surplus to owners.",
    )
    d.line(280, 211, 280, 244)
    d.line(147, 244, 413, 244)
    d.arrow(147, 244, 147, 280, GREEN)
    d.arrow(413, 244, 413, 280, BLUE)
    for x, label, value, color in [
        (24, "Shops’ value", shops_va, GREEN),
        (290, "AI receives", ai_va, BLUE),
    ]:
        d.rect(x, 298, 246, 121)
        d.text(x + 123, 343, label, 28, color, "middle")
        d.text(x + 123, 394, number(value), 42, color, "middle")
    d.text(413, 466, "Then to owners", 26, GOLD, "middle")
    d.stage(
        "Add the value once",
        "Add value created by consumer shops, the AI supplier, and the equipment maker. Do not add AI revenue to final spending again: the intermediate fee is part of the same final-goods receipt.",
    )
    d.rect(24, 516, 512, 126)
    d.text(280, 558, f"Shops {number(shops_va)} + AI {number(ai_va)}", 28, INK, "middle")
    d.text(
        280,
        610,
        f"+ equipment {number(equipment_va)} = GDP {number(row['nominal_gdp'])}",
        28,
        INK,
        "middle",
    )
    d.text(24, 700, "The AI fee is inside this total.", 28)
    d.text(24, 741, "It is not extra final spending.", 26, MUTED)
    return metadata(
        d,
        [key],
        {key: row["period"]},
        {
            "shop_receipts": receipts,
            "shop_value_added": shops_va,
            "ai_value_added": ai_va,
            "equipment_value_added": equipment_va,
            "nominal_gdp": row["nominal_gdp"],
        },
    )


def plot_line(
    d: Drawing,
    points: list[tuple[float, float]],
    bounds: tuple[float, float, float, float],
    domain: tuple[float, float],
    extent: tuple[float, float],
    color: str,
) -> None:
    x, y, width, height = bounds
    low_x, high_x = domain
    low_y, high_y = extent
    mapped = [
        (
            x + (px - low_x) / (high_x - low_x) * width,
            y + height - (py - low_y) / (high_y - low_y) * height,
        )
        for px, py in points
    ]
    for start, end in zip(mapped[:-1], mapped[1:], strict=True):
        d.line(*start, *end, color, 4)
    if mapped:
        circle(d, *mapped[-1], 5, color)


def axes(
    d: Drawing,
    bounds: tuple[int, int, int, int],
    domain: tuple[int, int],
    ticks: list[float],
    extent: tuple[float, float],
    percent: bool = False,
) -> None:
    x, y, width, height = bounds
    for tick in ticks:
        ty = y + height - (tick - extent[0]) / (extent[1] - extent[0]) * height
        d.line(x, ty, x + width, ty, PALE, 2)
        d.text(x - 16, ty + 9, number(tick) + ("%" if percent else ""), 26, MUTED, "end")
    d.line(x, y + height, x + width, y + height, MUTED, 2)
    for tick in [domain[0], round(sum(domain) / 2), domain[1]]:
        tx = x + (tick - domain[0]) / (domain[1] - domain[0]) * width
        d.text(tx, y + height + 39, str(tick), 26, MUTED, "middle")


def transition(data: dict[str, Any]) -> Drawing:
    keys = ["sudden", "slow"]
    cases = [data["cases"][key] for key in keys]
    end = max(s["period"] for case in cases for s in case["shocks"]) + 10
    end = min(end, max(case["parameters"]["periods"] for case in cases) - 1)
    paths = [[r for r in case["periods"] if r["period"] <= end] for case in cases]
    gdp = [r["real_gdp"] for path in paths for r in path]
    low = math.floor(min(gdp) / 10) * 10
    high = math.ceil(max(gdp) / 10) * 10
    if low == high:
        high += 10
    max_auto = (
        max(f["automation_fraction"] for path in paths for r in path for f in r["firms"]) * 100
    )
    auto_top = max(20, math.ceil(max_auto / 20) * 20)
    d = Drawing(
        "07-transition",
        "Fast and gradual adoption follow different routes",
        f"Actual saved paths for sudden and gradual adoption, shown through period {end}. "
        "Both cases protect pay and allow capacity expansion. The upper chart shows "
        "task automation; the lower chart shows real GDP at baseline prices. Endpoints "
        "and timing are results under the declared rules, not a forecast.",
        855,
    )
    d.text(24, 46, "The route matters, too", 32)
    d.line(24, 88, 62, 88, BLUE, 4)
    d.text(75, 97, "Sudden", 26, BLUE)
    d.line(290, 88, 328, 88, GREEN, 4)
    d.text(341, 97, "Gradual", 26, GREEN)
    d.stage(
        "Watch tasks move",
        "The sudden path jumps to its last automation stage. The gradual path reaches the same stage later. The x-axis is model periods, not calendar years.",
    )
    d.text(24, 154, "Share of tasks done by AI", 27)
    auto_bounds = (94, 185, 418, 180)
    axes(d, auto_bounds, (0, end), [0, auto_top / 2, auto_top], (0, auto_top), True)
    for path, color in zip(paths, [BLUE, GREEN], strict=True):
        points = []
        for i, row in enumerate(path):
            current = sum(f["automation_fraction"] for f in row["firms"]) / len(row["firms"]) * 100
            if i:
                points.append((row["period"], points[-1][1]))
            points.append((row["period"], current))
        plot_line(d, points, auto_bounds, (0, end), (0, auto_top), color)
    d.stage(
        "Follow realized output",
        "Real GDP values final goods at baseline prices. The path depends on wages, prices, demand, fees and capacity as well as the automation schedule. A slower route does not by itself imply a different final state.",
    )
    d.text(24, 472, "Real GDP · starting level = 100", 27)
    gdp_bounds = (94, 504, 418, 180)
    axes(d, gdp_bounds, (0, end), [low, (low + high) / 2, high], (low, high))
    for path, color in zip(paths, [BLUE, GREEN], strict=True):
        plot_line(
            d,
            [(r["period"], r["real_gdp"]) for r in path],
            gdp_bounds,
            (0, end),
            (low, high),
            color,
        )
    d.text(280, 771, "Model periods", 26, MUTED, "middle")
    d.text(24, 824, "Both cases protect pay.", 28)
    return metadata(
        d,
        keys,
        {key: path[-1]["period"] for key, path in zip(keys, paths, strict=True)},
        {
            "shown_through_period": end,
            "paths": {
                key: [
                    {
                        "period": r["period"],
                        "real_gdp": r["real_gdp"],
                        "automation": [f["automation_fraction"] for f in r["firms"]],
                    }
                    for r in path
                ]
                for key, path in zip(keys, paths, strict=True)
            },
        },
    )


def zero_jobs(data: dict[str, Any]) -> Drawing:
    pairs = [
        ("full_automation_ample_ai", "No shared dividends"),
        ("shared_ownership_expand", "Share dividends with workers"),
    ]
    rows = [(key, label, final(data, key)) for key, label in pairs]
    maximum = math.ceil(max(r["real_consumption"] for _, _, r in rows) / 10) * 10
    share = data["cases"]["shared_ownership_expand"]["parameters"]["worker_ownership_share"]
    start = data["cases"]["shared_ownership_expand"]["parameters"]["worker_ownership_start_period"]
    d = Drawing(
        "08-zero-jobs-sharing",
        "Zero jobs, two different endings",
        "Two matched cases use full automation, layoffs, expansion and ample AI capacity. "
        f"One grants worker households {number(share * 100)}% of dividends from period {start}. "
        "The bars split final baskets between worker and owner households, on the same "
        "scale. Equipment investment is additional to these baskets. Values are last recorded periods.",
        824,
    )
    d.text(24, 45, "Zero jobs.", 32)
    d.text(24, 88, "Two different endings.", 32)
    values = []
    for i, (key, label, row) in enumerate(rows):
        y = 192 + i * 245
        worker, owner = row["worker_real_consumption"], row["owner_real_consumption"]
        jobs = sum(f["headcount"] for f in row["firms"])
        d.stage(
            label,
            f"{label}: {jobs} employed workers; worker households buy {number(worker)} baskets and owner households buy {number(owner)}. Real GDP is {number(row['real_gdp'])}, including equipment investment. Shared dividend rights are an assumed grant, not a funded worker acquisition.",
        )
        d.text(24, y, label, 27)
        d.text(24, y + 44, f"{jobs} jobs · real GDP {number(row['real_gdp'])}", 27, MUTED)
        d.rect(24, y + 72, 512, 40, PALE, 0)
        d.rect(24, y + 72, 512 * worker / maximum, 40, GREEN, 0)
        d.rect(24 + 512 * worker / maximum, y + 72, 512 * owner / maximum, 40, GOLD, 0)
        d.text(24, y + 157, f"Workers: {number(worker)} baskets", 28, GREEN)
        d.text(24, y + 198, f"Owners: {number(owner)} baskets", 28, GOLD)
        values.append(
            {
                "case": key,
                "period": row["period"],
                "headcount": jobs,
                "worker_baskets": worker,
                "owner_baskets": owner,
                "real_gdp": row["real_gdp"],
                "investment": row["investment"],
            }
        )
    d.stage(
        "The rule changes access",
        "The result is conditional on fixed owner-financed equipment investment, ample AI capacity, the spending rules, and the granted dividend rights. No utility function is modeled; the picture is about access to goods, not an optimal economy.",
    )
    d.text(24, 142, "All tasks automated", 26, MUTED)
    d.line(24, 699, 536, 699, PALE, 3)
    d.text(24, 746, f"Workers receive {number(share * 100)}% of dividends", 26)
    d.text(24, 785, f"from period {start}, by assumption.", 26, MUTED)
    return metadata(
        d,
        [key for key, _, _ in rows],
        {key: row["period"] for key, _, row in rows},
        {
            "outcomes": values,
            "worker_dividend_share": share,
            "share_start_period": start,
            "shared_basket_scale": maximum,
        },
    )


def timing_uncertainty(data: dict[str, Any]) -> Drawing:
    keys = [
        ("myopic_protected", "Same pay; firms choose"),
        ("myopic_hourly", "Hourly pay; firms choose"),
        ("hourly_shared", "Hourly + sharing; scheduled"),
    ]
    cases = data["timing_uncertainty"]
    total = (
        data["cases"]["baseline"]["parameters"]["periods"]
        * data["cases"]["baseline"]["periods"][0]["real_gdp"]
    )
    available = [(key, label, cases[key]) for key, label in keys if key in cases]
    percent_values = [
        100 * case["cumulative_real_gdp"][q] / total
        for _, _, case in available
        if case["cumulative_real_gdp"] is not None
        for q in ["p05", "p95"]
    ]
    if not percent_values:
        percent_values = [0, 100]
    low = math.floor(min(percent_values) / 10) * 10
    high = math.ceil(max(percent_values) / 10) * 10
    if low == high:
        high += 10
    d = Drawing(
        "09-timing-uncertainty",
        "Random adoption dates give a range of paths",
        "Illustrative paired random adoption opportunities. Ranges are the fifth to "
        "ninety-fifth percentiles of cumulative real GDP among completed runs, expressed "
        "as a percentage of the no-adoption baseline over the same horizon. Dots show "
        "medians. Stopped runs are reported separately. The first two cases choose whether "
        "to adopt; the sharing case follows scheduled adoption. These are not real-world probabilities.",
        877,
    )
    d.text(24, 46, "What if adoption dates vary?", 31)
    d.text(
        24,
        94,
        f"Total output over {data['cases']['baseline']['parameters']['periods']} periods",
        26,
        MUTED,
    )
    d.text(24, 136, "No AI baseline = 100%", 26, MUTED)
    plot_left, plot_width = 94, 418
    vals = []
    for i, (key, label, case) in enumerate(available):
        y = 205 + i * 166
        dist = case["cumulative_real_gdp"]
        color = [GREEN, BLUE, GOLD][i]
        if dist is None:
            d.stage(
                label,
                f"{label}: no run reaches the full horizon, so there is no full-horizon output distribution. {case['stopped']} of {case['samples']} runs stop. Their observed output before the stop is retained in the data, not replaced with invented future output.",
            )
        else:
            median, lo, hi = [100 * dist[q] / total for q in ["median", "p05", "p95"]]
            d.stage(
                label,
                f"{label}: the middle 90% of completed runs gives total output from {number(lo)}% to {number(hi)}% of the no-adoption baseline, with median {number(median)}%. {case['stopped']} of {case['samples']} runs stop. The randomness is invented timing, not estimated forecast uncertainty.",
            )
        d.text(24, y, label, 28, color)
        if dist is None:
            d.text(24, y + 69, "No full-length runs", 28, RED)
        else:
            d.text(536, y + 45, f"Median {number(median)}%", 27, color, "end")
            yy = y + 78
            d.line(plot_left, yy, plot_left + plot_width, yy, PALE, 7)

            def x(value):
                return plot_left + (value - low) / (high - low) * plot_width

            d.line(x(lo), yy, x(hi), yy, color, 6)
            d.line(x(lo), yy - 12, x(lo), yy + 12, color, 3)
            d.line(x(hi), yy - 12, x(hi), yy + 12, color, 3)
            circle(d, x(median), yy, 7, color)
        d.text(24, y + 132, f"Stopped: {case['stopped']} of {case['samples']} runs", 26, MUTED)
        vals.append(
            {
                "case": key,
                "cumulative_real_gdp": dist,
                "completed": case["completed"],
                "stopped": case["stopped"],
                "samples": case["samples"],
            }
        )
    axis_y = 700
    for tick in [low, (low + high) / 2, high]:
        d.text(
            plot_left + (tick - low) / (high - low) * plot_width,
            axis_y,
            f"{number(tick)}%",
            26,
            MUTED,
            "middle",
        )
    d.text(
        24,
        762,
        f"AI offered for up to {number(max(data['randomness']['stages']) * 100)}% of tasks.",
        26,
    )
    d.text(24, 804, "Middle 90% of completed runs.", 26)
    d.text(24, 846, "Invented timing, not a forecast.", 26, MUTED)
    return metadata(
        d,
        [key for key, _, _ in available],
        {},
        {
            "no_adoption_cumulative_gdp": total,
            "distributions": vals,
            "distribution_scope": "completed runs only; stopped counts displayed",
        },
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--results", type=Path, default=ROOT / "outputs/adoption/results.json")
    parser.add_argument("--out", type=Path, default=ROOT / "outputs/adoption/figures")
    parser.add_argument(
        "--core-only",
        action="store_true",
        help="Build the first six figures while late cases settle.",
    )
    args = parser.parse_args()
    raw = args.results.read_bytes()
    data = json.loads(raw)
    args.out.mkdir(parents=True, exist_ok=True)
    visual.OUT = args.out
    builders = [town, shifts, private_choice, worker_baskets, paid_work, ai_fee]
    if not args.core_only:
        builders += [transition, zero_jobs, timing_uncertainty]
    manifest = []
    for builder in builders:
        drawing = builder(data)
        entry = drawing.finish()
        entry.update(drawing.adoption_metadata)
        entry["source_results"] = (
            str(args.results.relative_to(ROOT))
            if args.results.is_relative_to(ROOT)
            else args.results.name
        )
        entry["source_sha256"] = hashlib.sha256(raw).hexdigest()
        entry["interpretation"] = (
            "Illustrative model output under declared rules; not an empirical forecast."
        )
        manifest.append(entry)
    if not args.core_only:
        from adoption_extra_figures import build_extras

        manifest.extend(build_extras(ROOT))
    (args.out / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    )
    print(f"Built {len(manifest)} adoption SVG/PNG diagrams from {args.results.name}.")


if __name__ == "__main__":
    main()
