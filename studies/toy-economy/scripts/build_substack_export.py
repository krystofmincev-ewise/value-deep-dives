"""Make a public, native-editor paste source from the reviewed manuscript."""

from __future__ import annotations

import html
import re
from pathlib import Path
from urllib.parse import urljoin

import markdown  # type: ignore[import-untyped]  # Optional rendering dependency.

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = "https://krystofmincev-ewise.github.io/value-deep-dives/"
SLUG = "05-who-buys-what-ai-makes"


def main() -> None:
    source = (ROOT / "articles" / f"{SLUG}.md").read_text()
    lines = source.splitlines()
    title = lines[0].removeprefix("# ")
    subtitle = lines[2].strip("*")
    # Title and subtitle occupy native Substack fields; body starts with reading links.
    body = markdown.markdown("\n".join(lines[4:]), extensions=["tables", "fenced_code"])
    body = re.sub(
        r'(href|src)="([^"]+)"',
        lambda match: f'{match[1]}="{html.escape(urljoin(PUBLIC_ROOT + "site/", match[2]), quote=True)}"',
        body,
    )
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} — publication source</title><style>body{{max-width:720px;margin:40px auto;padding:20px;font:19px/1.7 Georgia,serif}}img{{display:block;max-width:560px;width:100%;height:auto;margin:32px auto}}h2{{margin-top:2.5em}}a{{color:#236654}}</style></head><body><header><h1>{html.escape(title)}</h1><p>{html.escape(subtitle)}</p></header><article id="substack-body">{body}</article></body></html>'''
    (ROOT / "site" / f"{SLUG}-substack.html").write_text(page)
    # A clear public landing page when the study subtree is served by GitHub Pages.
    (ROOT / "index.html").write_text((ROOT / "START-HERE.html").read_text())


if __name__ == "__main__":
    main()
