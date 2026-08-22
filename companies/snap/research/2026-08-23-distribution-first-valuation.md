---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T23:57:00+02:00
method_reviewed_at: 2026-08-23
scope: valuation-probability-and-distribution-method
tags: [valuation, probability, distribution, simulation, calibration]
---

# Snap distribution-first valuation method — 2026-W34

> Supporting method record for coverage cycle `SNAP-2026-W34-01`. The company
> fact set remains frozen at 22 August 2026, 23:57 Central European Summer Time.
> Methodology sources reviewed on 23 August contain no later Snap outcome or
> market information and do not move any operating anchor.

## Answer first

The former 30% bear / 50% base / 20% bull weights were documented analyst
judgment, not probabilities estimated from a reference class. They are removed
from the canonical expected-value calculation.

The replacement is a deterministic 100,000-draw structured-elicitation model.
It samples advertising, Other Revenue, free cash flow (**FCF**), cash retention,
dilution, valuation multiples, long-term growth, discount rates, Specs value,
and explicit legal/regulatory states with declared dependencies. The median of
the three simultaneously calculated valuation methods is the per-draw
triangulated value; this is a robust cross-check, not an assumption that the
methods are independent.

| Twelve-month triangulated distribution | Value / probability |
| --- | ---: |
| Mean fair value | **$8.23** |
| P10 / P50 / P90 | **$2.86 / $7.90 / $13.78** |
| P25 / P75 | $4.76 / $11.15 |
| Probability below $5.21 | **28.6%** |
| Probability of at least 30% fair-value impairment | **16.0%** |
| Probability of at least 50% fair-value impairment | **8.2%** |
| Bottom-decile expected value | **$2.06** |
| Probability fair value exceeds $5.21 by at least 8% | **68.0%** |

These figures are more informative than the old $7.48 weighted point. They are
still **uncalibrated structured elicitation**, not measured physical
probabilities. The improvement is auditability, internal consistency, explicit
tails, and future scoreability—not a claim that simulation creates evidence.

## What was wrong with the old calculation

The old expected value multiplied three representative values by 30% / 50% /
20%. That expression is a true expectation only if:

1. the scenarios are mutually exclusive and collectively exhaustive;
2. each probability is defensible; and
3. each displayed value is the conditional mean of every outcome in its bucket.

Those conditions did not hold. The company cases were coherent narratives and
useful valuation anchors, but they were neither exhaustive buckets nor
conditional means. The weights moved in five-point increments when evidence was
reinterpreted, without a rule connecting evidence strength to probability.

The model also bundled advertising, subscriptions, margins, cash retention,
dilution, legal outcomes, Specs, and rerating into three all-or-nothing paths.
Mixed outcomes were largely absent, and the severe legal tail could fall below
the displayed bear value.

## Forecast quantity

The primary quantity is **a fair-value distribution implied by the operating
state forecast through 20 August 2027**, triangulated from:

- target-date trailing enterprise value / revenue;
- advertising-plus-Other-Revenue sum of the parts (**SOTP**); and
- levered-equity discounted cash flow (**DCF**).

The revenue and SOTP methods capitalize the target-date operating state; the DCF
is a present-value cross-check built from the same forecast. This is not a
literal distribution of the market price on 20 August 2027. The model does not
separately forecast the probability that market price converges to fair value,
nor does it forecast QQQ. Therefore:

- the absolute-value distribution supports the absolute assessment;
- the formal benchmark-relative stance remains `insufficient_evidence`; and
- the model must not be described as a calibrated target-price distribution.

## Marginal inputs

Every row is minimum / P10 / P50 / P90 / maximum. The central three anchors come
from the canonical operating and valuation cases. Endpoints extend beyond the
old bear and bull so the simulation does not silently truncate the tails.
Dollar inputs are billions except per-share values and multiples.

| Driver | Minimum | P10 | P50 | P90 | Maximum |
| --- | ---: | ---: | ---: | ---: | ---: |
| Advertising revenue before regulatory drag | 4.900 | 5.620 | 6.093 | 6.442 | 6.850 |
| Other Revenue | 1.000 | 1.286 | 1.435 | 1.628 | 1.950 |
| FCF before incremental legal cash | 0.250 | 0.950 | 1.250 | 1.550 | 1.900 |
| Cash used outside the net-debt perimeter | 0.350 | 0.500 | 0.675 | 0.800 | 0.950 |
| Diluted shares | 1.840 | 1.880 | 1.920 | 1.980 | 2.050 |
| Enterprise value / revenue | 0.50x | 0.90x | 2.20x | 3.30x | 4.50x |
| Advertising revenue multiple | 0.40x | 0.70x | 1.80x | 2.80x | 4.00x |
| Other Revenue multiple | 1.00x | 1.50x | 3.00x | 5.00x | 7.00x |
| Net Specs option value | (0.400) | 0.000 | 0.250 | 0.750 | 1.250 |
| Year-five FCF margin | 6.0% | 9.5% | 16.5% | 20.0% | 23.0% |
| Annual dilution after year one | (0.5%) | 0.0% | 1.0% | 3.0% | 5.0% |
| Cost of equity | 11.0% | 12.0% | 13.0% | 14.0% | 16.0% |
| Terminal company growth | 1.0% | 2.0% | 2.5% | 3.0% | 3.5% |

All rows are sorted in numeric percentile order. Higher-is-worse inputs such as
share count, dilution, cash use, and cost of equity are sampled against the
complement of the favorable business-state score; this preserves adverse-state
clustering without mislabeling their numeric percentiles.

The current scenario forecast supplies the quarter-specific World Cup, election,
Easter, holiday, and comparison-base treatment. Those effects shape the annual
revenue anchors and their uncertainty; they do not receive a separate scenario
probability adjustment. In particular, there is no explicit election upside and
no invented dollar estimate for the World Cup.

