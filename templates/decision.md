---
type: decision
decision_id: "{YYYY-NNN}"
company: "{Company}"
ticker: "{TICKER}"
coverage_cycle_id: "{TICKER}-{YYYY-Www}-{NN}"
coverage_cycle_path: "{relative path to coverage-cycle manifest}"
identity_path: "{relative path to verified company identity}"
identity_hash: "{sha256 digest of the frozen identity record}"
security_id: "{stable repository security ID}"
listing_id: "{stable repository listing ID}"
research_stance: insufficient_evidence
action: watch
decided_at: "{ISO-8601 timestamp}"
research_cutoff: "{ISO-8601 timestamp}"
price_kind: public_reference
price: null
price_at: null
price_source: null
position_disclosure: not_disclosed
thesis_path: "{relative path}"
valuation_path: "{relative path}"
benchmark: null
target_horizon: null
expected_return_pct: null
expected_excess_return_pct: null
action_hurdle_pct: null
review_by: null
---

# {Ticker} — {action} — {date}

## Decision

Research stance (`attractive`, `neutral`, `unattractive`, or `insufficient_evidence`), portfolio action, and concise rationale. State the horizon, benchmark, hurdle, portfolio context, and whether sizing and actual fills are omitted. Use `hold` only for an existing position; use `reduce` or `exit` for the portfolio action often called sell.

## Evidence available at the time

Links to the exact canonical final report, valuation, sources, and commit.

## Expected value and downside

Bull/base/bear returns, probabilities if used, permanent-loss case, and key assumptions.

## Falsifiers and review triggers

Observable business, valuation, or timing conditions.

## Conflicts and disclosure

Dated position and any relevant relationship. Clarify whether the shown price is a public reference or an actual fill.
