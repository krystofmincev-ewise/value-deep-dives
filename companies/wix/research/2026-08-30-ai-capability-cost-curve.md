---
type: company_research
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
as_of: 2026-08-30
source_cutoff: 2026-08-30
topic: ai_capability_and_cost_curve
research_status: draft
---

# Coding-agent capability and inference cost curve: six- to twelve-month implications for Wix and Base44

## Decision answer

The next twelve months are more likely to bring **cheaper, more persistent supervised agents** than dependable autonomous operators of an SMB. That distinction is the fulcrum of the Wix thesis.

- The strongest current coding-agent configurations score **63–68** on Artificial Analysis's August 2026 Coding Agent Index v1.4. The same configurations still score only **37–55%** on its repository-understanding component. The frontier is strong but uneven.
- Anthropic's study of roughly 400,000 real interactive Claude Code sessions found **29–34% verified success** for code-producing sessions, versus **88–89% at least partial success**. Benchmark completion and production completion are not interchangeable.
- Open weights are converging quickly. Kimi K3 reaches an independently measured index of **63**, close to Codex at 65 and Claude Code at 68. DeepSeek's official peak cached-input price is as low as **$0.014 per million tokens** for V4 Flash. Base44's model layer should therefore be treated as a routable input, not the moat.
- Agent workloads are much more input-heavy than chat. SemiAnalysis's public AgentX traces had a **142,000-token median input sequence**, only **444 output tokens**, and 44% of sessions used at least one subagent. Caching, context management, validation and retry rate dominate economics.
- In the base case, the API cost of a fixed-capability coding step falls **20–40% in six months and 35–65% in twelve months**. Cost per *successful* controlled step can fall faster, **25–50% and 45–75%**, because capability and price improve together. Total inference dollars per active builder may fall much less—or rise—because cheaper intelligence induces longer sessions, more parallel agents and more retries.
- The near-term bear case for Wix is not mass migration of established operating sites. It is that first-site and first-app creation becomes nearly free, weakening new-customer conversion and pricing. The bull case is that Wix/Base44 use interchangeable models behind verified business primitives and become the execution substrate for Claude, Codex and other agents.

This is a research memo, not a change to the canonical valuation, report, decision or model. Forecast ranges below are analyst priors, not observed facts or calibrated probabilities.

## 1. What the benchmarks actually say

Artificial Analysis's current [Coding Agent Index methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking/) is materially better than a single SWE-bench score. Version 1.4, current from August 2026, averages three attempts per task over 326 tasks: 113 DeepSWE implementation tasks, 89 Terminal-Bench v2.1 tasks and 124 SWE-Atlas-QnA repository-understanding tasks. It also checks successful Terminal-Bench trajectories for reward hacking. The index is an equal-weight composite of component pass rates.

### Current like-for-like evidence

| Agent and model | Index v1.4 | DeepSWE | Terminal 2.1 | Repository Q&A | API cost/task | Time/task | Tokens/task | Cache hit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Claude Code / Opus 5 xhigh | 68 | 60% | 89% | 55% | $8.17 | 23.7 min | 21.6m | 97% |
| Codex / GPT-5.6 Sol max | 65 | 69% | 83% | 43% | $5.00 | 10.2 min | 13.2m | 90% |
| Kimi Code / Kimi K3 | 63 | 64% | 88% | 37% | $3.08 | 24.1 min | 10.4m | 95% |
| Grok Build / Grok 4.5 high | 64 | 60% | 84% | 48% | $2.44 | 15.5 min | 3.6m | 92% |

Sources: Artificial Analysis's current [Claude Code versus Codex](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex), [Codex versus Kimi Code](https://artificialanalysis.ai/agents/coding-agents/comparisons/codex-vs-kimi-code-cli) and [Codex versus Grok Build](https://artificialanalysis.ai/agents/coding-agents/comparisons/codex-vs-grok-build) pages, accessed 30 August 2026. Artificial Analysis states that cost is pay-per-token API cost; it excludes production infrastructure, engineering and supervision.

Three conclusions matter for Wix:

1. **Agent plus model is the product.** Harness choice, reasoning effort, tools, cache policy and verification can move the result as much as the base model.
2. **Open-model convergence is real.** Kimi K3 is within five index points of the current leader and wins or nearly matches on terminal work. This reduces Base44's dependence on any one lab.
3. **The weakest capability maps to Wix's opportunity.** Repository Q&A remains 37–55% even for the leaders. Understanding an existing, stateful business system is harder than generating a clean new frontend.

