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
method_reviewed_at: 2026-08-31
tags: [website-builder, saas, payments, ai-agents, vibe-coding, founder-led]
---

# Wix at $87.62: the moat moved below the editor

> Draft public research, not personalized investment advice. Source cutoff: 30 August 2026. Reference price: **$87.62** at 29 August 2026 00:15 UTC.

## Two-minute answer

Wix is a contest between two clocks. Artificial intelligence (AI) is making website creation cheaper by the month. Moving the operating machinery behind a live site—domains, customer records, bookings, payments, stores, permissions and workflows—remains slower and riskier. The investment case turns on whether that gap lasts long enough for Wix to move its moat from the editor to the **business state behind the page**.

Wix has shipped a concrete response. Harmony combines prompts with visual editing; Base44 creates applications from prompts; and “headless” interfaces let an outside front end use Wix's backend. Model Context Protocol (MCP) lets compatible AI agents call approved Wix tools and data. Across the reviewed Wix, Base44, Lovable and Replit interviews, founders consistently acknowledge that reliable production use and maintenance remain harder than the demo. None supplies a mature public cohort showing how many paid production applications remain active after 90 or 180 days. The architecture is credible; adoption, retention and economics remain unproved.

At $87.62, the latest explicit 41.850 million basic shares imply equity capitalization of **$3.67 billion**. The model's 45.989 million normalized pre-contingent diluted denominator—which includes current unvested awards and an option and employee-purchase-plan buffer—implies **$4.03 billion**. Applying the second-quarter 49.271 million non-GAAP diluted weighted-average earnings denominator gives an illustrative **$4.32 billion**, not a second point-in-time market capitalization. All three are below the stale $4.88 billion screen value. Wix generated $1.99 billion of 2025 revenue and $573 million of report-calculated raw free cash flow (FCF), but recurring share awards, working-capital inflows, acquisition and restructuring payments and the first-half 2026 investment reset make normalized owner cash materially lower. The full bridge appears below.

The formal valuation is attractive but fragile:

Exact outputs and the joint transition definition are frozen in the [valuation-horizon contract](../valuation/2026-W35-valuation-contract.json).

| Linked fair-value horizon | P10 | P50 / median | P90 | Mean | Probability below $87.62 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Six months — 28 Feb 2027 | $61.12 | $119.16 | $178.23 | **$119.81** | 21.2% |
| Twelve months — 30 Aug 2027 | $62.68 | $130.27 | $205.57 | **$132.52** | 19.5% |

> **Plain-English aside — reading the modeled range.** Sort 100 simulated fair values from lowest to highest: roughly 10 are at or below P10, 50 at or below P50—the median—and 90 at or below P90. These are modeled fair-value percentiles, not the fixed Bear/Base/Bull cases shown later and not forecasts of the traded share price. “Linked” means the same simulated business path is carried through both dates.

The twelve-month median is 48.7% above the reference price and the mean is 51.2% above it. Yet the stricter cash-based cross-check is only **$92** under fixed assumptions, with a median near **$81** across simulated paths. Most of the upside therefore comes from valuing Base44 and platform optionality separately. The model still assigns 9.4% of paths to fair value at least 30% below reference, while 2.7% of paths produce fair value at least 50% below reference.

Sum of the parts (SOTP) values core Wix, transaction services and Base44 separately, while discounted cash flow (DCF) values future owner free cash flow to the firm (FCFF)—cash attributable to lenders and shareholders after operations, reinvestment and the model's charge for future share awards. SOTP alone determines the formal distribution; DCF and cash multiples are cross-checks.

- **At $87.62, Wix is in a starter-buy valuation zone for a diversified investor whose risk limits can absorb the modeled downside. This is an absolute-value assessment, not a formal benchmark-relative portfolio action.**
- Consider adding below roughly **$65** only while the operating thesis remains intact.
- Trim within **$130–$170** unless Base44 economics, core cohorts and owner FCF upgrade; reduce materially above **$170** without a new evidence cycle.

## What must be true

That valuation rests on five observable conditions:

1. Core Creative annual recurring revenue (ARR) and premium subscriptions remain at least stable after removing Base44. ARR annualizes recurring subscription value at a measurement date; it is not recognized revenue or cash.
2. The Partner slowdown is cyclical/executional rather than the first structural migration to AI-generated alternatives.
3. Base44 reaches durable 60%+ gross margin, grows without unlimited marketing and retains users after the build phase.
4. The $150 million restructuring savings become 2027 cash per diluted share rather than being entirely reinvested.
5. MCP/headless makes Wix a preferred backend for agents instead of making Wix invisible and replaceable.

---

## What Wix actually is

The simple description—“a company that lets people build websites”—misses most of the economics. Wix is a bundled platform for small and midsize businesses. A salon, for example, can pay Wix for its site and hosting, add booking and customer-relationship-management software, and process payments through Wix. Those are three economic pools: creation and hosting subscriptions, recurring business software, and lower-margin transactions.

**Partners is an acquisition and management channel across those pools, not a fourth additive stream.** Agencies and freelancers build and manage customer sites, increasingly through Studio. Partner revenue was $750 million in 2025, 37.6% of revenue; adding it to Creative and Business Solutions would count the same revenue twice. Base44 is strategically distinct but is reported inside Creative Subscriptions. It builds database-backed applications from natural-language instructions and was acquired in June 2025.

