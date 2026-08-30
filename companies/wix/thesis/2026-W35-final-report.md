---
type: company_thesis
forecast_id: null
title: "Wix at $87.62: the moat moved below the editor"
company: Wix.com Ltd.
ticker: WIX
exchange: NASDAQ
coverage_cycle_id: WIX-2026-W35-01
coverage_cycle_path: ../coverage-cycles/2026-W35-01-initial/README.md
valuation_contract_path: ../valuation/2026-W35-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/wix/identity.md
identity_hash: sha256:ad9bea438347400bb39ed0a0e83976dff09cf42bb864bcd4c3803ad053440e65
security_id: wix-ordinary-shares
listing_id: nasdaq-wix
research_status: draft
coverage_status: active
as_of: 2026-08-30
published_at: null
source_cutoff_at: 2026-08-30T17:31:30+02:00
currency: USD
reference_price: 87.62
reference_price_at: 2026-08-29T00:15:00Z
reference_price_source: StockAnalysis_historical_data_S&P_Global_Market_Intelligence
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 62.68
primary_distribution_p50: 130.27
primary_distribution_p90: 205.57
primary_distribution_mean: 132.52
target_horizon: 2027-08-30
evaluation_rule: not_applicable_fair_value_distribution_not_target_price_forecast
target_status: active
review_by: 2026-11-15
benchmark: QQQ_adjusted_close_total_return_same_session_rule
confidence: medium_low
research_stance: insufficient_evidence
absolute_value_assessment: attractive
position_disclosure: long
originating_study: ../research-plan.md
supersedes: null
distribution_method: wix_joint_sotp_capital_path_v4
distribution_calibration_status: uncalibrated_shadow
distribution_seed: 20260830
distribution_sample_count: 100000
method_reviewed_at: 2026-08-30
tags: [website-builder, saas, payments, ai-agents, vibe-coding, founder-led]
---

# Wix at $87.62: the moat moved below the editor

> Draft public research, not personalized investment advice. Source cutoff: 30 August 2026. Reference price: **$87.62** at 29 August 2026 00:15 UTC. Historical purchase price is excluded from the valuation.

## Two-minute answer

Wix is no longer primarily a bet that drag-and-drop website building survives AI. That layer is being commoditized. The investable question is whether Wix can keep owning the **business state below the interface**—domains, hosting, payments, bookings, CRM, commerce, customer data, support and agency workflow—while Claude, ChatGPT, Base44 or another agent becomes the way users ask for changes.

Wix has a credible answer already: Harmony for prompt-plus-visual creation; Base44 for prompt-to-app; and MCP/headless interfaces that let Claude, Codex and other agents create and operate Wix businesses. The “Salesforce approach” is not hypothetical. It is live. What is not proven is adoption, retention or economics. Twenty-seven complete company/founder/executive videos, presentations and technical panels—nine Wix, six Base44, six Lovable and six Replit—reinforce this layer-by-layer view: every AI-native founder concedes that production reliability, maintenance or retained use remains harder than the demo, while none supplies a clean, mature public D90/D180 production-retention cohort.

At $87.62, corrected post-tender equity value is approximately **$3.67 billion basic** or **$4.32 billion on Q2 non-GAAP diluted shares**, not the stale $4.88 billion screen value. The business generated $1.99 billion of 2025 revenue and $573 million of raw FCF, but that headline cash included $237 million of SBC and large liability/deferred-revenue inflows. H1 2026 raw FCF fell sharply as Wix invested in Base44 and restructured.

The formal valuation is attractive but fragile:

Exact outputs and the joint transition definition are frozen in the [valuation-horizon contract](../valuation/2026-W35-valuation-contract.json).

| Linked fair-value horizon | P10 | P50 / median | P90 | Mean | Probability below $87.62 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Six months — 28 Feb 2027 | $61.12 | $119.16 | $178.23 | **$119.81** | 21.2% |
| Twelve months — 30 Aug 2027 | $62.68 | $130.27 | $205.57 | **$132.52** | 19.5% |

The twelve-month median is 48.7% above the reference price and mean 51.2% above it. But the deterministic owner-FCFF base DCF is only **$92**, and the draw-level DCF median is roughly **$81**; the larger upside is SOTP value for Base44/platform optionality. SOTP is therefore the formal method, with DCF and cash multiples retained as non-voting cross-checks instead of being averaged into a falsely precise compromise. Under the elicited weights, the model assigns a 9.4% frequency to fair value at least 30% below reference and 2.7% to at least 50% below. These are target-date fair-value frequencies, not realized-return probabilities.

A regime-weight stress reinforces the caution: moving ten probability points from platform win to AI erosion lowers the twelve-month median to **$121.27**, mean to **$118.62**, and raises the below-reference frequency to **28.7%**. A separate case with only 10% platform weight has a $123.39 median and $120.44 mean. Moving Base44's modeled post-gross-profit owner-cost load 15 points lower/higher moves the formal median to $136.53/$124.36. These are elicited judgments, not calibrated frequencies.

- **Illustrative zero-exposure mapping: $87.62 is a starter-buy valuation zone, not a formal benchmark-relative portfolio action.**
- **User-reported existing roughly 4% WIX: hold / no routine add**, especially alongside the separately reported roughly 8% SNAP position; the full portfolio is unknown.
- Consider adding below roughly **$65** only if no structural falsifier has fired.
- Trim within **$130–$170** unless Base44 economics, core cohorts and owner FCF upgrade; reduce materially above **$170** without a new evidence cycle.

