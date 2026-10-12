# Saved data for the teaching visuals

> Historical snapshot: the optional bank model and appendix were added later on 11 October 2026. This record describes its stated earlier scope; its hashes are not a current certification of changed files. See [banking review](banking-review.md) and [banking verification](banking-validation.md) for the extension.

Verified 11 October 2026 from the saved JSON only; no model, output, article,
figure or source code was changed. Numbers below are invented model units.
Small floating-point residuals may be rounded for display.

Source abbreviations:

- **B:** `outputs/results.json`.
- **S:** `outputs/shocks/results.json`.
- **L:** `outputs/shocks/limits.json`.

In S, `paths[case].periods[t]` has `period == t` for every selected path.
Periods are zero-indexed. A shock at t5 follows five baseline periods; it is
not the fifth calendar year. Read changed assumptions from each row's
`active_policy`, because `parameters` deliberately retains the initial policy.

## Spending circuits

Read Y, W, P and I from a row's `production.nominal_gdp`, `.wages`,
`.gross_surplus` and `.investment`. Read household purchases directly from
`worker_consumption` and `owner_consumption`. Received ownership income is
`worker_dividends` and `owner_dividends`.

| Illustration | Exact saved row | W | Worker dividends | Owner dividends | Worker C | Owner C | I | Y |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | S `paths.baseline.periods[0]` | 60 | 0 | 40 | 60 | 20 | 20 | 100 |
| Zero jobs; owners spend 80% | S `paths.replacement_zero_jobs_owner_spending_080.periods[6]` | 0 | 0 | 100 | 0 | 80 | 20 | 100 |
| Zero jobs; workers receive 60% of dividends | S `paths.zero_jobs_ownership_60.periods[6]` | 0 | 60 | 40 | 60 | 20 | 20 | 100 |
| Zero jobs; fixed investment 20 endpoint | S `paths.fixed_abrupt_zero_jobs.periods[159]` | 0 | 0 | 40 | 0 | 20 | 20 | 40 |
| After a 15-period investment freeze | S `paths.freeze_15_recovery_firm_cash_100.periods[159]` | 60 | 0 | 20 | 60 | 0 | 20 | 80 |

For the exact simultaneous baseline and fixed-investment endpoint, B contains
`equilibrium.layoffs_0.result.accounts` and
`equilibrium.layoffs_10.result.accounts`. Their owner disposable incomes are
40 in both cases. In these two feasible cases gross surplus equals owner
income. That equality is not safe to assume for every cash-constrained case.

The owners' equity contribution is a financing arrow, not additional GDP:
`equity_contributions == 20` in each circuit above to display precision.
The firms then buy newly produced capital goods, which is the I=20 GDP arrow.
Do not count both arrows as separate production. Baseline total firm turnover
is 169.4; deducting intermediate purchases 69.4 gives GDP 100.

## Feedback sequence after full layoffs

Use S `paths.replacement_abrupt_zero_jobs.periods[t]`, with default owner
spending 50%, replacement adjustment gamma=.1, depreciation=.1,
productivity 1 and target utilization .5:

| t | W | Worker C | Owner C | Total C | I | Y | Owner dividends received |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 0 | 60 | 20 | 80 | 20 | 100 | 100 |
| 6 | 0 | 0 | 50 | 50 | 20 | 70 | 70 |
| 7 | 0 | 0 | 35 | 35 | 14 | 49 | 49 |
| 8 | 0 | 0 | 24.5 | 24.5 | 9.8 | 34.3 | 34.3 |

Current consumption follows **previous received income**, not the dividend
received at the end of the same period. Thus at t6, owner purchases 50 and
investment 20 reflect t5 income/GDP 100. At t7 they reflect 70. The first
layoff period still has worker purchases 60 from inherited money and lagged
wages, although current wages are zero. In the 80%-spending circuit, use t6
or later to show worker consumption 0; t5 would incorrectly suggest an
immediate disappearance of worker purchases.

## Failure despite sufficient aggregate GDP

Use S `paths.freeze_5_failure_fixed_wage_shares.periods[8]`:

- `production.nominal_gdp == 67.75`; contracted `production.wages == 60`.
- `wages_paid == 56`; `wage_arrears == 4`.
- `firm_wage_arrears[0]` is `capital_goods_1`; `[1]` is `capital_goods_2`.
  Each record has `contracted_wages: 3`, `wages_paid: 1`, `arrears: 2`.
- Each capital firm's `opening_balances[firm_id] == 1` and
  `closing_balances[firm_id] == 0`. Their closing cash over t4–8 is
  10→7→4→1→0. Investment was frozen at t5.

