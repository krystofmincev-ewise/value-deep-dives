---
type: company_coverage_cycle
coverage_cycle_id: "{TICKER}-{YYYY-Www}-{NN}"
company: "{Legal company name}"
ticker: "{TICKER}"
cycle_number: 1
cycle_kind: initial
iso_week: "{YYYY-Www}"
status: active
research_status: researching
started_at: "{YYYY-MM-DD}"
as_of: "{YYYY-MM-DD}"
source_cutoff_at: null
prior_cycle_path: null
supersedes: []
tags: []
---

# {Company} coverage cycle {NN} — {YYYY-Www} — {kind}

> This manifest defines one initial or repeat valuation generation. Published records are immutable; later evidence belongs in a dated update or a new linked cycle.

## Cycle contract

| Field | Value |
| --- | --- |
| Cycle ID | `{TICKER}-{YYYY-Www}-{NN}` |
| ISO week | `{YYYY-Www}` |
| Company cycle number | `{NN}` |
| Kind | Initial / revaluation / restart |
| Decision supported | {question} |
| Started | {date} |
| Source cutoff | {exact timestamp or not yet frozen} |
| Status | Active / complete / superseded / withdrawn |
| Prior cycle | {link or none} |

## Start here

| Depth | Record | Purpose |
| --- | --- | --- |
| Summary | [Thesis]({path}) | View, variant perception, valuation range, and falsifiers |
| Decision | [Decision]({path}) | Stance, action mapping, hurdle, and review trigger |
| Model | [Valuation]({path}) | Assumptions, scenarios, sensitivities, and arithmetic |
| Audit | [Sources]({path}) | Provenance, rights, retrieval, and verification |

## What this cycle must answer

- The decision and horizon being reassessed.
- What changed since the prior cycle and what evidence carried forward.
- Which prior thesis or valuation this cycle supersedes.
- Which material uncertainties remain unresolved.

## Canonical outputs

| Artifact | Path | Status | Supersedes |
| --- | --- | --- | --- |
| Research plan | | | |
| Source log | | | |
| Thesis | | | |
| Valuation | | | |
| Decision | | | |
| Independent or adversarial review | | | |
| Deterministic verifier | | | |

## Change ledger

| Area | Prior cycle | This cycle | Evidence / reason |
| --- | --- | --- | --- |
| Business view | | | |
| Forecast | | | |
| Valuation | | | |
| Risks / falsifiers | | | |
| Confidence | | | |
| Decision | | | |

## Cycle boundary and transfer notes

Keep cycle-specific plans, sources, research, theses, valuations, decisions, models, and reviews in this folder. Link stable company identity from the company root. A complete copy of `companies/<ticker>/` should preserve the identity, every cycle manifest, all public research artifacts, and their relative links; licensed local-only captures remain excluded under the data policy.

## Next review

State the next review date, trigger, and whether it should be a monitoring update inside this cycle or a new full revaluation cycle.
