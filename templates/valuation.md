---
type: valuation
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
status: draft
as_of: "{YYYY-MM-DD}"
published_at: null
source_cutoff_at: "{ISO-8601 timestamp}"
currency: USD
reference_price: null
reference_price_at: null
reference_price_source: null
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: null
primary_distribution_p50: null
primary_distribution_p90: null
primary_distribution_mean: null
target_horizon: null
target_status: active
review_by: null
supersedes: null
distribution_method: null
distribution_calibration_status: not_applicable
distribution_seed: null
distribution_sample_count: null
---

# {Company} valuation — {date}

## Summary

Link the schema-backed valuation-horizon contract. It is the machine-readable
source for the modeled quantity, horizon dates, exact distribution outputs,
model/version paths, and any cross-horizon relationship.

### Modeled distribution outputs

| Horizon | P10 | P50 / median | P90 | Mean | Probability below reference |
| --- | ---: | ---: | ---: | ---: | ---: |
| | | | | | |

### Unweighted operating narratives

| Narrative | Value per share | Return from reference | Key operating case | Method |
| --- | ---: | ---: | --- | --- |
| Downside | | | | |
| Central | | | | |
| Upside | | | | |

Reference price: {value, exact date/time, source, and adjustment convention}.

State whether bear/base/bull are probability buckets or unweighted narratives.
Never combine narrative names with percentile labels or probability-weight
P10/P50/P90 values.

When `display_semantics` is `distribution_percentiles`, leave the legacy
`target_bear`, `target_base`, and `target_bull` fields null and populate the four
`primary_distribution_*` fields from the horizon contract. Narrative anchors
remain in the separate table.

## Capitalization and enterprise-value bridge

| Item | Value | As of / source |
| --- | ---: | --- |
| Basic shares | | |
| Dilutive securities / expected dilution | | |
| Diluted shares | | |
| Cash and investments | | |
| Debt, leases, and other claims | | |
| Equity value | | |
| Enterprise value | | |

## Historical base

Define the reported periods, normalizations, stock-based compensation treatment, and author calculations.

## Operating scenarios

| Driver | Bear | Base | Bull | Evidence / rationale |
| --- | ---: | ---: | ---: | --- |
| Revenue growth | | | | |
| Margin | | | | |
| Dilution | | | | |
| Other key driver | | | | |

## Probability and distribution contract

If probabilities are used, define mutually exclusive and collectively exhaustive
buckets, show the reference class, and use conditional mean values inside each
bucket. Otherwise state that the scenarios are unweighted.

For a full distribution, record:

- exact forecast quantity and every modeled horizon;
- empirical reference class or `structured_elicitation` status;
- marginal distributions and their evidence;
- dependency assumptions and stress cases;
- discrete tail-event branches and overlap controls;
- deterministic seed, sample count, and code path; and
- mean, median, P10/P25/P75/P90, probability below reference, material-loss
  probabilities, and lower-tail expected shortfall.

For one or two horizons, declare `single`, `joint`, or `independent` in the
valuation-horizon contract. A joint model must document shared states, timing,
cross-horizon dependence, conditional transitions, linkage sensitivity, and
per-horizon overlap controls. A later endpoint does not imply an earlier
distribution. Contract schema v1 stops at two horizons; three or more require
explicit pairwise transition records in a reviewed schema extension.

## Primary valuation method

Formulas, forecast period, discount rate or multiple, terminal assumptions, and enterprise-to-equity conversion.

## Independent cross-check

Use a method with different failure modes.

## Sensitivities

Show the variables that dominate value and plausible ranges. For a distribution,
also stress dependency strength, tail assumptions, and valuation-method choice.

## Calibration and scoring status

State whether the distribution is empirically calibrated, backtested only,
prospectively scoring, or uncalibrated structured elicitation. Predeclare CRPS or
weighted interval scoring for continuous forecasts and Brier scoring for frozen
binary events. Do not claim calibration from a small record.

## Failure cases and limitations

What this model omits or treats simplistically.

## Target lifecycle

Horizon, evaluation rule, next review, falsifiers, and review freshness. A
material model or canonical-artifact edit sets the cycle review to `stale` until
the bound review snapshot is refreshed. Link a prior valuation only when it
belongs to a different finalized coverage cycle; same-cycle working drafts are
not separate records.

## Sources

Link every material input to the source log.
