---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T23:57:00+02:00
method_reviewed_at: 2026-08-23
scope: joint-horizon-valuation-probability-and-distribution-method
tags: [valuation, probability, distribution, simulation, transition, calibration]
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

The replacement is a deterministic 100,000-draw structured-elicitation model
with linked six- and twelve-month states. It samples advertising, Other Revenue,
free cash flow (**FCF**), cash retention, dilution, valuation multiples,
long-term growth, discount rates, Specs value, and explicit legal/regulatory
states with declared dependencies. Every draw produces a six-month
enterprise-value/revenue value and continues to a twelve-month value. The median
of the three simultaneously calculated twelve-month valuation methods is the
per-draw triangulated value; this is a robust cross-check, not an assumption that
the methods are independent.

| Linked fair-value horizon | Mean | P10 | P50 | P90 | Probability below $5.21 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Six months — 20 February 2027 | **$7.09** | **$3.81** | **$6.77** | **$10.64** | **28.5%** |
| Twelve months — 20 August 2027 | **$8.23** | **$2.86** | **$7.90** | **$13.78** | **28.6%** |

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

## Forecast quantities

The model estimates two linked quantities:

- a **six-month fair-value distribution** at 20 February 2027, using the
  trailing operating state then expected to be visible and an enterprise-value /
  revenue bridge; and
- a **twelve-month fair-value distribution** implied by the operating state
  forecast through 20 August 2027, triangulated from target-date trailing
  enterprise value / revenue, advertising-plus-Other-Revenue sum of the parts
  (**SOTP**), and levered-equity discounted cash flow (**DCF**).

The twelve-month revenue and SOTP methods capitalize the target-date operating
state; the DCF is a present-value cross-check built from the same forecast. The
six-month bridge is deliberately narrower because only two additional reported
quarters will be visible. Neither output is a literal distribution of market
price on its horizon date. The model does not separately forecast the
probability that market price converges to fair value, nor does it forecast QQQ.
Therefore:

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

The six-month bridge has its own four driver marginals. The joint model treats
the previously verified downside, central, and upside checkpoint revenue and
net-debt inputs as including half of the displayed twelve-month legal
allowances. Before sampling, it adds back $37.5 million / $22.5 million / $10
million of assumed embedded downside / central / upside revenue drag and removes
$137.5 million / $62.5 million / $17.5 million of assumed embedded legal cash
from net debt. It then applies the shared sampled legal branch exactly once. The
outer endpoints extend those paths rather than silently truncating the
distribution. Net debt and diluted shares are shown in numeric percentile
order; their favorable-state sampling uses the complement.

| Six-month driver | Minimum | P10 | P50 | P90 | Maximum |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trailing revenue before checkpoint legal drag | $6.470bn | $6.7135bn | $6.9505bn | $7.173bn | $7.420bn |
| Enterprise value / revenue | 0.60x | 1.20x | 1.95x | 2.90x | 4.00x |
| Net debt before checkpoint legal cash | $0.080bn | $0.3325bn | $0.5875bn | $0.6875bn | $0.950bn |
| Diluted shares | 1.860bn | 1.890bn | 1.910bn | 1.940bn | 1.990bn |

Reapplying the assumed embedded path allowances to the central three inputs recovers the
published $6.676 billion / $6.928 billion / $7.163 billion revenue and $0.825
billion / $0.650 billion / $0.350 billion net-debt cross-checks. This
reconciliation prevents the new legal linkage from double-counting exposure.

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

### Horizon transition link

The two horizons are not sampled independently and the six-month value is not a
linear interpolation between $5.21 and the twelve-month value. Each draw pairs
its horizon states through the following rank correlations:

| Linked driver state | Six-/twelve-month rank correlation |
| --- | ---: |
| Revenue | 0.85 |
| Enterprise-value/revenue multiple | 0.80 |
| Capital retention, net debt, and diluted shares | 0.90 |

