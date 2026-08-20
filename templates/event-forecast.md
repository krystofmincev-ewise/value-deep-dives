---
type: event_forecast
forecast_id: "{YYYY-E001}"
candidate_id: null
candidate_ledger_commit_url: null
company: "{Company}"
ticker: "{TICKER}"
identity_path: "{relative path to verified company identity}"
identity_hash: "{sha256 digest of the frozen identity record}"
security_id: "{stable repository security ID}"
listing_id: "{stable repository listing ID}"
status: draft
as_of: "{YYYY-MM-DD}"
published_at: null
source_cutoff_at: "{ISO-8601 timestamp}"
event_baseline_id: "{S-001}"
event_baseline_source_path: "{relative path to baseline source record}"
event_baseline_probability_pct: null
event_baseline_sample_size: null
target_baseline_id: "{S-002}"
target_baseline_source_path: "{relative path to target-baseline source record}"
target_baseline_probability_pct: null
method_version: manual-v1
fact_snapshot_hash: null
fact_snapshot_path: null
event_type: other
schedule_source: "{Canonical issuer, exchange, or regulator URL}"
schedule_known_at: "{ISO-8601 timestamp}"
event_window_start: "{ISO-8601 timestamp}"
event_window_end: "{ISO-8601 timestamp}"
no_release_check_url: "{Canonical official page or endpoint checked after a missed deadline}"
market_session: unknown
event_outcome_rule: "{Short stable binary rule}"
deadline_miss_resolution: unresolvable
event_probability_pct: null
evaluation_spec_id: event-v1
security_return_rule: "{Short stable directional return rule}"
return_basis: decision_holding_period
entry_observation_rule: reference_price
return_metric: security_total_return
target_direction: up
target_return_threshold_pct: null
target_return_window_sessions: null
target_probability_pct: null
currency: USD
reference_price: null
reference_price_at: null
reference_price_source: null
price_adjustment_rule: split_adjusted_with_dividends
benchmark: null
benchmark_price_source: null
benchmark_price_adjustment_rule: split_adjusted_with_dividends
position_disclosure: not_disclosed
review_by: null
supersedes: null
---

# {Ticker} event forecast — {event}

> Research draft until all required fields validate. It becomes a published forecast in the first qualifying public commit; a later ledger commit indexes and audits that frozen commit.

## Resolvable propositions

**Event proposition:** Write the exact binary rule represented by `event_probability_pct`. Specify population, metric, accounting or statistical definition, source, and treatment of ambiguity.

Set `deadline_miss_resolution: event_zero` only when the proposition explicitly means the release or decision occurs by `event_window_end`; otherwise leave it `unresolvable`. This treatment is frozen before the deadline.

**Security proposition:** Define the adjusted security return represented by `target_probability_pct`, including direction, threshold, start observation, trading-session window, benchmark, dividends, corporate actions, missing prices, and market-session rule. Link the already-published immutable evaluation specification named by `evaluation_spec_id`.

## Timing and information set

| Item | Pre-registered value | Source / limitation |
| --- | --- | --- |
| Expected release window and timezone | | |
| Market session | pre-market / regular / after-hours / unknown | |
| Source cutoff | | |
| Reference price and timestamp | | |
| Benchmark observation rule | | |

## Reference class and market expectation

State the historical base rate and why the reference class is comparable. Record a timestamped market-implied or consensus comparator only when its construction and rights are understood.

| Comparator | Value | Timestamp | Source | Interpretation limits |
| --- | ---: | --- | --- | --- |
| Base rate | | | | |
| Market-implied / consensus | | | | |

## Evidence updates from the base rate

Group correlated evidence rather than counting each observation independently.

| Evidence group | Direction | Probability effect | Source IDs | Dependence / caveat |
| --- | --- | ---: | --- | --- |
| | up / down / neutral | | | |

## Scenario and price-reaction model

| Scenario | Probability | Observable event result | Conditional security return | Main reason the reaction differs from the result |
| --- | ---: | --- | ---: | --- |
| Positive | | | | |
| Ambiguous | | | | |
| Negative | | | | |

Show the probability-weighted return and benchmark-relative return as author calculations. Do not force scenario probabilities to equal the two binary probabilities in front matter; explain the mapping.

## Variant perception

What is the market likely assuming, why could it be wrong, and what evidence suggests the difference is not already priced?

## Strongest countercase and confounders

- Evidence that most reduces the event probability.
- Financing, dilution, guidance, safety, macro, peer, legal, or market-wide disclosures that could dominate the price reaction.
- Timing, liquidity, halt, borrow, spread, or execution constraints.

## Falsifiers and no-trade conditions

- Observable conditions that invalidate the forecast or make the security outcome unscoreable under the original rule.

## Sources and calculations

Link the company identity, source log, valuation, model, and related thesis. Record material LLM assistance and human verification.

## Publication checklist

- [ ] Identity and event source verified
- [ ] Binary event and security rules independently resolvable
- [ ] Source cutoff precedes publication and outcome window
- [ ] Probabilities, reference class, and correlated evidence documented
- [ ] Baseline source records and exact fact/source snapshot validate at the cutoff
- [ ] Reference price, benchmark, market session, and corporate-action rule frozen
- [ ] Evaluation specification validates as already published in an earlier public commit
- [ ] Strongest disconfirming case and confounders recorded
- [ ] Forecast published before the event in a public commit
- [ ] Event ledger row added in a later commit and `score-events` linkage audit passes
- [ ] Position disclosure recorded