For the user-reported existing long, the approximately 50% gain is irrelevant to prospective value. It matters only if the position has become too large for the investor's private loss budget.

## The thesis in one sentence

**AI will destroy Wix's old editor moat faster than it destroys Wix's installed revenue, and Wix can remain valuable if it turns the agent threat into distribution for its business operating stack—but current disclosure does not yet prove that transition earns enough owner cash.**

## What must be true

1. Core Creative ARR and premium subscriptions remain at least stable after removing Base44.
2. The Partner slowdown is cyclical/executional rather than the first structural migration to vibe-coded alternatives.
3. Base44 reaches durable 60%+ gross margin, grows without unlimited marketing and retains users after the build phase.
4. The $150 million restructuring savings become 2027 cash per diluted share rather than being entirely reinvested.
5. MCP/headless makes Wix a preferred backend for agents instead of making Wix invisible and replaceable.

---

## What Wix actually is

The simple description—“a company that lets people build websites”—misses most of the economics. Wix is a bundled SMB software platform with three overlapping economic lines and one important distribution channel:

1. **Creation and hosting subscriptions.** The legacy Editor, new Harmony and professional Studio products turn free starts into annual/multi-year plans.
2. **Business software.** Bookings, CRM, marketing, memberships, events, stores and other recurring tools raise revenue per site.
3. **Transactions.** Wix Payments and commerce generate lower-margin payment/transaction revenue.

**Partners is a channel across those lines, not a fourth additive stream.** Agencies and freelancers build and manage customer sites, increasingly through Studio. Partner revenue was $750 million in 2025, 37.6% of revenue; adding it to Creative and Business Solutions would double count revenue.

Base44 is a fifth strategic activity but an accounting subset of Creative Subscriptions. It builds full-stack applications from natural language and was acquired in June 2025. The user was recalling Base44, not `n8n`.

### The product stack

| Product | Primary user | Why it exists now |
| --- | --- | --- |
| Wix Editor | mainstream self-creator | mature installed base and familiar direct manipulation |
| Wix Studio | agencies/professionals/enterprise | responsive design, code/API access, collaboration and multi-site management |
| Wix Harmony + Aria | mainstream AI-assisted creator | prompt a complete site, then refine it visually without surrendering control |
| Base44 | app creators/nondevelopers | prompt database-backed applications with auth, logic and deployment |
| Headless + MCP | developers and external agents | expose Wix's backend/business tools wherever the user wants to build |

This coverage creates product-sprawl risk. Wix's current help pages say Harmony remains a gradual English-only rollout, has no custom JavaScript/backend-code path, lacks or limits several apps/features and cannot transfer a site to Editor or Studio without rebuilding. A newer CMS help page already conflicts with the overview's “CMS unavailable” list, evidence of a fast but uneven rollout. Reviews similarly say the expanding editor lineup is confusing and technical users dislike infrastructure dependence. Yet the same breadth lets Wix serve a beginner, agency and outside AI agent without surrendering the business layer.

## The moat: what survives and what does not

### The old moat is mostly gone

Templates, drag-and-drop editing, generic AI copy/images and first-draft site creation are becoming table stakes. Webflow, Squarespace, WordPress and Shopify all have AI assistance. Lovable, Replit, Claude and Codex can generate and deploy increasingly polished interfaces. Base44 founder Maor Shlomo himself distinguishes commoditizing simple sites/frontends from harder production applications. If Wix's defense is “our prompt makes a prettier homepage,” the bear case wins.

### The installed-base moat is operational

A live business site accumulates state:

- domain and DNS;
- SEO history and inbound links;
- customer/contact records;
- catalog, inventory and orders;
- payments, refunds and fraud settings;
- subscriptions and bookings;
- marketing automations and analytics;
- roles, approvals and client handoff; and
- habit, staff training and support history.

Recreating pixels gets easy before migrating all of that gets safe. Classic Wix sites cannot be exported and hosted elsewhere because the rendering/infrastructure is proprietary, although products, contacts and other business data can partly be exported. This is a real switching cost, but partly coercive: it supports retention and can damage advocacy.

The best public evidence is near-term visibility, not permanent lock-in. At year-end 2025, 83% of premium subscriptions were annual or multi-year; RPO was $878 million and deferred revenue $854 million. June 2026 deferred revenue was $912 million. Abrahami says finished Wix sites retain better because owners invest effort in them, but Wix does not publish that cohort comparison. Nor does it disclose gross retention or churn by product, and premium subscriptions fell roughly 1% to 6.1 million in 2025. It is more accurate to say:

- billed/deferred revenue is highly visible;
- operationally embedded sites have moderate-to-high persistence;
- simple brochure sites are increasingly portable; and
- future customer starts are highly exposed.

CMO Omer Shai describes monitoring one-, seven-, fourteen- and twenty-eight-day creation cohorts through registration, editor use, premium conversion, collections and channel spend, and using time-to-return-on-investment rather than a long-range LTV estimate. He also says some customers have renewed for ten years. This supports a consistent acquisition/retention measurement culture; the actual cohort retention and Base44 payback remain undisclosed, so it cannot quantify “locked in” revenue.

AI can damage Wix for years through worse new cohorts before the installed base collapses. That is why Partner bookings and core Creative ARR matter more than one quarter of total revenue.

### How much revenue is actually “locked in”?

There is no defensible single percentage. Three quantities answer different questions:

