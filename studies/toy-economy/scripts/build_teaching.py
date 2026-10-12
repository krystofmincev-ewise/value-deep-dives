"""Build the static-first illustrated article and its optional motion edition."""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[1]
ARTICLE = ROOT / "articles/03-when-the-economy-breaks.md"
SITE = ROOT / "site"
SLUG = "03-when-the-economy-breaks"


def figure_markup(identifier: str, record: dict, caption: str, animated: bool) -> str:
    svg = (ROOT / "outputs/teaching" / f"{identifier}.svg").read_text()
    controls = ""
    if animated:
        steps = html.escape(json.dumps(record["steps"], ensure_ascii=False), quote=True)
        controls = f'''<div class="motion-controls" role="group" aria-label="Steps for {html.escape(record["title"])}" hidden data-steps="{steps}">
<div class="step-status" aria-live="polite" aria-atomic="true"></div>
<div class="motion-buttons"><button type="button" data-action="previous">Previous</button><button type="button" data-action="next">Next step</button><button type="button" data-action="play">Play steps</button><button type="button" data-action="reset">Show all</button></div>
<p class="motion-explanation"></p></div>'''
    return f'''<figure class="teaching-figure" id="figure-{identifier}" data-diagram="{identifier}">
<figcaption><span class="figure-number">PICTURE {identifier[:2]}</span><h3>{html.escape(record["title"])}</h3></figcaption>
<div class="figure-body">{controls}<div class="diagram-image">{svg}</div></div>
<div class="figure-caption">{caption}</div>
</figure>'''


def build_edition(animated: bool) -> None:
    source = ARTICLE.read_text()
    if animated:
        source = source.replace(
            "**This is the static illustrated edition. [Follow the same story with step-by-step animations →](../site/03-when-the-economy-breaks-animated.html)**",
            "**This is the animated edition. [Read the complete static edition →](../site/03-when-the-economy-breaks.html)**",
        )
    body = markdown.markdown(source, extensions=["tables", "fenced_code"])
    records = {
        r["id"]: r for r in json.loads((ROOT / "outputs/teaching/manifest.json").read_text())
    }
    pattern = re.compile(
        r'<p><img alt="[^"]*" src="\.\./outputs/teaching/([^"]+)\.png" /></p>\s*<p>(<em>.*?</em>)</p>',
        re.DOTALL,
    )
    body, count = pattern.subn(
        lambda match: figure_markup(match[1], records[match[1]], match[2], animated), body
    )
    if count != len(records):
        raise ValueError(f"Expected {len(records)} figure/caption pairs, found {count}")
    mode = "Animated" if animated else "Static"
    intro = (
        "Choose Next step to follow one part at a time, or Play steps to watch the sequence. Nothing starts by itself. Moving dots show direction; their size does not represent an amount. In the shrinking sequence, the sales number moves into the next round’s income. Labels carry the quantities. Motion adds no transactions and is not a clock for the economy."
        if animated
        else "Every picture is complete and still. Read the caption after each one; it tells you what to notice before continuing."
    )
    script = '<script src="teaching.js" defer></script>' if animated else ""
    title = html.escape(source.splitlines()[0].lstrip("# "))
    suffix = "-animated" if animated else ""
    document = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} · {mode} edition</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="teaching.css">{script}</head><body>
<a class="skip-link" href="#article">Skip to the article</a>
<main class="article teaching-article" id="article"><nav aria-label="Reading editions"><a href="https://krystofmincev.substack.com/p/ai-needs-a-customer">The original: AI needs a customer</a><a href="{SLUG}.html" {'aria-current="page"' if not animated else ""}>Static edition</a><a href="{SLUG}-animated.html" {'aria-current="page"' if animated else ""}>Animated edition</a></nav>
<aside class="reading-guide" aria-label="How to read this edition"><strong>{mode} illustrated edition</strong><p>{intro}</p><div class="role-key"><span class="worker-key">Workers / former workers</span><span class="owner-key">Owners</span><span class="equipment-key">Equipment</span></div></aside>
{body}
<footer>Draft · 11 October 2026 · Same article, same numerical examples in both editions. <a href="shocks.html">Explore the underlying simulation</a>. <a href="../research/visual-data-review.md">Inspect the figure data</a>.</footer></main></body></html>'''
    (SITE / f"{SLUG}{suffix}.html").write_text(document)


def build_editions(include_animated: bool = True) -> None:
    build_edition(False)
    if include_animated:
        build_edition(True)
    print(
        "Built static illustrated article"
        + (" and matching animated edition." if include_animated else ".")
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--static-only", action="store_true")
    args = parser.parse_args()
    build_editions(not args.static_only)