The six-month revenue score links to a twelve-month advertising and Other-Revenue
score weighted 82% / 18%, approximately the modeled next-four-quarter mix. Separate
checkpoint shocks allow Q3/Q4 evidence to diverge from the final annual state. A
separate deterministic random stream preserves the already-frozen twelve-month
draws. These coefficients are transition judgments, not estimated serial
correlations.

At the base coefficients, six- and twelve-month fair values have a 0.81 Pearson
correlation. Multiplying the three link coefficients by 0.50 lowers it to 0.42;
multiplying them by 1.15 raises it to 0.92. The twelve-month marginal distribution
is identical in those stresses. The six-month median stays near $6.77, while its
P10/P90 remain near $3.8/$10.7; what changes materially is how informative the
checkpoint is about the later state.

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

The same legal branch continues through both horizons. The six-month bridge
recognizes 50% of its twelve-month cash effect and 50% of its annualized
revenue-drag effect, reflecting two additional quarters inside the trailing
revenue window. This proportional timing rule is a transparent simplification;
court payments and product remedies can be lumpy.

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

## Six-month results and transition to twelve months

| Six-month distribution | Value / probability |
| --- | ---: |
| Mean fair value | **$7.09** |
| P10 / P50 / P90 | **$3.81 / $6.77 / $10.64** |
| P25 / P75 | $4.96 / $8.99 |
| Probability below $5.21 | **28.5%** |
| Probability of at least 30% fair-value impairment | **9.0%** |
| Probability of at least 50% fair-value impairment | **4.1%** |
| Bottom-decile expected value | **$2.79** |

Twelve-month value exceeds its linked six-month value in 63.4% of draws. The
joint model also produces an explicit forward bridge rather than merely placing
two unconditional tables beside one another:

| Six-month value band | Twelve-month mean | Twelve-month median | Probability twelve-month value is below $5.21 |
| --- | ---: | ---: | ---: |
| Bottom quartile — at or below $4.96 | $4.04 | $3.59 | 74.8% |
| Lower-middle quartile — $4.96 to $6.77 | $6.83 | $6.63 | 30.3% |
| Upper-middle quartile — $6.77 to $8.99 | $9.15 | $9.19 | 8.7% |
| Top quartile — above $8.99 | $12.89 | $12.54 | 0.7% |

This ordering is the sense in which the six-month state leads to the
twelve-month state: a weak checkpoint materially shifts the conditional later
distribution downward, while a strong checkpoint shifts it upward. It is not a
claim that every path improves or that market price equals modeled fair value.

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

The verifier freezes both horizons' published quantiles, risk probabilities,
their value correlation, ordered transition bands, legal-state frequencies,
model contract, and principal cross-checks. Repository tests also confirm seed
determinism, dependency-stress direction, and horizon-linkage sensitivity.

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

The transition link also needs a point-in-time company cohort or repeated Snap
forecasts before its 0.85 / 0.80 / 0.90 rank coefficients can be estimated or
calibrated. Until then, stress conclusions across weaker and stronger links and
do not describe the conditional transition table as observed frequency.

Distributional forecasting and proper scoring are established statistical
ideas; they do not validate these Snap inputs automatically. See
[Gneiting and Raftery](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jasa.pdf)
for proper scoring rules,
[Bottazzi et al.](https://link.springer.com/article/10.1007/s10436-022-00423-w)
for a stochastic-DCF application, and
[Theising](https://arxiv.org/abs/2405.03402) for distributional reference-class
forecasting of corporate sales growth.

## Conclusion

The valuation remains attractive on absolute modeled value, but the joint output
describes both the checkpoint and the later state more honestly. A six-month
$6.77 median / $7.09 mean leads to a twelve-month $7.90 median / $8.23 mean, with
0.81 value correlation and explicitly conditional transition bands. The 28.6%
twelve-month probability below the current reference and 8.2% probability of at
least 50% fair-value impairment remain unchanged. That combination supports
`watch` for a new investor and `conditional hold / no add` for an existing long
more directly than a single $7.48 probability-weighted target did.
