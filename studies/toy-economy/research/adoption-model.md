# Gradual AI adoption: model specification

This is a separate four-firm experiment, not a recalibration of the earlier ten-firm input-output model. Its purpose is to distinguish technology, labor contracts, purchasing power, relative prices and the timing of adoption. All quantities and behavioral coefficients are invented. A round has no calendar duration. See the [protocol](adoption-protocol.md), [primary-source foundations](adoption-foundations.md), [source log](adoption-sources.md) and [experiment log](adoption-experiment-log.md).

## The starting town

Two consumer firms, A and B, each have five assigned worker households. Each full shift pays six coins and makes eight identical consumption baskets before AI. Every worker begins with six coins and lagged income of six. Owners form a separate pooled household with forty coins and lagged income of forty. A, B, the equipment producer and the AI provider each begin with twenty-five coins. Total money is two hundred; the base model has no bank lending or overdrafts.

Initially households buy eighty baskets at one coin each: workers buy sixty and owners twenty. Owners supply twenty coins of equipment financing. The equipment producer delivers twenty units at one coin each. Each consumer firm begins with one hundred units of productive equipment, loses ten to depreciation per round, and buys ten replacements. Initial labor capacity is forty baskets per shop, leaving spare equipment capacity. Each shop pays thirty in wages and earns ten of gross operating surplus. The equipment maker earns twenty. GDP is one hundred, wages sixty, aggregate gross surplus forty. This state reproduces exactly without shocks.

The equipment producer and AI provider are automated from the start. Their finite operating capacity is inherited and maintained without separately modeled power, intermediate inputs, depreciation or labor costs. This deliberate omission makes them simple domestic suppliers, not realistic data centers. Baseline consumer capital does depreciate. AI capability becomes available exogenously; no claim is made about the cost or success of inventing it. The model has no foreign sector, government, taxes, inventories or changing product quality.

## Technology is not an employment contract

For firm automation fraction a and delivered quantity q:

- Human productive shifts required: q × (1−a) / 8.
- AI task-shifts required: q × a / 8.
- Reference human shifts for the original forty baskets: 5 × (1−a).
- AI invoice: task-shifts used × the stated fee (default three coins).

A task performed by AI is not multiplied into output a second time. Output must fit human capacity, installed equipment, shared AI service capacity, paid customer orders and cash-financed purchases. Full automation handles a=1 explicitly without division by zero.

The default AI provider can perform ten task-shifts per round. At full automation this supports at most eighty baskets, even when consumer equipment could make more. The ample-AI sensitivity raises capacity to twenty-five. A maximum that vanishes when this bound changes is a conditional bottleneck, not a universal automation optimum.

**Capacity use** and **pay contract** are separate rules:

- `take_time` contracts the hours needed for the reference forty baskets, retaining that output limit even at complete automation.
- `redeploy` makes the retained headcount's full shifts available for more production, subject to other constraints.
- `salary_protected` retains five people and thirty coins of base compensation per shop, even when required work falls. At complete automation this is continued income support, not evidence that productive human work remains.
- `hourly_pay` retains five people but pays six coins per contracted full-shift equivalent. These are guaranteed contracted hours, not payment only for minutes used on actual orders.
- `layoffs` retains the integer ceiling of reference required shifts. The first retained workers in each shop's fixed roster receive the contracted wage bill; other workers receive no wage. This roster is an allocation convention, not a labor-market selection model.

`rotating` shifts, available for hourly take-time contracts, allocate the same total contracted hours to a cyclic roster: whole shifts first, with a fractional final shift allowed. At half-time a shop assigns two full shifts and one half-shift rather than five half-shifts. The roster advances each round, equalizing a constant workload across five rounds. This changes individual paycheck timing while preserving aggregate production capacity; it does not make the whole shop close every second round.

Each of the ten workers has a separate cash account, income and consumption record. With common spending propensities, spreading a wage reduction across ten people can have the same aggregate consumption as concentrating it on four dismissed people. The individual outcomes differ. The model does not infer welfare from aggregate GDP or from leisure without a utility function.

## Prices and customer orders

Consumer prices follow a declared cost pass-through rule. The initial labor cost is 0.75 coins per basket. The target quote is:

