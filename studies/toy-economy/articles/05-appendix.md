# Appendix: inside the town

**[Return to the illustrated paper →](../site/05-who-buys-what-ai-makes.html)**

[Public repository: source code, tests and saved results](https://github.com/krystofmincev-ewise/value-deep-dives/tree/main/studies/toy-economy)

This appendix accompanies *Who buys what AI makes?* It separates accounting facts, assumptions and simulated outcomes. The models demonstrate conditional possibilities. They are not calibrated forecasts of wages, GDP, AI revenues or adoption dates.

## A. Two experiments, with separate extensions

The narrative uses one town as a teaching device. The code does not pretend that every feature operates inside one integrated simulation.

| Experiment | What it follows | What it deliberately simplifies |
| --- | --- | --- |
| Ten-business economy | Five pairs of firms; supplier payments, wages, owner income, equipment orders and cash across rounds | Fixed prices in the cash experiments; worker and owner household groups rather than ten distinct household budgets |
| Gradual AI economy | Two consumer shops with five workers each, an AI supplier, an equipment supplier; contracts, prices, tasks and individual household accounts | Supplier infrastructure is inherited; its running inputs are simplified; owners' accounts are pooled; pricing and purchasing follow declared rules |
| Banking extension | Loans, deposits, repayments, interest, losses and payroll or household spending gaps | Separate from the relative-price AI engine; one bank, no bank runs, no investment loans or separately measured banking-service output |
| Capital-growth extension | Investment, depreciation and productive capacity over time | Separate physical growth model; demand and financing sufficient to sell output are assumed, rather than established by the cash engine |
| Corporate-structure extension | An AI provider buying an existing shop or building a new production line | Fixed consumer budgets and prices isolate transaction mechanics; no optimized entry, acquisition valuation or integrated demand feedback |

The original [illustrated town paper](../site/03-when-the-economy-breaks.html) and [gradual AI paper](../site/04-ai-arrives-one-shop-at-a-time.html) remain unchanged. Their fuller discussions complement this combined account.

## B. What the main quantities mean

**GDP** counts production during a round. In the closed town, final expenditure is household consumption plus investment. There is no government or foreign trade. The accounting system also calculates GDP as firms' value added: sales less purchases of intermediate inputs. Those two views must agree.

**Nominal GDP** values output at current prices. **Real GDP** here uses the starting prices throughout. This is a simple fixed-base measure, not the chain-weighted procedure of a national statistics office. A price cut can raise real purchases without increasing nominal spending.

**Consumption** means goods actually purchased for household use. It is not all spending: newly produced business equipment belongs to investment. The models do not quantify happiness, leisure preferences, public services, distributional justice or the value of unpaid activity.

**Gross investment** includes both replacement and expansion. **Net investment** subtracts equipment depreciation. An equity purchase transfers an existing claim; it is not production of new equipment.

**Income** is earned during a round; **cash** is a balance available at a moment. A household can have cash from earlier rounds but, under an income-based spending rule, not request to spend all of it. A company can report losses for several rounds while using an opening cash reserve.

**Profit and dividends** are also distinct. Profit is the operating result. Dividends are cash actually distributed after the applicable payment rules. The shared-income experiment distributes specified rights to cash dividends; it does not give households an unlimited claim on accounting profits or new money.

**A payment stop** records an obligation that a firm cannot meet under the model's financing rules. The run ends with the failing round retained. It does not imply zero output forever after, nor model bankruptcy, restructuring or a public rescue.

## C. Starting accounts and the first experiment

The benchmark has GDP 100: consumption 80 and equipment investment 20. Wages are 60 and gross owner income 40. Workers consume their 60; owners consume 20 and finance equipment purchases of 20. Fixed-price cash runs start with a money stock of 200. It is conserved unless the separate bank changes deposits through lending or repayment.

The ten firms' gross sales sum to about 169.4 because some sell inputs to others. Their combined value added is only 100. Adding every sale as though it were final output would double count intermediate production.

Removing wages does not identify one outcome. It identifies a question that must be completed with spending and ownership assumptions:

| Wage-free arrangement | Eventual household consumption | Equipment investment | GDP | Former workers' consumption |
| --- | ---: | ---: | ---: | ---: |
| Owners raise consumption enough to sustain the original output | 80 | 20 | 100 | 0 |
| Worker group receives ownership income replacing its old wages | 80 | 20 | 100 | 60 |
| Owners consume half their income; investment remains fixed | 20 | 20 | 40 | 0 |
| Owners consume half; investment is one fifth of prior income | Shrinks | Shrinks | Tends toward zero | 0 |

In the last arrangement, next-round spending is 0.5 of prior income plus 0.2 for equipment. Thus `Y[t+1] = 0.7 × Y[t]` in the stated wage-free comparison. The sequence 100, 70, 49, 34.3 is a consequence of those rules, not a universal economic multiplier.

Holding investment fixed gives a smaller continuing economy; making investment respond to falling sales adds a contraction mechanism. Neither saving nor automation alone determines which rule is appropriate outside the experiment.

The [model specification](../model-spec.md), [shock specification](../research/shock-specification.md) and [cash results](../research/shock-cash-results.md) contain timing and ledger details. See [saved original results](../outputs/results.json) and [shock results](../outputs/shocks/results.json).

## D. Tasks, pay and prices in the AI shops

Each shop starts with five workers, a wage bill of 30 and consumer sales of 40. Together the shops require ten full human shifts to make eighty baskets. If AI performs fraction `a` of the tasks, human task-time for output `q` is `q × (1−a) / 8`; AI task-time is `q × a / 8`.

These are task requirements, not an automatic staffing decision. A contract determines paid time; a staffing rule determines who receives it. Protected salaries, reduced paid hours, layoffs, rotating shifts and redeployment can therefore differ even at identical automation shares.

AI normally costs three coins per task-hour in these examples. Each consumer shop starts with equipment capacity 100; equipment depreciates at ten percent per round and initial replacement orders total 20. Price adjustment follows a specified cost-pass-through rule. It is not an optimized market-clearing equilibrium.

At 40% assigned automation in both shops, the main contract comparison yields:

| Contract and use of freed time | Worker wages | Worker baskets | Real GDP |
| --- | ---: | ---: | ---: |
| Starting town | 60 | 60 | 100 |
| Protected pay, redeploy time for possible additional output | 60 | 68.18 | 110.91 |
| Protected pay, shorter planned shifts | 60 | 53.57 | 91.43 |
| Reduce paid hours | 36 | 40.91 | 83.64 |

“Assigned” matters: these comparisons impose matching technology paths to isolate contracts. They do not claim each shop would voluntarily choose every intervention.

Ten people sharing six paid shifts and six people retaining full shifts produce the same aggregate wage bill in the tested comparison. They do not produce the same individual income distribution. Rotating shifts changes the timing of individual wages even when total worker consumption matches the shorter-hours case.

The private-choice rule is a separate treatment. A shop compares its next-step operating profit with the current arrangement, using inherited rival prices and current customer budgets. In the hourly-pay example, its initial forecast rises from 10 to 10.6. After both reach 40% automation, actual profit per shop is about 5.23. With protected pay and the same fee, the first step is rejected because forecast profit falls to about 9.08. Free AI changes that choice. These are bounded decisions, not a general proof about fully informed rational agents.

The [adoption model](../research/adoption-model.md), [saved paths](../outputs/adoption/results.json) and [interactive accounts](../site/adoption.html) retain the exact ordering of purchases, production, wages and distributions.

## E. Timing, income sharing and the meaning of recovery

Gradual paths can preserve paychecks while job losses are delayed. Under the matched spending rules in the ten-firm experiments, that improves consumption during the transition without necessarily changing the eventual endpoint. In protected-pay AI paths, delaying automation instead delays cheaper goods.

Randomized arrival experiments vary when usable AI stages become available to the two shops. They use declared seeds and invented probabilities. The resulting distributions describe this simulated uncertainty only. They do not estimate the probability of an actual recession or any calendar-year outcome. The retained adoption experiments include 6,000 randomized runs, 192 coarse parameter comparisons and 37 named cases; failures are recorded separately from completed paths.

With full automation and ample AI capacity, the no-sharing path leaves former workers with zero consumption and real GDP about 48.57. Giving the worker group sixty percent of distributed cash dividends at the final stage gives worker consumption about 82.63 and real GDP about 129.14. Nominal GDP in that shared-income endpoint is 96.4: real output and current-price spending are different quantities.

Ownership rights are gifted, not purchased. Original owners still finance equipment. These rules establish one possible route to purchasing power, not a claim that the transition happens spontaneously or that this is the optimal distribution.

Timing can alter the result when investment also follows sales. In a separate late-sharing path, sharing stabilizes a much smaller economy: nominal GDP about 24.03 and real GDP about 32.27. Giving people claims on the income of a shrunken economy does not instantly rebuild its market.

The older recovery example is distinct: after a temporary order pause and labor reallocation, wages return to 60 and equipment purchases to 20. Owners finance equipment before consuming, and their consumption remains zero; GDP settles at 80. Workers do not spend down accumulated cash under the income-based rule. The outcome depends on that closure, rather than establishing inevitable permanent scarring.

## F. What the bank changes

Both bank comparisons use the same capitalization. Out of the original 200, firms contribute 20 of capital; customer deposits then total 180 and bank equity is 20. Lending is not compared with an otherwise identical economy secretly given extra startup wealth.

A bank loan creates a customer deposit and an equal debt. Paying a supplier moves that deposit. Repaying principal removes a deposit and the matching loan principal. Interest is a transfer to bank income and ultimately owners in these tests. A default loss reduces bank equity; it does not erase the deposits already spent into other accounts. For the underlying accounting, see the [Bank of England's explanation of money creation](https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy) and our [banking foundations note](../research/banking-foundations.md).

With a five-round pause in equipment orders, the no-credit comparison has unpaid wages of 2 in round 7. Zero-interest credit bridges the interruption, reaches peak debt 14, and is fully repaid after orders resume. Longer interruptions or mismatched repayment dates can exceed the bank's willingness to lend or the borrower's available cash.

In the household example, two missing wage rounds require total borrowing 120 to maintain worker consumption of 60 each round. After wages return, repaying principal at 12 a round temporarily leaves only 48 for consumption. At zero interest, credit changes consumption's timing but not its total over the tested horizon; positive interest reduces that household total by interest paid.

A known permanent income loss is refused. A mistaken recovery forecast followed by forgiveness of 20 consumes bank equity of 20. Larger losses trigger an insolvency stop; the program does not invent a rescue. Interest sensitivities of one percent are per invented model round, not annual interest rates.

These are one-bank payroll and household-credit experiments. They do not show that all lending merely rearranges a fixed future output: a loan funding productive investment could change capacity and future income, but that mechanism is outside these runs. See [banking model](../research/banking-model.md) and [bank explorer](../site/banking.html).

## G. Maximum output, sustainable output and consumption

The fine grid tests 101 automation shares in each of ten profiles: 1,010 runs, with 152 payment stops and 858 completions through the planned 80 rounds. A failed run is retained but excluded from equal-horizon rankings. A grid maximum is the best tested completed path under its profile, not a universal optimum.

With protected pay, redeployment, an AI fee of 3 and AI capacity of 10 task-hours, the best endpoint is 50% automation: real GDP about 114.12, including consumer purchases about 94.12. Worker purchases are about 70.59. Actual AI utilization is only about 58.8%. The price rule's planning quota drives the peak; realized AI service is not physically exhausted.

Increasing AI capacity to 25 changes the best completed 80-round endpoint to 58% automation, with real GDP about 117.59. However, each consumer shop loses about 0.307 per round and ends round 79 with cash about 3.269. Extending the path causes unpaid wages in round 90. An alternative screening out final-round losses and buffer depletion selects 55%, which also survives a 120-round check. Survival for 120 rounds is still not proof of indefinite sustainability.

Holding inherited consumer equipment at 200 and keeping ten human shifts available, the physical envelope is:

`Q(a) ≤ min(200, 80/(1−a), 8A/a)`

where `A` is total AI task capacity. At a zero denominator, the corresponding task is not required. The maximum of this static envelope is `min(200, 8 × (10+A))`: 160 consumer baskets for AI capacity 10, or 200 for capacity 25. This is a resource ceiling, not a demand, profitability or financing forecast. It is not a bound on a future economy that builds more equipment.

The [frontier note](../research/adoption-frontier.md) and [full grid](../outputs/adoption/frontier.json) distinguish these concepts and show all profiles, ties and local peaks.

The capital-growth extension asks a different question. With scalable automated capital and investment exceeding depreciation, output can keep growing without workers; without a resource limit or diminishing returns there is no finite ceiling inside that technology. Sufficient demand and clearing prices are assumed in this module.

Under the separate diminishing-return technology, maximum stationary consumption occurs at GDP 250: consumption 125 plus replacement 125. Maximum stationary GDP is 500, all used for replacement, leaving consumption zero. These are **stationary** comparisons: a stock that can be maintained at its chosen size. They are not a solution to an optimal transition with discounting, welfare or leisure preferences. See [growth-limit results](../outputs/shocks/limits.json).

## H. Buying a company and building something are different

This additional controlled experiment is useful for interpreting an AI supplier's expansion. Customer budgets and prices are fixed so that transaction mechanics can be inspected separately.

| Event | Consumption | Produced equipment | GDP | What happened? |
| --- | ---: | ---: | ---: | --- |
| Baseline | 80 | 20 | 100 | Ordinary replacement |
| AI supplier buys an existing shop | 80 | 20 | 100 | Cash and an ownership claim change hands |
| Supplier buys equipment for a new line | 80 | 40 | 120 | New equipment is produced |
| New line operates, with replacement afterward | 80 | 22 | 102 | Same household purchases; more equipment wears out |

The acquisition uses existing supplier cash; its price is assumed. It does not automatically create productivity. The new line takes some sales from incumbents because total customer spending remains fixed. Its extra replacement requirement raises gross GDP by 2 without increasing consumption; net domestic product remains 80 after depreciation.

An acquisition followed by automation is compared with the same automation without acquisition. Production matches. The ownership transfer itself is not the technology improvement. The model does not solve optimal merger strategy or allow every form of parent-company support. See [corporate-structure specification](../research/adoption-structure.md) and [fourteen saved paths and eighteen sensitivities](../outputs/adoption/structure.json).

## I. The war analogy: what it explains and what it does not

The bridge is a hypothetical illustration of production versus wealth. Producing a replacement counts as current activity; destruction of an old asset is separately recorded. A disaster or war can also interrupt current production, so rebuilding does not establish that total GDP rises.

The model's routine replacement is depreciation. Exceptional disaster and war losses have a different national-accounting treatment; they are not ordinary consumption of fixed capital. Net domestic product, which deducts ordinary depreciation, is therefore not a complete measure of the effects of war either. The analogy supports a narrow question—how much production improves people's position?—not a quantitative comparison between AI and war.

Sources checked on 12 October 2026:

| Source | Publication / revision | Evidence and use | Access and retention |
| --- | --- | --- | --- |
| [BEA: production and income after disasters](https://www.bea.gov/help/faq/1013) | Published 28 November 2012; page modified 26 October 2022 | Primary statistical guidance; verifies current production, rebuilding and separate asset losses | Public official webpage; retrieved with web open; verified against page text; link and original paraphrase only, no retained source copy |
| [BEA: fixed assets and depreciation after disasters](https://www.bea.gov/help/faq/1014) | Published 28 November 2012; page modified 26 October 2022 | Primary statistical guidance; verifies exceptional losses are excluded from ordinary depreciation | Public official webpage; retrieved with web open; verified against page text; link and original paraphrase only, no retained source copy |

Existing AI and banking source provenance remains in the [adoption sources](../research/adoption-sources.md), [adoption foundations](../research/adoption-foundations.md) and [banking foundations](../research/banking-foundations.md). Numerical results in this paper come from synthetic program output, not those external sources.

## J. Reproduce and audit

The simulation engines are unchanged by this combined edition. Two separate subagents reviewed the combined manuscript for [economic accuracy](../research/combined-economics-review.md) and [clarity and diagram consistency](../research/combined-readability-review.md); their records identify the reviewed versions and verification limits. Earlier computational reviews concern their own recorded model snapshots. See [adoption verification](../research/adoption-validation.md), [Sol review](../research/adoption-sol-review.md) and [Astra review](../research/adoption-astra-review.md).

From the study directory, the core models and tests require only Python's standard library:

```sh
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m toy_economy.cli --output outputs
```

The existing [README](../README.md) provides each extension's reproduction commands and optional rendering dependencies. The combined manuscript is [plain Markdown](../articles/05-who-buys-what-ai-makes.md); this [appendix source](../articles/05-appendix.md) is separate. Rebuild these reading editions with the prepared environment:

```sh
.venv/bin/python scripts/combined_figures.py
.venv/bin/python scripts/build_combined_report.py
```

Most diagrams reuse the preceding papers' saved, data-linked figures. The new cash-buffer illustration is sourced to the saved frontier and documented extension check. The static edition displays every stage. The optional step edition reveals the same figures under reader control, starts without autoplay, and respects reduced-motion preferences.

The models intentionally omit many mechanisms: new occupations and products, retraining, changing preferences, public spending and taxes, international trade, migration, resource depletion, endogenous AI research, competitive equilibrium and general bankruptcy resolution. These omissions limit what we can conclude. They do not prevent us from tracing the payments and physical constraints that the models actually include.

**[Return to the conclusion →](../site/05-who-buys-what-ai-makes.html#back-to-the-car)**
