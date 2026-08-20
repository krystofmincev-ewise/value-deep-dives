---
name: forecast-evaluation
description: "Resolve, score, audit, and report prospective event forecasts without hindsight leakage, and audit company-ledger readiness without inventing unimplemented return statistics. Use for event outcomes, event-ledger validation, Brier scores, calibration, baseline comparisons, retrospectives, track-record reviews, event-study evaluation, prediction-model comparison, or checking whether a claimed catalyst edge is supported by enough out-of-sample evidence."
---

# Forecast Evaluation

Apply the rules that existed when the forecast was published. Never improve a score by changing a label, window, benchmark, universe, or price source after observing the outcome.

## Freeze the evaluation input

1. Read `methodology/PERFORMANCE_AND_DISCLOSURES.md`, `methodology/EVENT_DRIVEN_RESEARCH.md`, the forecast's published immutable `evaluation_spec_id`, and `references/scoring-and-leakage.md`.
2. Locate the original forecast, event-ledger row, public commit, source cutoff, identity record, probability, evaluation rule, benchmark, and position disclosure.
3. Verify that the record predates the event and that the outcome source is independent of the forecast. Preserve superseded, invalidated, passed, missed, acquired, delisted, halted, and unresolvable observations.
4. Do not score retrospective examples as prospective forecasts.

## Resolve before interpreting

For an event forecast, create `templates/event-outcome.md`, run `validate-outcome`, commit it, and resolve:

- `event_outcome` to `1`, `0`, or null under the exact factual rule;
- `target_outcome` to `1`, `0`, or null under the exact security-return rule;
- release, late-release, or missed-deadline status; first tradable session from a sufficiently covering frozen calendar snapshot; committed market-observation bundle and normalized captures; start/end prices; separate security and benchmark adjustment rules; corporate actions; and confounders.

Use null plus `unresolvable` when the frozen source and rule cannot decide the outcome. Do not turn ambiguity into the favorable class.

## Validate and score

Run:

```bash
npm run research:records -- score-events track-record/event-forecast-ledger.csv
```

The tool verifies the configured origin, candidate/forecast/outcome commit ancestry, registered-candidate reverse linkage, earlier frozen evaluation spec and hashed calendar coverage, identity and fact/source hashes, cutoff timing, provider/version consistency, outcome-source timing, committed market observations and capture hashes, eligible-session selection, and deterministic target-return arithmetic. It then reports event-outcome and security-outcome Brier scores separately, frozen-baseline comparisons, calibration buckets, accuracy at 50%, status counts, subgroup results, and sample-size warnings. It permits one proposition to resolve while the other is pending or unresolvable.

The separate company `forecast-ledger.csv` is currently a publication index, not an automated performance engine. Audit its required fields and inclusion policy, but do not calculate or report company hit rates, adjusted returns, or calibration until a reproducible price/corporate-action adapter and company-ledger scorer exist.

For formal reporting also calculate, when the predeclared data supports it:

- log loss with a documented probability clamp;
- calibration error and coverage/abstention;
- base-rate, constant-probability, and market-implied baselines;
- security and benchmark returns over identical windows;
- abnormal returns and uncertainty intervals;
- results by sector, event type, horizon, confidence bucket, and evaluation specification.

Do not emphasize AUROC, hit rate, or average return alone. A model can rank well while being badly calibrated, and a few large winners can hide a weak process.

## Audit leakage and selection

Check that every feature was known by the cutoff; historical schedules and registry facts came from versions; estimates and macro data use point-in-time vintages; grouping and embargo prevent sponsor/asset/window overlap; universe members include failures; and no threshold or window was chosen from the realized path.

Treat third-party “point-in-time” claims as unverified until code and data paths prove them. Current registry rows, post-event news, later publications, and post-event stock moves are prohibited forecast features.

## Report honestly

Return:

1. eligible, resolved, unresolvable, active, and excluded counts with reasons;
2. event and security scores separately;
3. calibration table/plot and baseline comparisons;
4. returns and abnormal returns under the frozen price rules;
5. subgroup results with uncertainty, never winner-only slices;
6. data-quality, leakage, rights, and missing-observation findings;
7. thesis outcome, investment outcome, process quality, and luck attribution;
8. prospective methodology changes that do not alter old scores.

Say “insufficient observations” when the record is small. Do not promote a strategy, learned model, conformal method, or portfolio optimizer until strictly out-of-sample results support it.
