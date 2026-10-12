"""Run the second experiment and render its portable, offline companion."""

import csv
import json
from dataclasses import asdict
from pathlib import Path
from typing import Any

import matplotlib

from toy_economy.incentives import IncentiveParameters, solve_incentives
from toy_economy.limits import LimitParameters, capital_path, growth_limits, stationary_allocation
from toy_economy.shock_cases import build_shock_results
from toy_economy.strategic_game import enumerate_pure_nash, simulate_best_responses

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "shocks"
FIG = OUT / "figures"
COLORS = ["#236654", "#c78c37", "#ac5b47", "#678baa"]
plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "font.size": 10,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "figure.facecolor": "#fffdf8",
        "axes.facecolor": "#fffdf8",
        "axes.labelcolor": "#223c36",
        "text.color": "#223c36",
        "svg.hashsalt": "toy-economy-shocks-20261010",
    }
)


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")


def save(fig: Any, name: str) -> None:
    fig.tight_layout(pad=2)
    fig.savefig(FIG / f"{name}.png", dpi=180)
    fig.savefig(FIG / f"{name}.svg", metadata={"Date": None})
    plt.close(fig)


def charts(data: dict[str, Any], limits: dict[str, Any]) -> None:
    fig, ax = plt.subplots(figsize=(9, 4.8))
    for (name, label), color in zip(
        [
            ("fixed_abrupt_zero_jobs", "Fixed equipment spending: 20"),
            ("replacement_abrupt_zero_jobs", "Investment follows sales"),
            (
                "replacement_zero_jobs_owner_spending_080",
                "Owners consume 80%; investment follows sales",
            ),
        ],
        COLORS,
        strict=False,
    ):
        rows = data["paths"][name]["periods"][:41]
        ax.plot(
            [r["period"] for r in rows],
            [r["production"]["nominal_gdp"] for r in rows],
            label=label,
            color=color,
            lw=2.6,
        )
    ax.axvline(5, color="#888888", ls="--", lw=1)
    ax.set(
        xlabel="Model period (all jobs removed at 5)",
        ylabel="GDP at unchanged prices",
        ylim=(0, 112),
    )
    ax.set_title("The investment rule changes the ending.", loc="left", fontweight="bold", pad=16)
    ax.legend(frameon=False, loc="upper center", bbox_to_anchor=(0.5, -0.18), fontsize=9)
    save(fig, "demand-loop")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    for (name, label), color in zip(
        [
            ("freeze_5_recovery_current_wages", "Workers move between firms"),
            ("freeze_5_failure_fixed_wage_shares", "Each firm keeps its payroll commitments"),
        ],
        COLORS,
        strict=False,
    ):
        rows = data["paths"][name]["periods"][:31]
        ax.plot(
            [r["period"] for r in rows],
            [r["production"]["nominal_gdp"] for r in rows],
            label=label,
            color=color,
            lw=2.6,
        )
        if data["paths"][name]["stopped_for_insolvency"]:
            ax.scatter(
                rows[-1]["period"],
                rows[-1]["production"]["nominal_gdp"],
                marker="x",
                s=70,
                color=color,
            )
    ax.axhline(60, color="#777777", ls="--", label="Total contracted wages")
    ax.axvspan(5, 10, color="#c78c37", alpha=0.08)
    ax.set(
        xlabel="Model period (equipment purchases frozen from 5 through 9)",
        ylabel="GDP at unchanged prices",
        ylim=(0, 115),
    )
    ax.set_title(
        "Enough income in total. Not enough at the firm that owes wages.",
        loc="left",
        fontweight="bold",
        pad=16,
        fontsize=12,
    )
    ax.legend(frameon=False, loc="lower right", fontsize=9)
    save(fig, "firm-liquidity")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    for (name, label), color in zip(
        [
            ("replacement_five_jobs_gamma_010", "Gradual investment adjustment: 10%"),
            ("replacement_five_jobs_gamma_060", "Fast investment adjustment: 60%"),
        ],
        COLORS,
        strict=False,
    ):
        rows = data["paths"][name]["periods"][:100]
        ax.plot(
            [r["period"] for r in rows],
            [r["production"]["nominal_gdp"] for r in rows],
            label=label,
            color=color,
            lw=2,
        )
    ax.axhline(50, color="#888888", ls="--", lw=1)
    ax.set(xlabel="Model period (five jobs removed at 5)", ylabel="GDP at unchanged prices")
    ax.set_title(
        "A peak on a cycle is not the economy's maximum.", loc="left", fontweight="bold", pad=16
    )
    ax.legend(frameon=False, fontsize=9, loc="upper center", bbox_to_anchor=(0.5, -0.18))
    save(fig, "investment-cycles")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    rows = limits["uncapped"]["curve"]
    ax.plot(
        [100 * r["investment_share"] for r in rows],
        [r["real_gdp"] for r in rows],
        color=COLORS[0],
        lw=2.6,
        label="Stationary GDP",
    )
    ax.plot(
        [100 * r["investment_share"] for r in rows],
        [r["real_consumption"] for r in rows],
        color=COLORS[1],
        lw=2.6,
        label="Stationary consumption",
    )
    ax.scatter([50, 100], [125, 500], color=[COLORS[1], COLORS[0]], s=45)
    ax.annotate(
        "Consumption maximum: 125",
        (50, 125),
        xytext=(32, 205),
        arrowprops={"arrowstyle": "->", "color": COLORS[1]},
        fontsize=10,
    )
    ax.annotate(
        "GDP maximum: 500\nConsumption: zero",
        (100, 500),
        xytext=(57, 425),
        arrowprops={"arrowstyle": "->", "color": COLORS[0]},
        fontsize=10,
    )
    ax.set(
        xlabel="Share of output invested (%)", ylabel="Long-run real output units", ylim=(0, 550)
    )
    ax.set_title(
        "Maximizing GDP and consumption gives different answers.",
        loc="left",
        fontweight="bold",
        pad=16,
        fontsize=12,
    )
    ax.legend(frameon=False, loc="upper left")
    save(fig, "growth-limits")


