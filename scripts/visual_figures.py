"""Draw matching, accessible SVG and PNG teaching diagrams from one geometry."""

from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass
from html import escape
from pathlib import Path

from matplotlib import get_data_path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "teaching"
INK = "#223c36"
GREEN = "#236654"
GOLD = "#a66d13"
BLUE = "#376d9a"
RED = "#a44432"
PALE = "#edf1ea"
WHITE = "#fffdf8"
MUTED = "#58675f"
FONT = Path(get_data_path()) / "fonts/ttf/DejaVuSans.ttf"


def readable(value: str) -> str:
    value = re.sub(r"(?<=[A-Za-z%])(?=\d)|(?<=\d)(?=[A-Za-z])", " ", value)
    return re.sub(r"([,:])(?=\d)", r"\1 ", value)


@dataclass(frozen=True)
class Step:
    title: str
    text: str


class Drawing:
    """A small dual renderer; SVG groups also identify animation steps."""

    def __init__(self, name: str, title: str, description: str, height: int) -> None:
        title, description = readable(title), readable(description)
        self.name = name
        self.title = title
        self.description = description
        self.height = height
        self.image = Image.new("RGB", (1120, height * 2), WHITE)
        self.draw = ImageDraw.Draw(self.image)
        self.parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 {height}" '
            f'width="560" height="{height}" role="img" aria-labelledby="{name}-title {name}-desc">',
            f'<title id="{name}-title">{escape(title)}</title>',
            f'<desc id="{name}-desc">{escape(description)}</desc>',
            "<style>text{font-family:DejaVu Sans,Arial,sans-serif}.travel-token{opacity:0}</style>",
            f'<rect width="560" height="{height}" fill="{WHITE}"/>',
        ]
        self.steps: list[Step] = []
        self.phase = 0

    def text(
        self,
        x: float,
        y: float,
        value: str,
        size: int = 26,
        color: str = INK,
        anchor: str = "start",
    ) -> None:
        value = readable(value)
        self.parts.append(
            f'<text x="{x}" y="{y}" font-size="{size}" '
            f'fill="{color}" text-anchor="{anchor}">{escape(value)}</text>'
        )
        font = ImageFont.truetype(str(FONT), size * 2)
        self.draw.text(
            (x * 2, y * 2),
            value,
            font=font,
            fill=color,
            anchor={"start": "ls", "middle": "ms", "end": "rs"}[anchor],
        )

    def rect(
        self, x: float, y: float, w: float, h: float, color: str = PALE, radius: int = 12
    ) -> None:
        self.parts.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{color}"/>'
        )
        self.draw.rounded_rectangle(
            (x * 2, y * 2, (x + w) * 2, (y + h) * 2), radius=radius * 2, fill=color
        )

    def line(
        self, x1: float, y1: float, x2: float, y2: float, color: str = MUTED, width: int = 3
    ) -> None:
        self.parts.append(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>'
        )
        self.draw.line((x1 * 2, y1 * 2, x2 * 2, y2 * 2), fill=color, width=width * 2)

    def arrow(self, x1: float, y1: float, x2: float, y2: float, color: str = MUTED) -> None:
        self.line(x1, y1, x2, y2, color)
        angle = math.atan2(y2 - y1, x2 - x1)
        for offset in (-0.6, 0.6):
            self.line(
                x2 - 11 * math.cos(angle + offset),
                y2 - 11 * math.sin(angle + offset),
                x2,
                y2,
                color,
            )
        self.parts.append(
            f'<circle class="travel-token" data-step="{self.phase}" '
            f'data-from="{x1},{y1}" data-to="{x2},{y2}" r="8" fill="{color}"/>'
        )

    def stage(self, title: str, text: str) -> None:
        if self.phase:
            self.parts.append("</g>")
        self.phase += 1
        self.steps.append(Step(readable(title), readable(text)))
        self.parts.append(f'<g class="teaching-stage" data-step="{self.phase}">')

    def card(
        self, x: int, y: int, w: int, label: str, amount: str, color: str, note: str = ""
    ) -> None:
        self.rect(x, y, w, 130 if note else 112)
        self.rect(x, y, 6, 130 if note else 112, color, 0)
        self.text(x + 18, y + 35, label, 26, color)
        self.text(x + 18, y + 83, amount, 42, color)
        if note:
            self.text(x + 18, y + 114, note, 24)

    def bar(
        self, y: int, label: str, parts: list[tuple[float, str]], total: str, maximum: float = 100
    ) -> None:
        self.text(24, y, label, 27)
        self.rect(24, y + 17, 512, 34, PALE, 0)
        x = 24.0
        for amount, color in parts:
            width = 512 * amount / maximum
            if width:
                self.rect(x, y + 17, width, 34, color, 0)
            x += width
        self.text(536, y + 89, total, 32, INK, "end")

    def finish(self) -> dict[str, object]:
        if self.phase:
            self.parts.append("</g>")
        self.parts.append("</svg>")
        (OUT / f"{self.name}.svg").write_text("\n".join(self.parts) + "\n")
        self.image.save(OUT / f"{self.name}.png")
        return {
            "id": self.name,
            "title": self.title,
            "description": self.description,
            "height": self.height,
            "steps": [{"title": s.title, "text": s.text} for s in self.steps],
        }


