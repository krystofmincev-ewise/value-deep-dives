---
type: company_research
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
as_of: 2026-08-30
source_cutoff: 2026-08-30
topic: debt_macro_ownership_and_quality_of_earnings
research_status: draft
---

# Wix debt, macro, ownership and quality-of-earnings audit

## Decision answer

Wix is not in a near-term solvency crisis, but it is no longer the cash-rich, nearly debt-free company implied by the phrase “0% convertible.” The March–April 2026 recapitalization exchanged a material part of the balance-sheet cushion for a smaller share count:

- at 30 June 2026, Wix had **$960.899 million** of cash, short-term deposits, marketable securities and restricted deposits against **$1.650 billion face debt**;
- after the last audited **$89.531 million** Base44 contingent-consideration liability, central net claims are **$778.632 million** before operating leases;
- the **$500 million bank loan is floating-rate and reported as current**, while collateral designated for that facility has a 30 August translated value of about **$456.927 million**;
- the **$1.15 billion convertible is genuinely 0% coupon until September 2030**, but Wix paid $25.942 million of issuance costs and $71.875 million for capped calls. Prior 0% notes were repaid in cash, and their hedges expired without value;
- Wix's gross liquidity covers the bank loan 1.92x, and even a conservative full-$500-million covenant numerator is only about 1.19x management's approximately $420 million adjusted-FCF guide versus a 2.0x ceiling. The exact legal numerator is not public, so this is a diagnostic, not a covenant certificate;
- management has enough operating cash-generation capacity to refinance or cash-fund the debt under the base thesis. It has much less room to combine that objective with another large buyback, acquisition or prolonged Base44 subsidy.

The quality-of-earnings audit also changes the interpretation of the headline cash flow. Wix's 2025 raw free cash flow was **$572.957 million**, but the year also contained **$237.376 million of SBC**, a **$103.874 million deferred-revenue inflow**, and a **$204.216 million inflow from accrued expenses and other liabilities**. The equivalent H1 2026 working-capital diagnostic is negative. This does not make reported cash fictitious: annual customer prepayment is a valuable financing advantage. It does mean adjusted FCF is not a safe owner-earnings proxy without an explicit dilution, tax, acquisition-cost and working-capital bridge.

At the 28 August reference price of **$87.62**, the normalized 45.989-million-share equity value is **$4.030 billion** and enterprise value after central claims is **$4.808 billion**. A transparent constant-growth reverse DCF starting from $315 million of owner FCFF requires **7.8% annual growth for five years** at an 11% WACC and 2.7% terminal growth. Flat $315 million FCFF would be worth about **$58.68 per share**. The market is not pricing Wix's death; it is pricing durable owner-cash improvement while assigning far less than a Lovable-style private valuation to Base44.

This memo supplies the debt, quality-of-earnings and ownership evidence integrated into the canonical report and version-4 executable model.

## 1. Definitions and evidence hierarchy

All amounts are USD millions unless stated otherwise. The hierarchy is audited Form 20-F, SEC-filed interim results and transaction documents, primary ownership filings, official central-bank data, and only then public investor or analyst opinion.

Four definitions must not be mixed:

1. **Gross liquidity** is cash plus short-term deposits, marketable securities and restricted deposits.
2. **Face net debt** subtracts gross liquidity from face bank debt and face convertible principal. It is more conservative and decision-useful than GAAP carrying value for a debt-repayment analysis.
3. **Central net claims** add the last audited Base44 contingent-consideration liability to face net debt. Operating leases are shown separately because raw FCF already includes lease cash payments; adding the full lease liability to an enterprise bridge without lease-adjusting cash flow would be inconsistent.
4. **Owner FCFF** is an analyst estimate after normalized tax, recurring dilution economics, acquisition/retention costs and working-capital reserve, with normalized after-tax interest added back. It is not a reported Wix metric.

## 2. Capital stack at 30 June 2026

The [Q2 2026 SEC-filed results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026052108/secondquarter2026results.htm) provide the latest balance-sheet amounts. The Base44 claim remains anchored to the [2025 audited Form 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/wix-20251231.htm) because the Q2 release does not separately remeasure it.

| Capital item | Amount | Treatment |
| --- | ---: | --- |
| Cash and cash equivalents | $262.776 | Gross liquidity |
| Short-term deposits | 355.265 | Gross liquidity; some collateral may sit here |
| Marketable securities | 342.744 | Gross liquidity |
| Restricted deposits | 0.114 | Gross liquidity, but not freely deployable |
| **Gross liquidity** | **$960.899** | Sum of four rows |
| Bank facility, face | (500.000) | Floating-rate; current liability |
| 2030 convertible, face | (1,150.000) | 0% coupon; maturity 15 September 2030 |
| **Face net debt** | **$(689.101)** | $960.899m - $1,650m |
| Last-audited Base44 contingent consideration | (89.531) | Liability-classified, remeasured each period |
| **Central net claims** | **$(778.632)** | Face net debt plus contingent claim |
| Operating-lease liabilities | (410.249) | Disclosed separately; do not double count |

The convertible's carrying value was $1,128.341 million and the bank carrying value $500.069 million. GAAP-carrying-value net debt would therefore be $667.511 million, $21.590 million below face-value net debt. Face value is the cleaner refinancing input.

At the reference price and normalized denominator:

```text
Equity value = $87.62 × 45.989m shares = $4,029.556m
Enterprise value = $4,029.556m + $778.632m central claims = $4,808.188m
```

The model's 45.989 million pre-contingent denominator is deliberately larger than the 11 May explicit basic count of 41.850 million: it includes 3.339 million unvested RSU/PSUs and a 0.8 million option/ESPP buffer. It is not the stale pre-tender share count often used by market-data aggregators.

### Liquidity is adequate but substantially encumbered

The [credit-agreement English summary filed with the 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/a20-fxexhibit48x2025.htm) describes security consisting of NIS 1 billion of Makam securities plus a $120 million pre-existing cash deposit designated as non-withdrawable during the loan tenor. At the Bank of Israel's [28 August 2026 representative USD rate of NIS 2.968](https://www.boi.org.il/PublicApi/GetExchangeRate?key=USD):