def main() -> None:
    FIG.mkdir(parents=True, exist_ok=True)
    data = build_shock_results()
    write_json(OUT / "results.json", data)
    with (OUT / "summary.csv").open("w", newline="") as handle:
        rows = list(data["summaries"].values())
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    limits = {}
    for name, cap in [("uncapped", None), ("resource_300", 300), ("resource_200", 200)]:
        p = LimitParameters(resource_ceiling=cap)
        limits[name] = {
            "parameters": asdict(p),
            "maxima": asdict(growth_limits(p)),
            "curve": [asdict(stationary_allocation(i / 100, p)) for i in range(101)],
            "paths": {
                str(s): [asdict(row) for row in capital_path(s, p, periods=500)]
                for s in [0.2, 0.5, 1]
            },
        }
    write_json(OUT / "limits.json", limits)
    incentives = {}
    for n in (1, 2, 10, 100):
        for cost in (1, 5, 10):
            p = IncentiveParameters(firms=n, setup_cost_per_wage_unit=cost)
            incentives[f"firms_{n}_cost_{cost}"] = {
                "parameters": asdict(p),
                "result": asdict(solve_incentives(p)),
            }
    write_json(OUT / "incentives.json", incentives)
    strategic = {}
    for n in (1, 2, 10, 100):
        for cost in (0, 1, 5, 10):
            p = IncentiveParameters(firms=n, setup_cost_per_wage_unit=cost)
            strategic[f"firms_{n}_cost_{cost}"] = {
                "parameters": asdict(p),
                "pure_equilibria": [asdict(row) for row in enumerate_pure_nash(p)],
                "best_responses": {
                    mode: asdict(simulate_best_responses(p, mode=mode))
                    for mode in ("asynchronous", "simultaneous")
                },
            }
    p = IncentiveParameters(investment_share=0, autonomous_investment=20)
    strategic["fixed_investment_floor"] = {
        "parameters": asdict(p),
        "pure_equilibria": [asdict(row) for row in enumerate_pure_nash(p)],
        "best_responses": {
            mode: asdict(simulate_best_responses(p, mode=mode))
            for mode in ("asynchronous", "simultaneous")
        },
    }
    write_json(OUT / "strategic-game.json", strategic)
    charts(data, limits)
    ui = {"paths": {}, "limits": {name: record["curve"] for name, record in limits.items()}}
    for name, record in data["paths"].items():
        ui["paths"][name] = {
            "summary": data["summaries"][name],
            "parameters": record["parameters"],
            "shocks": record["shocks"],
            "rows": [
                {
                    "period": r["period"],
                    "gdp": r["production"]["nominal_gdp"],
                    "real_gdp": r["production"]["real_gdp"],
                    "consumption": r["production"]["consumption"],
                    "investment": r["production"]["investment"],
                    "worker_consumption": r["worker_consumption"],
                    "owner_consumption": r["owner_consumption"],
                    "capital": r["closing_real_capital"],
                    "wages": r["production"]["wages"],
                    "wages_paid": r["wages_paid"],
                    "arrears": r["wage_arrears"],
                    "firm_arrears": r["firm_wage_arrears"],
                    "jobs": r["active_policy"]["employed_workers"],
                }
                for r in record["periods"]
            ],
        }
    template = (ROOT / "site/shocks.template.html").read_text()
    (ROOT / "site/shocks.html").write_text(
        template.replace(
            "{{SHOCK_DATA}}",
            json.dumps(ui, separators=(",", ":"), allow_nan=False).replace("<", "\\u003c"),
        )
    )
    print(
        f"Wrote {len(data['paths'])} named paths, {len(data['sensitivity_summaries'])} sensitivity runs, freeze boundaries, incentives and maxima."
    )


if __name__ == "__main__":
    main()