| Evidence | Amount | What it proves | What it does not prove |
| --- | ---: | --- | --- |
| Deferred revenue, June 2026 | **$911.6m** | already billed cash with future service obligations; strong next-few-quarter visibility | profit, renewal or permanent lock-in |
| Premium plans annual/multi-year at year-end 2025 | **83%** | most subscribers do not make a monthly cancellation decision | contractual revenue beyond the paid term |
| Core recurring ARR inferred before Base44 | about **$1.813bn** | large, mature recurring base | a guaranteed renewal cohort; Wix does not disclose core GRR/NRR |

The safest investable conclusion is that roughly half a year's company revenue is contractually visible through deferred revenue and a much larger share is **economically persistent**, not irrevocably locked. Domains, SEO history, payments, bookings, customer records and staff workflows slow migration. Simple brochure sites and new customer starts are exposed first. Any report that turns the 83% billing-duration statistic into “83% locked ARR” is overstating the evidence.

### Twelve-month moat scorecard

Scores are analyst judgments for the next twelve months, not timeless competitive ratings.

| Layer | Score / 5 | Judgment |
| --- | ---: | --- |
| Templates, editor and generic AI creation | **1.0** | rapidly commoditizing |
| Installed domains, data, commerce, payments and workflows | **4.0** | strongest persistence layer; migration remains operationally risky |
| Managed reliability, security, support and accountability | **3.5** | valuable for SMBs, but costly and not unique |
| Studio/agency workflow and channel | **2.5** | real collaboration/management depth, offset by current Partner weakness |
| Base44 runtime, telemetry and deployment state | **2.5 today / 4.0 potential** | potential feedback/runtime moat; production retention and economics undisclosed |
| Proprietary model weights | **1.0** | cheaper/faster narrow models help economics but open and closed alternatives advance quickly |
| Brand, free funnel and installed distribution | **3.0** | valuable reach; model labs may own more of the future starting interface |

The moat has therefore moved below the editor. Wix does not need to beat Anthropic or OpenAI at reasoning. It needs to be the safest structured substrate those agents call—and to retain enough economics when someone else owns intent.

### The new moat candidate: agent-accessible business infrastructure

Wix's MCP server exposes commerce, bookings, payments, events, pricing plans, blog, CMS and CRM to compatible agents. It is a built-in Claude connector, works with Cursor/Codex and can create, publish and manage sites. Each Wix site also exposes a visitor-facing MCP endpoint for public business information and supported actions.

On 21 July 2026 Wix explicitly positioned its managed payments, bookings, commerce, CRM, SEO, analytics, security and hosting underneath Claude Code, Claude Design, Codex and Base44.

The strategic diagram is simple:

`User intent → Claude / ChatGPT / Base44 → Wix MCP tools → Wix business state and execution`

Claude can become Wix's best interface. This is a stronger defense than trying to beat Anthropic at general intelligence. The risk is that the model lab owns customer attention and eventually chooses or builds another backend. Wix needs adoption data to prove it is becoming the substrate rather than a transitional connector.

There is one underappreciated execution datapoint. Wix Engineering ran 250 controlled agent evaluations across CLI extensions and REST/MCP workflows. Agent-optimized documentation improved CLI completion from 67% to 87%, with 35% fewer tokens and 9% less time; the API task set reached 80% completion under both optimized-doc and skill conditions. This is evidence that Wix is actively engineering for agents as customers, not merely attaching an MCP label. It is also a useful ceiling: 80–87% controlled completion is not safe autonomous operation, and stale skills can sharply increase retries and token cost.

## Base44: hedge, option and execution risk

Wix acquired Base44 for purchase-accounting consideration of about $92 million, including contingent consideration. Additional retention payments extend through 2028. Public interview framing puts Base44 above $150 million ARR, but Wix does not publish a clean quarter-end standalone reconciliation.

Base44 began 2026 near zero non-GAAP gross margin. Wix expects roughly 60% in H2 after launching Base 1, an internally post-trained/fine-tuned model based on open-source foundations; meaningful workloads still route to closed models. It should not be read as foundation-model independence. Core Creative gross margin was 80% in Q2. This makes the key contrast clear:

- core Wix is slower and more durable, with far better economics;
- Base44 is faster, lower margin and more acquisition-intensive; and
- the consolidated story works only if Base44's growth does not consume all core cash.

Abrahami says Wix's narrow model sees intent, failed prompts and corrections, retrains weekly and is faster/cheaper for its task. That could become a proprietary feedback loop. There is no external benchmark or disclosed cohort data proving it. He also describes an internal exercise where a professional team and then Wix's original vertical team failed over roughly three weeks to reproduce the operating logic of a hairdresser product with AI tools. That is mechanism evidence, not a published benchmark.

Shlomo's full 20VC interview makes the strategic bet more precise. Base44's harder-to-copy layer is its homegrown database, authentication, user, integration, task and analytics infrastructure—not prompting alone. It can therefore become a genuine application runtime and create switching costs. Yet when asked what share of users finish an application or reach sustained day-to-day usage, he cannot supply a percentage. Prompt sentiment is useful telemetry; it is not retention, production usage or willingness to pay. This is now the single most important unresolved Base44 question.

