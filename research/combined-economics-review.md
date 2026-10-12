# Combined paper: independent economics review

12 October 2026. Reviewer: independent Codex subagent `combined_economics_review`, delegated specifically for economic substance and numerical accuracy. This is a review of the snapshot below, not a new model calibration or independent empirical validation. No manuscript, engine or saved numerical result was changed by this reviewer.

## Verdict

**No blocking economic or numerical findings.** The principal conclusions are supported by the stated synthetic experiments, with unusually useful distinctions between purchasing power and money balances, tasks and contracts, capacity and realized sales, and a completed run and an indefinitely sustainable arrangement. The paper marks its model switches and repeatedly makes the scenario assumptions visible. The following three small wording improvements would make the published version harder to misread.

## Findings, ranked by severity

### P3 — Scope the final purchasing statement to the modeled market economy

Exact passage, main paper, “Back to the car”:

> Growth does not require everyone to keep earning wages. It requires production to meet purchases that people or businesses can finance.

Within the modeled closed market town this captures the intended demand and financing constraint. Read as a definition applying to every measured GDP increase, however, it is too broad: output placed in inventories and own-account capital production can enter GDP without a contemporaneous sale to a customer. The model also omits government and nonmarket output. This is not a flaw in the simulation; the closing sentence needs the same scope as the rest of the paper.

Suggested replacement: “Growth in this town does not require everyone to keep earning wages. A lasting market needs buyers who can finance their purchases. Shared prosperity requires those gains to reach people too.” If desired, an appendix sentence can distinguish temporary inventory accumulation from sustained final demand, without interrupting the ending.

### P3 — Keep the financing side of the dividend gift visible in the main narrative

Exact passage, main paper §8:

> The ownership rights are gifted in this experiment; we have not made unemployed people pay for shares with income they no longer have.

The appendix correctly adds that the original owners continue to finance equipment. That matters to the reader following who has what: the sixty-percent dividend gift does not also shift sixty percent of the equipment bill to former workers. The result is valid under its rule, but a short reminder would prevent readers silently imposing a different arrangement on the eighty-three-basket result.

Suggested addition: “The original owners still finance the equipment purchases.” The appendix already provides the necessary qualification, so this is a main-text clarity improvement rather than an unreported model flaw.

### P3 — Make clear that the production-versus-replacement illustration is a stationary physical allocation

Exact passage, main paper §10:

> One sustainable arrangement produces two hundred and fifty units each round. Half replaces equipment; half is available to households. Another produces five hundred—but needs all five hundred to replace its machinery.

The appendix correctly states that this separate capital module assumes sufficient demand and clearing prices, and that these are stationary comparisons rather than optimal transition paths. The main text identifies the separate machinery experiment, but “sustainable” can still sound like the cash engine has independently established all payment obligations. The distinction can be made in one plain sentence.

Suggested lead-in or caption addition: “Here we are checking what the machinery can keep producing and replacing; we assume those purchases can be financed.” This preserves the valid comparison without implying a joint cash-and-capital proof.

## Numerical and mechanism checks

