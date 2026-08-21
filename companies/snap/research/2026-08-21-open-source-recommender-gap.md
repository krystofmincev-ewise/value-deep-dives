---
type: research
title: Snap, open-source recommendation systems, and the Meta gap
status: draft
as_of: 2026-08-21
source_cutoff_at: 2026-08-21T16:15:00+02:00
related_companies: [SNAP, META]
tags: [recommendation-systems, advertising, artificial-intelligence, open-source, valuation]
---

# Snap, open-source recommendation systems, and the Meta gap

**Evidence cutoff:** 21 August 2026

**Question:** Can public recommendation research, open-source software, pretrained models, and rented accelerators let Snap improve recommendations at a fraction of Meta's cost—and does that materially narrow the valuation risk?

**Source boundary:** Production and financial figures are issuer disclosures unless explicitly described otherwise. Public papers and repositories establish that an architecture or implementation exists; they do not establish current production deployment, independent replication, or economic parity.

## Bottom line

The answer is **yes for a meaningful part of the technical problem, but no for the whole economic system**.

Open source has made it cheap to reproduce the *shape* of a modern recommender: candidate retrieval, approximate-nearest-neighbour search, multi-task ranking, long-sequence user models, distributed embedding training, multimodal content features, and increasingly generative retrieval. Snap does not have to rediscover Meta's research from first principles or fabricate its own accelerator to participate. It already uses public frameworks and rented Google accelerators, and it says that moving its advertising training to tensor processing units cut training cost by more than two-thirds. [Snap advertising-ranking engineering overview](https://eng.snap.com/machine-learning-snap-ad-ranking)

Snap is also technically further along than a simple “fast follower” description suggests. Its disclosed Bento platform is industrial-scale; its Universal User Model has been launched across several surfaces and has reported online A/B lifts; its Spotlight retrieval system has reported double-digit viewing gains; and Snap researchers have published their own generative-recommendation work and code. The main risk is therefore not that Snap cannot construct a competent recommender.

The remaining gap is hardest where the money is. A downloadable model does not contain Meta's user histories, advertisement-level conversion labels, bids, budgets, cross-placement responses, agency integrations, experimentation throughput, or auction density. Meta's custom silicon is also designed to reduce the marginal cost of continually scaling models. Open source lowers Snap's research and implementation cost, but it does not download Meta's marketplace.

The most likely investment consequence is asymmetric:

- **Content recommendation should improve materially.** Snap owns frequent watch, skip, replay, share, favourite, search, and creator-interaction signals on Spotlight and Stories. Public vision-language encoders and sequence architectures help cold start and content understanding.
- **Advertising recommendation should improve, but relative economic parity is less likely.** Better models can raise return on advertising spend, yet sparse purchase labels and thinner auctions constrain the benefit.
- **Technical-obsolescence risk is lower than the previous memo implied.** Confidence that Snap has a credible production stack rises from medium to **medium-high**.
- **Confidence in closing Meta's monetisation gap remains medium-low.** The valuation and hold/no-add decision do not change until product gains appear in North American engagement, effective advertising price, conversion economics, and infrastructure efficiency.

In one sentence: **the architecture gap can narrow faster than the revenue gap**.

---

## 1. How difficult is it to build a recommendation engine?

The phrase covers four very different achievements.

The time and team descriptions below are order-of-magnitude engineering judgements, not disclosed Snap or Meta staffing estimates.

| Achievement | What can be built | Practical difficulty | What it proves |
|---|---|---:|---|
| Demonstration | A user/item embedding model on MovieLens; nearest-neighbour retrieval; an offline hit-rate | Hours to days for a competent engineer | The basic mechanism works |
| Useful product | Two-stage retrieval and ranking, content features, event logging, simple experiments, abuse filters | Months and a small cross-functional team | A product can personalise a bounded catalogue |
| Large production platform | Multiple surfaces, billions of predictions, streaming features, continuous training, calibration, budget pacing, privacy and safety controls | Years and many specialised teams | Reliable industrial operation |
| Frontier advertising system | Trillion-scale sparse models, vast interaction and conversion history, real-time auction, custom kernels and silicon, thousands of accelerators | A permanent company-wide programme | A moving cost/quality frontier |

