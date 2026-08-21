# Integrated audit of the Snap thesis, valuation, and quarterly forecast

> **Historical pre-correction audit.** All findings and figures below describe the files before the lead-agent corrections. Use the [post-correction verification](2026-08-20-post-correction-verification.md) for the corrected 20 August package and the [21 August valuation](../valuation/2026-08-21-reunderwritten-valuation.md) for the current draft model. Financial shorthand used here is defined in the [glossary](../GLOSSARY.md).

> **Audit terminology:** Earnings before interest, taxes, depreciation, and amortization (EBITDA) and trailing twelve months (TTM) are expanded here because they first appear later in historical audit tables. Other shorthand is expanded where first used or defined in the glossary.

**Audit date:** 2026-08-20

**Fact set audited:** repository working-tree versions available on 2026-08-20

**Files reviewed:** `thesis/2026-08-20-initial-thesis.md`, `valuation/2026-08-20-valuation.md`, and `research/2026-08-20-quarterly-forecast.md`

**Scope:** arithmetic, period/source consistency, double counting, claim support, scenario coherence, and compatibility with the repository's prospective company-record contract.

**Editing boundary:** This audit did not edit any of the three reviewed files.

## Audit conclusion

The package is directionally coherent and most displayed arithmetic is correct. Quarterly components sum to the four-quarter cases; growth rates and margins recalculate; the enterprise-to-equity bridge works; the primary multiple and sum-of-the-parts (SOTP) values reproduce; probabilities sum to 100%; and the position arithmetic is correct.

It is **not ready to publish as a prospective scored record**. The most important problems are: (1) the primary multiple's period label is incompatible with the 12-month target horizon; (2) the reverse-expectations table does not reproduce under its stated 13% cost of equity; (3) thesis frontmatter would fail the company-ledger contract in several fields; and (4) the price/evaluation/benchmark rule is not frozen precisely enough for later outcome measurement. These are fixable without changing the qualitative stance, but the reverse discounted-cash-flow (DCF) analysis and target-period choice can materially change the valuation interpretation.

### Lead-agent resolution update — 2026-08-20T23:57:43+02:00

The audit above records the pre-correction state. The lead agent subsequently:

- relabeled the primary and segment methods as target-date last-twelve-month (LTM) and retained the same-period multiple comparison;
- rebuilt the reverse DCF to 28.2% / 20.1% / 14.2% / 9.4% / 3.8% required CAGRs and disclosed the no-incremental-dilution convention;
- added a reproducible 15-row per-share DCF, explicit free-cash-flow (FCF)-per-share dilution, and capital-allocation/net-debt bridge;
- repaired the Q3 Other Revenue and Specs scenario ordering;
- rebuilt the six-month checkpoint from LTM revenue, multiples, net debt, and shares;
- aligned draft frontmatter paths, hash prefix, ISO horizon, evaluation rule, benchmark convention, and disclosure enum;
- added visible draft warnings, timestamped cutoff metadata, and close citations for material thesis claims.

The formal publication gate remains intentionally open: the $5.21 SNAP and $710.93 Invesco QQQ exchange-traded fund (QQQ) draft references still need reproducible official/adjusted-close observations, a forecast identifier, a public commit, and human review before prospective-ledger registration. The analytical draft and decision conclusion do not depend on claiming that registration is complete.

Priority definitions: **Priority 1 (P1)** blocks publication or can materially change the stated value/return; **Priority 2 (P2)** weakens reproducibility or scenario integrity; **Priority 3 (P3)** is a presentation or low-impact consistency issue.

## Actionable findings

### P1 — Resolve the target-period mismatch in the primary valuation

The valuation calls the method “forward enterprise-value multiple” and labels the scenario multiples `NTM EV/revenue`, meaning next-twelve-month enterprise value/revenue (`valuation:30-35, 73-103`). The revenue denominator is Q3 2026 through Q2 2027. At the stated 20 August 2027 target date, that period is effectively **target-date trailing revenue**, not target-date next-twelve-month revenue. The same file calibrates the 1.65x base multiple to Snap's **current trailing** 1.68x multiple (`valuation:56, 103`), which is internally coherent only if 1.65x is a target-date LTM multiple.

This is more than terminology because the two legitimate choices produce different targets:

1. Keep the existing Q3 2026–Q2 2027 revenue and relabel every scenario multiple as a **target-date LTM EV/revenue** multiple. Explain that the model is a 12-month price target built from the revenue expected to have been earned by the horizon.
2. Keep the label “target-date NTM” and forecast Q3 2027–Q2 2028 revenue. Recalibrate multiples on the same forward-period basis.

The thesis repeats the NTM framing (`thesis:166`). The SOTP uses the same revenue periods and therefore needs the same label decision. Do not compare a target-date forward multiple with today's trailing multiple without an explicit bridge.

### P1 — Rebuild or relabel the reverse-expectations table

The table says that $9.80 billion of equity value, $6.351 billion of starting revenue, a 13% cost of equity, a 2.5% terminal-growth rate, and a constant five-year growth/margin framework imply five-year revenue CAGRs of 23.8%, 17.2%, 12.1%, 8.1%, and 3.3% at 6%, 8%, 10%, 12%, and 15% FCF margins (`valuation:146-158`; repeated in `thesis:78`).

Using the standard year-end levered-equity DCF stated by the prose,

> Equity value = sum of years 1–5 revenue × margin discounted at 13% + year-5 terminal value discounted at 13%

with terminal value equal to year-5 FCF × 1.025 / (0.13 − 0.025), the CAGRs required to reach $9.80 billion are approximately **28.2%, 20.1%, 14.2%, 9.4%, and 3.8%**, respectively. The displayed values are closer to a lower discount rate or a different timing convention, but no such convention is disclosed.

Action: preserve the deterministic model or show the exact year-by-year formula/timing convention, then regenerate both files. Also state a future-dilution assumption. The current table uses a fully diluted starting equity value but does not say whether incremental future dilution is included; calling the result “true per-share cash” (`valuation:158`) is unsupported until that is explicit.

### P1 — Fix thesis frontmatter before registration in the company ledger

The thesis is correctly marked `draft` with `published_at: null`, so `forecast_id: null` is acceptable **while it remains a draft**. It is not compatible with the company-ledger schema or link auditor if published unchanged:

| Field | Current value | Publication requirement |
|---|---|---|
| `forecast_id` | `null` | Assign the next `YYYY-TNNN` identifier before publication. |
| `identity_path` | `../identity.md` | The ledger/link auditor resolves from repository root and requires the exact matching path; use `companies/snap/identity.md`. |
| `identity_hash` | raw 64-character hex | Ledger schema requires `sha256:3fc14a54c79f2311fc10dd14e3a533582823d36ee94bbabeb4c911296446d157`. The digest itself matches the current identity file. |
| `target_horizon` | `12_months_to_2027-08-20` | Ledger schema requires the ISO date `2027-08-20`. Put the duration explanation in prose. |
| `position_disclosure` | `user_reports_long_approximately_10_percent_at_4_70_average_cost` | Allowed values are `long`, `short`, `no_position`, or `not_disclosed`; use `long` and retain the user-reported detail in the disclosure section. |
| `published_at` / `research_status` | `null` / `draft` | Populate an immutable timestamp and change to `published` only after the final evidence and record checks. |

The valuation repeats the non-ISO `target_horizon` and raw identity-hash format (`valuation:5-6, 20`). Align it with the thesis even though the company ledger directly registers the thesis.

### P1 — Freeze a scoreable price, target rule, and benchmark rule

The frontmatter evaluation rule is `closing_price_on_or_before_horizon_with_business_falsifier_review` (`thesis:25`). “On or before” does not identify a unique observation and could permit favorable-date selection. A business-falsifier review is analytically useful but should not alter the frozen security-price outcome rule after the fact.

The $5.21 reference was observed at 20:59:05 UTC, about an hour after the regular NYSE close, through an unidentified “integrated public market-data feed.” The source log links a dynamic Google Finance page, records no capture, and does not say whether $5.21 is the official close, a delayed last trade, or an after-hours observation. The stated outcome uses a closing price, creating an entry/exit convention mismatch. The named QQQ total-return benchmark also lacks a frozen start price, source, corporate-action/dividend convention, and horizon observation rule.

Before publication, specify:

- the official SNAP close on the decision date or an explicitly defined last-trade observation;
- provider, timestamp semantics, and split/dividend adjustment convention;
- the official close on 20 August 2027, or the immediately preceding trading day if the date is not a session;
- whether `reached` means the horizon close or any prior close—prefer a unique horizon close for performance scoring;
- QQQ's matching start/end observations and total-return method;
- a reproducible market-data record or permitted committed derivative rather than only a dynamic quote URL.

### P2 — Make the DCF cross-check reproducible and align dilution assumptions

The DCF table gives five annual revenue-growth rates, only the year-5 FCF margin, cost of equity, terminal growth, and annual dilution (`valuation:131-144`). It does not give years 1–4 FCF margins, starting margin treatment, annual FCF, the share-count path, terminal value, or present-value bridge. Multiple reasonable interpolation and dilution conventions do not reproduce the displayed $2.07 / $5.81 / $11.15 exactly.

The dilution assumptions also diverge from the primary case at the 12-month horizon. Starting with the 1.881 billion fully diluted proxy:

- bear target shares of 1.98 billion imply about **5.3%** one-year growth, versus the DCF's 3% annual dilution;
- base 1.93 billion implies about **2.6%**, versus 2%;
- bull 1.90 billion implies about **1.0%**, matching 1%.

Action: publish a five-row DCF schedule and reconcile year-one shares with the primary target-share bridge. Define “annual dilution” as **net new dilution after the awards already included in the 0.199 billion award overhang**; otherwise vesting of awards already in the starting fully diluted denominator can be counted twice.

### P2 — Add a net-debt and diluted-share bridge to the quarterly model

Target net debt ($0.80/$0.55/$0.20 billion) and diluted shares (1.98/1.93/1.90 billion) are critical primary-valuation inputs, but the quarterly forecast contains no bridge from current $0.875 billion net debt and 1.881 billion diluted shares. Forecast FCF is $0.50/$0.84/$1.14 billion, so the model implicitly assumes most cash is consumed by buybacks, debt actions, restructuring, working capital, or other uses. The assumed allocation differs by case but is not shown.

Add, for each scenario: opening cash/debt/shares; FCF; debt issuance/repayment; repurchases; employee issuance/award additions/forfeitures; any restructuring cash not already in FCF; and ending cash/debt/shares. This will demonstrate that FCF is not being counted once in a cash build and again through buybacks, and that current awards plus future dilution are not duplicated.

### P2 — Repair two scenario-ordering anomalies

1. **Q3 Other Revenue is highest in bear and lowest in bull:** $270 million / $258 million / $248 million (`quarterly-forecast:38-40`). The full-year order then reverses to the expected bear/base/bull sequence. If Q3 Other Revenue is a residual used to hold total revenue around guidance while advertising varies, label it as a plug. Otherwise use monotonic driver assumptions. As written, the “bull” has worse Q3 direct revenue without a narrative reason.
2. **Specs option value is higher in base than bull:** $0.30 billion versus $0.10 billion (`valuation:122-129`). Remaining funding can reduce gross option value, but it should not make a successful bull scenario worth less than base without an explicit spend/adoption bridge. The chosen amounts make the SOTP almost exactly match the primary values, which creates calibration risk. Either explain the inverse outcome or use a monotonic option-value/net-liability treatment.

The SOTP is not an independent proof because it reuses the same revenue, net debt, shares, and closely calibrated risk multiples; the file acknowledges part of this. It is best described as a segment-multiple decomposition, not a method with genuinely different failure modes.

### P2 — Support or remove the six-month target set

The six-month $2.75 / $5.70 / $8.50 values and $5.24 weighted value appear in both thesis and valuation (`thesis:51`; `valuation:39`) but have no operating-period definition, valuation bridge, capital structure, share count, multiple, or derivation. The probabilities appear to be reused from the 12-month scenarios, but that is not stated.

Because the six-month answer is a user-requested decision output, add a short deterministic bridge: what financial periods are known by 20 February 2027, what multiples apply, what net debt/shares are assumed, and why scenario probabilities remain the same or differ. Otherwise label these values illustrative and exclude them from the formal target record.

### P2 — Improve claim-level citation and cutoff traceability

The three files link to workstream memos and a source log, but many material facts are not cited close to the claim. Examples include the peer growth rates and peer multiples (`valuation:105-116`), the ad-stack adoption and performance statistics (`thesis:105-113`), the Specs price/weight/countries (`thesis:121-125`), and the live regulatory statements (`thesis:145-149`). The repository standard requires material factual claims to carry nearby canonical citations or source IDs.