`max(0.05, 1 − pass_through × (0.75 − normal_labor_cost − AI_cost_per_basket))`.

Prices move part or all of the distance to this target each round. This preserves the initial absolute margin component; it is not a solved Bertrand equilibrium or a fully optimal price search. Labor cost uses contracted wages divided by normal feasible quantity. Resource-aware pricing uses equal task-hour quotas among adopters and reassigns unused quota when constructing normal feasible quantities; an explicitly optimistic sensitivity ignores that shared constraint when quoting. Realized sales may still fall short of normal quantity, so a quoted cost saving does not guarantee a profit gain.

Households divide a fixed affordable spending budget between the shops using expenditure weights proportional to price raised to minus the chosen elasticity. Quantities equal spending divided by price. Unfilled orders are redirected where other capacity is available. AI rationing constrains only businesses that need the service; a business using no AI is not shut down by a scarce AI input. Identical household preferences make the aggregate allocation reproducible from the individual cash budgets. The demand elasticity parameter is an expenditure-share rule, not an independently estimated real-world quantity elasticity.

## Bounded private choice and the rival's response

`scheduled` implements the declared automation path directly, including unprofitable choices. `bounded_myopic` treats the same shocks as the maximum technology available. Each firm compares keeping its current stage with moving up by at most the specified step. It forecasts its own operating surplus using the cash-financeable consumption budget, its inherited rival's technology and posted price, physical capacity and AI fees. Both firms decide against the same inherited state before either choice takes effect. The recorded decision includes both predicted surpluses, quantities, prices and the reason for acceptance or rejection.

The comparison is operating surplus before employee bonuses and dividend allocation. The default hurdle is zero: adopt if predicted surplus increases. Adoption is irreversible within this choice rule. The action set does not include every price, closing, an acquisition, financing innovation or a multi-period shareholder-value objective. In particular, improving a negative operating surplus can still look attractive within this restricted action set. Future wage-income feedback is not forecast. Decisions are decentralized operating-unit choices even though the ultimate owners pool their receipts; they do not maximize the pooled owner household’s combined income. Whole-job thresholds also matter: a layoff-contract firm offered only a 10% next step can reject it, while a 20% step can pass. A rejection within a restricted step size is not proof that every larger installation would be unattractive. A unilateral forecast can therefore differ from the outcome when both firms adopt and customers' budgets subsequently change.

The optional `lagged_sales` labor rule plans output from the firm's previous quantity times a stated buffer (default1.1). Planned labor never exceeds the original five-person endowment. Hourly contracts and layoff rosters can then shrink when a rival loses sales; protected salary contracts continue to pay30. This is an explicit adjustment rule, not an estimated labor demand curve. If previous sales reach zero, this rule does not restart the business without another mechanism. Successful continuation through80rounds is not a welfare ranking.

## Payments, investment and income

The engine records every transfer with payer, recipient, period and purpose. Existing owners finance equipment first, within their cash balance. Shops may supplement this from their own existing cash. Equipment production is finite. Actual equipment deliveries add to the purchasing shop's capital after current production; purchases are not silently split equally if payments differ.

Workers and owners consume from lagged cash income, limited by their individual opening cash after earlier payments. Income earned late in this round supports consumption next round. Households do not deliberately spend down accumulated wealth: with zero lagged income, their spending falls to zero even if small cash balances remain. This is a behavioral assumption, not a claim that those balances become inaccessible. Shops receive consumption payments, pay AI invoices and wages, then distribute positive available surplus. The supplier and equipment producer distribute their received income. Loss-making firms use their own buffers; their losses do not automatically claw back profits distributed by other firms. Consequently total cash dividends can differ from aggregate accrued gross surplus in a loss-making round.

`fixed` equipment demand requests twenty each round. `sales_responsive` requests a chosen share of last round's nominal GDP (default one fifth). Both share the same initial baseline. Neither is a proven optimal investment policy. Without equipment orders or new consumption, productivity alone does not create a buyer.