[TensorFlow Recommenders](https://github.com/tensorflow/recommenders) includes the data-to-deployment workflow and a compact MovieLens example. Google's [ScaNN](https://github.com/google-research/google-research/tree/master/scann), Meta's [Faiss](https://github.com/facebookresearch/faiss), and other public vector-search libraries make high-quality candidate retrieval accessible. This is genuine commoditisation—but it mainly collapses the first step and portions of the second and third.

Snap is already in the third category. Its engineering disclosures say Bento supports more than 500 models, more than one billion predictions per second, over 100,000 daily training-compute hours, and an approximately 800-terabyte feature store. That does not establish parity with Meta or efficient returns, but it rules out the idea that Snap's task is to “build a recommender” from scratch. [Snap Bento](https://eng.snap.com/introducing-bento)

The investment question is narrower: **how cheaply and quickly can Snap move its existing system closer to the frontier, and can the marketplace monetise the gain?**

---

## 2. The production stack: what is public and what remains proprietary

| Layer | Public building blocks and research | Commoditisation | Snap position | What does not transfer |
|---|---|---:|---|---|
| Policy and eligibility | Rules engines, classifiers, public language/vision encoders | Medium | Production | Snap-specific safety policy, legal decisions, moderation operations |
| Content understanding | Open language and vision models; multimodal fine-tuning | High and rising | Production; issuer reports DPA gains from LLM/VLM features | Snapchat-native labels, product catalogue quality, safety context |
| Candidate retrieval | Two-tower models, HNSW, Faiss, ScaNN, semantic IDs | High | Production in Spotlight and ads | Live user/item inventory and retrieval feedback |
| Ranking | Wide & Deep, DeepFM, DCN, MMoE, PLE, sequence transformers | High | Production multi-task advertising ranking | Proprietary labels and objective weights |
| Cross-surface user modelling | Transformers, HSTU-style long sequences, transfer learning | Medium-high | Universal User Model in production | Eligible cross-surface histories and experimentation feedback |
| Online/fresh learning | Monolith-style dynamic embeddings, streaming features, incremental updates | Medium | Moving from days toward two-hour cycles | Stable production data plane, incident tolerance, real-time labels |
| Calibration and debiasing | Public off-policy, causal, calibration, and exploration research | Medium | Known production problem | Counterfactual outcomes, holdouts, purchase delays, privacy loss |
| Auction and pacing | Public auction literature and optimisation methods | Medium for algorithms | Production | Bids, budgets, advertiser diversity and enough competition per impression |
| Distributed training and serving | TorchRec, public kernels, cloud GPUs/TPUs | Medium-high | Bento plus cloud accelerators | Meta's workload-specific kernels, fleets, procurement, capacity utilisation |
| Custom silicon | Published design ideas; cloud access to third-party accelerators | Low | Rents accelerators; no need to own a chip | Meta's MTIA economics and hardware/software co-design |

The table explains the apparent contradiction. Most algorithms are reproducible; most economic inputs are not.

### The low-hanging fruit is real

The most transferable improvements for Snap are:

1. **Better cold start from pretrained language and vision models.** A new Spotlight clip or product advertisement can be understood from video, image, audio, caption, and catalogue content before it accumulates clicks.
2. **Cross-surface transfer.** Common events such as views and Lens interactions can improve representations used for rarer tasks such as purchase prediction, subject to privacy and eligibility controls.
3. **Fresher learning.** Shorter training cycles reduce the delay between a trend, a new creative, or a shift in user interest and the model's response.
4. **Semantic identifiers and generative retrieval.** These can share statistical strength across similar items and reduce dependence on a mature interaction history.
5. **Distillation, quantisation, sharding, and better accelerators.** Public software and cloud hardware let Snap buy much of the efficiency frontier without financing a semiconductor programme.

These are especially valuable to a weaker baseline: a smaller platform can collect meaningful absolute improvement without matching the leader.

### The irreducible part is also real

For an advertising system, model quality is conditional on the training set and the marketplace. Snap cannot download:

- the sequence of advertisements every Meta user saw and how each responded;
- rare purchases and high-value conversion labels supplied to Meta;
- the losing ads and bids in Meta's auctions;
- Facebook/Instagram cross-placement behaviour;
- advertiser budget, creative, and agency workflow history;
- Meta's experiment archive and operational knowledge;
- the extra bid competition that converts better prediction into price.

Better code can improve the probability estimate. It cannot manufacture a second qualified bidder.

---

## 3. Why the open-LLM analogy is only partly right

The useful analogy is that public research, weights, kernels, and evaluation methods prevent a smaller company from falling permanently behind the published frontier. A good open vision-language model can give Snap content understanding that would once have required expensive pretraining. Public recommender repositories similarly reduce the cost of implementing retrieval, ranking, sharding, and serving.

The misleading analogy is that recommender value resides mainly in downloadable weights.

An open language model arrives with broadly useful knowledge learned from a large corpus. A large part of a social recommender's knowledge is **ephemeral and platform-specific**:

> user 483's rapidly changing interest in creator 91; whether advertisement 7 converts for that user in Spotlight at 21:05; whether a competing advertiser will bid; and whether the conversion would have happened anyway.

Those identifiers and outcomes do not transfer between platforms. They are learned continuously from each platform's own event stream. Public code provides the learning machine, not the lived history.

This leads to a more precise comparison:

| Claim | Assessment |
|---|---|
| Snap can adopt state-of-the-art architecture at a fraction of Meta's research cost | **Likely true** |
| Snap can use public pretrained models to improve content understanding and cold start | **Likely true**; the LLM/VLM mechanism is visible in issuer tests, but Snap does not disclose the base-weight provenance |
| Snap can avoid owning custom silicon and still make material gains | **True**; rented TPUs have already reduced its reported training cost |
| Snap can reproduce Meta's production model with public code alone | **False** |
| Snap can close most of the advertising yield gap at a fraction of Meta's total cost | **Unproven and unlikely without marketplace improvement** |

“Fraction of Meta's cost” is therefore defensible for **architecture research and model pretraining**, not for the total system or for revenue parity. Meta's capital expenditure and Snap's infrastructure bill both support many workloads, so dividing one by the other would create a false precision that the disclosures do not support.

---

## 4. What Snap has actually demonstrated

### 4.1 Spotlight retrieval already uses the standard modern pattern

Snap describes a two-tower Spotlight retrieval model in which a user encoder and a story encoder produce vectors; an approximate-nearest-neighbour service then retrieves candidates before ranking. The system serves tens of thousands of feed requests per second against millions of story documents. Snap reported double-digit gains in both views and view time after deployment. These are issuer-selected online results, not an independent comparison with TikTok or Instagram. [Snap embedding-based Spotlight retrieval](https://eng.snap.com/embedding-based-retrieval)

This is important because it shows public architecture translating into Snap production, not merely appearing in a research notebook.

### 4.2 Universal User Modeling has online, cross-surface evidence

The Universal User Modeling paper uses eligible histories from content, advertising, augmented-reality Lenses, notifications, and growth surfaces. It reports sequences of as many as 5,000 raw events and training subsequences of 800 events, and says the representations were launched in production. Reported A/B changes include:

| Surface metric | Reported change |
|---|---:|
| Long-form video open rate | +2.78% |
| Long-form video view-time sum | +19.2% |
| Long-form video view time per user | +0.28% |
| Lens play time | +1.76% |
| Notification open rate | +0.87% |
| Application-open daily active users | +0.04% |
| Content-view daily active users | +0.08% |

Source: Snap-authored [Universal User Modeling paper](https://arxiv.org/abs/2504.21838).

The distinction between the rows matters. Large surface-level percentage changes can coexist with very small platform-wide daily-user changes. The evidence supports useful product improvement; it does not support a claim that one model transforms total engagement.

### 4.3 Snap is contributing to the frontier

Snap Research's [GRID paper](https://arxiv.org/abs/2507.22224) and [public repository](https://github.com/snap-research/GRID) explore generative recommendation with semantic identifiers derived from large-model item representations and a transformer-based recommendation model. This is research evidence rather than disclosed financial impact, but it weakens the characterization of Snap as dependent only on competitors' old ideas.

Snap's AutoCDSR work also reports a plug-in modification for cross-domain sequential recommenders with public-benchmark improvements in Recall@10 and NDCG@10 across SASRec and BERT4Rec baselines. It should be treated as offline academic evidence, not a production lift or revenue proxy. [AutoCDSR paper](https://arxiv.org/abs/2505.21811)

### 4.4 Cloud accelerators are a viable alternative to a Snap chip

Snap's advertising-ranking account describes billions of training rows, hundreds of millions of model parameters, multi-stage retrieval/ranking, multi-task models, and daily retraining. Its move to Google tensor processing units reportedly reduced training cost by more than two-thirds. [Snap advertising ranking](https://eng.snap.com/machine-learning-snap-ad-ranking), [Snap TPU training](https://eng.snap.com/training-models-with-tpus)

In its 14-year engineering letter, Snap says a streaming log-join reduced end-to-end data latency by about two hours, model training is moving from multi-day cycles toward roughly two-hour cycles, and dynamic embeddings removed a prior model-size cap. These are direction and infrastructure claims; the investment proof still lies in engagement and auction economics. [Snap 14-year letter](https://newsroom.snap.com/14-year-letter)

### 4.5 Some model gains are reaching lower-funnel products

Snap reported that an LLM-based intent system improved Dynamic Product Ad purchase conversion by about 2% and a fine-tuned vision-language similar-product model produced a high-single-digit lift in the first quarter of 2026. In the second quarter it reported Dynamic Product Ad revenue up 43%, application-purchase volume up 128%, cost per application install down 8%, and cost per application purchase down 18%. [Q1 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm), [Q2 2026 prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf)

The causal chain is incomplete. Product-specific growth can start from a small base, and mix, advertiser demand, measurement, and creative also change. The figures are consistent with technical progress; they do not isolate the recommendation model's contribution.

### 4.6 Current people and production evidence support the fast-follower case

Snap's July 2026 SIGIR paper on semantic identifiers is more informative about the current team than a generic hiring count. The paper lists 18 authors and says Snap uses semantic identifiers as auxiliary ranking features, is exploring them as additional retrieval sources, and has launched variants in multiple production models after internal, academic, and online A/B testing. Exact lifts are not disclosed. This is direct evidence of a current group moving a frontier technique from research into production—not proof that its scale or output matches Meta. [Snap semantic-ID paper](https://research.snap.com/publications/semantic-ids-for-recommender-systems-at-snapchat-use-cases-technical-challenges-and-design-choices.html)

A targeted licensed workforce review adds a deliberately lower-weight capacity check. In a consistent global engineering-role view, Snap's covered footprint was broadly stable over the latest six months, remained above its August 2024 level but below a mid-2025 peak, and was more than 20 times smaller than the comparable Meta and ByteDance footprints. Estimated median tenure was broadly comparable with those large peers, while Snap's modeled July attrition rate exceeded its hiring rate. The detailed provider counts, classifications, and rates remain local-only because redistribution rights were not established; they are not audited payroll and do not identify the recommendation team. The conclusion is narrower: **Snap does not look technically hollow, but its smaller management and engineering bench makes repeated frontier-scale execution less probable than competent fast following.**

---

## 5. What Meta is doing that remains difficult to follow

Meta's frontier is not static.

| System or disclosure | Reported result | Why it matters | Caveat |
|---|---|---|---|
| Andromeda ads retrieval | +6% retrieval recall and +8% ad quality in selected segments; 10,000-fold model-capacity increase | Candidate quality and hardware/software co-design | Meta-selected metrics |
| HSTU long-sequence model | 1.5-trillion-parameter experiments; +12.4% online A/B improvement across multiple surfaces | Shows recommendation quality still scales with data and compute | Paper does not make the underlying Meta data public |
| Adaptive Ranking Model | Approximately one-trillion-parameter complexity within roughly 100 milliseconds; +3% conversions and +5% click-through rate for targeted users | Frontier inference under real latency constraints | Selected rollout cohort |
| Advanced user understanding plus GEM | +8.3% clicks and +15.7% conversions on Facebook | Direct evidence that the 2026 frontier continues to generate economic gains | Issuer call; contribution boundaries are not independently audited |
| First generative ad-retrieval pilot | +1% application events on Instagram | Early generative retrieval is already entering production tests | Pilot result, not full-system lift |
| SilverTorch | Public architecture with large claimed throughput/TCO improvements on retrieval tasks | Index/model fusion can change the serving frontier | Publication is not a turnkey copy of Meta production |
| MTIA | Hundreds of thousands of Meta-designed accelerators in production | Designed for lower marginal serving cost and faster co-design cycles | Economics versus cloud accelerators are not fully disclosed |

Primary sources: [Meta Andromeda](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/), [HSTU paper and open code](https://arxiv.org/abs/2402.17152), [Adaptive Ranking Model](https://engineering.fb.com/2026/03/31/ml-applications/meta-adaptive-ranking-model-bending-the-inference-scaling-curve-to-serve-llm-scale-models-for-ads/), [Meta second-quarter 2026 call transcript](https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf), [SilverTorch](https://engineering.fb.com/2026/05/26/ml-applications/silvertorch-index-as-model-new-retrieval-paradigm-recommendation-systems/), [GEM training at LLM scale](https://engineering.fb.com/2026/08/03/ml-applications/training-gem-at-llm-scale-meta-ads-recommendation-foundation-model/), and [MTIA at scale](https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/).

Meta reported that GEM training used several thousand current-generation graphics processors; training computation increased fourfold in twelve months while end-to-end efficiency roughly doubled to 20–25% model-flop utilisation. The associated engineering account explicitly says recommendation workloads do not automatically inherit LLM optimisations and require workload-specific co-design. That is the strongest technical counterargument to the simple open-LLM analogy. [Meta GEM training](https://engineering.fb.com/2026/08/03/ml-applications/training-gem-at-llm-scale-meta-ads-recommendation-foundation-model/)

Meta's second-quarter 2026 call also reported double-digit Instagram time-spent growth, 9% global Facebook-video time growth, and more than half of recommended Instagram Feed content being less than a day old—more than twice the proportion a year earlier. Those figures combine product, supply, ranking, and other changes, but they show an observable consumer outcome alongside the technical investment.

---

## 6. What Chinese open research changes

Chinese platforms provide the strongest evidence that important recommendation techniques diffuse outside Meta—and the clearest evidence that public architecture is not the same as public data.

| Organisation | Public asset | What it offers | Evidence and limitation |
|---|---|---|---|
| ByteDance | [Monolith paper](https://arxiv.org/abs/2209.07663) and code | Collisionless dynamic embeddings and minute-level sparse updates for real-time recommendation | Public Criteo experiments show fresher training improved AUC; this is not an audited diagram of TikTok's current stack |
| Alibaba | [TorchEasyRec](https://github.com/alibaba/TorchEasyRec) | Apache-licensed retrieval, ranking, multi-task and generative models; sharded embeddings; streaming and production serving | Broad industrial toolkit; users must supply their own data, feature pipelines and operating discipline |
| Baidu/PaddlePaddle | [PaddleRec](https://github.com/PaddlePaddle/PaddleRec) | Retrieval, ranking and multi-task model library with training and serving examples | Demonstrates maturity of the public baseline; many highlighted materials are older and should not be treated as the 2026 frontier |
| Kuaishou | [OpenOneRec](https://github.com/Kuaishou-OneRec/OpenOneRec) | Public benchmark, 1.7-billion/8-billion-parameter model family, and an expanding training pipeline | The repository describes a much larger private industrial corpus than its public benchmark, while its roadmap says one-click reproduction remains under development |
| Tencent | [2025 Advertising Algorithm Challenge paper](https://arxiv.org/abs/2604.04976), [data and baseline](https://github.com/TencentAdvertisingAlgorithmCompetition/baseline_2025) | De-identified multimodal advertising sequences, conversion tasks, public baseline | A valuable industrial-scale test bed; still a bounded historical sample rather than a live auction |
| Kuaishou | [KuaiRand](https://arxiv.org/abs/2208.08696) and [KuaiRec](https://arxiv.org/abs/2202.10842) | Random-exposure and more-complete feedback datasets for studying selection bias | Improves offline science; does not eliminate platform-specific counterfactuals |

ByteDance's Monolith results illustrate why freshness matters but also why small metric changes require care. On the public Criteo benchmark, the paper's AUC moved from roughly 79.42–79.44 for batch variants to 79.66 with five-hour updates, 79.78 with hourly updates, and 79.80 with 30-minute updates. Those increments can be valuable at large scale, but they are not a direct revenue percentage and may not transfer unchanged to Snap.

OpenOneRec is the most revealing comparison to open language models. It publishes architecture and weights, but the repository describes a standard model trained on roughly 33 billion tokens and a “Pro” model trained on an approximately 130-billion-token industrial corpus. The latter corpus is the scarce asset. Snap can reuse the model recipe; it must still generate Snapchat-native histories.

The inference from this ecosystem is not that Meta's models are unimportant. It is that **no major platform has an exclusive claim on the architecture class**. Competitive advantage shifts toward data quality, online learning, serving economics, and execution speed.

---

## 7. Content recommendation and advertising ranking should not share one forecast

### Content: a plausible narrowing gap

For Spotlight and Stories, Snap controls the essential feedback loop. Every eligible watch, skip, replay, hide, share, subscribe, and session outcome can improve its own model. Public multimodal encoders help understand a new clip before it has history. Snap's current retrieval and UUM results show a production route from published methods to online improvement.

The main constraints are creator inventory, regional audience health, safety, latency, and product design. Meta and TikTok still possess more content interactions and a faster-moving frontier, so full parity is not the base case. But **material improvement from Snap's weaker baseline is likely**, and architecture diffusion should narrow the pure algorithmic disadvantage.

### Advertising: improvement without parity

Advertising adds several scarce layers:

- purchase and value labels are rare, delayed, and privacy-impaired;
- new creatives and products create constant cold starts;
- the highest-scoring advertisement may have exhausted its budget;
- expected value must be calibrated because it enters an auction;
- advertiser return attracts or repels future budget;
- a thin auction cannot monetise all of a prediction improvement.

Public language and vision models can materially improve creative and catalogue understanding. Public ranking code can reduce engineering cost. Yet Meta's conversion history, placement breadth, and advertiser liquidity remain cumulative advantages. Snap's advertising gap can narrow in capability while remaining wide in economic yield.

---

## 8. How much recommendation upside remains?

The cleanest forecast is incremental to a counterfactual in which Snap keeps today's product but makes no further material recommendation or advertising-ranking improvement. It is **not** incremental to the existing revenue forecast, which already assumes some continued progress.

The following ranges are analyst estimates anchored to four pieces of evidence: Snap's small platform-wide UUM effects, its larger surface-specific tests, Meta's continuing production gains from a much higher baseline, and the fact that auction liquidity captures only part of an advertiser-outcome improvement as Snap revenue. They are deliberately wider than a normal quarterly forecast.

| Two-to-three-year incremental effect versus no further recommender improvement | Bear / stalled | Base / competent fast follower | Bull / meaningful frontier narrowing |
|---|---:|---:|---:|
| Platform-wide content time or comparable engagement | 0%–1% | 1%–3% | 3%–6% |
| Advertiser conversion or value at fixed spend | 0%–3% | 5%–10% | 10%–20% |
| Company-wide effective advertising price capture | 0%–1% | 1%–4% | 4%–8% |
| Cumulative advertising-revenue uplift | 0%–2% | **3%–7%** | **8%–15%** |

Surface metrics can be much larger: Spotlight or an individual lower-funnel product could plausibly improve 5%–10% in the base case and 10%–20% in the bull case. Snap's own UUM tables explain why that should not be applied to the whole company. A 19.2% increase in long-form view-time *sum* coexisted with only 0.28% more long-form view time per user and 0.04% more application-open daily users.

The advertiser-outcome row also does not pass through one-for-one. As an explicit judgment, the model assumes roughly **20%–50%** of an incremental conversion/value gain is captured in effective price or additional budget over this horizon. The rest can accrue to advertisers, be competed away, be constrained by campaign budgets, or fail to monetize because the auction lacks another qualified bidder. This pass-through range is not a disclosed Snap metric.

### What the next-four-quarter forecast already embeds

The operating model starts from approximately $5.328 billion of trailing advertising revenue. The table below decomposes each existing forecast into a non-recommender demand/inventory path and the residual attributed to recommendation, measurement, creative understanding, and lower-funnel automation. The attribution is an analyst diagnostic; Snap does not disclose it.

| Existing next-four-quarter advertising case | Forecast | Growth | Assumed growth without further recommender/measurement progress | Embedded recommender-related lift | Embedded revenue dollars | SOTP value per share already included |
|---|---:|---:|---:|---:|---:|---:|
| Bear | $5.545bn | 4.1% | 3.5% | 0.6% | $31m | $0.01 |
| Base | $6.048bn | 13.5% | 9.0% | 4.1% | $240m | $0.23 |
| Bull | $6.422bn | 20.5% | 12.5% | 7.1% | $428m | $0.64 |

The probability-weighted sum-of-the-parts diagnostic is approximately **$0.25 per share**. It is already inside the $7.74 probability-weighted value and must not be added to it. A failure to make further progress would therefore remove about $0.25 from this narrow diagnostic before any secondary effect on free cash flow or the valuation multiple; a visible technical failure could have a larger effect because it would also weaken confidence in the broader advertising path.

### Updated technical probabilities

For the recommendation subsystem alone—not for the total company scenarios—the evidence supports **20% stalled/bear, 65% competent-fast-follower/base, and 15% frontier-narrowing/bull**. These are subjective, uncalibrated probabilities.

- The recovered Gemini report and public Chinese/Meta work mainly strengthen the proposition that architecture diffuses; Gemini's claims were not used as evidence until their underlying sources were checked.
- Snap's current 18-author production paper, Bento scale, UUM launches, Spotlight retrieval, and lower-funnel results shift probability from technical failure into the fast-follower case.
- The licensed workforce review, Snap's more-than-20-fold peer scale gap, negative latest hiring/attrition spread, Meta's custom infrastructure, and the missing auction data shift probability from frontier narrowing into the fast-follower case.

The main valuation remains at 25% bear / 55% base / 20% bull because those scenarios also bundle user mix, subscriptions, cost savings, regulation, litigation, Specs, and dilution. Replacing the company probabilities with the subsystem probabilities would double-count the same evidence.

---

## 9. A realistic two-to-three-year capability range

These are capability scenarios, not new revenue forecasts. The existing valuation retains its separate advertising-growth assumptions.

| Scenario | Technical path | Observable economic path | Quarterly falsifiers |
|---|---|---|---|
| **Bear** | UUM and generative features produce local test lifts but serving cost, sparse labels, creator supply, and organisational execution prevent broad rollout | Spotlight grows outside the highest-value regions; effective price weakens when impressions expand; infrastructure cost per user rises faster than monetisation | North American daily users or Spotlight engagement deteriorate; reported price falls again; lower-funnel product gains fade; infrastructure cost per daily user rises despite weak ad growth |
| **Base** | Snap adopts public sequence/multimodal methods, increases training freshness, and extends UUM; models improve materially without matching Meta | Content engagement improves; DPA/application performance grows faster than total ads; effective price becomes sustainably flat-to-positive; infrastructure cost per user remains controlled | Failure to produce two consecutive quarters of non-negative price while impressions grow; no sustained North American content-engagement improvement; conversion volume grows only through sharply higher spend or weaker pricing |
| **Bull** | Semantic identifiers, generative retrieval, online learning, and strong creator supply compound; public models let Snap capture large gains from a lower base without custom silicon | North American attention stabilises or grows; external incremental return remains strong at higher spend; both impressions and effective price rise; high-teens advertising growth becomes repeatable without infrastructure deleverage | External return deteriorates as advertiser spend scales; auction price remains weak despite product gains; Meta's relative performance widens; safety or policy constraints reduce usable signals |

### What would change the valuation before 24 months have passed?

The best proof is not another architecture announcement. It is the conjunction of:

1. **North American content outcome:** stable or improving daily users, Spotlight daily viewers, viewing time, or sessions—not only creator/post growth.
2. **Auction outcome:** at least two consecutive quarters of flat or positive effective advertising price while impression delivery also grows.
3. **Lower-funnel outcome:** DPA, application-purchase volume, and advertiser cost improvements persist across a broader spend base.
4. **External measurement:** incremental return remains attractive when average client spend increases, not only at very low allocation.
5. **Cost outcome:** infrastructure cost per daily user remains stable or improves as model use and engagement expand.

If those appear together, the evidence would support moving probability from the low-growth/base cases toward the higher-growth scenario. If technical announcements continue while price, North American attention, or cost efficiency deteriorate, the correct conclusion is that open-source capability is not translating into economic value.

---

## 10. How this should be tested without overclaiming

A toy recommender would answer the wrong question. It would show that public code runs, which is already known. A useful experiment should measure **how quickly quality degrades when the very assets Snap lacks become sparse or delayed**.

The repository experiment should therefore use public industrial datasets such as Tencent's multimodal advertising challenge and Kuaishou's random-exposure or more-complete interaction datasets, with a pre-registered design:

1. compare popularity, two-tower retrieval, a standard multi-task/sequence ranker, and an available generative/semantic-ID model;
2. train each across fixed fractions of the interaction data to estimate a data-scaling curve;
3. remove or delay conversion labels and quantify ranking and calibration degradation;
4. test new-user, new-item, and new-ad cold starts with and without public content embeddings;
5. impose identical latency and compute budgets, including a distilled/quantised model;
6. evaluate ranking quality, calibration, diversity, and off-policy robustness separately;
7. report negative results and confidence intervals.

Even this cannot establish Snap-versus-Meta parity, revenue lift, real advertiser return, or auction liquidity. It can test the mechanism behind the thesis: **how much modern architecture and pretrained content understanding compensate for less proprietary data under a fixed compute budget**.

---

## 11. Strongest cases on both sides

### The strongest bullish case

Recommendation architecture is becoming infrastructure, much as databases and neural-network frameworks did. Snap has enough users, interactions, and engineering scale to exploit it; it does not need Meta's absolute scale to improve materially from a lower baseline. Public language/vision models disproportionately help cold start, where Snap is weakest. Rented accelerators avoid the fixed cost and obsolescence risk of custom silicon. Snap's own online results show that these mechanisms already work. If better recommendations improve content engagement and advertiser return, the large monetisation gap offers unusually high operating leverage.

### The strongest bearish case

The target is moving faster than Snap can follow. Meta is scaling recommendation-specific foundation models, custom kernels, retrieval systems, and silicon together, while its greater interaction and conversion volume makes every model iteration more valuable. Open architectures can raise the minimum capability of all platforms without changing their relative order. On the advertising side, a smaller marketplace produces fewer rare-event labels and weaker bid competition, so a similar percentage improvement in prediction may create less revenue. Snap then pays a cloud margin on increasingly compute-intensive models while Meta amortises infrastructure across a far larger revenue base.

### Reconciled judgement

Both cases can be true. Open source should improve Snap's absolute recommendation quality and reduce catastrophic technical downside. It is less likely to erase Meta's relative economic advantage. The decisive distinction for the valuation is not “Can Snap build the model?” It is:

> **Can Snap turn a better model into more valuable North American attention, better advertiser returns at higher spend, positive auction price, and stable infrastructure cost per user?**

This work narrows the technical-obsolescence distribution: the competent-fast-follower outcome is now materially more likely than either failure or frontier parity. It does not narrow the total valuation distribution by the same amount because the marketplace and financial translation remain unobserved.

---

## Selected primary-source index

### Snap

- [Bento machine-learning platform](https://eng.snap.com/introducing-bento)
- [Universal User Modeling paper](https://arxiv.org/abs/2504.21838)
- [Semantic identifiers in Snapchat production](https://research.snap.com/publications/semantic-ids-for-recommender-systems-at-snapchat-use-cases-technical-challenges-and-design-choices.html)
- [Spotlight embedding retrieval](https://eng.snap.com/embedding-based-retrieval)
- [Advertising ranking](https://eng.snap.com/machine-learning-snap-ad-ranking)
- [GRID paper](https://arxiv.org/abs/2507.22224) and [repository](https://github.com/snap-research/GRID)
- [AutoCDSR](https://arxiv.org/abs/2505.21811)
- [14-year engineering letter](https://newsroom.snap.com/14-year-letter)
- [Q1 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm)
- [Q2 2026 prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf)

### Meta and Google

- [Meta HSTU paper and code](https://arxiv.org/abs/2402.17152)
- [Andromeda](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/)
- [Adaptive Ranking Model](https://engineering.fb.com/2026/03/31/ml-applications/meta-adaptive-ranking-model-bending-the-inference-scaling-curve-to-serve-llm-scale-models-for-ads/)
- [GEM training](https://engineering.fb.com/2026/08/03/ml-applications/training-gem-at-llm-scale-meta-ads-recommendation-foundation-model/)
- [SilverTorch](https://engineering.fb.com/2026/05/26/ml-applications/silvertorch-index-as-model-new-retrieval-paradigm-recommendation-systems/)
- [MTIA](https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/)
- [TensorFlow Recommenders](https://github.com/tensorflow/recommenders) and [ScaNN](https://github.com/google-research/google-research/tree/master/scann)
- [Google MMoE paper](https://research.google/pubs/modeling-task-relationships-in-multi-task-learning-with-multi-gate-mixture-of-experts/)
- [Google/YouTube off-policy recommendation paper](https://research.google/pubs/top-k-off-policy-correction-for-a-reinforce-recommender-system/)

### Chinese open research and software

- [ByteDance Monolith](https://arxiv.org/abs/2209.07663)
- [Alibaba TorchEasyRec](https://github.com/alibaba/TorchEasyRec)
- [Baidu/PaddlePaddle PaddleRec](https://github.com/PaddlePaddle/PaddleRec)
- [Kuaishou OpenOneRec](https://github.com/Kuaishou-OneRec/OpenOneRec)
- [Tencent Advertising Algorithm Challenge](https://arxiv.org/abs/2604.04976)
- [KuaiRand](https://arxiv.org/abs/2208.08696) and [KuaiRec](https://arxiv.org/abs/2202.10842)

## Confidence

| Conclusion | Confidence | Why |
|---|---|---|
| Public software materially reduces the cost of implementing modern recommender components | High | Multiple mature repositories and production papers |
| Snap operates a credible industrial-scale recommendation platform | Medium-high | Detailed issuer architecture plus several online tests; no independent systems audit |
| Snap can improve content recommendations materially in two to three years | Medium-high | Owned feedback loop, weak baseline, current production gains, transferable public methods |
| Snap can improve advertising ranking materially | Medium | Product-specific conversion and cost evidence is positive; causal contribution and scale remain unclear |
| Open source will substantially close Meta's advertising monetisation gap | Medium-low | Proprietary data, marketplace liquidity, compute economics, and Meta's moving frontier remain decisive |
| This evidence alone warrants a valuation change | Low | No new audited revenue, price, engagement, or cost result was created by the technical review |
