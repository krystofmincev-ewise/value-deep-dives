# Research standards

## Evidence hierarchy

Prefer evidence in roughly this order:

1. Audited filings, regulatory records, and official datasets
2. Company investor materials and prepared disclosures
3. Earnings calls, customer or partner evidence, and reproducible datasets
4. Management interviews, industry experts, and reputable reporting
5. Secondary analysis, social media, and unsourced claims

Authority does not guarantee truth. Company materials and founder interviews are useful but promotional; important claims should be triangulated.

## Citation rules

- Cite material factual claims close to the claim.
- Record publisher, title, publication date, access date, URL, and intended use in the company or study source log.
- Distinguish reported facts, author calculations, estimates, assumptions, and opinions.
- State the information cutoff for each formal memo.
- Link to original sources rather than copying full articles, reports, filings, or transcripts.
- Document transformations for derived metrics and datasets.

See the repository-wide [data policy](../DATA_POLICY.md).

For APIs, authenticated sources, browser sessions, and temporary captures, also follow the [research tooling runbook](RESEARCH_TOOLING.md).

## LLM-assisted research

LLMs can support:

- candidate generation and source discovery;
- document synthesis and structured comparison;
- adversarial review and missing-question generation;
- code scaffolding, analysis, and experiment design.

LLM output is not evidence. For material work, record the provider/model, date, task summary, source set, and what was independently verified. Never cite an LLM in place of the underlying source. The author remains responsible for facts, calculations, conclusions, and disclosed uncertainty.

## Publication standard

Each coverage cycle has one canonical company report and one canonical valuation. While the cycle is an active draft, new evidence should improve those files in place; same-cycle working drafts must not be cited or exposed as prior theses. Git history is the working-draft audit trail. Once the cycle is finalized or prospectively registered, its canonical records are immutable and a later revaluation belongs to a new ISO-week coverage cycle.

A formal thesis or target price should include:

- `as_of` and `source_cutoff` dates;
- company identity, currency, and coverage status;
- research status: `draft`, `published`, `superseded`, or `withdrawn`;
- position disclosure: `long`, `short`, `no_position`, or `not_disclosed`;
- reference price, exact timestamp/date, and source;
- unweighted bull, base, and bear narrative values when used, plus separately
  labeled distribution outputs and target horizon when modeled;
- variant perception and key assumptions;
- catalysts, risks, falsifiers, and review date;
- confidence and material unknowns;
- links to sources and, when applicable, the prior finalized coverage-cycle report.

Canonical reports must also be understandable to an intelligent non-specialist. Explain decision-critical finance, accounting, sector, and probability mechanics where the reader first needs them; a glossary alone is insufficient. Prefer short `Plain-English aside` callouts tied to the adjacent claim, with a small example or formula when helpful. The explanation must preserve evidentiary labels and must not introduce unaudited facts or model assumptions. Avoid patronizing language and avoid burying the core story under definitions of nonessential terms.

If a report presents more than one valuation horizon, it must link one
schema-backed valuation-horizon contract. Every horizon described as modeled
must be complete for its declared quantity. Narrative scenarios must not be
displayed as percentiles, and an interim fair-value checkpoint must not be
omitted merely because market-price convergence is outside the model.

Drafts must be visibly marked. A same-cycle draft is working state, not a historical report. Backfilled work must say `retrospective` and must not enter the prospective scorecard.

Review status is part of the draft state. A material edit to the fact set, model,
horizon contract, canonical valuation, report, or decision invalidates the prior
review snapshot. Mark it stale and rerun review before describing the dossier as
reviewed, passed, release-ready, published, or complete.

## Intellectual honesty

- Seek the strongest disconfirming case, not merely a token bear case.
- Preserve failed screens, passes, negative experiments, and losing theses.
- Do not change scoring rules or target definitions after observing outcomes.
- Do not call a company “oversold” unless a technical definition is provided. “Low-multiple candidate” is usually more precise.
- Do not treat a prototype as proof that a public company can match a competitor's proprietary data, distribution, auction liquidity, measurement stack, or execution.
- Separate confidence in a business outcome from confidence in a target price.

## Public-information boundary

Only public information belongs here. Do not solicit, use, or publish material non-public information. Do not commit brokerage records, private messages, credentials, or personal identifiers. When source rights are unclear, link and summarize rather than archive.
