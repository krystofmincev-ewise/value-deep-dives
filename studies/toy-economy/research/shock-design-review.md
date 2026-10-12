# Automation shocks: equations, stability and limits

Draft analytical design/review, 10 October 2026. Original derivations under the toy's assumptions; not empirical estimates. The follow-up asks what changes when automation is sudden or gradual, firms pursue their own benefit, investment responds to customers, and capital or finance can constrain the transition. Keep the existing fixed-investment cases as counterexamples rather than replacing their answers with a single collapse story.

## Recommended minimal extension

Use a payroll schedule changing employed workers at the beginning of named periods. Sudden and gradual paths must share initial money, capital, spending rules, final employment and technology. Keep wages per continuing worker fixed. Automatable production is still an assumption; a schedule is not a solved adoption decision. Record both the announced schedule and the policy actually reached if a run stops early.

Add an optional replacement-and-capacity-adjustment investment rule:

```text
K_t                  opening productive capital
Y_(t−1)              previous nominal GDP
p, a                 fixed common price and capacity per capital unit
u*                   desired capacity utilization, 0 < u* <= 1
r = a u*
K_desired_t          Y_(t−1)/(p a u*)
I_desired_t          max(0, δ p K_t + γ p(K_desired_t−K_t))
                     = max(0, (δ−γ)pK_t + (γ/r)Y_(t−1))
```

Then apply the existing explicit cash financing, investment-first physical rationing, input settlement and wage-payment sequence. Capital evolves using **actual**, not desired, investment. This is an adaptive capacity rule, not a full discounted-profit optimization. It expresses a reason to stop buying additional equipment when expected sales no longer support it. Use an explicit initial lagged GDP input; cash distributions need not equal accrued output in every regime.

The target uses last period's sales against current capital. Multiplying last period's utilization by current capital instead creates an additional cross-period capital ratio and does not have the linear system below. With price shocks, unchanged expected nominal sales are being valued at current equipment prices; fixed-price comparisons are the clean analytical benchmark.

## Interior steady state and stability

Assume solvent firms, nonnegative gross surplus, full profit distribution, no binding household cash constraint, no investment floor, no capacity rationing, and fixed parameters. Let `c` be the effective consumption propensity out of profit income. With worker ownership fraction `α`, it is

```text
c = α c_w + (1−α)c_o
B_t = (c_w−c)W_(t−1) + (c_w−c_o)T_t + A
Y_t = cY_(t−1) + B_t + I_t
K_(t+1) = (1−δ)K_t + I_t/p
```

Here `A` is autonomous owner consumption, `T` the current owner-to-worker transfer, and `W` paid wages. The lagged consumption equation requires received income to match the stated profit/wage flows; it is not valid after wage arrears or cash rationing. In particular, workers who save without an investment-financing route can eventually change the distribution of the finite money stock. The baseline `c_w=1` avoids that additional stationary-cash issue.

For constant wages and transfers, define `D=1−c−δ/r`. A positive interior stationary allocation, if financially and physically feasible, is

```text
B = (c_w−c)W + (c_w−c_o)T + A
Y* = B/D
pK* = Y*/r
I* = δY*/r
C* = (1−δ/r)Y*
```

For `B>0`, `D>0` is necessary for this positive solution. Nonnegative worker/owner budgets, `Y*>=W`, `u*<=1`, the cash distribution and the actual payout/financing convention remain additional checks. This is a steady allocation rather than proof every starting state reaches it. If `D<=0`, do not report the negative/infinite algebraic value as an economic prediction: a boundary, floor or financing rule must determine the outcome.

For state `[Y_(t−1),K_t]`, deviations from an interior fixed point have matrix

```text
J = [ c+γ/r       p(δ−γ) ]
    [ γ/(p r)     1−γ    ]

trace(J) = 1+c+γ(1/r−1)
det(J)   = c(1−γ)+γ(1−δ)/r
```

For `0<=c<1`, `0<δ<=1`, `0<γ<=1` and `r>0`, the exact strict Jury conditions reduce to

```text
D > 0
det(J) < 1
```

The omitted third inequality is always positive on these domains:
`1+trace+det = 2+2c+γ[(2−δ)/r−1−c] > 0`.
The first condition follows from `1−trace+det=γD`.

If `h=(1−δ)/r−c>0`, the second condition is `γ<(1−c)/h`. If `h<=0`, it holds automatically in the declared range. The case `γ=0` has a neutral capital state and should not be described as strict convergence to a unique joint fixed point.

For the baseline `c=.5, δ=.1, r=.5`, `D=.3` and the interior stability boundary is exactly **γ=5/13≈.384615**. Below it the fixed point is locally attracting while the active regime persists; above it an interior perturbation grows. This is a conditional dynamical boundary, not an automation-percentage threshold or a proof of economic collapse.

