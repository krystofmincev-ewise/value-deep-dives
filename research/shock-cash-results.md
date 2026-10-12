# Scheduled cash shocks: reproducible experimental findings

Status: uncalibrated educational experiment, 10 October 2026. These are author
calculations from the study's deterministic Python model, not empirical
estimates. Model periods have no calendar interpretation. All cases retain ten
firms. No external service, account data, network retrieval or new dependency
was used for this extension.

Reproduction is implemented in `src/toy_economy/shock_cases.py`:
`shock_cases()` defines named paths; `build_shock_results()` returns compact
paths, summaries, 231 sensitivity records and seven enumerated freeze
boundaries. `research/shock-design-review.md` provides independent analytical
review of the investment rule and its stability conditions. The new tests are
in `tests/test_shocks.py`.

## Schedule and state

`simulate(parameters, shocks=(ParameterShock(...), ...))` applies named changes
at the start of a zero-indexed model period. Changes persist until changed
again. Unsorted schedules are canonicalized; duplicate dates, invalid values,
empty changes and dates beyond the requested horizon are rejected. Compound
changes on one date belong in one shock record.

The same cash ledger, capital stock, received-income lags, previous utilization
and previous GDP pass through the shock. There is no reinitialization of
household wealth, new money or assumed credit. Initial lagged nominal GDP is
an explicit parameter, default100, consistent with default inherited wages60
and gross dividends40. Every period records its active policy. The initial
parameters and complete planned schedule remain attached to the result even
when insolvency prevents later shocks from being reached.

All named shocks start at period5 after five periods of GDP100. Gradual fast
layoffs remove one job each period5–14. Gradual slow layoffs remove one job at
5,10,...,50. These ten discrete job losses are a coarse scenario, not an
empirical adoption rate.

## Fixed investment and investment that follows demand

The original default rule is unchanged:

    desired I = max(0, I0 + beta*(previous utilization-u_target)*K*p).

At beta0, actual investment20 continues if it is affordable and capacity
permits. All three full-layoff speeds eventually approach GDP40 and retain
capital200. Increasing beta changes that endpoint and can generate oscillatory
paths; it does not by itself establish a finite bankruptcy threshold.

The optional `replacement_adjustment` rule instead sets

    desired I = max(0, delta*p*K + gamma*(Y_previous/(a*u_target)-p*K)).

It replaces the fixed investment intercept and utilization coefficient; I0 and
beta do not affect this rule. The target capital stock follows lagged nominal
demand valued at current equipment prices. Positive a and target utilization
are required. Actual spending remains subject to the existing finance and
physical-capacity constraints. Purchased capital becomes productive next
period; replacement is never assumed to happen without expenditure.

For the default delta=gamma=.1, a=1 and u_target=.5, desired I simplifies to
.2 times lagged GDP. The implementation uses an algebraically equivalent form
that avoids numerical cancellation when lagged GDP becomes extremely small.
With zero wages, no transfers or autonomous consumption, owner propensity m
and unconstrained payments imply Y_t=(m+.2)Y_(t-1).

For abrupt full layoffs at5 and m=.5, GDP at5 remains100 because inherited
worker income is still spent. It then follows70,49,34.3,24.01,... . At159 it
is approximately1.396684e-22, investment3.990526e-23 and capital2.694435e-5.
Money remains200. This is asymptotic demand decay, not a finite-date collapse
or a wage-arrears bankruptcy. Capital declines more slowly than expenditure.

All three layoff speeds eventually approach zero under this closure. At the
same finite checkpoint they differ substantially because the final job loss
occurs at different times. Over periods0–159, worker consumption totals360,
630 and1710 in the abrupt, fast and slow replacement cases respectively.
These amounts include the five initial periods and are accounting totals,
not a welfare measure.

## The spending threshold and ownership countercase

At gamma=delta=.1, the unconstrained full-automation multiplier is m+.2:

| Owner spending propensity m | Multiplier | Half-life when multiplier <1 |
| --- | ---: | ---: |
| .20 | .40 | .76 periods |
| .50 | .70 | 1.94 periods |
| .70 | .90 | 6.58 periods |
| .79 | .99 | 68.97 periods |
| .80 | 1.00 | No decay in the stationary baseline |

At m=.79, period159 GDP is21.272570; slow decay is not evidence of a positive
long-run floor. At exactly m=.80, the inherited GDP100, consumption80,
investment20 and capital200 persist. In the ledger, m=.81,.90 and1 also
retain GDP100 in these particular runs because the owner household's cash
after financing investment caps consumption at80. The unconstrained multiplier
above one does not imply an explosive financed path.

An alternative offsets the lost wage income by routing60% of dividends to
workers when full automation begins at5. With worker propensity1 and owner
propensity.5, the effective propensity out of gross surplus is
.6*1+.4*.5=.8. Subsequent worker consumption60 and owner consumption20,
together with investment20, sustain GDP100 and capital200. Initial money
remains200; the case does not receive extra liquidity.

This is an income-right assumption, not a complete legal or financial ownership
transaction. At80% worker ownership GDP also remains100 through a binding owner
cash constraint. At100%, owner dividends disappear while this implementation
still asks owners to finance investment. Firm reserves temporarily fund it;
the first investment cash shortfall occurs at9. Eventually investment ceases,
capital wears down and output declines. A complete broad-ownership economy
would need an explicit worker-financing or retained-earnings rule rather than
this missing financing channel. These cases are conditional counterexamples,
not a policy recommendation.

## Actual insolvency and speed

The requested replacement-rule sensitivity grid compares 0,5,10 layoffs;
gamma=.05,.1,.2,.35,.45,.6; initial firm cash20,50,100,200; and abrupt,
fast and slow schedules. None of these216 cases reports unpaid wages through
period119. The result does not justify inventing a speed threshold absent from
the runs. Interior linear instability is not a guarantee of nonlinear
explosion: the zero-investment floor and cash/capacity constraints matter.

