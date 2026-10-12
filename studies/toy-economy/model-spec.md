# Model specification

The original baseline is specified below. The subsequent [shock specification](research/shock-specification.md) defines the scheduled changes, investment feedback, separate choice game and stationary maxima.

This is an uncalibrated thought experiment. All numerical inputs, technologies,
spending rules, initial balances and payment priorities are author assumptions.
The model predicts neither a country's GDP level nor a transition's duration.
One period has no assigned calendar length. Values are nominal currency units
per period; real values divide by a uniform price index, initially one.

The modules answer different questions. The simultaneous closure gives a
comparative static. The input-output accounts explain production accounting.
The cash ledger specifies a possible transition, with its own timing and
financing assumptions. They should not be mistaken for interchangeable
solutions to a complete general equilibrium model.

## 1. Simultaneous income and expenditure

`solve_equilibrium(ClosureParameters(...))` returns a frozen result dataclass.
Its `.accounts` is absent when the assumptions do not identify a feasible
stationary output. `dataclasses.asdict` converts every public result to
deterministic JSON-compatible structures; no random draws are used.

Let N be employed workers, w the nominal wage per worker, W=Nw, and T a transfer
from owners to the worker household. Workers include unemployed people; they
can receive transfers and ownership dividends even when N=0. At this layer
there is no depreciation, government, trade, price adjustment, inventory
accumulation, credit constraint or capital accumulation. Gross surplus is
P=Y-W. Investment I is an actual purchase of newly produced domestic capital
goods, financed by assumption; it is not a financial asset purchase.

Worker and owner desired consumption are

    Cw = cw(W+T)
    Co = co(Y-W-T)
    Y = Cw + Co + I
    Y* = [(cw-co)(W+T) + I] / (1-co), for co < 1.

The two households' disposable incomes sum to Y. Transfers reallocate income
and do not themselves add GDP. The solution requires Y >= W+T: the owner
household cannot fund a transfer from negative income. `infeasible_income`
reports cases requiring a loss-financing or wealth-transfer rule absent here.

The baseline N=10, w=6, cw=1, co=0.5, I=20 gives W=60, P=40,
Cw=60, Co=20 and Y=100. Losing L jobs at these parameters reduces the
unconstrained stationary Y by 6L. This is the result of these spending
assumptions, rather than an identity relating employment and GDP.

When co=1, the equation becomes 0=(cw-1)(W+T)+I. If its right side is zero,
the model returns `indeterminate`; it selects no particular GDP from the
continuum compatible with available capacity and nonnegative income. If the
right side is nonzero, it returns `no_stationary_equilibrium`. In particular,
cw=co=1 and I=0 does **not** imply collapse; cw=co=1 and I>0 cannot have a
finite stationary solution under this closure because aggregate saving is zero.

Production is limited by nominal capacity pQ. If Y*>pQ, output is capped,
investment gets first claim on it, and remaining consumption is allocated in
proportion to the households' desired consumption. Unfilled orders are
reported. This rationing convention supplies the missing short-run allocation
rule; it does not solve for market-clearing prices. If capped output cannot
cover wages and transfers, the case is infeasible rather than silently financed.

Completed accounts reconcile

    nominal GDP = actual C + actual I = wages + gross surplus
    gross saving = disposable income - actual C = actual I
    real GDP = nominal GDP / p.

A lower p buys more real goods from unchanged nominal expenditure if physical
capacity permits. A higher Q increases the ceiling on production; it does not
increase desired nominal expenditure by itself.

`investment_for_target(target_nominal_gdp, parameters)` calculates

    I_needed = max(0, (1-co)Y_target - (cw-co)(W+T)).

It rejects targets exceeding capacity or below wages plus transfer. In the
baseline, keeping Y>=100 after L layoffs needs I>=20+3L. This is necessary
spending arithmetic for the stated closure, not an assurance that good capital
projects, finance, capacity, or ultimate consumption demand exist.
The targeting helper rejects co=1 because that boundary does not identify a
unique stationary output; the separate equilibrium result handles its continuum.

## 2. Ten firms and intermediate production

`allocate_production(C, I, wage_bill=W, employed_workers=N, price=p)` traces
five sectors with two firms in each. Firms split their sector's business
equally. No market power or competitive pricing mechanism is modeled.