Three additional founder interviews sharpen the picture. Base44 subsidized social sharing with build credits and removed an up-front planning step—even though it improved the finished application—because it delayed the visual activation moment. That is sophisticated growth design and a warning that starts/shares can overstate quality. Shlomo says early Base44 earned close to $200,000 profit in May 2025, but later describes roughly $400,000 per month of model workload movable by a one-line vendor switch. Hypergrowth from roughly 100,000 to three million users then produced a “terrible” month for stability/support, unfinished GDPR/HIPAA/regional-data work and reliance on Wix reliability specialists. Early bootstrapped profit is therefore not normalized public-company gross margin.

The founder's own defensibility estimate is more conservative than the valuation narrative. He says the model layer has no real moat and a credible Base44-like product could be rebuilt in roughly six to twelve months. The current defense is a short product lead, integrated runtime/data, velocity, brand, community and Wix distribution. This makes Base44 strategically valuable inside Wix, but argues against a mature-platform multiple before retained production usage is demonstrated.

Inference economics remain an additional risk. Shlomo describes model-related cost as the overwhelming relevant expense, expects routing and falling model prices to help and says Base44 can switch providers with limited code changes. That leverage works only while frontier models remain competitive. If one provider becomes uniquely capable and enters application building, supplier and competitor risk collapse into one.

His claim that Base44 “should probably be worth $8 billion” is founder opinion. The base valuation assigns it $1.68 billion; the bull gives it $4.55 billion. Even the latter remains a fraction of Lovable's latest private mark.

## Lovable: the comparison is provocative, not dispositive

Lovable raised $400 million at a **$13.3 billion** post-money valuation on 12 August 2026. The user’s approximately $12 billion recollection was directionally right but stale. TechCrunch reported a company-supplied $500 million June annualized revenue run-rate, implying 26.6x. Replit's prior $3 billion mark on a reported $150 million run-rate was about 20x; its current $9 billion mark is paired with an aspirational $1 billion year-end run-rate, not achieved revenue.

Private marks are not public market caps. They embed security terms, illiquidity, optionality and a much faster growth path. ARR, retention, gross margin and cash burn remain unaudited.

Lovable is nevertheless the right strategic comparison. Founder Anton Osika wants users' applications and accumulated value to remain on Lovable while the system expands into payments and administrative/finance operations. Across six complete videos/interviews, the only retention disclosure is approximately **85% month-one retention among paying customers** in March 2025. Trial-driven churn was explicitly included, the definition was not supplied and the company was too young for month-six data. No later reviewed interview supplies D90, D180, gross retention or NRR. Osika also says most paid usage then passed through to model costs, describes loyalty as mixed, acknowledges security was not yet as strong as the best human work and later admits that modifying complicated live products with many users remains unsolved. The intended “AI cofounder” could become sticky; cumulative builders and ARR run-rate are not evidence of durable gross margin or retained production cohorts.

The “no taxes” idea needs correction. Lovable's merchant-of-record provider calculates, collects and remits transaction taxes and handles invoices. It does not eliminate corporate taxes or prove autonomous company incorporation/operation. Lovable's GitHub export/self-hosting also reduces code lock-in relative to Wix. An April 2026 incident, where users with public-project links could access source/chat, shows why production trust remains unfinished.

The valuation implication is asymmetric:

- applying Lovable's multiple to all Wix is unjustified;
- applying it to Base44 is an aggressive bull case, not a base case; but
- a credible $1.5–3.0 billion Base44 value would represent a large part of Wix's corrected equity value.

## Can frontier model providers replace Wix in twelve months?

They can replace much of the **creation interface**. OpenAI's Codex and ChatGPT Sites already create/deploy lightweight websites and apps; Claude Code runs longer cloud sessions and uses connectors. DeepSeek V4, Kimi K3, Qwen 3.8/Coder Next and Nvidia Nemotron show that strong coding/tool-use capability and very cheap cached inference are diffusing beyond closed labs. SemiAnalysis's work points to long-context, parallel-agent and inference-time compute scaling rather than a plateau; its AgentX measurements report a median roughly 142,000 input tokens per session, heavy caching and subagent use in 44% of sessions. That architecture lowers unit cost only when state and cache correctness are excellent.

The benchmark reality is simultaneously impressive and incomplete. Artificial Analysis Coding Agent Index v1.4 leaders score roughly **63–68 overall**, but only **37–55% on repository Q&A**. Anthropic's study of about 400,000 interactive sessions found **29–34% strict verified success** versus **88–89% at least partial progress**. METR's strongest agents reach about a **16–20 hour 50%-success task horizon** on clean tasks, but only **6.4 hours on high-messiness work** versus 17.8 on low-messiness tasks. These are not directly comparable tests; together they say agents will make the front end much easier while production verification, ambiguous state and maintenance remain bottlenecks.

The model-supply conclusion is asymmetric. A reasonable six-/twelve-month prior is a 20–40% / 35–65% drop in fixed-capability API step cost, with cost per successful controlled step falling perhaps 25–50% / 45–75%. That helps Base44's gross margin and every competing builder. It makes proprietary model weights a weak moat and makes runtime, state, evaluation, distribution and accountable operations more important. Base44 founder Maor Shlomo identifies the largest risk more broadly: a dominant provider that also owns cloud, data and workplace distribution, with Google a particularly credible candidate. OpenAI and Anthropic are not the complete threat set.

By August 2027, it is reasonable to expect agents to:

- produce polished multi-page sites;
- redesign from screenshots and natural language;
- integrate standard auth/database/payment APIs;
- test, deploy and fix routine bugs; and
- perform ongoing content/catalog changes.

