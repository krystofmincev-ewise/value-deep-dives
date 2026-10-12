# Second experiment: independent economics review

> Historical snapshot: the optional bank model and appendix were added later on 11 October 2026. This record describes its stated earlier scope; its hashes are not a current certification of changed files. See [banking review](banking-review.md) and [banking verification](banking-validation.md) for the extension.

Status: numerical review retained; the illustrated article received a targeted editorial and diagram rereview on 11 October 2026. See [the visual review](visual-editorial-review.md) and [presentation QA](visual-qa.md) for the new edition’s scope and limitations. Model code and numerical outputs are unchanged. Reviewed on
10 October 2026 by the separate Codex adversarial-review workstream using the
inherited user-selected model setting. This covers the second experiment's
mechanisms and interpretation; it does not recertify the original experiment or
establish empirical validity, publication approval or browser presentation quality.

## Targeted editorial rereview, 10 October 2026

The simplified paper was read from start to finish against the previously reviewed
code and saved results. Its continuous story now runs from the deferred car purchase
to the owner's incentive, follows spending through three possible endings, adds
payment timing, distinguishes production from consumption, and returns to the car.
That arc is coherent. The simplified language preserves the conditional character
of the findings and does not turn the illustrative owner into a solved optimizing
firm or the town into a forecast.

One wording issue was corrected before this refresh: unchanged final spending rules
alone do not guarantee an unchanged ending once cash constraints and path dependence
can bind. The paper now confines that comparison to the tested full-layoff schedules
without an investment freeze, with owners spending half their income. It separately
describes the interrupted slow schedule as failing before its intended endpoint.

Retained numbers agree with the unchanged results: baseline GDP 100/C 80/I 20/W 60;
private wage saving 6, own-sales loss 1 and gain 5; zero-wage GDP 100 with sufficient
owner spending or the selected ownership split; fixed-investment GDP 40;
sales-responsive 100,70,49,34.3,...; equipment-firm payroll 3 versus cash 1 at
aggregate GDP 67.75 and wages 60; surviving-freeze GDP 80; and stationary GDP 250/C 125
versus GDP 500/C 0. GDP, former-worker access and payroll failure remain distinct.
The omitted growth-rate details were moved to the specification: its 18.3216%
one-step real-GDP maximum and 40% AK real-growth maximum retain their starting-state,
technology, consumption and nominal/real qualifications.

Only the article Markdown, its generated HTML and the specification changed among
the 38 snapshotted files. Their hashes were refreshed after this rereview; all 35
other hashes, including every model and numerical output, still match the original
numerical snapshot. The generated HTML contains the rewritten title, corrected
speed paragraph and closing return to the car. This is a narrow editorial refresh;
the independent numerical checks below remain the prior checks of those unchanged
bytes.

## Findings resolved before snapshot

1. **Demand extinction is not payroll insolvency.** The replacement rule at the
   baseline reduces desired investment to .2 times lagged GDP. After inherited
   wages pass through, GDP follows .7 times its previous value: 100,70,49,34.3,... .
   The positive values approach zero, while the cash stock stays 200. Zero workers
   also mechanically remove payroll obligations. The paper and companion keep
   this limit separate from a stopped path with unpaid wages.
2. **Survival does not guarantee restoration of the old circulation.** A
   15-period equipment pause survives but later settles at GDP 80, consumption 60
   and investment 20. Workers retain cash accumulated during rationing but cannot
   spend wealth under the income-only consumption rule; owner cash finances
   equipment. Capital recovers toward 200. The revised paper explains this
   path dependence and does not describe full recovery to 100. The 16-period
   pause stops at period 20 before its planned restart, with arrears 2.872482.