The sectors are raw materials, processing, intermediates/services, consumption
goods, and capital goods. The monetary input-coefficient matrix A has supplier
rows and purchaser columns. A[i,j] is input i bought per unit of sector j's
gross nominal output. The matrix is an explicit acyclic illustrative technology,
not an empirical input-output table:

| Supplier / buyer | Raw | Processing | Services | Consumption | Capital |
| --- | ---: | ---: | ---: | ---: | ---: |
| Raw | 0 | .40 | .10 | 0 | 0 |
| Processing | 0 | 0 | .20 | .20 | .20 |
| Services | 0 | 0 | 0 | .30 | .30 |
| Consumption | 0 | 0 | 0 | 0 | 0 |
| Capital | 0 | 0 | 0 | 0 | 0 |

With f=(0,0,0,C,I), gross output satisfies x=Ax+f. Reverse substitution
solves this acyclic system without a numerical dependency. Each supplier's
sales to each buyer are explicitly recorded. Every firm reports gross
turnover, intermediate expenses, value added, wages and gross surplus.

At C=80 and I=20, gross turnover=169.4, intermediate expenses=69.4,
and GDP=100. Adding firms' sales without deducting intermediate purchases
would double count the production chain.

Worker time is shared across firms in proportion to value added. Firm worker
counts are therefore worker-equivalents, not distinct people; the economy
still has ten workers at the baseline, each earning six overall. Wages are
allocated using the same weights. Baseline wage bills for each of the two firms
in raw/processing/services/consumption/capital are 4.02/4.68/6.30/12/3.
This avoids assigning six of wages to a firm with only five of value added.
At zero output, any contracted wages are allocated equally. Losses require
`allow_losses=True`, used only by the cash-constrained transition.

The common price index changes real quantities consistently. Relative input
prices and physical substitution are not modeled. Sector production remains
possible after layoffs only because an exogenous technology/capacity assumption
permits it; this model does not derive robots or software from unemployed labor.

## 3. Cash payments and productive capital over time

`simulate(DynamicsParameters(...))` returns a sequence of `PeriodResult`
records, every actual payment, and opening/closing balances. This is a
cash-conserving transaction ledger with an aggregate productive-capital stock,
not complete national balance sheets: equity valuations, bank liabilities,
loans, interest, land, inventories and financial-market prices are absent.

The initial 200 units of existing money are assigned to workers (60), owners
(40), and ten firms (10 each). The genesis of this inherited stock is outside
the experiment. The capital purchasing agent starts and ends each period
with zero. Transfers only move money between registered accounts; overdrafts
are forbidden. Every executed payment preserves the total stock of money.

Spending depends on last period's **received cash income**, subject to the
spender's available cash. Initial lagged incomes are explicit inputs rather
than claims that period-zero income has already been produced. Ownership share
alpha sends alpha of dividends to workers; it is an income-right assumption,
not an explicit asset-transfer transaction.

Each period follows this convention:

1. Owners make the requested budget-balanced transfer, limited by their cash.
   Any shortfall is reported.
2. Desired investment is
   `max(0, I0 + beta*(previous_utilization-u_target)*K*p)`.
   Default beta=0 gives fixed desired investment. When enabled, owners pay
   available cash up to this amount as equal equity contributions to firms.
   Contributions finance investment but are not GDP. Each firm budgets the
   smaller of I_desired/10 and its current cash for capital purchases.
3. Workers plan cw*(lagged wages+lagged worker dividends+current transfer).
   Owners plan co*max(0, lagged owner dividends-current transfer) plus optional
   `owner_autonomous_consumption`. Each plan is capped by cash after steps 1–2.
   The autonomous addition is spending that can recirculate as dividends, not
   necessarily a finite wealth drawdown.
4. Physical capacity is p*a*K. Investment receives first claim; consumption
   uses remaining capacity and is rationed proportionally. Firms fund a common
   capital purchasing agent, which pays the two capital producers equally.
   Households pay the two consumption-goods firms equally.
5. Intermediate purchases settle from downstream buyers to upstream suppliers.
   Firms then pay as much of contracted wages as cash permits and distribute
   nonnegative gross surplus as dividends, capped by available cash. Ownership
   share determines the recipients. A payout includes the gross capital charge;
   replacement must be funded explicitly in step 2 or from firm reserves.
