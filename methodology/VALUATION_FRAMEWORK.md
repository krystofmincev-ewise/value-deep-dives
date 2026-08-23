# Valuation framework

Valuation outputs are model results, not precise truths. Their value comes from
transparent quantities, horizons, assumptions, and consistent follow-up.

## Minimum inputs

Every formal valuation snapshot should state:

- source cutoff and valuation date;
- share-price reference, timestamp, and source;
- reporting and valuation currency;
- basic and diluted share counts, including expected dilution;
- cash, debt, leases, and other material claims;
- current enterprise value and equity value reconciled explicitly;
- target horizon and next review date;
- bull, base, and bear operating assumptions;
- valuation method and sensitivities;
- scenario values per share and optional probabilities;
- when a full distribution is used: marginal-input provenance, dependency and
  tail-event assumptions, deterministic seed/sample count, distribution
  summaries, and calibration status.

The valuation, report, decision, and coverage-cycle manifest must link one
schema-backed valuation-horizon contract. It is the canonical machine-readable
record of quantity, horizons, output semantics, model version, and displayed
distribution statistics.

## Multiple discipline

Price-to-sales compares equity value with revenue. EV/sales compares enterprise value with revenue. They are not interchangeable: two companies at the same price-to-sales ratio can have very different leverage and cash balances.

When using multiples:

1. Match enterprise metrics to enterprise value and equity metrics to equity value.
2. Define forward or trailing periods precisely.
3. Explain why the peer group, historical range, or terminal multiple is relevant.
4. Adjust for dilution, stock-based compensation, and capital intensity where material.
5. Show how the terminal enterprise value becomes an equity value and per-share target.

## Scenario design

Bull, base, and bear cases should differ through coherent operating narratives—not arbitrary multiple changes. Depending on the business, scenarios may include:

- users, customers, volume, price, or monetization;
- revenue growth and gross margin;
- operating expense and incremental margin;
- stock-based compensation and dilution;
- reinvestment, working capital, and capital expenditure;
- taxes, net cash or debt, and financing needs;
- terminal growth or exit multiple.

Scenario probabilities are optional. If used, the scenarios must be mutually
exclusive and collectively exhaustive, the probabilities must sum to 100%, and
each scenario value should be the conditional mean of that bucket. A weighted
sum of representative endpoints or P10/P50/P90 values is not an expected value.

When those conditions cannot be defended, present bear/base/bull as unweighted
reader-facing paths and calculate decision metrics from a full distribution or
from explicitly bounded probability sensitivities.

## Distributional valuation

Use a distribution-first model when a small number of bundled scenarios would
hide material mixed paths, correlated drivers, or discontinuous tails. A
distributional model should:

1. define the forecast quantity precisely—intrinsic value, target-date market
   price, total return, and benchmark-relative return are different variables;
2. start from a documented point-in-time reference class when one is available;
3. label expert-elicited marginals as judgment rather than measured frequency;
4. make minimum/P10/P50/P90/maximum anchors or another complete marginal form
   inspectable, with units and sources;
5. declare dependencies explicitly and stress them rather than sampling every
   driver independently;
6. model legal, regulatory, financing, survival, or other discontinuous outcomes
   as explicit branches when a smooth curve is misleading;
7. avoid placing the same risk in cash flow, net debt, the multiple, discount
   rate, and an additional probability haircut without a reconciliation;
8. use a deterministic seed and enough draws for stable displayed quantiles;
9. report mean, median, material quantiles, loss probabilities, and lower-tail
   expected shortfall—not only expected value; and
10. preserve a simple deterministic method and at least one method with
    different failure modes as cross-checks.

Monte Carlo is a calculation surface, not evidence. Subjective triangular or
quantile inputs remain subjective after repeated sampling. Until a relevant
reference-class record is large enough, label the result `structured
elicitation`, run it in shadow mode against simpler baselines, and do not claim
empirical calibration.

P10/P50/P90 distribution outputs may be accompanied by nearby narrative
interpretations, but label the values as percentiles and keep any deterministic
bear/base/bull anchors in a separate table. Do not probability-weight percentile
points. If probability-bearing buckets are required, derive their probabilities
and conditional mean values from the underlying distribution under frozen
bucket rules.

Do not combine narrative and distribution semantics in one heading. `Bear`,
`base`, and `bull` are operating narratives; P10, P50, and P90 are locations in
a distribution. A narrative may explain a nearby percentile after the model is
run, but the narrative value does not become that percentile by relabeling it.

## Multi-horizon consistency

A modeled later horizon does not imply a complete earlier distribution. For
every numeric horizon, define the same minimum output contract required above.
Fair value, target-date market price, and price convergence remain different
quantities at every date.

Use one of three relationship types:

1. `single`: one valuation horizon; other dates are qualitative monitoring
   checkpoints without valuation outputs;
2. `joint`: shared draws or an explicit transition model connect two horizons;
   or
3. `independent`: each horizon is separately modeled and no transition claim is
   made.

A joint model should expose the shared and horizon-specific states, timing of
cash and operating effects, cross-horizon dependence, conditional later
outcomes, and sensitivity to linkage strength. Reconcile embedded allowances at
each date so a shared legal, regulatory, financing, dilution, or survival branch
is applied once rather than layered onto an anchor that already contains it.

Schema version 1 supports at most two formal horizons, ordered earliest to
latest; its dependence and transition statistics describe that pair. Before
publishing three or more, extend the schema and verifier with explicit pairwise
transition records rather than assigning one ambiguous aggregate correlation.

The deterministic verifier must compare executable outputs with the
valuation-horizon contract. The repository validator then reconciles that
contract with the target fields and links in the report, valuation, and decision.

## Methods

Use the method that fits the business and explain its limitations:

- discounted cash flow;
- revenue, EBITDA, earnings, or free-cash-flow multiples;
- sum of the parts;
- unit-economics or cohort model;
- liquidation, replacement, or asset value;
- probability-weighted event or survival analysis.

Cross-check with at least one independent lens when practical.

## Evaluation

Freeze the distribution and its information cutoff before the outcome when it
will be scored. Use proper scores suited to the output: Brier score for frozen
binary propositions and continuous ranked probability score or weighted
interval score for continuous distributions. Report interval coverage and
compare with simple historical, constant-growth, and market or consensus
baselines when lawfully available. Do not infer calibration from one company or
a small number of forecasts.

## Target lifecycle

Each coverage cycle has one canonical valuation. It evolves in place while the cycle is an active draft. Once finalized or prospectively registered it is immutable; a new valuation belongs to a new ISO-week coverage cycle, links to the prior finalized valuation, and explains the cross-cycle change.

Each target has a status:

- `active`: within its horizon and still supported;
- `reached`: the evaluation rule has been met;
- `expired`: the target date passed;
- `invalidated`: a stated falsifier occurred;
- `superseded`: replaced by a new published valuation.

A target without a horizon is incomplete. A past-due `review_by` date should be treated as stale until reviewed.
