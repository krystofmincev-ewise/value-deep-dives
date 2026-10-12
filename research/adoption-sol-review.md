# Independent Sol review of the gradual-adoption experiment

11 October 2026. Independent executable and economic review, not empirical validation. The reviewer did not edit the main adoption engine or its case orchestration; the separate fine-grid frontier generator is this reviewer's work. The current verdict and exact artifact hashes appear in the final section. Earlier snapshots below document resolved defects and are explicitly historical. The final review includes bounded private choice, staffing/rotation, the main export and analysis, the frontier, and the article's conceptual treatment of entry/acquisition. It does not include rendered-browser quality assurance or certify a real-world forecast.

## Early executable findings

The first four-firm implementation reproduced the declared baseline for 40 rounds: consumption 80, investment 20, wages 60, gross surplus 40, nominal GDP 100 and base-price GDP 100. Every opening and closing cash balance remained unchanged, with total cash 200 and consumer capital 100 each.

Three implementation defects were reproduced and immediately sent to the implementer:

1. **Scarce AI restricted a non-user.** With one round, AI capacity 0.1, and only consumer A adopting 80%, A produced 1 unit and the non-adopting B produced 0.681472 despite B needing no AI and having capacity 40. The common scaling factor incorrectly rationed both producers. The corrected allocation must ration only AI users and redirect unfilled affordable orders to the non-user's spare capacity.
2. **Capital did not follow equipment deliveries.** With hourly pay/take-time, AI fee 1, equipment capacity 1, owner opening cash 0, worker spending propensity 0.5, owner propensity 1, and A adopting 50% immediately, round 1 equipment payments were 0.5586592178770952 for A and 0.4413407821229049 for B. Both nevertheless received 0.5 capital. Capital must increase by each firm's actual physical purchase at the declared equipment price 1.
3. **An empty workforce received an unrecorded bonus.** With layoffs, both firms fully automated immediately and productivity-bonus share 0.5, round 0 transferred 3 to the pooled workers' cash account but recorded total worker income 0. Round 1 consumption consequently ignored the payment. The implementer's chosen correction is an employed-only bonus of zero at zero headcount. The separate fixed worker dividend right reaches former workers and must be counted in their income.

The independent Astra review also identified a discontinuity at full automation under the take-time rule. Preserving reference output 40 at every task-automation level removes that special-case jump. This is a boundary correction, not a discovered economic benefit from the last automated task.

All three defects were independently rerun after correction. The scarce-AI reproducer now produces A 1/B 40; the empty-workforce reproducer pays zero employed-only bonus and records zero worker receipts; asymmetric equipment payments exactly match each firm's capital addition. The take-time endpoint also retains capacity 40. These are resolved for the recorded core snapshot.

## Intermediate stress check

At approximately 20:51 UTC, an independently seeded 180-case, 12-round stress probe exercised labor contracts, hours rules, fixed/sales-responsive investment, zero/scarce/ample AI, fees, initial cash, dividend rights and bonuses. It inspected 1,023 recorded rounds, including stopped payment rounds. The only material invariant failure was the already identified empty-workforce bonus/income mismatch, reaching 4.375. Maximum numerical errors otherwise were:

| Check | Maximum absolute error |
| --- | ---: |
| Conserved cash | 2.85e-13 |
| Replay of every recorded payment | 0 |
| Final expenditure versus domestic value added | 1.43e-14 |
| Delivered investment versus firm capital addition | 1.07e-14 |
| Used labor beyond contracted hours | 0 |
| Output beyond physical capacity | 1.43e-14 |
| AI use beyond provider capacity | 8.89e-16 |

These parameter draws are software stress inputs. Their stop counts are not scenario probabilities and have no empirical interpretation. This is an intermediate snapshot, not certification of later changes.

## Economic interpretation required in the paper

