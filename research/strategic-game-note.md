# Does the automation incentive survive an exit option?

Analytical probe, 10 October 2026. Code: `src/toy_economy/strategic_game.py`.

## Finding

Adding exit materially qualifies the binary automation comparison. With the demand-sensitive investment default and positive setup costs of one or five wage units, there is **no pure-strategy Nash equilibrium** among human, robot and exit choices, for either 10 or 100 potential firms. “Automation beats retention” does not imply that automation is the firm's best available choice. Near the all-robot profile, closing beats both.

This is an implication of a narrow, reversible stationary game. It is not evidence of actual GDP cycles, a forecast of collapse, or proof that no equilibrium exists when mixed strategies, sunk costs, entry barriers, finance and capacity are included. The binary result remains correct for its restricted comparison; its unrestricted interpretation does not survive this exit test.

## Choices, demand and payoffs

The game reuses `IncentiveParameters`. There are N potential firms and a fixed baseline aggregate wage bill W0=60. A human firm pays w=W0/N; a robot firm and an exited firm pay zero wages. Thus N=100 divides the same wage bill into smaller firms rather than creating a tenfold economy.

Let H, R and X count human, robot and exited firms. The number active is m=H+R. All active firms share final sales equally. This replaces the detailed ten-firm input-output chain; it is not a model of strategic price setting.

The income-spending closure is:

    mu = (worker_propensity - owner_propensity)
         / (1 - owner_propensity - investment_share)
    floor = autonomous_investment
            / (1 - owner_propensity - investment_share)
    wages = H * w
    GDP = mu * wages + floor

The default worker propensity 1, owner propensity .5 and investment share .2 give mu=5/3 and floor=0. All-human GDP is 100 for both firm counts.

For every unilateral counterfactual, the program recomputes the wage bill, demand and number of active suppliers. It does not keep a departing firm's lost market share fixed. Given other firms' counts h and r, both potential active choices have denominator h+r+1:

    human payoff = [mu*w*(h+1) + floor] / (h+r+1) - w
    robot payoff = [mu*w*h + floor] / (h+r+1) - setup_cost/annuity
    exit payoff  = 0

The annuity is the present value of one unit paid at the end of each of ten periods, discounted at 5%: 7.721734929. Robot setup cost equals the selected setup ratio times w. Dividing it by the annuity gives an equivalent recurring private hurdle. Multiplying these payoffs by the annuity reproduces the stationary NPV comparison with a fresh upfront setup cost.

**The robot hurdle is not maintenance spending, an actual installation order, or a GDP expense.** The installation's production, seller income and funding are outside this game. Repeated strategy changes also do not carry a sunk installed robot forward. These are reversible comparisons, not a transition model with economically irreversible adoption.

At all-exit, autonomous demand cannot be supplied. The program reports actual GDP zero and `unserved_demand=floor`, rather than assigning positive production to absent firms. Unilateral entry then captures demand under the ordinary closure. With a zero floor, this boundary has no numerical effect.

Inputs producing negative aggregate owner income even at all-human employment are rejected: they would need a different spending/financing closure. Individual human firms can nevertheless have negative payoffs because equal sales are divided among human and robot firms with different wage bills. The exit choice tests the sustainability of those private losses.

## Why a positive adoption comparison can be misleading

At the default N=10 and setup ratio 1, consider a firm facing nine robot rivals:

| Its choice | Recurring equivalent private payoff |
| --- | ---: |
| Retain a worker | -5.0000 |
| Automate | -0.7770 |
| Exit | 0.0000 |

Automation beats retaining the worker by 4.223 per period, yet closing is better. In NPV terms, automation is -6, retention about -38.61, and exit zero. A positive difference between two losses does not establish a profitable investment.

With no autonomous floor and every firm automated, recurring sales are zero. A positive fresh setup hurdle therefore makes exit strictly preferable. Conversely, when everybody has exited, a sole human entrant pays w, supports GDP mu*w and earns (mu-1)*w>0 at the default mu. That prevents all-exit from being a pure equilibrium.

## Exhaustive count enumeration

A pure Nash equilibrium means no individual firm can improve its payoff by changing its own strategy while all other choices stay fixed. The implementation examines every count profile, `(N+1)*(N+2)/2` profiles in total, and checks deviations for each occupied strategy. Every count profile represents all permutations of those firm choices. Mixed-strategy equilibria are not computed.

All runs use W0=60, the default demand closure, a ten-period payoff horizon and 5% discounting:

| Potential firms | Setup cost / wage | Pure count equilibria | GDP at those equilibria |
| ---: | ---: | --- | ---: |
| 10 | 0 | 9 profiles: H=0, R=2 through 10, X=10-R | 0 |
| 10 | 1 | None | Not applicable |
| 10 | 5 | None | Not applicable |
| 10 | 10 | H=10, R=0, X=0 | 100 |
| 100 | 0 | 99 profiles: H=0, R=2 through 100, X=100-R | 0 |
| 100 | 1 | None | Not applicable |
| 100 | 5 | None | Not applicable |
| 100 | 10 | H=100, R=0, X=0 | 100 |

