# Independent review: gradual adoption and competing firms

Independent review, 11 October 2026. The experiment is an uncalibrated, seeded toy model. This review owns no simulation code. Model outcomes are conditional calculations, not forecasts or probabilities about a real economy. The initial observations below are historical. The implementation and saved results have subsequently been checked as described in the final audit section; the source snapshot below identifies the exact reviewed artifacts.

**Current verdict:** no blocking accounting or causal implementation defect remains in the reviewed core, saved experiments, paired summaries, bounded entry/acquisition exercise or finite-grid analysis. The final paper and model specification preserve their important limitations. This is a review of the declared toy models, not empirical validation or visual/publication approval. Earlier bugs below are retained as the historical review trail.

## Minimal design before the first run

Start with a small observable loop: productivity changes required labor; a labor rule determines hours and pay; costs influence prices; customers allocate expenditure; realized sales determine next-period income and decisions. Do not delay the first end-to-end run for a more elaborate optimizer. Additional mechanisms earn their place by changing an observed result or resolving an observed defect.

The smallest useful paired comparison holds all opening balances, technologies, exogenous shocks and spending propensities fixed, changing only adoption. A separate change in spending or wage policy is a separate closure comparison. Changes in outcomes then have a named cause instead of a bundle of simultaneous interventions.

### Labor and production

- Define output units and required paid labor per unit. A movement from 10 to 8 to 6 units of required labor is a productivity assumption: the same output needs less labor. It is not by itself an employment, wage or income prediction.
- Report people employed, total hours, hourly pay and aggregate payroll separately. If the model uses divisible worker equivalents, label them as such rather than implying discrete people.
- Separate at least two labor rules: fixed hourly pay with fewer paid hours; and fewer hours with preserved payroll. If retained employment means spare time rather than lower hours, show unused labor capacity rather than count it as productive work.
- Price reductions need a declared cost-pass-through rule. Productivity gains and customer demand are different: unsold capacity is not realized output, and extra purchases require income/cash or lower prices.

### Competition and accounting

- Give each comparable pair a clearly defined product market. A customer demand rule must say whether it allocates physical quantities or expenditure. Revenue share and quantity share differ whenever prices differ.
- Quantity sold may not exceed capacity. If customers can redirect orders from a capacity-constrained supplier, perform that redistribution explicitly; otherwise label unsatisfied demand. Two identical firms must split demand symmetrically when random taste advantages are disabled.
- Calculate GDP from final purchases, and independently reconcile it to total domestic value added. An AI fee is intermediate spending by an adopter and revenue for the domestic provider. Neither subtracting the fee from the whole economy nor adding it on top of final sales is valid.
- Provider wages, other intermediate costs, retained cash and dividends need explicit destinations. A zero-real-cost AI service is a bounded technology assumption; provider profit is not an independently created source of spending power.
- Entry setup may buy a newly produced service or capital good; identify which, the recipient, and the capacity effect. An ownership acquisition is a financial transfer. Buying an existing firm may change ownership and later decisions, but its purchase price does not add GDP or new productive capacity.
- If entry adds productive capacity without a modeled resource cost, call this an exogenous capacity grant. Do not narrate it as evidence that AI profits alone financed physical expansion.

### Timing, stochastic design and interpretation

- Specify the period order and information set for choices. A firm can react to current posted prices if allowed, but may not choose adoption based on shocks or rival actions it cannot yet observe.
- Use paired seeds and stable shock channels indexed by period and firm. A treatment that triggers an extra entry event must not change all subsequent unrelated draws.
- Keep random technology/adoption delays, demand tastes and forecast errors distinguishable. More runs reduce simulation sampling error; they do not validate the assumed shock distributions.
- Compare a common calendar horizon and a common post-adoption window. Gradual adoption retains payroll longer under the wage-cutting rule by construction; distinguish that direct effect from a feedback benefit.
- Show nominal GDP, base-price final output, household consumption by recipient group, work hours, cash balances, price levels, profits and market shares. An aggregate price index or unchanged nominal GDP cannot substitute for the actual base-price output calculation when relative prices differ.
- Consumption and leisure are separate welfare-relevant outcomes. Do not rank welfare or use a single household aggregate to conceal lost access by former workers without an explicit, disclosed welfare convention.
- Fee or adoption thresholds are boundaries within the chosen rule set. An optimizing provider selects from a declared action space and objective; it is not proof of a general monopoly optimum.