| γ | Interior spectral radius | Interpretation |
| ---: | ---: | --- |
| .05 | .963746 | Two positive decay modes |
| .10 | .900000 | GDP recurrence .7; slower capital mode .9 |
| .20 | .871780 | Damped interior oscillations |
| 5/13 | 1.000000 | Boundary; no strict asymptotic stability |
| .40 | 1.009950 | Interior oscillations amplify |
| 1.00 | 1.341641 | Strong interior instability |

## What zero wages do and do not imply

With `γ=δ=.1`, the capital term cancels from desired investment and `I_t=.2Y_(t−1)`. Once the old wage income has passed through consumption,

```text
Y_t = .7Y_(t−1) + .5W_(t−1)
```

At fixed employment the steady outcomes are:

| Jobs remaining | Wages | GDP | Consumption | Investment | Capital |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10 | 60 | 100 | 80 | 20 | 200 |
| 9 | 54 | 90 | 72 | 18 | 180 |
| 7 | 42 | 70 | 56 | 14 | 140 |
| 5 | 30 | 50 | 40 | 10 | 100 |
| 0 | 0 | 0 | 0 | 0 | 0 |

The lower GDP relative to the old fixed-investment table comes from investment responding to lost customers. With full layoffs, the inherited first round can still produce 100, followed by 70,49,34.3,24.01,... rather than an instant zero. Strictly positive geometric values approach zero asymptotically; rounding is not a finite-time extinction event.

There is a useful stronger bound: when `0<γ<=δ`, `J` is nonnegative. If `D>0`, its determinant condition also holds. At zero wages, transfers and autonomous spending, the nonnegative cash/capacity-rationed state is bounded above componentwise by the unconstrained linear path. Therefore it converges to zero even with those caps. This proves attraction for this narrower parameter regime and behavioral closure.

For faster adjustment, distinguish local interior stability from the clipped model. At zero GDP the investment floor is a kink, so an interior Jacobian alone is insufficient. Independent clipped probes with `γ=.4` and `γ=1` both reduce investment to zero and then let GDP decay, despite their unstable interior eigenvalues. At the baseline `c=.5<1−δ=.9`, once the zero-investment branch is reached, the ratio of demand to capital falls further and can remain there. Conversely, other parameter combinations, capacity rationing and cash constraints can produce different branches. Do not infer a global collapse or blow-up theorem from the eigenvalue chart.

Counterexamples must remain beside the adverse case:

- Old fixed investment 20 sustains zero-wage GDP40 at `c=.5`; replacement-adjustment changes that assumption.
- Autonomous consumption `A>0` changes the interior steady state to `Y*=A/D` even at zero wages, subject to cash/physical feasibility.
- At `D=0` and `B=0`, the linear equations have a continuum rather than selecting zero. For example, worker ownership60% gives effective `c=.8` with the baseline `δ/r=.2`; steady saving can fund replacement at a positive scale. Stability in the scale direction is neutral, and financing still needs checking.
- Full-spending circulation, flexible prices, growing productive capital or different investment rules invalidate a universal zero-wage-collapse claim.

## Sudden versus gradual is a path comparison

Stable unconstrained paths with the same final payroll and other parameters converge to the same final allocation. Speed changes interim demand, capacity, cash distribution and the chance of crossing a constraint. It does not automatically change the steady state. Slower automation also preserves wages for longer by construction; compare cumulative consumption and worker access explicitly rather than attributing that mechanical difference to a special multiplier.

Use the same common calendar horizon and show a fixed post-completion window as a secondary comparison. Report peak/trough and terminal GDP and consumption, cumulative consumption, worker/owner consumption separately, capital, financing shortfalls, wage arrears and the first binding constraint. A run that stops early has not reached its announced endpoint.

Separate the meanings of “break”:

1. **Demand extinction:** output/consumption approach zero under a declared spending rule.
2. **Payroll failure:** contracted wages exceed cash paid; this engine stops with arrears and does not resolve bankruptcy.
3. **Lost access:** worker consumption reaches zero while GDP and owner consumption stay positive.
4. **Replacement failure:** insufficient investment erodes capital, possibly much later than the spending shock.
5. **Consumption sacrificed to capital:** GDP remains positive or grows while all output is invested.
6. **Temporary slump:** a measured decline or recovery delay, not an absorbing economic state.

Zero employment mechanically prevents a wage-arrears stop. A sudden full-automation path “surviving” while a slower path with continuing payroll stops is evidence about obligations and financing, not proof sudden automation is safer or better for households. Do not search indefinitely for a dramatic collapse if representative probes fail to produce one.

## Firms' private benefit and conditional maxima

An adoption payoff model should remain separate from the ten-stage cash ledger unless its setup payments, suppliers, wages and financing are actually reconciled. A domestic AI operating bill is another firm's revenue; new equipment is investment. Neither may simply disappear from aggregate income because it is a cost to one adopter.