3. **Timing comparisons must preserve the intended endpoint and identify an
   uncompleted transition.** Under the common 17-period investment pause and
   zero initial firm cash, immediate and fast reductions reach five workers and
   later GDP 70. The slow schedule stops at period 22 with six workers still
   contracted, GDP 33.354363 and arrears 2.645637. It has not reached its five-worker
   endpoint. No welfare ranking or general recommendation to dismiss faster is
   inferred.
4. **Aggregate income does not settle each firm's obligations.** With rigid
   baseline payroll shares, both equipment firms miss wages 2 at period 8 during
   the five-period pause, although aggregate GDP 67.75 exceeds total wages 60.
   The paper identifies the missing cross-firm finance and labor adjustment.
   Accrued wages, cash wages and arrears are distinct; unpaid wages are not
   silently treated as household cash receipts.
5. **A binary adoption gain is not unrestricted profit maximization.** Saving a
   wage 6 can give private recurring gain 5 while aggregate gross surplus falls 4.
   But facing nine robot rivals, adoption has NPV−6, retention about−38.61 and
   exit 0. The entry/exit game therefore qualifies the binary screen. Active
   market shares and demand are recomputed for every deviation. Default positive
   setup costs give no pure equilibrium; this does not rule out mixed strategies.
   Algorithm cycles are not calendar-time economic cycles, and the annuitized
   setup hurdle is not a domestic installation payment or GDP deduction.
6. **Maxima and stability require their domains.** Stationary GDP 500 at all
   investment has consumption and net domestic product zero. Maximum stationary
   consumption 125 occurs at investment share .5 and GDP 250. A cap 300 creates a GDP
   plateau at shares .6 through 1. These are global maxima over the stated fixed
   technology stationary family. Local investment-response stability at
   gamma 5/13 is a different question; floors and cash caps invalidate unrestricted
   extrapolation. The technical specification also distinguishes stationary zero growth,
   the one-step real-GDP maximum 18.32% from initial capital 200, and the AK model's
   conditional maximum real growth 40%. Nominal GDP in the AK example stays 100.

## Independent analytical and numerical checks

The derivation in `shock-design-review.md` reproduces the Jacobian, exact Jury
conditions and partial-employment fixed points. For effective capital-income
consumption propensity c and r=a*u_target, the interior denominator is
D=1−c−delta/r. With a positive spending intercept, D>0 is necessary for a positive
interior fixed point, not sufficient for cash feasibility. Strict local stability
also needs det(J)<1. At the baseline c=.5, delta=.1 and r=.5, gamma 5/13 is the
boundary. A nonnegative-map bound establishes zero-demand attraction for the
narrower regime 0<gamma<=delta and D>0; instability above the local boundary is
not a global collapse theorem.

Direct production-module runs independently confirmed replacement-rule steady
GDP 90/70/50 for nine/seven/five workers, consumption 72/56/40, investment 18/14/10
and capital 180/140/100. The zero-wage counterexamples at owner propensity .8 and
worker ownership .6 preserve GDP 100 in the chosen cash scenario. Fixed investment 20
instead supports zero-wage GDP 40. None supplies a universal automation threshold.

The diminishing-return maxima match analytic first-order conditions and direct
capital paths. An additional cap 100 boundary moves the consumption optimum to
share .2 with consumption 80, checking a case where the uncapped golden rule no
longer applies. Direct two-period runs verify sqrt(1.4)−1=18.3216% real-GDP growth
at initial capital 200 and all investment; the AK run at all investment gives
40% real growth and 0% nominal-GDP growth, both with zero consumption.

A separate saved-output audit checked all 38 named paths and 5,250 recorded periods
without rebuilding them. It reconciles cash conservation, GDP expenditure and
income accounts, paid wages plus arrears, the capital law, nominal/real conversion,
the worker/owner consumption split and cumulative totals. Maximum absolute cash
error was 1.91e−12; other reconciliation errors were at most 2.85e−14. All closing
cash balances were nonnegative within 1e−8. Exported fixed-money freeze boundaries
and the fixed-investment floor game were also inspected: reallocating money 200
changes first failing durations 12/13/14/16; autonomous investment 20 supports the
all-robot pure equilibrium at GDP 40 in the separate game.

