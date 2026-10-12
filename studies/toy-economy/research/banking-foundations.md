# A fair bank in the toy town: foundations and experiment design

Draft research note. Source cutoff and access date: 11 October 2026. This note proposes a separate experiment; it reports no new simulation results. Sources and verification are recorded in [banking-sources.md](banking-sources.md).

The useful question is whether credit can bridge a temporary shortage of money before a borrower receives income. A second question is what happens when the missing income never returns. Those are different problems, even with a fair bank charging no fees.

## What the bank changes

A bank loan creates a loan asset for the bank and a matching customer deposit. Principal repayment reverses those entries. Moving a deposit between two customers at the same bank changes who can spend it, not the total deposits outstanding. These mechanisms are explained in the Bank of England's [money-creation article](https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy).

The new deposit can finance a purchase. It is not itself a newly produced machine, meal or service. The distinction between financial claims and physical resources is made explicitly in Jakab and Kumhof's [Bank of England working paper, pp. 5–6](https://www.bankofengland.co.uk/-/media/boe/files/working-paper/2018/banks-are-not-intermediaries-of-loanable-funds-facts-theory-and-evidence). This is research by the authors, not an official policy position.

Credit can therefore help unused productive capacity find a customer. It cannot, by an accounting entry alone, provide additional electricity, materials or machines. Whether spending raises real production depends on the experiment's capacity and production rules. A loan financing a purchase of an existing asset does not make that asset newly produced. GDP concerns production; financing belongs in a separate financial ledger. See the BEA's [national-accounts concepts](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-02.pdf).

## The agreed opening balance sheet

Use a fresh appendix reset, identical in the credit-enabled and credit-disabled runs. The bank exists in both. Begin with the town's inherited 200 of base cash, place it at the single bank, then capitalize the bank with 20 from the original firms' 100 of buffers. If the owners own the bank, record the intermediate owner distribution and equity purchase consistently. The owners' final deposits remain 40.

| Bank assets | Amount | Bank liabilities and equity | Amount |
| --- | ---: | --- | ---: |
| Inherited base cash/settlement asset, R | 200 | Worker deposits | 60 |
| Customer loans, L | 0 | Owner deposits | 40 |
| | | Firm deposits | 80 |
| | | Bank equity, E | 20 |
| Total | 200 | Total | 200 |

This is an author-chosen initial condition, not evidence about a real banking system. It adds no new base cash or productive resources. The 200 on the bank's asset side and the 180 of customer deposits must not both be offered to households and firms as independent spending balances. Equity is the owners' residual claim, not another customer deposit.

The inherited base asset has an issuer/history outside the active experiment. The town remains closed to current trade and new external financing, but it is not a model in which every opening financial asset was created by private bank lending. Disclose that boundary rather than inventing a matching private loan.

All payments stay at one bank. No customer withdraws currency, no payment goes to another bank, and the inherited asset pays no return. This omits settlement outflows, deposit competition and bank runs. The bank's ability to create deposits still does not mean unlimited lending: credit risk, profitability, capital and liquidity constrain real banks. See the [Bank of England explainer](https://www.bankofengland.co.uk/explainers/how-is-money-created).

## Event rules that keep the accounts honest

For this deliberately small bank, the balance-sheet invariant is:

`R + L = D + E`, where `D` is all customer deposits.

The following are original bookkeeping specifications. They assume cash interest payment, no other bank expenses or income, and no previously booked loss provisions.

| Event | Loan asset L | Customer deposits D | Bank equity E | Production recorded? |
| --- | ---: | ---: | ---: | --- |
| Originate principal b | +b | +b | 0 | No |
| Customer pays another customer | 0 | 0 in total | 0 | Only if the payment buys newly produced output |
| Repay principal p | −p | −p | 0 | No |
| Pay bank interest j from a deposit | 0 | −j | +j | Financial income allocation in this toy |
| Bank distributes retained income q | 0 | +q | −q | No; later spending is a separate event |
| Write off an unrecoverable loan x | −x | 0 | −x | No |

