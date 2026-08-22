# Snap advertising prices and recommendation systems: revalidation

**As of:** 21 August 2026
**Research status:** Specialist evidence memo for the Snap thesis
**Scope:** Advertising economics, measurement, recommendation systems, competitive capability, and the next-four-quarter advertising-revenue bridge
**Evidence policy:** Facts are linked to public primary sources where possible. Vendor benchmarks are identified as such. All sources were accessed on 21 August 2026.

---

## The one-minute answer

> **Verdict:** “Snap ads are consistently cheaper than Facebook or Instagram” is **not supported** if *cheaper* means cost per thousand impressions or cost per click. It is **plausible for selected advertisers at the margin** if *cheaper* means cost per incremental acquisition or incremental return on advertising spend.

The strongest publicly visible cross-platform price series does not show Snap as consistently cheapest. Gupta Media’s 2025 averages put combined Facebook and Instagram at a **$8.19 cost per thousand impressions**, Snap at **$8.60**, and TikTok at **$4.82**. A dated June 2025 snapshot from the same publisher put Instagram at **$8.16 per thousand impressions and $0.69 per link click**, versus Snap at **$8.39 and $0.90**. The publisher has revised its live pages and some tables conflict, so the exact decimals deserve only medium confidence; the important point is that this evidence rejects an “always cheapest” rule. [Gupta Media social advertising costs](https://www.guptamedia.com/social-media-ads-cost), [Gupta Media Snapchat costs](https://www.guptamedia.com/insights/snapchat-ads-cost), [Gupta Media Instagram costs](https://www.guptamedia.com/insights/instagram-ads-cost?hs_amp=true)

The strongest bullish counter-evidence measures business outcomes rather than media prices. Measured reports that, across 130 commerce brands already using Snapchat, the median **incremental return on advertising spend (iROAS)** on Snapchat was **$2.84**, or **19.3% above** those brands’ blended social result, while Snapchat represented only about **5% of social spend**. Triple Whale reports that, in a roughly 20,000-advertiser commerce dataset, Snapchat had the lowest **cost per acquisition (CPA)** among the platforms studied. Both findings are useful, but neither public release provides enough matched-platform detail to establish that Snap would remain superior when budgets scale. [Measured summary](https://www.measured.com/guide-research/snapchat-lifts-search-social-iroas/), [Forbes description of the Measured cohort](https://www.forbes.com/sites/sharonedelson/2026/07/21/undervalued-snapchat-worth-another-look-says-study/), [Triple Whale study distributed by Snap](https://forbusiness.snapchat.com/blog/triple-whale-ecommerce-research-2025?_sid=ADAGE)

For an advertiser, low incremental cost can be excellent. For a Snap shareholder, low advertising prices are not automatically good: they can mean the auction lacks enough competing budgets. Snap’s first-quarter 2026 global advertising impressions rose **17%**, while effective price per impression fell **12%**. The second-quarter Form 10-Q then reported an approximately **10% increase in average price per advertising impression**. Advertising revenue grew 9.3%, implying roughly flat to slightly negative impression delivery after rounding. Meta’s second-quarter 2026 advertising impressions rose **14%** while average price per advertisement rose **12%**. Snap has now produced one clear quarter of yield repair, but not Meta-like simultaneous price and volume growth. [Snap first-quarter 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm), [Snap second-quarter 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000052/snap-20260630.htm), [Meta second-quarter 2026 results](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx)

**My underwriting conclusion:** Snap has a real, production-scale machine-learning stack and improving lower-funnel advertising products. It does not merely need to “build Meta’s algorithm.” It must turn better prediction into denser advertiser demand, more conversion history, greater trust in measurement, and higher bids without destroying advertiser returns. The reported second-quarter price inflection makes a roughly **12% next-four-quarter advertising-growth case more credible**, but volume was approximately flat and the quarter included World Cup demand. Growth around **20% remains a credible bull case** if price repair persists while impression delivery resumes. Sustained **30% advertising growth is a stretch case**, not a base case.

A later same-day [country-level regional advertising economics pass](2026-08-21-regional-ad-economics.md) adds Snap format/country observations, Meta and Reddit geographic anchors, subscription storefront prices, and a Q2-reconciled regional contribution model. It does not change the global “not always cheaper” verdict.

---

## Claim-by-claim verdict

| Claim | Verdict | Why |
|---|---:|---|
| Snap impressions are always cheaper than Facebook or Instagram | **False** | The best public agency series found has Snap’s 2025 average cost per thousand impressions slightly *above* combined Facebook and Instagram. Monthly and placement mixes can reverse the ranking. |
| Snap clicks are always cheaper | **False** | In the comparable Gupta June 2025 snapshot, Snap’s cost per link click was higher than Instagram’s. A low cost per thousand impressions can still produce an expensive click when the click-through rate is weak. |
| Snap can be cheaper per acquisition for commerce brands | **Supported, but cohort-specific** | Triple Whale and Fospha report low Snapchat acquisition costs in commerce cohorts. Public methodology is insufficient to generalise to all industries, objectives, or budget levels. |
| Snap can deliver stronger incremental returns than a brand’s other social spending | **Supported for a selected cohort** | Measured reports a 19.3% median advantage over blended social for brands already using Snapchat. It does not prove superiority over Meta for every brand or at much higher spend. |
| A cheaper Snap auction proves Snap has an under-monetised asset | **Partly true** | Low price can create advertiser opportunity and attract demand. It can also reveal weak auction density, lower-intent inventory, inferior measurement, or low conversion rates. |
| Meta’s recommendation gains should be easy for Snap to copy | **False** | Architectures can be copied. Historical conversion labels, advertiser budgets, cross-placement signals, compute, agency workflows, and marketplace liquidity cannot be copied quickly. |
| Snap lacks a serious machine-learning platform | **False** | Snap describes more than 500 models, more than one billion predictions per second, a large feature store, long-sequence universal user models, and a multi-stage advertising-ranking system. These are issuer claims, but they describe industrial rather than experimental scale. |
| Snap’s advertising recovery is proven | **One-quarter evidence** | Second-quarter 2026 advertising revenue grew 9.3%, and the Form 10-Q reported average price per impression up approximately 10%. Impressions were therefore roughly flat/slightly negative after rounding. Yield repair is now observed once, not yet proved durable. |

---

## 1. “Ad cost” is not one question

The statement “Snap is cheaper” has no investment meaning until the unit, outcome, and measurement rules are specified.

### Core terms and formulas

**Cost per thousand impressions (CPM)** asks what 1,000 displayed advertisements cost.

\[
\text{CPM} = \frac{\text{advertising spend}}{\text{impressions}} \times 1{,}000
\]

**Cost per click (CPC)** asks what each recorded click costs.

\[
\text{CPC} = \frac{\text{advertising spend}}{\text{clicks}}
\]

**Click-through rate (CTR)** measures the share of impressions that produce a click.

\[
\text{CTR} = \frac{\text{clicks}}{\text{impressions}}
\]

**Conversion rate (CVR)** measures the share of clicks that become the desired action, such as a purchase or installation.

\[
\text{CVR} = \frac{\text{conversions}}{\text{clicks}}
\]

**Cost per acquisition or action (CPA)** asks what each attributed conversion costs.

\[
\text{CPA} = \frac{\text{advertising spend}}{\text{conversions}} = \frac{\text{CPC}}{\text{CVR}}
\]

**Return on advertising spend (ROAS)** divides attributed revenue by spend.

\[
\text{ROAS} = \frac{\text{revenue attributed to advertising}}{\text{advertising spend}}
\]

**Incremental return on advertising spend (iROAS)** attempts the harder question: how much revenue the advertising *caused*, above what would have happened without it.

\[
\text{iROAS} = \frac{\text{incremental revenue caused by advertising}}{\text{advertising spend}}
\]

**Effective cost per thousand impressions (eCPM)** is the publisher-side yield realised across differently priced advertisements.

\[
\text{eCPM} = \frac{\text{publisher advertising revenue}}{\text{delivered impressions}} \times 1{,}000
\]

### A low CPM can produce a high CPA

**Calculation — deliberately simple example**

| | Snap-like low-price example | Meta-like high-price example |
|---|---:|---:|
| Cost per thousand impressions | $6.00 | $12.00 |
| Click-through rate | 0.50% | 1.20% |
| Clicks per 1,000 impressions | 5.0 | 12.0 |
| Cost per click | $1.20 | $1.00 |
| Conversion rate | 2.0% | 4.0% |
| Conversions per 1,000 impressions | 0.10 | 0.48 |
| **Cost per acquisition** | **$60.00** | **$25.00** |

Snap-like reach is half the price in this illustration, yet each acquisition costs more than twice as much. This is why a cost-per-thousand-impressions chart cannot settle the investment question.

### The minimum information a fair comparison needs

1. **Geography.** A United States impression is usually priced differently from an Indian impression. Snap’s regional user mix therefore matters as much as global scale.
2. **Campaign objective.** Brand awareness, video views, traffic, application installation, purchase, and catalogue sales enter different auctions or optimisation regimes.
3. **Placement.** Instagram Reels, Instagram Stories, Facebook Feed, Snap Stories, Spotlight, and Sponsored Snaps have different supply, attention, and conversion profiles.
4. **Audience.** Broad automated targeting is not comparable with a narrow high-income retargeting pool.
5. **Creative.** A vertical native video and a recycled television advertisement can receive radically different engagement and auction quality scores.
6. **Attribution window.** A platform counting a purchase up to 28 days after a swipe will report more conversions than one counting clicks for seven days and no view-through conversions.
7. **Season and auction pressure.** Holiday retail demand can raise prices; a product launch or election can alter specific audiences.
8. **Budget and scale.** The first $5,000 may reach the most responsive underserved users. The next $500,000 may not.
9. **Measurement source.** Platform-reported results, last-click analytics, multi-touch attribution, and controlled incrementality experiments answer different questions.
10. **Sample selection.** Advertisers that remain on Snap are more likely to be the advertisers for whom Snap already works.

Northbeam’s documentation illustrates the attribution problem. It lists platform defaults including seven-day click and one-day view for TikTok and 28-day swipe and one-day view for Snapchat, while Snap also offers a stricter seven-day click/no-view product. Northbeam explicitly warns that in-platform metrics are self-attributed and will differ from external measurement. Rockerbox similarly notes that several platforms can claim the same conversion, so platform-reported costs and returns are not deduplicated. [Northbeam measurement definitions](https://docs.northbeam.io/docs/northbeam-metrics-101), [Rockerbox on platform-reported performance](https://help.rockerbox.com/article/90oez07d1x-platform-reported-performance), [Snap measurement improvements](https://forbusiness.snapchat.com/blog/ad-platform-dr-improvements-2024)

---

## 2. What the public pricing evidence actually says

### Evidence map

| Evidence | Period and population | Result | What it can establish | Main limitation |
|---|---|---|---|---|
| Gupta Media cross-platform cost series | Agency-managed advertising; 2025 averages and monthly snapshots | 2025 average CPM: combined Facebook and Instagram $8.19; Snapchat $8.60; TikTok $4.82. June 2025 snapshot: Instagram CPM $8.16 and cost per link click $0.69; Snap CPM $8.39 and cost per link click $0.90. | Snap is not consistently the lowest-cost impression or click platform. | Live pages have been revised and contain conflicting snapshots/sample descriptions. Client, country, objective, and placement mix are not fully disclosed. |
| Tinuiti Digital Ads Benchmark Report | Median same-store advertisers; fourth quarter 2025 | Snapchat spend fell 4%, impressions rose 4%, and median CPM declined for the first time in seven quarters. Facebook impressions rose 19% and CPM fell 13%; Instagram pricing and impressions grew through 2025. | Direction of prices and volume inside one large agency portfolio. | Provides changes, not directly comparable absolute CPM, CPA, or return levels. Median advertiser is not dollar-weighted market yield. |
| Measured incrementality analysis | 130 commerce brands in Measured’s portfolio; reported July 2026 | Snapchat was about 5% of social spend; median iROAS $2.84, 19.3% above blended social for the same brands. | Snapchat can be an efficient *incremental* channel for selected existing advertisers at low allocation. | Existing-customer and commerce selection; comparator is blended social, not an explicit Meta-only matched result; public experiment detail is limited. |
| Triple Whale commerce analysis | February–May 2025; about 20,000 advertisers and about $3 billion spend | Snapchat reportedly had the lowest CPA and improved ROAS 7.5% while most platforms declined. | Directional evidence that Snap can work for commerce acquisition. | Co-marketed and distributed by Snap; no public absolute cross-platform CPA table or matched-spend design. Triple Whale’s general benchmark methodology does not prove that this specific study used the same panel rules. |
| Fospha State of Ecommerce | Second half 2024; more than 150 commerce brands across the United States, United Kingdom, and Europe/Middle East/Africa | Snapchat reportedly had the lowest paid-social CPA and ROAS of 5.31 while receiving about 1% of budgets on average. | Older corroboration of efficient marginal spend. | Small, selected commerce panel; partnership relationship with Snap; low allocation makes extrapolation especially risky. |

Sources: [Gupta Media cross-platform series](https://www.guptamedia.com/social-media-ads-cost), [Snapchat series](https://www.guptamedia.com/insights/snapchat-ads-cost), [Instagram series](https://www.guptamedia.com/insights/instagram-ads-cost?hs_amp=true), [Tinuiti fourth-quarter 2025 benchmark](https://tinuiti.com/research-insights/research/digital-ads-benchmark-report-q4-2025/), [Measured](https://www.measured.com/guide-research/snapchat-lifts-search-social-iroas/), [Measured cohort detail reported by Forbes](https://www.forbes.com/sites/sharonedelson/2026/07/21/undervalued-snapchat-worth-another-look-says-study/), [Triple Whale/Snap](https://forbusiness.snapchat.com/blog/triple-whale-ecommerce-research-2025?_sid=ADAGE), [Triple Whale general benchmark methodology](https://benchmark.triplewhalelabs.com/methodology/), [Fospha report landing page](https://www.fospha.com/reports-and-guides/soe-h2-2024), [Snap/Fospha partnership disclosure](https://forbusiness.snapchat.com/blog/snap-fospha-partnership)

### Revalidation of “Snap is the cheapest”

**Fact:** Gupta’s 2025 average has Snapchat’s cost per thousand impressions about **5% higher** than combined Facebook and Instagram:

\[
\frac{8.60}{8.19} - 1 = 5.0\%
\]

**Fact:** The same publisher’s June 2025 snapshots have Snapchat’s cost per link click about **30% higher** than Instagram’s:

\[
\frac{0.90}{0.69} - 1 = 30.4\%
\]

**Caution:** These figures are not a controlled test. Gupta’s live pages have changed over time: later versions show different monthly values, and narrative figures do not always reconcile to tables. That lowers confidence in any single decimal, but it does not rescue the claim of consistent Snap cheapness. A noisy dataset showing Snap sometimes above Meta is enough to falsify “always.”

The click figures also reconcile mechanically with the reported impression price and click-through rate:

\[
\text{CPC} = \frac{\text{CPM}}{1{,}000 \times \text{CTR}}
\]

For the June snapshot, Snapchat’s $8.39 CPM and 0.94% link click-through rate imply about $0.89 per link click; Instagram’s $8.16 CPM and 1.19% link click-through rate imply about $0.69. The observed click-cost gap therefore does not require a mysterious platform fee. It follows from slightly dearer impressions and fewer clicks per impression.

Placement mix can reverse the first impression. Gupta’s January 2025 Instagram snapshot reported Reels at a much lower **$4.29 CPM** than Stories at **$7.25**, yet Reels had a higher **$1.21 cost per link click** than Stories at **$0.94** because the reported link click-through rate was only 0.35%, versus 0.77% for Stories. “Reels is cheaper” is true for reach and false for clicks in the same dataset. A cross-platform average that contains different proportions of Reels, Stories, Feed, Spotlight, and Sponsored Snaps can therefore mislead even before geography and audience are considered. [Gupta Media Instagram placement snapshot](https://www.guptamedia.com/insights/instagram-ads-cost?hs_amp=true)

**Fact:** Tinuiti’s fourth-quarter 2025 data show that even platform-level direction is not uniform. Snapchat’s median CPM declined while Instagram’s pricing continued to rise, but Facebook’s CPM fell 13%. Furthermore, 44% of Tinuiti Facebook advertisers still saw CPM rise even while the median fell. A portfolio median is not the experience of every advertiser. [Tinuiti benchmark](https://tinuiti.com/research-insights/research/digital-ads-benchmark-report-q4-2025/)

### Why the commerce studies can still be true

The apparently contradictory results can coexist:

- **Unique reach:** Snap can reach users who are harder to reach on other platforms. An impression to a genuinely incremental user can be worth more even at the same raw price.
- **Under-allocated budgets:** The Measured cohort allocated only around 5% of social spend to Snapchat; Fospha’s older cohort averaged around 1%. A small first allocation can harvest the best opportunities before returns diminish.
- **Commerce selection:** Advertisers with suitable products, younger customers, strong vertical creative, and good server-side measurement are more likely to adopt and remain on Snap.
- **Different denominators:** Gupta reports media cost. Measured estimates caused revenue. Triple Whale reports attributed commerce outcomes. These are not competing measurements of the same quantity.
- **Median versus weighted average:** A median brand can improve even while the largest spenders or aggregate dollars do something different.
- **Incremental versus attributed:** A platform may claim many conversions that would have happened anyway. Incrementality testing tries to remove that effect; it can favour a smaller channel with more unique reach.

**Inference:** The evidence supports a useful sales message—“many commerce advertisers should test an incremental Snap allocation”—more strongly than it supports the investor message—“Snap can raise prices rapidly across billions of dollars of inventory without reducing returns.”

### The scaling trap

Suppose a brand spends $5 million on social and only $250,000, or 5%, on Snapchat. If Snapchat’s best users produce $2.84 of incremental revenue per dollar, that does not mean the next $2 million earns the same return. The algorithm may have already reached the most responsive users, frequency rises, lower-probability candidates enter, and the auction becomes more expensive as more advertisers copy the trade.

**What would make the Measured result more investable?** A public matched panel showing:

- incremental returns by spend quintile;
- returns before and after doubling Snap budget;
- country and industry mix;
- new versus existing Snap advertisers;
- the explicit Meta, TikTok, and Reddit comparators;
- test design, confidence intervals, and holdout size;
- whether creative and offers were equivalent;
- results after agency fees and measurement costs.

Until then, the result is meaningful demand-generation evidence, not proof of unlimited pricing power.

---

## 3. Cheap for advertisers can be bad for shareholders

An advertising marketplace has two sides:

- users supply attention;
- advertisers bid for predicted outcomes from that attention.

More user time and more available placements increase impression supply. Better recommendation and measurement should increase advertiser demand. Shareholder value rises fastest when demand grows at least as quickly as supply, allowing Snap to deliver both more impressions and higher effective prices.

### Snap’s recent yield record

| Period | Global impression growth | Effective price change | Advertising-revenue growth | Read-through |
|---|---:|---:|---:|---|
| Second quarter 2025 | +15% | -10% | approximately +4% | Supply growth outran demand; new Sponsored Snap supply reduced auction contestation. |
| Third quarter 2025 | +22% | approximately -13% | +5% | Strong inventory growth, weak yield. |
| Fourth quarter 2025 | +14% | -8% | +5% | Still dilutive pricing, though less severe than the third quarter. |
| First quarter 2026 | +17% | -12% | +3% | The monetisation problem persisted despite product progress. |
| Second quarter 2026 | approximately -1% implied | approximately +10% reported | +9.3% | Clear price repair, but no volume growth; the implied impression figure is approximate because price was rounded. |

Sources: [Snap second-quarter 2025 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440825000047/q22025investorletterex99.htm), [third-quarter 2025 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440825000063/q32025investorletter.htm), [fourth-quarter 2025 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000011/snapincq42025investorlet.htm), [first-quarter 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm), [second-quarter 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000052/snap-20260630.htm)

The approximate third-quarter price change is the residual of reported advertising-revenue and impression growth, before mix and rounding:

\[
\text{effective-price growth} \approx \frac{1 + \text{advertising-revenue growth}}{1 + \text{impression growth}} - 1
\]

\[
\frac{1.05}{1.22} - 1 = -13.9\%
\]

For the second quarter, reported advertising revenue was $1,282.5 million versus $1,173.5 million, or +9.29%, and reported price growth was approximately 10%:

\[
\frac{1.0929}{1.10} - 1 = -0.65\%
\]

The correct description is approximately flat to slightly negative impressions, not a precise -0.65% observation, because Snap rounded the price change and mix sits inside the average.

**Fact:** Snap’s 2025 advertising revenue was approximately **$5.19 billion**, up 5.8%, while global impressions increased around 17% and cost per impression declined about 10%. [Snap 2025 annual report](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000013/snap-20251231.htm)

**Fact:** Meta’s 2025 advertising revenue was approximately **$196.18 billion**, up 22%, with impressions up 12% and average price per advertisement up 9%. In the second quarter of 2026, Meta produced **$59.36 billion** of advertising revenue, up 27%, as impressions rose 14% and price rose 12%. [Meta full-year 2025 results](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/), [Meta second-quarter 2026 results](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx)

**Calculation:** Meta’s 2025 advertising pool was roughly **38 times** Snap’s. Its second-quarter 2026 advertising revenue was roughly **46 times** Snap’s $1.28 billion. That gap is not just audience size. It is evidence of a much denser advertiser marketplace and much higher monetisation per unit of attention.

**Investor translation:**

- A low Snap CPM is bullish if it attracts new advertisers, produces good incremental returns, and then rises as budgets deepen.
- It is bearish if advertisers remain unwilling to bid despite abundant supply.
- It is neutral if cheap new placements merely offset weak engagement or measurement.
- The decisive metric is not whether Snap looks cheap in an agency slide; it is whether advertiser demand makes **Snap’s eCPM trend turn from negative to flat and then positive**.

---

## 4. Recommendation engines, from first principles

### The plain-English version

A recommendation engine is a very fast matchmaker. For every opportunity to show something, it tries to answer:

> “Of all eligible pieces of content or advertisements, which one is most likely to produce the best combination of user value, advertiser value, and platform value for this person right now?”

It does not search every possible item with the most expensive model. That would be too slow. It narrows the field in stages.

### The seven-stage pipeline

1. **Eligibility and policy filtering**
   Remove advertisements that cannot legally, contractually, or safely be shown to this user. Geography, age, budget, campaign schedule, frequency caps, and content policy all apply.

2. **Candidate retrieval**
   From millions of possible advertisements, retrieve perhaps hundreds or thousands that appear relevant. Fast models often represent users and advertisements as lists of numbers called *embeddings* and retrieve nearby matches.

3. **Feature assembly**
   Collect the available signals: recent user behaviour, longer-term interests, device, placement, time, advertisement creative, product catalogue, prior interactions, and advertiser conversion data.

4. **Prediction and ranking**
   Heavier models estimate several probabilities: view, click, installation, purchase, hide, complaint, or long-term disengagement. The platform combines these predictions with bid, expected commercial value, quality, and user-experience constraints.

5. **Auction and pacing**
   The platform chooses among advertisers while respecting daily budgets and delivery goals. Meta describes its auction as combining advertiser bid, estimated action rate, and advertisement quality; therefore the highest cash bid need not win. [Meta advertisement-auction explanation](https://www.facebook.com/help/447278887528796)

6. **Delivery and measurement**
   Show the advertisement, then observe any view, click, installation, purchase, hide, or complaint. Server-side systems such as Snap’s **Conversions application programming interface (Conversions API or CAPI)** try to recover signals lost through browser and operating-system privacy changes. [Snap Conversions API documentation](https://developers.snap.com/marketing-api/Conversions-API/Introduction)

7. **Learning loop**
   Use the results as labels for future training. Good feedback improves retrieval and ranking; improved results attract more advertisers and conversions; more conversions produce better training data. The reverse can also happen.

### A simplified advertising score

A platform’s true formula is proprietary and contains many constraints, but the intuition can be represented as:

\[
\text{candidate score} \approx \text{predicted probability of action} \times \text{advertiser value or bid} \times \text{quality adjustment}
\]

For a purchase campaign:

\[
\text{expected value per impression} \approx P(\text{purchase} \mid \text{user, advertisement, context}) \times \text{value per purchase}
\]

If Snap predicts purchase probability more accurately, it can show fewer irrelevant ads, improve advertiser returns, and justify higher bids. Prediction alone is insufficient, however: the system also needs enough eligible advertisers bidding for each opportunity.

### Why retrieval matters as much as ranking

The most sophisticated ranking model cannot select an advertisement that candidate retrieval failed to include. Retrieval therefore faces a difficult balance:

- too narrow, and it misses valuable but non-obvious candidates;
- too broad, and latency and compute costs explode;
- too focused on past clicks, and it becomes repetitive;
- too exploratory, and short-term results fall.

Meta’s Andromeda system describes narrowing tens of millions of candidates to a few thousand using co-designed software and specialised hardware. Snap’s public advertising-ranking description similarly starts with millions of advertisements, retrieves a much smaller set, applies heavier machine-learning models, and then runs the auction. [Meta Andromeda engineering paper](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/), [Snap advertising-ranking engineering overview](https://eng.snap.com/machine-learning-snap-ad-ranking)

### Why the problem is genuinely hard

#### 1. Purchases are rare

A user can generate many views but few purchases. A small advertiser may record only a handful of conversions, leaving the model with weak statistical evidence. Meta’s larger budgets and transaction volume give it more examples of rare high-value events.

#### 2. The model sees a biased world

The platform observes outcomes only for advertisements it chose to show. It cannot directly observe what the user would have done after every rejected advertisement. Training naively on delivered ads reinforces yesterday’s choices and can starve new campaigns.

#### 3. Conversion labels are delayed and incomplete

A purchase may happen days after an impression, on another device, or in a physical shop. Privacy settings and imperfect server integrations remove or distort labels. The ranking system must learn while the final answer is still missing.

#### 4. Advertisements change quickly

Campaigns, prices, products, and creative turn over much faster than much consumer content. The system faces constant *cold starts*: it must estimate a new ad before it has history.

#### 5. Several goals conflict

Maximising immediate clicks can reward sensational creative, increase hides, and damage long-term use. The platform must balance advertiser outcomes, revenue, user satisfaction, safety, and future retention.

#### 6. Calibration matters

If a model calls ten advertisements “10% likely to convert,” approximately one should convert. A ranking can order ads correctly and still be badly calibrated. Miscalibration makes bidding and budget allocation unstable. Snap’s engineering team explicitly identifies calibration, selection bias, delayed conversions, advertisement churn, and latency as production challenges. [Snap advertising-ranking engineering overview](https://eng.snap.com/machine-learning-snap-ad-ranking)

#### 7. Feedback loops compound

Good performance attracts budget. More budget creates more auctions and conversions. More conversions improve prediction. Poor performance can cause advertisers to leave before the model accumulates enough evidence. This is why **auction density and conversion history are part of the moat**, not merely sales outcomes sitting downstream from the algorithm.

#### 8. Incrementality is a counterfactual

Attribution asks whether an advertisement appeared before a purchase. Incrementality asks whether the purchase would have happened without the advertisement. The second requires experiments, holdouts, or causal modelling and is much harder.

---

## 5. What Snap has built—and what the evidence proves

### The platform is already industrial-scale

**Fact — issuer engineering disclosure:** Snap’s Bento machine-learning platform says it supports more than **500 models**, more than **one billion predictions per second**, more than **100,000 training-compute hours per day**, a feature store of roughly **800 terabytes**, and individual training jobs approaching **one petabyte**. Its largest production model was described as exceeding 100 gigabytes. [Snap Bento engineering overview](https://eng.snap.com/introducing-bento)

**Interpretation:** These claims do not prove competitive parity or attractive returns on infrastructure spending. They do refute the idea that Snap is attempting to solve recommendations with a small experimental team and a toy system.

A same-day [open-source recommender follow-up](2026-08-21-open-source-recommender-gap.md) reviewed public work from Meta, Google, ByteDance, Alibaba, Baidu, Tencent, Kuaishou, and Snap itself. It strengthens this conclusion: architecture risk is lower than this memo originally implied. Retrieval, multi-task ranking, distributed embeddings, long-sequence models, multimodal features, and generative-recommendation recipes are increasingly public. The non-transferable constraints remain Snap's interaction and conversion history, advertiser and auction liquidity, cross-placement breadth, experiment throughput, safety/policy operation, and serving economics.

### Universal user modelling is the right architectural direction

Snap’s **Universal User Modeling** work combines signals across content, advertisements, growth surfaces, and augmented-reality Lenses, uses more than a year of behavioural sequences, and trains multiple prediction tasks together. The work describes transformer and attention-based models that produce reusable user representations. [Snap Universal User Modeling](https://eng.snap.com/universal_user_modeling)

The underlying Snap-authored paper also reports production A/B results. Long-form video open rate increased 2.78%, aggregate long-form view-time sum increased 19.2%, but long-form view time per user increased only 0.28%; Lens play time increased 1.76% and notification open rate increased 0.87%. The corresponding platform-wide daily-user changes were much smaller at 0.04% for application opens and 0.08% for content views. These issuer-selected tests show real production value, but the per-user and daily-user changes prevent a large aggregate surface metric from being mistaken for a company-wide engagement transformation. [Universal User Modeling paper](https://arxiv.org/abs/2504.21838)

In plain English, this attempts to let one part of Snap learn from another. A user’s Spotlight viewing, Lens use, advertisement interaction, and other eligible behaviours can inform a richer representation than a separate model for every surface.

**What this can improve:**

- cold-start prediction on a new placement;
- candidate retrieval;
- interest and intent representation;
- transfer from common events, such as views, to rare events, such as purchases;
- consistency across Spotlight, Stories, and ads.

**What it cannot create by itself:**

- purchase labels that advertisers did not send;
- competing bids that do not exist;
- high-value users in geographies where Snap’s audience is shrinking;
- a Meta-sized advertiser base;
- proof that a conversion was incremental.

### Concrete lower-funnel progress

**Fact:** In the first quarter of 2026, Snap reported:

- **Dynamic Product Ads (DPA)** revenue up 30%;
- application goal-based bidding revenue up 27%;
- application-purchase volume up 87%;
- nearly 70% of advertising spend using at least one of Smart Audience, Smart Budget, or Smart Placement;
- a large-language-model intent system improving Dynamic Product Ad purchase conversion by about 2%;
- vision-language-model similar-product retrieval producing a high-single-digit lift;
- application re-engagement purchase volume up about 2% while CPA declined about 9%.

[Snap first-quarter 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm)

**Fact:** In the second quarter of 2026, Snap reported:

- cost per application installation down 8%;
- cost per application purchase down 18%;
- application-purchase volume up 128%;
- Dynamic Product Ad revenue up 43%;
- approximately one-third of Sponsored Snap reach incremental to Snap’s other advertising surfaces.

[Snap second-quarter 2026 prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf)

**Fact, but weak as an absolute metric:** Sponsored Snaps’ first-quarter click-through rate rose 226% and seven-day conversions rose 59%. Without the starting rate, cost, advertiser mix, or control, a large percentage lift can still end at a mediocre level. Treat it as product direction rather than proof of platform-wide economics.

**Fact:** Snap increased its expected 2026 infrastructure-cost range from $1.60–$1.65 billion to $1.65–$1.70 billion in the second quarter, explicitly to support machine-learning and artificial-intelligence revenue growth. This is evidence of commitment, not cost-free leverage. [Snap second-quarter 2026 prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf)

### The most important remaining test is persistence

Snap's prepared materials omitted global impression and effective-price growth, but the second-quarter Form 10-Q reports average advertising price per impression up approximately 10%. Against 9.3% advertising-revenue growth, that implies roughly flat to slightly negative impression delivery after rounding. After four prior quarters of substantial price dilution, this is real yield repair—but investors still cannot tell whether:

- the price improvement will persist after World Cup spending;
- impression volume can resume growth without renewed price dilution;
- regional or product mix drove an unusual portion of the increase;
- lower-funnel products can retain their performance as advertiser budgets scale.

**Opinion:** Monetisation repair is demonstrated for one quarter, not yet through a full demand cycle. The third quarter must show a second healthy price result and renewed volume discipline.

---

## 6. Competitive capability: Snap versus Meta, TikTok, and Reddit

| Dimension | Snap | Meta | TikTok | Reddit |
|---|---|---|---|---|
| Core consumer signal | Communication-adjacent behaviour, Stories, Spotlight, Map and augmented-reality interaction | Cross-application social graph, content, creator, business and commerce interactions across Facebook and Instagram | Rapid content-consumption feedback and a strong short-video interest graph | Explicit community, topic, conversation and research context |
| Public recommendation evidence | Bento, Universal User Modeling, multi-stage ad ranking, embedding retrieval, language and vision models | Andromeda retrieval, GEM generative ads model, long-sequence learning, specialised hardware | ByteDance’s Monolith paper and open-source implementation describe collisionless embeddings and real-time learning; this is a public technical proxy, not proof of the exact current production stack | Max campaigns automate targeting, placement, budget and creative; Community Intelligence uses first-party conversation context |
| Advertising-marketplace scale | 2025 advertising revenue approximately $5.19 billion | 2025 advertising revenue approximately $196.18 billion | Private-company platform; comparable audited advertising revenue is not publicly available | Much smaller than Meta; Tinuiti says spend among dual-active advertisers was 15% of their Meta spend in fourth-quarter 2025 |
| Lower-funnel status | Improving DPA, application bidding, CAPI, Smart products and Sponsored Snaps; one quarter of price repair, roughly flat volume | Mature cross-placement automation and deep conversion history; currently growing impressions and price | Mature automated bidding and native video commerce; public auction docs support optimised CPM and learning-phase mechanics | Conversion stack exists; Max campaigns only entered limited beta in January 2026 |
| Main advantage over Snap | — | Auction liquidity, conversion volume, cross-placement scale, agency habit, compute and infrastructure | Fast interest feedback, native short-video demand and real-time trend adaptation | Explicit communities and text-rich commercial research signals |
| Snap’s differentiated counter-position | — | Younger incremental reach, camera/augmented-reality formats, close-friend and Map surfaces | Communication graph and direct-response formats outside an entertainment-only feed | Much larger daily consumer scale and a more mature performance-ad stack |

Sources: [Snap Bento](https://eng.snap.com/introducing-bento), [Snap Universal User Modeling](https://eng.snap.com/universal_user_modeling), [Snap ad ranking](https://eng.snap.com/machine-learning-snap-ad-ranking), [Meta Andromeda](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/), [Meta GEM](https://engineering.fb.com/2025/11/10/ml-applications/metas-generative-ads-model-gem-the-central-brain-accelerating-ads-recommendation-ai-innovation/), [ByteDance Monolith paper](https://arxiv.org/abs/2209.07663), [Monolith open-source repository](https://github.com/bytedance/monolith), [TikTok bidding methods](https://ads.tiktok.com/help/article/bidding-methods), [TikTok bidding strategies](https://ads.tiktok.com/help/article/bidding-strategies), [Reddit Max campaigns](https://www.business.reddit.com/blog/max-campaigns), [Reddit Community Intelligence](https://www.business.reddit.com/advertise/reddit-community-intelligence), [Reddit conversion campaigns](https://www.business.reddit.com/campaign-objective/conversions), [Tinuiti benchmark](https://tinuiti.com/research-insights/research/digital-ads-benchmark-report-q4-2025/)

### Meta: the benchmark Snap has not yet matched

Meta’s Andromeda system retrieves a few thousand candidates from tens of millions. Its Generative Ads Recommendation Model (GEM) is described as training on billions of user-advertisement interactions per day across thousands of graphics-processing units. Meta reported that deploying GEM contributed approximately 5% more conversions on Instagram and 3% on Facebook Feed in relevant second-quarter tests. These are Meta’s own selected results, not independent replication. [Meta Andromeda](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/), [Meta GEM](https://engineering.fb.com/2025/11/10/ml-applications/metas-generative-ads-model-gem-the-central-brain-accelerating-ads-recommendation-ai-innovation/)

The critical advantage is not one secret model. Meta combines:

- tens of millions of candidates;
- enormous conversion volume;
- Facebook and Instagram placements;
- advertiser and agency habit;
- specialised hardware and large compute budgets;
- a mature server-side measurement ecosystem;
- enough bid competition to turn improved outcomes into higher price.

That final point is visible in the financials: Meta grew both impressions and average price in 2025 and again in the second quarter of 2026.

### TikTok: faster content feedback

TikTok’s content-first experience produces many rapid signals—watch time, completion, skip, replay, share, search and follow—that can update a user’s short-term interest representation. ByteDance’s Monolith paper describes real-time training and collisionless embedding tables designed for large-scale recommendation. It is credible evidence of ByteDance technical capability, but it should not be represented as a current audited diagram of TikTok Ads. [Monolith paper](https://arxiv.org/abs/2209.07663)

TikTok’s public advertising documentation also shows the same economic foundations as peers: bids interact with relevance; optimised cost-per-thousand-impressions bidding targets likely converters; campaigns pass through a learning period; and cost-cap strategies trade stable cost for delivery volume. [TikTok bidding methods](https://ads.tiktok.com/help/article/bidding-methods), [TikTok bidding strategies](https://ads.tiktok.com/help/article/bidding-strategies)

**Why this is hard for Snap:** Snapchat’s core private-communication utility can be extremely sticky, but communication frequency does not automatically reveal which shoe, application, or holiday a user intends to buy. Spotlight and public content help close that signal gap. The correct inference is not that Snap has no intent data; it is that its strongest social utility and its most monetisable recommendation signals do not perfectly overlap.

### Reddit: strong context, less mature automation

Reddit’s communities and conversations provide explicit topic and research context. Its Community Intelligence pitch says it applies artificial intelligence to first-party conversation data, while Max campaigns automate targeting, placement, budget, and creative. Reddit’s January 2026 limited-beta announcement cites 17 internal split tests, a 17% lower CPA, and 27% more conversions; these are small-sample issuer results and should be treated as promising rather than conclusive. [Reddit Community Intelligence](https://www.business.reddit.com/advertise/reddit-community-intelligence), [Reddit Max campaigns](https://www.business.reddit.com/blog/max-campaigns)

Relative to Reddit, Snap has a more mature automated performance stack and much larger daily consumer reach. Reddit has unusually explicit commercial-research context and currently faster agency spend growth from a smaller base.

---

## 7. What Snap can copy—and what it cannot copy quickly

### Copyable within roughly one to three years

These are engineering and product patterns, not exclusive assets:

- two-stage or multi-stage candidate retrieval and ranking;
- transformer-based user and advertisement representations;
- multi-task prediction of clicks, purchases, hides, and retention;
- broad automated audiences;
- automated placement and budget allocation;
- value-based bidding;
- catalogue matching and Dynamic Product Ads;
- generative creative variation;
- server-to-server conversion interfaces;
- advertiser dashboards, experiments, and recommendations;
- sequence models spanning content and advertising events.

Snap is already implementing many of them. The question is execution speed and result, not conceptual awareness.

Public software makes the list cheaper to implement, but the open-large-language-model analogy is incomplete. A language model can arrive with broadly useful learned knowledge. A recommender's most valuable knowledge is a changing record of platform-specific users, items, impressions, bids, and conversions. Open source supplies the learning machinery, not Meta's event history or marketplace. The likely result is therefore faster improvement in Spotlight and Stories, where Snap owns frequent content feedback, than in advertising yield, where rare conversion labels and auction density are decisive.

### Not quickly copyable

1. **Historical conversion data**
   Billions of past purchase and installation events improve rare-event prediction. History must be accumulated; it cannot be downloaded from a research paper.

2. **Auction density**
   A user-impression opportunity becomes valuable when several relevant advertisers compete. A perfect ranker choosing among two weak bids cannot monetise like a good ranker choosing among dozens.

3. **Advertiser budgets and trust**
   Media teams set workflow, measurement, and creative around incumbent platforms. A new feature does not instantly move budget.

4. **Cross-placement breadth**
   Meta can allocate across Facebook and Instagram feeds, Stories, Reels, and other inventory. This gives automation more chances to find an outcome while meeting budget.

5. **High-value regional scale**
   An additional low-monetisation user helps headline daily-active-user growth but contributes less purchase data and bidding intensity than an additional North American buyer.

6. **Closed-loop commerce signals**
   Platforms with native shops, product search, or extensive merchant integrations can observe more of the journey from interest to purchase.

7. **Agency and software integration**
   Templates, creative pipelines, reporting, attribution, and employee knowledge create operational switching costs.

8. **Compute efficiency and specialised hardware**
   Snap can buy accelerators, but Meta’s co-design, utilisation, and software stack were built over years and spread across a much larger revenue base.

### Snap’s moat that competitors cannot perfectly copy

- a close-friend communication graph;
- a camera-first product and augmented-reality Lens ecosystem;
- Map context and real-world venue behaviour, subject to privacy controls;
- differentiated younger reach;
- communication, content, and augmented-reality signals inside one application;
- potential Sponsored Snap inventory adjacent to a high-frequency inbox.

**Inference:** These assets are most valuable when converted into privacy-safe outcome prediction and incremental reach. They are not automatically monetisable merely because they exist.

---

## 8. The next-four-quarter advertising bridge

### Starting point

**Calculation:** Trailing advertising revenue through the second quarter of 2026 was approximately:

\[
1.32 + 1.48 + 1.244 + 1.283 = \$5.327\text{ billion}
\]

The components are third-quarter 2025, fourth-quarter 2025, first-quarter 2026, and second-quarter 2026 advertising revenue, rounded from company disclosures.

The existing Snap valuation model uses next-four-quarter advertising revenue of:

- **Bear:** $5.515 billion, up 3.5%;
- **Base:** $5.954 billion, up 11.7%;
- **Bull:** $6.316 billion, up 18.5%.

### What each case requires from impressions and price

The revenue relationship is:

\[
1 + g_{\text{advertising revenue}} \approx (1 + g_{\text{impressions}})(1 + g_{\text{eCPM}})
\]

This simplification includes regional, format, advertiser, and placement mix inside the effective-price term.

| Case | Advertising-revenue growth | Assumed impression growth | Implied eCPM growth | Operational story |
|---|---:|---:|---:|---|
| Bear | 3.5% | 12.5% | **-8.0%** | Inventory continues to outrun advertiser demand; lower-funnel gains remain concentrated. |
| Base | 11.7% | 11.5% | **+0.2%** | Effective price roughly stabilises as Smart products, DPA, Sponsored Snaps, and external measurement deepen budgets. |
| Bull | 18.5% | 11.0% | **+6.8%** | Snap produces genuine yield repair while preserving double-digit inventory growth. |

**Assumption:** Impression growth moderates from recent high-teens rates as Snap manages supply quality and high-value audience pressure. These are scenario inputs, not company guidance.

### What 20% or 30% growth really requires

| Target advertising growth | If impressions grow 10% | If impressions grow 15% |
|---|---:|---:|
| 20% | eCPM must rise **9.1%** | eCPM must rise **4.35%** |
| 30% | eCPM must rise **18.2%** | eCPM must rise **13.0%** |

**Opinion:**

- Around **20%** is a defensible bull outcome because it requires mid-single-digit price recovery if impressions remain near 15%.
- Around **30%** requires a step-change in auction demand and price after repeated double-digit declines. It is possible for a quarter with easy comparisons or mix help, but too demanding as a sustained base case.
- The base case does not need Snap to reach Meta’s monetisation. It needs the price decline to stop.

### Valuation sensitivity

**Calculation:** At a **1.65-times enterprise-value-to-revenue multiple** and approximately **1.93 billion diluted shares**, each additional $100 million of next-four-quarter revenue is worth about:

\[
\frac{\$0.10\text{ billion} \times 1.65}{1.93\text{ billion shares}} = \$0.086\text{ per share}
\]

At a 2.40-times multiple, the same $100 million is worth about $0.124 per share.

Holding the multiple and all other inputs fixed:

- bear-to-base advertising revenue adds $439 million, or about **$0.38 per share** at 1.65 times;
- base-to-bull advertising revenue adds $362 million, or about **$0.31 per share** at 1.65 times and **$0.45 per share** at 2.40 times.

**Important:** The larger valuation effect is likely to come from the market changing the multiple when price repair is proven. The existing model estimates that every 0.25 turn of enterprise-value-to-revenue multiple is worth roughly $0.95 per share. Revenue upside and a rerating must be modelled separately to avoid double-counting.

### Advertising outcome anchors—not probability buckets

| Outcome | Distribution role | Meaning |
|---|---|---|
| Effective price remains materially negative; advertising growth stays below 8% | Lower-tail anchor | Bear evidence wins; low price reflects insufficient demand rather than a temporary arbitrage. |
| Effective price stabilises around flat; advertising growth reaches roughly 8–15% | Central range | Product progress is real, but demand and measurement repair take time. |
| Effective price turns mid-single-digit positive; advertising growth reaches roughly 15–22% | Upper-central range | Lower-funnel outcomes scale and advertisers deepen budget. |
| Effective price rises high single digits or more; advertising growth exceeds 22% | Upside-tail anchor | Requires unusually fast auction densification. |

These are interpretable checkpoints, not exhaustive conditional states and not statistically estimated frequencies. The canonical [distributional valuation](../valuation/2026-W34-valuation.md#distribution-first-valuation) expresses advertising uncertainty through a continuous five-point marginal, dependency structure, and explicit tail diagnostics.

---

## 9. What would prove or falsify the advertising thesis

### The compact quarterly scorecard

| Metric | Bullish proof | Warning | Why it matters |
|---|---|---|---|
| Global eCPM | Flat, then positive for two quarters | Still down high single digits or worse | Direct evidence that demand is catching supply |
| Advertising revenue | At least low-double-digit growth without extreme impression growth | Growth remains below 8% | Tests whether product gains are material at company scale |
| Impression growth | Healthy but not the only growth engine | Very high impressions with weak revenue | More inventory can hide yield deterioration |
| DPA revenue | Sustained growth above overall advertising | Sharp deceleration from the 30–43% range | Lower-funnel product-market fit |
| Application purchase CPA and volume | Lower cost *and* strong volume growth | Lower cost caused by reduced delivery | Measures scaling quality |
| External iROAS | Strong returns persist as spend share rises above 5% | Return falls sharply when budgets scale | Tests whether current efficiency is a marginal-spend effect |
| Large-customer budget depth | Broader commitments and more repeat spend | “Early and uneven” persists | Auction density and trust |
| Smart product adoption | High adoption accompanied by better external outcomes | Adoption rises but eCPM and iROAS do not | Automation usage alone is not value |
| North American and European audience | Stabilisation, especially among monetisable cohorts | Continued decline hidden by Rest-of-World growth | High-value demand and conversion labels |
| Infrastructure efficiency | Advertising growth outruns infrastructure cost | Cost rises without yield repair | Whether machine learning creates operating leverage |

### High-value questions for management

1. What were global and regional impression and effective-price growth in the third quarter of 2026, and did the second-quarter price inflection persist after World Cup spending?
2. How does external incremental return change when an advertiser raises Snapchat from 5% to 10% or 15% of social spend?
3. What percentage of advertising revenue, not merely spend, uses all three Smart Audience, Smart Budget, and Smart Placement products together?
4. How many advertisers send purchase-quality events through CAPI, and how has event match quality changed?
5. How much of DPA growth is new advertisers, higher spend per advertiser, or easier comparisons?
6. What share of Sponsored Snap revenue is genuinely incremental rather than shifted from Stories or Spotlight?
7. Can management publish eCPM by major region or at least separate price and impression growth for North America, Europe, and Rest of World?
8. What were absolute baseline click and conversion rates behind the 226% and 59% Sponsored Snap improvements?
9. How has cost per incremental acquisition changed in third-party experiments after a budget doubling?
10. What is the revenue or conversion lift per incremental dollar of machine-learning infrastructure cost?

---

## 10. Final investment interpretation

### What current evidence supports

Snap owns a very large attention asset, reaches differentiated younger users, and monetises far below Meta. Independent-measurement vendors and commerce datasets provide credible evidence that some advertisers are under-allocating to Snap. Better retrieval, ranking, automation, and conversion measurement can turn that under-allocation into demand. Snap’s engineering disclosures and 2026 lower-funnel product metrics show a plausible mechanism, not merely a valuation story.

### What current evidence does not support

Low advertising prices are not proof of hidden value. They can be the symptom of the problem. Snap’s marketplace has repeatedly added impressions faster than advertiser demand, pushing effective prices down. Meta’s superiority is not reducible to one recommendation algorithm that Snap can reproduce. Meta’s advertiser liquidity, rare-event conversion history, placement breadth, compute, measurement, and workflow position compound with its models.

### The cleanest way to hold the thesis

> Snap does not need to become Meta. It needs to demonstrate that the second-quarter effective-price inflection can persist while healthy impression growth resumes.

That makes the next stage unusually observable:

- If eCPM remains near flat or positive, the roughly 12% advertising base case is credible and the market may rerate the revenue.
- If eCPM stays positive while impression delivery resumes and DPA/application-purchase products retain good external returns, the approximately 19% bull case becomes credible.
- If impressions continue growing in the teens while eCPM remains down high single or double digits, “cheap Snap ads” should be read as weak marketplace demand, and the relative-cheapness thesis is weakened rather than strengthened.

**Bottom line:** The advertising evidence is more constructive than a simple comparison with Meta’s current monetisation would suggest, but less constructive than “Snap ads are always cheapest.” The investable opportunity is a **yield-repair option**. The second-quarter Form 10-Q shows that option was exercised for one quarter. Persistence and simultaneous volume growth remain the proof required for a durable rerating.

---

## Source-quality notes

| Source class | How it is used | Confidence |
|---|---|---:|
| Securities and Exchange Commission filings and issuer financial releases | Revenue, impression, price, cost, and product metrics | High for reported figures; medium for selected operating claims |
| Official engineering publications and product documentation | System architecture and intended mechanism | Medium-high for existence/direction; medium for selected performance lifts |
| Agency benchmarks | Cross-platform cost levels and directional trends | Medium; mix and sample selection are material |
| External measurement vendors | CPA, ROAS, and incrementality direction | Medium; cohort selection and unpublished methodology limit generalisation |
| Co-marketed platform studies | Supporting evidence only | Low-to-medium |
| Specialist calculation and inference | Scenario bridge and valuation sensitivity | Transparent but assumption-dependent |

No paid or authenticated source text was copied into this memo. Vendor output is treated as evidence about the vendor’s observed cohort, not as a universal platform fact.