## Required focused checks after the baseline

1. Replay monetary transfers: account sums unchanged for a closed fixed-money model; no silent overdrafts; all paid fees, wages and acquisitions have counterparties.
2. Reconcile expenditure GDP to value-added GDP and all physical sales to capacity. Compare GDP with and without an acquisition at otherwise identical production.
3. Disable shocks and adoption: identical pairs remain identical and the opening reference case behaves as declared.
4. Zero adoption must match the no-adoption control under identical closures; zero fees, prohibitive fees and a provider unable to acquire probe boundaries.
5. Keep technology fixed while changing labor/pay policy to isolate distribution; keep payroll fixed while changing technology to isolate price/capacity effects.
6. Reproduce saved outputs exactly from a seed, and inspect paired differences rather than subtracting unmatched percentile summaries.
7. Perturb the dominant arbitrary rules—spending from income/wealth, pass-through, demand responsiveness, provider payout/entry, and capacity—to distinguish a robust conditional mechanism from a chosen numerical example.

## Review record

- Pre-implementation review: read repository instructions, data policy, research standards, experiment constraints, existing model specification and previous shock-design review. No paid or authenticated source was accessed. No existing model, paper or output was edited.
- AI assistance: independent Astra reviewer, inherited user-selected reasoning setting, 11 October 2026. Initial analysis is original model critique; empirical grounding is assigned separately and must cite primary sources.

## First runnable slice: independent observations

Early `adoption.py`, 11 October 2026 by 20:46 UTC; active implementation, not final qualification. The model now uses two competing consumer producers plus an automated AI provider and an automated equipment producer. This deliberately changes the older ten-firm input-output topology. A standard-library computation through the existing `.venv` reproduced the baseline for 80 periods: nominal GDP 100, base-price GDP 100, consumption80, investment20, wages60 and money200.

With both firms adopting 40% task automation at period2, the protected-salary/redeployment case settles at nominal GDP 100 and base-price GDP110.909091. The hourly-pay/take-time case settles at nominal GDP76 and base-price GDP83.636364. These are conditional outputs, not empirical estimates. All tested completed periods reconcile domestic value added to final expenditure and conserve money within about `2e-13`. Actual labor used never exceeded contracted hours in these probes.

Two concrete implementation defects were raised immediately:

- **AI rationing affected a non-adopter.** With zero AI-service capacity and only firm A adopting 40%, both firms' consumption output became zero. AI scarcity must constrain users of the scarce service, then redirect affordable demand where the declared allocation rule permits. Root had independently identified this bug.
- **Capital followed an equal split rather than actual purchases.** At investment target80, opening owner cash0, opening firm cash400, zero AI fee, expenditure-price responsiveness10, and firm A adopting 80% at period1, period5 purchases are20.16718297 and19.83281703, while both receive20 of new capital. Unless explicitly modeled as a capital transfer, each firm must receive the equipment it buys. The implementer received this reproducer.

A high-fee probe stops with wage arrears despite initially increased nominal GDP; rising prices and nominal sales are not evidence of higher real output or household welfare. A full-automation/layoffs probe converges toward nominal GDP40 and base-price GDP48.571429 under fixed investment20 and owner spending propensity.5. This is a useful closure-specific comparison rather than a general full-automation limit.

The accounting output currently distinguishes wages paid from contracted wages at firm level. Aggregate wages/value-added income use accrued obligations. Any presentation of a stopped run must preserve this distinction; cash received cannot be inferred from the aggregate accrued-income total. Distribution summaries must retain stopped seeds and state the terminal horizon actually reached.

A third boundary artifact was found separately: `take_time` implies labor capacity40 for every automation fraction below1, but the full-automation special case sets it to infinity. At salary protection, zero AI fee and ample AI capacity, moving from99.9999% to100% automation therefore raises first-period base-price GDP from100 to145 (prices1 to.64), although the stated take-time rule should preserve the reference production scale. This is a discontinuity from the special case, not evidence of a large final-task payoff. The implementer received the exact one-period reproducer and must either preserve the rule at the boundary or declare a separate full-automation regime.

