# Buying a shop versus opening a production line

This is a separate controlled payment experiment, not an addition to the main adoption engine or an optimized takeover/entry game. It executes two examples that the main relative-price model does not: the AI provider buys an existing shop, or opens a consumer production line after paying for newly produced equipment. All numbers are invented. The new source, tests and outputs leave the earlier engines unchanged.

Reproduce from the study directory:

```sh
PYTHONPATH=src .venv/bin/python scripts/run_adoption_structure.py
PYTHONPATH=src .venv/bin/python -m unittest discover -s tests -p test_adoption_structure.py
```

The generator saves fourteen named paths and eighteen sensitivity summaries in [`outputs/adoption/structure.json`](../outputs/adoption/structure.json). Its `teaching_rows` selects actual recorded rounds. Every payment is retained. `recorded_periods` includes a failing round; `completed_horizon` distinguishes survival through the requested horizon from a stop.

## What is held fixed

The opening money is the same 200: ten worker accounts with 6 each, owners 40, and four firms with 25 each. Workers request consumption 6 each and owners 20 each round, limited by cash. These are **fixed spending budgets**, not the main model's lagged-income spending response. Additional income can therefore remain in the owner's account. Incumbent prices remain 1; entry-price sensitivities are explicit. This isolates asset purchases and subsequent production rather than claiming to forecast demand or optimal pricing.

The two incumbents protect thirty coins of wages each, even when actual work falls. Their 100 units of equipment depreciate 10% and receive ten replacement units each round. Owners finance those twenty units before consumption. All accounts remain within the one conserved money stock; there is no new credit, external money, or implicit overdraft.

The AI provider already has 25 of inherited cash. The experiment tests purchases funded from those existing reserves, **not whether retaining earned AI fees would optimally finance expansion**. Its inherited finite AI infrastructure performs at most ten task-shifts per round. Equipment production has capacity 40. Both suppliers' operating resources are simplified as in the main model.

## The recorded comparison

| Intervention and recorded round | Consumer spending | New equipment | GDP | Net domestic product | Actual human shifts |
| --- | ---: | ---: | ---: | ---: | ---: |
| Control, any round |80|20|100|80|10|
| Buy existing shop, round 5 |80|20|100|80|10|
| Open new line: installation round 5 |80|40|120|100|10|
| New line first sells, round 6 |80|22|102|80|7.5|
| Acquired shop automates 40%, round 10 |80|20|100|80|8|

**Acquisition.** In round 5, the provider pays 20 from its 25 cash to the owners for existing consumer-A equity. The provider records a purchase-cost equity claim 20 and receives A's subsequent dividends. The sale proceeds are a financial transfer, excluded from operating income and GDP. Owners' cash becomes 60 and provider cash 5; total money remains 200. Without a technology or operating-policy change, production, prices, wages, consumption, GDP and operating income reproduce the control exactly. The event is funded, but its price is assumed rather than valued.

**Funded market entry.** The provider instead pays 20 to the equipment producer for a new consumer line. This produced equipment enters investment GDP. It is delivered after round 5 production and can first operate in round 6. The provider still has 5 cash. At equal consumer prices, the new line sells 20 baskets and the incumbents sell 30 each. It takes part of the same 80 customer budget; the experiment does not create additional buyers.

The new capital also wears out: two units each round. The provider pays for replacements from its existing cash before current sales, then distributes 18 of its 20 operating surplus. Equipment production 22 distributes 22. Owner operating cash income remains 40, while aggregate gross surplus is 42. The two retained coins finance capital replacement. GDP 102 is consequently a **gross replacement-investment difference**, not an increase in consumer purchases: after subtracting depreciation 22, net domestic product remains 80. `capital_depreciation`, `net_investment` and `net_domestic_product` expose this distinction. The no-wear sensitivity removes those two replacement units and the ongoing GDP difference.

The installation and equity-purchase cases happen to finish round 5 with identical cash balances. Their GDP differs because one payment bought produced capital and the other bought an existing ownership claim. Cash movements alone do not identify national-accounting output.

## Ownership and technology are separate

The acquisition-then-automation path introduces 40% task automation in round 10. The shop continues paying 30 and selling 40; its actual human work falls from five shifts to three. A matched `automation_only` path introduces the same technology without a purchase and reproduces the same production results. Acquisition alone is not assigned a productivity benefit.

At that stage, A pays an AI invoice 6 and has operating surplus 4. Its 4 dividend passes to the provider; the provider's own operating value added is 6, and it passes the combined 10 cash to owners. The subsidiary dividend is a financial receipt, **not another six or four of GDP**. Provider self-use on its new consumer line consumes real AI task capacity without inventing a cash payment to itself.

Two full-automation comparators are also saved. They automate A's productive human tasks completely while retaining its protected 30 salary bill: aggregate actual human work falls to five shifts, not zero household income. With the declared fee 15 and revenue 40, A loses 5 per round. Its 25 buffer is exhausted and both the acquired and unacquired versions stop at round 15 with wage arrears 5. This is a boundary of protected payroll, the internal fee and restricted cross-firm financing. The provider distributes its receipts instead of rescuing A. It is not proof that a consolidated owner could not waive fees, retain cash or support the subsidiary, and no post-stop GDP is invented.

## Constraints and interpretation

An unfunded acquisition or installation is refused entirely; no partial purchase or free equipment appears. Capacity that cannot produce receives no invented sales. In the unavailable-AI entry stress, replacement orders eventually exceed provider cash, actual purchases fall short, and installed capital declines. In a separate price 1.1 entry stress, incumbents each receive 29 against protected wages 30; their buffers eventually fail at round 31. The record retains the two coins of unpaid wages and stops. Default equal-price entry does not have this payroll failure.

The four original legal firms remain; the provider's direct selling is market entry through a new business line. Final dividends still reach one pooled owner household, so an acquisition changes an intermediate corporate claim rather than establishing independent ultimate ownership. There is no entry optimization, strategic markup search, competition equilibrium, merger synergy, new worker hiring or bankruptcy resolution. The expenditure allocation is a declared rule for fixed budgets, not evidence that consumers optimize every purchase.

Fourteen targeted unit tests verify the exact no-synergy control, payment replay, money conservation, value-added consolidation, equity versus produced-asset treatment, next-round operation, depreciation, cash/capacity refusals and explicitly stopped payroll cases. The source and generator pass strict type checking and lint. Primary accounting context remains in the [adoption foundations](adoption-foundations.md); numerical evidence is the reproducible model output, not an empirical estimate of AI-provider expansion.