Reproducible independent probes are local-only:
`.local/toy-economy-shock-design/check.py` and `review_exports.py`. They use only the
standard library. No production module was edited by this review, and no paid
service, new dependency or external data was used. The implementation workstream
separately reports 84 passing tests on Python 3.14.4 and 3.12.14, strict mypy and
clean Ruff checks; these are implementation QA, distinct from this independent
analytical review.

## Interpretation retained

Prices are fixed at one in selectable shock paths; physical limit allocations
and the flexible-price AK example are separate models. Gross GDP is not welfare,
net production, household access or spendable wage cash. Investment responds to
lagged demand in one declared rule, and owners' willingness and ability to finance
purchases remain assumptions. The models omit rational foresight, household
heterogeneity, skill matching, bankruptcy resolution, credit markets, strategic
pricing and empirical resource calibration. Public-source context is retained
in `economic-foundations.md`; the new coefficients, schedules and numbers are
original hypothetical calculations, not source-derived empirical estimates.

## Reviewed snapshot

SHA-256 values below identify the reviewed bytes, relative to `studies/toy-economy`.
A material subsequent change requires a targeted rereview and refreshed hashes.
README, the evolving run log and final visual QA are outside this snapshot. The
review document itself is excluded to avoid a self-referential hash.

Snapshot created: 2026-10-10 19:52:06 UTC.

Targeted editorial refresh: 2026-10-10 20:57:53 UTC.

Illustrated-edition refresh: 11 October 2026. The two article entries below now identify the reviewed visual rewrite; all other original snapshot bytes remain unchanged.

