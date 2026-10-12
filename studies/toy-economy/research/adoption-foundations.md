# Gradual AI adoption: a compact, coherent experiment

Design note, 11 October 2026. This is a bounded extension for a 3–4 hour experiment, not a calibrated model or a forecast. The [source log](adoption-sources.md) distinguishes primary evidence from the proposed assumptions. No simulation results are asserted here.

The new question is how the transition changes when firms adopt gradually, some workers become more productive, some hours disappear, prices respond and AI suppliers receive revenue. More mechanisms are useful only if the experiment can still explain why each outcome occurs.

## Three viable model choices

| Choice | What it adds | Main limitation | Recommendation |
| --- | --- | --- | --- |
| One final good, domestic AI supplier | Gradual adoption, hours, wages, fees, cash, prices and physical capacity | Equipment and consumption share a deliberately simple good/unit | Smallest first executable run |
| Separate consumption and equipment goods, plus AI services | Real investment quantities and replacement, distinct prices, supplier compute capital | More payment and quantity bookkeeping | Preferred if existing production/ledger code can be reused safely |
| Differentiated firm products with a shared spending budget | Price-sensitive market shares, bounded entry/exit and consolidation | Demand-system and pricing assumptions become important | Add only after the first two accounting closures work; not a solved strategic-price game |

Keep banks out of the first version unless credit is necessary for a specific question. They are already a separate experiment. Entry and acquisitions can be small optional mechanisms rather than prerequisites for the first result. The closest comparison should switch one mechanism at a time while preserving initial money, capital, labor endowment and random draws.

## Adoption, productive work and paid work

Acemoglu and Restrepo distinguish automation that shifts tasks to capital from technologies that help workers and from the creation of new human tasks. Their framework includes both displacement and productivity effects; productivity improvement need not raise labor demand. Use that distinction without importing their model's comparative statics as universal results for this town. [Primary article](https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3), [author-hosted full text](https://economics.mit.edu/sites/default/files/publications/Automation%20and%20New%20Tasks%20-%20How%20Technology%20Displace.pdf).

A minimal original specification gives each firm an adoption intensity `a ∈ [0,1]` and a labor requirement per unit of output `ℓ(a)`. Adoption reduces `ℓ` gradually, with a bounded adjustment per round. AI assistance and outright automation can have different attainable reductions or minimum human hours; neither should be identified with “number of workers laid off” by definition.

For example, `ℓ(a) = ℓ₀(1 − s·a)` with `0 ≤ s < 1` describes a technology that always retains some human work. This is a toy equation, not an empirical estimate. Full automation requires an explicitly different boundary such as `s=1`, plus an AI supplier and other inputs that can themselves operate without human labor. Do not infer town-wide zero labor from zero labor at customer firms alone.

One coherent production constraint is:

`q ≤ min(customer orders, physical capacity A·K, available productive hours / ℓ(a), AI-supported capacity)`.

This formula is illustrative, not a requirement to add every constraint immediately. Define the zero-labor-requirement branch without dividing by zero. A firm can have low costs and still have few orders.