It is less certain they will reliably own ambiguous requirements, reputation, security, disputes, cross-jurisdiction tax, SEO continuity and years of maintenance. Anthropic's aggregate analysis of roughly 400,000 Claude Code sessions found that humans still make most planning decisions and expertise improves outcomes. OpenAI has documented contamination/defects in headline coding benchmarks. “70% benchmark” is not “70% of SMBs autonomously operated.”

Six complete Replit videos/interviews supply the strongest adversarial test. Replit already owns a serious control plane—sandboxed runtime, deployments, databases, auth, secrets, transactional checkpoints and model routing—and has pushed unsupervised runs from minutes toward hours. Masad says structural moat has not yet been reached, free tokens are acquisition spend, advanced testing/parallelism materially expands inference cost and LLM authentication/security is dangerous. The newer StrictlyVC interview claims very low enterprise churn and NRR reaching 300% in some enterprise cases, but does not provide a consolidated cohort or denominator. His “SaaS apocalypse” case is also narrower in the transcript than the headline: bespoke point tools are exposed, while systems of record such as Salesforce and Workday are more likely to be extended through APIs/MCP than ripped out. Asked about Wix directly, he offers no displacement evidence.

The most likely twelve-month industry state is hybrid:

- model labs own more intent and code generation;
- platforms expose structured actions and state;
- humans approve positioning, risk and exceptions.

Wix wins if it is the easiest, most trusted structured platform. It loses if agents bundle a superior managed stack or make reliable full migration trivial.

## Product reviews: the moat paradox in customers' words

G2's live snapshot showed Wix at 4.2/5 from 1,889 reviews, versus Squarespace 4.4/5 from 1,137, Webflow 4.4/5 from 996 and GoDaddy Website Builder 4.1/5 from 189. Capterra showed Wix at 4.4/5 from 10,764 reviews. The repeated positives are ease, templates, rapid no-code launch and integrated business tools. Repeated negatives are pricing/plan complexity, support, speed and limits on advanced customization. The score gap says Wix is competitive, not best-in-class; Wix's economic advantage is breadth and installed operations rather than pure design delight.

Hands-on publisher reviews add two useful details: Wix Studio occupies a middle ground between Squarespace simplicity and Webflow complexity; and an operator who used Wix for two years found the all-in-one tools reduced administrative subscriptions but moving to Studio would require a rebuild. The live cross-platform audit sharpens the AI-native comparison. Lovable is the strongest-rated current challenger—G2 4.6/5 from 377, Product Hunt 4.7/5 from 201 and Trustpilot 4.1/5 from 1,580—while complex production maintenance and unpredictable credits recur negatively. Base44's favorable samples remain tiny on G2 and Capterra, while Trustpilot was 2.8/5 from 854 reviews and 54% one-star. That corpus is contaminated by low-information/non-user commentary and Base44 invites reviews, so it cannot estimate churn. It does replicate complaints about paid repair loops, lost context, publishing/reliability, billing and support. Replit shows the same prototype-delight versus paid-repair tension. The failure mode is economically important: users pay for failed agent loops as well as successful output.

These are selection-biased sources, not churn data. The robust qualitative conclusion is that **integration is both the value and the lock-in**. Mainstream owners often prefer one accountable bundle; technical users resent the exit cost. The full [customer-review and agentic-platform audit](../research/2026-08-30-customer-reviews-agentic-friendliness.md) records current cross-platform counts, source-selection limits and the evidence-to-model boundary.

## Agentic friendliness: necessary, no longer unique

Wix passes the practical Codex test on documentation: its Headless AI toolkit explicitly supports Codex, and its production MCP can create/publish sites and projects, generate platform code, call authenticated site APIs and operate commerce, bookings, payments, events, plans, blog, CMS and CRM. That makes Wix the strongest managed-SMB business substrate in the reviewed set. Classic hosted-site portability remains weak, however, and Wix discloses no MCP adoption, retained-agent cohort or independent completion rate.

The connector is not the moat. Shopify is the strongest architectural benchmark: it makes storefronts agent-addressable while retaining a deep proprietary commerce backend. Webflow MCP 2.0 can build and edit pages, elements, components, styles, variables and CMS headlessly, publish to staging, use workspace permissions and record agent actions in the audit log. Replit's external MCP is beta but can create/update full-stack applications on its integrated runtime. Lovable's research-preview builder MCP can create, inspect, iterate and deploy projects, but currently has full-account scope, consumes live credits and can run SQL with the user's database permissions. Base44 exposes a generally available published-app MCP plus beta builder/backend MCP, docs MCP, CLI, source view/export and two-way GitHub sync; its user-review reliability is the missing proof. WordPress.com has a first-party MCP and GoDaddy now provides agent-oriented domain/commerce APIs, CLI and skills. Squarespace exposes commerce/business APIs but no comparable verified first-party agent control of the page/editor.

The investor conclusion is stricter than “Wix has MCP.” **Agent friendliness is becoming table stakes.** Code export is also not full portability: identity, data, payments, secrets, storage, domains and production configuration may remain on the managed platform. Wix must show that external agents choose its tools because the platform holds valuable business state, complete tasks reliably, preserve permissions and reversibility, attach paid solutions and retain customers. Until Wix reports those outcomes, the agentic surface supports the platform-defense scenario but does not justify a higher probability or multiple.

## Workforce and management: capable, concentrated, disrupted