### The product stack

| Product | Primary user | Why it exists now |
| --- | --- | --- |
| Wix Editor | mainstream self-creator | mature installed base and familiar direct manipulation |
| Wix Studio | agencies/professionals/enterprise | responsive design, code and application programming interface (API) access, collaboration and multi-site management |
| Wix Harmony + Aria | mainstream AI-assisted creator | prompt a complete site, then refine it visually without surrendering control |
| Base44 | app creators/nondevelopers | prompt database-backed applications with login, business rules and live deployment |
| Headless + MCP | developers and external agents | let outside interfaces and agents use Wix's backend business tools |

That breadth also creates product-sprawl risk. Harmony remains a gradual English-only rollout, lacks a custom backend-code path and cannot transfer a site to Editor or Studio without rebuilding; Wix's own help pages disagree on some feature availability. The lineup can serve beginners, agencies and outside agents, but the transition is still uneven.

## The moat: what survives and what does not

### The old moat is mostly gone

Templates, drag-and-drop editing, generic AI copy/images and first-draft site creation are becoming table stakes. Webflow, Squarespace, WordPress and Shopify all have AI assistance. Lovable, Replit, Claude and Codex can generate and deploy increasingly polished interfaces. Base44 founder Maor Shlomo himself distinguishes increasingly commoditized simple sites and front ends from harder production applications. If Wix's defense is “our prompt makes a prettier homepage,” the bear case wins.

### The installed-base moat is operational

A live business site accumulates state:

- domain and domain-name-system settings;
- search-engine-optimization history and inbound links;
- customer/contact records;
- catalog, inventory and orders;
- payments, refunds and fraud settings;
- subscriptions and bookings;
- marketing automations and analytics;
- roles, approvals and client handoff; and
- habit, staff training and support history.

Recreating pixels gets easy before migrating all of that gets safe. Classic Wix sites cannot be exported and hosted elsewhere because the rendering and infrastructure are proprietary, although products, contacts and other business data can partly be exported. That is a real but partly coercive switching cost: it supports retention and can damage advocacy.

Operational friction supports persistence, but Wix's public evidence measures near-term billing visibility rather than permanent retention. Wix publishes neither churn nor cohort retention by product, and premium subscriptions still fell roughly 1% to 6.1 million in 2025. The table below separates contractual visibility from renewal evidence.

### How much revenue is actually “locked in”?

There is no defensible single percentage. Three quantities answer different questions:

| Evidence | Amount | What it proves | What it does not prove |
| --- | ---: | --- | --- |
| Deferred revenue, June 2026 | **$911.6 million** | amounts billed or collected for service not yet recognized; strong next-few-quarter visibility | profit, renewal or permanent lock-in |
| Premium plans annual/multi-year at year-end 2025 | **83%** | most subscribers do not make a monthly cancellation decision | contractual revenue beyond the paid term |
| Analyst-derived core recurring scale before Base44 | about **$1.813 billion** | reported $1.963 billion company ARR less the public $150 million Base44 annualized run-rate framing; the reporting boundary is imperfect | reported core ARR, a guaranteed renewal cohort or directly comparable Base44 ARR |

The safest investable conclusion is that roughly half a year's company revenue is contractually visible through deferred revenue and a much larger share is **economically persistent**, not irrevocably locked. Domains, search-ranking history, payments, bookings, customer records and staff workflows slow migration. Simple brochure sites and new customer starts are exposed first. Any report that turns the 83% billing-duration statistic into “83% locked ARR” is overstating the evidence.

Chief Marketing Officer Omer Shai says Wix follows acquisition cohorts through editor use, paid conversion, collections and marketing payback, and notes that some customers have renewed for ten years. That supports a disciplined measurement culture, not a quantifiable locked-in percentage: actual cohort retention and Base44 payback remain undisclosed. AI can therefore hurt Wix for years through weaker new cohorts before the installed base collapses, making Partner bookings and core Creative ARR more informative than one quarter of total revenue.

Nor does Wix need to suffer mass migration to lose economic control. If an outside agent owns discovery and customer intent, Wix could keep servicing old sites while losing new customers, pricing power and the chance to attach payments or business software. Persistence buys time; it does not guarantee that Wix captures the next dollar of industry growth.

### Twelve-month moat scorecard

Scores are analyst judgments for the next twelve months, not timeless competitive ratings.

| Layer | Score / 5 | Judgment |
| --- | ---: | --- |
| Templates, editor and generic AI creation | **1.0** | rapidly commoditizing |
| Installed domains, data, commerce, payments and workflows | **4.0** | strongest persistence layer; migration remains operationally risky |
| Managed reliability, security, support and accountability | **3.5** | valuable for small businesses, but costly and not unique |
| Studio/agency workflow and channel | **2.5** | real collaboration/management depth, offset by current Partner weakness |
| Base44's hosted application engine, accumulated usage/error data and deployment state | **2.5 today / 4.0 potential** | potential feedback and operating moat; production retention and economics undisclosed |
| Proprietary model weights | **1.0** | cheaper/faster narrow models help economics but open and closed alternatives advance quickly |
| Brand, free funnel and installed distribution | **3.0** | valuable reach; AI-model providers may own more of the future starting interface |

