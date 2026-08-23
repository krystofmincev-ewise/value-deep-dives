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
final_report_path: "{relative path to YYYY-Www-final-report.md}"
valuation_path: "{relative path to YYYY-Www-valuation.md}"
decision_path: "{relative path to YYYY-Www-decision.md}"
valuation_contract_path: "{relative path to valuation-horizon contract JSON}"
forecast_path: null
review_status: not_requested
review_path: null
reviewed_at: null
finalized_at: null
final_report_hash: null
valuation_hash: null
decision_hash: null
review_hash: null
valuation_contract_hash: null
model_hash: null
verifier_hash: null
tags: []
---

# {Company} coverage cycle {NN} — {YYYY-Www} — {kind}

> This manifest defines one initial or repeat valuation generation. While active, research evolves one canonical report and valuation in place. Once finalized, they are immutable and later revaluation belongs in a new linked cycle.

> Run `npm run research:company -- validate {company directory}` before review and `npm run research:validate` before publication. A passed review freezes the report, valuation, decision, valuation contract, model, verifier, and review hashes; any material edit makes the review stale.

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
| Summary | [Final report]({path}) | View, variant perception, valuation range, stance, and falsifiers |
| Decision | [Decision]({path}) | Stance, action mapping, hurdle, and review trigger |
| Model | [Valuation]({path}) | Assumptions, scenarios, sensitivities, and arithmetic |
| Horizon contract | [Valuation-horizon contract]({path}) | Quantity, exact outputs, model paths, and horizon relationship |
| Audit | [Sources]({path}) | Provenance, rights, retrieval, and verification |

## What this cycle must answer

- The decision and horizon being reassessed.
- What changed since the prior finalized cycle and what evidence carried forward.
- Which prior finalized report and valuation this cycle supersedes, if any.
- Which material uncertainties remain unresolved.

## Canonical outputs

| Artifact | Path | Status |
| --- | --- | --- |
| Research plan | | |
| Source log | | |
| Final report | | |
| Valuation | | |
| Valuation-horizon contract | | |
| Decision | | |
| Independent or adversarial review | | |
| Deterministic verifier | | |

`review_status` is `not_requested`, `pending`, `passed`, `failed`, or `stale`. Do not use
`passed` or release-ready language unless the bound artifact, contract, model,
verifier, and review hashes all validate.

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

The manifest paths are authoritative. Cycle-specific artifacts may live inside the cycle folder or in stable company subfolders when those paths are recorded here and validate correctly. Same-cycle working drafts remain only in Git history and are not cited. Link stable company identity from the company root. A complete copy of `companies/<ticker>/` should preserve the identity, every cycle manifest, all public research artifacts, and their relative links; licensed local-only captures remain excluded under the data policy.

## Next review

State the next review date, trigger, and whether it should be a monitoring update inside this cycle or a new full revaluation cycle.