Wix reported 4,371 employees at June 2026, down 18.1% from year-end after the reorganization. An authorized licensed résumé-based Revelio view showed 5,284 estimated profiles, **-11.5% workforce growth, 23.4% hiring and 34.8% attrition** in its latest/default view. The underlying observation date was not surfaced and the profile population is not payroll, so the filing count remains authoritative. The right interpretation is simultaneous contraction and recruiting—reallocation around Base44/AI, not a simple freeze.

Peer aggregates sharpen the outlier: Squarespace was +1.7% growth / 17.0% hiring / 15.3% attrition; Webflow +9.9% / 38.6% / 28.7%; GoDaddy -1.0% / 20.3% / 21.4%; Shopify -2.5% / 35.4% / 37.9%; Automattic -3.2% / 8.7% / 11.9%. These different businesses and coverage populations are not a causal experiment. They do show that Wix's combination of shrinkage and high churn is unusually disruptive even within a turbulent software labor market.

The observed workforce is technically heavy:

1. The latest occupation view is approximately 37% Software Developer plus 8% Software Engineer; operations/HR and sales/marketing categories are each in the low-to-mid teens, depending on taxonomy.
2. Central & Western Asia accounts for about half of observed profiles, followed by Eastern Europe, Northern Europe, North America and Southern Asia. Israel is likely the dominant country within the first region based on Wix's filings and office footprint, but that country split is an inference rather than a Revelio regional label.
3. Software Development dominates skills, followed by Data Analytics and operating/customer functions.
4. Software engineering and software-development representation rose substantially over the long historical view.

This is not a hollow marketing company. It has the engineering base to integrate Base44 and expose mature APIs. The licensed view also suggests the retained workforce has become more tenured. Wix nevertheless carries a broader marketing, operations and support layer than smaller design-platform peers. Base44's current openings lean toward enterprise sales, account management, education, PR and communications; the future cost base will not resemble the founder's one-person phase. New interviews describe several hundred people contributing across the Wix group, while Shlomo retains 41 direct reports and one person owns billing. That combination is fast but operationally concentrated.

Abrahami says repeated attempts to replace support with AI failed Wix-scale tests: the layer is both near-term trust moat and structural cost. In a separate R&D interview, leadership says approximately 1,300 engineers registered for more than 100 AI-training sessions and speculates that teams of about twenty can move toward two or three. That explains the economic ambition behind the 20% cut, while making product/UX judgment and retained platform knowledge the new bottlenecks. Elevated observed turnover is therefore a transition risk, not merely a source of savings. Glassdoor shows Wix at 4.1/5, 79% recommend, 84% CEO approval and only 59% positive outlook; Indeed shows 3.7/5. Platform disagreement and selection bias preclude a morale estimate, but the CEO/outlook gap is consistent with transition anxiety.

The executive team is extraordinarily long-tenured. Abrahami has led since 2006; President/COO Nir Zohar joined in 2007; CMO Omer Shai in 2008; CTO Yaniv Even-Haim led R&D from 2010; CFO Lior Shemesh joined in 2013. That provides institutional memory and platform knowledge. It also creates insularity and weakens the argument that tenure alone predicts good decisions.

The origin story explains the continuity. Wix began when the founders found building a website for a different startup unnecessarily painful, tested several products on common visual technology and selected websites partly to avoid dependence on another platform. Beauty and direct manipulation were deliberate early priorities. Abrahami describes a decentralized culture in which leaders receive KPIs and frameworks, then make most operating decisions, combined with intense work norms and fast hiring/exiting for fit. That culture can repeatedly produce product bets; it can also normalize turnover, overextension and founder-centric judgment.

At 31 January, executives/directors beneficially held 7.2%, including options/RSUs. The ownership aligns them economically, but the buyback record is a better capital-allocation test than biography.

## Buybacks: confidence, not skill

From 2021–2025 Wix spent **$1.6 billion** repurchasing 12.154 million shares at an average $131.65. Outstanding shares fell only 1.038 million from year-end 2020 to 2025. Approximately 91% of gross repurchases were offset by issuance.

The prices were poor: $223.43 average in 2021, $129.75 in 2024 and $162.25 in 2025. In March 2026 Wix then issued 3.267 million shares at $79.591 plus warrants and used cash/floating debt to tender 17.577 million shares at $92. The tender reduced the basic count by about 24% net from January to May, a meaningful per-share step-up, but left the company with approximately $689 million face net debt.

Management clearly believes the stock is worth more. It has not demonstrated reliable buyback price discipline. Abrahami's 20VC answer framed repurchases as dividend-equivalent and partly an SBC offset, which is more candid than the “insider knows it cannot die” interpretation.

## Outside holders and rally mechanics: useful context, not an oracle

The FY2025 filing showed Ameriprise at 10.9%, Wellington 6.3%, Baillie Gifford 5.9% and Senvest 5.1%, while executives/directors beneficially held 7.2%. A 3 August 2026 Baillie filing reports 2.542 million shares, 6.1% of the smaller post-tender class. The percentage alone is misleading: its absolute position fell from 3.227 million in the latest annual-report table and far more over the longer historical record. Subsequent beneficial-ownership filings also show Wellington below 5%. These are lagged portfolio decisions, not fundamental verdicts.

Senvest publicly articulates the clearest institutional bull case: Wix bought Base44 cheaply relative to Lovable, Studio can take share from WordPress and Base44 deserves a large separate value. Its Q2 public report raised that opinion to roughly $2.5bn while acknowledging Partner deceleration. Its primary 13F simultaneously fell from 3,754,680 shares at March quarter-end to 2,918,880 at June, down 835,800 or 22.3%. The filing cannot distinguish tender participation from open-market sales or motive; its earlier 13G also included 125,641 warrant shares outside the Q1 13F scope. The bullish words and smaller reportable position are a useful contradiction, not an oracle.