The moat has therefore moved below the editor. Wix does not need to beat Anthropic or OpenAI at general reasoning. It needs to be the dependable backend those agents use: a system whose business records, permissions and actions work safely—and it must retain enough of the customer's spending when another company owns the conversational interface.

### The new moat candidate: agent-accessible business infrastructure

Wix exposes commerce, bookings, payments, events, plans, content and customer-management tools to compatible agents through MCP. It is a built-in Claude connector, works with Cursor and Codex, can create and publish sites, and lets visitor-facing agents use supported public business actions. On 21 July 2026, Wix explicitly positioned its managed payments, bookings, commerce, analytics, security and hosting beneath Claude Code, Claude Design, Codex and Base44.

The practical workflow Wix needs is:

`User intent → outside AI agent → approved Wix tools → preview or staging → human approval for consequential actions → publish → persistent Wix business state`

Permissions, audit trails and reversibility are part of this defense. The risk is that an AI-model provider owns customer attention and eventually chooses or builds another backend. Wix needs adoption data to prove it is becoming the underlying operating platform rather than a transitional connector.

Wix Engineering's 250 controlled evaluations show both progress and the remaining gap. Documentation optimized for agents raised successful command-line completion from 67% to 87%, with 35% fewer model tokens and 9% less time; web-tool tasks reached 80% completion. That is evidence of serious engineering for agents, not safe autonomous operation. Outdated instructions can still increase retries, time and cost sharply.

## Base44: hedge, option and execution risk

Wix's June 2025 purchase-accounting consideration was $92.158 million: $18.058 million of cash plus $74.100 million of initial fair value for revenue-linked contingent consideration. That liability was remeasured to $89.531 million at year-end 2025. Separate founder and employee retention and other cash payments of $42.988 million, plus approximately $8 million of equity awards, extend through 2028. Public interviews describe an annualized revenue pace above $150 million, but Wix does not publish a clean standalone quarter-end reconciliation.

Base44 entered 2026 near zero company-adjusted, or non-GAAP, gross margin. Wix expects roughly 60% in the second half after launching Base 1, a narrower model trained further from open-source foundations, while still routing meaningful work to outside models. Core Creative gross margin was 80% in the second quarter. The contrast is stark:

- core Wix is slower and more durable, with far better economics;
- Base44 is faster, lower margin and more acquisition-intensive; and
- the consolidated story works only if Base44's growth does not consume all core cash.

Abrahami says Wix's narrow model learns from intent, failed prompts and corrections and retrains weekly, which could create a proprietary feedback loop. His internal hairdresser-product exercise suggests that reproducing mature operating logic is harder than reproducing an interface, but it is mechanism evidence rather than a published benchmark.

Shlomo's full 20VC interview locates Base44's harder-to-copy layer in its database, login, integrations, task system and analytics—not prompting alone. That could create switching costs if customers retain production applications and operating state there. Yet he could not state what share of users finish an application or sustain daily use. Prompt reactions are product signals, not evidence of renewal or profit after model usage, credits, marketing, support and retention costs. Defined 90- and 180-day paid cohorts remain the single most important missing evidence.

Base44 subsidized social sharing with build credits and removed an up-front planning step because it delayed the moment users first see something working, even though planning improved the finished application. That is sophisticated acquisition design but means starts and shares can overstate quality. Shlomo reports early bootstrapped profit, yet later cites roughly $400,000 a month of model workload and describes a “terrible” stability and support month as users expanded from roughly 100,000 to three million. European privacy, U.S. health-data and regional-hosting work was also unfinished. Early profit is therefore not evidence of normalized public-company margin.

The founder's own defensibility estimate is more conservative than the valuation narrative. He says the model layer has no real moat and a credible Base44-like product could be rebuilt in roughly six to twelve months. The current defense is a short product lead, integrated runtime/data, velocity, brand, community and Wix distribution. This makes Base44 strategically valuable inside Wix, but argues against a mature-platform multiple before retained production usage is demonstrated.

The cost of running AI models for users' requests remains an additional risk. Shlomo describes model-related cost as the overwhelming relevant expense, expects routing and falling model prices to help and says Base44 can switch providers with limited code changes. That leverage works only while the most capable models remain competitive. If one provider becomes uniquely capable and enters application building, supplier and competitor risk collapse into one.

His claim that Base44 “should probably be worth $8 billion” is founder opinion. The base valuation assigns it $1.68 billion; the bull gives it $4.55 billion. Even the latter remains a fraction of Lovable's latest private mark. That combination—real strategic value but unproved duration—is why Lovable is provocative rather than a usable peer multiple.

## Lovable: the comparison is provocative, not dispositive

Lovable is the right strategic comparison because it is trying to own the same layer Wix wants to defend: the application, accumulated business state, payments and administrative workflows after the first build. Founder Anton Osika describes an “AI cofounder” that could make that bundle sticky. The evidence is much thinner. Across six complete videos and interviews, the only retention disclosure is approximately **85% month-one retention among paying customers** in March 2025. Trial-driven churn was included, the definition was not supplied and the company was too young for month-six data. No later reviewed interview supplies 90-day, 180-day, gross-revenue or net-revenue retention.

