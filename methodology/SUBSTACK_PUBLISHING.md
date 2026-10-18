# Substack publishing and readership

Established 2026-10-09. Applies prospectively to publication packaging and growth work, not to rewriting historical research outcomes. Private audience data belongs under `.local/`; this public guide contains only reusable methods and public-source metadata.

## The reader promise

Connect the technology to a question a reader cares about: what it can do, what it costs, which business might benefit, or what a valuation assumes. AI economics, company research and hands-on agent experiments can share that promise without pretending every piece serves exactly the same reader.

A useful article brief names the reader, the question, the original contribution, the evidence cutoff, and the one thing the reader should understand after reading. Use [the brief template](../templates/substack-publication-brief.md) when preparing a post.

For a new article or substantive body rewrite, first use [article craft](ARTICLE_CRAFT.md) and its [evidence brief](../templates/article-evidence-brief.md). They connect the research to a supported insight and causal argument, diagnose why revisions are needed, and preserve accepted strengths. The publication brief handles packaging and delivery after that work. Narrow title or factual edits remain narrow.

For an investment article, retain the quantity, horizon, price date and uncertainty of the underlying research. “Could earn” must not become “will earn”; an illustrative scenario must not become a disclosed result. A headline edit does not validate the financial model. Material thesis revisions still follow the research and review standards.

For a technical explainer, state the practical puzzle before internal machinery. Explain what a toy model omits, and separate illustrative timings from measured hardware. Let the native Substack page convey a useful idea before inviting readers into an external interactive artifact.

For a first-person experiment, retain the observed problem, the intervention and what did or did not happen. Do not manufacture anecdotes or convert an experiment into a general productivity claim.

## Publication package

| Part | Editorial decision |
|---|---|
| Headline | Name the subject and tension; use ordinary reader vocabulary. Keep existing strong wording when it already works. |
| Subtitle | Add context, evidence or payoff; do not repeat the title or lead with an unexplained series label. |
| Opening | Establish the question and useful finding before a long apparatus of caveats. Keep decision-critical uncertainty adjacent to the claim. |
| Evidence | Link sources, disclose assumptions, label forecasts and preserve research dates. |
| Visual | Use a legible chart, diagram or image that advances the explanation. Inspect at phone width; do not reduce a full dashboard to an unreadable thumbnail. |
| Navigation | Link a genuinely useful previous/next article and explain why to read it. Keep existing URLs stable. |
| Subscription | Give a specific reason to receive future work. About and welcome email should reflect that promise and offer a short reading path. |
| Discovery | Prepare a standalone Note with a useful observation and the article attached. Avoid empty “new post” announcements, engagement bait and repeated near-identical posts. |

SEO titles/descriptions, article titles/subtitles and social previews are distinct surfaces. Current Substack defaults often suffice when the article wording is clear. Check existing overrides before claiming SEO is updated. Preserve published slugs and all old links.

## Verification through the signed-in browser

1. Record the canonical URL and before-state of the fields/body that will change. Use a focused local backup, not a whole-account export.
2. Make the authorized change through visible controls. Avoid capturing private inboxes, subscriber contact lists, draft access tokens or account data.
3. Allow autosave to finish. Inspect the actual preview and confirm the selected audience, whether email/app delivery is enabled, and whether scheduling is active.
4. Complete publication/update, then verify the live outcome and save a screenshot. For templates, reopen the saved template and check its content. Do not send a test email unless that send is authorized.
5. Record exactly what changed and what was sent. Retain before/after copies locally. Count QA visits as possible measurement contamination, not acquired readers.

At small audience sizes, fix missing delivery and unclear positioning before adding new analytics infrastructure. The native dashboard normally supplies enough evidence for the first iteration. No hidden Substack API, paid growth service or browser-profile transfer is required.

## Four-post measurement design

This is a proposed small-publication experiment, not a platform rule or guaranteed growth recipe. Adapt cadence to the writer; one substantial emailed article per week with two useful Notes separated in time is a manageable starting point. Any send or schedule must be authorized.

Define the goal before observing results. For example: average 20–30 **views** at seven days across the next four articles. Record the median and each result as well so one outlier does not conceal the rest. If the user requests distinct readers, preserve that goal: use a documented per-post deduplicated reader metric if available. Otherwise state that distinct readership cannot be established with the available dashboard and label views and recipient opens as proxies. Publication source-table visitors do not establish per-article unique readers across channels.

Capture at publication and at the chosen age:

- canonical URL, article date, observation timestamp/timezone and age;
- topic/format, title and known packaging/distribution changes;
- total views, recipients and recipient opens/rate, with unavailable values marked missing;
- source-table unique visitors and source window, without assuming cross-source deduplication;
- subscribers attributed to the article; Note clicks/subscriptions where available;
- known audit visits and other obvious limitations.