The logic is directionally plausible and close to this dossier's $1.68bn deterministic base Base44 SOTP value. Its weak point is the denominator: consensus/adjusted FCF does not fully charge current dilution economics, acquisition/restructuring cash, net debt or unseasoned Base44 retention. Our owner-FCFF and DCF therefore remain materially less generous.

Market mechanics also qualify the 50% rebound. Reported short interest fell from 9.232 million shares at 30 June to 5.777 million at 14 August while the price recovered. Float denominators disagree across secondary services, so only the exact-share series is used. The timing supports an inference that short covering amplified the rally; it does not prove how much. With approximately 3.45 million fewer shares short, some squeeze fuel has already been spent, so the next re-rating requires more operating evidence than the first leg did.

## Financial quality and the 2026 reset

| FY | Revenue | Bookings | Raw FCF | SBC | End shares m |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 2021 | $1.270bn | $1.419bn | $28m | $221m | 57.254 |
| 2022 | $1.388bn | $1.472bn | ($34m) | $237m | 56.305 |
| 2023 | $1.562bn | $1.598bn | $182m | $225m | 57.173 |
| 2024 | $1.761bn | $1.830bn | $478m | $241m | 56.108 |
| 2025 | $1.993bn | $2.070bn | $573m | $237m | 54.990 |

Revenue compounded 11.9%; bookings 9.9%. Q2 2026 remained respectable: revenue $563 million (+15%), ARR $1.963 billion (+15%), bookings $569 million (+12%), Partner revenue $214 million (+17%) and transaction revenue $72 million (+12%). Yet bookings lagged revenue, Partner trends weakened late in Q2, gross margin fell to 66% and H1 raw FCF fell to $128 million.

Management maintains low-to-mid-teens 2026 revenue, low-teens bookings and approximately $420 million adjusted FCF. The dossier uses $340–360 million raw FCF because H1 adjusted cash added back $46 million of real acquisition/restructuring payments and more follows in H2.

The 2025 cash figure also benefited from $237 million SBC, $104 million more deferred revenue and $204 million more accrued/other liabilities. Cash is real; steady-state owner earnings are lower. Taxes normalize upward from 2025's anomalously low cash payment. This is why the valuation subtracts dilution economics and why the $92 base DCF is only close to the share price.

### Debt and macro: adequate liquidity, less freedom

At June 2026, Wix held $960.9m of cash, deposits, securities and restricted deposits against $500m of bank debt and the $1.15bn 0% convertible, leaving $689.1m face net debt. Adding the last-audited $89.5m Base44 earnout yields the model's $778.6m central claims bridge. Operating-lease liabilities are disclosed separately because raw FCF already includes lease cash; subtracting the full lease liability without lease-adjusting FCF would double count.

The bank borrowing is floating-rate and classified current. Public terms make $500m × 100 basis points equal $5m pre-tax annual interest, but the more important risk is capital allocation: the bank facility must be rolled or repaid during the twelve-month valuation horizon, while the 0% convert matures in September 2030. Approximately $457m of liquidity is associated with described collateral at the 28 August shekel rate, although exact legal encumbrance cannot be reconstructed from financial-statement captions. Gross liquidity still covers the bank balance about 1.92x, and a conservative full-$500m covenant numerator is roughly 1.19x management's adjusted-FCF guide versus a 2.0x ceiling. This is not a solvency thesis; it is a constraint on combining debt paydown, buybacks, acquisitions and prolonged Base44 subsidy.

Israel concentration is much higher in expenses and people than revenue. Shekel strength can raise the dollar cost of local payroll; geopolitical stress can interrupt labor or raise the equity risk premium even if customer revenue is globally diversified. The 11% base WACC therefore sits above Damodaran's January 2026 U.S. software anchors while remaining below the erosion-case rate used in deterministic sensitivity work.

## Valuation: why $4 billion, $2 billion and $10–12 billion can all appear plausible

The corrected value at $87.62 is $3.67 billion on explicit basic shares and $4.32 billion on Q2 non-GAAP diluted shares. Face net debt raises enterprise value to $4.36–5.01 billion.

Three methods disagree:

| Method | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| SOTP | $54 | $127 | $245 |
| Owner-FCFF multiple | $46 | $120 | $205 |
| Owner-FCFF DCF | $28 | $92 | $215 |

The $2 billion equity case—roughly $43–48 per share depending denominator—is a plausible severe tail: core growth turns negative, Base44 multiple collapses and owner FCFF falls toward the low-$200 millions. It is below the formal twelve-month P10 of $62.68 but close to the $49.40 bottom-decile mean, and remains possible when cash flow and competitive position fail together.

The $4 billion case is approximately today's normalized diluted equity value. It assumes Wix remains valuable but Base44/platform option value and owner-cash recovery are not fully proven.

The $10–12 billion case is about $210–255 per diluted share. It requires something close to the bull SOTP: core ARR still growing with a 3.5x multiple, Base44 around $350 million ARR at 13x, improving transaction economics and no material dilution. It does **not** require Wix itself to receive Lovable's 26.6x multiple, but it requires Base44 to become a credible high-growth platform and Wix to win agent distribution.

