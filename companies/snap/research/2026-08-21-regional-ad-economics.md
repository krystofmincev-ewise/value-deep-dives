---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-21
source_cutoff_at: 2026-08-21T14:55:00+02:00
scope: regional_advertising_prices_and_contribution_economics
tags: [snapchat, advertising, subscriptions, regional-economics, meta, reddit]
---

# Snap regional advertising prices and contribution economics

> **Purpose:** use recent advertiser prices, campaign data, subscription-price differences, peer platforms, and Snap's reported second-quarter 2026 financials to narrow the North America, Europe, and Rest-of-World profitability gap. This is an estimate, not a company disclosure and not personalized investment advice.

## Answer first

Yes: public and signed-in research can improve the estimate materially. It cannot produce **reported regional profitability**, because Snap does not publish regional expense or subscription revenue. The best defensible result is a Q2 2026 regional contribution model that reconciles exactly to reported company gross profit and operating loss.

The revised base estimate is:

| Region | Gross contribution margin | Middle 80% of sensitivity grid | After directly attributable cash-like sales/support | Middle 80% of sensitivity grid | After allocating all GAAP sales and marketing |
| --- | ---: | ---: | ---: | ---: | ---: |
| North America | **72.1%** | 69.7%–74.3% | **60.0%** | 57.2%–63.2% | 52.4% |
| Europe | **59.9%** | 56.1%–62.6% | **48.8%** | 44.6%–52.1% | 41.8% |
| Rest of World | **13.0%** | 4.2%–24.2% | **3.2%** | -6.2%–14.0% | -3.0% |

The sensitivity grid is mechanical, not a probability distribution or statistical confidence interval. It spans plausible subscription geography, ad-yield indices, user-versus-monetized-impression infrastructure weights, other cost of revenue, and directly attributable sales/support shares.

The important update is directional. The earlier uniform per-user cost proxy made Rest of World approximately breakeven at gross contribution. Country-level ad-yield evidence supports allocating part of infrastructure by monetized delivery rather than all of it equally per daily user. That moves the Rest-of-World base gross contribution margin to approximately **13%**, while leaving it around breakeven after regional sales and customer-support expense. North America and Europe remain clearly profitable on either method.

Confidence in the **sign and ordering** of regional gross contribution rises from medium-low to **medium**. Confidence in the Rest-of-World point estimate remains medium-low. The result does not justify the word “reported,” a precise regional operating margin, or a valuation increase by itself.

---

## What the live research could and could not retrieve

The signed-in Chrome research session was usable for Google/Gemini and public-source discovery. Snap Ads Manager, Meta Ads Manager, and Reddit Ads each required a separate advertiser-account login before presenting a live campaign quote. No credentials were entered and no ad campaign was created. Snap's public pricing page confirms that Ads Manager presents estimated reach and results after an advertiser sets an objective, audience, and budget; its public Reach and Frequency application programming interface can return a country-specific reach curve, but access is whitelisted and tied to an ad account. [Snap pricing](https://forbusiness.snapchat.com/advertising/pricing) [Snap Reach and Frequency guide](https://developers.snap.com/marketing-api/Ads-API/reach-and-frequency)

This matters for reproducibility: a “same ad” quote is not a public constant. It changes with the objective, operating system, age, placement, optimization event, bid strategy, dates, frequency cap, creative quality, and auction competition. A single broad multi-country campaign is also not a clean country experiment because delivery shifts toward the cheaper inventory.