Permanent owner-equity cessation at5 with a positive final employment of five
workers causes all three speeds to stop at29 in the fixed-investment rule.
Their GDP is27.017034 versus contracted wages30, with wage arrears2.982966.
No speed-dependent survival difference exists in that comparison.

There is a genuine speed-dependent failure when the funding interruption is
temporary. Set initial firm cash0, suspend investment at5, restore20 at22,
and plan a final employment of five workers. Owner contributions still fund
the pre-shock baseline, which is exactly GDP100 for periods0–4.

| Layoff schedule | Final observed period | Workers then | GDP then | Worker consumption then | Wage arrears |
| --- | ---: | ---: | ---: | ---: | ---: |
| Five layoffs at5 | 159 | 5 | 70 | 30 | 0 |
| One per period5–9 | 159 | 5 | 70 | 30 | 0 |
| One every five periods5–25 | 22 | 6 | 33.354363 | 13.160537 | 2.645637 |

The slow schedule still has six contracted workers when worn capacity and
cash timing make wages unaffordable. It never reaches the planned five-worker
endpoint. Restoration at22 is too late for that path, while the other paths
recover. The result identifies an interaction among continued payroll,
replacement spending and available cash. It does not establish that abrupt
layoffs are generally preferable or that job losses improve welfare.

A separate all-job-loss comparison with owner finance cut off at5 has the
slow path stop at29, while abrupt and fast paths avoid wage arrears. Their
zero payroll mechanically prevents this particular stopping condition;
their demand and capital can still approach zero. Avoiding the model's
bankruptcy flag is therefore not evidence of economic health.

## Exact finite freeze boundaries

For the original fixed-investment rule, keep all ten workers, start a freeze
at5 and restore20 after d frozen periods. Enumerating integer d=1,...,30
gives these boundaries at a160-period observation horizon:

| Initial firm cash | Initial total money | Largest surviving tested d | First failing d |
| --- | ---: | ---: | ---: |
| 0 | 100 | 11 | 12 |
| 5 | 105 | 11 | 12 |
| 10 | 110 | 12 | 13 |
| 20 | 120 | 12 | 13 |
| 50 | 150 | 13 | 14 |
| 100 | 200 | 15 | 16 |
| 200 | 300 | 16 | 17 |

The boundary is monotone over all tested durations for every buffer. Before
the freeze, GDP100 is verified for every buffer. Increasing firm cash here
also increases total initial money; it is a liquidity sensitivity, not a
controlled redistribution of a fixed money stock.

A second collection, `freeze_thresholds_fixed_money`, holds initial money200
and worker cash60 fixed, assigning the remaining140 between firms and owners:

| Firm cash | Owner cash | Largest surviving tested d | First failing d | Failure period |
| --- | ---: | ---: | ---: | ---: |
| 0 | 140 | 11 | 12 | 17 |
| 20 | 120 | 12 | 13 | 18 |
| 50 | 90 | 13 | 14 | 19 |
| 100 | 40 | 15 | 16 | 20 |

GDP100 is verified before the shock in all four cases. The failure boundary
therefore also depends on the distribution of existing cash when its total
stock is held constant. Owners' extra cash does not automatically fund firms'
interim payroll during an investment freeze under the specified payment rule.

With firm cash100, d15 restores at20 and recovers; d16 stops at20 before
the scheduled restoration at21. With firm cash200, d17 restores at22 but
still stops at23, with GDP50.018927, wages60 and arrears2.672444. A financing
restart before the eventual stopping period need not repair accumulated
damage. The model stops at unpaid wages and supplies no bankruptcy resolution,
exit dynamics, emergency credit or post-failure recovery.

## Sector-specific liquidity

The default allocates current aggregate payroll across firms in proportion to
current value added. This assumes rapid reallocation of worker time and
suppresses some sector bottlenecks. Optional `wage_allocation="baseline_shares"`
holds those payroll proportions fixed at the baseline. Aggregate employment
and wages can still change with shocks.

With firm cash100 and a five-period investment freeze at5, the default
allocation survives and recovers. Fixed baseline proportions instead stop at8
while GDP67.75 still exceeds aggregate wages60. Each capital-goods firm has
contracted wages3 and cash10 before the freeze; absent capital orders its
cash drains10→7→4→1, then it can pay only1 of the fourth wage bill. Each
records arrears2. Other firms' profits do not automatically become targeted
capital-sector payroll finance before wages fall due.

This is a firm-level liquidity failure under restricted reallocation and
restricted cross-firm finance, not proof that aggregate GDP has fallen below
aggregate payroll. One firm's unpaid wage stops the entire experiment by
design. The model does not claim that this would shut down a real economy.

## Verification and limits

Tests cover scheduling persistence, unchanged defaults, inherited state,
explicit price changes, rule switching, ownership, exact replacement-rule
recurrences, consumption accounting, the freeze boundaries, sector arrears,
and replay of every cash payment in combined shock paths. All closing balances
in the named paths preserve their initial money stock to numerical tolerance
(maximum observed error below2e-12 in the initial integration run).

Paths retain actual and desired investment separately. Summaries report both
nominal and real GDP, household consumption, capital, financing shortfalls,
individual arrears and whether all scheduled changes were reached. Cumulative
totals cover completed periods through a stop; comparing them across unequal
observed horizons is not a matched-horizon welfare comparison. Results depend
on specified payment priorities, exogenous technology, aggregate capital,
dividend payout rules and the limited investment-financing channel. They do
not establish a universal ceiling, empirical failure probability, or calendar
time to collapse.