Gifted dividend rights can allocate a fixed share of cash dividends from all four firms to the ten worker households, including former workers. Rights may begin in a specified round. Original owners still fund equipment equity. This is a fixed distribution convention, not an equity market with purchases, dilution and proportional co-investment. A separate productivity wage bonus applies only to employed workers and is not a substitute for broad dividend rights.

A run stops when a contracted wage or AI invoice cannot be paid. The stopped record retains the unpaid obligation and all cash flows. This identifies a financing boundary. It does not solve bankruptcy, debt restructuring, replacement entry or what GDP would be afterward; no zero-valued future output is invented. Report the last recorded round (including its payment failure) and horizon completion separately. The summary fields `recorded_periods` and `last_recorded_period` include that failing row; `stop_reason` distinguishes a payment boundary from completion.

## GDP and the physical economy

Nominal GDP = nominal household consumption + purchases of newly produced equipment. It also equals the shops' value added plus AI-provider and equipment-producer value added. AI fees are deducted at the shops and added at the provider exactly once. Wages and gross surplus reconcile on an accrual basis, while cash wages and arrears are separately observable.

Real GDP values consumption baskets and equipment quantities at their initial prices of one. It is not nominal GDP divided by one shop's price. Consumer goods and equipment remain distinct. Baskets bought by worker households are often the clearest outcome for this question; equipment-heavy GDP does not demonstrate broad access to consumption.

An acquisition of existing shares or equipment would be a financial/ownership transfer, not new GDP. More operating-company labels do not establish independent ultimate ownership: the default owner household already holds every firm's dividends. Corporate-control extensions must name the changed technology, decision rule, markup or distribution channel rather than attributing output to the transfer itself.

## A useful stationary cross-check

Suppose all profits are distributed, there are no operating losses, workers consume all income, supply and cash are nonbinding, equipment purchases are fixed at I, workers receive wage W plus gifted profit share s, and owners consume fraction c of their remaining profit. Then:

`GDP = W + I / [(1−s)(1−c)]`, for s<1 and c<1.

At s=0, c=0.5 and I=20, nominal GDP is W+40. W60 gives100; W36 gives76; W0 gives40. This is a check on the symmetric unconstrained cases, not a universal GDP identity. At s=0.6, W0 it suggests100, but this target can be infeasible because of physical capacity or payment timing. Owner equipment financing can also bind before owner consumption. At s=1 or c=1 the formula does not provide a finite stationary solution with positive I; the cash simulation must be inspected directly.

## Schedules, uncertainty and the comparison boundary

Deterministic schedules hold the starting accounts fixed and change named rules or adoption timing. Resource-stock sensitivities that intentionally change initial equipment are labeled separately. A modest common ramp makes 20% of tasks automatable in round5 and40% in round10; a full ramp adds60%,80%,100% in rounds15,20,25.

The stochastic experiment uses discrete, independent firm-specific opportunities after round5. Each opportunity unlocks the next stage. These are illustrative Bernoulli draws, not Brownian motion fitted to data. Fixed integer seed channels preserve the same opportunity path when a policy changes or the other firm is removed. Parameter/behavior changes are separate from draw-to-draw uncertainty. Results include every seed, stopped-run counts and completed-horizon distributions. A survivor-only median is explicitly labeled; stopped cases are neither discarded nor assigned an invented endpoint. Selected example paths use actual recorded seeds.

The separate legacy ramp and banking scripts preserve continuity with the old ten-firm model. They do not introduce a hidden bank into this relative-price experiment. Their debt, repayment and default results live in their own files.

## Additional bounded experiments

The [fine automation grid](adoption-frontier.md) separates completed endpoints,
local grid peaks, continuing cash-buffer losses and an exact static physical
capacity envelope. None is an optimization over all prices, investment paths,
contracts or welfare.

The [funded entry/acquisition experiment](adoption-structure.md) is separate.
It holds household budgets and incumbent prices fixed to isolate existing equity
transfers from new equipment, subsequent technology changes and replacement.
It does not inherit the main experiment’s lagged-income consumption feedback
or solve strategic provider entry. Both record actual payment failures.

The earlier-engine continuity outputs are
[gradual displacement](../outputs/adoption/legacy-gradual.json) and
[gradual displacement with a bank](../outputs/adoption/legacy-gradual-banking.json).
