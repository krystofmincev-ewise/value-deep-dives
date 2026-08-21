# Value Deep Dives

Value Deep Dives is a public, time-stamped investment research notebook for company valuations, market and sector screens, decision reviews, and technical experiments that test business claims.

> Independent research for education and documentation—not investment advice or a solicitation. I may hold securities discussed here. See the [full disclaimer](DISCLAIMER.md).

## Why this exists

This repository grew out of a small but encouraging set of LLM-assisted idea-generation exercises. I started with a rough screening heuristic: companies whose trailing revenue was near their equity market value (a price-to-sales ratio around 1×), then used deep-research tools to compare candidates across a consistent set of rebound and survival indicators.

That work surfaced Wix, Snap, and Amplitude. I supplemented the model output with primary and qualitative research, including a 20VC interview with Wix's founder and roughly four hours of interviews and other material featuring Evan Spiegel. I bought all three; Amplitude was purchased one day before earnings, and each subsequently appreciated after its next reported results. In a separate exercise, I studied Leopold Aschenbrenner's publicly disclosed holdings and asked LLMs to propose adjacent companies he might plausibly own. Deeper research on one of the results led me to IREN, which also appreciated after purchase.

Those outcomes are motivation, not proof. The sample is tiny and selected, the holding periods are short, the research was not prospectively registered, and the results may reflect market exposure, event timing, selection bias, or luck. They are not an audited or benchmark-adjusted track record. The point of this repository is to move from memorable anecdotes to a prospective, falsifiable record: what I believed, why I believed it, what would prove me wrong, and what happened.

## What changes with this repository

From 17 August 2026 onward, formal ideas can be judged from contemporaneous records rather than reconstructed memories:

- Each coverage cycle culminates in one canonical final report, valuation, and decision; same-cycle draft evolution remains in Git history.
- Bull, base, and bear cases state their assumptions and time horizon.
- Screens retain the full candidate set, including passes and abandoned ideas.
- Updates supersede prior work without silently rewriting it.
- Outcomes are assessed against predeclared benchmarks and rules.
- Sources, LLM assistance, uncertainty, position disclosures, and conflicts are made explicit.
- Mistakes and negative results belong here alongside successes.

The [prospective scorecard](track-record/README.md) starts empty. Wix, Snap, Amplitude, and IREN are retrospective origin stories and are not counted as prospective calls.

## Research process

```text
market / sector / theme research
              ↓
       reproducible screen
              ↓
       company deep dive
              ↓
   scenarios + target prices
              ↓
      decision + monitoring
              ↓
        dated retrospective
```

The detailed process lives in [methodology](methodology/README.md). A completed deep dive should make it easy to find the source cutoff, reference price, target horizon, bull/base/bear valuation, variant view, key assumptions, catalysts, risks, falsifiers, confidence, and position disclosure.

## Current research

| Company | Ticker | Status | Current target | Workspace |
| --- | --- | --- | --- | --- |
| Snap Inc. | SNAP | Draft deep dive complete; prospective registration pending | [Draft valuation available](companies/snap/valuation/2026-W34-valuation.md) | [Open the Snap deep dive](companies/snap/README.md) |

The Snap dossier is self-contained under [`companies/snap/`](companies/snap/README.md), including identity, sources, research modules, one canonical final report and valuation for each coverage cycle, decisions, and company-specific experiments. Its [first coverage-cycle manifest](companies/snap/coverage-cycles/2026-W34-01-initial/README.md) binds the current records into one valuation generation. The records remain drafts until the documented market-price and prospective-registration gates are complete.

## Repository map

