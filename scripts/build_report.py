"""Render the local reading companion and publication figures from model output."""

import csv
import html
import json
from pathlib import Path

import markdown
import matplotlib
from build_teaching import build_editions
from visual_figures import main as build_teaching_figures

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs"
SITE = ROOT / "site"
FIGURES = OUTPUT / "figures"
COLORS = {"green": "#236654", "gold": "#c78c37", "blue": "#678baa", "red": "#ac5b47"}
plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "font.size": 11,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.labelcolor": "#223c36",
        "text.color": "#223c36",
        "figure.facecolor": "#fffdf8",
        "axes.facecolor": "#fffdf8",
        "svg.hashsalt": "toy-economy-20261010",
    }
)


def save_figure(fig: plt.Figure, name: str) -> None:
    fig.tight_layout(pad=2)
    fig.savefig(FIGURES / f"{name}.png", dpi=180, facecolor=fig.get_facecolor())
    fig.savefig(FIGURES / f"{name}.svg", metadata={"Date": None})
    plt.close(fig)


def figures(data: dict) -> None:
    FIGURES.mkdir(exist_ok=True)
    fig, ax = plt.subplots(figsize=(9, 4.8))
    names = ["layoffs_0", "half_prices", "prices_up_25_percent"]
    nominal = [data["equilibrium"][n]["result"]["accounts"]["nominal_gdp"] for n in names]
    real = [data["equilibrium"][n]["result"]["accounts"]["real_gdp"] for n in names]
    xs = list(range(3))
    ax.bar([x - 0.18 for x in xs], nominal, 0.36, label="Nominal GDP", color=COLORS["gold"])
    bars = ax.bar([x + 0.18 for x in xs], real, 0.36, label="Real GDP", color=COLORS["green"])
    ax.bar_label(bars, padding=4, fmt="%.0f")
    ax.set_xticks(xs, ["Starting prices", "Prices halve", "Prices rise 25%"])
    ax.set_ylim(0, 235)
    ax.set_ylabel("Illustrative units")
    ax.set_title(
        "Same nominal spending. Different real output.", loc="left", pad=18, fontweight="bold"
    )
    ax.legend(frameon=False, loc="upper right")
    save_figure(fig, "prices")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    lines = [
        ("baseline", "Baseline", "green"),
        ("layoffs_10", "All jobs gone; investment 20", "gold"),
        ("saving_not_recycled", "No equity funding; capital wears out", "red"),
        ("zero_jobs_no_investment", "All jobs gone; no investment", "blue"),
    ]
    for key, label, color in lines:
        rows = data["dynamics"][key]["periods"]
        ax.plot(
            [r["period"] for r in rows],
            [r["production"]["nominal_gdp"] for r in rows],
            label=label,
            color=COLORS[color],
            lw=2.6,
        )
        if data["dynamics"][key]["stopped_for_insolvency"]:
            ax.scatter(
                rows[-1]["period"],
                rows[-1]["production"]["nominal_gdp"],
                marker="x",
                s=65,
                color=COLORS[color],
            )
    ax.set(
        xlabel="Model period (not a calendar forecast)", ylabel="GDP at fixed prices", ylim=(0, 115)
    )
    ax.set_title(
        "Follow the spending, then the capital stock.", loc="left", pad=18, fontweight="bold"
    )
    ax.legend(frameon=False, loc="upper center", bbox_to_anchor=(0.5, -0.17), ncol=2, fontsize=9)
    save_figure(fig, "transition")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    rows = data["automated_growth"]["owner_consumption_and_growth"]["periods"]
    for field, label, color in [
        ("real_gdp", "Real GDP", "green"),
        ("real_consumption", "Owners' real consumption", "gold"),
    ]:
        ax.plot(
            [r["period"] for r in rows],
            [r[field] for r in rows],
            label=label,
            color=COLORS[color],
            lw=3,
        )
    ax.axhline(0, color=COLORS["blue"], lw=2, label="Wage income / former workers' consumption")
    ax.set(
        xlabel="Transitions from the starting allocation",
        ylabel="Base-price output units",
        ylim=(-8, 290),
    )
    ax.set_title("Zero wages do not prevent real growth.", loc="left", pad=18, fontweight="bold")
    ax.legend(frameon=False, fontsize=9, loc="upper left")
    save_figure(fig, "automated-growth")