def town() -> Drawing:
    d = Drawing(
        "01-town",
        "Meet the same town each time",
        "Ten workers and ten owners, with five pairs of businesses. People remain in the town after their wages stop.",
        700,
    )
    d.stage(
        "Meet the people",
        "Green always means workers or former workers. Gold always means owners. These are two household groups, not twenty individually modeled budgets.",
    )
    d.card(24, 20, 246, "Workers", "10 people", GREEN)
    d.card(290, 20, 246, "Owners", "10 people", GOLD)
    d.stage(
        "Meet their businesses",
        "There are two businesses in each of five sectors. The rows show the cast of the story, not every supplier connection.",
    )
    for i, label in enumerate(
        ["Raw materials", "Processing", "Business inputs", "Consumer goods", "New equipment"]
    ):
        y = 163 + i * 88
        d.rect(24, y, 512, 70)
        for x in [40, 90]:
            d.rect(x, y + 17, 34, 34, BLUE if i == 4 else INK, 2)
            d.rect(x + 12, y + 35, 10, 16, WHITE, 0)
        d.text(145, y + 44, label, 27)
        d.text(508, y + 44, "×2", 27, BLUE if i == 4 else INK, "end")
    d.stage(
        "Keep the boundary in mind",
        "This town has no imports, exports, government or bank loans. Those possible real-world responses are deliberately outside this experiment.",
    )
    d.text(280, 660, "No trade • no government • no loans", 25, MUTED, "middle")
    return d


def income() -> Drawing:
    d = Drawing(
        "02-income",
        "One round of production creates income",
        "Final output of100 becomes wages60 and gross owner income40. These are two views of the same100, not200.",
        470,
    )
    d.stage(
        "Start with output",
        "During one round, customers buy100 of final output. This is a flow during a round, not the town’s total cash balance.",
    )
    d.card(120, 20, 320, "Final output", "100", INK)
    d.stage(
        "Follow the income",
        "The100 becomes60 of wages and40 of gross owner income. The branches divide one total; they do not create another100.",
    )
    d.line(280, 133, 280, 170)
    d.line(147, 170, 413, 170)
    d.arrow(147, 170, 147, 225, GREEN)
    d.arrow(413, 170, 413, 225, GOLD)
    d.card(24, 245, 246, "Worker wages", "60", GREEN)
    d.card(290, 245, 246, "Owner income", "40", GOLD)
    d.text(280, 427, "60 + 40 = the same 100", 30, INK, "middle")
    return d


