# Scoring and leakage audit

## Proper scores

For binary probability `p` and outcome `y`:

- Brier score: `(p - y)^2`; lower is better.
- Log loss: `-[y ln(p) + (1-y) ln(1-p)]`; predeclare a clamp such as `[0.001, 0.999]`.

Report both against a constant base-rate forecast. A raw score without a baseline and sample size is not evidence of edge.

## Calibration

Show count, mean forecast, and observed frequency by predeclared probability buckets. Include uncertainty intervals when sample size permits. Expected calibration error is descriptive and bucket-sensitive; never use it alone.

Track abstention coverage. A selective forecaster must be judged on both performance where it speaks and the fraction of eligible events it declines.

## Return evaluation

- Apply the immutable evaluation specification and exchange calendar.
- Use the first genuinely tradable observation after the complete disclosure.
- Apply identical timestamps and corporate-action conventions to security and benchmark.
- Preserve acquisitions, delistings, halts, suspensions, splits, dividends, and missing prices.
- Report raw and excess returns, abnormal-return methodology, costs/borrow if predeclared, distribution, uncertainty, and event clustering.

For statistical event studies, predeclare estimation window, event window, expected-return model, cross-sectional dependence treatment, overlapping events, and parametric/non-parametric tests. Cross-check a new implementation against an independent package or hand-worked fixture.

## Leakage checklist

- [ ] Every feature has `known_at <= source_cutoff_at`.
- [ ] Filing facts use acceptance time and the version then public.
- [ ] Trial features use historical registry versions/AACT snapshots.
- [ ] Macro data use release vintages, not today's revised observations.
- [ ] Consensus/market data are point-in-time snapshots.
- [ ] Universe and peers were frozen before outcomes and retain failures.
- [ ] Entity grouping prevents the same sponsor, asset, indication, or overlapping window leaking across train/test.
- [ ] Thresholds, labels, censoring horizons, and schedule rules were selected before results.
- [ ] Post-event news, publications, later phases, and stock moves are not features.
- [ ] Hyperparameter selection and model comparison use purged or rolling out-of-sample evaluation.

## Minimum reporting table

| Measure | Event outcome | Security outcome |
| --- | ---: | ---: |
| Eligible | | |
| Resolved | | |
| Unresolvable | | |
| Abstained | | |
| Brier | | |
| Base-rate Brier | | |
| Log loss | | |
| Calibration error | | |
| Accuracy at 50% | | |

Add subgroup rows only when they were predeclared or clearly labelled exploratory. Always show counts and include weak/negative slices.