- The four-firm topology is a new experiment: two consumer producers with ten workers, an automated equipment producer and an automated domestic AI supplier. The earlier ten-firm input-output and banking results do not certify this engine.
- Scheduled cases force the offered adoption path. The optional one-step choice compares a retained stage with one higher available stage. The pass-through/markup rule and budget-weighted purchasing rule are declared behavior. None constitutes an optimizing price-competition equilibrium or demonstrates that a loss-making incumbent would willingly retain the chosen technology and payroll. Reference-payroll cases respond to persistent losses through buffer depletion and an explicit arrears stop; optional lagged-sales staffing is a separate response rule.
- Contracted paid hours, task-hours actually used and headcount differ. In particular, hourly-pay/redeployment still pays guaranteed contracted hours even when sales require fewer task-hours. It must not be described as paying only realized productive hours.
- Nominal GDP is final consumption at actual prices plus equipment purchases at price 1. Base-price GDP values those same final quantities at opening prices. Domestic AI fees are intermediate expenses of users and value added at the maintained automated supplier; they are not added again to final spending. The displayed consumer price ratio is a toy expenditure/quantity ratio, not an official chain-weighted GDP deflator or a cost-of-living index.
- Wage obligations may accrue before payment. At an arrears stop, distinguish contracted compensation and gross surplus from wages actually received and the household income that funds the next round. Retain the failing round and its stop flag. Do not silently fill later rounds or treat a stopped endpoint as an 80-round result.
- Equipment purchases create consumer capital only when paid and delivered. Depreciation changes real capital, not cash. The AI and equipment suppliers' maintained infrastructure is an exogenous resource assumption; service fees alone do not prove that its resources, energy, upkeep or expansion have been financed.
- Fixed worker dividend rights distribute cash to current and former workers. Owners currently fund all replacement-equity transfers. This can represent gifted profit-sharing rights with owner-financed equipment, but it is not a model of proportional co-investment, endogenous equity issuance or changing beneficial ownership.
- An acquisition inside the same pooled ultimate owner group changes corporate control and cash location. Its price is not GDP or new physical investment. Any output effect requires an explicit subsequent production, pricing or capacity change.
- Seeded adoption timing produces conditional scenario distributions. Paired random channels, retained stopped runs and explicitly conditional completed-run quantiles prevent avoidable comparisons from becoming misleading. Additional runs reduce simulation sampling noise; they do not establish real-world probabilities.

## Historical core snapshot at 20:57 UTC

Core reviewed after the ten individual worker accounts and resource-aware pricing were added, approximately 20:57 UTC. SHA-256:

| File | Hash |
| --- | --- |
| `src/toy_economy/adoption.py` | `e66cb0bc305fce733719d4a0b736eaf24b1fc571c707f24111f270273683d00e` |
| `src/toy_economy/adoption_engine.py` | `9743466cc131c8d7122032fd18ca636f7361db89c6c574da8de27aed256a268f` |
| `src/toy_economy/adoption_experiments.py` | `3597eac37355938ee155eb81376badcc974cd56c72b1195d0143acee80712d1b` |
| `scripts/run_adoption.py` | `52d513545a4bc36fad2687168a0653a832aa625ad4545414ddb07e4a3c636622` |

Hashes were unchanged across the verification run. The independently seeded 180-case stress probe now inspected 1,087 rounds with no material invariant failures. Payment replay and each person's income/actual receipts matched exactly. Maximum errors were 1.37e-12 for conserved cash,1.60e-14 for expenditure/value-added GDP,6.22e-15 for each person's opening cash plus income minus purchases versus closing cash,1.25e-14 for capital delivery, and 8.89e-16 for AI capacity. No account was negative and actual hours never exceeded contracted hours. Both nominal and physical consumption sum correctly across individuals. This does not certify empirical assumptions.

All 26 then-current named cases were run independently in memory. The baseline and central symmetric cases match the analytical checks below. Scarce AI under resource-aware pricing now completes 80 rounds at nominal GDP 99.2/base-price GDP 80; the earlier arrears result applies to the earlier optimistic forecast rule. The expensive-AI case still stops at round 15, and full automation with protected salaries stops at round 49. Their terminal rows retain accrued and paid compensation separately. The named case script and saved JSON will need a final equality/hash refresh after any subsequent changes; this snapshot is not a verdict on later private-choice, provider-control or rendering modules.