def spending() -> Drawing:
    d = Drawing(
        "03-spending",
        "Where the income goes next",
        "Workers spend60 on household goods. Owners spend20 on household goods and finance20 of equipment. Household consumption80 plus equipment20 equals GDP100.",
        685,
    )
    d.stage(
        "Workers spend their60",
        "Workers use all60 of their wages for household purchases. This group saves none of its current income in the starting example.",
    )
    d.card(24, 20, 246, "Workers receive", "60", GREEN)
    d.arrow(147, 134, 147, 195, GREEN)
    d.card(24, 210, 246, "Household use", "60", GREEN)
    d.stage(
        "Owners divide their40",
        "Owners buy20 of household goods and put the other20 into businesses to finance new equipment. That20 is actually spent on equipment, not left idle.",
    )
    d.card(290, 20, 246, "Owners receive", "40", GOLD)
    d.arrow(413, 134, 413, 195, GOLD)
    d.card(290, 210, 246, "Household use", "20", GOLD)
    d.card(290, 355, 246, "New equipment", "20", BLUE)
    d.line(413, 133, 547, 133, BLUE)
    d.line(547, 133, 547, 340, BLUE)
    d.line(413, 340, 547, 340, BLUE)
    d.arrow(413, 340, 413, 353, BLUE)
    d.parts[-1] = d.parts[-1].replace(
        'data-from="413,340"', 'data-from="413,133" data-via="547,133;547,340;413,340"'
    )
    d.stage(
        "Count the final purchases once",
        "Households buy80 in total:60 from workers plus20 from owners. Businesses buy20 of new equipment. Those purchases are the next100 of final demand. The financing transfer is not counted again.",
    )
    d.text(24, 522, "Households 80 + equipment 20", 29)
    d.bar(563, "Final purchases", [(60, GREEN), (20, GOLD), (20, BLUE)], "GDP 100")
    return d


def incentive() -> Drawing:
    d = Drawing(
        "04-incentive",
        "One firm keeps the saving; others share the lost sales",
        "Separate equal-share firm example: payroll saving6 minus own lost sales1 gives recurring gain5 before setup cost. Total lost sales10 are split1 at adopter and9 at other firms.",
        540,
    )
    d.stage(
        "The firm saves6",
        "In this separate equal-share example, adopting avoids a wage bill of6. The installation cost still has to be paid; it is not included in this recurring gain.",
    )
    d.card(24, 20, 512, "Adopting firm: payroll saved", "+6", GREEN)
    d.stage(
        "It loses only1 of sales",
        "Under the specified demand response, town sales fall10. The adopting firm receives one tenth of sales, so it bears1 of that loss. Other firms bear9.",
    )
    d.arrow(150, 136, 150, 190, RED)
    d.card(24, 206, 246, "Its lost sales", "−1", RED)
    d.card(290, 206, 246, "Others lose", "−9", RED)
    d.stage(
        "The private gain can still be positive",
        "For the adopter,6 saved minus1 lost means5 more per round before setup costs. The full town’s sales fall from100 to90. A private gain does not mean the town gains.",
    )
    d.text(280, 402, "Its recurring gain: 6 − 1 = 5", 31, INK, "middle")
    d.text(280, 464, "Town sales: 100 → 90", 31, RED, "middle")
    d.text(280, 511, "Separate firm-choice example", 25, MUTED, "middle")
    return d