### Do not construct a time series from changing benchmark versions

OpenAI's 9 July [GPT-5.6 launch](https://openai.com/index/gpt-5-6/) reported an Artificial Analysis Coding Agent Index score of 80 for Sol max. The current v1.4 like-for-like page reports 65. This is not evidence that GPT-5.6 regressed: Artificial Analysis changed its methodology in July and August, including binary repository-Q&A scoring, a full Terminal-Bench 2.1 task set and reward-hacking review. Headline benchmark points from different versions cannot be used as a model-improvement rate.

OpenAI has separately explained why it stopped relying on [SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) and why coding evaluations need more careful signal extraction in [Separating signal from noise](https://openai.com/index/separating-signal-from-noise-coding-evaluations/). This is why vendor SWE-bench claims are treated as directional only in this memo.

## 2. The production reliability discount

### Real usage is less reliable than clean evaluation tasks

Anthropic's 16 June 2026 [privacy-preserving usage study](https://www.anthropic.com/research/claude-code-expertise) examined about 400,000 interactive Claude Code sessions from roughly 235,000 people between October 2025 and April 2026.

- In code-producing sessions, people in software occupations reached **34% verified success** and other occupations **29%**. The looser “at least partial success” rates were **89% and 88%**.
- Across all sessions, software occupations reached about **30% verified success**, versus **26%** outside software.
- Intermediate or expert sessions reached **28–33% verified success**; novice sessions reached **15%**. Expert users were more than twice as successful as novices.
- Humans made most planning decisions; Claude made most execution decisions.
- Anthropic did not observe whether the artifact ultimately entered production or created economic value. The success labels were classifier-based, although checked against telemetry.

The correct reading is neither “agents fail 70% of the time” nor “agents work almost 90% of the time.” They often make useful partial progress, but verifiable end-to-end completion remains much rarer. Base44 can monetize partial progress only if retries, credits and support do not consume the margin or destroy trust.

### Time horizon is rising, but it measures well-specified work

METR's [February–March 2026 Frontier Risk Report](https://metr.org/blog/2026-05-19-frontier-risk-report/) found the strongest shared model had a roughly **16–20 hour 50%-success time horizon** and a **3–4 hour 80%-success time horizon** on Time Horizon 1.1. The suite was already saturating: only five of 228 tasks were estimated to take humans longer than 16 hours. METR's fitted public-frontier trend since 2024 had a 105-day doubling time, but METR explicitly warns that the current suite cannot precisely measure the frontier.

The messiness split is more decision-relevant. Claude Opus 4.6 measured **17.8 hours** on low-messiness tasks but **6.4 hours** on high-messiness tasks. Early MirrorCode tasks, which were well-specified and easy to hill-climb against visible tests, produced horizons above 100 hours. In contrast, METR's open-ended challenge tasks produced one edge-case success and seven clear failures. One long run created a useful core pipeline but omitted features required for actual production use and contained obvious bugs.

**Plain-English aside:** “A 20-hour time horizon” does not mean the agent can run a business for 20 hours. It means that, on this task distribution, it has a 50% chance of completing work that an expert human is estimated to need about 20 hours to perform.

The implication for Wix is favorable in the near term. Website layout and ordinary code changes are increasingly testable. Brand judgment, a vague business brief, security, payments, tax edge cases, customer support and “what counts as done” are high-messiness work.

### Error compounding still punishes long autonomous workflows

For intuition only, if 50 required decisions were independent and each were correct 99% of the time, the chance all 50 were correct would be about **61%**. At 98% per step it would be **36%**; at 95%, **8%**. Real errors are neither independent nor equally material, and agents can verify or recover, so this is not a forecast. It explains why a small improvement in validation and recovery can matter more than a similar improvement in one-shot code quality.

Wix's moat is therefore not that general models cannot generate pages. It is that Wix can constrain actions to tested primitives, keep authoritative business state, make changes reversible and ask for approval at consequential boundaries.

## 3. Open models: the model layer is commoditizing

| Model family | Primary technical evidence | What is material | What not to infer |
| --- | --- | --- | --- |
| Kimi K3 | [Official repository and technical report](https://github.com/MoonshotAI/Kimi-K3), July 2026 | 2.8tn parameters, 104bn active, 1m context, native multimodality, FP4 weights; open weights; independent agent index 63 | Moonshot's own 88.3 Terminal-Bench and 81.2 FrontierSWE use selected harnesses and do not establish production reliability |
| Qwen3.8 | [Official repository](https://github.com/QwenLM/Qwen3.8), August 2026 | 2.4tn/95bn-active flagship, open weights, 1m-context API model; trained for coding and long-horizon agents | Alibaba's 16-day autonomous-project demonstration is a selected demo, not a success rate |
| Qwen3-Coder-Next | [Technical report](https://arxiv.org/abs/2603.00729), February 2026 | 80bn/3bn-active model trained in executable environments; claimed 70.6–71.3 SWE-bench Verified across three harnesses | SWE-bench Verified is contaminated and much less demanding than operating an arbitrary customer application |
| DeepSeek V4 | [Official release/change log](https://api-docs.deepseek.com/updates/), April–August 2026 | V4 Pro 1.6tn/49bn active, Flash 284bn/13bn active, 1m context, OpenAI- and Anthropic-compatible APIs; official V4 Pro claims 87.9 Terminal-Bench 2.1 | DeepSeek's own evaluations use its harness and max effort; independent Artificial Analysis scores vary sharply by component |
| Nemotron 3 Ultra | [NVIDIA technical post](https://developer.nvidia.com/blog/?p=117924), 4 June 2026 | 550bn/55bn active, hybrid Mamba/Transformer, 1m context, NVFP4; weights available; vendor claims 5x throughput and up to 30% lower task-completion cost | NVIDIA's own table showed only 54% Terminal-Bench 2.0 and 33% EnterpriseOps-Gym; efficiency does not imply frontier reliability |

These releases point in one direction: strong coding, tool use and long context will be available from multiple compatible suppliers. Model differentiation will persist at the frontier, but a vertical product can reserve the expensive model for planning and route patching, extraction, validation and ordinary tool calls to cheaper models.

Base44 founder Maor Shlomo described exactly this architecture before the Wix acquisition: a heavy model plans and cheaper models execute patches. He also said the provider layer was substitutable and gave an example of moving roughly $400,000 of monthly workload with a one-line provider change ([technical interview, 26 August 2025, around 48:02](https://www.youtube.com/watch?v=TKrXyZr6UgM)). That candor is consistent with the market evidence. **Base1's raw intelligence is unlikely to be the durable moat.** The potential moat is vertical training and evaluation data, compact business primitives, user feedback, application state and a reliable execution layer.

## 4. Inference economics: why cheaper tokens do not mean zero COGS

### Current price-performance range

The present market already spans orders of magnitude:

- Anthropic launched [Opus 5](https://www.anthropic.com/news/claude-opus-5) on 24 July 2026 at **$5 per million input tokens and $25 per million output tokens**. Prompt caching receives a 90% discount in Anthropic's published pricing.
- OpenAI's 30 July price update cut [GPT-5.6 Luna](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/) by 80% to **$0.20 input / $1.20 output** per million tokens and Terra by 20% to **$2 / $12**. OpenAI cut Sol API and credit pricing by more than 20% for a three-month promotion on 21 August.
- DeepSeek's mutable [official pricing page](https://api-docs.deepseek.com/quick_start/pricing/), accessed 30 August 2026, lists peak V4 Flash pricing of **$0.014 cached input / $0.44 uncached input / $1.32 output** and V4 Pro at **$0.044 / $1.32 / $3.96**. Off-peak prices are half the peak rates.
- Artificial Analysis's current controlled tasks cost **$2.44–$8.17** for the leading configurations in the table above, despite consuming 3.6m–21.6m tokens. Cache hit rates of 90–97% explain much of the difference between gross token counts and invoice cost.

The lower-cost model is not automatically the lower-cost *successful outcome*. Artificial Analysis reports DeepSeek V4 Flash at about $0.06 per task in Codex, but its index is 50 versus 65 for GPT-5.6 Sol max; V4 Pro's particular Codex configuration scores still lower despite very cheap tokens. The relevant unit is expected cost after attempts, validation, human review, support and failures.

### AgentX shows the real workload shape

SemiAnalysis's public [AgentX methodology and results](https://inferencex.semianalysis.com/blog/agentx-inferencexv3-does-cuda-moat), published 24 August 2026, replay 393 anonymized internal Claude Code traces. The median request had 142,000 input tokens and 444 output tokens. Median inter-turn tool time was 3.84 seconds. Forty-four percent of sessions used at least one subagent, with a median four subagents among those sessions.

This workload has four consequences:

1. **Prefix-cache quality is economic infrastructure.** The agent repeatedly resends most of its history.
2. **Subagents increase useful parallelism and total token demand.** Lower unit costs can increase aggregate spend.
3. **Serving software can change both cost and correctness.** SemiAnalysis documented a cache bug where only 2 of 128 long-context retrieval checks succeeded; after the fix all 128 succeeded. A throughput-only benchmark would have labeled the broken system fast.
4. **Model size alone does not set cost.** Engine, hardware, quantization, cache topology and workload shape move the result.

At a 50-token-per-second-per-user service level, the public [InferenceX cost dashboard](https://inferencex.semianalysis.com/overview) estimated hyperscaler—not API—cost per million total AgentX tokens at:

| Model | Older/reference hardware | Best displayed newer hardware | Reduction | Caveat |
| --- | ---: | ---: | ---: | --- |
| DeepSeek V4 Pro | $0.024 on B200 | $0.011 on GB300 | 52% | Different engine/topology; not Base44's invoice |
| Kimi K3 | $0.105 on B200 | $0.080 on GB300 | 24% | Very large 2.8tn model; difficult to serve |
| Qwen3.5 397B | $0.036 on MI355X | $0.007 on GB300 | 81% | No B200 baseline; different chips and engines |

These numbers should not be plugged into Wix COGS. They are scenario-specific model-serving estimates, excluding provider margin and much of the application stack. They do show why competitive API prices can keep falling and why a sophisticated router can capture a large fraction of the economics.

### Compute supply is still expanding

There is no evidence of a six- to twelve-month compute plateau. Four hyperscalers' official 2026 guidance sums to approximately **$695–720 billion** of capital expenditure: Microsoft about $190bn, Alphabet $175–185bn, Meta $130–145bn and Amazon about $200bn. Definitions differ and the total is not all AI; it is a capacity envelope, not an AI-spend estimate.

- [Microsoft FY2026 Q3 call](https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3): calendar-2026 capex about $190bn, capacity expected to double in two years, supply constrained through 2026.
- [Alphabet 2025 Q4 call](https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx): 2026 capex $175–185bn, mostly technical infrastructure.
- [Meta Q2 2026 results](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx): 2026 capex $130–145bn including finance leases.
- [Amazon 2025 Q4 results](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx): about $200bn of 2026 capex across Amazon, driven materially by AI, custom chips and infrastructure.

NVIDIA's [Q2 FY2027 release](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx) reported $89.0bn of quarterly Data Center revenue, up 117% year over year. NVIDIA says Rubin is now in production; its January [Rubin announcement](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer) claimed up to a tenfold reduction in inference token cost versus Blackwell. That figure is a vendor, workload-dependent target, and customer rollout lags production. It supports direction, not a tenfold twelve-month API-price forecast.

## 5. Quantitative priors for the next six and twelve months

The following ranges are meant to discipline the Wix/Base44 model. They are not direct extrapolations and should be refreshed when benchmark versions or pricing change.

### Capability priors

| Metric | Observed anchor | Six-month base range | Twelve-month base range | Wide downside/upside range | Interpretation |
| --- | --- | ---: | ---: | ---: | --- |
| Stable-suite frontier Coding Agent Index | 63–68 on v1.4 | 69–76 | 73–82 | 64–88 | Compare only on an unchanged or bridged suite |
| Stable-suite repository-Q&A component | 37–55% for three leaders | 50–65% | 58–72% | 40–82% | Proxy for understanding existing state/code, not site aesthetics |
| Strict verified success in interactive code-producing sessions | 29–34% in Anthropic's Oct–Apr cohort | 35–45% | 40–55% | 28–65% | Requires observable successful artifact; still includes human steering |
| High-messiness 50%-success time horizon | 6.4h for Opus 4.6 in Feb–Mar | 12–30h | 20–60h | 8–120h | Most relevant METR prior for ambiguous SMB work; successor suite needed |
| Unassisted end-to-end operation of a low-complexity SMB app/site for a material change | no representative public base rate | 10–25% | 15–35% | 5–55% | Analyst prior; security, payments and ambiguity included |
| Same workflow with a competent human approving consequential actions | partial-success anchor 88–89% | 45–65% | 50–75% | 35–85% | Useful output, not necessarily one-shot completion |

Why the forecast is below a naive 105-day-doubling extrapolation:

- the METR suite is already saturating and has few long tasks;
- higher-messiness tasks lag low-messiness tasks materially;
- real-session verified success is roughly half the leading benchmark pass rate;
- model labs increasingly spend more inference compute per task, which raises capability but not necessarily economics; and
- security, compliance and business judgment are not reducible to repository tests.

Why the forecast is still aggressive:

- frontier labs are shipping high-effort and parallel-agent modes;
- Kimi, Qwen and DeepSeek show frontier techniques diffusing into open models within months;
- executable-environment reinforcement learning targets agent recovery, not only next-token quality;
- one-million-token contexts and preserved reasoning histories reduce context loss; and
- compute supply, new accelerators and inference-software optimization are all expanding simultaneously.

### Cost priors

| Modeled quantity | Six-month base | Twelve-month base | Downside case | Upside case | Primary drivers |
| --- | ---: | ---: | ---: | ---: | --- |
| API price for a fixed-capability coding step | -20% to -40% | -35% to -65% | flat to -20% | -60% to -80% | smaller models, open-model price pressure, caching, new hardware |
| Cost per successful controlled build step | -25% to -50% | -45% to -75% | -10% to -30% | -70% to -90% | price decline plus fewer failed attempts |
| Base44 inference COGS per comparable completed feature | -20% to -45% | -35% to -65% | flat to -20% | -60% to -80% | heavy/light routing, Base1 specialization, cache, provider bargaining |
| Total inference spend per active Base44 builder | -5% to -30% | -10% to -45% | +10% to +50% | -45% to -70% | longer trajectories and subagents offset cheaper units |

The total-spend line is intentionally less favorable than unit cost. AgentX and OpenAI's multi-agent modes make Jevons's paradox concrete: when a useful unit becomes cheaper, users consume more units. Base44 can still expand gross profit if it prices successful work sensibly, but “tokens get cheaper” does not guarantee margin expansion.

Wix's Q2 2026 filing says Base44 entered 2026 near zero non-GAAP gross margin and was expected to reach about 60% in the second half through proprietary models and compute reduction ([SEC-filed results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026052108/secondquarter2026results.htm)). That target is the first empirical test of the cost-curve thesis. A miss would imply that retries, credits, support or usage intensity are overwhelming model-efficiency gains.

## 6. What this means for Wix's moat

### Bear case: capability outruns Wix's product integration

The strongest bear argument is not that Anthropic or OpenAI must build every Wix feature. It is that the agent owns discovery, specification and frontend generation, then selects interchangeable hosting, database, payments and communications APIs. In twelve months:

- attractive brochure sites and ordinary full-stack apps are close to commodity output;
- model labs and coding platforms can route across cheap open models just as Base44 can;
- MCP makes Wix easier to use but also makes Wix less visible and increases the agent owner's bargaining power;
- open export and headless architecture reduce migration friction for new projects;
- Base44 spends heavily on inference and support while the lab captures user mindshare; and
- Wix's legacy editor transition slows its response while new cohorts choose Lovable, Replit, Claude or ChatGPT first.

If strict production success reaches the top of the wide range—above 60% for nontechnical users—before Wix has a coherent agent-native creation and management layer, the threat moves from first-site acquisition into existing operational workloads.

### Bull case: model commoditization strengthens the application layer

The same evidence supports a strong Wix bull case:

- multiple capable suppliers push model cost and dependency risk down;
- Base44 can use a frontier planner sparingly and cheap specialized models for patching, validation and routine actions;
- Wix already owns the difficult primitives: domains, identity, payments, bookings, commerce, CRM, SEO, analytics, hosting, security and support;
- an agent can generate a frontend quickly but still benefits from a tested, reversible system of record;
- the 29–34% strict real-session success rate leaves substantial value for constraints, telemetry, evaluation and human escalation; and
- Wix's MCP/headless approach can let Claude or Codex own the conversation while Wix owns execution and state.

Open models weaken a “Base1 is uniquely intelligent” thesis but strengthen a “Base44 is the cheapest reliable application factory” thesis. The critical asset is not model weights. It is the feedback loop from prompt to generated change to runtime error to user correction to verified outcome, tied to a compact set of business primitives.

### Where lock-in survives

Six to twelve months of model progress most directly attack **creation cost**, not **stateful operating lock-in**. The persistence hierarchy remains:

1. low: a brochure site with little traffic or data;
2. medium: a live domain with SEO history, content and analytics;
3. high: a business with contacts, bookings, payments, inventory, automations and agency workflows; and
4. very high operational friction: a regulated or revenue-critical system requiring auditability, permissions and support.

Agents reduce migration labor at every level. They do not remove data integrity, change-management, customer-impact and accountability risk. Wix should expose the state through agents while keeping irreversible actions permissioned and observable.

## 7. Observable signposts and thesis falsifiers

### Capability signposts

- Artificial Analysis index exceeds 80 **on a stable v1.4-like suite**, with repository Q&A above 65%, rather than a launch-day score on a changed benchmark.
- A third-party longitudinal study shows strict verified success above 50% for nontechnical users on real projects, with production follow-up rather than transcript classifiers alone.
- METR or a successor suite reports high-messiness 80%-success horizons above one working day.
- Model labs demonstrate persistent operation of payments, taxes, domains, customer data and support with incident and intervention rates, not a selected launch demo.

### Wix/Base44 signposts

- Base44 reaches or misses the roughly 60% second-half 2026 non-GAAP gross-margin target.
- Wix begins disclosing cost per successful generation, retries per completed feature, credit refunds/support load or cohort gross margin.
- MCP/headless-created sites and managed actions become material, with retention and business-solution attach comparable to native Wix cohorts.
- Creative subscriptions or new-cohort conversion weaken before consolidated revenue does.
- Base1 improves verified outcome per dollar, not merely internal benchmark accuracy.
- Security incident frequency and time-to-resolution improve as generated applications become more complex.

### Hard falsifiers for the Wix defense thesis

- Claude, ChatGPT, Lovable or Replit bundles reliable domains, hosting, payments, tax, identity, monitoring and support at a price Wix cannot match, with independently verified retention.
- Agents migrate business data and operational workflows—not only the frontend—between platforms with low failure and near-zero human effort.
- Base44's gross margin remains structurally below 50% after the current optimization cycle while growth slows.
- Wix's MCP/headless surface produces no measurable acquisition, attach or retention benefit by August 2027.

## 8. Source register and provenance

All sources were accessed 30 August 2026. No paid SemiAnalysis article text or proprietary table was copied. Public InferenceX pages were used directly. The two SemiAnalysis-related YouTube videos below were discovery-only because YouTube's visible transcript panel did not load; no factual claim in this memo is derived from them.

| Source | Publication date | Evidence/access/rights | Retrieval and use | Verification/capture |
| --- | --- | --- | --- | --- |
| [Artificial Analysis Coding Agent methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking/) | Aug 2026 current v1.4 | Public secondary benchmark; public/link-and-summary | Native web; task count, aggregation, version changes, cost definition | Checked against current comparison pages; no capture |
| [Claude Code vs Codex](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex), [Codex vs Kimi](https://artificialanalysis.ai/agents/coding-agents/comparisons/codex-vs-kimi-code-cli), [Codex vs Grok](https://artificialanalysis.ai/agents/coding-agents/comparisons/codex-vs-grok-build) | Live dashboard, accessed 30 Aug 2026 | Public secondary benchmark; public/link-and-summary | Native web; like-for-like performance, token, cache, time and API-cost data | Cross-checked shared Codex values and v1.4 label; no capture |
| [Anthropic: Agentic coding and persistent returns to expertise](https://www.anthropic.com/research/claude-code-expertise) | 16 Jun 2026 | Primary company research; public/link-and-summary | Native web; real-session success, expertise and task mix | Limitations preserved; no capture |
| [METR Frontier Risk Report](https://metr.org/blog/2026-05-19-frontier-risk-report/) | 19 May 2026 | Independent evaluation; public/link-and-summary | Native web; time horizons, messiness, MirrorCode and challenge-task results | Suite saturation and uncertainty preserved; no capture |
| [OpenAI GPT-5.6 launch](https://openai.com/index/gpt-5-6/), [price update](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/) | 9 and 30 Jul 2026; updated 21 Aug | Primary company release; public/link-and-summary | Native web; pricing, parallel agents, benchmark-version caution | Launch benchmark reconciled to current AA methodology; no capture |
| [Anthropic Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) | 24 Jul 2026 | Primary company release; public/link-and-summary | Native web; price and effort modes | Vendor claims labeled; no capture |
| [Kimi K3 official repository/report](https://github.com/MoonshotAI/Kimi-K3) | Jul 2026 | Primary model report; public/link-and-summary | Native web; architecture, open weights, vendor benchmarks | Capability cross-checked to AA; no weights downloaded |
| [Qwen3.8 official repository](https://github.com/QwenLM/Qwen3.8), [Qwen3-Coder-Next report](https://arxiv.org/abs/2603.00729) | Aug and Feb 2026 | Primary repository/paper; public/link-and-summary | Native web; architecture, open weights, executable RL | Vendor benchmarks caveated; no model downloaded |
| [DeepSeek V4 change log](https://api-docs.deepseek.com/updates/), [pricing](https://api-docs.deepseek.com/quick_start/pricing/) | Apr–Aug 2026; mutable pricing | Primary technical docs; public/link-and-summary | Native web; model sizes, compatibility, vendor benchmarks and token prices | Prices time-stamped because mutable; no capture |
| [NVIDIA Nemotron 3 Ultra](https://developer.nvidia.com/blog/?p=117924) | 4 Jun 2026 | Primary vendor technical post; public/link-and-summary | Native web; efficient architecture and contrasting weak benchmarks | Vendor cost/throughput claims labeled; no capture |
| [SemiAnalysis AgentX methodology](https://inferencex.semianalysis.com/blog/agentx-inferencexv3-does-cuda-moat), [cost dashboard](https://inferencex.semianalysis.com/overview) | 24 Aug 2026 / live | Public industry benchmark; public/link-and-summary | Native web; trace shape, cache correctness, hyperscaler cost | Public pages only; costs not treated as API invoices; no capture |
| [NVIDIA Q2 FY2027](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx), [Rubin](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer) | 26 Aug / 5 Jan 2026 | Primary financial/vendor release; public/link-and-summary | Native web; capacity and hardware-cost direction | Vendor Rubin claim labeled; no capture |
| Microsoft, Alphabet, Meta and Amazon official capex guidance linked above | 2026 results/calls | Primary investor disclosures; public/link-and-summary | Native web; compute-supply envelope | Author summed ranges; definitions differ and not all AI; no capture |
| [Wix Q2 2026 SEC-filed results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026052108/secondquarter2026results.htm) | 5 Aug 2026 | Filing/company results; public/link-and-summary | Native web; Base44 gross-margin target and model-cost commentary | Consistent with existing Wix evidence pack; no capture |
| [SemiAnalysis / Daytona: The Datacenter in 2026](https://www.youtube.com/watch?v=c88l8daXiv4) | 7 Apr 2026 | Public video metadata; signed-in YouTube/link-only discovery | Chrome via repository YouTube workflow; selected for Dylan Patel on agent workloads | Transcript UI remained loading; no factual claim used; no capture |
| [SemiAnalysis / WEKA: AI Token Economics and Prompt Caching](https://www.youtube.com/watch?v=49ouVgCxQos) | 7 Feb 2026 | Public video metadata; signed-in YouTube/link-only discovery | Chrome via repository YouTube workflow; selected for caching economics | Transcript UI remained loading; no factual claim used; no capture |

## 9. Method and limitations

This memo used OpenAI Codex on 30 August 2026 for source discovery, comparison, arithmetic and drafting. Every material factual claim was checked against the linked underlying source. AI output itself was not treated as evidence.

Main limitations:

- coding-agent leaderboards and provider prices change rapidly;
- benchmark suites are not stationary, so apparent score progress can be a methodology artifact;
- vendor model reports are promotional and often choose favorable harnesses or effort settings;
- Anthropic's usage study excludes headless and third-party use and cannot observe final production outcomes;
- SemiAnalysis's AgentX dataset is representative of Claude Code-style long-context traffic, not necessarily Base44's workload;
- Base44 does not disclose token consumption, cache rates, retries, cost per completed feature, retention by usage intensity or mature cohort gross margin; and
- the capability and cost ranges are judgmental model priors, not statistical confidence intervals.