## Analytical cross-check for a feasible stationary state

Let `W` be aggregate compensation, `I` the fixed equipment purchase, `s` the fixed worker share of distributed profit and `c` the owners' consumption propensity. Assume workers spend all income, all profit is distributed, no firm makes a loss, and cash, consumer equipment and AI constraints do not bind. With profit `Π = Y − W`, final consumption is

`C = W + sΠ + c(1−s)Π`.

Substituting `Y = C + I` gives

`Π = I / [(1−s)(1−c)]`, and `Y = W + I / [(1−s)(1−c)]`.

This finite expression requires both `s < 1` and `c < 1`. At either endpoint with positive `I`, the assumptions do not admit that stationary solution. A cash constraint, unspent orders, retained income, altered investment or another adjustment must then matter; the implemented cash model is not required to explode.

Two actual symmetric cases satisfy the cross-check: at 40% task automation with protected pay/redeployment, `W60`, `I20`, `s0`, `c0.5` give nominal `Y100`; price 0.88 gives base-price consumption 90.909091 and GDP 110.909091. Hourly-pay/take-time gives `W36`, nominal `Y76`, consumption 63.636364 and base-price GDP 83.636364. These are arithmetic checks of the selected closure, not estimates.

The proposed fully automated 60% dividend-right case illustrates why feasibility must be checked first. The unconstrained formula gives nominal `Y100` when `W0`, `I20`, `s0.6`, `c0.5`. But at the default full-automation price 0.7, take-time restricts consumer output to 80 total units; even redeployment faces the same bound from AI capacity 10 task-hours. Nominal consumption is therefore at most 56, giving `Y ≤ 76` at investment 20. In that case the formula's nonbinding-capacity assumption fails. Lower observed GDP is not an accounting error. The remaining unspent income and constrained owner financing need to remain visible.

The separately named ample-AI/redeployment case with the dividend gift at round 25 instead reaches nominal GDP 96.4. Here supply is sufficient; owner cash binds after equipment finance. Owner opening cash and cash dividends are both 38.56, equipment finance is 20 and actual owner consumption 18.56, below desired consumption 19.28. Total desired consumption 77.12 exceeds cash-financeable consumption 76.4. This explains why it falls below the nonbinding-cash formula's 100.

With delayed dividend rights and sales-responsive investment, the tested endpoint is nominal GDP 24.033430/base-price GDP 32.273463. At zero wages the assumed profit-spending coefficient is `s+c(1−s)=0.8` and equipment orders are 0.2 of prior GDP. Their sum is 1, so the unconstrained aggregate rule preserves the level inherited from the transition. Arresting contraction does not restore the original 100. This is a conditional timing result, not a universal claim about worker ownership.

## Bounded private-choice check

The next stable implementation added `adoption_decisions.py`. Independently ran protected-pay/redeployment, hourly-pay/take-time, free-AI and expensive-AI examples with the same 20% and 40% availability dates. The protected-pay case at fee 3 rejects 20% automation: forecast operating surplus falls from 10 to 9.083150. The hourly-pay/take-time case accepts it:10 becomes 10.6. Fee 9 prevents that first hourly-pay adoption. All observed accepted decisions passed their declared strict one-period surplus hurdle. Reversing firm identities, inherited prices, capital and adoption stages preserved decisions and predicted surplus in three asymmetric probes. The 22 then-current focused adoption tests passed.

The forecast uses the same cash-financeable household budget as the subsequent purchase stage, after allowing for owner equipment finance. Both firms decide against inherited rival stages/prices before either decision is applied. It does not forecast future lost wages, demand feedback, the rival's current response, depreciation or discounted shareholder value. Adoption is irreversible, has no installation outlay in this extension and incurs the explicit recurring AI fee. It is a two-option operating-surplus improvement, not an unrestricted local/global optimum.