def no_wages() -> Drawing:
    d = Drawing(
        "05-no-wages",
        "Output survives; former workers have no purchases",
        "After wages stop, owner consumption80 and equipment20 sustain GDP100 in the owner-spending80% case. Former-worker consumption is zero.",
        490,
    )
    d.stage(
        "Keep the former workers in view",
        "The workers have lost their wage income, not disappeared. They own none of the businesses in this run, so their household purchases eventually reach zero.",
    )
    d.card(24, 20, 512, "Former workers buy", "0", GREEN)
    d.stage(
        "Other purchases fill the total",
        "In this run, owners consume80% of their income. Their80 of consumption and20 of equipment purchases support100 of final output. This is after inherited wage spending has passed through.",
    )
    d.card(24, 160, 246, "Owners buy", "80", GOLD)
    d.card(290, 160, 246, "Equipment", "20", BLUE)
    d.arrow(147, 278, 147, 323, GOLD)
    d.arrow(413, 278, 413, 323, BLUE)
    d.bar(352, "Final purchases", [(80, GOLD), (20, BLUE)], "GDP 100")
    return d


def ownership() -> Drawing:
    d = Drawing(
        "06-ownership",
        "The starting spending pattern can return without wages",
        "A separate ownership run: former workers receive60 of dividends; owners retain40 and consume half. Purchases are60 former-worker consumption,20 owner consumption and20 equipment.",
        650,
    )
    d.stage(
        "Replace the source of income",
        "Go back to the starting60/40 income split. In this run, the former workers receive60 through ownership distributions instead of wages. Owners retain40.",
    )
    d.card(24, 20, 246, "Worker-group", "60", GREEN, "from dividends")
    d.card(290, 20, 246, "Other owners", "40", GOLD, "from ownership")
    d.stage(
        "Follow the same starting budgets",
        "Former workers spend their60. Other owners spend half their40 on household purchases and finance20 of equipment. Their spending rule is50%, not the80% used in the previous run.",
    )
    d.arrow(147, 155, 147, 211, GREEN)
    d.arrow(413, 155, 413, 211, GOLD)
    d.card(24, 230, 246, "Household use", "60", GREEN)
    d.card(290, 230, 246, "Household use", "20", GOLD)
    d.card(290, 374, 246, "New equipment", "20", BLUE)
    d.line(413, 153, 547, 153, BLUE)
    d.line(547, 153, 547, 359, BLUE)
    d.line(413, 359, 547, 359, BLUE)
    d.arrow(413, 359, 413, 372, BLUE)
    d.parts[-1] = d.parts[-1].replace(
        'data-from="413,359"', 'data-from="413,153" data-via="547,153;547,359;413,359"'
    )
    d.stage(
        "Check who gets to consume",
        "The purchases match the starting town:60 for the worker group,20 for other owners and20 of equipment. GDP is100 and the former-worker group has purchasing power again.",
    )
    d.bar(535, "Final purchases", [(60, GREEN), (20, GOLD), (20, BLUE)], "GDP 100")
    return d


def smaller() -> Drawing:
    d = Drawing(
        "07-smaller",
        "Fixed equipment orders support a smaller economy",
        "Baseline purchases60 workers+20 owners+20 equipment=100. With no wages, owner consumption20 plus fixed equipment20 supports GDP40. Empty bar length means less output, not destroyed money.",
        480,
    )
    d.stage(
        "Remember the starting purchases",
        "At the start, workers buy60, owners buy20 and businesses buy20 of equipment. The whole bar is100.",
    )
    d.bar(50, "Starting town", [(60, GREEN), (20, GOLD), (20, BLUE)], "60 + 20 + 20 = 100")
    d.stage(
        "Keep equipment orders fixed",
        "After wages stop, owners consuming half their income eventually buy20. Fixed equipment orders add20. The former-worker group buys zero. Final output settles at40.",
    )
    d.arrow(280, 170, 280, 215, INK)
    d.bar(266, "No wages; equipment stays 20", [(20, GOLD), (20, BLUE)], "0 + 20 + 20 = 40")
    d.text(280, 439, "Same scale. Less output sold.", 27, MUTED, "middle")
    return d