Do not compare an hour-old essay with a month-old essay as though exposure were equal. Existing-account subscribers do not necessarily originate in Substack recommendations. A tiny numerator does not make a large percentage compelling evidence. Do not identify relatives or subtract an invented family allowance.

Record the metric definition and access date as well as the number. The official metrics guide, rechecked on 18 October 2026, says delivery and open calculations were revised to better include app receipt and viewing; historical rates may increase too. A platform recalculation is not evidence that an editorial change worked. Keep an earlier observation intact and annotate definition changes instead of silently treating recalculated history as a comparable baseline.

Use the results to choose the next change:

| Observed bottleneck | Next action to test |
|---|---|
| No recipients despite intended newsletter delivery | Verify delivery controls on the next authorized send. Do not retroactively flood inboxes. |
| Few identifiable discovery visitors | Test useful Notes, relevant internal links and genuine editorial relationships. |
| Visitors arrive but do not subscribe | Revisit audience fit, About copy and the value of receiving future work. |
| Delivery occurs but few recipients open | Review topic, subject line, cadence and delivery; retain the denominator and avoid conclusions from a handful of people. |
| A post gets attention but no further reading | Add a logical second article and inspect whether the piece delivered its headline promise. |

## AI assistance and platform policy

Substack introduced reader-requested Pangram scans in July 2026 and supports a “How I make this” statement. The official sources below do not establish an automatic AI pass/fail publication gate or a universal ranking penalty. Recheck current policy when this matters; absence of a documented penalty is not proof of every internal ranking mechanism.

The detection guide, rechecked on 18 October 2026, now describes an optional reader preference that labels content classified as entirely AI-generated and content whose author disabled detection. That is a documented display control, not proof of a universal distribution penalty. Accurate process disclosure and evidence-earned originality remain the appropriate editorial response.

Use an accurate process disclosure. Improve originality through real calculations, observations, examples and choices. Never add fake imperfections, conceal AI assistance, invent first-person experience, or treat a detector score as proof of quality or cause of low reach.

## Public source log

Initially accessed 2026-10-09 via public web retrieval; the metrics and AI-detection guides were rechecked publicly on 2026-10-18. Publisher Substack; evidence type official product documentation or official editorial guidance; access public; rights link-only; capture none (only original guidance and metadata retained here). Initial product/UI claims were cross-checked against the live signed-in interface when applicable; the October 18 recheck used public documentation, not account access. Editorial tactics remain hypotheses to test, not causal findings.

| Source and canonical URL | Publication/update date | Intended use and verification |
|---|---|---|
| [A guide to Substack metrics](https://support.substack.com/hc/en-us/articles/5320347155860-A-guide-to-Substack-metrics) | 2026-10-11 update; rechecked 2026-10-18 | Metric definitions, repeat views, delivery, Sources and historical recalculation; original interface check separate from latest public-doc check. |
| [Against Claudefishing](https://post.substack.com/p/against-claudefishing) | 2026-07-21 | Official AI scanning announcement and distinction between current tools and contemplated preferences. |
| [How can I detect AI on Substack?](https://support.substack.com/hc/en-us/articles/50891130623508-How-can-I-detect-AI-on-Substack) | 2026-10-14 update; rechecked 2026-10-18 | Scan surfaces, creator statement and optional reader labels; latest behavior checked in official documentation. |
| [Getting started on Substack Notes](https://support.substack.com/hc/en-us/articles/14564821756308-Getting-started-on-Substack-Notes) | 2026-04-20 update | Native distribution and draft controls; Notes may appear in digests/push. |
| [What is following on Substack?](https://support.substack.com/hc/en-us/articles/18163273015700-What-is-following-on-Substack) | 2026-07-19 update | Followers and inbox subscribers are different relationships. |
| [Recommendations](https://support.substack.com/hc/en-us/articles/5036794583828-How-can-I-recommend-other-publications-on-Substack) | 2026-03-02 update | Recommendation placements and communication side effects; no promised reciprocity. |
| [Category selection](https://support.substack.com/hc/en-us/articles/360042221312-How-can-I-choose-a-leaderboard-category-for-my-Substack-publication) | 2026-06-30 update | Discovery categories; controls verified in Settings. |
| [SEO on Substack](https://on.substack.com/p/substack-seo-guide) | 2023-02-15 | Distinct SEO fields and published-URL risks; older guidance, check current UI. |
| [Formats, style and design](https://on.substack.com/p/posting-consistently-formats-style) | 2023-09-12 | Repeatable formats, additive subtitles and reading prompts; editorial advice. |

AI assistance: OpenAI Codex research and editing, with a GPT-6.1 Sol Ultra editorial review, 2026-10-09. The official sources and observed UI were checked; the growth hypotheses have not yet been validated against a prospective cohort.