```text
NIS 1,000m / 2.968 = $336.927m
Translated collateral + $120m deposit = $456.927m
$456.927m / $960.899m gross liquidity = 47.6%
Unencumbered gross liquidity diagnostic = $503.972m
```

This is an approximation. Makam values move, the FX translation moves, and the financial-statement captions do not identify the exact assets pledged. It is not evidence that all $456.927 million is legally inaccessible in every circumstance.

Gross liquidity covers the $500 million bank balance **1.92x**. If Wix repaid the bank loan from reported liquidity, it would retain about **$460.899 million** before transaction effects and continuing operations.

### The current-liability deficit is mostly deferred revenue, but not entirely

| Working-capital view | Calculation | Result |
| --- | --- | ---: |
| Headline current deficit | $1,103.861m assets - $1,804.017m liabilities | **$(700.156)m** |
| Excluding $784.794m current deferred revenue | $1,103.861m - ($1,804.017m - $784.794m) | **$84.638m surplus** |
| Approximate matched view | current assets less $456.927m collateral, versus current liabilities less deferred revenue and $500m bank debt | **$127.711m surplus** |

Deferred revenue is a performance obligation, not conventional funded debt. Excluding it is informative for liquidity, but it does not erase the obligation to host sites and provide services. The matched view is a diagnostic, not a liquidation value.

## 3. The 2030 convertible and capped calls

The [2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/wix-20251231.htm) records the September 2025 issuance terms:

- principal: **$1.150 billion**;
- coupon: **0.00%**;
- maturity: **15 September 2030**;
- initial conversion rate: **4.7509 shares per $1,000**, equivalent to **$210.49 per share** and approximately **5.464 million shares**;
- issuance costs: **$25.942 million**, amortized at a 0.46% effective rate;
- capped-call strike: **$210.49**; cap: **$267.89**; premium paid: **$71.875 million**; coverage: approximately **5.464 million shares**.

Before 15 March 2030, holders generally need a specified trigger to convert: a 20-of-30-trading-day stock-price test at 130% of the conversion price, a note-trading-price test, a redemption notice or specified corporate events. The initial stock trigger is about **$273.64**. After 15 March 2030, conversion is available without those conditions. Holders have a fundamental-change put at principal plus applicable special interest. Wix generally cannot redeem before 20 September 2028 except for specified tax reasons; later redemption also depends on the 130% stock-price test.

At $87.62, the stock would have to rise about **140.2%** to the conversion strike and **205.7%** to the cap. The capped calls can offset at most:

```text
($267.89 - $210.49) × 5.463535m = $313.607m
$313.607m / 45.989m normalized shares = $6.82 per pre-contingent share
```

A simplified economic claim, ignoring settlement timing, anti-dilution changes, counterparty risk and unwind terms, is:

```text
If stock price P ≤ $267.89: approximately $1.15bn net note claim after capped-call offset
If P > $267.89: approximately $1.15bn + (P - $267.89) × 5.463535m
```

The executable Wix model conservatively subtracts the note principal below the $210.49 strike, then reverses principal and adds the conversion shares above the strike. It omits capped-call value up to $267.89. That is conservative in high-price states and avoids recognizing a derivative asset whose realized value depends on future settlement.

### “0%” did not mean costless

Issuance costs plus capped calls consumed **$97.817 million**, or **8.51% of par**, up front. The note's 31 December 2025 fair value was $1,021.223 million, 88.8 cents per dollar of principal. The discount reflected rates, credit, optionality and market terms; it did not reduce the contractual repayment amount.

Wix's earlier convertibles are the clearest capital-allocation precedent:

- $575 million of 0% 2025 notes were repaid in cash on 15 August 2025; their $46 million capped call expired unexercised;
- the remaining $362.667 million of 2023 notes were repaid in cash on 1 July 2023; their $45.338 million capped call expired out of the money. Earlier conversions had produced 560,770 shares.

Thus prior “0%” securities became real cash maturities, while **$91.338 million** of hedge premiums expired without payout. The current capped call is valuable insurance in the appropriate price range, not evidence that the debt can be ignored.

### 2030 self-funding requirement

If Wix wanted to cash-prefund the full note over the four years from September 2026 to September 2030, it would need to retain about **$287.5 million per year**. If it first repaid the bank and then used the remaining June liquidity of approximately $460.899 million at note maturity, the residual funding need would be:

```text
($1,150m - $460.899m) / 4 years = $172.275m per year
```

These are intentionally conservative cash-reserve schedules, not forecasts. The debt can be refinanced, the company will earn interest and generate cash, and liquidity will change. They show why a base owner-FCFE estimate near $285 million supports debt service but does not also support unlimited buybacks.

## 4. Bank facility, interest sensitivity and covenant headroom

The [credit agreement](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/a20-fxexhibit48x2025.htm) made $500 million available from 1 April 2026 through 31 March 2027 in one or two term loans. Wix had drawn the full amount by 30 June. Each borrowing's term was to be specified at withdrawal; the exact contractual maturity is not disclosed in the public English summary. Classification as a current liability means repayment is due within twelve months of 30 June 2026 under the accounting presentation. The proper checkpoint is therefore **by 30 June 2027**, not an invented precise maturity date.

The filed agreement specifies pricing of:

- first $400 million: monthly SOFR + TFSI Basis Bid + 0.30%;
- final $100 million: monthly SOFR + TFSI Basis Bid + 1.05%;
- default rate: fixed 8%;
- interest: monthly, actual/360.

The public summary does not quantify TFSI Basis Bid, so an exact all-in interest rate cannot be reproduced. The New York Fed's [SOFR API](https://markets.newyorkfed.org/api/rates/secured/sofr/search.json?startDate=2026-08-20&endDate=2026-08-30&type=rate) reported **3.64% for 27 August 2026**. Ignoring the unknown TFSI component gives a minimum annualized run rate:

```text
$400m × (3.64% + 0.30%) + $100m × (3.64% + 1.05%) = $20.450m
```

| All-in bank-rate scenario | Annual cash interest | Increment versus 4.09% blended floor |
| ---: | ---: | ---: |
| 4.09%, excluding TFSI | $20.450m | — |
| 5.00% | 25.000 | 4.550 |
| 6.50% | 32.500 | 12.050 |
| 8.00% default rate | 40.000 | 19.550 |

Every 100-basis-point move in SOFR or a common additive spread changes pre-tax interest by **$5 million**, approximately $4.15 million after a 17% normalized tax assumption. Wix earned $48.901 million of interest income in 2025, so liquid-asset yields partially offset floating debt in a static balance-sheet view. That natural offset weakened when marketable securities fell from $958.057 million at December 2025 to $342.744 million at June 2026 and long-term securities fell from $474.198 million to zero. Net sensitivity cannot be estimated precisely without asset duration and reinvestment data.

### Covenant

The agreement caps **Bank Debt / FCF at 2.0x**. The public definitions matter:

- Bank Debt is bank credit not secured by full cash collateral or the bank's credit exposure. It excludes leases, guarantees, rent, intercompany balances and fully deposit-secured credit.
- FCF is operating cash flow less capex, excluding one-time and nonrecurring amounts.

Because the bank has substantial collateral and the exact credit-exposure calculation is not public, a legal covenant ratio cannot be reconstructed. Two diagnostics bound the issue:

| Diagnostic numerator/denominator | Ratio | FCF breach floor | Headroom to floor |
| --- | ---: | ---: | ---: |
| Full $500m / approximately $420m management adjusted-FCF guide | **1.19x** | $250m | $170m / 40.5% |
| Full $500m / $340m raw-FCF planning placeholder | **1.47x** | $250m | $90m / 26.5% |

Both conservatively use the full loan as Bank Debt. A collateral-net numerator could be far smaller—approximately $43.1 million using translated collateral—but treating that approximation as the legal numerator would be unsafe.

Events of default include nonpayment, insolvency, qualifying cross-default and material-adverse-effect provisions, with acceleration rights. Wix can prepay on 30 days' notice; prepayment without notice attracts a 1% fee, and other early-repayment compensation can depend on the lender's rate differential. No conventional term-bond maturity wall exists before the current bank facility, but the bank's current classification creates a genuine refinancing/cash-use decision during the twelve-month valuation horizon.

## 5. Private-placement warrant and tender financing