def shrinking() -> Drawing:
    d = Drawing(
        "08-shrinking",
        "Each round starts with the previous round’s sales",
        "After workers have spent their last wages, all income goes to owners. Owners consume50% and equipment orders are20% of prior output.100 yields50+20=70,70 yields35+14=49,49 yields24.5+9.8=34.3. Total cash remains200; these are spending flows.",
        690,
    )
    rows = [("100", "50", "20", "70"), ("70", "35", "14", "49"), ("49", "24.5", "9.8", "34.3")]
    for i, (income, consume, invest, total) in enumerate(rows):
        y = 20 + i * 195
        d.stage(
            f"From {income} to {total}",
            f"Previous income is {income}, all received by owners after inherited wage spending has ended. Owners buy {consume} of household goods and firms buy {invest} of equipment. That makes {total} of new sales, which becomes income for the next round.",
        )
        d.rect(24, y, 512, 155)
        d.text(42, y + 39, f"Previous income: {income}", 28)
        d.text(42, y + 87, f"{consume} household + {invest} equipment", 26)
        d.text(514, y + 130, f"= {total} new sales", 31, INK, "end")
        if i:
            # Carry the previous row's sales into this row's starting income.
            previous_y = 20 + (i - 1) * 195
            font31 = ImageFont.truetype(str(FONT), 31)
            font28 = ImageFont.truetype(str(FONT), 28)
            start_x = 514 - font31.getlength(f"= {income} new sales") + font31.getlength("= ")
            end_x = 42 + font28.getlength("Previous income: ")
            d.parts.append(
                f'<text class="travel-token" data-step="{d.phase}" '
                f'data-from="{start_x},{previous_y + 130}" data-to="{end_x},{y + 39}" '
                f'font-size="31" font-weight="bold" fill="{INK}" '
                f'stroke="{WHITE}" stroke-width="5" paint-order="stroke">{income}</text>'
            )
        if i < 2:
            d.arrow(280, y + 160, 280, y + 188, INK)
    d.text(280, 638, "Money in all accounts: still 200", 27, MUTED, "middle")
    d.text(280, 675, "Less of it buys new output each round.", 25, MUTED, "middle")
    return d


def payroll() -> Drawing:
    d = Drawing(
        "09-payroll",
        "Payday at one equipment producer",
        "Each of two equipment makers has1 of cash available for wages3, leaving2 unpaid. Together arrears4. Town GDP67.75 exceeds contracted wages60 but is not cash in these firms’ accounts.",
        540,
    )
    d.stage(
        "The bill arrives",
        "This is a different experiment: equipment orders pause temporarily while each firm keeps its payroll commitments. One equipment maker owes wages of3 today.",
    )
    d.card(24, 20, 512, "Wages due today", "3", INK)
    d.stage(
        "Pay what the firm actually has",
        "It has only1 available to pay. There is no automatic loan or transfer from another company’s account in this model.",
    )
    d.arrow(280, 136, 280, 185, GREEN)
    d.card(24, 205, 246, "Cash available", "1", GREEN)
    d.stage(
        "See the gap",
        "It pays1 and leaves2 unpaid. Both equipment makers face the same gap, so unpaid wages total4. Aggregate GDP is an income flow, not a shared company bank account.",
    )
    d.card(290, 205, 246, "Still unpaid", "2", RED)
    d.text(280, 382, "Two firms × gap 2 = unpaid 4", 29, RED, "middle")
    d.text(280, 449, "Town GDP: 67.75", 29, INK, "middle")
    d.text(280, 496, "That is not cash in this firm’s account.", 24, MUTED, "middle")
    return d