The free-AI case exposes the simultaneous-response limitation constructively: each protected-pay firm predicts unilateral surplus 14 at 20% automation versus 10 without it, but simultaneous adoption leaves each realized surplus 10. This difference is allowed by the stated forecast and is not an accounting discrepancy. Similarly, at household budget 0 an hourly-pay candidate can improve surplus from−30 to−24 while remaining below a closing payoff 0; exit is outside this choice set. Do not call such a decision proof of privately optimal survival.

The increment itself can change the result. With layoffs/redeployment, fee 3, budget 80, inherited prices 1 and capital 100 each, the first 10% candidate predicts surplus 9.624513 versus 10 and is rejected. A 20% move predicts 10.6 and a 40% move 11.2, so both would be accepted if offered directly. Discrete headcount produces this local barrier. The rule does not search all feasible stages and cannot establish even a global one-round optimum.

Lagged-sales staffing, added next, must state its production target separately from fixed reference output 40. A zero previous sale implies target/hours/capacity zero under the current rule; without an explicit restart or entry provision it is an absorbing no-production state. Any resulting persistence is conditional on that rule, not evidence that a real firm cannot restart when demand returns.

## Final verification and verdict

The frozen core was independently stressed with 240 seeded parameter combinations and 1,775 recorded rounds. Coverage included scheduled and bounded-myopic adoption, reference and lagged-sales staffing, valid rotating rosters, scarce/ample AI, fees, spending propensities, bonuses, fixed dividend rights, cash endowments and investment rules. No material invariant violation remained. The largest cash-conservation error was 1.60e-12. Payment replay and the sum of personal income matched exactly; maximum personal cash-flow error was 8.44e-15, GDP expenditure/value-added error 1.43e-14, capital-delivery error 1.43e-14 and AI-capacity excess 4.45e-16. Actual productive hours never exceeded contracted hours and no cash balance became negative. This is a software stress exercise, not a scenario probability distribution.

An additional tiny boundary defect was then corrected by the implementer: a nearly complete automation share could leave positive wages but zero recipients because an epsilon-adjusted integer ceiling returned zero headcount. Twelve targeted near-full/full-automation replays across labor/capacity rules now pass. A positive required hour quantity retains at least one recipient; exact full automation retains zero workers under the layoff contract. Ordinary named/grid stages did not change numerically. The final focused adoption suite, including the separate frontier, structure and analysis tests, passes all 68 tests.

The first independent full export replay reproduced all 37 named paths, 192 grid summaries and 6,000 timing summaries, distributions and selected paths exactly. It ran for 111.34 seconds. The later core boundary fix and summary-field rename landed after that replay. For the finalized export, all 37 paths were replayed again and compared after JSON serialization, and all 192 grid records reproduced exactly. The final artifact's three result blocks also match the earlier fully replayed blocks byte-for-byte under canonical serialization after reversing only the two approved field renames: `recorded_periods→completed_periods` and `last_recorded_period→last_completed_period`. This is a provenance comparison, not an instruction to use those misleading old names. It establishes that none of the 6,000 saved timing results changed, without another broad rerun. Final embedded source hashes match the frozen files.

| Canonical result block after field-name normalization | SHA-256 matching the independently replayed block |
| --- | --- |
| Named paths | `850eca4b75b83c5d3a16e838df810b87c9878e3ad630c4225672a7e429f413be` |
| Sensitivity grid | `893b5a740f06dab4ff99baf9461d34b00f9b032d60a212846c0762ea04e1074f` |
| Timing experiment | `82daf872c0fd18296cf299805c83d94db1b18d4fbe6c3109f1985f92f208078d` |

The postprocessor's four paired comparisons were independently recomputed from seed-indexed raw summaries, including all completion/stop categories, means and interpolated P 05/median/P 95. Both finite-grid extrema were also independently confirmed. The analysis references the current main-output hash. In particular, the protected-pay myopic comparison has only 14 jointly completed seeds out of 1,000, because 986 control runs stop. Its conditional mean must never be presented as an unconditional policy effect. The explicitly reported exclusions preserve that distinction.

