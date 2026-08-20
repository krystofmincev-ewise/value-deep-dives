---
type: event_outcome
forecast_id: "{YYYY-E001}"
company: "{Company}"
ticker: "{TICKER}"
status: draft
as_of: "{YYYY-MM-DD}"
outcome_at: "{ISO-8601 timestamp}"
release_status: unknown
resolution_deadline_at: "{Frozen event_window_end timestamp}"
actual_release_at: null
resolution_reason: "{How and why the proposition states were adjudicated}"
original_forecast: "{relative path}"
evaluation_spec_id: event-v1
event_outcome_status: pending
event_outcome: null
event_outcome_source_id: null
event_outcome_source_path: null
target_outcome_status: pending
target_outcome: null
security_start_price: null
security_start_at: null
security_end_price: null
security_end_at: null
security_end_session_number: null
security_price_source: null
security_price_adjustment_rule: null
benchmark_start_value: null
benchmark_end_value: null
benchmark_price_source: null
benchmark_price_adjustment_rule: null
market_observation_path: null
market_observation_hash: null
position_disclosure: not_disclosed
---

# {Ticker} event outcome — {event}

## Original rules

Quote or link the frozen event and security propositions. Do not reinterpret them after observing the result.

## Event resolution

Set `event_outcome_status` to `resolved` and resolve `event_outcome` to `1` or `0` from the predeclared source and rule. If genuinely unresolvable, set the status to `unresolvable`, leave the value null, explain why, and do not score it as a miss or hit.

For a missed deadline, set `release_status: no_release`, leave `actual_release_at` null, retain the frozen `resolution_deadline_at`, and cite a committed official source checked after the deadline. A release first made public after that deadline is also adjudicated under the frozen deadline-miss policy. Resolve the event proposition to `0` only when the forecast froze `deadline_miss_resolution: event_zero`; otherwise mark it unresolvable. A release-anchored security reaction target remains pending or unresolvable when there was no timely release observation.

| Item | Observed value | Published at | Source | Rule result |
| --- | --- | --- | --- | ---: |
| | | | | |

## Security resolution

Resolve `target_outcome_status` and `target_outcome` independently under the original security and benchmark adjustment, timing, corporate-action, and missing-data rules. A resolved target also requires a hashed market-observation bundle and normalized captures whose bytes match the market source checksums. One proposition can remain unresolvable while the other is scored.

| Observation | Security | Benchmark | Exact timestamp / source |
| --- | ---: | ---: | --- |
| Start | | | |
| End | | | |
| Return | | | Author calculation |
| Excess return | | | Author calculation |

## Scoring

- Event Brier score: `(event_probability_pct / 100 - event_outcome)^2`
- Security Brier score: `(target_probability_pct / 100 - target_outcome)^2`

Run `npm run research:records -- validate-outcome <path>`, commit this record in a descendant of the forecast commit, then add its path and commit URL to the event ledger. Re-run `score-events`; it recomputes the target label from the frozen direction, threshold, return metric, and recorded observations. Do not copy outcomes into the ledger before the committed outcome record exists.

## Attribution and process review

Separate event insight, pricing insight, timing, market exposure, confounders, execution assumptions, and luck. Record prospective process changes without altering the original score.