6. Capital evolves as `K_next=(1-delta)K + actual_I/p`. Purchased goods become
   productive next period. Net domestic product is `Y-p*delta*K`.

Default a=1, K=200, delta=.1 and I=20 maintain capacity200. The same desired
investment does not mean indefinite growth: it exactly replaces depreciation
at the baseline. If financing fails, capital can shrink. Conversely, cheaper
capital goods or changed investment can grow the capital stock. Full automation
does not eliminate replacement or promise maintenance-free machines.

Gross national accounts use **accrued contracted wages**, while cash-income
spending uses wages actually paid. Any unpaid wages appear as `wage_arrears`;
the simulation stops at that period with `stopped_for_insolvency=True`.
It does not erase these claims, continue on hidden credit, resolve bankruptcy,
or model recovery. Terminal accounts can show operating losses and negative net
product; all cash balances remain nonnegative.

This convention yields an exactly stationary cash-financed baseline Y100,
C80, I20: owner saving20 is explicitly recycled as investment equity20.
Disabling that recycling drains firm cash by20 per period. After five periods
the initial firm reserves are exhausted and desired investment20 becomes
actual investment0, even though owners hold the missing money. Finance is
therefore a separate constraint from desired expenditure.

With immediate full layoffs but inherited balances, first-period Y remains100,
workers spend their finite inherited60 and finish with zero cash. Subsequent
Y is70,55,47.5,..., approaching40 at the default parameters. Owner cash rises
from40 to100 while the aggregate money stock stays200. The periods are model
steps, not a prediction of how quickly any real economy adjusts.

Transfers and partial ownership can support demand by routing income to the
high-spending household. Investment finance still comes from owners or firm
cash in this implementation. At extreme worker ownership, a realistic equity
funding arrangement might need workers to invest too; that extension is not
implicitly supplied. Neither transfer policy nor dividends create money here.

## 4. What the model does not establish

The result changes with spending propensities, actual investment, ownership,
transfers, cash timing, capacity and prices. It does not establish a universal
GDP ceiling after layoffs. It contains no optimized consumer utility, firm
investment valuation, monetary policy, international demand, demographic
structure, equilibrium interest rate, endogenous labor productivity, empirical
parameter estimation, or welfare ranking. Capacity/technology gains are
assumptions; GDP is not a welfare measure.

The separate `growth.py` counterexample uses a different closure: actual
investment is a fixed share of productive output. Its maintained demand,
financing and capital-productivity assumptions should be read with that module
and the article. It must not be substituted into the lagged-spending ledger
without reconciling their financial and behavioral rules.

Unit tests verify the accounting identities, funding and capacity boundaries,
zero/ten layoffs, full-spending indeterminacy, real versus nominal units,
explicit insolvency, deterministic outputs, and replay of every cash payment.
Those checks establish implementation consistency, not empirical validity.


## 5. Fully automated growth: a separate existence example

`automated_growth(GrowthParameters(...))` assumes `Y_real=a*K`,
`I_real=s*Y_real`, `C_real=(1-s)*Y_real`, and
`K_next=(1-delta)*K+I_real`. It therefore gives the exact per-period growth
rate `g=s*a-delta`. Positive consumption and capital growth together require
`delta/a < s < 1`; such an investment share exists only if `a > delta`.

All capital belongs to the owner group. Zero wages mean zero worker income
and consumption here. A constant nominal expenditure flow E purchases all
output at the assumed clearing price `p=E/Y_real`. E is a spending flow, not
a specified stock of money. This module does not replay those purchases in
the separate cash ledger. Price adjustment, scalable automated maintenance,
non-scarce complements, constant capital productivity and willing owner demand
are maintained assumptions, not findings about current AI.

Default K200, a0.5, s0.3, delta0.1 and E100 imply real GDP100, consumption70,
replacement20, net capital addition10 and growth5%. After twenty transitions,
GDP is265.3298 and consumption185.7308. Investing only20% replaces depreciation;
investing100% produces growing GDP but zero consumption. Neither result is a
welfare recommendation or an optimized household choice.

Domain boundary: full depreciation with no investment exhausts capital after
one period. Requesting a later zero-output period raises `ValueError`, because
no positive price can clear positive nominal spending against zero output.
Likewise, numerical overflow or underflow in extreme long paths is not a valid
economic result. The four named growth paths remain strictly positive and finite.