| File | SHA-256 |
| --- | --- |
| `articles/03-when-the-economy-breaks.md` | `5ddadc202cb15c763b431f7ab49c56a676d342814f79385df1e70af35120cf38` |
| `research/shock-protocol.md` | `41c541e3d02694f73bd0e51497b8d3fe2b6443a719a3504c03354c30d5419577` |
| `research/shock-specification.md` | `67a9a22b92e75d6c35471c2477fcb4b78df0e8228730c8b050f14df2cb79ab27` |
| `research/shock-design-review.md` | `75827b9261f4eb179a1a54e21e6124aef41316651b7c435b014af19a57dbeb7f` |
| `research/shock-cash-results.md` | `db41a63534030e509e13af7fd8620e27adac126655731fcc88876e679d13c9bd` |
| `research/strategic-game-note.md` | `f38b611a2d15b29fefe2c2b25cdd06af769549fae4d8166716963b70071cb5ba` |
| `src/toy_economy/dynamics.py` | `64877ea38c4fde7aa6363a906fff600973ab49bf45fdc8575d8d028a771af245` |
| `src/toy_economy/shocks.py` | `a2604c311a6fee8ad260046fb50b6287133216e3fa2ce1e94f31f896a96bed87` |
| `src/toy_economy/shock_cases.py` | `a6b6c499c543072371319bcd1f3213bf4d9300c2a6afa6e2686d287c66c106e7` |
| `src/toy_economy/production.py` | `b95282bc5c1e24dabbd014fe6a2930faeca70d1c85e6cd2198014c6e5a02b081` |
| `src/toy_economy/ledger.py` | `0e80cac985311f13876d819bafb6270942b17fed72d1223d1e33f2de19d73443` |
| `src/toy_economy/closure.py` | `4ed2ec311244824e7c37339ae0620e0af550c27f11ae0c06251ff2b05058803b` |
| `src/toy_economy/growth.py` | `e12efd9a74a25d52feaf35c4299720c0e1ad90fe1b50e7e3beaaf51a748415e0` |
| `src/toy_economy/incentives.py` | `fbac3565903f06c6ed78e3366eb3e669350a60f58674d54de72c882caebb5546` |
| `src/toy_economy/limits.py` | `1add59212ccdfce76db5a5c6f264a933ea81fa7bb358bc5bcc2dce1fdfc333db` |
| `src/toy_economy/strategic_game.py` | `8e2b37c61303f502ac92a0d16706c6c85f30a587eb7cc83b80d126aa8fbfa311` |
| `tests/test_shocks.py` | `952f40b6bdff67ceb99413825e5d46672c77f09750e409fcb442e7ef24b1159b` |
| `tests/test_incentives.py` | `8e6a89fa0e73273e664e88b204654fab1717d5eaa65e5a019a4e91b86a768346` |
| `tests/test_limits.py` | `5640f371616e761b932c23aaa6487ea34e4e2452e076c3e706745e060b7e1598` |
| `tests/test_strategic_game.py` | `da893ecd70b3c65874381711654503a807de22aa4ba56f032d8805a5a05152db` |
| `scripts/build_shock_report.py` | `7cde02620cef82934668e54e528b7bfff10610d5738f415e4e3ce0eafa63952c` |
| `outputs/shocks/results.json` | `70abb218384b9b969b1b5df2888f4b6d24b47f3fc0b74dcf553e5f682f607d02` |
| `outputs/shocks/summary.csv` | `b22564153d2f6c3921c24fb782eb1c0be0724156a1a15b0058f5e372433e6da9` |
| `outputs/shocks/incentives.json` | `962cb5ff62f9d67f5396ba5d376c0f6cce7208358424e730da58b3f500c4885d` |
| `outputs/shocks/strategic-game.json` | `e7c548b21d98a2d446ebdf14b3daccff9e7ef3d1d2802dc6f1657648664a94a7` |
| `outputs/shocks/limits.json` | `c0c70b6e3ba094317445b3cf8359091ce3fc73f3ee7d17c9ef90a67fde494a7c` |
| `site/shocks.js` | `5329815aa788797d25864b04c75d068c346ae792d747c7bec9ef8a625bcd60ce` |
| `site/shocks.template.html` | `038781dc526cf5c5b5ae3344cef244f28dc7c621edcbe9a77f19ba666b299e21` |
| `site/shocks.html` | `3fd65a0c5696aed55161ffdbeb1f873c8b4b715b98aab64ac8ca2c40c02862d2` |
| `site/03-when-the-economy-breaks.html` | `5885ec7ee32aa06261dc22912a729f937e579412d96ab7419482f4c8db6408d0` |
| `outputs/shocks/figures/demand-loop.png` | `8ee461b593073e37469cb92ff4b69b50d52d364d4537a17fc28f71ab93cecc4a` |
| `outputs/shocks/figures/demand-loop.svg` | `c290aa270136726a6b11043cefd9410a6ecf5b822079472cd7d759a6d7134f42` |
| `outputs/shocks/figures/firm-liquidity.png` | `c717b0cbaccb6e5b314a0626cc7b5258c3b5783e78e1c347906fd7bf7aad01dc` |
| `outputs/shocks/figures/firm-liquidity.svg` | `5e5fb5ea2eb52c50a2ac6c734386fe24f8a71fe7d5831b2419094ac900d6a491` |
| `outputs/shocks/figures/investment-cycles.png` | `4485b3f98e970f4f82ea99a9772c09f52cd9bc2fc0f766784656042e688a410a` |
| `outputs/shocks/figures/investment-cycles.svg` | `7b3ffa7bbe047f93fc8b63900dd99a6fd92a70d7197d512aaf040f1923925f3f` |
| `outputs/shocks/figures/growth-limits.png` | `fab56219bcf16c1abfc76a710f8cb320958d150431a01233de28a640b609c57e` |
| `outputs/shocks/figures/growth-limits.svg` | `fedec62c080553981061e28b729237fc5c2989288599036750ceca5ed020a27a` |