def page(title: str, body: str) -> str:
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><link rel="stylesheet" href="style.css"></head><body><main class="article"><nav><a href="index.html">← Interactive economy</a><a href="01-who-buys-the-output.html">Part one</a><a href="02-an-economy-without-paychecks.html">Part two</a></nav>{body}<footer>Draft research · 10 October 2026 · Original uncalibrated simulations. <a href="index.html">Explore the assumptions.</a></footer></main></body></html>'


def render_markdown(path: Path, target: str) -> None:
    body = markdown.markdown(path.read_text(), extensions=["tables", "fenced_code"])
    replacements = {
        "01-who-buys-the-output.md": "01-who-buys-the-output.html",
        "../site/index.html": "index.html",
        "../model-spec.md": "model-spec.html",
        "research/shock-specification.md": "../research/shock-specification.md",
        "../research/interview-notes.md": "interview-notes.html",
        "../research/economic-foundations.md": "economic-foundations.html",
        "sources-economics.json": "../research/sources-economics.json",
    }
    replacements.update(
        {article.name: article.stem + ".html" for article in (ROOT / "articles").glob("*.md")}
    )
    for old, new in replacements.items():
        body = body.replace(f'href="{old}"', f'href="{new}"')
    title = path.read_text().splitlines()[0].lstrip("# ")
    (SITE / target).write_text(page(title, body), encoding="utf-8")


def main() -> None:
    data = json.loads((OUTPUT / "results.json").read_text())
    figures(data)
    rows = data["baseline_supply_chain"]["firms"]
    cols = [
        ("firm_id", "Firm"),
        ("gross_turnover", "Sales"),
        ("intermediate_expenses", "Inputs"),
        ("value_added", "Value added"),
        ("wage_bill", "Wages"),
        ("gross_surplus", "Gross surplus"),
        ("worker_equivalents", "Worker equivalents"),
    ]
    with (OUTPUT / "firms.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow([key for key, _ in cols])
        writer.writerows([[r[key] for key, _ in cols] for r in rows])
    table = (
        "<table><thead><tr>"
        + "".join(f"<th>{title}</th>" for _, title in cols)
        + "</tr></thead><tbody>"
    )
    table += "".join(
        "<tr>"
        + "".join(
            f"<td>{html.escape(str(r[key])) if isinstance(r[key], str) else format(r[key], '.2f')}</td>"
            for key, _ in cols
        )
        + "</tr>"
        for r in rows
    )
    table += "</tbody></table>"
    template = (SITE / "index.template.html").read_text()
    grid = json.loads((OUTPUT / "explorer.json").read_text())
    rendered = (
        template.replace("{{FIRM_TABLE}}", table)
        .replace("{{LAYOFF_OPTIONS}}", "".join(f"<option>{n}</option>" for n in range(11)))
        .replace(
            "{{MODEL_DATA}}",
            json.dumps(grid, separators=(",", ":"), allow_nan=False).replace("<", "\\u003c"),
        )
    )
    (SITE / "index.html").write_text(rendered)
    build_teaching_figures()
    from banking_figures import main as build_bank_figures
    from build_banking_report import main as build_bank_report

    build_bank_figures()
    build_bank_report()
    for article in (ROOT / "articles").glob("*.md"):
        if article.stem != "03-when-the-economy-breaks":
            render_markdown(article, article.stem + ".html")
    build_editions()
    for source in (
        "model-spec.md",
        "research/economic-foundations.md",
        "research/interview-notes.md",
    ):
        path = ROOT / source
        if path.exists():
            render_markdown(path, path.stem + ".html")
    print(
        "Built reading companion, article/research pages, three baseline PNG/SVG figures and firm CSV."
    )


if __name__ == "__main__":
    main()