For the planned acquisition extension, note that a single pooled owner household ultimately owns every firm. An AI-provider acquisition therefore changes corporate control within the same ultimate owner group. Its payment changes cash locations; any production effect must follow from a declared subsequent technology, capacity or pricing rule. It does not by itself redistribute ownership to workers or create new productive assets.

## Final core and result audit

The expanded engine was independently examined after its feature freeze. It now has ten separate worker accounts; pooled consumption no longer hides dismissed workers' access. All three early defects above were fixed, as was the economic reviewer's reported bonus payment to a zero-worker roster. This review did not edit any simulation code.

### Independent calculations and execution

A direct import through the existing Python environment covered **85 runs and 3,171 periods**: all 37 named cases plus 48 edge combinations across three pay contracts, two capacity-use rules, automation0/.2/.999999/1 and fees0/9. Every transfer was replayed from its opening account balances. Checks covered funding, closing balances, domestic value added, accrued income, each worker's received income and consumption, paid roster wages, hours, equipment deliveries and the shared AI bound. No discrepancy was found. Maximum aggregate money error was `2.9e-12`; maximum value-added error was `1.5e-14`.

Targeted counterexamples confirmed:

- At zero AI-service capacity, an adopter produces0 while the non-adopter retains output 40.
- Take-time output is continuous at complete automation: the earlier .999999/1 example now gives real GDP 100 in both cases.
- Capital additions equal each firm's actual equipment purchase, including asymmetric financing.
- No employee bonus is paid to an empty layoff roster.
- Swapping the two firms and their available technology paths leaves all relabeled quantities identical.
- Smooth and rotating half-time duty generate identical aggregate GDP throughout the matched run. Individual wage receipts and consumption differ across rounds; constant workload is shared equally over a five-round cycle. These are individual duty rotations, not a business opening only on alternating days.
- Fixed per-firm random channels reproduce exactly when the other firm is omitted; this was directly checked for 20 seeds.

The private forecasts were also recalculated without calling their helper. For a protected-salary firm considering20% automation, its normal labor capacity becomes50, the quoted price is.94, and unilateral demand against the rival's price1 buys45.18283233 units. The predicted operating surplus is9.08314997 after the AI fee and wage30, below the old10. Under hourly pay/take-time, output capacity stays40, revenue37.6 minus wage24 minus AI bill3 gives10.6. Thus the first hourly gain is a cost saving after pass-through, not an initial increase in its quantity market share. Both calculations match the recorded decisions.

At the later40% hourly endpoint, nominal GDP76, base-price GDP83.63636364, worker baskets40.90909091 and each consumer firm's surplus5.22727273 match the narrative. This is the outcome of the bounded forecast, current payroll response and income-spending closure. It does not establish a full-horizon optimum or a Nash equilibrium. The small-step layoff sensitivity further shows how integer staffing and the allowed action set can prevent adoption that a larger step accepts; this is a decision-rule threshold, not a measured market tipping point.

### Saved stochastic results

The reviewed main output contains **37 named paths,192 sensitivity cases and6,000 timing runs**:1,000 seeds under each of six rules. All seed IDs0–999 are present once per rule. Completion/stop counts reconcile. Saved means and interpolated P05/median/P95 values were recalculated independently. **51 selected runs**—fixed test seeds, representative completed seeds and stopped examples—were rerun; every saved summary field reproduced exactly.

| Timing rule | Complete80 rounds | Stop with unpaid obligations |
| --- | ---: | ---: |
| Bounded choice, protected salaries | 1,000 | 0 |
| Bounded choice, hourly/reference labor | 942 | 58 |
| Scheduled adoption, protected salaries | 14 | 986 |
| Scheduled adoption, hourly/reference labor | 942 | 58 |
| Scheduled hourly adoption with shared dividends | 1,000 | 0 |
| Bounded choice with sales-responsive labor | 1,000 | 0 |

