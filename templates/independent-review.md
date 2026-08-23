---
type: independent_review
company: "{Company}"
ticker: "{TICKER}"
coverage_cycle_id: "{TICKER}-{YYYY-Www}-{NN}"
review_status: pending
reviewed_at: null
reviewer_independence: not_recorded
reviewed_final_report_hash: null
reviewed_valuation_hash: null
reviewed_decision_hash: null
reviewed_contract_hash: null
reviewed_model_hash: null
reviewed_verifier_hash: null
---

# {Company} independent review — {date}

## Scope and independence

State who or what performed the review, whether it was independent of the model
construction session, the frozen information cutoff, and the exact decision the
review covers. Do not call a same-session self-check independent.

## Bound artifact snapshot

Copy the SHA-256 values from the coverage-cycle manifest only after reviewing
the exact report, valuation, decision, horizon contract, model, and verifier.
`review_status: passed` is invalid if any hash is null or mismatched.

## Findings

Record factual, source, arithmetic, quantity, horizon, dependency, overlap,
transition, tail, calibration, stance/action, and public-data findings. Separate
blocking defects from limitations that can remain disclosed.

## Reproduction

List the exact verifier and repository validation commands run and their
results. A passing validator proves consistency, not economic correctness.

## Disposition

Use `passed`, `failed`, or `stale`. A later material edit to any bound artifact
makes this record stale until a new review snapshot is created.
