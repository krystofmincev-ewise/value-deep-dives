---
name: company-investment-research
description: "Build a source-grounded, auditable investment view for a public company and map it to an attractive/neutral/unattractive/insufficient-evidence stance plus buy/add/hold/reduce/exit/watch/pass action when portfolio context is supplied. Use for company deep dives, fundamental analysis, buy-hold-sell questions, thesis creation or updates, financial-statement and quality-of-earnings review, market-expectations analysis, valuation, peer comparison, or cross-sector diligence in biopharma, AI/software/semiconductors, energy/materials/utilities, financial institutions, consumer/fashion/retail, and adjacent sectors."
---

# Company Investment Research

Build one decision-oriented dossier from canonical evidence. Keep facts, author calculations, assumptions, opinions, research stance, and portfolio action distinct.

## Establish the contract

1. Read `DATA_POLICY.md`, `methodology/RESEARCH_STANDARDS.md`, `methodology/RESEARCH_TOOLING.md`, `methodology/INVESTMENT_PROCESS.md`, `methodology/VALUATION_FRAMEWORK.md`, and `methodology/CAPABILITY_ARCHITECTURE.md`.
2. Record the company, security, decision to support, horizon, source cutoff, reporting currency, benchmark, and desired depth: triage, initial deep dive, update, or adversarial review.
3. Copy `templates/company-identity.md` when no verified identity record exists. Resolve legal entity, listing, CIK/LEI, aliases, fiscal calendar, security type, corporate actions, and the economic perimeter before joining sources.
4. Run `npm run research:records -- validate-identity <path>` after completing the record. Do not use ticker alone as a canonical entity key.
5. For an initial deep dive or full revaluation, assign the next company coverage-cycle number and copy `templates/coverage-cycle-readme.md` into `companies/<ticker>/coverage-cycles/<YYYY-Www>-<NN>-<kind>/README.md`. Use the ISO week-year. Keep `identity.md` and the company landing page at the durable company root, link the prior cycle, and put new cycle-specific research, sources, theses, valuations, decisions, models, and reviews inside the cycle folder. A narrow monitoring update can remain in the active cycle; a replacement formal thesis or valuation starts a new cycle.

If the request lacks a personalized hurdle, risk limit, tax context, or current position, produce a research stance and clearly labelled illustrative action mapping—not personalized advice.

## Plan the evidence

Start from the claims that could change the decision. Build a compact question/evidence matrix covering:

- business model, customers, distribution, and unit economics;
- industry structure, market expectations, competition, and base rates;
- management incentives, governance, and capital allocation;
- historical statements, accounting quality, balance sheet, dilution, and financing needs;
- sector-specific assets, operating metrics, constraints, and failure modes;
- variant perception, catalysts, risks, strongest countercase, and falsifiers;
- valuation methods, sensitivities, reference price, and benchmark.

Use the smallest sector reference that fits:

- AI, software, internet, cloud, or semiconductors: read `references/sector-ai-software-semiconductors.md`.
- Oil, gas, power, utilities, renewables, mining, or materials: read `references/sector-energy-materials.md`.
- Banks, insurers, asset managers, lenders, or exchanges: read `references/sector-financials.md`.
- Apparel, luxury, retail, brands, restaurants, or consumer products: read `references/sector-consumer-fashion.md`.
- Drugs, biotechnology, trials, or regulatory readouts: invoke `$biopharma-evidence-research` and read `methodology/BIOPHARMA_RESEARCH.md`.

Read `references/financial-statements-and-expectations.md` for every company with filed financial statements and `references/decision-and-valuation.md` before assigning a stance.

## Retrieve from the source outward

1. Prefer official filings, regulators, datasets, issuer releases, and investor materials.
2. Use the repository SEC and biomedical CLIs where applicable. Use authenticated Chrome workflows only under `methodology/RESEARCH_TOOLING.md` and the matching narrow skill.
3. Record publisher, canonical URL, publication and access dates, `known_at` or accepted timestamp when available, evidence type, access, rights, retrieval, claim supported, verification, and capture state.
4. Keep restricted raw material under `.local/`. Commit citations and original analysis, never copied paid content, credentials, or personal data.
5. Treat LLM output, screeners, interviews, consensus, and alternative data as leads or evidence classes—not self-authenticating facts.

Do not silently substitute yfinance, a scraped page, current revised data, or an LLM estimate for a missing formal input. Mark the gap and reduce confidence.

## Normalize before interpreting

Reconcile periods, fiscal calendars, units, currencies, segments, restatements, amendments, discontinued operations, one-offs, stock compensation, leases, working capital, capex, debt, cash restrictions, share classes, dilution, and partner economics. Preserve both economic validity and when the fact became public.

Use deterministic calculations for statement bridges, growth, margins, unit economics, enterprise value, per-share values, expected return, and sensitivities. Fail closed when an input is missing; never hide an opinion inside a default constant.

## Infer expectations and variant perception

Use at least two lenses when practical:

- reverse the current price into the operating assumptions it appears to require;
- compare point-in-time consensus, guidance, options, or peers when a lawful timestamped source exists;
- examine what changed in estimates, multiples, positioning, or the narrative;
- distinguish a differentiated factual belief from a differentiated interpretation or time horizon.

State what is probably already priced, what evidence would prove the market right, and why any claimed edge could persist.

## Value and challenge the company

Build coherent bear, base, and bull operating narratives. Choose methods that fit the economics; use an independent cross-check with different failure modes. Reconcile enterprise to equity value and diluted per-share value explicitly.

Run an adversarial pass on the same frozen fact set:

- strongest counter-thesis;
- accounting or identity errors that would reverse the result;
- financing, dilution, liquidity, regulatory, cyclicality, and terminal-value risks;
- correlated evidence counted twice;
- missing primary evidence and stale timestamps;
- conditions that make the company uninvestable even if the business thesis is correct.

## Produce stance and action separately

Apply `references/decision-and-valuation.md`. Predeclare the horizon, benchmark, excess-return hurdle, downside or permanent-loss limit, and evidence gate.

Return:

1. identity and information cutoff;
2. one-paragraph view and variant perception;
3. claim/evidence table with verification state;
4. financial and sector-driver history;
5. bear/base/bull valuation and sensitivities;
6. catalysts, risks, strongest countercase, falsifiers, and open questions;
7. research stance: `attractive`, `neutral`, `unattractive`, or `insufficient_evidence`;
8. portfolio action only when context permits: `buy`, `add`, `hold`, `reduce`, `exit`, `watch`, or `pass`;
9. confidence, material unknowns, next review, and monitoring plan;
10. links to the company landing page, coverage-cycle manifest, identity, source log, thesis, valuation, decision, and public commit when published.

Use `$event-driven-investment-research` for any catalyst that merits a prospective probability and price-reaction record. Never let a single near-term catalyst replace survival, capital structure, or long-term value analysis.