These frequencies are outcomes of invented timing draws and declared rules. The protected scheduled survivor distribution describes only 14 of 1,000 paths and must never be presented as the typical outcome of all runs. Stopping marks an unresolved financing event; it is neither an observed future zero GDP nor a reason to delete the seed.

Independent paired calculations find942 common completed seeds for both requested policy comparisons. Shared versus unshared hourly adoption increases terminal worker baskets by 54.31578947 within that common group, and prevents58 payment stops in this particular sample. Responsive versus fixed reference labor reduces terminal worker baskets by about 8.49181366 on average among the942 common survivors, while also preventing 58 stops. Business continuation and household consumption are distinct outcomes. These are differences computed per matched seed, not differences between unmatched survivor medians.

### Conditional findings and remaining limits

- The supported statement is that the same assumed task technology can change output, wages, working time and consumption differently under different contracts and spending rules. GDP is not household welfare; the model contains no optimized utility function.
- The fully automated shared-ownership example reaches nominal GDP96.4, real GDP129.14285714 and worker baskets82.62857143. Its precise endpoint is cash-distribution dependent: owners have38.56, finance20 of equipment, then can spend only18.56 despite desired consumption19.28. Workers retain3.6 of old aggregate cash which the income-only spending rule does not release. The exact96.4 is not a universal stationary benchmark.
- Prices are cost-based posted quotes and demand allocation is a specified expenditure-share rule. A fee sensitivity is not strategic monopoly optimization. The AI and equipment providers' automated infrastructure is inherited and maintained without separately modeled resource costs.
- Private choice maximizes a one-step operating-surplus comparison before employee profit bonuses and dividend allocation. It cannot establish optimal owner behavior with every action, forecast or financing arrangement available. Exit and restart are absent; the zero-sales labor rule has no restart floor.
- The final stopped record uses accrued wages and AI invoices alongside cash paid. There is no subsequent arrears recovery or restructuring model. “No bank lending or overdrafts” is more precise than a blanket statement that deferred payment obligations never exist.
- Provider-funded entry and acquisition were subsequently implemented and independently tested in the separate controlled exercise reviewed below. They are not integrated into the income-feedback or strategic-adoption engine. A strategic provider markup search and a combined bank/adoption engine remain unimplemented. Earlier banking results remain a distinct model.

No remaining accounting or causal implementation defect was identified in the reviewed named cases and selected stochastic runs. A subsequently reported near-full-automation roster-rounding defect was also fixed and independently rechecked across eight combinations: reference/sales-responsive labor, take-time/redeployment and automation1−1e−11/exactly1. Positive required hours always have a recipient; cash wages match the payment ledger exactly; complete automation retains zero layoff headcount and zero wages. The review does not certify empirical realism, a global maximum, publication readiness or final visual rendering.

The separate paired-analysis file was subsequently checked against the saved seed records. Its four comparisons use **cumulative 80-round** real GDP and worker consumption, rather than the terminal differences above. Recomputed means and P05/median/P95 values match. The shared-hourly comparison has mean cumulative worker gain 3701.70993419 baskets on 942 common completed seeds; the responsive-labor comparison has mean cumulative worker difference −495.60550721 baskets. The other two comparisons likewise reconcile. The grid's 119 completed and 73 stopped cases reconcile, and both reported maxima select the correct source row. The highest completed grid endpoint is real GDP 134.28571429 at the particular free-AI/full-pass-through/protected-pay40% point. This is a maximum over the 192 specified points, not over all parameter values or paths. Metric names must retain the cumulative-versus-terminal distinction.


## Separate entry and acquisition review

The later controlled `adoption_structure.py` experiment was reviewed independently. It fixes household consumption budgets and incumbent prices while protecting incumbent pay, subject to actual cash and physical resources. It is suitable for isolating purchases of existing ownership from purchases of newly produced equipment. It is not an endogenous acquisition valuation, entry equilibrium or proof that a supplier's retained AI fees finance optimal expansion.

Independent payment and physical checks covered **51 runs and 1,525 periods**: the 14 saved named paths, 18 declared sensitivities and 19 additional boundaries for financing, complete depreciation, unavailable AI and acquisition prices of 0, 25 and 25.000001. All 14 saved named paths reproduced period by period. Cash replay, operating versus financial receipts, value added, accrued surplus, labor, equipment and AI capacity, replacement funding and capital delivery timing reconcile. Maximum money error is `1.8e-12`; value-added error is zero in these runs.

