# Optional closed-bank experiment: protocol and executable results

Status: uncalibrated educational experiment. This is a separate capitalization reset, not a change to the original cash-only study. No observations, estimated parameters, calendar timing, or policy recommendation are claimed. Model-round interest rates of 0%, 1%, and 3% are not annual percentage rates.

## What is being tested

Can finite, explicitly repayable credit bridge a temporary interruption in income or equipment orders? What changes when the interruption lasts beyond the assumed repayment source? The model separates a prudent refusal when future income is known to be absent from an optimistic forecast that subsequently proves wrong. Fair treatment means no fees, penalty rates, compulsory refinancing, or priority over wages. It does not mean every requested loan is approved or that losses vanish.

The same ten firms and five-sector production chain remain in place. Runtime dependencies remain standard-library-only. Source modules are `bank.py` (transactions and debt vintages), `bank_dynamics.py` (the optional engine), and `bank_cases.py` (named experiments, summaries, and sensitivity runs). The existing `simulate()` still uses conserved cash and has no bank. Its shared payment helper accepts a small structural `PaymentLedger` interface; this changes annotations, not its economic behavior.

## Opening capitalization and the matched control

Original available money is 200: workers 60, owners 40, and firms 100. For this separate experiment, owners withdraw 20 of their firms' buffers and subscribe 20 of bank equity before round 0. Owner deposits temporarily go 40→60→40; firm deposits go 100→80. Each firm's deposits are 8, rather than 10. The bank opens with reserve asset 200, customer deposits 180, no loans, and equity 20:

`R + L = D + E = 200 + 0 = 180 + 20`.

The bank-equity claims belong directly to the owners; their firm capital has correspondingly fallen. Equity capitalization is a financial rearrangement, not production, bank operating income, or a free addition to customer deposits. The no-new-credit control has exactly the same bank and opening deposit balances. Comparing its failure at period 7 to the original nonbank buffer 100 failure at period 8 would confound credit with different direct firm buffers; the banking comparison uses buffer 80 on both sides.

Every account is at this one bank. Reserves are an exogenous opening asset, stay 200, and never leave the bank. There are no cash withdrawals, other banks, external payments, insurance, bailouts, market funding, or new equity injections. This is an accounting and timing experiment, not a model of bank runs or regulatory compliance.

## Transaction contract

The ledger checks the balance sheet after every recorded event, as well as prohibiting deposit overdrafts:

| Transaction | Loans L | Deposits D | Equity E |
|---|---:|---:|---:|
| Originate principal q | +q | +q | unchanged |
| Transfer between customers | unchanged | unchanged in aggregate | unchanged |
| Repay principal q | −q | −q | unchanged |
| Pay interest h | unchanged | −h | +h |
| Distribute earned bank profit h | unchanged | +h | −h |
| Negotiate zero-recovery forgiveness q | −q | unchanged | −q |

Only cash interest is booked as bank income. Unpaid simple interest is a separately reported contractual memo, never new principal, a booked loan asset, deposits, or profit. `closing_bank.loans` is outstanding principal; `unpaid_interest` adds the memo; `total_debt_owed` is their sum. The memo is not compounded. No impairment valuation is attempted before contractual maturity: the reported equity is this cash-basis ledger's book equity, not an assessment of market value or real prudential solvency.

Default explicitly means negotiated zero-recovery **legal forgiveness**. Both the principal claim and debtor liability disappear, bank equity absorbs remaining principal, and deposits survive. Unpaid interest is forgiven separately without a booked loss because it was never a booked asset. Merely writing down an asset would not by itself legally discharge a debtor; that is not the convention used here.

Cumulative reconciliation is executable:

`L = total principal advanced − principal repaid − principal forgiven`

`D = D 0 + principal advanced − principal repaid − interest paid + profit distributed`

`E = E 0 + interest paid − profit distributed − principal forgiven`.

Principal and interest are financial/property-income flows, not extra final output. GDP remains `C + I = wages + gross operating surplus = sum of firm value added` under the original production convention. Repaying principal reduces the cash available for dividends; it does not reduce GDP a second time.

## Underwriting, order of payment, and stopping

Loans have identifiable vintages, origination periods, a fixed bullet maturity 20 rounds later, and a per-round simple interest rate. Debt service applies only to opening vintages. The ledger also excludes unspent same-round advances from cash eligible to service old loans. Fresh credit therefore cannot silently repay old principal in the same step.