## Dependencies

Sampling every input independently would create implausible combinations and
understate bad-state clustering. Sampling one bear/base/bull switch would impose
perfect correlation. The model instead uses a common standard-normal business
factor plus idiosyncratic factors.

| Driver score | Loading on common business factor | Interpretation |
| --- | ---: | --- |
| Advertising | 0.85 | Auction/user health is the central operating driver |
| Other Revenue | 0.50 | Related to engagement but not identical to advertising |
| FCF | 0.65 | Revenue and execution matter; cost timing remains separate |
| Capital retention and dilution | 0.60 | Better execution supports cash retention and repurchase capacity |
| Valuation multiples / discount rate | 0.70 | Rerating is linked to proof but retains a market-specific component |
| Specs option value | 0.30 | Some platform linkage, substantial independent product risk |
| Long-term growth | 0.75 | Persistence is strongly, but not perfectly, tied to the core business |

These loadings are declared analyst judgments, not an estimated covariance
matrix. Setting them to zero raises P10 to approximately $3.28 and lowers P90 to
$12.74; multiplying them by 1.15 lowers P10 to about $2.75 and raises P90 to
$14.01. The median remains near $7.9 in both stresses. The central conclusion is
not created by one exact correlation setting, while the tail width is sensitive
to dependence as it should be.

## Legal and regulatory branches

The jurisdiction-level legal memo supplies the state probabilities. Within-state
cash and revenue ranges are explicit analyst elicitation ranges. They replace
the old practice of embedding all legal outcomes inside a company-wide bear
probability.

| State | Probability | Incremental cash range | Annualized revenue-drag range |
| --- | ---: | ---: | ---: |
| Manageable | 60% | $0–$80m | $0–$20m |
| Material | 30% | $100m–$400m | $30m–$100m |
| Severe | 8% | $400m–$1.0bn | $100m–$250m |
| Extreme | 2% | $1.0bn–$2.0bn | $250m–$500m |

Triangular sampling uses the visible mode in the code. Simulated mean legal cash
is $177 million and mean annualized revenue drag is $45 million. The average
triangulated values conditional on manageable and extreme states are about
$8.35 and $7.10 respectively. A structural injunction could be worse than the
modeled extreme range; the common-equity floor is zero.

## Results by valuation method

| Method | Mean | P10 | P50 | P90 | Probability below $5.21 |
| --- | ---: | ---: | ---: | ---: | ---: |
| EV / revenue | $8.37 | $2.85 | $8.23 | $13.83 | 27.5% |
| SOTP | $8.19 | $2.81 | $7.79 | $13.81 | 29.3% |
| Levered-equity DCF | $7.14 | $2.65 | $6.41 | $12.51 | 37.3% |
| **Per-draw median / headline** | **$8.23** | **$2.86** | **$7.90** | **$13.78** | **28.6%** |

The per-draw median is used because the three methods share sampled fundamentals
and are not independent estimates. It prevents one method's extreme terminal or
multiple output from mechanically dominating a draw. The DCF remains the more
conservative cross-check because terminal cash flows and dilution are explicit.

The target revenue multiple is still the dominant value input: its Pearson
correlation with triangulated value is approximately 0.98. Revenue is 0.69, FCF
0.42, net debt -0.52, and diluted shares -0.49. These are influence diagnostics,
not causal variance decompositions.

## Reproducibility

```text
Seed: 20260821
Draws: 100,000
Runtime: Node.js, dependency-free
Model: companies/snap/valuation/model-2026-W34-distribution.mjs
Verifier: companies/snap/valuation/verify-2026-08-21-distribution.mjs
```

Run:

```bash
node companies/snap/valuation/model-2026-W34-distribution.mjs
node companies/snap/valuation/verify-2026-08-21-distribution.mjs
```

The verifier freezes the published quantiles, risk probabilities, legal-state
frequencies, model contract, and principal cross-checks. Repository tests also
confirm seed determinism and dependency-stress direction.

## Calibration status and next evidence build

Status: **uncalibrated structured elicitation; shadow model**.

The repository does not yet contain a lawful point-in-time cohort large enough
to estimate Snap-specific driver distributions or the joint covariance matrix.
Meta alone is not a reference class, and a survivor-only platform sample would
be misleading. The next hardening step is therefore a separate, versioned
dataset containing comparable company-quarter states, realized four-quarter
revenue/margin/dilution outcomes, acquisition and delisting outcomes, and
point-in-time multiples.

Until that record exists:

- do not call the probabilities calibrated;
- preserve the deterministic three-path model as a comparison baseline;
- freeze future distributions before outcomes;
- score continuous forecasts with continuous ranked probability score or
  weighted interval score;
- score independently resolvable event branches with Brier score; and
- compare interval coverage with simple historical and constant-growth
  baselines before promoting the model beyond shadow status.

Distributional forecasting and proper scoring are established statistical
ideas; they do not validate these Snap inputs automatically. See
[Gneiting and Raftery](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jasa.pdf)
for proper scoring rules,
[Bottazzi et al.](https://link.springer.com/article/10.1007/s10436-022-00423-w)
for a stochastic-DCF application, and
[Theising](https://arxiv.org/abs/2405.03402) for distributional reference-class
forecasting of corporate sales growth.

## Conclusion

The valuation remains attractive on absolute modeled value, but the new output
describes the risk more honestly. A $7.90 median and $8.23 mean coexist with a
28.6% modeled probability of fair value below the current reference and an 8.2%
probability of at least 50% fair-value impairment. That combination supports `watch` for a new
investor and `conditional hold / no add` for an existing long more directly than
a single $7.48 probability-weighted target did.