The matched controls establish the narrow causal distinctions:

- Buying existing equity for 20 leaves nominal and real GDP at 100. The buyer's cash falls and the selling owner's cash rises; the provider records equity at purchase cost. Asset-sale receipts are kept separate from the owner's operating income.
- Acquisition without a technology change reproduces the control's physical production and labor exactly. Acquisition followed by 40% automation reproduces automation without acquisition: GDP stays 100 and productive human shifts fall from 10 to 8. Ownership transfer is not itself the productivity gain.
- Subsidiary dividends are financial income to the parent, excluded from parent operating revenue and value added. Passing this cash onward to the pooled owner household does not count it twice as GDP.
- Entry buys 20 of newly produced equipment, raising investment to 40 and GDP to 120 in the purchase round. The new consumer operation produces nothing until the next round. Default later sales are 30, 30 and 20 baskets: consumption stays 80, while GDP rises to 102 because maintaining the extra equipment requires 2 of replacement investment. This is not a gain of two consumption baskets.
- A cheaper entrant at price .7 delivers real GDP 108 with nominal GDP 102; a price of 1.1 eventually produces incumbent wage arrears in round 31. Protected payrolls and finite firm buffers are part of that outcome.
- Complete-entry orders above cash or equipment capacity are refused without partial asset creation or borrowing. When AI is unavailable, new equipment can still be purchased but cannot produce consumer output; unfunded replacement eventually erodes it. An increase in investment GDP does not by itself establish useful capacity or welfare.

The provider initially holds 25 of inherited cash, which funds these purchases before it earns the modeled automation fees. This tests cash-funded provider expansion, not accumulation of AI profits followed by strategic reinvestment. All ultimate business dividends still belong to one owner household. No current-owner wealth valuation, takeover bargaining, distinct entrant shareholders or post-default resolution is modeled. The fixed-budget closure intentionally prevents the main model's wage-income feedback from being attributed to the legal form of the purchase.

The reporting issue was corrected: structure and main summaries now use `recorded_periods` and `last_recorded_period`, since the final row may include a payment failure. The separate `completed_horizon` flag is false when a structure run stops.

The final structure records also report depreciation, net investment and net domestic product. All 14 final named paths were replayed after those additions, covering 284 periods. Each reconciles `NDP = GDP − depreciation = consumption + net investment`. Default operating entry therefore has GDP 102 but NDP 80, matching unchanged consumer output and zero net investment after installation.

## Fine adoption grid review

The separate frontier file contains 10 profiles and 1,010 assigned-adoption points. Completion counts and reported maxima were recalculated from the stored rows. Another 65 paths at maxima and neighboring points were replayed; outputs and stop reasons match. The file correctly distinguishes completed-horizon maxima, adjacent-grid peaks, survival edges and a last-ten-round buffer diagnostic.

The default protected-pay profile peaks at 50% task automation with real GDP 114.11764706. **Actual AI utilization there is only 58.8%.** The turning point comes from the normal-capacity pricing rule changing at the assumed AI quota boundary, not from current production exhausting the physical AI supply. Higher quoted unit costs can raise prices while actual resource utilization remains below capacity. This is a pricing-and-capacity-rule result, not proof of an optimal physical automation percentage.

With more AI capacity and a fee of 3, the largest completed 80-round endpoint occurs at 58% automation, but firms are still drawing down their buffers. Requiring no negative consumer surplus or buffer draw over the final ten rounds instead selects 55%. That filter is a useful warning signal, not proof of stationary sustainability. With free AI and ample capacity, automation from 60% to 100% produces a flat maximum of real GDP 145 under the declared rules. The differing endpoints reinforce that the grid does not reveal one universal optimum.


The added static physical envelope was independently derived: with ten retained human task-shifts and eight baskets per completed task-shift, `Q ≤ min(total consumer capital, 8 × (10 + AI task capacity))`. The default inherited stocks give Q ≤ 160, attained physically only at a 50% AI task share. With AI capacity 25, consumer capital limits Q to 200 and task shares from 60% through 100% can attain that static envelope. These bounds permit the task share to vary, ignore demand and financial feasibility, and keep the inherited capital fixed. Adding the conditional 20 equipment deliveries gives corresponding gross-output bounds of 180 and 220; neither is a sustainable market-equilibrium or welfare maximum.

