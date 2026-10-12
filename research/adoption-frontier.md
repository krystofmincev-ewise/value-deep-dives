# Where does more automation stop helping in this town?

11 October 2026. This is a bounded deterministic experiment using the frozen gradual-adoption engine. It asks which assigned task-automation level performs best under declared contracts, prices, demand and an 80-round horizon. It does not solve for a global technological, investment, shareholder-value or equilibrium optimum.

## Experiment and output contract

`scripts/run_adoption_frontier.py` runs 101 terminal automation shares from 0 to 1 in increments of 0.01. Both consumer firms receive half their terminal share at round 5 and the full share at round 10. Each path requests 80 recorded rounds, numbered 0–79. Other baseline assumptions remain fixed: initial consumer equipment 100 per firm, ten human shifts in total, equipment orders 20, depreciation 10%, worker spending propensity 1 and owner propensity 0.5. AI and equipment suppliers retain the experiment's exogenous maintained infrastructure assumption.

The ten profiles cover protected salary/hourly pay × redeployment/take-time × AI capacity 10/25 task-hours, with AI fee 3, plus two protected-pay/redeployment comparators with fee 0. These are purposeful controls, not parameter distributions. All 1,010 parameter points are retained as summaries, including all 152 payment stops. A failing payment round remains recorded, including actual payment shortfalls. No future output is imputed. Only the 858 completed paths enter equal-horizon endpoint and cumulative rankings.

For each profile the JSON stores final base-price GDP, final worker real consumption, final total real consumption, delivered investment, and the sums of GDP and worker consumption through the recorded run. It identifies every tied finite-grid maximum and adjacent-grid local peak or plateau. Failed runs break the neighborhood: a maximum beside a failure is labeled a survival edge, not an interior optimum. Maxima of cumulative quantities compare only completed 80-round paths. Totals through an earlier stop remain available but are not ranked as equal-horizon outcomes.

GDP includes gross equipment purchases. It is not net output, worker consumption, leisure or welfare. The price rule and assigned adoption path are assumptions; firms do not optimize prices or freely choose any automation level in this sweep.

## Actual results

Protected-pay and hourly-pay/redeployment profiles are identical here because both retain the five paid shifts per consumer firm. Hourly pay does not mean paying only the task-hours actually used.

| Contract/use, AI fee | AI capacity | Completed /101 | Terminal share maximizing final GDP and worker consumption | Final real GDP | Final worker real consumption |
| --- | ---: | ---: | --- | ---: | ---: |
| Protected or hourly, redeploy, fee 3 | 10 | 78 each | 0.50 | 114.117647 | 70.588235 |
| Protected or hourly, redeploy, fee 3 | 25 | 59 each | 0.58, survival edge | 117.594981 | 72.639225 |
| Protected, take-time, fee 3 | 10 or 25 | 90 each | 0 | 100 | 60 |
| Hourly, take-time, fee 3 | 10 or 25 | 101 each | 0 | 100 | 60 |
| Protected, redeploy, fee 0 | 10 | 101 | 0.50 | 134.285714 | 85.714286 |
| Protected, redeploy, fee 0 | 25 | 101 | 0.60–1 plateau | 145 | 93.75 |

The main fee 3/capacity 10 maximum has final nominal GDP 100, total consumer quantity 94.117647 and equipment purchases 20. Each consumer firm's gross operating surplus is 1.176471, cash stays 25, and the AI provider uses only 58.8235% of its actual capacity. More automation does not help beyond 50% under this pricing rule, although the actual AI service is not yet fully used.

The capacity 25/fee 3 result must not be called sustainable. At 58% adoption each consumer firm loses 0.306727 per round. Each ends round 79 with cash 3.268883 and has spent 3.067271 of its buffer over the final ten rounds. Nominal GDP has stopped changing, but cash has not. Extending that same path to 120 requested rounds produces wage arrears at round 90. The neighboring 59% path already stops at round 66. A last-ten-round diagnostic excluding consumer losses and buffer draw instead selects 55% adoption: real GDP 115.808383 and worker consumption 71.856287. That 55% path also completes the separate 120-round check. This diagnostic is useful evidence about cash persistence, not a general proof of a stationary equilibrium.

The cumulative objectives select 50% in the fee 3/capacity 10 profile: GDP 9,020.667727 and worker consumption 5,565.500795 over 80 rounds. At capacity 25, the best completed cumulative path is again 58%, with totals 9,268.909472 and 5,713.332838, subject to its cash-depletion warning. The fee 0/capacity 10 path selects 50%, with totals 10,470.588235 and 6,652.941176. For fee 0/capacity 25 all terminal shares 60–100% tie at the endpoint, but 100% gives the greatest cumulative totals: GDP 11,321.428571 and worker consumption 7,291.071429. Its larger half-stage during rounds 5–9 brings gains sooner. Equal endpoints do not imply equal transition benefits.

