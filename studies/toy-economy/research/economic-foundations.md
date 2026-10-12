# Economic foundations for the toy economy

Draft research note. Information cutoff and source access: 10 October 2026. The calculations below are original conditional examples, not a forecast, estimated multiplier, or calibrated model of a country. Source metadata and verification limits are in [sources-economics.json](sources-economics.json).

## What the exercise can establish

Ten firms, ten workers and ten owners are enough to illustrate the circular flow of income. They are not enough to identify how an actual economy will respond to AI. In a symmetric model, ten firms merely divide aggregate amounts by ten. Firm-level detail becomes informative only when firms have different technologies, customers, prices or adoption decisions.

The central answer is conditional. Automation can expand productive capacity while sales stagnate or fall. Real GDP can also grow while the wage bill falls, including a logically possible endpoint with zero paid workers. The dividing assumptions concern the ability of capital to produce, who receives income, what they spend it on, and how prices, investment and policy respond.

Use three distinct quantities throughout:

- **Capacity:** the most final output the technology could produce during the period.
- **Real GDP:** actual final production valued at fixed reference prices in this toy.
- **Nominal GDP:** actual final production valued at current transaction prices.

Report worker consumption and owner consumption separately. Neither nominal GDP nor real GDP reveals whether displaced workers can buy necessities.

## Accounting rules before behavior