Credit must fall within a finite declared origination window and have an explicit expected income-return period. If no credible future income is assumed, the bank refuses. Borrower principal caps are 15 per firm and 120 for workers in the main cases, with lower-cap comparisons. New lending must also preserve book equity / outstanding principal of at least 10%. This is an assumed underwriting rule, not a statement of applicable bank regulation. A further conservative limit uses assumed future service income through maturity, divided by `1 + rate * loan_term`, and subtracts existing principal. Forecasts are declared inputs, not calibrated or derived from an optimization model.

Payroll bridge loans fill only the immediate deposit shortfall needed to pay contracted wages. The assumed post-restoration firm surplus is the firm's baseline surplus at C 80/I 20/W 60. Firms settle inputs, pay wages, service opening debt from **positive current operating surplus**, then distribute remaining surplus. They do not spend protected opening buffers to service debt. This contractual service-budget restriction also applies at maturity; any remaining obligation is resolved under the zero-recovery convention rather than seized from other assets.

Household bridge loans aim at a consumption floor 60 during the declared gap. They fund purchases; wages/dividends arrive later in the same round. Household service is capped at 20% of wages and ownership dividends actually received that round. No restored income means no service capacity. Lower later consumption is an explicit repayment cost. Ownership income can be a repayment source even with zero jobs.

Paid bank interest above original capital is distributed at the end of the round to the ultimate owners. Principal repayments are never distributable profit, and losses must be recovered above opening capital before further distributions. Bank dividends feed next-round owner spending. Retaining income is an optional input, not the default fair-bank case.

The engine stops at the first unpaid wage, book equity depletion E=0, or negative book equity E<0. Summaries separately expose both wage arrears and bank equity if conditions coincide. An early wage stop can occur before loan maturity: unpaid loans and interest remain visible, and a later default or recovery is not invented. Cumulative values cover only completed rounds through the stop. At E=0, deposits still have book asset coverage in this closed ledger, but there is no loss buffer; stopping is a conservative model boundary, not a universal theorem about legal bank closure.

## Reproducible findings

The saved machine-readable result is `outputs/banking/results.json`. Stable identifiers and selected round numbers are in `teaching_selection`; `paths` contain the complete compact paths, `summaries` contain outcomes, and `sensitivity_summaries` contain 64 runs. Period numbers are zero-indexed; rounds 0–4 precede shocks.

### Temporary equipment freeze, fixed firm payroll shares

Equipment orders are zero in rounds 5–9 and return to 20 at 10. Firm wages stay at their original sector allocation.

* `equipment_freeze_5_no_credit`: the capital-goods firms use their deposits 8, then stop at 7 with aggregate unpaid wages 2. GDP 69.5 at that stop is above aggregate wages 60; the failure is sector liquidity, not GDP already below total payroll.
* `equipment_freeze_5_zero_interest`: principal is 2 at 7,8 at 8,14 at 9. After restoration it falls 10 at 10,6 at 11,2 at 12, and 0 at 13. All 14 advanced is repaid; no default or unpaid wage is hidden. This is the clean accounting diagram.
* `equipment_freeze_5_one_percent`: all 14 principal is again repaid at 13; cash interest totals 0.42805818 and is distributed. At 10, principal 10.18 plus unpaid-interest memo 0.06 gives total owed 10.24. The period 9 principal 14 already has interest memo 0.10.
* `equipment_freeze_10_finite_credit`: credit extends operations but its firm cap is reached; unpaid wages stop the run at 12 with principal 30 still outstanding. Calling this a rescue would be incorrect.
* `equipment_permanent_optimistic_forecast`: expected restoration at 10 fails. The origination window closes, wages stop at 11, and principal 20 plus unpaid interest remains unresolved. No contractual default is yet recorded, because the engine stops before maturity.

The duration/rate/firm-limit sweep uses durations 2/3/5/7/10/15, rates 0/1/3%, and caps 5/15 per firm. With cap 15, the 2-round freeze needs no credit; 3/5/7-round freezes borrow 2/14/26 respectively and repay at all tested rates. The 10- and 15-round freezes hit unpaid wages with unresolved debt. These are outcomes for these assumptions, not maximum feasible real-world durations.

The equity sensitivity keeps reserve asset 200 and total originally contributed funds constant: E 5/10/20/40 pairs firm deposits 95/90/80/60. Required bridge advances 11/12/14/18 for the 5-round freeze all repay. Higher bank capital also removes more immediately spendable firm buffers, so this sweep cannot be read as a pure effect of a capital-ratio requirement.