The take-time rules select zero adoption for both measured objectives in this fee 3 experiment. That does not show that shorter hours are undesirable. The objective omits leisure; protected salaries with reduced planned capacity pay AI fees without an offsetting output expansion, while hourly take-time also reduces worker income.

## Why the peak depends on the price rule

For a symmetric protected-pay/redeployment firm with capital 100, the pricing rule's normal feasible quantity is

`q_normal = min(100, 40/(1−a), 4 A/a)`.

Here `A` is the provider's total AI task-hours and each AI-using firm initially receives half the planning quota. Terms with zero denominators impose no constraint at their appropriate endpoints. The target consumer price with fee 3 and pass-through 0.8 is

`p = 1 − 0.8[0.75 − 30/q_normal − 3 a/8]`.

With `A=10`, normal capacity switches from the human limit to the AI quota at `a=0.5`. Consequently `p=1−0.3 a` up to 0.5 and `p=0.4+0.9 a` thereafter. The lowest quote is 0.85 at 0.5. When nominal consumption remains 80, total real consumption is `80/p`, which yields the observed peak. The quota affects the cost forecast even though realized sales use only 58.8% of AI capacity at that point. This is a consequence of normal-cost pricing, rather than evidence that demand has exhausted the physical AI service.

With `A=25`, consumer capital binds normal output at `a=0.6`; the lowest quote would be 0.82 there. Consumer losses and cash depletion prevent that quote from becoming the best completed 80-round path. Before capital binds, total consumer operating surplus is `20 − 30 a/(1−0.3 a)` when nominal consumption is 80. It turns negative above `a=5/9`. The grid's 55% maximum without final buffer draw is consistent with that threshold. Loss-making firms and profitable suppliers then distribute income differently, so the all-nonnegative-profit stationary shortcut cannot be imposed on the 58% result.

With fee 0 and `A=25`, capital makes the normal quantity 100 per firm throughout `a=0.6–1`. The quote remains 0.64, producing the observed endpoint plateau. A different demand rule, markup, fee, pass-through, staffing contract or investment policy can move or remove these maxima. Grid resolution also limits their precision.

## A separate exact physical upper bound

There is a narrower “global” question that can be answered algebraically: with today's inherited resources fixed, how much could the consumer sector physically produce if the task share were freely assigned and all human shifts retained and redeployed? Let total consumer equipment capacity be `K=200`, human task-hours `H=10`, AI task-hours `A`, and productivity eight tasks per task-hour. Then

`Q(a) ≤ min(K, 8 H/(1−a), 8 A/a)`.

Optimizing this static envelope gives `Q_max=min[K,8(H+A)]`. At `A=10`, the two task constraints balance at 50%, giving at most 160 consumer units. At `A=25`, equipment caps output at 200; every share from 60% through 100% can meet that cap. If the equipment sector separately delivers its fixed 20 units, potential gross base-price GDP is 180 or 220 respectively.

These are resource bounds, not realizable demand forecasts. They neither allocate income nor establish affordable purchases, profitable prices, cash feasibility, future replacement, optimal investment or welfare. The main capacity 10 path actually sells 94.117647 consumer units at its finite-grid maximum, well below the physical 160. The difference exposes the role of the declared demand and pricing closure. This bound holds inherited equipment fixed; it is not an upper bound on a growing economy with future capital accumulation.

## Reproduction and verification

From the study directory:

```sh
PYTHONPATH=src python3 scripts/run_adoption_frontier.py
PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_adoption_frontier.py' -v
.venv/bin/mypy --strict scripts/run_adoption_frontier.py
.venv/bin/ruff check scripts/run_adoption_frontier.py tests/test_adoption_frontier.py
```

The generator verifies that its source dependencies do not change during execution. All three focused tests pass: tied flat peaks, failure-breaking neighborhoods/endpoint exclusion, and the physical-envelope boundary. Strict typing and lint pass. The final regeneration took 19.87 seconds and retained all 1,010 paths. The zero-fee comparator is a mathematical control; it does not claim that supplying AI uses no real resources.

| Artifact | SHA-256 |
| --- | --- |
| `scripts/run_adoption_frontier.py` | `a008818479a68dca7ed7142200b8148e26b14638449f86edfd628d67b3593f1c` |
| `tests/test_adoption_frontier.py` | `b801d750a8c237539453e423eedd5196d6677290894e2c0f1e9e0f0ae52c1fcb` |
| `outputs/adoption/frontier.json` | `f76b823d22ae8fe8c1b567bc784e4d29df4a55336570f4702a6136168dfc8bb7` |

The JSON embeds the exact model and generator source hashes, which matched the files after regeneration. No empirical probabilities, new primary-source claims or external data were introduced by this sweep.