Osika also says most paid usage then passed through to model costs, describes loyalty as mixed, acknowledges security was not yet as strong as the best human work and later admits that modifying complicated live products with many users remains unsolved. Lovable automates transaction-tax handling through a merchant-of-record provider—the legal seller that processes customer payments—but it does not eliminate corporate taxes or autonomously incorporate and operate a company. Its GitHub export and self-hosting reduce code lock-in relative to Wix. An April 2026 incident, where users with public-project links could access source code and chat history, shows why production trust remains unfinished.

The product comparison is real; the financing comparison is looser. Lovable raised $400 million at a **$13.3 billion post-money funding value** on 12 August 2026. “Post-money” means the negotiated value immediately after the new financing, including the new cash. TechCrunch reported a company-supplied $500 million June annualized revenue pace, implying 26.6 times that recent pace. Replit's prior $3 billion funding value was about 20 times its reported $150 million pace; its current $9 billion mark is paired with an aspirational $1 billion year-end target, not achieved revenue.

Private financing values can embed special investor rights, illiquidity, option value and a much faster expected growth path. An annualized pace merely scales a recent month or quarter into a yearly number; it is not audited annual revenue. Retention, gross margin and cash burn remain unaudited. Cumulative builders and annualized revenue do not establish durable economics.

The valuation implication is asymmetric:

- applying Lovable's multiple to all Wix is unjustified;
- applying it to Base44 is an aggressive bull case, not a base case; but
- a credible $1.5–3.0 billion Base44 value would represent a large part of Wix's corrected equity value.

## Can frontier model providers replace Wix in twelve months?

They can replace much of the **creation interface**. OpenAI's Codex and ChatGPT Sites already create and deploy lightweight websites and applications; Claude Code runs longer cloud sessions and uses connectors. DeepSeek, Kimi, Qwen and Nvidia's Nemotron show that capable coding and tool use are diffusing beyond closed providers. SemiAnalysis's work points to longer context, parallel agents and more computation while answering rather than a plateau.

The benchmark record is impressive and incomplete. Artificial Analysis's Coding Agent Index leaders score roughly **63–68 overall**, but only **37–55% on questions about an existing codebase**. Anthropic's study of about 400,000 interactive sessions found **29–34% strict verified success** versus **88–89% at least partial progress**; humans still made most planning decisions and expertise improved outcomes. METR's strongest agents reached a roughly **16–20 hour 50%-success task horizon** on clean tasks, but only **6.4 hours on high-messiness work**. These are different tests, not one league table. Together they say agents will make the front end much easier while production verification, ambiguous state and maintenance remain bottlenecks.

The report assumes that the price of an outside-model application-programming-interface step at the same capability falls 20–40% over six months and 35–65% over twelve; the cost of a successful controlled step falls somewhat less because retries and supervision remain. Shlomo identifies the larger risk as a dominant provider that owns the model, cloud, data and workplace distribution, with Google a particularly credible candidate. OpenAI and Anthropic are not the complete threat set.

> **Plain-English aside — cheaper AI cuts both ways.** If an AI task costs 100 today and 50 next year, Base44 may keep more gross profit. Rival builders can also become cheaper, while longer sessions, parallel agents and retries may keep total spending from falling as quickly as the price of one model step. Wix benefits only if better models increase the value of its data, workflows and distribution faster than they commoditize creation.

By August 2027, it is reasonable to expect agents to:

- produce polished multi-page sites;
- redesign from screenshots and natural language;
- integrate standard login, database and payment software connections;
- test, deploy and fix routine bugs; and
- perform ongoing content/catalog changes.

It is less certain they will reliably own ambiguous requirements, reputation, security, disputes, cross-jurisdiction tax, search-ranking continuity and years of maintenance. OpenAI has documented contamination and defects in headline coding benchmarks. “70% benchmark” is not “70% of small businesses autonomously operated.”

Six complete Replit videos and interviews supply the strongest adversarial test. Replit already owns a serious operating layer: isolated places to run code, deployment, databases, login, protected credentials, snapshots that can roll code and data back together, and routing among AI models. It has pushed unsupervised runs from minutes toward hours.

Founder Amjad Masad's admissions are more important than the demos. He says structural moat has not yet been reached, free usage is acquisition spending, advanced testing and parallel agents materially increase model cost, and AI-created authentication and security are dangerous. A newer StrictlyVC interview claims very low enterprise churn and net revenue retention reaching 300% in some cases—meaning some existing-customer revenue tripled after expansion—but provides no consolidated cohort or denominator. His software-as-a-service “apocalypse” case is narrower than the headline: bespoke point tools are exposed, while authoritative business databases such as Salesforce and Workday are more likely to be extended through software connections and MCP than ripped out. Asked about Wix directly, he offers no displacement evidence.

The most likely twelve-month industry state is hybrid:

- AI-model providers own more intent and code generation;
- platforms expose structured actions and state;
- humans approve positioning, risk and exceptions.

On this evidence, the twelve-month base case is erosion of Wix's interface power rather than wholesale backend replacement. Wix must convert agent-driven demand into attached paid services before weaker acquisition and pricing reach the installed base.

