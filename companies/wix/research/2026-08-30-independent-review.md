---
type: independent_review
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
status: draft
review_status: passed
reviewed_at: 2026-09-01T01:15:10+02:00
reviewer_independence: independent_agent
reviewed_final_report_hash: sha256:bc8fb9a905d174ac46472bd36fc44cde34fc104640f1b463f0085f59207aea32
reviewed_valuation_hash: sha256:f448e0c1e02ffb811bf8b1712d579bb57dad6d558d24df406551720568cc6f9b
reviewed_decision_hash: sha256:8af0a871568900a57840d1fd525ff9754b9017475a9063a89b2d1b840a3118bf
reviewed_contract_hash: sha256:82a10dd87f7da029f0b10a5ea2c7bededf589b70210176d7f7d9d66c2d47ce57
reviewed_forecast_hash: sha256:62b32e819d69821520e3f442244315adfbe00410696f12d46c11daa1e157ef6f
reviewed_model_hash: sha256:df1854c0c454f28c523ca06bee3d99c5c9e5164599947ae132bb63ccbfbf42b4
reviewed_verifier_hash: sha256:f1cab8f432b70dd870913ea45e8852b09ef763c52c33acb97fb9c14845e29c7c
as_of: 2026-08-31
source_cutoff_at: 2026-08-31T23:59:59+02:00
scope: independent-forecast-financial-publication-review
---

# Wix independent review

## Verdict

**Passed for the exact canonical and executable hashes above.** Separate reviewers audited forecast methodology, financial/model integrity and publication flow. The final report preserves one argument from AI-driven creation pressure through retained business state, agent/backend attachment, owner cash and valuation. It distinguishes target-date fair value from market-price convergence and does not present the simulation as empirical calibration.

## Forecast improvements reviewed

The review covers four material additions:

1. **Prospective operating scorecard.** Eight FY2026/Q2 2027 estimates now have frozen intervals, source vintages, resolution rules, unresolvable rules and named baselines. Revenue is partially informed by three comparable Wix guidance errors; other estimates remain anchored or model-generated.
2. **Correct measurement timing.** Core ARR compounds from the 30 June 2026 observation and Base44 from the approximately 31 May run-rate anchor. The prior four-/ten-month treatment no longer silently treats those figures as 30 August observations.
3. **Dependency and ambiguity stress.** Four causal nodes replace the bundled regime. Their loadings are exposed, all 81 joint states occur, and independence/current/stronger-dependence cases show that dependence changes the tails more than the median.
4. **Model-form distributions.** Sum of parts remains the sole formal method, while the owner-FCFF multiple and discounted-cash-flow methods now report complete downside distributions on the same operating paths rather than only medians.

## Exact reproduced outputs

| Fair-value horizon | P10 | Median | P90 | Mean | Below $87.62 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Six months | $64.02 | $116.60 | $170.93 | $117.36 | 24.3% |
| Twelve months | $67.74 | $127.74 | $195.10 | $129.99 | 20.0% |

At twelve months, fair value is at least 30% below reference in 7.5% of draws and at least 50% below in 2.6%; the worst-decile mean is $51.16. The owner-FCFF multiple has a $105.78 median and 28.4% below-reference frequency. The DCF has a $77.53 median and 64.1% below-reference frequency. This gap is correctly presented as model-form uncertainty rather than averaged away.

## Robustness and calibration audit

- Three alternative same-evidence probability sets produce $126.89–$128.40 medians; they are sensitivity evidence, not independent validation.
- Deliberately skeptical/favorable weights produce $109.66/$146.12 medians and 32.4%/11.8% below-reference frequencies.
- With fixed marginals, independent nodes produce a $73.75 P10 and 5.4% frequency of fair value at least 30% below reference; stronger plausible dependence produces $61.89 and 9.8%, versus $67.74 and 7.5% in the central construction.
- A 0.5-times core-ARR multiple change is the largest listed one-at-a-time median sensitivity, moving value to $107.25/$148.39 around the $127.74 base.
- Ten 50,000-draw seeds produce $127.49–$128.33 medians, so numerical noise is much smaller than probability, dependency and multiple uncertainty.

The fair-value model is correctly labelled `structured_elicitation_shadow_cross_sectionally_anchored`. Public-software data, cost of capital, reported scale and capitalization constrain inputs, but the strategic probabilities are not observed historical frequencies. The three-year guidance-error sample informs only the separate revenue interval.

## Operating-contract audit

The contract's 80% weighted interval score is reproducible. Every scalar baseline is prospectively frozen, has a known-at timestamp and source IDs, and is scored as a degenerate interval—equivalent to absolute error. Every baseline is reported separately; unlike units are not aggregated without a future predeclared normalization. The Q4 Base44 gross-margin forecast now matches its modeled quantity, with management's H2 target identified only as a proxy baseline. Base44 ARR resolution uses the qualifying observation closest to the exact period end, with a deterministic tie-breaker.

The contract is hash-bound in the coverage manifest. Its resolution policy prohibits adding outcomes to the frozen file; actuals and scores must be recorded separately against that SHA-256 hash.

## Financial and model audit

The reviewers reconciled ARR timing, owner FCFF, net claims, debt, current awards, future-award economics, warrant treasury-stock treatment, the convertible if-converted threshold and the omitted capped-call benefit. The single formal SOTP vote, non-voting cash cross-checks, linked six-/twelve-month paths and fair-value probability semantics are internally consistent. The market-convergence table remains an unweighted sensitivity and no QQQ return is forecast.

The publication reviewer found no stale v4/v5 outputs, unsupported certainty or inaccessible acronym use in the exact final-report hash. The main report names no licensed workforce-data provider and contains no requester-specific correction or portfolio-weight discussion.

## Checks

- Valuation model, horizon contract and operating forecasts reconcile exactly.
- Focused Wix model and operating-scoring tests pass: 18/18.
- Full repository test suite passes: 97/97.
- Static research validation passes with no errors; its three warnings concern the repository-wide draft event-data specification, missing live SEC user-agent configuration and the inability of a static check to prove authenticated browser sessions.
- Dependency, probability-boundary and numerical-stability outputs reproduce.
- Git whitespace validation passes.

This review establishes internal consistency, prospective scoring discipline and clear publication semantics. It does not prove the strategic probabilities, forecast market-price convergence, forecast the benchmark or turn private-company and management claims into audited facts.