Use nominal value added as the accounting backbone. In the deliberately stripped-down economy, with no production taxes, depreciation or foreign income, income can be written as `Y = W + Π`. Here `Π` is the residual accruing to owners. In actual accounts, gross operating surplus is not identical to distributable corporate profit. [BEA value-added definitions](https://www.bea.gov/help/faq/1197).

With no trade or government, `Y = C + I`. Investment means newly produced capital and inventory change. Software and R&D can qualify as capital; an operating AI subscription need not. A purchase of an existing financial security is not newly produced capital. Keep the toy's classification rule visible. [BEA private fixed investment](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-06.pdf).

If government is introduced, distinguish purchases from transfers. A transfer changes disposable income and potentially consumption; counting it again in `G` would double count. For a version with private investment `I`, government purchases `G`, and net taxes `T` including transfers, private saving is `S_private = Y − T − C`, so the simplified closed-economy identity is `S_private = I + G − T`. Setting `G=T=0` gives `S=I`. These are rearrangements of the declared toy identities, not behavioral equations. Government capital can instead be included in total investment, but then subtract government consumption rather than all of `G` when defining national saving. [BEA fundamental concepts](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-02.pdf).

Goods produced and added to inventories count as investment even if a hoped-for sale fails. Therefore a sales decline need not immediately lower GDP by the same amount. A simulation that reduces production instantly to orders is imposing a just-in-time production assumption; one that leaves production unchanged must record inventory accumulation. Services that cannot be stored require a different adjustment. [BEA inventories methodology](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-07.pdf).

### Saving equals investment does not choose the adjustment

The identity does not require additional desired saving to become additional planned investment at the old level of output. Output and income may fall, inventories may rise unexpectedly, interest rates and asset prices may change, or another sector may borrow and spend. A financial purchase can fund new investment, transfer purchasing power to someone who spends, or acquire an existing asset. Its eventual effect is a mechanism to specify.

It is also misleading to describe bank lending as simply handing firms an unchanged pool of prior household deposits. The Bank of England explains how lending creates deposits and discusses profitability, regulation and monetary policy constraints. This toy need not contain banks, but its omission should not become a claim about how all real investment is financed. [Bank of England, 2014](https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy).

## The purchased-service example needs consolidation

Replacing a purchased business service with in-house AI does not by itself lower aggregate GDP by the avoided invoice. Consider a wholly domestic chain, with unchanged final sales and no other intermediate inputs:

| Conditional illustration | Final producer's value added | Supplier's value added | Aggregate value added |
| --- | ---: | ---: | ---: |
| Final sales 100,000; purchased HR service 10,000 | 90,000 | 10,000 | 100,000 |
| Same final sales; in-house HR uses AI tokens costing 10 | 99,990 | 10 | 100,000 |

The supplier loses gross sales and the final producer gains value added. Income can shift from the supplier's workers to the final producer's owners; a later change in spending can then change production. That is a separate causal step. Summing business turnover would incorrectly count the HR invoice twice. The example applies BEA's definition of value added as gross output less intermediate inputs. [BEA gross output versus GDP](https://www.bea.gov/help/faq/1197).

Three cases must remain separate:

1. **Business internalization:** an intermediate service moves inside another producer. Consolidate the domestic chain as above.
2. **A cheaper final purchased service:** nominal expenditure can fall while its real quantity stays unchanged or rises, if the price measure captures the equivalent service and its quality.
3. **Household self-production:** replacing paid household services with unpaid work at home can move activity outside the conventional production boundary. The treatment has exceptions, including owner-occupied housing and certain own-use goods and capital. Do not generalize all own-use production as excluded. [BEA production boundary](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-02.pdf).

Service productivity is difficult to measure, not literally unmeasurable. Customization, intangible quality, implicit prices and nonmarket output complicate deflation and volume measurement. These difficulties can obscure genuine gains, but do not justify treating every saved business invoice as missing GDP. [OECD 2026, Box 4.1](https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2026_734a5e68-en/full-report/productivity-patterns-across-industries_8238f2eb.html).

GDP also differs from welfare. Experimental BEA work proposes accounting extensions for free digital content and AI; that is evidence of a measurement research problem, not proof that the official accounts already include all consumer benefits. [BEA research, June 2026](https://www.bea.gov/research/papers/2026/progression-free-digital-content-ai-impacts-us-economic-growth-and).

## A solved benchmark for the demand channel

This is an analytical check for a simulation, not a required implementation. Assume one homogeneous domestic final good, current price `p=1`, slack productive capacity, no inventories, no government, no depreciation, and nonnegative aggregate profits. Let:

```text
L = employed workers, 0 to 10
w = fixed money wage per employed worker
W = wL
Y = nominal GDP = real GDP at p=1
Π = Y − W
c_w = worker consumption share of wage income
c_o = owner consumption share of current profit income
A = autonomous final spending, initially planned real-capital spending I
C = c_w W + c_o Π
```

The behavioral spending shares are assumptions. Empirical research supports substantial household heterogeneity in responses to income shocks, but a short-run marginal response to an unexpected shock is not the same object as a permanent fixed consumption share. Do not label the illustrative values as empirical estimates. [Carroll, Slacalek and Tokuoka, 2014](https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1655.pdf).

Solving `Y=C+A`, rather than repeatedly counting the same income, gives:

```text
Y* = [(c_w − c_o)W + A] / (1 − c_o), for c_o < 1
Π* = Y* − W
```

The solution is applicable only if `Y*` is within available capacity and `Π*≥0`, unless losses and their financing are explicitly allowed. Algebraically, `Π*≥0` requires `A≥(1−c_w)W`. If `c_o=1`, the denominator vanishes; use the original equations and a different scale-setting closure. Do not report an infinite multiplier as an economic prediction.

For the study's synthetic baseline, take `w=6`, `c_w=1`, `c_o=.5`, and `I=A=20`. Baseline output is 100, the wage bill is 60, owner income is 40, consumption is 80 and investment is 20. All money quantities are invented units per period.

| Workers laid off | Workers employed | Wage bill | GDP at fixed price | Owner income | Worker consumption | Owner consumption | Investment |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 10 | 60 | 100 | 40 | 60 | 20 | 20 |
| 1 | 9 | 54 | 94 | 40 | 54 | 20 | 20 |
| 3 | 7 | 42 | 82 | 40 | 42 | 20 | 20 |
| 5 | 5 | 30 | 70 | 40 | 30 | 20 | 20 |
| 10 | 0 | 0 | 40 | 40 | 0 | 20 | 20 |

This is the demand-risk mechanism in a fully reconciled example. With workers consuming all their wages, owner income stays 40 while GDP falls dollar for dollar with the wage bill. Zero wages leave positive output because investment spending remains positive. The example assumes that firms continue to buy 20 of newly produced capital even with weak consumer demand; it does not explain why they would do so forever.

An optional sensitivity uses `c_w=.9` and recalibrates `I=26` to preserve the starting GDP of 100. Then the 0/1/3/5/10 layoff cases give GDP `100/95.2/85.6/76/52` and owner income `40/41.2/43.6/46/52`. Owner income can therefore rise while GDP and worker income fall, but this is a separate spending specification rather than the study's baseline.

The benchmark also makes the productivity-only result transparent. If capacity doubles while `L`, `w`, spending shares, `I` and `p` stay unchanged, demand and actual output remain 100. Capacity is higher; realized GDP is unchanged. If firms initially produce at the new capacity anyway, the missing expenditure is inventory investment, subject to durability, valuation and later production adjustment.

### Thresholds worth showing

For fixed price and slack capacity, a loss of `ΔW<0` changes output by:

```text
ΔY = [(c_w − c_o)ΔW + ΔA] / (1 − c_o)
```

The additional autonomous final spending needed to keep GDP unchanged is `ΔA = (c_w−c_o)|ΔW|`. In the baseline, each lost wage of 6 requires 3 additional investment, autonomous consumption or purchases. The optional `c_w=.9` sensitivity requires 2.4. These are exact results of the specified models, not universal fiscal multipliers.

A tax-financed transfer `R` from owners to workers adds `(c_w−c_o)R` to the numerator. Replacing a lost wage bill one for one therefore restores the baseline demand in this stripped-down benchmark, subject to the ability to levy and pay the transfer. Counting `R` again as `G` would be wrong. Giving workers ownership can achieve a related income-routing effect, but must reduce other owners' shares so total ownership stays 100%.

One useful sensitivity is to let `ρ` describe how an additional unit of owner saving generates additional current real-capital expenditure. Then the effective propensity to spend owner income is:

```text
b = c_o + ρ(1−c_o)
I = I_0 + ρ(1−c_o)Π
Y* = [(c_w−b)W + I_0] / (1−b), for b<1
ρ_threshold = (c_w−c_o)/(1−c_o)
```

With the optional `c_w=.9` values, the threshold is `.8`. At that value, workers and owners have the same total current-spending propensity once additional investment is included. Above it, layoffs can raise demand under this closure; below it they lower demand. In the study baseline `c_w=1`, the threshold is `1`, where the equations become singular rather than defining an ordinary interior benchmark. This is an assumed investment response, not an inference from `S=I`. The remaining saving must finance `I_0` or another sector's spending in the reconciled accounts. Do not describe `ρ` as the fraction of all national saving that becomes investment while silently discarding the rest. At `ρ=1`, return to the original equations and supply another scale-setting condition; with positive autonomous spending there may be no finite solution.

## The strongest counterexample: price adjustment

Repeat the benchmark while allowing the single price to clear the market at a chosen feasible real output `Q`. Keep **money wages and nominal autonomous spending** fixed. The same spending equations determine nominal expenditure `Y*`; the clearing price is `p=Y*/Q`.

For capacity and output of 200, the example gives:

| Layoffs | Real GDP Q | Nominal GDP Y | Clearing price p | Real worker consumption | Real owner consumption | Real investment |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 200 | 100 | .500 | 120 | 40 | 40 |
| 1 | 200 | 94 | .470 | 114.894 | 42.553 | 42.553 |
| 3 | 200 | 82 | .410 | 102.439 | 48.780 | 48.780 |
| 5 | 200 | 70 | .350 | 85.714 | 57.143 | 57.143 |
| 10 | 200 | 40 | .200 | 0 | 100 | 100 |

Amounts in the last three columns are divided by the common current price; rounding can create small differences. Here real GDP doubles, even at zero employees, and workers without jobs receive none of it. The price drop raises the purchasing power of continuing nominal spending. This is an existence example requiring fully flexible prices, the relevant single consumption/investment good, feasible autonomous investment and capital-only production. It is not an assertion that rent, debts, food and every other household expense fall together.

Do not change from fixed money wages to fixed real wages without saying so. Price changes make those different assumptions. Do not clear the market by reducing the price and then separately apply another quantity-demand increase on top; that counts the same adjustment twice.

### When zero-worker growth is possible

It requires **both** an appropriate technology and a spending/valuation closure. A production function `Q=A K^α L^(1−α)` with `0<α<1` forces `Q=0` at `L=0`; this reflects essential labor in that function. A capital-only production technology can permit positive output. Choosing between them settles an assumption about the endpoint, not an empirical fact about whether current AI can perform all tasks.

Also distinguish zero paid employees from zero human work. Owners may still manage production. A literal zero-human-work example must assume machines also maintain equipment, replenish inputs, run firms and produce replacement capital, or explicitly limit the experiment to one period with inherited capital. Paid employment and hours are different measures; ten people on shorter hours need not be ten full jobs.

At `L=0`, fixed-price output in the simple demand closure is `Y=A/(1−c_o)`. With `A=0` and `c_o<1`, the only nonnegative equilibrium is zero. That collapse comes from the absence of an autonomous spending flow and the imposed saving behavior. It is not a general law about robots. With positive investment or autonomous owner consumption, output can stay positive; with growing spending or falling prices and growing feasible capacity, real output can grow.

Investment can be a large destination for output, including an automated capital sector supplying itself. Accounting places no fixed limit on its share. Economic interpretation still requires a purpose for the capital, resource feasibility and a reason for continuing accumulation. Infinite horizons with depletion, depreciation, inventories, borrowing or negative profits require the corresponding stock equations; a one-period illustration cannot prove sustainability.

### A capital-only growth example

A compact dynamic counterexample makes the capital stock explicit. Assume one automated good can serve consumption or build new capital, `Q_t=aK_t`, a real investment share `s`, and depreciation rate `δ`:

```text
I_t = sQ_t
C_t = (1−s)Q_t
K_(t+1) = (1−δ)K_t + I_t
Q_(t+1)/Q_t = 1 + sa − δ
```

Real output and consumption grow together with zero labor if `δ/a < s < 1`. Such a saving share exists when `a>δ`. The assumptions, especially capital-only production and scalable nonlabor inputs, deliver the result; it is not a forecast about current AI. At `s=1`, consumption is zero even if output grows rapidly, so that mathematical path does not establish prosperity or a welfare-maximizing choice.

For `K_0=200`, `a=.5`, `s=.3`, and `δ=.1`, initial real GDP is 100 and each period's growth is 5%. After 20 periods, real GDP is approximately 265.3298 and consumption is 185.7308. Nominal GDP can remain 100 if the single price falls to about .376889. Ownership can place all consumption with the ten capital owners and none with displaced workers, illustrating growth without broad participation.

Depreciation is present in this extension, unlike the first static benchmark. GDP `Q` is gross value added; the example has no intermediate inputs. At zero labor, net capital income is `Q−δK`, not all of `Q`. Distinguish gross operating surplus, replacement investment, net investment and distributable income. The constant real investment share here is also a different behavioral rule from the static example's fixed nominal investment bill; do not splice their paths together silently.

Task-based research distinguishes labor displacement, productivity effects and the creation of new tasks for humans. New products alone do not guarantee replacement employment. [Acemoglu and Restrepo, 2019](https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3). Formal models can generate rising output and worsening distribution, including long transitions; those outcomes depend on substitution and saving assumptions. [Berg, Buffie and Zanna, 2018](https://www.imf.org/en/publications/wp/issues/2018/05/21/should-we-fear-the-robot-revolution-the-correct-answer-is-yes-44923).

## What current research supports

Fornaro and Wolf's April 2026 working paper directly studies higher automation, unequal spending propensities and nominal rigidities in a closed economy. Their framework permits a demand slump under one policy regime and a boom under another. The authors explicitly do not predict that a slump is necessary or most likely. It is a close theoretical precedent, not independent empirical validation of the toy's parameters. [Primary university paper](https://econ-papers.upf.edu/papers/1943.pdf).

BIS's 2026 report, Box C, considers demand as a constraint on returns to further automation alongside supply bottlenecks. Its underlying demand-bottleneck manuscript is listed as a mimeo; this note has not reproduced that model. [BIS report](https://www.bis.org/publications/aer-2026/progress-peril).

These sources support showing different closures. They do not establish that AI executives' statements caused an aggregate spending decline, that current automation has eliminated a specified fraction of all jobs, or that any given savings rate forecasts a recession.

## Labor share: an accurately bounded historical statement

In BLS's 15 September 2026 release, US **nonfarm business** labor compensation is 52.8% of output in 2026Q2, compared with 65.5% in 1947Q1 and 62.8% in 2000Q4. Those same-vintage endpoints imply declines of 12.7 and 10.0 **percentage points**, respectively. Relative to 1947Q1 the decline is about 19.4%. Do not call it a 12.7% decline, whole-economy wages/GDP, or evidence of AI causation. [BLS release](https://www.bls.gov/opub/ted/2026/labor-share-at-its-lowest-level-52-8-percent-in-second-quarter-2026.htm).

The measure includes nonwage compensation; BLS's treatment of self-employed labor uses estimation assumptions. The residual includes more than pure net shareholder profit. Alternative sector boundaries and self-employment methods change the measured level and trend. Older BLS publications contain historical values from earlier vintages; mixing them with current endpoints manufactures a comparison. [BLS methodology](https://www.bls.gov/opub/mlr/2017/article/estimating-the-us-labor-share.htm).

Falling labor share does not entail falling labor dollars. For example, output rising from 100 to 150 while labor share falls from 60% to 50% raises aggregate real compensation from 60 to 75. Per-worker income and household outcomes further depend on employment, hours, prices and distribution within labor income. In the user's initial fixed-wage, fixed-employment phase, `W` is mechanically flat while `Y` can grow. That establishes the arithmetic possibility, not its macroeconomic cause.

## China: a useful analogy with strict limits

IMF's 2025 China consultation describes weak domestic demand, property-related household concerns and reliance on investment and exports; it recommends more support for consumption. In the report's Table 1, 2025 estimates put capital formation at 38.8% of GDP, national saving at 42.1%, and the current-account surplus at 3.3%. These are national aggregates, not the saving rate of ten capitalists. [IMF report, February 2026](https://www.imf.org/-/media/files/publications/cr/2026/english/1chnea2026001-source-pdf.pdf).

The analogy is that extensive investment can coexist with weak household demand, and that the quality and utilization of new capital matter. It does not show that investment cannot raise GDP, that China has no consumers, or that AI causes its imbalances. China also has trade, government, a financial system, household property wealth, demographic change and institutional features absent from the baseline. Its excess national saving can correspond to external lending; the toy has explicitly removed that route. An open-economy extension would use `S−I=CA` with a clearly defined current account, not quietly append exports to rescue the closed-economy baseline.

The public press-release rendering showed several misaligned table-year excerpts when retrieved. The numerical claims above were checked in the actual report's Table 1, PDF page 66, and repeated indicator table on PDF page 5. Use the PDF table, not search snippets or a copied web summary, for values.

## Relationship to the earlier article

Read inputs: the 25 September 2026 `article.md`, `substack.md`, `research-notes.md`, `editorial-notes.md`, `adversarial-review.md`, and `review-checks.md` in the local `ai-demand` article package. These are author working material, not independent economic evidence. No paid article text was copied into this note.

The published manuscript already separates nominal accounting from real output, planned first-round spending from equilibrium GDP, financial transactions from capital expenditure, and GDP growth from shared prosperity. Its reviewed correction explicitly rejects broad household participation as an accounting prerequisite for GDP doubling. Preserve those distinctions rather than claiming the study has discovered a basic error in the existing essay.

The strongest extensions are concrete:

1. Put workers, owners and firm accounts in one closed loop and reconcile every payment.
2. Show the initially fixed wage bill alongside higher capacity; distinguish realized sales from the technological possibility.
3. Solve the 1/3/5/10 layoff cases and the zero-worker endpoint under declared spending and price rules.
4. Show the investment offset threshold and a full price-clearing counterexample beside the adverse case.
5. Add a clean historical labor-share statement with geography, compensation definition, dates and data vintage.
6. Correct the avoided-intermediate-invoice inference if it is introduced from outside the original manuscript.
7. Use China only to illustrate investment, demand and capital-allocation tensions, with its open-economy difference stated immediately.

The voice is first-person, skeptical but conditional, with a concrete customer or business owner before abstract machinery. Short paragraphs and specific numbers do the work. The article's notes explicitly reject fabricated anecdotes, invented terminology, em/en dash punctuation and claims of measured probabilities. Its five numbered Substack sections and simple figures give a reader a clear path. A companion study should keep the narrative approachable while locating formulas, assumption tables and accounting checks in expandable or clearly labeled supporting material. Do not replace the central question about access to output with a deterministic claim that all GDP must collapse.

## Implementation checks and honest limits

- Every scenario must satisfy final expenditure, income and value-added identities within a declared tolerance. Report inventories explicitly or set them to zero by assumption.
- Show planned and realized consumption/investment separately when capacity binds. `min(capacity, desired spending)` alone does not reconcile unfilled orders, household budgets and realized investment.
- Keep stocks and flows separate: money balances, debt, equity and capital are stocks; wages, consumption, saving and investment are period flows. A circular flow does not require a new unit of money for every new unit of GDP.
- Choose simultaneous equilibrium or lagged spending. A lagged model needs initial wealth, a payroll funding rule, transaction timing, profit distributions and a limit on losses/borrowing. A lagged path and its static benchmark must use comparable definitions before their differences are interpreted.
- Keep owner distributions and retained earnings from being spent twice. Capital expenditure is not simply deducted from GDP operating surplus as though all investment were a current intermediate expense.
- Define the automation cost and the domestic supplier receiving it. An intermediate cost is someone else's domestic revenue and is consolidated; imported AI inputs would violate the baseline unless explicitly added.
- At zero employment, real GDP per worker and aggregate labor productivity are undefined. Display a missing value with an explanation, not a finite or infinite productivity claim.
- Any demand-sensitive investment response, precautionary-saving response, price elasticity or adoption game is a synthetic sensitivity. Estimates require evidence beyond this exercise.
- A larger GDP alongside zero worker consumption is an accounting-consistent but unequal outcome. A welfare score would require preferences and distributional weights; do not invent one implicitly.

AI assistance: Codex, GPT-6.1 Sol with the user-selected Ultra setting, 10 October 2026, assisted source discovery, original derivations and drafting. Public primary sources were opened and relevant claims inspected. The toy parameters and equations are author calculations. No external paid run or separately billed model/API call was used for this research note.