The quarterly forecast uses `source_cutoff: 2026-08-20`, while the thesis and valuation use `source_cutoff_at: 2026-08-20T23:30:00+02:00`. Use the timestamped form so same-day information cannot be introduced ambiguously. The source log also records the Q2 2026 10-Q publication only as `2026-08`; replace it with the exact filing/acceptance date before publication.

### P3 — Make draft status visible in the valuation and forecast bodies

The thesis has a visible draft warning. The valuation and quarterly forecast contain `status: draft` only in frontmatter. Repository standards say drafts must be visibly marked; add a short body callout. This does not affect arithmetic.

### P3 — Normalize minor rounding language

The expected value is exactly $5.4425 from the displayed inputs. Tables correctly show $5.44, while valuation prose says approximately $5.45 (`valuation:35-37`). Either is defensible rounding, but one convention across the package avoids appearing to change the conclusion. The displayed scenario returns also recalculate correctly after rounding.

## Arithmetic that passed

The following checks did not identify errors:

| Check | Recalculation |
|---|---:|
| TTM revenue / ads / Other / EBITDA / FCF | $6.351bn / $5.328bn / $1.023bn / $1.023bn / $0.706bn |
| Four-quarter bear revenue | $5.515bn ads + $1.192bn Other = $6.707bn |
| Four-quarter base revenue | $5.954bn + $1.346bn = $7.300bn |
| Four-quarter bull revenue | $6.316bn + $1.535bn = $7.851bn |
| Four-quarter total growth | 5.6% / 14.9% / 23.6% versus $6.351bn |
| EBITDA margins | 13.6% / 19.0% / 22.3% |
| FCF margins | 7.5% / 11.5% / 14.5% |
| Fully diluted equity value | $5.21 × 1.8809bn = $9.80bn |
| Enterprise value | $9.80bn + $0.875bn net debt = $10.675bn |
| EV / TTM revenue | $10.675bn / $6.351bn = 1.68x |
| Primary values | $2.3059 / $5.9560 / $9.8118, rounding to $2.31 / $5.96 / $9.81 |
| SOTP values | $2.2681 / $5.9330 / $9.8274, matching the displayed approximations |
| Probability-weighted 12-month value | 30% × $2.31 + 55% × $5.96 + 15% × $9.81 = $5.4425 |
| Six-month weighted value | 30% × $2.75 + 55% × $5.70 + 15% × $8.50 = $5.235 |
| Position arithmetic | Omitted from the public audit; only the `long` disclosure is retained |

## Double-counting assessment

No confirmed double count was found in the primary EV/revenue bridge: revenue creates enterprise value once, target net debt is subtracted once, and buybacks are not added as distributable cash. The levered-equity DCF also correctly states that net debt should not be subtracted again because reported FCF is after cash interest.

Two potential double counts remain unresolved because schedules are missing:

1. The current fully diluted proxy already includes 0.199 billion shares underlying awards. Future “annual dilution” must represent net new awards/issuance, not vesting of this same starting overhang.
2. Target net debt and shares require a cash/share bridge so forecast FCF cannot silently fund both a lower net-debt balance and repurchases that are also assumed to reduce shares.

Specs option value is not added to the primary valuation; it appears only in the SOTP. There is therefore no mechanical cross-method double count, although Specs optionality may also influence the chosen consolidated multiple and should not be presented as an independently observed asset value.

## Publication gate

Before changing the thesis from draft to published:

- [ ] Decide target-date LTM versus target-date NTM and relabel/reforecast consistently.
- [ ] Recalculate reverse expectations from a preserved deterministic schedule.
- [ ] Reconcile the DCF and one-year share/net-debt bridges.
- [ ] Replace ambiguous thesis frontmatter with ledger-compatible values.
- [ ] Freeze exact SNAP and QQQ observation/evaluation conventions and reproducible price evidence.
- [ ] Support or demote the six-month target set.
- [ ] Resolve the Q3 Other Revenue and Specs option-value scenario inversions.
- [ ] Add close citations for material facts and a timestamped forecast cutoff.
- [ ] Keep all three records visibly marked draft until the above checks pass.