That hybrid future makes agent access necessary—but no longer unique.

## Can outside agents use Wix safely?

Here, “agent friendly” means an outside AI agent can discover permitted actions, change business records, deploy work, observe the result and reverse mistakes—not merely generate code. Wix documents broad Codex compatibility and, against the reviewed peer set, offers the broadest managed small-business action set. It discloses no MCP adoption, retained-agent cohort or independent completion rate.

Shopify is the clearest architectural benchmark because agents can operate the storefront while Shopify retains merchant data and transaction execution. Webflow and WordPress expose production agent controls; Replit's and Base44's external-builder MCP interfaces remain in beta; Lovable's is a research preview; GoDaddy exposes production domain and commerce APIs; and Squarespace exposes business APIs but no verified editor control. A connector is therefore table stakes. The differentiators are reliable completion, auditability, reversibility, retained business state and paid-product attachment; code export alone does not move login, data, payments, protected credentials, storage, domains or production configuration.

The architecture shows what these platforms can expose. Customer reviews show whether the resulting bundle is dependable enough to keep.

## Product reviews: the moat paradox in customers' words

G2's live snapshot showed Wix at 4.2/5 from 1,889 reviews, versus Squarespace 4.4/5 from 1,137, Webflow 4.4/5 from 996 and GoDaddy Website Builder 4.1/5 from 189. Capterra showed Wix at 4.4/5 from 10,764 reviews. The repeated positives are ease, templates, rapid no-code launch and integrated business tools. Repeated negatives are pricing/plan complexity, support, speed and limits on advanced customization. The score gap says Wix is competitive, not best-in-class; Wix's economic advantage is breadth and installed operations rather than pure design delight.

Hands-on reviews place Wix Studio between Squarespace's simplicity and Webflow's complexity; one two-year Wix operator found that the all-in-one tools reduced administrative subscriptions, but moving to Studio would require a rebuild. AI-native challengers show the same prototype-delight versus production-maintenance tension. Lovable is the strongest-rated current challenger, while complex maintenance and unpredictable credits recur negatively. Base44's favorable G2 and Capterra samples remain tiny; its larger Trustpilot sample was 2.8/5 from 854 reviews, with 54% one-star, although low-information commentary and review invitations make it unusable as a churn estimate. Complaints about paid repair loops, lost context, publishing, billing and support recur across Base44 and Replit. The economically important failure mode is that users pay for failed agent loops as well as successful output.

These are selection-biased sources, not churn data. The robust qualitative conclusion is that **integration is both the value and the lock-in**. Mainstream owners often prefer one accountable bundle; technical users resent the exit cost. The full [customer-review and agentic-platform audit](../research/2026-08-30-customer-reviews-agentic-friendliness.md) records current cross-platform counts, source-selection limits and the evidence-to-model boundary.

The product evidence says Wix has time, not proof. The financial question is whether it can fund the transition without giving the benefit back through weak cash conversion, dilution or debt.

## Financial quality: growth survived, owner cash weakened

| Fiscal year | Revenue | Bookings | Raw free cash flow | Stock-based compensation | Ending shares, millions |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 2021 | $1.270 billion | $1.419 billion | $28 million | $221 million | 57.254 |
| 2022 | $1.388 billion | $1.472 billion | ($34 million) | $237 million | 56.305 |
| 2023 | $1.562 billion | $1.598 billion | $182 million | $225 million | 57.173 |
| 2024 | $1.761 billion | $1.830 billion | $478 million | $241 million | 56.108 |
| 2025 | $1.993 billion | $2.070 billion | $573 million | $237 million | 54.990 |

Revenue compounded 11.9%; bookings—Wix's non-GAAP measure of revenue plus changes in deferred revenue and unbilled contractual obligations—compounded 9.9%. The second quarter of 2026 remained respectable: revenue was $563 million (+15%), ARR $1.963 billion (+15%), bookings $569 million (+12%), Partner revenue $214 million (+17%) and transaction revenue $72 million (+12%). Yet bookings lagged revenue, Partner trends weakened late in the second quarter, gross margin fell to 66% and first-half raw FCF fell to $128 million.

Management maintains low-to-mid-teens 2026 revenue, low-teens bookings and approximately $420 million of adjusted FCF. This analysis uses $340–360 million of raw FCF because first-half adjusted cash added back $46 million of real acquisition and restructuring payments, with more expected in the second half.

The 2025 cash figure also benefited from $237 million of stock-based compensation, $104 million more deferred revenue and $204 million more accrued and other liabilities. Cash is real; steady-state owner earnings are lower. The model assumes cash taxes normalize upward from 2025's anomalously low cash payment. The owner-cash cross-checks therefore subtract dilution economics, which helps explain why the $92 base DCF is only close to the share price.

> **Plain-English aside — from reported cash to owner cash.** The base bridge is a model assumption, not guidance: $350 million of 2026 raw FCF, plus $40 million of retained savings and $35 million of growth and operating leverage, less a $30 million tax, retention and working-capital reserve, gives $395 million before dilution economics. Subtracting a $110 million future-award charge gives $285 million of cash attributable to shareholders; adding $30 million of normalized after-tax interest produces $315 million of owner FCFF for enterprise valuation.

