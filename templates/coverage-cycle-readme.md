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
forecast_path: null
tags: []
---

# {Company} coverage cycle {NN} — {YYYY-Www} — {kind}

> This manifest defines one initial or repeat valuation generation. While active, research evolves one canonical report and valuation in place. Once finalized, they are immutable and later revaluation belongs in a new linked cycle.

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
| Decision | | |
| Independent or adversarial review | | |
| Deterministic verifier | | |

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