With `n` equal-share firms, wage saving `w` and a stationary GDP reduction `b` caused by one more adopter, private operating gain is `w−b/n` before setup/user costs. Aggregate operating-surplus change is `w−b`. The difference exposes a demand effect shared with other firms. It is a conditional payoff game; exit, cash feasibility and expectations can change its equilibrium. An NPV against the loss-making “keep operating without adoption” alternative does not establish an investment is worthwhile versus exit or insolvency. Fixed setup cost also requires a recipient and financing if the game is promoted into a transition model.

For stationary diminishing-return production `F(K)=A K^α`, `0<α<1`, investment share `s∈[0,1]` and depreciation `δ>0`,

```text
K*(s) = (sA/δ)^(1/(1−α))
Y*(s) = A K*(s)^α
C*(s) = (1−s)Y*(s)
```

The unique consumption maximum is at `s=α`, equivalent to `F'(K)=δ`. Stationary GDP increases with `s` and is maximized at `s=1`, where consumption is zero. These are analytic global maxima on the **declared stationary domain**, not numerical local maxima mistaken for universal limits. With `α=.5, A=100/sqrt(200), δ=.1`, `Y*=500s`, `C*=500s(1−s)`: maximum consumption125 occurs at `s=.5,Y=250,K=1250`; maximum stationary GDP500 occurs at `s=1,C=0,K=5000`.

A per-period resource output cap300 changes stationary output to `min(500s,300)`. The GDP maximizing set becomes `s∈[.6,1]`; consumption's maximum remains125 at `.5`. Above the cap, additional capital/investment cannot raise output. The cap is an assumed resource restriction, not an estimated world ceiling. Initial capital above a sustainable steady state can temporarily produce more while depreciating; a stationary maximum is not automatically a bound on every conceivable transient. The constant-returns AK counterexample has no finite consumption maximum when `a>δ` and capital is unrestricted, so no universal GDP maximum follows from the number of workers alone.

## Independent probes and verification limits

The small offline probe is `.local/toy-economy-shock-design/check.py` in the owned worktree; run with `python3`. It independently computes eigenvalues, fixed points, clipped zero-wage paths and the stationary maxima using only the standard library. No production module was edited by this review, and no browser, API, paid run or package installation was used. The production simulation workstream separately implements and checks cash timing.

After implementation, independent direct imports of `dynamics.py`, `incentives.py` and `limits.py` confirmed the derived values. Replacement-adjustment paths with a period-five shock and 240 periods converge to GDP90/70/50 for nine/seven/five remaining jobs, corresponding consumption72/56/40, investment18/14/10 and capital180/140/100; no wage arrears occur. The zero-job path approaches zero without an arrears stop. Its tiny positive values must not be called exact finite-time extinction.

The binary incentive module gives multiplier5/3, private recurring gain5, collective surplus change−4, and incremental ten-period NPV32.6087 at the default discount rate. With nine rivals already automated, retaining the last worker gives absolute NPV−38.6087 and adopting gives−6 after setup, so exit0 beats both. This is the explicit boundary of a binary adoption claim. A separate entry/exit benchmark, if included, must recompute active market shares and is not a solved cash-feasible transition.

The limits module's stationary maxima agree with direct 1,000-period capital paths at investment shares .2/.5/1. A resource cap100 moves the consumption optimum to the binding kink, share .2 and consumption80; the unrestricted golden-rule share .5 no longer maximizes consumption under that cap. Thus a lower-resource boundary is also checked, rather than only the cap300 case where the old optimum happens to survive.

Independent checks of the investment-freeze examples also distinguish payment survival from full recovery. With firm cash100 and every worker retained, a 15-period freeze from period5 survives but eventually settles at GDP80, consumption60 and investment20. Physical rationing first moves cash into worker balances; workers then cannot spend that accumulated wealth because their consumption rule uses only recent income. Owners use their available cash to finance investment and buy no consumption. Capital returns toward200 while the original GDP100 circulation does not. A 16-period freeze instead stops at period20, before its planned restart, with GDP41.178226 and wage arrears2.872482. This is path dependence in this cash/spending closure, not a general irreversible technology effect.

With fixed baseline payroll shares, a five-period equipment freeze produces a different failure: both capital-goods firms exhaust their initial cash and each misses wages2 at period8. Aggregate GDP67.75 still exceeds contracted wages60. Positive aggregate operating surplus therefore does not establish every firm can meet payroll when transfers, credit and rapid labor reallocation are absent. In the common-freeze example with a planned five-worker endpoint, the slow path stops at period22 while six workers are still contracted, in the very period equipment purchases resume. The abrupt and faster paths reach five workers and later GDP70. Neither comparison supplies a household-welfare ranking or a completed endpoint for the stopped path.

These results are algebra and original numerical examples. Existing primary-source context remains in `economic-foundations.md`; no additional external factual claim or calibrated coefficient is introduced here. AI assistance: independent Codex Sol review with the inherited user-selected setting, 10 October 2026.