### Temporary household income gap

Jobs disappear at 5 and return at 7, with ordinary flexible firm wage allocation. Workers consume inherited income at 5; loans are needed at 6 and 7 because spending precedes the restored wage payment.

`worker_gap_2_one_percent` advances 120 in two 60 vintages. Some opening debt is already repaid at 7, so maximum **closing** outstanding principal is 108.6, not 120. Worker consumption is 60 at 5/6/7 and 48 at 8. All principal and 6.351717957839126 interest is paid by 17. `worker_gap_2_partial_bridge_limit_20` advances 20, gives partial smoothing, and repays by 8 with interest 0.282. `worker_income_restored_by_ownership` restores ownership income instead of jobs and also fully repays; the transition path is not the stationary ownership example from the original paper.

Smoothing is not a claim of more cumulative output. Over the 60-round horizon, the zero-interest bridge and no-credit household case both have cumulative worker consumption 3480. With 1% credit, it is 3473.6482820421606, lower by exactly interest paid. Cumulative GDP is 5880 with zero-interest credit, 5873.648282042169 with 1% credit, and 5885 without credit. The additional 5 in the no-credit comparison is traceable: restored-wage period 7 has GDP 55 and wages 60, consumes 5 of firm buffers, and yields cumulative owner consumption 1205 rather than 1200. Terminal firm deposits are 75 rather than 80. The credit comparison preserves those buffers. These accounting differences do not establish a welfare ranking.

### Known permanent loss versus forecast error

`worker_permanent_loss_prudent_refusal` assumes no future wage or ownership income. The bank refuses, debt stays 0, worker consumption becomes 0 at 6, and fixed-investment output tends 40. Fair credit alone does not replace a missing permanent income source.

In `worker_permanent_loss_forecast_error_limit_20`, the bank incorrectly expects income to return at 7 and lends 20. No repayment arrives. At maturity 26 it forgives principal 20 and unpaid interest 4. Deposits remain 200, loans become 0, and equity 20 becomes 0. The run stops at capital depletion.

The more severe 120-limit stress also preserves the uncompleted resolution: at 26 the first 60 vintage is forgiven, equity falls to −40, and the second 60 principal plus its unpaid-interest memo remains active when the insolvent-bank stop occurs. It would be misleading to label all 120 repaid or forgiven.

### Physical supply boundary

`worker_gap_capacity_constraint` deliberately changes productivity to 0.4 from round 0: K 200 gives capacity 80, and I 20 replaces depreciation so capacity remains 80. It therefore does not share the other household case's pre-shock GDP 100. Credit 76 is advanced and repaid, but GDP never exceeds 80 and sums 4800 over 60 rounds. Its matched no-credit arm, `worker_gap_capacity_constraint_no_credit`, also has the same lower productivity and opening balances: GDP is 60 at round 7 and sums 4780. Credit fills that demand shortfall to the physical ceiling of 80, but rationing still cuts worker purchases below their requested floor. Deposits can fund orders; they cannot create missing physical capacity by bookkeeping.

## Verification and limits

The focused tests cover event identities, funded capitalization, overdrafts and input validation, simple-interest memos, partial service, principal destruction, earned-profit restrictions, default/legal forgiveness, same-round refinancing exclusion, exact no-credit regression including payment order, temporary repayment, permanent-loss refusal, wrong-forecast losses, remaining obligations at a stop, GDP identities, and finite bank capital. The focused banking suite has 28 tests, including public-ledger transaction chronology and rejection of premature, duplicate, or already settled forgiveness, and rejection of direct principal payments or forgiveness that evade current-round interest accrual. Strict typing and lint run on the new modules. A saved JSON equality check confirms that the structure-only helper extraction changed no results.

This model omits collateral, debtor heterogeneity within the worker group, optimization, loan pricing, expected-loss valuation, bank runs, multiple banks, external trade, government insurance, deposit haircuts, bankruptcy recovery, maturity renegotiation, and financial-service value added. Assumed lending against restored baseline income can be wrong. These omissions are boundaries, not evidence that real loans are always repayable or that bank credit cannot matter elsewhere.

AI assistance: implementation and calculations used the session's selected Codex model/effort on 2026-10-11, with source inputs limited to this study's original assumptions. The code, saved outputs, transaction reconciliations, regression tests, and independent review provide the verification; model output is not external economic evidence. Primary-source background belongs in the separate banking research note.
