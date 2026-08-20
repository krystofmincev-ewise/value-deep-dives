---
name: event-driven-investment-research
description: "Research and pre-register a company catalyst by forecasting an observable event outcome separately from a directional or magnitude security-return outcome. Use for earnings setups, clinical-trial readouts, FDA/EMA decisions, product launches, customer contracts, legal or policy rulings, financing, capital allocation, M&A, commodity or macro releases, short-horizon catalyst questions, significant-move predictions, event-study design, or converting a company thesis into a leakage-safe prospective event record."
---

# Event-Driven Investment Research

Create a falsifiable event forecast without confusing “what happens” with “how the security reacts.” Research and scoring do not authorize a trade.

## Establish scope and identity

1. Read `DATA_POLICY.md`, `methodology/RESEARCH_STANDARDS.md`, `methodology/RESEARCH_TOOLING.md`, `methodology/EVENT_DRIVEN_RESEARCH.md`, and the evaluation specification named by the forecast, currently `methodology/event-evaluation-specs/event-v1.md`. Verify with `validate-evaluation-spec` that its status is `published`; the current repository version is a draft and therefore blocks formal publication.
2. Require one company/security, one event family, one expected release window, and one decision horizon. Resolve the company through `templates/company-identity.md`; do not use a ticker, drug code, product name, or subsidiary name without verifying the mapping.
3. Record the canonical schedule source, `schedule_known_at`, window, timezone, precision, version or revision, and market session. Treat a schedule change as new evidence and preserve the prior value.
4. Select the event-specific checklist in `references/event-type-playbooks.md`. Invoke `$biopharma-evidence-research` for clinical or regulatory events.

Use only the event-type values accepted by `schemas/event-forecast.schema.json`; for any Phase 1/2/3 readout use `clinical_trial`, and describe the phase and readout subtype in the title and body. Do not invent a more specific enum.

Stop if the thesis depends on material non-public information, private communications, unlicensed data, or an outcome that a third party could not resolve.

For a systematic screen or strategy evaluation, register every identified event in `track-record/event-candidate-ledger.csv` before selecting forecasts. Freeze the declared cohort in one public commit, preserve abstentions, ineligible candidates, deferrals, and reasons, and place that candidate ID and first-appearance commit URL in any registered forecast. Every registered candidate must map to exactly one event-ledger row. Summarize and audit declared-cohort coverage with `summarize-event-candidates`; do not claim that a discretionary screen captured every real-world event.

When identity, schedule, cutoff, or resolution fields are missing, return a research plan and clearly labelled incomplete field map. Do not present invalid front matter as an event record and do not add it to the ledger.

## Define two propositions

Write before estimating probabilities:

- **Event proposition:** a binary factual rule with population, metric, accounting/statistical definition, timepoint, source, and treatment of ambiguity.
- **Security proposition:** direction (`up`, `down`, or `absolute`), return threshold, number of trading sessions, start/end observations, benchmark, separate security and benchmark adjustment rules, market-session handling, and missing-price/corporate-action treatment.

Use one forecast per independently resolvable proposition. “The trial is good,” “earnings beat,” and “the launch succeeds” are not resolution rules.

## Build a point-in-time evidence set

1. Freeze `source_cutoff_at` with timezone.
2. Require `known_at <= source_cutoff_at` for every feature used in historical or live probability work.
3. Preserve filings and acceptance times, registry versions, consensus snapshots, macro vintages, schedule versions, model/prompt/code versions, and dataset hashes when available. Create validated source and fact records plus a SHA-256 fact-snapshot manifest; every fact `known_from` and source `first_public_at` must be no later than the cutoff.
4. Exclude post-event publications, today’s revised registry status, post-completion news, stock movements, later trial phases, and restated values that were not public at cutoff.
5. Right-censor unresolved historical events. Absence of a later success is not failure without a frozen horizon.

Read `references/probability-and-reaction.md` before estimating probabilities.

## Estimate event probability

1. Choose a documented, versioned reference class available at the cutoff. Freeze its ID, probability, sample size, observation period, inclusion rule, and exclusions.
2. Group evidence by causal or informational dependence.
3. Apply explicit upward and downward adjustments without counting correlated signals twice.
4. Record the strongest disconfirming evidence, missing data, and an abstention condition.
5. State `event_probability_pct` as a point estimate plus a defensible range in the narrative.

For biopharma, keep target validity, current-trial success, approval conditional on data, commercial execution, and economic value separate. For earnings, keep reported-quarter results, guidance, and narrative change separate.

## Model the security reaction

Build positive, ambiguous, and negative event scenarios with conditional security returns. Bridge the event to value through cash flow, probability-weighted asset value, capital needs, multiple/expectation change, or another explicit mechanism.

Estimate `target_probability_pct` independently and freeze a named target baseline probability. Compare against a market-implied distribution only when the timestamp, rights, contract definition, spreads, liquidity, and risk premium are understood. Do not call analyst consensus a probability.

Select `return_basis` explicitly. Use `decision_holding_period` with `entry_observation_rule: reference_price` for return from the published decision; use `event_reaction` with `entry_observation_rule: last_close_before_release` to isolate the post-release reaction. Never describe the former as an event-window reaction.

List confounders that can make a correct event call lose money: prior positioning, financing, dilution, safety, guidance, peer news, macro moves, halts, borrow, liquidity, and a result already priced in.

## Pre-register and validate

1. Copy `templates/event-forecast.md` into the relevant company history.
2. Populate candidate ID/commit, verified identity path/hash/security/listing IDs, both baseline source paths, the exact fact-snapshot path/hash, both propositions and probabilities, return basis and metric, evaluation spec, schedule metadata, missed-deadline policy and official check URL, reference price/provider, benchmark/provider, source cutoff, disclosure, countercase, falsifiers, and no-trade conditions.
3. Run:

   ```bash
   npm run research:records -- validate-event "{forecast_path}"
   ```

4. Publish the forecast in a public commit before `event_window_start`. `published_at` must be no more than ten minutes before the commit timestamp.
5. In a later commit, add the identical frozen fields and forecast commit URL to `track-record/event-forecast-ledger.csv`, then run `score-events` to cross-check the committed forecast, identity hash, already-published evaluation spec, timestamps, and ledger row. Never rewrite a published forecast; create a linked superseding record that retains the original publication fields.

If a lawful reproducible formal price source is unavailable, keep the work as a research draft and say the security proposition is not publishable.

## Resolve after the event

Use `templates/event-outcome.md` and `$forecast-evaluation`. Blindly apply the original rule first, then discuss interpretation. Add and audit a validated release source whenever a release occurred, even if only the security proposition resolves. For a resolved security target, add a hashed market-observation bundle, hashed normalized provider captures, and checked market-data source records whose checksums equal those capture hashes; timestamps must resolve to the frozen hashed calendar snapshot and exact end-session number. Treat a late release like a missed deadline under the frozen policy. For no release, use the official check URL without fabricating a release timestamp. Validate and commit the outcome record as a later descendant, add its path and separate commit URL to the ledger, and run `score-events`; the tool must recompute the target label. Score factual event and security return separately, preserve partially resolved and unresolvable cases, and compare with the frozen baselines.

Return the identity and cutoff, event timeline, two exact propositions, base rate, evidence adjustments, both probabilities, conditional-return scenarios, expected and benchmark-relative return, strongest countercase, confounders, falsifiers, abstention/no-trade conditions, validation result, and source-log entries.