The wage allocation is `baseline_shares`; other firms' cash is not
automatically transferred to the capital firms before payroll. This is a
firm liquidity bottleneck, not a statement that aggregate GDP is below
aggregate wages. The experiment stops at this unpaid wage; it does not
simulate an economy-wide shutdown afterward.

Here owner dividends 13.75 exceed aggregate gross surplus 7.75: profitable
firms pay dividends while the capital firms incur contracted wage losses 6.
Do not draw a single arrow labelled “all profits 13.75” or show wages 60 as
fully paid. Worker consumption 60 still reflects the previous wage receipt;
it is compatible with current wages paid 56.

## Cash stocks and the freeze endpoint

Stocks at the end of the selected circuit rows, rounded:

| Row | Worker cash | Owner cash | All firm cash | Total existing money |
| --- | ---: | ---: | ---: | ---: |
| Baseline t0 | 60 | 40 | 100 | 200 |
| Zero jobs; owners spend 80%, t6 | 0 | 100 | 100 | 200 |
| Zero jobs; 60% worker ownership, t6 | 60 | 40 | 100 | 200 |
| Fixed investment endpoint t159 | 0 | 100 | 100 | 200 |
| 15-period freeze endpoint t159 | 154.077574 | 20 | 25.922426 | 200 |

Read these from `closing_balances`; sum all ten firm accounts separately
from `workers`, `owners` and the zero-balance `capital_orders` agent.
GDP 100 is a per-period flow, not the amount of money in existence. Income,
cash already held, machines and investment expenditure are different things.

At the freeze endpoint owners receive 20, finance investment 20 first, and
have no cash available for consumption under the specified payment order.
Workers retain substantial cash but their rule spends lagged income 60;
it does not spend their entire accumulated balance. This path survives and
eventually restores capacity near 200, but demand settles at 80. “Recovery”
in the case name must not be translated as a return to GDP 100.

## Stationary physical production and consumption

These are a **separate real production model**, not the cash ledger:
uncapped Y=A*K^.5, A=7.071067811865475, depreciation.1. Investment share s
means actual production allocated to capital goods, not owner consumption
propensity or household ownership share.

| Illustration | Exact saved row | s | Real GDP | Consumption | Replacement I | Capital stock | Net product |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Largest stationary consumption in this model | L `uncapped.curve[50]` | .5 | 250 | 125 | 125 | 1250 | 125 |
| Largest stationary gross GDP in this model | L `uncapped.curve[100]` | 1 | 500 | 0 | 500 | 5000 | 0 |

Keys are `investment_share`, `real_gdp`, `real_consumption`,
`replacement_investment`, `capital`, `net_domestic_product`.
Equivalent maxima are at `uncapped.maxima.maximum_stationary_consumption`
and `.maximum_stationary_gdp`; use a tolerance rather than exact equality
when selecting a floating-point s=.5 maximum.

For a genuine time animation, L `uncapped.paths["0.5"]` and
`uncapped.paths["1"]` each contain 500 saved periods, with actual
`opening_capital`, `consumption`, `investment`, `depreciation` and
`closing_capital`. Both begin at capital 200 and real GDP 100. At t0 their
C/I splits are 50/50 and 0/100 respectively; they approach the table's
stationary values. At either stationary endpoint investment only replaces
wear: machines do not keep accumulating. The s=1 GDP 500 case yields no
consumer goods and no net product. Resource-capped curves have different
maxima and must not be labelled with the uncapped 500 endpoint.

## Verification snapshot

Across all saved rows in the seven selected S paths, 3,876 checks passed:
Y=C+I, C=worker C+owner C, Y=contracted W+gross surplus, and closing money 200.
Identities were checked with absolute tolerance 1e-8 and relative tolerance 1e-12.
This checks saved-data consistency and does not validate empirical assumptions.

SHA256 of the reviewed source outputs:

| File | SHA256 |
| --- | --- |
| B | `0f169322fdb7119d8cd5dcc448ce966c4c304dd784925e0109f9a12d774d9c5a` |
| S | `70abb218384b9b969b1b5df2888f4b6d24b47f3fc0b74dcf553e5f682f607d02` |
| L | `c0c70b6e3ba094317445b3cf8359091ce3fc73f3ee7d17c9ef90a67fde494a7c` |

Refresh this mapping if a reviewed output changes. Animations should reveal
these saved flows or saved time paths, with the underlying assumptions shown;
they should not invent intermediate economic trajectories or imply that
equal GDP means equal household consumption or welfare.

## Private incentive diagram

Figure 04 uses `outputs/shocks/incentives.json`,
`firms_10_cost_1.result`: wage saving 6, total sales loss 10,
adopter’s sales loss 1, recurring private gain 5 before setup costs, and
GDP 100 → 90. This is the separate equal-share game, not the cash ledger.
The targeted editorial reviewer checked this saved record on 11 October 2026.