The final article and model specification were read after these additions. They distinguish scheduled versus privately selected adoption, the distribution of individual pay, income-only spending, survivor conditioning, existing-equity transfers versus produced capital, and physical room versus purchases. No blocking wording claim was identified. Source-grounding and rendered-figure review remain separately owned workstreams.

The frontier note’s analytical price branches and operating-surplus threshold were checked. Its three longer probes were independently reproduced: 55% adoption completes 120 requested rounds; 58% stops with wage arrears in round 90; 59% stops in round 66. The two malformed reproduction commands were corrected before the source snapshot.

## Final reviewed snapshot

Snapshot captured on 11 October 2026 after the source and output refresh. All embedded generator/model hashes match their files, and the paired-analysis input hash matches the main results. This snapshot covers the article’s numerical and causal statements; it does not certify the rendered figures or browser presentation. Material changes to these inputs require a refreshed review.

| Artifact | SHA-256 |
| --- | --- |
| `src/toy_economy/adoption.py` | `5b9cc8e9754c8040f2a8cc8b9fdbf1ba3f2eb1d51422fd32d431878c6922534b` |
| `src/toy_economy/adoption_engine.py` | `11b367d60381a84869b221cb1fed57196911b8d07a5da55a5e50a554f6e1921a` |
| `src/toy_economy/adoption_decisions.py` | `5aa62aab5c6dc1d1a491256bbb421b7f4ab0de414e22c56da62cedee07b16a76` |
| `src/toy_economy/adoption_experiments.py` | `049975c18a505a377cc27dff9fa60cbe88e38972eb24cc24b4eacff00ef68d48` |
| `src/toy_economy/adoption_analysis.py` | `10c4b4d039480543480acc3528f2e7aa5cebc9caf3ef75c3bba7cb3155d824b4` |
| `scripts/run_adoption.py` | `b2a61c77788e77139a4d883fbfdd9028f917cd803f07ec8c8a83e52eca77648e` |
| `scripts/analyze_adoption.py` | `7700feb17a0910bdc48351d389a84df915508e192fd73131b9236a594b0c20d4` |
| `src/toy_economy/adoption_structure.py` | `4618053ee32c58c84841c41c4c601fd28ccebdca8b7cdc4c10d5d2f4d2b3bf70` |
| `scripts/run_adoption_structure.py` | `1535e029c353ee9aa48bc2db7835119e721b8f19428efe7e2cfc1ef9cdb16e8c` |
| `scripts/run_adoption_frontier.py` | `a008818479a68dca7ed7142200b8148e26b14638449f86edfd628d67b3593f1c` |
| `outputs/adoption/results.json` | `a4a648dfd71d642f6ed1a055300ae56506d6983fe8d630a4ddf5a8de346df27b` |
| `outputs/adoption/analysis.json` | `f135be9322e479ce745e0a2882364b7e007fa36324b8380c2686d8adfa641045` |
| `outputs/adoption/structure.json` | `baf9ff0ab44f84242d696d5abf4a45f168d27f68dbe16771964ccaff7816f3a0` |
| `outputs/adoption/frontier.json` | `f76b823d22ae8fe8c1b567bc784e4d29df4a55336570f4702a6136168dfc8bb7` |
| `research/adoption-model.md` | `b66759144a648b51b66620ede65f1be7e62d6f1b5a1f4557de0a06f9c84dae8e` |
| `research/adoption-structure.md` | `bcc03ce8630a4848e181a379db5078127fabe5168608d7b39a4b879f9f0adb4e` |
| `research/adoption-frontier.md` | `2cefeaacc6e8f035c55ce095d50f402114b49e03a9d103e11062f81a2f1ca37a` |
| `articles/04-ai-arrives-one-shop-at-a-time.md` | `bc7ba2cbe93e45fd7c3834b0abcd665af4129e512f820bc2657ecc3eaba52cf3` |