The base case is between: roughly **$92–130**, with the formal twelve-month SOTP median $130.27 and mean $132.52. The draw-level owner-cash DCF median is only about $80.51, so the SOTP/DCF gap is disclosed model-form uncertainty rather than a number to hide inside an average.

## Strongest bear case

The bear case is not that websites disappear. It is that Wix loses the economic control point:

1. Claude/ChatGPT/Lovable/Replit or a cloud/model provider such as Google become the default starting interface.
2. They bundle or select hosting, database, payments, domains and analytics.
3. Automated migration preserves SEO and business data well enough to eliminate switching friction.
4. Wix keeps servicing an aging installed base but loses new cohorts and Partner mindshare.
5. Price/mix can no longer hide paid-subscription decline.
6. Base44 remains a low-margin model wrapper whose marketing and inference absorb core FCF.
7. Debt/SBC magnify per-share impairment after the tender.

That path can take the stock toward $40 without Wix “dying.”

## Strongest bull case

The bull case is that AI expands creation rather than destroying platforms:

1. More nontechnical people build sites and apps.
2. Harmony converts prompt users while preserving editable, production-grade output.
3. Base44 compounds toward several hundred million ARR and 60–70% gross margin.
4. Claude/Codex distribute Wix's MCP tools to users who would never visit Wix.com.
5. The installed base attaches more payments, bookings and CRM.
6. The restructuring restores owner cash per diluted share.
7. Public markets value Base44 at a fraction of Lovable but no longer at zero.

This supports $170–250. It is possible, not proven.

## What to watch next

Review after Q3 2026 and no later than 15 November:

- bookings growth versus revenue and Partner commentary;
- Creative ARR/premium subscription direction excluding Base44 where disclosed;
- Base44 ARR; D30/D90/D180 paid retention; deployed apps still active after 90/180 days; 60% H2 gross-margin target; and marketing payback excluding credit-driven sharing;
- contribution margin per successful maintained application after inference retries, hosting, support, free credits and payment cost;
- enterprise production ACV/renewal separated from hackathons, prototypes and “users from” large companies;
- raw FCF rather than adjusted add-backs;
- diluted share count, warrant/RSU issuance and net debt;
- MCP/headless adoption metrics; and
- employee attrition/critical-role retention after the cut.

Upgrade only if several improve together. A revenue beat powered by Base44 marketing while core Partners weaken is not an upgrade.

## Final judgment

Wix is not Fiverr with a new AI label, and it is not Lovable at a public-market discount. It is a mature, technically capable SMB platform with real installed operations, a newly leveraged balance sheet, weak historical buyback discipline and a credible but unproven bridge into the agent era.

The key insight is temporal: **new-customer creation is exposed now; installed operational revenue is slower to unwind.** That buys Wix time. Harmony, Base44 and MCP show management is using the time intelligently at the product level. Partner weakness, workforce disruption, Base44 opacity and owner-cash quality mean investors should still demand proof.

At $87.62, the expected-value case is attractive enough for an investor with no exposure to buy a starter position. For the user-reported existing roughly 4% WIX holding—alongside roughly 8% in SNAP—the same evidence supports hold / no routine add until either price falls toward $65 without a falsifier or operating proof improves. The reported 50% gain does not enter fair value.

## Evidence map

- [Financials and capital allocation](../research/2026-08-30-financials-capital-allocation.md)
- [Product, moat and AI competition](../research/2026-08-30-product-moat-ai-competition.md)
- [Interviews, leadership and workforce](../research/2026-08-30-interviews-leadership-workforce.md)
- [Full YouTube interview analysis](../research/2026-08-30-youtube-transcript-analysis.md)
- [AI capability outlook](../research/2026-08-30-ai-capability-outlook.md)
- [AI capability and cost-curve evidence](../research/2026-08-30-ai-capability-cost-curve.md)
- [Workforce, product-review and interview update](../research/2026-08-30-workforce-product-reviews-update.md)
- [Debt, macro, ownership and quality-of-earnings audit](../research/2026-08-30-debt-macro-ownership-qoe.md)
- [Model-input ledger and reverse DCF](../valuation/2026-W35-model-inputs.md)
- [Valuation](../valuation/2026-W35-valuation.md)
- [Decision](../decisions/2026-W35-decision.md)
- [Source log](../sources.md)

The [position disclosure](../disclosures/2026-08-30-user-reported-position-history.md) is user-reported and not broker-verified. Multiple Codex subagents performed bounded novel research, financial/model review and adversarial analysis; retained claims were checked against the listed underlying sources. Twenty-seven complete visible YouTube video/presentation/panel transcripts—nine Wix, six Base44, six Lovable and six Replit—were reviewed sequentially. The original twenty-three-video temporary-export process estimated roughly 239,000 words; four additional full transcripts were then reviewed. Because all temporary transcripts were deleted by design, word count is only an order-of-magnitude workflow measure, while the timestamped analysis is the retained evidence. Two unavailable Lovable videos and two SemiAnalysis videos whose transcript panels failed were catalogued but excluded from transcript-derived claims. Gemini's standard signed-in research surface was used only as a secondary discovery aid after its dedicated Deep Research control proved unavailable; retained claims were verified at underlying sources, and inaccurate suggestions were rejected. No complete transcript, Gemini output, paid-source copy or licensed workforce capture is committed. The dossier remains draft research and the formal distribution remains an `uncalibrated_shadow`; a fresh hash-bound independent review is required after the canonical files are frozen.
