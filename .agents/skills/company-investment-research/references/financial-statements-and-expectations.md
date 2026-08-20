# Financial statements and market expectations

## Build a point-in-time statement set

For every fact retain issuer/security identity, source filing, accession or version, accepted/published time, reporting period, fiscal period, units, currency, taxonomy concept, dimensions, and restatement/amendment relationship.

Do not sort XBRL facts only by filing date and assume the latest row is the right period. Resolve duration versus instant contexts, annual versus quarterly values, comparative periods, dimensions, duplicate facts, extensions, amended filings, and subsequently restated values.

## Reconcile the statements

### Income statement

- Revenue recognition, gross versus net presentation, segment/geographic mix, organic versus acquired growth, price/volume/mix, foreign exchange, and backlog conversion.
- Recurring versus restructuring, impairment, litigation, fair-value, and acquisition items.
- Stock compensation and dilution as economic costs even when excluded from non-GAAP metrics.
- Taxes, minority interests, discontinued operations, and non-controlling interests.

### Balance sheet and capitalization

- Unrestricted versus restricted cash; marketable securities and trapped cash.
- Debt principal, maturities, revolvers, covenants, convertibles, preferreds, leases, pensions, supplier finance, factoring, and off-balance-sheet commitments.
- Basic shares, diluted weighted-average shares, period-end shares, options, RSUs, performance awards, convertibles, earn-outs, and expected financing dilution.
- Working-capital seasonality, inventory aging, receivables quality, deferred revenue, contract assets/liabilities, and customer financing.

### Cash flow and reinvestment

- Reconcile net income to operating cash flow.
- Separate maintenance and growth capex where evidence permits; otherwise show the uncertainty.
- Identify capitalized software, development, content, exploration, customer acquisition, or contract costs.
- Normalize acquisitions, disposals, securitization, working-capital timing, and one-off tax receipts/payments.
- Calculate owner earnings or free cash flow only after defining SBC and reinvestment treatment.

## Quality checks

- Cash conversion across a full cycle, not one quarter.
- Receivables, inventory, contract assets, or capitalized costs growing faster than revenue.
- Non-GAAP exclusions that recur, change definition, or omit dilution.
- Supplier finance, factoring, receivable sales, channel stuffing, rebates, returns, and reserves.
- Auditor changes, material weaknesses, late filings, restatements, amendments, related parties, and unusual subsidiaries.
- Management compensation versus per-share value creation.

## Expectations analysis

Separate sources and timestamps:

- issuer guidance and prior promises;
- lawful point-in-time sell-side consensus or estimate distributions;
- options-implied move or prediction-market probability with liquidity/contract caveats;
- reverse-DCF assumptions implied by price;
- peer multiples and their growth, margin, balance-sheet, accounting, and cycle differences;
- narrative evidence such as calls and interviews, verified against primary disclosures.

Estimate revisions are often more informative than a stale point estimate, but only if the history is genuinely point-in-time. Do not reconstruct prior consensus from today's API response unless the provider documents that it is historical.

## Minimum normalized output

Produce:

- three to five years plus recent quarters of the key statements when available;
- revenue and profit bridge by economically important segment;
- cash, debt, leases, other claims, and fully diluted share bridge;
- KPI definitions and history with company-definition changes flagged;
- author-calculation formulas and input source IDs;
- missing/rejected facts and why they were not used;
- a reverse-expectations table connecting current price to operating assumptions.

Use EdgarTools or another parser only behind repository provenance rules. A standardized statement is a convenience layer, not proof that the chosen concept or context is correct.