| Area | Purpose |
| --- | --- |
| [Companies](companies/README.md) | Self-contained company dossiers and dated research history |
| [Discovery](discovery/README.md) | Screens, sector maps, and cross-company themes |
| [Track record](track-record/README.md) | Prospective forecasts, decisions, and retrospectives |
| [Research schemas](schemas/README.md) | Machine-readable identity, evidence, event, and evaluation contracts |
| [Experiments](experiments/README.md) | Reusable or cross-company software and empirical work |
| [Data](data/README.md) | Shared, redistributable datasets and provenance rules |
| [Methodology](methodology/README.md) | Investment process, valuation, evidence, and scoring rules |
| [Research tooling](methodology/RESEARCH_TOOLING.md) | Layered APIs, CLIs, authenticated Chrome, Browser, and Computer Use workflows |
| [Templates](templates/README.md) | Standard starting points for new research |

Run `npm run research:validate` before publishing or committing research-system changes. It discovers every repository skill, validates skill metadata and referenced resources, parses all JSON schemas and templates, checks required CLI routes and public-data contracts, rejects separately billable API markers in runtime code, and then runs the complete automated test suite. Runtime subscription sign-in is deliberately a visible Chrome check rather than a credential inspection.

Company-specific notes, data, and experiments stay inside that company's folder. Root-level experiments and data are reserved for work that genuinely serves several companies or studies.

## Navigation conventions

- Company paths use lowercase tickers, for example `companies/snap/`.
- The company root remains the durable identity and current-view URL.
- Each initial or repeat valuation has an ISO-week coverage package such as `coverage-cycles/2026-W34-01-initial/` or `coverage-cycles/2027-W05-02-revaluation/`.
- Historical research within a coverage cycle uses `YYYY-MM-DD-descriptive-slug.md`.
- Flat YAML front matter makes status, dates, tickers, tags, and disclosures searchable.
- Each company landing page points to its current view and chronological coverage-cycle history.
- Discovery studies link to the companies they surfaced, and company pages link back to their originating studies.

GitHub Markdown and search are the canonical interface. A generated index or website can be added when the archive is large enough to justify one.

## Recreate the research environment

The public repository contains the code, schemas, templates, methodology, and
repository-local agent skills needed to reproduce the research workflow. It
does not contain passwords, subscription details, cookies, browser profiles,
or private source captures.

Requirements:

- Git and Node.js 22 or newer.
- Codex with the repository opened as its workspace for the instructions in
  `AGENTS.md` and the skills in `.agents/skills/`.
- Chrome, plus your own signed-in accounts for any optional subscription
  services you use, such as Gemini, YouTube Premium, Revelio Labs, FT, or
  SemiAnalysis.
- The optional open-source
  [Archive News Chrome extension](https://github.com/krystofmincev-ewise/archive-news-extension)
  for the extension-backed archive route.

Start from a fresh machine with:

```sh
git clone https://github.com/krystofmincev-ewise/value-deep-dives.git
cd value-deep-dives
npm run research:init
npm run research:validate
npm run research:check
```

Follow the extension repository's installation instructions if you want to use
`npm run research:archive -- open-extension ...`. Sign in to subscription
services directly in Chrome; never put their credentials in this repository.
Set `SEC_USER_AGENT` in your local environment to a truthful project name and
monitored contact before using the SEC CLI.

GitHub is the recovery copy for tracked research, tooling, and documentation.
The ignored `.local/` directory is deliberately machine-local and can contain
caches, temporary captures, and licensed material that must not be published.
Chrome authentication and extension settings are also local-only. Back up any
of that private state separately in encrypted storage if you need to preserve
it; a fresh clone will recreate the directory structure, not those contents.

## How LLMs are used

LLMs help with discovery, synthesis, source finding, adversarial critique, and experiment design. They can hallucinate, misread documents, and hide uncertainty behind fluent prose. Material factual claims and valuation inputs therefore remain the author's responsibility and should be checked against cited primary sources. See the [research standards](methodology/RESEARCH_STANDARDS.md).

## License and reuse

Original research is shared under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), and original experiment code is available under the MIT License. Third-party material remains the property of its respective owners. See [license details](LICENSE.md) and the [data policy](DATA_POLICY.md).
