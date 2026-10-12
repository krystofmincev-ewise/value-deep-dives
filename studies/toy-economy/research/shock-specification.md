# Shock, incentive and limit specification

Draft original experiment, 10 October 2026. Read `model-spec.md` for the original
accounts and payment order. Four connected questions use different explicit
models; none is silently substituted for another. They are uncalibrated.

## 1. Scheduled shocks in the existing cash economy

`simulate(parameters, shocks=(ParameterShock(...), ...))` applies each named change
at the start of its zero-indexed period. Changes persist. Initial cash, inherited
income, capital and previous GDP are never reset. The schedule is sorted and
validated; duplicate-period instructions must be explicitly combined. Each output
records the active policy and actual per-firm wage arrears. The first arrears
observation terminates the path. A later scheduled intervention is not executed
after that stop. No debt is silently created or erased.

Defaults retain the baseline engine. The original investment rule is
`max(0,I0+beta*(previous_utilization-target_utilization)*pK)`.
The optional `replacement_adjustment` rule instead is

    target_nominal_capital = previous_nominal_GDP / (a*u_target)
    desired_I = max(0, delta*pK + gamma*(target_nominal_capital-pK)).

Here a is real output capacity per capital unit, u_target desired capacity use,
delta depreciation and gamma the fraction of the capital gap adjusted per period.
This rule ignores I0 and beta: it has no autonomous equipment-spending floor.
Actual investment remains subject to equity/firm-cash finance and production
capacity. New equipment becomes productive next period. No optimizing investment
valuation or foresight is claimed. All selectable shock-companion paths use p=1.

`wage_allocation=current_value_added` is the original frictionless reallocation
of worker hours across firms. `baseline_shares` fixes each firm's fraction of total
contracted payroll to the baseline C80/I20 shares: each paired firm gets
4.02/4.68/6.30/12/3 of the W60 payroll. Changes in total employment scale these
shares; sector-specific layoffs and worker-level skill matching are not modeled.
It is a sensitivity to rigid commitments, not a perfect labor-market model.

Immediately before payroll, firm i needs

    opening_cash_i + equity_i - capital_purchases_i + value_added_i >= wage_bill_i.

These are the cash-flow components under this engine's ordering. Suppliers have
already been paid; dividends come after wages. Failure may occur at one firm even
when aggregate GDP exceeds total wages. Operating losses reduce reserves before
an arrears stop. There is no automatic cross-firm loan or pooling of reserves.

## 2. Exact demand loop and local stability

In an unconstrained neighborhood with fixed p, put r=a*u_target and let c denote
the effective propensity to consume capital income. At zero worker ownership,
c=c_owner. At worker dividend share alpha, c=c_owner+alpha*(c_worker-c_owner).
For unchanged wage income W and autonomous owner consumption A, define
B=(c_worker-c)W+A. The demand and capital equations are

    Y_t = (c+gamma/r)Y_(t-1) + (delta-gamma)pK_t + B
    pK_(t+1) = (1-gamma)pK_t + (gamma/r)Y_(t-1).

The constant-price capital units matter. In the baseline r=.5, delta=gamma=.1,
capital cancels from the demand equation and

    Y_t = (c+.2)Y_(t-1) + (1-c)W_(t-1).

After the last inherited wage income is spent, W=0. With c=.5, Y multiplies by
.7 each period, and its half-life is log(.5)/log(.7)=1.94336 periods. If
c=.79, the multiplier is .99 and half-life68.96756. At c=.8, the stationary
scale is not selected by the identity; the actual inherited-cash scenario
supports Y100. At larger c, desired spending can exceed cash, so the linear
recurrence must not be extrapolated past the binding constraint.

When D=1-c-delta/r>0, the interior fixed point is

    Y* = B/D; pK* = Y*/r; I* = delta*Y*/r.

For c=.5, this gives Y*=(5/3)W. W60/54/42/30/0 therefore supports stationary
GDP100/90/70/50/0 under this closure. The old fixed-I20 closure gives a different
answer. At W=A=0, 0<gamma<=delta and D>0, the nonnegative cash/capacity-capped
system is bounded above by a stable nonnegative linear path, so it tends to zero.
For faster gamma, floors and other nonlinear constraints require separate analysis.

The unconstrained local Jacobian is

    J = [[c+gamma/r, delta-gamma], [gamma/r, 1-gamma]].

At the stated baseline its stability boundary is gamma=5/13. Above that boundary,
interior perturbations can grow; a zero-investment floor and cash/capacity limits
then alter the path. The simulated bounded cycles are not a proof of unbounded
GDP or certain insolvency. See the independent derivation in `shock-design-review.md`.

## 3. Private incentive and exit games