The separate frontier runs 1,010 assigned-adoption cases over 101 terminal stages and ten parameter profiles. All 152 stopped cases remain as summaries; all 858 completed cases are eligible for equal-horizon rankings. The fee 3/capacity 10 redeployment maximum is at 50%, with base-price GDP 114.117647 and worker real consumption 70.588235. Capacity 25 moves the highest completed 80-round endpoint to 58%, but each consumer firm continues losing 0.306727 per round; a 120-round extension stops at round 90. The best endpoint without final-ten-round consumer losses/buffer draw is instead 55%. The [frontier note](adoption-frontier.md) distinguishes these finite-grid results from an exact static physical envelope. Three focused frontier tests, strict typing and lint pass, and its embedded source hashes match. This sweep does not solve a global price, investment or welfare optimization.

The current article and model note were read in full, including the final entry/acquisition and frontier additions. The article clearly separates assigned adoption from restricted private choice, worker consumption from gross GDP, fixed dividend rights from owner-financed equipment, physical capacity from actual purchases, and an 80-round surviving endpoint from indefinite financial viability. The entry/acquisition appendix explicitly holds customer budgets/prices fixed, funds both transfers from existing cash, distinguishes existing equity from produced equipment, and exposes replacement-driven gross GDP versus unchanged consumption/net domestic product. Its restricted subsidiary rescue assumption is disclosed. This conceptual/source review found no remaining blocking overreach; independent structure-code audit belongs to the separate Astra review.

The verdict is **pass for the stated executable, accounting and interpretation checks at the hashes below**. It is conditional on invented behavioral rules, inherited supplier infrastructure, the restricted action sets and explicit payment-stop boundary. It is not empirical calibration, a proof of optimizing equilibrium, welfare validation or browser/rendering approval.

| Final reviewed file | SHA-256 |
| --- | --- |
| `src/toy_economy/adoption.py` | `5b9cc8e9754c8040f2a8cc8b9fdbf1ba3f2eb1d51422fd32d431878c6922534b` |
| `src/toy_economy/adoption_engine.py` | `11b367d60381a84869b221cb1fed57196911b8d07a5da55a5e50a554f6e1921a` |
| `src/toy_economy/adoption_decisions.py` | `5aa62aab5c6dc1d1a491256bbb421b7f4ab0de414e22c56da62cedee07b16a76` |
| `src/toy_economy/adoption_experiments.py` | `049975c18a505a377cc27dff9fa60cbe88e38972eb24cc24b4eacff00ef68d48` |
| `src/toy_economy/adoption_analysis.py` | `10c4b4d039480543480acc3528f2e7aa5cebc9caf3ef75c3bba7cb3155d824b4` |
| `scripts/run_adoption.py` | `b2a61c77788e77139a4d883fbfdd9028f917cd803f07ec8c8a83e52eca77648e` |
| `scripts/analyze_adoption.py` | `7700feb17a0910bdc48351d389a84df915508e192fd73131b9236a594b0c20d4` |
| `scripts/run_adoption_frontier.py` | `a008818479a68dca7ed7142200b8148e26b14638449f86edfd628d67b3593f1c` |
| `outputs/adoption/results.json` | `a4a648dfd71d642f6ed1a055300ae56506d6983fe8d630a4ddf5a8de346df27b` |
| `outputs/adoption/analysis.json` | `f135be9322e479ce745e0a2882364b7e007fa36324b8380c2686d8adfa641045` |
| `outputs/adoption/frontier.json` | `f76b823d22ae8fe8c1b567bc784e4d29df4a55336570f4702a6136168dfc8bb7` |
| `outputs/adoption/structure.json` | `baf9ff0ab44f84242d696d5abf4a45f168d27f68dbe16771964ccaff7816f3a0` |
| `articles/04-ai-arrives-one-shop-at-a-time.md` | `bc7ba2cbe93e45fd7c3834b0abcd665af4129e512f820bc2657ecc3eaba52cf3` |
| `research/adoption-model.md` | `b66759144a648b51b66620ede65f1be7e62d6f1b5a1f4557de0a06f9c84dae8e` |

A material source or output change makes the applicable part of this snapshot stale. Later HTML/CSS/figure rendering is outside this review's scope.