Snap itself allows Single Image or Video, Story, Collection, Commercial, Sponsored Snap, augmented-reality Lens, and Filter formats. Multi-Format Delivery applies one budget and objective across several formats and lets the auction shift into the best-suited inventory. That makes a format-by-format price table intrinsically incomplete unless placement is forced. [Snap ad formats](https://forbusiness.snapchat.com/advertising/ad-formats) [Snap Multi-Format Delivery](https://forbusiness.snapchat.com/multi-format-delivery-ads)

---

## Advertiser-price evidence

### Snapchat: absolute observations and format effects

These observations are not pooled into a false global average. They are retained with their objective, format, geography, and selection limits.

| Geography / period | Objective and format | Advertiser observation | What it can support | Limitation |
| --- | --- | ---: | --- | --- |
| Mixed/global, 2025 | Cross-campaign Snap benchmark | $8.60 average CPM; June $8.39; Jan–Jun range $6.01–$12.04 | Global reasonableness band | Agency mix; geography and objectives are not matched |
| US-market inference, Apr–May 2023 | Lens + Commercials + Snap Ads | $6.26 blended CPM | A US-dollar multi-format brand anchor | Old, issuer-selected, and exact geography is inferred from the US brand/agency rather than stated in the case-study text |
| Netherlands, Jul–Aug 2023 | Skippable Snap Ads | €1.05 CPM | Low-cost European awareness inventory | Old and issuer-selected |
| Netherlands, Jul–Aug 2023 | Snap Ads + non-skippable Commercials | €1.78 blended CPM | Format mix can raise the blended price | Old and issuer-selected |
| United States, 2026 guide | Gaming app install | $4.83 iOS / $9.66 Android eCPM | Current acquisition-campaign US anchor | AdQuantum/Snap guide does not disclose sample size or weighting |
| Germany, 2026 guide | Gaming app install | $2.07 iOS / $7.06 Android eCPM | Europe/US yield ratio is not fixed and can vary by operating system | Same methodology limitation |
| United Kingdom, 2026 guide | Gaming app install | $1.66 iOS / $2.27 Android eCPM | A low-end European acquisition observation | Very low install rate makes this cohort unstable |
| Qatar / Saudi Arabia / Morocco / Bahrain, 2026 guide | Gaming app install | $1.23–$4.79 eCPM across available OS cohorts | Middle East is heterogeneous, not uniformly premium | Sparse country/OS cells; not an all-ad price |
| United Arab Emirates, Aug–Sep 2025 | Sponsored Snap versus Snap/Story Ads | 20% lower CPM; 3.5 times paid reach | Sponsored Snaps can clear below conventional placements | Relative only; issuer-selected telecom test |
| Saudi Arabia, Sep–Oct 2024 | AR Filter plus video | $0.90 effective CPM | Earned sharing can make AR reach look extremely cheap | 70% of reach was earned, so this is not paid-media CPM |
| France, Mar 2025 | Target Cost V2 versus Auto Bid | 53% lower CPM, 36% lower cost per purchase | Bid strategy materially changes observed CPM | Relative only; creative changed too |

Sources: [Gupta Media Snap costs](https://www.guptamedia.com/insights/snapchat-ads-cost), [Fruit of the Loom](https://forbusiness.snapchat.com/inspiration/fruit-of-the-loom-success-story), [Nederlandse Spoorwegen](https://forbusiness.snapchat.com/inspiration/nederlandse-spoorwegen-success-story), [AdQuantum/Snap 2026 guide](https://www.adquantum.com/s/Snapchat_x_AdQuantum_Ad_Creative_Guide_2026.pdf), [e& Sponsored Snaps](https://forbusiness.snapchat.com/inspiration/etisalat-success-story), [Faces AR campaign](https://forbusiness.snapchat.com/inspiration/faces-success-story), and [leboncoin](https://forbusiness.snapchat.com/inspiration/leboncoin-success-story).

The 2026 AdQuantum/Snap guide was downloaded to the ignored local capture area and page 49 was checked visually. The page labels the two country tables as iOS and Android and reports cost per install, click-through rate, installs per thousand impressions, and eCPM. The table is useful because it is current and country-specific; it is not treated as a representative Snap-wide price because the methodology and sample size are absent.

### Meta: a current geographic auction anchor

Lebesgue's 27 July 2026 ecommerce benchmark supplies a consistent country table for Facebook ads:

| Country | CPM | Index versus US |
| --- | ---: | ---: |
| United States | $16.08 | 1.00 |
| Canada | $11.47 | 0.71 |
| United Kingdom | $11.81 | 0.73 |
| Germany | $9.05 | 0.56 |
| Netherlands | $8.58 | 0.53 |
| France | $6.95 | 0.43 |
| Saudi Arabia | $12.01 | 0.75 |
| Mexico | $3.92 | 0.24 |
| Brazil | $2.63 | 0.16 |
| India | $1.36 | 0.08 |

This is an ecommerce Meta benchmark, not a Snap price and not Meta's corporate publisher eCPM. Its proper use is to validate the direction and plausible breadth of the geographic auction gradient. [Lebesgue country CPM benchmark](https://lebesgue.io/facebook-ads/facebook-cpm-by-country)

Meta's own Q2 filing gives the mechanism-level corroboration: ad impressions rose 14%, average price per ad rose 12%, and ad growth was strongest in lower-monetizing geographies and products. It explicitly says US/Canada and Europe monetize more highly because of the size and maturity of their advertising markets. [Meta Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1326801/000162828026050705/meta-20260630.htm)

### Reddit: an objective/format cross-check

Reddit's official documentation confirms that billing can be cost per click, cost per thousand impressions, or cost per view and depends on campaign objective rather than just creative format. One 2025 specialist-agency table reports these approximate CPM bands:

| Geography | App install | Awareness | Catalog | Conversion | Video views |
| --- | ---: | ---: | ---: | ---: | ---: |
| United States | $8.76 | $5.29 | $2.58 | $5.10 | $11.24 |
| United Kingdom | $2.11 | $4.73 | $3.56 | $2.15 | not shown |
| Canada | $2.03 | $3.91 | $2.21 | $2.07 | $4.72 |
| Germany | $2.24 | $4.19 | $1.26 | $2.63 | $4.96 |

The agency page does not disclose sample size, spend, dates, or weighting, so these are a low-confidence format/objective check—not model inputs. The stronger independent Dutch DDMA dataset covers 514,000 campaigns and €354 million of spend from 19 agencies through June 2025, but its public report does not expose the detailed country/platform table. [Reddit ad types and billing](https://www.business.reddit.com/advertise/ad-types) [Reddit specialist-agency table](https://www.theredditmarketingagency.com/post/reddit-advertising-benchmarks-what-you-need-to-know-in-2025) [DDMA benchmark methodology](https://ddma.nl/kennisbank/ddma-social-advertising-benchmark-2025-conversie-maakt-comeback-platformmix-verbreed/)

### What the evidence supports for Snap

The model does **not** donate Meta or Reddit costs to Snap. The observed Snap country ratios and Meta's consistent country panel support the following deliberately broad Snap advertiser-yield index:

| Region | Low | Base | High | Interpretation |
| --- | ---: | ---: | ---: | --- |
| North America | 1.00 | 1.00 | 1.00 | Normalized base |
| Europe | 0.45 | 0.60 | 0.75 | Western Europe is usually below North America, but UK/OS/format mix can narrow or widen the gap |
| Rest of World | 0.15 | 0.25 | 0.40 | India/Latin America lower the average; Gulf markets pull it upward |

These indices are used only to infer a regional mix of monetized ad impressions from reported regional revenue. They are not forecast CPMs.

---

## Subscription geography: the other necessary bridge

Snap's Q2 Other Revenue was $316.5 million and includes subscriptions and partnerships, but geography is not disclosed. Current Apple storefront prices show why daily-user shares are a poor allocator: base Snapchat+ is $4.99 per month in the United States, £4.99 in the United Kingdom, €3.99 in France and Germany, and ₹99 in India. [US App Store](https://apps.apple.com/us/app/snapchat/id447188370?ls=1) [UK App Store](https://apps.apple.com/gb/app/snapchat-chat-with-friends/id447188370) [France App Store](https://apps.apple.com/fr/app/snapchat-chats-entre-ami-e-s/id447188370?platform=vision) [Germany App Store](https://apps.apple.com/de/app/snapchat-chatte-mit-freunden/id447188370) [India App Store](https://apps.apple.com/in/app/snapchat-chat-with-friends/id447188370)

The base model allocates Other Revenue 45% to North America, 25% to Europe, and 30% to Rest of World. The grid tests North America at 40%–55%, Europe at 20%–30%, and Rest of World at the residual 15%–40%. Price differences support the direction, not the subscriber-count assumption; actual subscriber geography remains one of the largest errors in the model.

---

## Regional reconciliation model

### Reported Q2 2026 starting point

| Reported item | Amount |
| --- | ---: |
| Revenue | $1,599.0m |
| Advertising Revenue | $1,282.5m |
| Other Revenue | $316.5m |
| Cost of Revenue | $667.9m |
| Gross profit / margin | $931.1m / 58.2% |
| Sales and Marketing | $298.4m |
| Research and Development | $542.1m |
| General and Administrative | $261.3m |
| GAAP operating loss | $170.7m |

Regional revenue, daily active users, and average revenue per user are reported by Snap; regional costs are not. North America generated $942.9 million from 92 million daily active users, Europe $353.8 million from 98 million, and Rest of World $302.3 million from 303 million. [Snap Q2 2026 results](https://investor.snap.com/news/news-details/2026/Snap-Inc--Announces-Second-Quarter-2026-Financial-Results/default.aspx) [Snap Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000052/snap-20260630.htm)

### Base mechanics

1. Allocate $316.5 million of Other Revenue 45% / 25% / 30%; advertising revenue is the residual by region.
2. Divide regional advertising revenue by the 1.00 / 0.60 / 0.25 relative ad-price index to infer monetized-impression units.
3. Apply the midpoint 16.5% “other cost of revenue” rate to reported revenue: $263.8 million. The residual of actual Q2 Cost of Revenue is a $404.0 million **infrastructure/residual pool**, so the model reconciles to reported GAAP gross profit rather than mechanically using one quarter of adjusted full-year guidance. The pool should not be read as a disclosed GAAP infrastructure figure; it absorbs the difference between management's adjusted cost categories and reported Cost of Revenue.
4. Allocate the infrastructure/residual pool 60% by daily-active-user share and 40% by inferred monetized-impression share. The grid tests 40%–80% user weighting.
5. Allocate other Cost of Revenue by revenue.
6. Q2 Sales and Marketing was $298.4 million, including $47.3 million of stock-based compensation and $7.7 million of depreciation and amortization. Allocate 75% of the resulting $243.3 million cash-like amount to regions by advertising revenue; retain 25% as central. The grid tests 65%–85%.
7. Do not allocate Research and Development or General and Administrative expense to regions. They are shared corporate/product costs and any regional split would be more invented than informative.

### Base calculation

| Q2 2026 estimate | North America | Europe | Rest of World | Total |
| --- | ---: | ---: | ---: | ---: |
| Reported revenue | $942.9m | $353.8m | $302.3m | $1,599.0m |
| Reported DAU share | 18.7% | 19.9% | 61.5% | 100.0% |
| Estimated advertising revenue | $800.5m | $274.7m | $207.4m | $1,282.5m |
| Inferred monetized-impression share | 38.3% | 21.9% | 39.7% | 100.0% |
| Allocated infrastructure/residual pool | $107.2m | $83.6m | $213.2m | $404.0m |
| Allocated other Cost of Revenue | $155.6m | $58.4m | $49.9m | $263.8m |
| **Gross contribution** | **$680.1m** | **$211.8m** | **$39.2m** | **$931.1m** |
| **Gross contribution margin** | **72.1%** | **59.9%** | **13.0%** | **58.2%** |
| Directly attributable cash-like sales/support | $113.9m | $39.1m | $29.5m | $182.5m |
| **Contribution after direct cash-like sales/support** | **$566.2m** | **$172.7m** | **$9.7m** | **$748.6m** |
| **Margin after direct cash-like sales/support** | **60.0%** | **48.8%** | **3.2%** | **46.8%** |

The remaining $115.9 million of GAAP Sales and Marketing, plus $542.1 million of Research and Development and $261.3 million of General and Administrative expense, reconciles the $748.6 million regional contribution to Snap's reported $170.7 million operating loss.

### Why the result is economically plausible

- Rest of World has 61.5% of daily active users but only 18.9% of revenue. It must bear a large share of core messaging, storage, safety, and recommendation load.
- It likely has more than 18.9% of paid impressions because its clearing prices are lower. Allocating some ad-delivery infrastructure by inferred impression volume is therefore more plausible than pure revenue allocation.
- It need not bear 61.5% of advertising delivery, sales commissions, payment processing, or publisher/content costs. Pure daily-user allocation therefore overstates its cost.
- Snap's Europe/North-America average-revenue-per-user ratio is 35%, while Rest of World/North America is only 9.7%. Reddit's Q2 US/international average-revenue-per-unique ratio was 19%, and Reddit still earned a 91.3% consolidated gross margin. That confirms regional monetization gaps are normal but also shows Snap's infrastructure burden is unusually high. [Reddit Q2 2026 shareholder letter](https://www.sec.gov/Archives/edgar/data/1713445/000171344526000098/exhibit992q226.htm)

---

## What this changes in the investment view

The model improves the regional question from “unknown” to a bounded economic view:

- **North America is almost certainly the profit engine.** Even the lower part of the grid leaves a high-sixties gross contribution margin and high-fifties contribution after regional cash-like sales/support.
- **Europe is also clearly positive.** It has enough average revenue per user to carry a meaningful share of infrastructure and direct selling expense.
- **Rest of World is probably positive before sales/support and approximately breakeven after it.** This is better than the uniform-cost proxy but not evidence that incremental emerging-market users create Meta-like economics.
- **The valuation does not change today.** Consolidated revenue and cost were already in the model. This analysis changes the interpretation of where future operating leverage can come from; it does not create new company cash flow. A valuation change should wait for reported Rest-of-World average-revenue-per-user acceleration, lower infrastructure per user, or a regional/subscription disclosure that validates the allocation.

The correct confidence statement is now: financial statements and company-wide advertising price are high-confidence; North America and Europe positive regional contribution are medium-confidence; Rest-of-World gross contribution is medium-low to medium; Rest-of-World contribution after direct operating expense remains medium-low.

---

## Strongest reasons the estimate could be wrong

1. **Advertiser CPM is not publisher eCPM.** Fees, objective mix, auction credits, reseller economics, and conversion billing can separate the two.
2. **The country observations are not matched experiments.** Operating system, creative, objective, dates, frequency cap, audience, and attribution differ.
3. **Rest of World is internally bimodal.** India and Latin America are low-price; Saudi Arabia and the Gulf can be premium. Snap does not disclose their user or revenue weights.
4. **Subscription geography and plan mix are missing.** Local list prices do not reveal subscribers, annual-plan discounts, web-versus-app checkout, family plans, partner revenue, or app-store fees.
5. **Infrastructure cost is not one homogeneous pool.** Messaging/storage load, video delivery, ranking inference, machine-learning training, safety, and unused capacity scale differently.
6. **Sales and Marketing is not fully direct.** It includes central brand marketing, partnerships, customer service, stock compensation, and depreciation; regional employee locations are not regional customer economics.
7. **Moderation and regulatory cost are not isolated.** They may sit in Cost of Revenue, Research and Development, Sales and Marketing, or General and Administrative expense.
8. **Issuer case studies are selected winners.** They show what can happen, not the platform mean.
9. **The Q2 mix may be seasonal.** World Cup demand and summer CPM seasonality can move country and format weights.
10. **No active advertiser-account quote was obtained.** The estimator mechanism was verified, but a contemporaneous same-creative country matrix remains a useful future check if the user signs into an authorized ad account.

---

## Reproduction

Run:

```bash
node companies/snap/valuation/verify-2026-08-21-regional-economics.mjs
```

The verifier asserts the Q2 company reconciliation, base regional allocation, 2,673-case sensitivity grid, middle-80% ranges, and bridge back to reported GAAP operating loss.