Distinguish hours needed to fulfill orders, hours actually worked and hours paid. If labor adjusts slowly, a firm may pay for idle time; that is a real wage cost in the toy. If all workers share fewer hours, headcount can stay constant while full-time equivalents fall. If the program tracks only continuous labor units, label them **full-time equivalents**, not people. Actual jobs require a roster or an explicit integer allocation rule. The BLS explains why worker counts and hours differ in [its labor-input guide](https://www.bls.gov/k12/productivity-101/content/how-is-productivity-measured/labor.htm).

The empirical *Generative AI at Work* study concerns an assistant used by human customer-support agents. Its gains differ across workers, and its authors explicitly do not identify long-run aggregate employment or wage effects. It supports heterogeneous assistance as a possibility; it does not calibrate automation of every industry. [Published article](https://doi.org/10.1093/qje/qjae044), [public author-hosted copy](https://danielle.li/assets/docs/GenerativeAIatWork.pdf).

Do not count the same technical gain twice by both reducing labor per unit and multiplying output again by an identical “productivity bonus.” A separate improvement to machine productivity is allowed only if it is a distinct declared mechanism. Report observed output/hour separately from the technological labor requirement: sales and idle time can change the former even when technology is unchanged. When total worked hours are zero, that ratio is undefined; report the underlying quantities.

## Price competition and purchasing power

For an early run, a declared pricing rule is enough. Define net unit cost using wages, paid AI usage, other intermediate inputs and the chosen treatment of fixed costs. A controlled sensitivity can use `pₜ = p₀ + λ(cₜ − c₀)`, with positive-price validation and `λ` chosen by the author. This passes a stated fraction of a cost change into price. It is not an equilibrium or a universal bound on actual pass-through.

If the implementation instead uses a markup over cost, distinguish a constant percentage markup from a constant currency margin. They produce different price and profit paths. Do not call an arbitrary fall in the markup proof of competition. Weyl and Fabinger analyze pass-through under imperfect competition; the public [publisher abstract](https://www.journals.uchicago.edu/doi/abs/10.1086/670401) establishes that this is a distinct economic problem, not an automatic one-for-one identity. This note does not rely on inaccessible full-text details.

Each household has one spending budget constrained by available money and the declared income/savings rule. Lower prices buy more units from that budget if production is available. In a differentiated-products version, normalize price-sensitive firm shares to sum to the budget; purchases are spending divided by each price, subject to supply. Do not apply an extra quantity-elasticity multiplier and thereby spend the same household budget twice.

Firm-specific taste draws can redistribute that budget. They do not create aggregate purchasing power. If an aggregate demand shock changes the fraction of cash people spend, say so and retain the unspent balance. In a closed town, spending cannot come from an unrecorded external customer.

Firms' forecasts must use available information: recent demand, announced prices, observed competitors and declared expectations. A finite-menu comparison of adoption options is a bounded decision rule, not proof of a global optimum. Include retaining the current technology and, where feasible, inactivity/exit. A choice that beats retention can still be worse than closing.

## GDP when prices change

For a closed town with no government or inventory accumulation:

`nominal GDPₜ = Σ current prices × quantities of final consumption and new investment`.

Compute the same total independently as firm revenue less purchased intermediate inputs, summed over **all** domestic producers. Gross operating surplus plus wages must reconcile under the stated accounting convention. Cash balance changes, equity subscriptions, acquisition prices and principal borrowing/repayment are not additional output.

For the compact experiment, use a fixed-base quantity measure:

`real GDPₜ at base prices = Σ baseline final-good prices × current final-good quantities`.

With one homogeneous good priced at one in the baseline, this reduces to the physical quantity produced for final use. With multiple goods, retain their separate baseline weights. This is an additive toy index, not the BEA's chain-type Fisher index. The BEA's [Chapter 2, pp. 2-15–2-16](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-02.pdf) distinguishes current-price value from quantity change and describes its actual index method.

Real output can rise while nominal GDP falls if prices fall enough. Nominal GDP can rise without more goods if prices rise. Neither gives every worker more consumption. Report physical/fixed-base consumption for workers and owners separately, prices, nominal wages and the purchasing power of those wages. A falling wage bill must not be mislabeled an equal fall in real living standards.

Use final quantities to avoid inconsistent deflation. If also computing real value added from production, value output and every intermediate input at their own baseline prices. Do not divide every sector's nominal value added by a consumer price index when AI and equipment prices move differently. Net output deducts depreciation under a declared consistent quantity/price convention; it is not simply cash profit.

Keep quality fixed unless there is a measurable quality mechanism. The model cannot claim consumer surplus, leisure benefits or utility from real GDP alone. Lower output with more leisure is not automatically worse, and an AI-generated output with no modeled value is not automatically a welfare gain.

## AI suppliers, installation and scarce capital

Recurring AI service charges are intermediate purchases by the user firms. They are supplier revenue, not an additional final expenditure. The supplier must have its own input costs, wages, profit and ownership. Consolidation cancels the internal fee; it does not make the supplier's activity worthless. The BEA's [production and value-added definitions](https://www.bea.gov/resources/methodologies/nipa-handbook/pdf/chapter-02.pdf) provide the accounting basis.

For an original illustrative example, final receipts of 100 and an AI fee of 8 give user value added of 92 when there are no other purchased inputs. If the domestic AI supplier has no purchased inputs in this simplified example, its value added is 8. GDP is 100, not 108 or 92. If it purchases domestic energy/services, their producers also enter the consolidation. Keep those payments inside the town or explicitly model imports and the external sector.

Separate three costs: recurring service usage, resources spent implementing adoption, and new durable equipment/software. Choose a simple convention for implementation. Training labor/service consumes current resources; a newly produced durable asset enters investment and depreciates. A setup payment cannot simultaneously be expensed as a nonproductive cash disappearance, counted as new investment and added again to the capital stock. If training or own-account software is deliberately simplified, disclose how.

Keep the productive stock in quantities: `Kₜ₊₁ = (1−δ)Kₜ + delivered new equipment units`. Spending buys `I_nominal/p_equipment` units only if those units are produced and delivered. Finite cash or limited equipment output can stop expansion. Supplier compute also needs an inherited stock or financed additions and replacement. A fee transfer is not itself a new server.

Exogenous technical progress is a legitimate assumption; it is not evidence of costless real-world implementation. State which ability arrives from outside the model's innovation process, which resources implementation uses and which inherited assets already exist. Acemoglu's [task-based AI analysis](https://economics.mit.edu/sites/default/files/2024-10/The%20Simple%20Macroeconomics%20of%20AI.pdf) distinguishes task cost savings, exposure and capital accumulation; this experiment does not import its numerical macro forecast.

## Entry, acquisition and concentration

An entrant needs financing from an existing owner or an explicit loan, workers from the town's labor pool, and productive assets. Entry cannot create free cash, machines or workers. Buying existing equipment moves it between firms; producing new equipment adds to aggregate capital. Acquisition must transfer the target's assets, cash, liabilities and ownership once, close the old operating identity, and retain the seller's proceeds. Do not destroy money or duplicate productive capacity on merger.

Buying existing equity or assets is not new production merely because the transaction is called investment. Newly produced deal/integration services can be output if modeled, but the acquisition price itself is not GDP. OECD's [investment chapter](https://www.oecd.org/en/publications/oecd-economic-outlook-volume-2025-issue-1_83363382-en/full-report/reigniting-investment-for-more-resilient-growth_99b36090.html) specifically distinguishes acquisition of existing capital from expansion of the aggregate capital stock.

A merger need not improve productivity automatically. If it brings a better technology, shared fixed cost or higher markup, implement that named mechanism and its costs. Keep an otherwise identical no-synergy control. If markup is mechanically increased by concentration, a subsequent markup rise is imposed by that rule, not independently discovered market power. Report both operating firms and ultimate ownership; ten operating labels can still have one owner.

## Scenario draws and useful negative cases

The distributions describe outcomes **under invented input distributions**, not real-world probabilities or confidence intervals about AI. Save seeds, parameter ranges, dependence assumptions, horizon and outcome definitions. Pair demand/technology draws across policies; preferably key shocks by seed, firm and round so entry or exit does not shift every subsequent random draw.

Report mean, median and material quantiles at the same declared horizon, plus the fraction of these simulated runs below their paired no-adoption baseline. Separate draw-to-draw variation from deliberate changes in model assumptions. A pointwise median trajectory need not be one realizable economy; use an actual seed for an illustrated path and explain how it was selected. Do not select only attractive runs. Stopped/failed simulations must remain visible and must not be silently dropped or extended with invented GDP.

A small discriminating set is enough: no adoption; modest useful assistance; stronger labor displacement with weak demand; high supplier fees or low realized gains; slow adjustment versus fast adjustment; and finite capital/supplier capacity. Add entry/acquisition only if their accounting survives the first run. Useful surprises include private savings with lower aggregate sales, higher real output with lower nominal receipts, more supplier profit without better worker consumption, and expansion blocked by investment or liquidity. These are hypotheses to test, not promised results.

Before interpreting outputs, reconcile money, goods, capital and labor after every event. In particular, final spending must equal aggregate value added, budgets must fund purchases, domestic supplier fees must cancel once, used assets must not become new capital, and employment must not exceed the declared labor endowment. Then inspect representative negative paths as well as summary distributions. Tests establish consistency; they do not establish forecasting validity.

AI assistance: OpenAI GPT-6.1 Sol, Ultra, 11 October 2026; targeted primary-source reading, original model options and design critique. No private data, authenticated service or paid research API run. Proposed equations and rules are author assumptions; this note does not certify an implementation that has not yet been reviewed.