- Read both manuscripts, the relevant model specifications, bank transaction/timing rules, frontier documentation, capital-limit source, and relevant tests. Inspected the bank-bridge SVG and the source of the new cash-buffer diagram.
- Directly reconciled the three 40% adoption comparisons to `outputs/adoption/results.json`: worker purchases 68.1818, 53.5714 and 40.9091; wages 60, 60 and 36; real GDP 110.9091, 91.4286 and 83.6364.
- Checked the private-decision forecast: baseline shop surplus 10, hourly-pay next-step forecast 10.6, protected-pay candidate forecast 9.083149966. The manuscript correctly compares the first-step forecast with a later 40% endpoint, explicitly declining to describe them as the same installation or moment.
- Checked full automation with ample AI: no-sharing real GDP 48.5714 and former-worker purchases zero; shared-ownership real GDP 129.142857, nominal GDP 96.4 and worker purchases 82.628571. The gift is explicit. Late-sharing responsive-investment endpoint real GDP 32.273463 and nominal GDP 24.033430 match.
- Checked the fixed-investment, wage-free ten-firm endpoint: GDP 40, consumption 20, investment 20, money stock 200. The sales-responsive recurrence is presented as a consequence of the declared 0.5 consumption and 0.2 investment rules, not a universal multiplier.
- Checked the earlier shock-recovery endpoint: GDP 80, worker consumption 60 and owner consumption zero. The paper and appendix identify the spending-rule dependence.
- Independently replayed five bank cases: the matched no-credit equipment freeze stops with wage arrears in round 7; zero-interest payroll credit reaches debt 14 and repays it all; household zero-interest lending advances and repays 120, with cumulative worker consumption 3480; one-percent interest reduces that cumulative consumption to 3473.648282 by interest paid of 6.351718; the erroneous permanent-loss household loan forgives 20 and exhausts bank equity. The 120 household figure is total advances, not peak outstanding debt, and the manuscript labels it correctly.
- The bank opening comparison uses identical deposits 180 and bank equity 20 in both arms, not a free wealth injection. Principal destruction, interest transfers, and defaults leaving spent deposits intact are consistent with the ledger. Household spending smoothing is not misrepresented as an investment-credit result.
- Checked the frontier's 50% point: real GDP 114.117647, consumption 94.117647, worker consumption 70.588235 and AI utilization 58.8235%. The distinction between the pricing planning quota and actual utilization is retained in the appendix.
- Independently reran the 58% protected-pay, AI-capacity-25 path for 120 requested rounds: consumer cash is 3.268883332497019 per shop after round 79 and wage arrears occur in round 90. This reproduces the new diagram and central warning about cash-buffer depletion.
- Checked the physical envelope algebra against the implementation: fixed equipment 200, human task capacity 80, and AI task capacity 8A imply a maximum consumer quantity of `min(200, 8(10+A))`. It is explicitly distinguished from the demand/finance outcomes and future capital accumulation.
- Ran all six `test_limits.py` tests, which passed. The analytical stationary maximum-consumption allocation is GDP 250, consumption 125 and replacement 125; the maximum stationary GDP allocation is GDP 500 with consumption zero. Dense-grid dominance and transition convergence checks passed. This validates the specified technology, not a welfare optimum or empirical ceiling.
- The war/bridge analogy is properly restricted to gross production versus asset loss. It expressly does not claim war increases total GDP, and the appendix distinguishes exceptional destruction from ordinary depreciation. This review assessed that wording against the retained source record; it did not independently retrieve the BEA pages again.

## Limits and release follow-up

This was a targeted economic/editorial review, not a full rerun of the 6,000-run simulation campaign, a mobile-layout review, or a publication-permissions audit. Public repository and rendered Substack links still need verification by the publishing agent. Later changes to economic substance should be returned for a focused review. Repository-link and publication-status additions alone do not change the numerical verdict, but the final manuscript hashes should be recorded before claiming review of that final snapshot.

## Reviewed manuscript snapshot

| File | SHA-256 |
| --- | --- |
| `articles/05-who-buys-what-ai-makes.md` | `410998be1cf0ba13d8e0126c83e9bffc525a361be2d1f11c2e93652abc80345e` |
| `articles/05-appendix.md` | `bbebf2697608eb19ff8a495485eb187268da9b7aa015f18ada189f5e1da50d19` |

## Final revision review and resolution — 12 October 2026

**Verdict: no remaining blocking economic issue.** Re-read the current main manuscript and appendix after both reviewers' amendments. All three economics suggestions above are resolved:

1. The closing claim now says “In our town, a lasting market needs purchases that people or businesses can finance,” appropriately limiting the demand statement.
2. The ownership example now explicitly states that original owners still finance equipment purchases.
3. The stationary-machinery caption now states that indefinite replacement is conditional on its invented technology and that financeable purchases are assumed in this separate calculation.

Also checked the changed captions against their numerical diagrams. The AI-invoice caption correctly describes roughly 14 of the shops' 80 coins going to the supplier, roughly 66 covering shop wages and surplus, and equipment 20 completing current-price GDP 100. The zero-job comparison correctly excludes equipment from its consumption bars and adds 20 to obtain base-price GDP. The layoffs caption correctly distinguishes an unchanged aggregate paid-time reduction from its different distribution across workers. The vertical sequence direction changes no economic assertion. The appendix now links both independent reviews and the public repository without expanding the scope of those reviews.

No engine or numerical assumptions changed; the earlier targeted numerical verification remains applicable. This final approval concerns the economic substance of the exact manuscript snapshot below. Host-rendering, image upload and destination-link verification remain the publishing agent's responsibility. Pure link normalization and host formatting do not alter this economic verdict provided the prose, numerical labels and caption meanings remain intact.

| Final reviewed file | SHA-256 |
| --- | --- |
| `articles/05-who-buys-what-ai-makes.md` | `c83b66e7fc3c1ba5e9ea93799c42114abd9d601894e4524c25c3a209ddcb0dab` |
| `articles/05-appendix.md` | `bf4a7813167f43bb30277ef8fa6c3e88611e9ab16811eef3d8b88fb035aa14fe` |
