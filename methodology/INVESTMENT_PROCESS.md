# Investment process

The process is designed to turn broad idea generation into research that can be challenged and evaluated later.

## 1. Discover

Discovery can begin with a quantitative screen, sector map, product observation, public portfolio study, or cross-company theme. A discovery study should preserve:

- its date and information cutoff;
- the full starting universe and result set where licensing permits;
- formulas, filters, data sources, and exclusions;
- the criteria used to promote or reject candidates;
- limitations, including stale or missing data.

The full cohort matters. Saving only the eventual winners creates survivorship bias.

## 2. Triage

Triage asks whether a candidate deserves a full deep dive. At minimum:

- Is the apparently low valuation real after debt, cash, dilution, and cyclicality?
- Is there a plausible path to survival or improved fundamentals?
- What does the market appear to expect?
- What evidence could create a genuinely variant view?
- What are the quickest reasons to pass?

Passes and abandoned ideas should remain visible in the originating discovery study.

## 3. Deep dive

A company dossier should cover only the modules necessary for the question, typically:

- business model and unit economics;
- product, customers, distribution, and competition;
- management, incentives, and capital allocation;
- historical financials, cash needs, dilution, and balance sheet;
- industry structure and relevant base rates;
- variant perception, catalysts, risks, and falsifiers;
- valuation scenarios and sensitivities;
- unresolved questions and disconfirming evidence.

The company landing page is the current navigation layer. Initial theses, valuation snapshots, and material changes are dated records.

## 4. Value

Formal valuation work uses bull, base, and bear cases with explicit assumptions, a source cutoff, reference price, target date or horizon, and sensitivity analysis. The [valuation framework](VALUATION_FRAMEWORK.md) defines the minimum standard.

## 5. Decide

An investment decision is distinct from a research conclusion. First record the research stance as `attractive`, `neutral`, `unattractive`, or `insufficient_evidence`. A decision record may then document buy, add, hold, reduce, exit, watch, or pass. It should link to the research available at the time and state:

- action and timestamp;
- reference price or actual fill, clearly labelled;
- thesis, expected value, and key downside;
- catalyst and horizon;
- falsifiers and review triggers;
- position disclosure and any omitted private information.

Use `reduce` or `exit` for the portfolio action often described as “sell.” A sell research rating without a current position should normally map to `pass`; a short position requires its own downside, borrow, liquidity, and risk case. `Hold` requires an existing position. Without one, use `watch` or `pass`.

Personal sizing can remain private. If omitted, say so rather than implying an equal-weight portfolio.

## 6. Monitor and update

New evidence creates a new dated update. Do not silently edit a published thesis or target after a material event. An update should state what changed, what did not, and which earlier record it supersedes.

A routine monitoring note can remain in the active coverage cycle. Start a new coverage cycle when the company is re-underwritten, a new formal valuation replaces the prior one, coverage resumes after a meaningful pause, or the decision question changes materially. The new cycle links to—but never rewrites—the prior cycle.

Target statuses are `active`, `reached`, `expired`, `invalidated`, or `superseded`. Coverage statuses are `active`, `watching`, `paused`, or `archived`.

## 7. Review

At the declared horizon—or when the thesis breaks—publish a retrospective that separates:

- investment outcome;
- thesis outcome;
- process quality;
- luck and external factors;
- lessons and prospective methodology changes.

Both misses and successes belong in the archive.

## File and identifier conventions

- Durable company root: `companies/<lowercase-ticker>/`
- Stable company records: keep `README.md` and `identity.md` at the company root so links and entity joins survive every revisit.
- Coverage-cycle folders: `companies/<lowercase-ticker>/coverage-cycles/<YYYY-Www>-<NN>-<kind>/`, using the ISO week-year and zero-padded company cycle number. Examples: `2026-W34-01-initial` and `2027-W05-02-revaluation`.
- Coverage-cycle kinds: use a short descriptive value such as `initial`, `revaluation`, or `restart`. A narrow monitoring note does not require a new cycle; a replacement thesis or valuation does.
- Coverage-cycle manifest: every cycle has a `README.md` that records its cycle ID, sequence, kind, cutoff, status, prior cycle, exact canonical outputs, and what changed. Once a cycle is superseded, preserve it as an immutable audit package.
- Cycle contents: keep cycle-specific plans, source logs, research, theses, valuations, decisions, models, and reviews inside that cycle. Shared identity records and genuinely reusable company material may remain at the company root.
- Historical documents within a cycle: `YYYY-MM-DD-descriptive-slug.md`.
- Company forecast IDs: `YYYY-TNNN` (for example `2026-T001`), assigned sequentially in the [forecast ledger](../track-record/forecast-ledger.csv)
- Discovery studies: `discovery/<kind>/YYYY-MM-DD-descriptive-slug/`
- Dates and timestamps: ISO 8601; include timezone for decisions and formal publication timestamps
- Currencies: ISO 4217 codes such as `USD` or `EUR`

The company landing page is the stable current-view pointer and chronological cycle index. Copying the complete company root transfers its identity plus every valuation generation without relying on an external index. If a company changes its ticker, retain the original folder to preserve links and add the new ticker and aliases to metadata.

Do not move already-public records solely to adopt this convention. Add a coverage-cycle manifest that indexes their existing paths, then place the next full revaluation in the new structure. This preserves public URLs while making all future rounds explicit.
