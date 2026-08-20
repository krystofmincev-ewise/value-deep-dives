---
type: event_evaluation_spec
evaluation_spec_id: event-v1
status: draft
created_at: "2026-08-20T00:00:00+02:00"
published_at: null
price_provider_id: null
benchmark_price_provider_id: null
exchange_calendar_id: null
exchange_calendar_version: null
calendar_source_id: null
calendar_source_path: null
calendar_verification_fixture: null
calendar_fixture_hash: null
price_provider_rule: "Use the reproducible provider named in the frozen forecast and outcome records"
benchmark_price_provider_rule: "Use the reproducible provider named in the frozen forecast and outcome records"
market_timezone_rule: "Use the timezone in the uniquely mapped, frozen primary-listing calendar"
exchange_calendar_rule: "Use the official primary listing calendar effective on the observation date"
entry_observation_rule: "decision_holding_period uses the frozen reference price; event_reaction uses the last official close before the complete public release"
exit_observation_rule: "Use the official close after the frozen number of eligible primary-listing sessions"
price_adjustment_rule: split_adjusted_with_dividends
benchmark_price_adjustment_rule: split_adjusted_with_dividends
corporate_action_rule: "Apply splits and cash distributions consistently to security and benchmark; document mergers and spin-offs and do not substitute another security"
halt_rule: "Count only eligible official closes; mark the security proposition unresolvable if no qualifying close exists"
delisting_rule: "Use documented cash consideration when the original security is acquired; otherwise mark unresolvable rather than silently substituting a successor"
missing_price_rule: "Do not forward-fill, interpolate, or switch providers after publication; mark the affected security proposition unresolvable"
cost_rule: "Exclude fees, slippage, taxes, and financing from forecast scoring; disclose them separately for portfolio analysis"
borrow_rule: "Exclude borrow availability and cost from forecast scoring; disclose them separately for short feasibility"
---

# Candidate event evaluation specification: event-v1

This specification is a **draft**. It cannot be referenced by a published forecast until concrete provider IDs, a versioned exchange-calendar implementation, and a verified calendar fixture replace the null fields; its front matter validates; and an earlier public commit changes `status` to `published` with `published_at` set. Once published, it is immutable; prospective changes require `event-v2.md`.

## Event outcome

Resolve the binary proposition exactly as written in the forecast from the named canonical source. Use `1` when the rule is satisfied and `0` when it is not. Use null and mark only the event proposition `unresolvable` when the source never reports enough information or the proposition is genuinely ambiguous. Never select the interpretation that improves the score.

## Security outcome

The forecast must distinguish two return bases:

- `decision_holding_period`: start at the frozen `reference_price` observed no later than publication.
- `event_reaction`: start at the last official primary-listing close before the complete event information became public. The preregistration reference price remains provenance, not the return start.

For either basis:

1. Record the complete public release timestamp and session in the outcome record and audit it against a committed release source. A release after the frozen deadline is a deadline miss even if it later discloses the factual result.
2. Use the primary listing's official calendar and timezone. Before forecast publication, the frozen snapshot must cover any required prior close and the full return window after `event_window_end`. Session 1 is the first regular session whose open follows a timely complete release; a release during regular trading also makes the next regular session session 1.
3. Use the official close after the frozen number of eligible sessions as the end observation.
4. Use only the forecast's frozen, reproducible providers. Never repair missing data by changing provider after observing the result. Bind every scored observation to a committed normalized capture whose full SHA-256 digest equals its market source record's checksum.
5. Apply the separately frozen security and benchmark adjustment rules.
6. Compute `return_pct = 100 * (end_value / start_value - 1)`.
7. Resolve `up` to 1 when `return_pct >= threshold`, `down` to 1 when `return_pct <= -threshold`, and `absolute` to 1 when `abs(return_pct) >= threshold`. Otherwise resolve to 0.

Calculate benchmark return and excess return over the same timestamps for attribution. Resolve the binary security proposition only from the frozen `security_return_rule`; a benchmark-relative threshold must say so explicitly.

## Independent resolution and scoring

Resolve the event and security propositions independently. One may be scored while the other remains pending or unresolvable. For each resolvable proposition calculate Brier score `(probability / 100 - outcome)^2`. Report both scores and observation counts separately, alongside the frozen baseline Brier scores, coverage, exclusions, calibration buckets, and results by evaluation-spec version.
