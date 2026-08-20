---
name: revelio-workforce-research
description: "Investigate company-level hiring, departures, workforce composition, tenure, skills, geography, and competitor flows through the user's authorized Revelio Labs access. Use for targeted workforce diligence, hiring or firing questions, organizational change, talent-density proxies, and peer comparisons. Prefer licensed structured exports when available; otherwise use the visible signed-in dashboard. Do not use for credential handling or bulk person-level collection."
---

# Revelio Workforce Research

Use workforce evidence to test a defined company thesis rather than collecting data without a decision question.

## Inputs

Require a company and at least one workforce question. Accept optional peers, functions, geographies, seniority bands, date range, source-log path, and `plan_only` instruction. When `plan_only` is requested, return the dashboard handoff, filters, metrics, comparison design, and expected output without opening Chrome.

Before opening Revelio, define:

- the metric or pattern being tested;
- the comparison period and peer baseline;
- the expected direction if the thesis is correct;
- at least one alternative explanation.

## Choose the access route

1. Read `methodology/RESEARCH_TOOLING.md` and `chrome:control-chrome` before browser work.
2. Use a documented licensed export, API, SDK, MCP, or flat-file delivery when it is already available and authorized for the requested work.
3. Otherwise generate the dashboard URL with:

   ```bash
   npm run research:browser -- open revelio --query "{company}" --dry-run --json
   ```

4. Use the visible signed-in Chrome dashboard. Verify the intended service and company through visible page state without inspecting credentials, cookies, storage, hidden endpoints, or account identity.
5. If the session is signed out or the required product is unavailable, ask the user to sign in or confirm entitlement and stop.

## Run targeted analysis

Use visible dashboard filters or company-level AI Chat for focused aggregate questions. Depending on the thesis, inspect:

- headcount growth and contraction;
- hires, departures, and net flows over time;
- voluntary versus involuntary separation when explicitly supported;
- function, seniority, geography, skills, and tenure mix;
- leadership or engineering concentration;
- origins and destinations of talent flows;
- comparable-company trends over the same period.

Record the exact company entity, metric definition, filter state, date range, as-of date, units, and whether a value is exact, rounded, chart-estimated, or model-inferred. Do not call every departure a firing or infer causality from a correlation.

Avoid person-level collection unless the user asks a narrow research question that requires it and the licensed scope permits it. Do not publish personal profiles or identifying records.

## Preserve provenance

Keep permitted screenshots or exports under `.local/captures/revelio/`; never put them in the tracked tree. In public research, publish only contract-permitted aggregate or derived observations plus original analysis—not proprietary tables, raw exports, or dashboard screenshots.

Log the source as:

- `Access`: `signed-in`;
- `Rights`: `licensed-local-only` unless the applicable agreement grants broader rights;
- `Retrieval`: the documented structured route or `Chrome / Revelio dashboard`;
- `Used for`: the exact thesis question;
- `Verification`: `unchecked`, `checked-against-source`, or `triangulated`, with corroboration in notes;
- `Capture`: `local-note`, `local-source-copy`, or `none`.

Treat Revelio AI Chat output as analyst input, not primary evidence. Cross-check important findings against company disclosures, job postings, LinkedIn aggregates that may legally be cited, or another dataset.

## Return

Return the question, filters, as-of date, aggregate findings, peer context, alternative explanations, limitations, source-log updates, and the next corroboration steps.
