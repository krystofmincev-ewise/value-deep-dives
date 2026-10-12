"""Render the combined narrative and appendix, preserving earlier editions."""

from __future__ import annotations

import hashlib
import html
import json
import re
from pathlib import Path
from typing import TypedDict

import markdown  # type: ignore[import-untyped]  # Optional renderer ships without stubs.

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
SLUG = "05-who-buys-what-ai-makes"
FIGURE_PATTERN = re.compile(
    r'<p><img alt="[^"]*" src="(\.\./outputs/[^\"]+\.png)" /></p>\s*<p>(<em>.*?</em>)</p>',
    re.DOTALL,
)


class FigureRecord(TypedDict):
    id: str
    title: str
    steps: list[dict[str, str]]


def render_figure(path: Path, caption: str, number: int, animated: bool) -> str:
    records: list[FigureRecord] = json.loads((path.parent / "manifest.json").read_text())
    record = next(item for item in records if item["id"] == path.stem)
    controls = ""
    if animated:
        steps = html.escape(json.dumps(record["steps"], ensure_ascii=False), quote=True)
        title = html.escape(record["title"], quote=True)
        controls = f'''<div class="motion-controls" role="group" aria-label="Steps for {title}" hidden data-steps="{steps}">
<div class="step-status" aria-live="polite" aria-atomic="true"></div>
<div class="motion-buttons"><button type="button" data-action="previous">Previous</button><button type="button" data-action="next">Next step</button><button type="button" data-action="play">Play steps</button><button type="button" data-action="reset">Show all</button></div><p class="motion-explanation"></p></div>'''
    svg = path.with_suffix(".svg").read_text()
    return f'''<figure class="teaching-figure" id="figure-{path.stem}" data-diagram="{path.stem}"><figcaption><span class="figure-number">PICTURE {number:02}</span><h3>{html.escape(record["title"])}</h3></figcaption><div class="figure-body">{controls}<div class="diagram-image">{svg}</div></div><div class="figure-caption">{caption}</div></figure>'''


def render_page(slug: str, animated: bool = False) -> None:
    source = (ROOT / "articles" / f"{slug}.md").read_text()
    if animated:
        source = source.replace(
            f"**Static edition · [Follow the pictures step by step →](../site/{slug}-animated.html)**",
            f"**Step-by-step edition · [See every picture at once →](../site/{slug}.html)**",
        )
    body = markdown.markdown(source, extensions=["tables", "fenced_code", "toc"])
    number = 0

    def replace_figure(match: re.Match[str]) -> str:
        nonlocal number
        number += 1
        path = (SITE / match[1]).resolve()
        if not path.is_relative_to(ROOT / "outputs"):
            raise ValueError(f"Figure outside study outputs: {path}")
        return render_figure(path, match[2], number, animated)

    body = FIGURE_PATTERN.sub(replace_figure, body)
    if "<img " in body:
        raise ValueError("An illustration is missing its caption or manifest mapping.")
    title = html.escape(source.splitlines()[0].lstrip("# "))
    script = '<script src="teaching.js" defer></script>' if animated else ""
    guide = (
        "Use Next step to follow a picture, or Show all to see it complete. Nothing plays automatically."
        if animated else "Every picture is complete and still. Its caption tells you what to notice."
    )
    aside = f'<aside class="reading-guide"><strong>Follow the people, then the payments</strong><p>{guide}</p><div class="role-key"><span class="worker-key">Workers and former workers</span><span class="owner-key">Owners</span><span class="equipment-key">Equipment</span></div></aside>' if number else ""
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="teaching.css"><style>.table-scroll{{overflow-x:auto}}.table-scroll table{{min-width:560px}}.teaching-article code{{overflow-wrap:anywhere}}.teaching-article pre{{overflow-x:auto}}html{{scroll-behavior:auto}}</style>{script}</head><body><a class="skip-link" href="#article">Skip to the article</a><main class="article teaching-article" id="article"><nav><a href="https://krystofmincev.substack.com/p/ai-needs-a-customer">The original GDP paper</a><a href="{SLUG}.html">Combined paper</a><a href="05-appendix.html">Appendix</a><a href="adoption.html">Explore the accounts</a></nav>{aside}{body}<footer>Research explainer · 12 October 2026 · Two simulation families, with separate extensions · <a href="../README.md">Code and reproduction</a></footer></main></body></html>'''
    page = page.replace("<table>", '<div class="table-scroll" role="region" aria-label="Comparison table" tabindex="0"><table>').replace("</table>", "</table></div>")
    suffix = "-animated" if animated else ""
    (SITE / f"{slug}{suffix}.html").write_text(page)
    print(f"Built {slug}{suffix}: {number} figures")


def main() -> None:
    render_page(SLUG)
    render_page(SLUG, animated=True)
    render_page("05-appendix")
    inputs = [ROOT / "articles" / f"{slug}.md" for slug in (SLUG, "05-appendix")]
    inputs += [Path(__file__), ROOT / "scripts/combined_figures.py"]
    for directory in ("outputs/teaching", "outputs/adoption/figures", "outputs/combined"):
        inputs.extend(sorted((ROOT / directory).glob("*.svg")))
        inputs.append(ROOT / directory / "manifest.json")
    record = {
        "description": "Combined reading edition: source and reused figure provenance; independent manuscript reviews are recorded separately.",
        "sha256": {str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest() for path in inputs},
    }
    (ROOT / "outputs/combined/build-manifest.json").write_text(json.dumps(record, indent=2) + "\n")


if __name__ == "__main__":
    main()