The zero-cost robot equilibria are **weak**: exit also pays zero. At least two active robots are needed. A lone costless robot would prefer becoming a sole human firm, earning positive profit from its own wage-supported demand. The zero-output result is therefore sensitive to a boundary assumption; it is not a robust demonstration that realistic firms choose a permanently inactive robot economy.

The positive-cost result also has a short proof. Write q=setup_cost/(annuity*w). When a profile with human firms has an exited firm, nonnegative incumbent-human payoff implies that an additional human entrant would earn positive payoff at mu>1. Such a profile cannot be pure Nash. If all N firms are active, changing human to robot gains:

    w * (1 - q - mu/N)

For `0 < q < 1 - mu/N`, that gain is strictly positive. Therefore no human firm can remain in an all-active equilibrium. All robots then have negative payoffs and prefer exit. No pure equilibrium remains. The tested ratios 1 and 5 satisfy this condition at N=10 and N=100.

The all-human profile becomes a strict equilibrium when the setup ratio exceeds `(1-mu/N)*annuity`: about 6.4348 wage units at N=10 and 7.5930 at N=100. The tested ratio 10 is above both thresholds. Equality permits ties and is a separate boundary case.

## Local incentives and global objectives

In this game, global recurring GDP is mechanically maximized at H=N, giving 100: robots add no wage-supported demand and the supply side contains no productivity or capacity constraint to offset the demand loss. This does **not** show that avoiding automation maximizes GDP in a richer economy. That answer was placed in the closure by holding technology and capacity outside the objective.

Nor is pure Nash a welfare maximum. It tests unilateral private deviations. Aggregate consumption, worker consumption, net production, the usefulness of investment and an owner's valuation of leisure would require separate objectives and omitted mechanisms. A firm's profitable deviation and a socially beneficial allocation are different quantities.

As a bounded sensitivity, use fixed autonomous investment of 20 and investment share zero, matching the earlier floor-40 comparison. With N=10 and setup ratio 1, the unique pure equilibrium is all robots, GDP40. Each robot's private recurring equivalent payoff is about 3.223, so exit no longer defeats adoption. A maintained autonomous customer changes the exit result. The game assumes that spending can persist and be financed; it does not establish either proposition.

## Best-response algorithms, not calendar-time paths

The program also starts from all-human firms and applies deterministic reversible best responses. Ties retain the firm's current strategy; if two alternative strategies tie above the current one, priority is human, then robot, then exit.

Simultaneous updates use the preceding profile for every firm. Asynchronous updates sweep once through labeled firms in a fixed order, allowing later firms to observe earlier revisions. A round is an algorithm sweep, not a simulated period of production, investment or payment. The program detects cycles using full labeled action tuples at the same sweep phase. Repeating aggregate counts alone is insufficient for the asynchronous rule.

| Firms | Setup ratio | Simultaneous algorithm | Asynchronous algorithm |
| ---: | ---: | --- | --- |
| 10 | 0 | Fixed point after 1 round | Fixed point after 1 sweep |
| 10 | 1 | Cycle length 3, start 0 | Cycle length 19, start 1 |
| 10 | 5 | Cycle length 3, start 0 | Cycle length 19, start 1 |
| 10 | 10 | Initial profile is a fixed point | Initial profile is a fixed point |
| 100 | 0 | Fixed point after 1 round | Fixed point after 1 sweep |
| 100 | 1 | Cycle length 3, start 0 | Cycle length 111, start 2 |
| 100 | 5 | Cycle length 3, start 0 | Cycle length 109, start 2 |
| 100 | 10 | Initial profile is a fixed point | Initial profile is a fixed point |

At positive costs 1 and 5, the simultaneous algorithm repeats all-human, all-robot, all-exit, all-human. Firms can reverse choices without a capital history, and all react to the same old profile. **This is an algorithmic cycle, not evidence of a real-world GDP cycle.** The asynchronous lengths depend on labels, scheduling and the artificial reversible choices. They belong in the methodological appendix, not a forecast chart.

## Verification and reproduction

Eleven focused tests pass, including an independently written labeled-profile brute-force unilateral-deviation check against count enumeration, the exit comparison, changed market concentration after entry, weak ties, a positive-floor equilibrium, asynchronous/full-profile and simultaneous cycle detection, bounded iteration, normalization and invalid-input rejection. Strict mypy and Ruff lint/format checks pass for the new files. The reviewer independently spot-checked the payoff counterfactuals, all-exit boundary and asynchronous update logic without finding a blocker.

Run from `studies/toy-economy`:

```sh
PYTHONPATH=src python3 -m unittest discover -s tests -p test_strategic_game.py -v
.venv/bin/mypy --strict src/toy_economy/strategic_game.py
.venv/bin/ruff check src/toy_economy/strategic_game.py tests/test_strategic_game.py
.venv/bin/ruff format --check src/toy_economy/strategic_game.py tests/test_strategic_game.py
```

The matrix can be regenerated by looping over `firms in (10,100)` and `setup_cost_per_wage_unit in (0,1,5,10)`, calling `enumerate_pure_nash(p)` and `simulate_best_responses(p, mode=...)`. No external data, model API calls or calibrated parameters were used. No cash-ledger, article, output, source-log or other model files were changed by this subtask.