One model convention matters after that bridge: the owner-cash methods explicitly subtract future-award economics. The formal SOTP treats them differently. The charge affects Base44's owner-cost load and the retained-cash claims path, but is not separately deducted from core enterprise value or added to horizon shares. The core ARR multiple must therefore implicitly absorb recurring future-award economics.

### Debt and macro: adequate liquidity, less freedom

At June 2026, Wix held $960.9 million of cash, deposits, securities and restricted deposits against $500 million of bank debt and a $1.15 billion 0% convertible note, leaving $689.1 million of face net debt. Adding the last-audited $89.5 million Base44 earnout yields the model's $778.6 million central claims bridge. Operating-lease liabilities are disclosed separately because raw FCF already includes lease cash; subtracting the full lease liability without adjusting cash flow would count the leases twice.

The bank borrowing is floating-rate, classified current and must be rolled or repaid during the twelve-month valuation horizon. A one-percentage-point rate move changes annual pre-tax interest by $5 million. Reported liquidity covers the bank balance, although public captions do not permit a clean reconstruction of the collateral restriction. The agreement caps Bank Debt divided by FCF at 2.0 times. The exact lender-defined Bank Debt numerator cannot be reconstructed from public disclosures, and management's adjusted FCF is not proven identical to covenant FCF. Using the full $500 million balance and management's $420 million adjusted-FCF guide gives 1.19 times; this is a conservative diagnostic, not proof of compliance. This is not a solvency thesis; it is a constraint on combining debt repayment, buybacks, acquisitions and prolonged Base44 subsidy.

The 0% convertible note matures in September 2030; zero interest does not make its principal disappear. Below its $210.49 conversion price it remains a $1.15 billion claim. Above that price the model removes the debt and adds roughly 5.464 million conversion shares, while conservatively giving no value to Wix's separate capped-call hedge—options Wix bought to offset some conversion dilution. This prevents the high-valuation cases from ignoring either debt or dilution.

Israel concentration is much higher in expenses and people than revenue. Shekel strength can raise the dollar cost of local payroll; geopolitical stress can interrupt labor or raise the equity risk premium even if customer revenue is globally diversified. The model's 11% base weighted average cost of capital (WACC)—the blended return demanded by lenders and shareholders—is therefore above Damodaran's January 2026 U.S. software anchors while remaining below the erosion-case rate used in fixed-assumption sensitivity work.

The balance sheet can fund the transition. Whether that spending earns a return depends on an organization being rebuilt while it runs.

## Execution: capable, concentrated and disrupted

Wix reported 4,371 employees at June 2026, down 18.1% from year-end after the reorganization. An authorized licensed résumé-based Revelio view showed 5,284 estimated profiles, **-11.5% workforce growth, 23.4% hiring and 34.8% estimated employee departures, or attrition**, in its latest/default view. The underlying observation date was not surfaced and the profile population is not payroll, so the filing count remains authoritative. The right interpretation is simultaneous contraction and recruiting—reallocation around Base44 and AI, not a simple freeze.

Across the named peer set, observed workforce growth ranged from -3.2% to +9.9% and estimated attrition from 11.9% to 37.9%. Wix's -11.5% growth and 34.8% attrition sit toward the disruptive end. The businesses and résumé-profile populations differ, so this is a warning signal rather than a causal comparison; the full peer table remains in the workforce memo.

The mix confirms a substantial engineering base. Roughly 37% of observed profiles are classified as software developers and another 8% as software engineers; software skills have gained share over the longer history. About half of observed profiles sit in Central and Western Asia, with Israel likely dominant based on Wix's filings and office footprint, followed by Eastern Europe, Northern Europe, North America and Southern Asia. The licensed view also suggests that the retained workforce has become more tenured.

Wix still carries a broader marketing, operations and support layer than smaller design-platform peers. Base44's openings lean toward enterprise sales, account management, education and communications: functions that may improve production retention but raise the mature cost floor. Interviews describe several hundred Wix-group contributors while Shlomo retains 41 direct reports. That combination is fast and operationally concentrated.

Abrahami says repeated attempts to replace support with AI failed Wix-scale tests: support is both a near-term trust advantage and a structural cost. In a separate research-and-development interview, leadership says approximately 1,300 engineers registered for more than 100 AI-training sessions and speculates that teams of about twenty can move toward two or three. That explains the ambition behind the 20% cut, while making product judgment and retained platform knowledge the new bottlenecks. Elevated turnover is therefore a transition risk, not merely a source of savings.

Employee reviews show the same tension. Glassdoor has Wix at 4.1/5, with 79% recommending the company and 84% approving the chief executive, but only 59% expressing a positive outlook; Indeed is 3.7/5. Platform disagreement and selection bias preclude a morale estimate, but the approval-outlook gap is consistent with transition anxiety.

Beneath that disruption sits an extraordinarily stable executive team. Abrahami has led since 2006; President and Chief Operating Officer Nir Zohar joined in 2007; Chief Marketing Officer Omer Shai in 2008; Chief Technology Officer Yaniv Even-Haim led research and development from 2010; and Chief Financial Officer Lior Shemesh joined in 2013. That provides institutional memory and platform knowledge. It can also breed insularity; tenure is not evidence of good decisions.