`incentives.py` uses equal-share final-goods producers, not the five-sector network.
Let N firms initially split W0=60. If k automate, W=(N-k)W0/N. Assume investment
I=mY+A_I, where m=.2 and A_I=0 by default. Then

    Y = [(c_w-c_o)W+A_I]/(1-c_o-m)
    mu = dY/dW = (c_w-c_o)/(1-c_o-m).

The stationary domain requires c_o+m<1 and nonnegative aggregate surplus. With
w=W0/N, one firm saves w, loses mu*w/N of its own sales, and imposes the rest of
the demand loss on other firms. Its gross recurring gain is w*(1-mu/N), while
aggregate gross-surplus change is w*(1-mu). At N10, these are +5 and -4.
This is a restricted binary comparison holding rivals fixed, not full optimization.

A setup-cost screen discounts a specified number of recurring gains, subtracting
a one-time setup hurdle. That cost is not subtracted from GDP. Actual domestic
installation would require finance and create temporary investment production;
the stationary payoff screen does not simulate those flows or maintenance changes.
Negative nonadopter operating surplus is flagged as requiring finance or exit.

`strategic_game.py` adds human/robot/exit actions, equal sales shares among active
firms, free entry and reversible choices. The robot's hurdle is setup cost divided
by its annuity factor. It compares equivalent private per-period payoffs; it is
not depreciation or a GDP deduction. With no producers, actual output is zero and
any autonomous orders are unserved. Every occupied strategy is checked against all
unilateral deviations, enumerating count profiles exactly. An empty pure-Nash set
does not exclude mixed strategies. Best-response rounds are solver iterations,
not cash-ledger periods or an economic forecast. Cycles depend on update order and
on reversibility/free entry. See `strategic-game-note.md` for proof and examples.

## 4. Stationary physical maxima with diminishing returns

`limits.py` assumes F(K)=min(A*K^alpha,R), with optional resource cap R,
0<alpha<1, positive depreciation delta and constant investment share s in [0,1].
Owners willingly buy all output; financing and pricing are assumed, not replayed
in the cash model. Former-worker consumption remains absent unless separately
redistributed. Positive starting capital is required to reach the positive branch;
K0=0 is absorbing.

Without the cap,

    K*=(sA/delta)^(1/(1-alpha)); Y*=A*K*^alpha; C*=(1-s)Y*.

Stationary GDP increases with s and is largest at s=1. Sustainable consumption
is strictly concave in the relevant capital range, with unique maximum F'(K)=delta,
equivalently s=alpha. With alpha=.5, A=100/sqrt200 and delta=.1, Y*=500s,
C*=500s(1-s). The analytic global maxima over this stationary family are GDP500
at s1/C0 and consumption125 at s.5/Y250. A dense grid cross-check and 1,000-period
capital paths agree with the formulas.

A cap R300 gives Y*=min(500s,300). Every s in [.6,1] maximizes GDP; the minimum
investment share on that plateau leaves consumption120. The consumption optimum
remains125 at s.5/Y250. A lower cap can move the consumption optimum to the kink.
The general implementation evaluates the uncapped golden-rule stock versus the
minimum capital needed to attain the cap.

These are maxima over fixed technology and stationary saving policies. They are
not maxima over all starting stocks, transient output, inventions, prices or
welfare. The original linear capital technology can instead grow indefinitely
if s*a>delta; it has no finite GDP ceiling without another constraint.

### Growth-rate objectives

Every positive stationary allocation has zero long-run growth. For the uncapped
square-root technology, starting K200 and Y100, investing all output gives
next K280 and next Y100*sqrt(1.4): the maximum one-step real-GDP increase is
18.3216% over saving shares0..1. It has zero current consumption and is not a
sustainable constant growth rate. In the original AK technology, real growth
is s*a−delta; at a.5 and delta.1 its conditional maximum is40% at s1, also with
zero consumption. That example holds nominal GDP100 through falling prices.
These quantities were moved from the main article during its readability edit;
they do not change the model or numerical outputs.

## 5. Reproduction and interpretation

Run all tests with `PYTHONPATH=src python3 -m unittest discover -s tests -v`.
Run `PYTHONPATH=src .venv/bin/python scripts/build_shock_report.py` for the saved
paths, summaries, payoff games, capital curves and plots. No network or credentials
are used. JSON contains full assumptions alongside outputs; CSV contains summary rows.

The freeze-duration sweep reports exact tested integer boundaries, not interpolated
calendar dates. One sweep varies firm cash and therefore total starting money;
a second keeps total money200 and reallocates between owners and firms. Both verify
five initial GDP100 observations. Cumulative outcomes of stopped paths cover only
observed periods and must not be compared as if they completed the requested horizon.

No empirical likelihood, policy optimum, debt/GDP limit, private investment return
forecast or complete general equilibrium is estimated. The separate models expose
which spending, finance, strategic and technology assumptions change the answer.
