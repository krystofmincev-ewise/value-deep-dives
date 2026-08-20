# Open-source research tooling review

Reviewed 2026-08-20 against public repository pages, licence files, documentation, and selected implementation files. GitHub activity and popularity are discovery signals, not quality guarantees. Provider data rights are separate from a tool's code licence.

## Decision summary

The repository should not import a monolithic “AI hedge fund.” The useful open-source components are deterministic filing parsers, financial formulas, market calendars, statistical test contracts, agent-evaluation harnesses, and high-quality artifact schemas. Keep source acquisition, normalized facts, calculations, agent interpretation, and prospective scoring separate.

### Pilot or adapt first

| Project | Licence / activity at review | Useful capability | Decision and boundary |
| --- | --- | --- | --- |
| [EdgarTools](https://github.com/dgunning/edgartools) | MIT; active 2026-08-19 | Typed filings, standardized and dimensional XBRL, 8-K, Forms 3/4/5, 13F and 13D/G, section extraction, agent guidance, extensive tests | Pilot behind the repository's SEC identity, rate, cache, and canonical-link layer. Verify standardized facts against filing contexts. |
| [FinanceToolkit](https://github.com/JerBouma/FinanceToolkit) | MIT; active 2026-08-18 | Transparent ratios, DCF/DDM/WACC, performance, risk, rolling and TTM calculations | Reuse formulas and test vectors with repository-owned inputs. Disable or bypass silent FMP/Yahoo provider fallback and audit fiscal-period calendarization. |
| [Arelle](https://github.com/Arelle/Arelle) | Apache-2.0 in the licence file; active 2026-08-20 | Certified XBRL processor with Inline XBRL, ESEF, SEC EFM, FERC, HMRC, and other taxonomy support | Add only when a live non-US/ESEF or complex-XBRL need justifies the large taxonomy/runtime surface. Pin versions and packages. |
| [SEC DERA financial-dataset examples](https://github.com/sec-gov/python-for-dera-financial-datasets) | CC0-1.0; active 2026-01-21 | Official examples for SEC Financial Statement and Financial Statement-and-Notes bulk datasets | Use as the official ingestion reference, not as a production normalizer. Preserve filing versions, acceptance timestamps, and restatements. |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | MIT; active 2026-08-20 | Local declarative prompt, agent, RAG, deterministic assertion, and red-team evaluation | Add when the first end-to-end company agent exists. Start with schema, citation, arithmetic, cutoff, tool-policy, and contradiction assertions; LLM judges are secondary. |
| [PUDL](https://github.com/catalyst-cooperative/pudl) | MIT code; CC-BY-4.0 data/docs; active 2026-08-20 | Versioned EIA, FERC, EPA CEMS, PHMSA, NREL, and entity crosswalks | Preferred energy-data integration candidate. Retain source releases and verify material values at the official agency. |
| [Open Targets platform MCP](https://github.com/opentargets/platform-mcp) | Apache-2.0 code; active 2026-07-01 | Target/disease, genetics, safety, tractability, and drug-evidence discovery | Integrate as an evidence index. Platform data is broadly CC0, but upstream evidence licences vary; follow material claims to their sources. |
| [exchange_calendars](https://github.com/gerrymanoim/exchange_calendars) | Apache-2.0; active 2026-08-14 | Exchange sessions, holidays, opens/closes, and interruptions | Preferred calendar oracle for event evaluation; independently test the exchanges actually used. |
| [Mira](https://github.com/byteseek/Mira) | Apache-2.0; active 2026-07-05 | Evidence logs, expectation maps, thesis and decision ledgers, manifests, event deltas, validators | Adapt artifact and QA ideas. Do not adopt its Yahoo/secondary pricing as formal scorecard evidence. |
| [Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | MIT; active 2026-08-20 | Finance-math invariants, DCF/comps/three-statement tests, event studies, purged CV, input hashes, audit ledgers | Audit narrow formulas and test vectors; do not import the broad trading platform. Missing inputs must fail closed. |

### Methodology or later-stage references

| Project | Licence | Use | Why not now |
| --- | --- | --- | --- |
| [eventstudy](https://github.com/sipemu/eventstudy) | AGPL-3.0 | Independent statistical contract for AR/CAR/AAR/CAAR, BHAR, intraday and parametric/non-parametric tests | Young R package with small adoption and licence/runtime mismatch. Use in an isolated validation experiment, not by copying code. |
| [ml4t/backtest](https://github.com/ml4t/backtest) | MIT | Point-in-time event loop, execution timing, spread/slippage, and parity tests | Promising but young. Test after-hours entry, suspensions, delistings, splits, and costs independently. |
| [Qlib](https://github.com/microsoft/qlib) | MIT | Point-in-time ML research patterns | Far broader than the current event ledger; adopt ideas after a reliable data layer exists. |
| [LEAN](https://github.com/QuantConnect/Lean) | Apache-2.0 | Market calendars, corporate actions, execution/event-loop semantics | Large engine aimed at algorithmic execution. Use as a behavioral oracle, not a repository dependency. |
| [MAPIE](https://github.com/scikit-learn-contrib/MAPIE) | BSD-3-Clause | Conformal intervals and risk control | There are zero completed prospective forecasts; cross-sector exchangeability would also be weak. |
| [skfolio](https://github.com/skfolio/skfolio) | BSD-3-Clause | Portfolio optimization, purged CV, stress tests, CVaR, risk budgets | Wait for a sufficiently large out-of-sample signal record; noisy expected returns make optimization fragile. |
| [Riskfolio-Lib](https://github.com/dcajasn/Riskfolio-Lib) | BSD-3-Clause | Tail/drawdown risk and robust-allocation sensitivities | Too many researcher degrees of freedom until permitted models are pre-registered. |
| [FinRobot](https://github.com/AI4Finance-Foundation/FinRobot) | Apache-2.0 | Deterministic financial operators and multi-agent architecture patterns | Too broad and provider-heavy to adopt. The valuable rule is deterministic computation plus agent narration. |

### Agent-skill catalogs reviewed

| Catalog | Licence | What it contributed | Decision |
| --- | --- | --- | --- |
| [Anthropic financial-services](https://github.com/anthropics/financial-services) | Apache-2.0 | Equity-research, earnings, model, comps, thesis-tracking, and review workflow patterns | Use as a coverage checklist. This repository needs tighter source rights, point-in-time records, and prospective scoring than the generic workflows provide. |
| [OctagonAI skills](https://github.com/OctagonAI/skills) | MIT | Fine-grained SEC, statements, earnings, market, and prediction-market skill taxonomy | Avoid installing dozens of provider-coupled skills. Consolidate into shared core workflows and repo-native evidence contracts. |
| [finance-skills](https://github.com/himself65/finance-skills) | MIT | Valuation, earnings-preview, estimates, liquidity, data-provider, and market-analysis patterns | Reuse conceptual coverage only. Several paths auto-install packages or depend on unofficial/third-party data that cannot be formal evidence here. |
| [agent-packs CLI](https://github.com/agent-packs/cli) | Apache-2.0 | `cap skills` discovery/install packaging for multiple agents | Useful distribution mechanism, but not a quality or rights gate. Keep repo-local skills source-reviewed and versioned rather than bulk-installing catalogs. |

### Avoid as production dependencies

| Project | Reason |
| --- | --- |
| [Agentic Investing Framework](https://github.com/Abelian-Analysis/Agentic-Investing-Framework) | No repository licence was verified, adoption is minimal, and selected tools embed arbitrary assumptions or current-row trial data. Treat the feature list as inspiration only. |
| [FinanceBench](https://github.com/patronus-ai/financebench) | No repository licence was found; the corpus includes filing PDFs, activity is stale, and a public verification project reports at least one material unit mismatch. Build an owned evaluation set from canonical filings. |
| [sec-parser](https://github.com/alphanome-ai/sec-parser) | MIT but explicitly no longer maintained; EdgarTools covers much of the useful surface. |
| [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) | Its own README calls it a proof of concept. Persona agents risk multiplying incompatible facts and metrics. |
| [HINT/TOP clinical trial outcome prediction](https://github.com/futianfan/clinical-trial-outcome-prediction) | No standard licence file was found; the README imposes a non-commercial-use agreement incompatible with unrestricted reuse, and retrospective labels require careful leakage review. |
| [CTO](https://github.com/sunlabuiuc/CTO) | Deliberately uses post-completion publications, news, and stock movements for outcome labels; unsuitable as prospective readout features. |
| [pharma-pipeline-intelligence](https://github.com/leelesemann-sys/pharma-pipeline-intelligence) | “Point-in-time safe” claims are contradicted by latest ClinicalTrials.gov status/completion/enrollment fields and insufficient historical feature reconstruction. Use as a leakage red-team example. |

## Official sector sources to prioritize

| Sector | Primary public surfaces | Research use and limitation |
| --- | --- | --- |
| Cross-company identity and filings | [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces), [GLEIF LEI data](https://www.gleif.org/en/lei-data/access-and-use-lei-data/) | SEC supplies accepted timestamps and filings for US issuers; GLEIF entity and ownership data is CC0. Neither replaces a versioned listing/security map. |
| Biopharma | [ClinicalTrials.gov API v2](https://clinicaltrials.gov/data-api/api), [AACT snapshots](https://aact.ctti-clinicaltrials.org/downloads/snapshots?type=flatfiles), [openFDA](https://open.fda.gov/apis/drug/), [Drugs@FDA](https://www.fda.gov/drugs/drug-approvals-and-databases/about-drugsfda), [Open Targets](https://platform-docs.opentargets.org/licence) | Current registry rows are not historical evidence. Use snapshots/version histories, right-censor unresolved outcomes, and separate trial, approval, commercial, and security targets. |
| Energy and utilities | [PUDL](https://github.com/catalyst-cooperative/pudl), EIA, FERC, EPA, PHMSA, NREL | Strong open structured base. Publication lags, revisions, plant/entity crosswalks, units, and asset exposure still require explicit handling. |
| Banks | [FDIC BankFind API](https://api.fdic.gov/banks/docs), [FFIEC CDR](https://www.cdr.ffiec.gov/Public/HelpFiles/WelcomeAdditionalInfo.htm), [ALFRED](https://fred.stlouisfed.org/docs/api/fred/alfred.html) | Use availability/vintage dates for regulatory and macro data. Map bank holding company, bank subsidiary, RSSD, FDIC certificate, and listed security separately. |
| Consumer and fashion | [Census economic indicators](https://www.census.gov/data/developers/data-sets/economic-indicators.html), [historic MARTS releases](https://www.census.gov/retail/marts/historic_releases.html), [international trade API](https://www.census.gov/data/developers/data-sets/international-trade.html), [BLS API](https://www.bls.gov/developers/home.htm) | Good category, price, and trade context. Company sell-through, traffic, returns, and brand heat remain licensed-data gaps. |
| AI and semiconductors | [MLCommons Inference](https://github.com/mlcommons/inference), [PatentsView](https://www.uspto.gov/ip-policy/economic-research/patentsview), [deps.dev API](https://docs.deps.dev/api/v3/), Census trade, Federal Register | Verify benchmark configuration, dataset licence, patent-to-entity mapping, and whether adoption signals were public at the cutoff. Export-control events require exact effective dates and product exposure. |

## Explicit unresolved gaps

Open data alone cannot reliably supply point-in-time global prices, analyst consensus and revisions, options-implied moves, borrow, insurance statutory normalization, company-level fashion sell-through, card spend, or web/app traffic. Represent these as unavailable or licensed-local-only sources. Never silently replace them with scraped pages, current Yahoo histories, or LLM estimates.

## Adoption order

1. Publish a complete event evaluation specification, add representative end-to-end fixtures, and keep extending the current schemas, validators, and event scorer from adversarial test cases.
2. Pilot EdgarTools behind the existing SEC policy layer and reuse FinanceToolkit/Vibe-Trading test invariants on repository facts.
3. Add lawful adjusted market prices and exchange calendars before claiming return skill.
4. Add sector adapters only for active research: AACT/FDA/Open Targets, PUDL, FDIC/FFIEC/ALFRED, Census/BLS, and MLCommons/USPTO.
5. Add Promptfoo when there is an end-to-end agent whose evidence and arithmetic can be evaluated.
6. Delay learned prediction and portfolio optimization until prospective sample size supports them.