The origin story explains the continuity. Wix began when the founders found building a website for a different startup unnecessarily painful, tested several products on common visual technology and selected websites partly to avoid dependence on another platform. Beauty and direct manipulation were deliberate early priorities. Abrahami describes a decentralized culture in which leaders receive key performance indicators and frameworks, then make most operating decisions, combined with intense work norms and fast hiring and exiting for fit. That culture can repeatedly produce product bets; it can also normalize turnover, overextension and founder-centric judgment.

At 31 January 2026, executives and directors beneficially held 7.2%, including options and restricted stock units. The ownership aligns them economically, but the buyback record is a better capital-allocation test than biography.

### Capital allocation: confidence, not skill

From 2021–2025 Wix spent **$1.6 billion** repurchasing 12.154 million shares at an average $131.65. Outstanding shares fell only 1.038 million from year-end 2020 to 2025. Approximately 91% of gross repurchases were offset by issuance.

The simple explanation is that Wix bought shares from investors while issuing almost as many new shares through employee compensation and other instruments. The company spent substantial cash, but the ownership represented by each remaining share improved only modestly.

The prices were poor: $223.43 average in 2021, $129.75 in 2024 and $162.25 in 2025. In March 2026 Wix then issued 3.267 million shares at $79.591 plus warrants—rights to buy shares later—and used cash and floating-rate debt to repurchase 17.577 million shares through a tender offer at $92. The tender reduced the basic count by about 24% net from January to May, a meaningful per-share step-up, but left the company with approximately $689 million of debt principal minus listed liquid assets, or face net debt.

Management clearly believes the stock is worth more. It has not demonstrated reliable buyback price discipline. Abrahami's 20VC answer framed repurchases as dividend-equivalent and partly an offset to shares issued as stock-based compensation. That is more candid than treating repurchases as proof that management knows the company cannot fail.

## Valuation: why $4 billion, $2 billion and $10–12 billion can all appear plausible

At $87.62, the explicit basic count implies $3.67 billion of equity value, the model's normalized diluted denominator implies $4.03 billion and the second-quarter non-GAAP weighted-average denominator gives the $4.32 billion illustration. Adding face net debt produces enterprise values of approximately $4.36 billion, $4.72 billion and $5.01 billion, respectively.

> **Plain-English aside — who owns which value.** Equity value belongs to shareholders. Enterprise value adds net debt and other financial claims because a buyer of the whole operating business would inherit them. A company with $100 of equity, $30 of debt and $10 of cash has $120 of enterprise value. To turn enterprise value back into per-share equity value, subtract net claims and divide by the applicable diluted share count.

The following methods produce materially different values. Bear, Base and Bull are fixed, unweighted operating narratives; they are not alternative labels for the P10, P50 and P90 distribution percentiles above.

| Method | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Sum of parts (SOTP) | $54 | $127 | $245 |
| Owner-FCFF multiple | $46 | $120 | $205 |
| Owner-FCFF DCF | $28 | $92 | $215 |

The $2 billion equity case—roughly $43–48 per share depending on the share denominator—is a plausible severe downside case: core growth turns negative, Base44's valuation multiple collapses and owner FCFF falls toward the low-$200 millions. It is below the formal twelve-month P10 of $62.68 but close to the $49.40 average across the worst 10% of modeled paths, and remains possible when cash flow and competitive position fail together.

The $4 billion case is approximately today's broader diluted equity value. It assumes Wix remains valuable but Base44/platform option value and owner-cash recovery are not fully proven.

The $10–12 billion case is about $210–255 per diluted share. It requires something close to the bull SOTP: core ARR still growing at a valuation of 3.5 times ARR, Base44 around $350 million ARR at 13 times ARR and improving transaction economics, with current awards and the warrant and convertible conventions reflected. Recurring future-award economics are assumed within the core multiple rather than separately deducted. The case does **not** require Wix itself to receive Lovable's 26.6-times multiple, but it requires Base44 to become a credible high-growth platform and Wix to win agent distribution.

The base-method anchors span roughly **$92–130**: $92 is the fixed-assumption owner-cash DCF cross-check, while $130.27 is the formal twelve-month SOTP median (mean $132.52). The owner-cash DCF median across individual simulation paths is only about $80.51, so the SOTP/DCF gap is disclosed model-form uncertainty rather than a number to hide inside an average.

A reverse DCF puts the current price in operating terms. At $87.62, the base DCF path implies roughly $302 million of starting owner FCFF, close to the report's $315 million base estimate. A stricter test with flat $315 million FCFF supports only about $58.68 per share. The market is therefore pricing durable cash improvement rather than imminent death; most modeled upside still depends on separable Base44 or platform value.

The formal distribution is also sensitive to the analyst-assigned structural weights and Base44 cost assumptions. Moving ten percentage points of model weight from platform win to AI erosion lowers the twelve-month median to **$121.27**, mean to **$118.62**, and raises the below-reference frequency to **28.7%**. A separate case with only 10% platform weight has a $123.39 median and $120.44 mean. Moving Base44's modeled post-gross-profit owner-cost load 15 percentage points lower or higher moves the formal median to $136.53 or $124.36. These are judgment-based stresses, not probabilities learned from a long history of comparable outcomes.