Interest received from an account at the same bank reduces its deposit liability and raises earnings/equity. Distribution reverses that effect by crediting recipient deposits. Do not create an ordinary customer account called “the bank's cash” and count it as money the bank owes itself. Kumhof and Wang's [working paper, p. 11, footnote 15](https://www.bankofengland.co.uk/-/media/boe/files/working-paper/2018/banks-money-and-the-zero-lower-bound.pdf) explicitly describes conversion of bank earnings/equity into household deposits when dividends are paid; immediate distribution is an assumption of their model, not a requirement for every bank.

An illustrative sequence, **not a simulation result**, starts with `R=200, L=0, D=180, E=20`. A loan of 10 gives `L=10, D=190`. Interest of 0.2 paid and then fully distributed leaves aggregate deposits and equity at 190 and 20. Principal repayment of 4 leaves `L=6, D=186, E=20`. Writing off the remaining 6 leaves `L=0, D=186, E=14`: `200 = 186 + 14`. Deposits held by sellers do not disappear because their customer's loan failed.

The BIS's [capital lecture, pp. 4–5](https://www.bis.org/speeches/20250527-bank-regulation-and-supervision-local-global-local.pdf) explains that a loan write-off reduces the bank's asset and equity together. If a loss was provisioned earlier, equity fell when the provision was recognized; a later write-off must not subtract the same loss again.

Separate three events: missed payment, accounting loss recognition, and cancellation of the legal debt. A charge-off need not extinguish the borrower's obligation, as the [CFPB's educational answer key, pp. 17–18](https://files.consumerfinance.gov/f/201504_cfpb_ymyg_knowledge-assessment-quiz_legal-aid.pdf) illustrates for US consumer debt. For a minimal toy, explicitly define terminal default as write-off **plus forgiveness**, with no recovery. Otherwise preserve the outstanding contractual claim separately from its bank carrying value. This is an accounting design choice, not a legal model.

Do not delete customer deposits automatically when equity reaches zero. Stop and report bank impairment/insolvency and any lending restriction. Deposit haircuts, guarantees, recapitalization and resolution require additional declared rules; they are not automatic consequences of the loan-write-off entry.

## Fairness, interest and repayment

Use zero explicit fees and zero interest as the control that isolates credit mechanics. “Fair” should mean a stated, consistently applied allocation rule, visible repayment terms and no hidden charges. It need not mean lending to every applicant regardless of repayment prospects. Zero interest does not remove principal repayment or default risk.

Real banking has operating costs. Zero explicit fees also do not establish zero banking output: national accounts include some services paid for implicitly through interest margins. The BEA describes this in [NIPA Chapter 14, pp. 1–2](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-14.pdf). The toy should explicitly omit banking-service production and costs, and treat its interest flow as a financial income allocation. It cannot claim that all real interest is outside the measurement of financial services.

Run a modest positive-rate sensitivity, for example 1% or 2% per model period, labeled as an author assumption. A model period is not automatically a year. Declare whether interest is charged on opening principal, after scheduled principal repayment, or on daily balances. Specify payment priority and whether interest can enter arrears; do not silently capitalize unpaid interest into a new loan.

Compare interest retained by the bank with interest distributed to its owners or rebated to borrowers. Retention builds equity but removes customer deposits until the bank spends or distributes the income. Distribution restores deposits but reduces the capital buffer. Its recipient and timing affect demand through the existing spending rules. Do not assume that interest is permanently lost to the town or automatically returned to the original borrower.

There is also no accounting law that every interest payment requires a fresh loan: existing deposits can circulate and bank income can return through distributions. That does not guarantee that the particular borrower receives enough of those deposits before the payment is due.

A simple experimental lending constraint is `E >= κL`, checked after origination, with κ such as 10%. This is a transparent author-chosen limit on loans relative to equity, **not a reconstruction of Basel regulation or a calibrated safe ratio**. Lending raises L without raising E; defaults erode E. The [BIS capital lecture](https://www.bis.org/speeches/20250527-bank-regulation-and-supervision-local-global-local.pdf) also distinguishes equity loss absorption from liquidity. A stronger capital buffer is not an unlimited source of settlement cash.

## Minimal experiment within the budget

Keep prices, capacity, employment, production and spending rules matched within each comparison. First make the debt contract explicit: eligible borrower, use of proceeds, maximum principal, grace period, maturity, interest, payment priority, arrears/default rule and treatment of unpaid balances at the final horizon. Then use three small comparisons:

1. **Temporary financing gap:** disable or enable a bounded firm credit line after a temporary interruption, with the same future demand path. Ask whether a viable firm can pay before its receipts arrive, then repay without repeated refinancing. A forecast-based lending rule must use only information available when the decision is made; a perfect-foresight version must be labeled as such.
2. **Persistent lost income:** examine a bounded household credit line after wages disappear. Track consumption and the loan balance together. Repeated credit can postpone a spending cut under the specified rules; it is not repayment income. A borrower with no future earnings, transfers, asset sales or other resources needs an explicit forgiveness/subsidy or continuing refinancing to sustain payments.
3. **Rate and capital sensitivity:** rerun the same cases with modest positive interest, declared distribution policy, and a tighter capital buffer. This checks whether a result relies on costless indefinite credit or rapid interest recycling.

If the budget permits one extra comparison, hold physical capacity fixed and already fully used. A model that fixes prices and rations goods should report unmet orders rather than extra real GDP. It cannot estimate inflation without a price mechanism.

For the main result, compare the temporary bridge and permanent income loss before introducing complicated bank optimization. Lending to a firm is not a household wage replacement unless the model actually routes it into wages. Loan-financed machine orders count as investment only when the new machines are produced and delivered under the production convention.

## Debt capacity and required outputs

Do not use a universal debt/GDP cutoff. Debt is a stock; GDP is production over a stated interval. Repayment feasibility also depends on the borrower's available cash flow, payment schedule, interest, liquidity and access to assets. Aggregate town income may belong to people who owe none of the debt.

The BIS defines [debt service ratios](https://www.bis.org/statistics/dsr/dsr_doc.pdf) as principal amortization plus interest divided by income, comparing flows over the same period. Its aggregate estimates depend on maturity and interest and are approximations, not universal individual default boundaries. The Bank of England's [household-debt speech](https://www.bankofengland.co.uk/speech/2022/september/colette-bowe-speech-at-the-2nd-research-workshop) also discusses essential spending and the distribution of income when assessing affordability. For this toy, use actual contractual payments and actual agent balances, with no claim to forecast real default probabilities.

Report GDP, worker and owner consumption separately, investment and net output, loan originations, outstanding principal, scheduled/paid principal and interest, arrears, defaults/forgiveness, deposits, bank equity and unfilled loan requests. Keep loan principal out of operating profit and GDP. Show both the temporary benefit and any repayment-period reduction in spending. A final outstanding loan is an obligation carried forward, not proof of successful repayment.

Tests should check the bank balance sheet after every event; customer transfers conserve total deposits; origination and principal repayment change loans and deposits equally; paid interest and distributions update deposits/equity; write-offs leave deposits unchanged; insufficient funds never cause silent negative deposits; and no capital repair, refinancing or forgiveness occurs without its declared event. Test the same opening balances and policy timing in both controls. Accounting tests establish consistency, not economic realism.

## Short reader-facing framing

Could a fair bank solve the town's missing-customer problem? It could help someone who needs to pay today but expects income tomorrow. When it lends 10, it creates a deposit of 10 and records a debt of 10. That is new spending power, not ten new goods. Repaying the principal removes the deposit money again.

The difficult case is a worker whose wages disappear permanently. A loan can fund shopping for a while, but the worker still needs a way to repay. We therefore compare a temporary bridge with persistent lost income, using the same opening money and production capacity. We also track what happens after the shopping: repayments, defaults and the bank's losses. Cheap credit may change the timing of demand. Whether it repairs the underlying income problem is what the experiment must show.

AI assistance: OpenAI GPT-6.1 Sol, Ultra, 11 October 2026; primary-source discovery, verified reading, original bookkeeping examples and bounded experiment design. No private data, authenticated access or paid API research runs were used. No simulation result is asserted here.
