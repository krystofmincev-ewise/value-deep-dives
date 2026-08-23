---
type: decision
decision_id: "{YYYY-NNN}"
company: "{Company}"
ticker: "{TICKER}"
coverage_cycle_id: "{TICKER}-{YYYY-Www}-{NN}"
coverage_cycle_path: "{relative path to coverage-cycle manifest}"
valuation_contract_path: "{relative path to valuation-horizon contract JSON}"
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: "{relative path to verified company identity}"
identity_hash: "{sha256 digest of the frozen identity record}"
security_id: "{stable repository security ID}"
listing_id: "{stable repository listing ID}"
research_stance: insufficient_evidence
absolute_value_assessment: null
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

Research stance (`attractive`, `neutral`, `unattractive`, or `insufficient_evidence`), optional absolute-value assessment, portfolio action, and concise rationale. State the horizon, benchmark, hurdle, portfolio context, and whether sizing and actual fills are omitted. If a named benchmark has no expected return, the benchmark-relative stance is `insufficient_evidence` even when the absolute-value assessment is attractive. Use `hold` only for an existing position; use `reduce` or `exit` for the portfolio action often called sell.

> **Plain-English aside — value versus action:** {Explain why the valuation verdict, evidence gate, benchmark-relative stance, and portfolio action can legitimately differ.}

## Evidence available at the time

Links to the exact canonical final report, valuation, sources, and commit.

## Expected value and downside

Link the valuation-horizon contract. State the modeled quantity and use its
complete horizon outputs; keep unweighted bull/base/bear narratives separate.
If the action relies on a checkpoint leading to a later value, summarize the
joint transition rather than inferring it from two standalone point estimates.

Explain percentile and mean semantics beside the output and translate at least
one security drawdown into portfolio impact using an explicitly illustrative
position weight. State that modeled fair value is not necessarily a target-date
market-price forecast.

## Falsifiers and review triggers

Observable business, valuation, or timing conditions.

## Conflicts and disclosure

Dated position and any relevant relationship. Clarify whether the shown price is a public reference or an actual fill.