## Strongest bear case

The bear case is not that websites disappear. It is that Wix loses the economic control point:

1. Claude/ChatGPT/Lovable/Replit or a cloud/model provider such as Google become the default starting interface.
2. They bundle or select hosting, database, payments, domains and analytics.
3. Wix keeps servicing an aging installed base but loses new cohorts, pricing power, paid-product attachment and Partner mindshare.
4. Automated migration eventually preserves search rankings and business data well enough to reduce switching friction further.
5. Price/mix can no longer hide paid-subscription decline.
6. Base44 remains a low-margin product built largely around outside AI models, whose marketing and model-running costs absorb core free cash flow.
7. Debt and stock-based-compensation dilution magnify per-share impairment after the tender.

That is the low-$40s equity case described above; the fixed-method bear values span $28–$54. Wix need not “die” for shareholders to suffer severe impairment, and the report makes no traded-price convergence forecast.

## Strongest bull case

The bull case is that AI expands creation rather than destroying platforms:

1. More nontechnical people build sites and apps.
2. Harmony converts prompt users while preserving editable, production-grade output.
3. Base44 compounds toward several hundred million of annual recurring revenue and 60–70% gross margin.
4. Claude/Codex distribute Wix's MCP tools to users who would never visit Wix.com.
5. The installed base attaches more payments, bookings and customer-management software.
6. The restructuring restores owner cash per diluted share.
7. Public markets value Base44 at a fraction of Lovable but no longer at zero.

This supports bull-case fair value of $170–250. It is possible, not proven.

Those scenarios describe business value; the 50% rebound also contains some market-structure noise.

## What the rebound may already reflect

Major holders do not provide a clean signal. The 2025 filing listed Ameriprise, Wellington, Baillie Gifford and Senvest among the largest owners. Baillie Gifford's later percentage rose because the tender reduced Wix's share count even as its absolute holding fell; Wellington subsequently dropped below 5%. Senvest publicly argued that Base44 deserved roughly $2.5 billion while its reportable position fell 22.3% during the second quarter. The filing cannot distinguish tender participation from open-market sales, so the contradiction is context rather than a verdict. Its valuation logic resembles this dossier's Base44 SOTP, but adjusted FCF does not fully charge recurring dilution or restructuring and acquisition cash; equity value must then separately deduct net debt and contingent claims and account for unseasoned retention evidence.

Short interest also fell by approximately 3.45 million shares between 30 June and 14 August while the stock recovered. The decline reduces one potential source of incremental demand; it does not establish how much of the rebound came from covering or what would drive the next move. The operating evidence below is decision-relevant to fair value; it is not a forecast of the next traded-price move.

## What to watch next

Review after the third quarter of 2026 and no later than 15 November:

- bookings growth versus revenue and Partner commentary;
- Creative annual recurring revenue and premium-subscription direction excluding Base44 where disclosed;
- Base44 annual recurring revenue; 30-, 90- and 180-day paid retention; deployed applications still active after 90 and 180 days; the 60% second-half gross-margin target; and marketing payback excluding credit-driven sharing;
- profit from each successfully maintained application after model retries, hosting, support, free credits and payment costs;
- annual contract value and renewals from real enterprise production use, separated from hackathons, prototypes and employees merely using the tool at large companies;
- raw free cash flow rather than adjusted add-backs;
- diluted share count, warrant and restricted-stock-unit issuance, and net debt;
- MCP/headless adoption metrics; and
- employee attrition/critical-role retention after the cut.

Upgrade only if several improve together. A revenue beat powered by Base44 marketing while core Partners weaken is not an upgrade.

## Final judgment

Wix is neither a legacy website builder awaiting obsolescence nor Lovable available at an automatic public-market discount. It is a mature, technically capable small-business platform with real installed operations, a newly leveraged balance sheet, weak historical buyback discipline and a credible but unproven bridge into the agent era.

The key insight is temporal: **new-customer creation is exposed now; installed operational revenue is slower to unwind.** That buys Wix time. Management has shipped concrete responses through Harmony, Base44 and MCP; adoption and returns remain unproved. Partner weakness, workforce disruption, Base44 opacity and owner-cash quality mean investors should still demand proof.

At $87.62, the absolute fair-value case supports a starter position for an investor whose diversification and loss limits can absorb the modeled downside. The model does not forecast traded-price convergence or the return of the Invesco QQQ exchange-traded fund—the Nasdaq-100 benchmark used here—so benchmark-relative expected return remains undefined and the formal stance is **insufficient evidence**. That label is a modeling limitation, not a bearish view.

Existing holders should evaluate concentration separately from fair value. Historical cost basis and unrealized gains do not change the security's value today.

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

The evidence base includes twenty-seven complete public videos, presentations and technical panels: nine Wix, six Base44, six Lovable and six Replit. Transcript claims were retained only as timestamped analysis and checked against playback or primary evidence where material; inaccessible items were excluded. No complete transcript, machine-generated research report, paid-source copy or licensed workforce capture is committed. The distribution remains an uncalibrated shadow forecast: it is judgment-based and has not been validated against enough completed forecasts to claim empirical calibration. The dossier remains draft research.