def recovery() -> Drawing:
    d = Drawing(
        "10-recovery",
        "A town can survive without restoring all purchases",
        "Separate15-period equipment-freeze run, all workers retained. Long-run purchases60 workers+0 owners+20 equipment=80 versus initial60+20+20=100. Income-only spending and finance priority explain path dependence.",
        490,
    )
    d.stage(
        "Reset to the starting town",
        "All ten workers remain employed, but their hours can shift between businesses as orders change. Individual firms no longer have fixed wage bills. Before a temporary pause in equipment buying, purchases total100.",
    )
    d.bar(48, "Before the pause", [(60, GREEN), (20, GOLD), (20, BLUE)], "60 + 20 + 20 = 100")
    d.stage(
        "Survive, then restart equipment buying",
        "After a15-round pause, this run avoids unpaid wages and resumes20 of equipment purchases. Workers buy60. Owners’ available cash goes to equipment finance, leaving zero for their household purchases.",
    )
    d.arrow(280, 166, 280, 211, INK)
    d.bar(263, "After the town settles", [(60, GREEN), (20, BLUE)], "60 + 0 + 20 = 80")
    d.text(280, 423, "GDP: 100 → 80", 34, INK, "middle")
    d.text(280, 468, "Survival is not full recovery.", 27, MUTED, "middle")
    return d


def replacement() -> Drawing:
    d = Drawing(
        "11-replacement",
        "New equipment has two different jobs",
        "Conceptual diagram: replacement restores worn-out capacity; additional equipment can expand capacity under the assumed technology. Icons do not represent measured quantities.",
        470,
    )
    d.stage(
        "First, replace what wears out",
        "Some new equipment takes the place of old equipment that no longer works. This spending can keep capacity from shrinking without expanding it.",
    )
    d.card(24, 20, 246, "Worn capacity", "Replace it", BLUE)
    d.arrow(275, 75, 286, 75, BLUE)
    d.card(300, 20, 236, "Result", "Maintain", BLUE)
    d.stage(
        "Then, add capacity",
        "Equipment beyond replacement can expand production capacity. Whether that capacity becomes more sales depends on customers, and whether extra equipment remains productive depends on technology and resources.",
    )
    d.card(24, 205, 246, "Extra capacity", "Add to it", BLUE)
    d.arrow(275, 260, 286, 260, BLUE)
    d.card(300, 205, 236, "Result", "Expand", INK)
    d.text(280, 403, "A new machine is not always", 27, MUTED, "middle")
    d.text(280, 440, "an extra working machine.", 27, MUTED, "middle")
    return d


def maxima() -> Drawing:
    d = Drawing(
        "12-maxima",
        "More gross output need not leave more for households",
        "Separate diminishing-return physical model. At investment share50%, long-run real GDP250 divides125 consumption and125 replacement. At100%, real GDP500 all replaces equipment and consumption is zero. Same scale500.",
        590,
    )
    d.stage(
        "Leave some output for households",
        "In the separate diminishing-return model, investing half the output eventually supports250 of real output:125 for household use and125 to replace equipment. This gives maximum stationary consumption under this technology.",
    )
    d.bar(55, "Invest half the output", [(125, GOLD), (125, BLUE)], "Real GDP 250", 500)
    d.text(24, 190, "Household use 125", 29, GOLD)
    d.text(24, 234, "Equipment replacement 125", 29, BLUE)
    d.stage(
        "Put all output into replacement",
        "Investing all output eventually supports500 of real output, but all500 is needed to replace the large stock of equipment as it wears out. Household consumption is zero. GDP is higher, not household access.",
    )
    d.bar(330, "Invest all the output", [(500, BLUE)], "Real GDP 500", 500)
    d.text(24, 466, "Household use 0", 29, GOLD)
    d.text(24, 510, "Equipment replacement 500", 29, BLUE)
    d.text(280, 569, "Same scale. Different destinations.", 27, MUTED, "middle")
    return d


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    diagrams = [
        f().finish()
        for f in [
            town,
            income,
            spending,
            incentive,
            no_wages,
            ownership,
            smaller,
            shrinking,
            payroll,
            recovery,
            replacement,
            maxima,
        ]
    ]
    (OUT / "manifest.json").write_text(json.dumps(diagrams, indent=2, ensure_ascii=False) + "\n")
    print(f"Built {len(diagrams)} static SVG/PNG diagrams and their reading steps.")


if __name__ == "__main__":
    main()