The [5 March 2026 tender prospectus](https://www.sec.gov/Archives/edgar/data/1576789/000117891326000759/exhibit_99a-1a.htm) describes the contemporaneous private placement:

- 3,266,699 units at **$79.591**, generating $260 million gross and $251.592 million after $8.408 million of fees;
- each unit contained one common share and 0.25 warrant, or **816,675 initial warrant shares** after rounding to whole shares;
- warrant strike **$104.73**; exercisable 5 May 2026 through 5 March 2029;
- Wix can elect cash or net-share settlement; the warrant includes adjustment and make-whole terms;
- the filing reserves as many as **1,082,529 shares** for exercise, including adjustment/make-whole capacity; the valuation models the initial 0.817m exposure and discloses the higher reserve rather than assuming it is issued;
- the share purchase price was a 5% discount to the $83.78 4 March close, while the strike was a 25% premium; the shares were subject to a one-year lockup.

For a net-share settlement, the simplified treasury-stock formula is `N × (P - K) / P`:

| Wix share price | Net warrant shares | Intrinsic value |
| ---: | ---: | ---: |
| $150.00 | 246,472 | $36.971m |
| $200.00 | 389,023 | $77.805m |
| $267.89 | 497,400 | $133.249m |

The [3 April final tender result](https://www.sec.gov/Archives/edgar/data/1576789/000117891326001986/exhibit_99a-5d.htm) accepted **17,577,250 shares at $92**, approximately $1.617 billion before fees and 29.7% of 1 April shares. The H1 cash-flow statement records **$1,623.438 million** of repurchase cash, equivalent to $92.36 per accepted share including transaction effects.

The financing bridge is revealing:

```text
$1,623.438m tender cash
- $500.000m bank borrowing
- $251.592m net private-placement proceeds
= $871.846m implied use of pre-existing liquidity
```

From the 31 January count of 55.047 million to Wix's explicit 11 May count of 41.850 million, the net reduction was **13.197 million shares, or 24.0%**. That is economically meaningful but below the gross 29.7% headline because the private placement and continuing equity issuance offset part of the tender.

At $87.62, the reference price is 4.8% below the tender and 10.1% above the placement price. This short interval does not establish whether management created or destroyed long-term value. It does establish that the tender was a leveraged capital-structure decision, not a costless expression of confidence.

## 6. Base44 contingent consideration and acquisition cash

Wix acquired Base44 on 13 June 2025. The [audited 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/wix-20251231.htm) records:

- purchase-accounting consideration of **$92.158 million**: $18.058 million cash and $74.100 million initial fair value of contingent consideration;
- revenue-linked earnout measurement periods from 2025 through 2028;
- 31 December fair value of **$89.531 million**, split $5.822 million current and $83.709 million long term;
- Monte Carlo valuation using, among other inputs, **50% revenue volatility**; EY designated the valuation a critical audit matter;
- an additional **$42.988 million** of founder/employee retention and other cash payments through 2028, plus approximately $8 million of RSU/PSU awards over four years.

The Q2 release does not separately disclose a new earnout fair value. Aggregate other-liability movements do not permit a reliable derivation because they contain multiple items. A **$60–130 million sensitivity** is reasonable for valuation work around the last audited $89.531 million and initial $74.100 million, but it is an analyst range, not Wix's reported maximum. Upside cases can produce much larger consideration if revenue metrics accelerate.

H1 2026 adjusted FCF adds back **$37.279 million of acquisition-related cash payments** and **$8.534 million of restructuring cash**. Those are real owner cash uses. A SOTP must use one internally consistent convention:

- if those cash costs are added back to owner cash flow and Base44 receives a separate enterprise value, subtract the unpaid contingent/retention claims once in the enterprise-to-equity bridge;
- if acquisition and retention cash remains inside owner FCF, do not also subtract paid amounts or capitalize an inflated adjusted-FCF stream.

The canonical Wix model keeps the last-audited contingent claim in central net claims and charges owner cash for acquisition/retention economics. That is more conservative than treating all adjusted FCF as distributable.

## 7. Quality of earnings and working-capital dependence

### Annual cash-flow reconstruction

The following table is reproduced from the [2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/wix-20251231.htm). Raw FCF is CFO less purchases of property/equipment and capitalized internal-use software. The liability-flow diagnostic subtracts changes in deferred revenue and accrued expenses/other liabilities from raw FCF.

| Fiscal year | CFO | Capex | Raw FCF | SBC | Change in deferred revenue | Change in accrued/other liabilities | FCF less two liability inflows |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2023 | $248.246 | $66.049 | **$182.197** | $224.625 | $76.193 | $11.915 | **$94.089** |
| 2024 | 497.415 | 19.336 | **478.079** | 240.721 | 74.450 | 3.083 | **400.546** |
| 2025 | 582.858 | 9.901 | **572.957** | 237.376 | 103.874 | 204.216 | **264.867** |

This diagnostic is not normalized FCF. Deferred-revenue growth is recurring, valuable financing when customer cohorts are healthy, and the accrued/other line is heterogeneous. Subtracting both mechanically can understate sustainable cash. The test does show that 2025's headline conversion depended much more on liability growth than 2024.

For 2025, a harsher “cash less SBC” view is $335.581 million. Subtracting both SBC and the two liability inflows leaves just $27.491 million, but that should be treated as a stress diagnostic, not fair owner earnings. Full SBC subtraction plus full current-award dilution would double count the same economics.

### H1 2026 deterioration

| H1 cash metric | Amount |
| --- | ---: |
| Raw FCF | **$127.615m** |
| Management adjusted FCF | **173.428** |
| Acquisition cash added back | 37.279 |
| Restructuring cash added back | 8.534 |
| SBC | 110.318 |
| Change in deferred revenue | 57.229 |
| Change in accrued/other liabilities | 103.188 |
| Raw FCF less two liability inflows | **$(32.802)** |

H1 2025 raw FCF was $290.106 million. Seasonality, transaction cash, growth investment and restructuring make a half-year comparison noisy, but the decline is large enough that a $420 million adjusted full-year guide should not be capitalized as steady owner cash without seeing H2 recovery.

### Deferred revenue provides visibility, not permanent lock-in

Deferred revenue rose from $854.337 million at December 2025 to $911.566 million at June 2026. At year-end, remaining performance obligations were $878.456 million and 83% were expected to be recognized within twelve months; 83% of premium subscriptions were annual or multi-year.

That provides revenue visibility and free customer financing. It does not disclose gross retention, migration propensity or the cost to serve the obligation. In a slowdown, deferred-revenue growth can reverse before recognized revenue, reducing cash conversion while accounting revenue remains supported by prior billings. The correct valuation treatment is neither “all deferred revenue is debt” nor “all prepayment is permanent owner cash.”

### Tax and financial-income normalization

Wix paid only **$3.555 million of cash tax** in 2025 despite $46.192 million of current tax expense and a $70.920 million deferred-tax valuation-allowance reversal. Israel's qualified domestic minimum top-up tax under Pillar Two applies from 2026. A **15–18% normalized cash-tax rate** is more defensible than capitalizing the 2025 cash tax.

2025 financial expense was a net $5.015 million despite $48.901 million of interest income, because Wix recorded a $43.075 million non-designated hedge loss, $7.154 million FX loss and bank charges. In 2024 it recorded $51.820 million of net financial income. GAAP net income therefore contains rate, asset-allocation, FX and hedge noise that is not a stable operating-margin proxy.

## 8. SBC, dilution and the buyback record

SBC fell as a share of revenue but remains material:

| Period | SBC | SBC / revenue |
| --- | ---: | ---: |
| 2023 | $224.625m | 14.4% |
| 2024 | 240.721 | 13.7% |
| 2025 | 237.376 | 11.9% |
| H1 2026 | 110.318 | 10.0% |

At year-end, unrecognized compensation was **$377.632 million** over a weighted 2.69 years, about $140.4 million per year before new grants. At 31 January 2026, 5.977 million awards were outstanding, 2.619 million were exercisable, and 1.930 million shares remained available for future grants. On 2 March, the ESPP issued 434,247 shares at up to a 15% discount.

At $87.62, $140.4 million is mechanically equivalent to 1.60 million shares or 3.8% of the explicit 41.850-million basic count. That is a bounding conversion, not an issuance forecast: award values, vesting, forfeitures, tax withholding and repurchases matter. A sound valuation can put current awards in the share denominator and charge a recurring post-horizon dilution cost for future grants. It should not subtract all SBC and also add all current awards as though the costs were independent.

### 2021–2025 buybacks mostly offset issuance

| Year | Gross shares repurchased | Cash spent | Average price |
| ---: | ---: | ---: | ---: |
| 2021 | 0.895m | $200.0m | $223.43 |
| 2022 | 2.773 | 231.9 | 83.62 |
| 2023 | 1.349 | 127.0 | 94.17 |
| 2024 | 3.594 | 466.3 | 129.75 |
| 2025 | 3.544 | 575.0 | 162.25 |
| **Total** | **12.154m** | **$1.600bn** | **$131.65** |

Year-end shares declined only 1.038 million from 2020 to 2025. Approximately **91% of gross repurchases were offset by issuance**. The historical program reduced dilution but did not create the share-count contraction implied by gross repurchase headlines, and management repeatedly bought at prices materially above $87.62.

The 2026 tender is economically different: it created a roughly 24% net reduction. It is stronger evidence of management conviction, but weak evidence of valuation skill because it also introduced floating/current debt, encumbered liquidity and private-investor warrants. Buybacks signal belief; they do not reveal private churn data or eliminate the possibility of a mistaken thesis.

## 9. Israel, FX and rate risk

### Operating concentration is much greater than revenue concentration

The 2025 filing reports:

- 4,622 employees, of whom **3,273, or 70.8%, were in Israel**;
- 718 contractors concentrated mainly in Ukraine and Poland;
- $474.981 million of physical right-of-use assets and property/equipment in Israel out of $512.684 million total, or **92.6%**;
- only $17.693 million of revenue in Israel, **0.9% of total**;
- product hosting primarily in U.S. East and West using Google and Amazon infrastructure, with European backup arrangements.

Revenue is globally diversified and core hosting has geographic redundancy. Management, engineering and physical workplace concentration remain substantial. The filing discusses employee reserve call-ups, effects on families and operations, airspace disruption, cyber risk, boycott risk and direct war losses that commercial insurance may exclude. Government compensation may be inadequate. The risk is human-capital and operational continuity, not principally loss of Israeli customer revenue.

### FX sensitivities are large relative to owner cash

Wix generated 65% of 2025 revenue in USD and 35% in other currencies; approximately 66% of costs were USD and 27% NIS. The filing's sensitivity analysis estimates:

- a 10% NIS strengthening would reduce net income by **$53.4 million**;
- a 10% weakening of the non-USD revenue-currency basket would reduce net income by **$64.6 million**.

These are company-estimated net-income sensitivities, not pre-tax cash-flow forecasts, and the shocks can co-occur. Wix had $117.563 million of designated FX-hedge notional with a twelve-month term and $363.587 million of non-designated hedge notional with a nine-month term. The $43.075 million 2025 non-designated hedge loss shows that hedging changes timing and volatility; it does not make FX exposure disappear.

For scenario work, a **$50–120 million net-income shock** captures a material single or combined FX move without pretending both filing sensitivities transmit one-for-one into recurring FCFF. It should be applied as an operating stress, not added on top of the same FX risk already embedded in margins and WACC.

### Official macro backdrop is two-sided

The Bank of Israel's [July 2026 monetary-policy report](https://www.boi.org.il/publications/pressreleases/20-7-2026/) reported a 3.5% policy rate after three 25-basis-point cuts, May inflation of 1.9%, a 2026 GDP-growth forecast reduced to 4.0% from 5.2% in January, and a 2027 forecast of 5.5%. It projected 1.8% inflation in both 2026 and 2027, a 3.0% one-year policy rate, a 4.9%-of-GDP 2026 budget deficit and debt/GDP near 69%. A defense-budget increase of NIS 25 billion could lift the deficit to about 5.5% and inflation by about 0.3 percentage point. Q1 GDP contracted at a 3.8% annualized rate during military operations, while the shekel strengthened sharply through May and the risk premium later moved closer to pre-7 October levels.

The base case can therefore assume functioning capital markets and a resilient local economy. A country shock remains a valid fat tail. For valuation, a **100–250-basis-point Israel/geopolitical business-risk overlay** inside the total WACC is an empirically anchored analyst range, not an extra mechanical addition to every cash-flow scenario. Together with AI and execution risk, it supports the dossier's **9.5–12.5% WACC** draw around an 11.0% base.

## 10. Institutional ownership: mixed evidence after the tender

Ownership comparisons are unusually easy to misread because Wix's denominator fell sharply and the tender closed on 3 April. A higher reported ownership percentage can accompany fewer shares. Schedule 13G reports beneficial ownership, which can include securities exercisable within 60 days; Form 13F generally reports the manager's quarter-end long U.S.-listed position and cannot identify tender participation, trade route or motive.

| Holder | Earlier reported position | Latest through Q2 2026 | Absolute change | Interpretation |
| --- | ---: | ---: | ---: | --- |
| Ameriprise Financial | 6.020m at 31 Jan | **8.533m / 20.4%** at 31 May | **+2.513m / +41.7%** | Clear absolute accumulation; subsidiaries/funds overlap and must not be summed |
| Baillie Gifford | 3.227m at 31 Jan | **2.542m / 6.1%** at 30 Jun | **-0.685m / -21.2%** | Percentage rose only because denominator shrank |
| Wellington | 3.460m at 31 Jan | **1.535m / 3.7%** at 30 Jun | **-1.926m / -55.6%** | Fell below 5% |
| Senvest, Q1-to-Q2 13F common | 3.755m at 31 Mar | **2.919m** at 30 Jun | **-0.836m / -22.3%** | Interval spans tender; route/motive unknown |
| Aristeia | 2.856m / 5.19% at 31 Mar | **0** at 30 Jun | **-100%** | Could include tender participation; no motive inference |
| Millennium | 3.028m / 5.2% at 1 Apr | **0.771m / 1.8%** at 30 Jun | **-74.5%** | Material absolute reduction |
| HSBC | 3.553m / 6.5% at 31 Mar | **0.192m / 0.5%** at 30 Jun | **-94.6%** | Material absolute reduction |

Primary filings:

- [Ameriprise Schedule 13G](https://www.sec.gov/Archives/edgar/data/1576789/000119312526258581/xslSCHEDULE_13G_X02/primary_doc.xml)
- [Baillie Gifford Schedule 13G](https://www.sec.gov/Archives/edgar/data/1088875/000108887526000049/xslSCHEDULE_13G_X02/primary_doc.xml)
- [Wellington Schedule 13G/A](https://www.sec.gov/Archives/edgar/data/902219/000090221926000249/xslSCHEDULE_13G_X02/primary_doc.xml)
- [Senvest Q1 2026 Form 13F information table](https://www.sec.gov/Archives/edgar/data/1328785/000117266126001964/infotable.xml)
- [Senvest Q2 2026 Form 13F information table](https://www.sec.gov/Archives/edgar/data/1328785/000117266126003417/infotable.xml)
- [Senvest 31 March Schedule 13G](https://www.sec.gov/Archives/edgar/data/1576789/000090266426002441/xslSCHEDULE_13G_X02/primary_doc.xml)
- [Aristeia latest Schedule 13G/A](https://www.sec.gov/Archives/edgar/data/1576789/000117266126003545/xslSCHEDULE_13G_X02/primary_doc.xml)
- [Millennium latest Schedule 13G/A](https://www.sec.gov/Archives/edgar/data/1576789/000110465926095098/xslSCHEDULE_13G_X02/primary_doc.xml)
- [HSBC latest Schedule 13G/A](https://www.sec.gov/Archives/edgar/data/1576789/000108911326000026/xslSCHEDULE_13G_X02/primary_doc.xml)

### Senvest is a useful contradiction, not a clean signal

Senvest's 31 March 13G reported **3,880,321 beneficial shares**, versus **3,754,680 common shares** in its Q1 13F. The difference is exactly **125,641 warrant-underlying shares** from the private placement, exercisable within 60 days and therefore included in beneficial ownership. The figures are not conflicting measures of the same scope.

Senvest's Q2 13F reported **2,918,880 common shares**, down 835,800, or 22.3%. The quarter spans the 3 April tender. Form 13F cannot distinguish shares tendered at $92 from open-market sales, nor can it establish whether the manager's conviction changed. No later 13G through the cutoff resolves the question.

This reduction occurred while Senvest's public 4 February and 17 March letters remained strongly bullish. The [public investor-letter filing](https://newsfile.moomoo.com/public/NN-PersistNoticeAttachment/7781/20260526/SEDAR_PLUS/CSA_SEDAR_PLUS_NOTICE_RECORD_ID_2415338.pdf) valued Base44 at $1.65 billion and later $1.95 billion, argued that Wix Studio could gain share from WordPress, and said that removing Base44 left core Wix at about 6x consensus 2026 P/FCF. Its later letter framed the $2 billion authorization as a confidence signal.

Senvest's [30 June public report](https://www.senvest.com/documents/FG/senvest/reports/656166_Senvest_Capital_Final_English_Jun_30_2026.pdf) sharpened rather than abandoned the thesis: it called the Partner deceleration real, identified the shekel and Base44 marketing as profit headwinds, raised its opinion of Base44 to approximately $2.5 billion, and kept a favorable risk/reward view. The report's explicit recognition of the operating reset is useful; its use of Wix's approximately $420 million adjusted-FCF guide and private-company valuation analogues remains an investor judgment, not an owner-cash reconciliation.

The investor argument is credible as a bull case but not primary operating evidence. It capitalizes consensus/adjusted FCF more generously than this dossier because it does not visibly charge recurring dilution, normalized tax, acquisition cash and net claims in the same way. The ownership filing also prevents treating the letter as evidence that the fund simply held every share through the tender.

Morningstar's [5 August public Q2 summary](https://www.morningstar.com/company-reports/1493588-wix-earnings-relief-rally-on-beat-and-base44-profitability-shares-fairly-valued) described the post-earnings shares as fairly valued. Only the public summary is used here; no subscriber article body was ingested. The outside views therefore span bullish private-market SOTP enthusiasm and conventional fair-value caution, neither of which substitutes for the primary cash-flow bridge.

## 11. Reverse DCF: what $87.62 requires

The reverse DCF uses the $4,808.188 million enterprise value above, a five-year constant owner-FCFF growth rate, and a growing perpetuity. It is a transparent cross-check, not the richer executable model's high-single-digit fade path.

```text
FCFF_t = starting FCFF × (1 + g)^t
EV = Σ[FCFF_t / (1 + WACC)^t] for t=1..5
     + FCFF_5 × (1 + terminal growth) / (WACC - terminal growth)
       / (1 + WACC)^5
```

### Required five-year annual growth from $315 million starting FCFF

| WACC | Terminal growth | Required annual FCFF growth |
| ---: | ---: | ---: |
| 9.8% | 2.7% | **4.0%** |
| 11.0% | 2.7% | **7.8%** |
| 12.5% | 2.7% | **12.1%** |

### Required starting FCFF at 11% WACC and 2.7% terminal growth

| Five-year annual growth | Required starting FCFF |
| ---: | ---: |
| 0% | **$435.6m** |
| 3% | **383.7** |
| 5% | **353.1** |
| 7.8% | **315.1** |

### Terminal-growth sensitivity from $315 million starting FCFF and 11% WACC

| Terminal growth | Required five-year annual FCFF growth |
| ---: | ---: |
| 1.8% | **9.7%** |
| 2.7% | **7.8%** |
| 3.4% | **6.2%** |

If $315 million FCFF were flat for five years before a 2.7% perpetuity, enterprise value would be $3.477 billion and equity value after $778.632 million of claims would be approximately **$58.68 per normalized share**, 33.0% below the reference price. The market therefore assumes growth, higher current owner cash, lower risk, or some combination.

The canonical model uses **$270 million as the present interpolation anchor**, constructed as a $350 million raw-FCF placeholder less a $110 million recurring-dilution charge plus $30 million normalized after-tax interest. It then transitions toward regime-specific twelve-month owner FCFF; the defense/base estimate is approximately $315–316 million. The current price under the separate high-single-digit fade-path reverse DCF implies approximately **$302 million of starting owner FCFF**. These are consistent because “current interpolation anchor,” “twelve-month defense cash” and “price-implied DCF starting cash” are different quantities. If $270 million were instead used directly in the constant-growth reverse DCF, an 11% WACC and 2.7% terminal growth would require about **11.6% annual growth for five years**.

## 12. Empirically anchored valuation inputs

These ranges are for scenario construction. “Reported” and “calculated” inputs are point estimates; “analyst range” inputs are judgments anchored to the evidence above.

| Input | Bear / conservative | Base | Bull / favorable | Status and anchor |
| --- | ---: | ---: | ---: | --- |
| Gross liquidity | — | **$960.899m** | — | Reported 30 Jun 2026 |
| Face net debt | — | **$689.101m** | — | Deterministic calculation |
| Base44 contingent claim | $130m | **$89.531m** | $60m | Analyst sensitivity around last audited fair value |
| Central net claims | about $819m | **$778.632m** | about $749m | Face net debt + contingent sensitivity |
| Bank all-in cash rate | 6.5% | 5.0% | 4.09% floor ex-TFSI | Scenario, with SOFR and public margins anchored |
| Annual bank cash interest | $32.5m | $25.0m | $20.45m floor | Deterministic at scenario rate |
| Normalized cash tax | 18% | 17% | 15% | Analyst range; Pillar Two/current-tax evidence |
| Owner FCFF | $210m | $315m | $405m | Existing narrative cases; not reported FCF |
| WACC | 12.5% | 11.0% | 9.8% | Cross-sectional software anchor plus AI/Israel/execution risk |
| Terminal growth | 1.8% | 2.7% | 3.4% | Long-run judgment, always below WACC |
| Israel/geopolitical overlay within WACC | 250bp | 150bp | 100bp | Analyst range; do not add twice |
| FX operating shock | $(120)m | $(50–70)m | minimal | Net-income stress anchored to Wix sensitivities |
| Recurring post-horizon dilution charge | $140m | $110m | $90m | Unrecognized-compensation run rate and canonical model convention |
| Retained cash for 2030 note | $287.5m/year | $172.3m/year after using post-bank liquidity | refinance | Deterministic cash-prefunding schedules, not forecasts |

The central claim sensitivity alone is small relative to operating outcomes: every $100 million of net claims changes value by about **$2.17 per 45.989-million normalized share**. The decisive variable is durable owner FCFF, not whether the Base44 earnout is $20–40 million above or below its last audited mark.

## 13. Strongest counter-thesis

The strongest bear thesis is not immediate insolvency. It is **capital-allocation and cash-quality compression arriving at the same time as AI weakens new-customer economics**:

1. Wix spent $1.6 billion on 2021–2025 buybacks, but roughly 91% of gross shares were offset by issuance. It then used approximately $872 million of pre-existing liquidity plus a current floating loan to finance the 2026 tender.
2. Almost half of June gross liquidity is approximately matched by facility collateral, and the loan must be repaid or refinanced within the twelve-month accounting horizon. The 2030 note later requires either refinancing, conversion at much higher prices or retained cash.
3. 2025 raw FCF included $308 million of deferred/accrued liability inflows and $237 million of SBC. H1 2026 raw FCF fell to $128 million, while adjusted FCF excluded $46 million of real acquisition/restructuring cash.
4. Base44 adds an uncertain, remeasured claim and retention cash through 2028 while its compute and marketing investment depress consolidated margins. A high private-market multiple is not liquid collateral and does not service debt.
5. The installed base and deferred revenue slow the damage but do not prove retention. If AI-native builders reduce new starts and partner bookings before churn becomes visible, working-capital tailwinds can fade before recognized revenue.
6. At $87.62, flat $315 million owner FCFF supports only about $59 per share under the base discount rate. The current enterprise value needs high-single-digit five-year growth from that cash anchor.
7. Several large holders materially reduced absolute positions in Q2. Senvest itself reduced 13F common shares 22.3% despite its public bull letter. Tender mechanics prevent a motive claim, but the record is incompatible with a simplistic “smart money unanimously held” narrative.

The strongest rebuttal is equally concrete. Gross liquidity covers the current bank loan 1.92x; conservative covenant diagnostics remain below 2.0x; the large note is 0% until 2030; the capped call can offset up to $313.6 million in the relevant upside range; the tender produced a real 24% net share reduction; Ameriprise accumulated materially; annual prepayment and RPO create time to adapt; and the base company can generate enough owner cash to delever if management stops aggressive capital returns.

**Net assessment:** leverage is manageable, not benign. The recapitalization improves per-share upside if owner cash recovers, but it makes another operating disappointment more expensive. Version 4 incorporates the claims bridge and a retained-FCFE capital path; the most important monitoring items are the bank repayment/refinancing path, legal covenant disclosure, H2 raw versus adjusted FCF, Base44 claim remeasurement, net share issuance, and whether deferred-revenue growth continues after Partner weakness.

## 14. Reproducible calculations

```text
Gross liquidity
= 262.776 + 355.265 + 342.744 + 0.114
= 960.899

Face net debt
= 500.000 + 1,150.000 - 960.899
= 689.101

Central net claims
= 689.101 + 89.531
= 778.632

Translated facility collateral at 2.968 NIS/USD
= 1,000 / 2.968 + 120
= 456.927

Minimum annual bank interest, excluding TFSI
= 400 × (3.64% + 0.30%) + 100 × (3.64% + 1.05%)
= 20.450

Full-numerator covenant diagnostic
= 500 / 420
= 1.19x

Tender funding from existing liquidity
= 1,623.438 - 500.000 - (260.000 - 8.408)
= 871.846

2025 liability-flow FCF diagnostic
= 572.957 - 103.874 - 204.216
= 264.867

Reference equity and enterprise value
= 87.62 × 45.989 = 4,029.556
= 4,029.556 + 778.632 = 4,808.188
```

## 15. Source register

All sources were accessed on 30 August 2026. No authenticated content, account identifier or proprietary analyst report is retained.

| Source | Publication / period | Evidence type and rights | Retrieval and verification | Intended use |
| --- | --- | --- | --- | --- |
| [Wix FY2025 Form 20-F](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/wix-20251231.htm) | 5 Mar 2026 | Audited SEC filing; public | Native SEC HTML; primary | Debt terms, capped calls, financials, tax, FX, geography, Base44 liability, buybacks |
| [Wix Q2 2026 results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026052108/secondquarter2026results.htm) | 4 Aug 2026 / six months ended 30 Jun | SEC-filed issuer results; public | Native SEC HTML; primary | Latest liquidity, debt, FCF, WC, shares, restructuring |
| [Credit-agreement English summary](https://www.sec.gov/Archives/edgar/data/1576789/000162828026015222/a20-fxexhibit48x2025.htm) | Agreement entered 3 Mar 2026 | SEC-filed contract summary; public | Native SEC HTML; primary, exact draw maturity/TFSI unavailable | Pricing, collateral, covenant, default and prepayment terms |
| [Tender prospectus](https://www.sec.gov/Archives/edgar/data/1576789/000117891326000759/exhibit_99a-1a.htm) | 5 Mar 2026 | SEC-filed transaction document; public | Native SEC HTML; primary | Placement, warrant, tender financing and risks |
| [Final tender results](https://www.sec.gov/Archives/edgar/data/1576789/000117891326001986/exhibit_99a-5d.htm) | 3 Apr 2026 | SEC-filed issuer result; public | Native SEC HTML; primary | Accepted shares and price |
| [New York Fed SOFR API](https://markets.newyorkfed.org/api/rates/secured/sofr/search.json?startDate=2026-08-20&endDate=2026-08-30&type=rate) | Rate for 27 Aug 2026 | Official rate data; public | Structured API response; primary | Facility interest floor |
| [Bank of Israel USD representative rate API](https://www.boi.org.il/PublicApi/GetExchangeRate?key=USD) | Rate for 28 Aug 2026 | Official FX data; public | Structured API response; primary | Translate NIS collateral |
| [Bank of Israel July monetary-policy report](https://www.boi.org.il/publications/pressreleases/20-7-2026/) | 20 Jul 2026 | Official central-bank report; public | Native web; primary | Israel rates, inflation, growth and fiscal-risk scenarios |
| [Ameriprise Schedule 13G](https://www.sec.gov/Archives/edgar/data/1576789/000119312526258581/xslSCHEDULE_13G_X02/primary_doc.xml) | Position at 31 May 2026 | SEC ownership filing; public | Primary XML | Absolute and percentage position |
| [Baillie Gifford Schedule 13G](https://www.sec.gov/Archives/edgar/data/1088875/000108887526000049/xslSCHEDULE_13G_X02/primary_doc.xml) | Position at 30 Jun 2026; filed 3 Aug | SEC ownership filing; public | Primary XML | Absolute and percentage position |
| [Wellington Schedule 13G/A](https://www.sec.gov/Archives/edgar/data/902219/000090221926000249/xslSCHEDULE_13G_X02/primary_doc.xml) | Position at 30 Jun 2026; filed 13 Aug | SEC ownership filing; public | Primary XML | Absolute and percentage position |
| [Senvest Q1 13F table](https://www.sec.gov/Archives/edgar/data/1328785/000117266126001964/infotable.xml) and [Q2 13F table](https://www.sec.gov/Archives/edgar/data/1328785/000117266126003417/infotable.xml) | 31 Mar and 30 Jun 2026 | SEC position filings; public | Primary XML; cannot identify tender versus sale | Common-share change |
| [Senvest Schedule 13G](https://www.sec.gov/Archives/edgar/data/1576789/000090266426002441/xslSCHEDULE_13G_X02/primary_doc.xml) | 31 Mar 2026 | SEC beneficial-ownership filing; public | Primary XML; scope reconciled to warrant | Common plus exercisable warrant interest |
| [Aristeia](https://www.sec.gov/Archives/edgar/data/1576789/000117266126003545/xslSCHEDULE_13G_X02/primary_doc.xml), [Millennium](https://www.sec.gov/Archives/edgar/data/1576789/000110465926095098/xslSCHEDULE_13G_X02/primary_doc.xml) and [HSBC](https://www.sec.gov/Archives/edgar/data/1576789/000108911326000026/xslSCHEDULE_13G_X02/primary_doc.xml) latest 13G/As | Q2 2026 | SEC ownership filings; public | Primary XML; motive unavailable | Major absolute reductions |
| [Senvest public investor letters](https://newsfile.moomoo.com/public/NN-PersistNoticeAttachment/7781/20260526/SEDAR_PLUS/CSA_SEDAR_PLUS_NOTICE_RECORD_ID_2415338.pdf) | Letters dated 4 Feb and 17 Mar 2026 | Public fund opinion within regulatory PDF | PDF text extracted locally for targeted pages; temporary file deleted; valuation claims treated as opinion | Bull SOTP, Studio/WordPress and buyback-confidence counterpoint |
| [Senvest Capital Q2 report](https://www.senvest.com/documents/FG/senvest/reports/656166_Senvest_Capital_Final_English_Jun_30_2026.pdf) | 30 Jun 2026 | Public unaudited fund-company report | PDF text extracted locally for targeted pages; temporary file deleted; valuation claims treated as opinion | Recent bull thesis, Partner/FX/profitability concerns and $2.5bn Base44 opinion |
| [Morningstar public Q2 summary](https://www.morningstar.com/company-reports/1493588-wix-earnings-relief-rally-on-beat-and-base44-profitability-shares-fairly-valued) | 5 Aug 2026 | Public analyst-summary metadata; article may include subscriber content | Public summary only; no paid body retained | Outside fair-value cross-check |

## 16. Unresolved facts and next filings to inspect

- Exact bank-loan maturity date(s), TFSI Basis Bid spread and lender-calculated covenant numerator are not public in the English summary.
- The Q2 filing does not separately disclose the Base44 contingent-liability fair value, paid-versus-unpaid retention schedule or maximum earnout.
- Wix does not disclose gross retention, customer-level churn, expansion cohorts or a clean deferred-revenue bridge by product.
- Schedule 13F/13G cannot identify which holders tendered shares, sold in the market, hedged elsewhere or changed economic exposure through derivatives.
- Asset duration and yield are insufficiently detailed to calculate net interest-rate exposure after the tender.
- The warrant and capped-call outcome depends on future stock price, settlement election, anti-dilution adjustments, counterparty performance and transaction timing.

The next evidence checkpoints are the bank balance/maturity in Q3, the 2026 20-F covenant and Base44 remeasurement, raw-versus-adjusted FCF reconciliation, annual award roll-forward, and post-tender 13G/13F changes.
