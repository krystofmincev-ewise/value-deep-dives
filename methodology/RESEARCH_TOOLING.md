# Research tools and authenticated sources

This project uses a layered toolkit. Structured, stable sources should be automated through official interfaces; subscription and UI-only research should use the signed-in Chrome session the user has explicitly made available; public pages can use the in-app Browser; Computer Use handles the remaining visible Mac UI.

The goal is complete company research, not allegiance to one interface.

## Routing model

| Need | First choice | Fallback | Why |
| --- | --- | --- | --- |
| Filings, filing indexes, XBRL facts | SEC CLI / official public endpoints | EDGAR in Chrome or in-app Browser | Reproducible and source-native |
| Gemini Deep Research | Repo-local `$gemini-deep-research` skill using authenticated Chrome | Computer Use | Replays one plan → review → start → collect workflow through the user's subscription UI |
| Hiring, departures, workforce mix | Revelio structured export/API when already entitled; otherwise authenticated Chrome dashboard | Computer Use | Preserve the useful subscribed product without inventing a scraper |
| Founder interviews and transcripts | Authenticated YouTube in Chrome | Computer Use for playback/transcript controls | Uses the user's Premium session and visible transcripts |
| Quick quote and company cross-check | Google Finance in Chrome | Public market source in the in-app Browser | Interactive secondary source |
| FT | Direct authenticated Chrome for navigation and source discovery | Public corroborating sources or user notes | Standard subscriber terms restrict AI processing of article text |
| Other paid research | Direct authenticated publisher page in Chrome where agent processing is permitted | Public corroborating sources | Uses the user's personal subscription without copying the publication |
| SemiAnalysis | Authenticated Chrome for articles; documented API for public InferenceX data | In-app Browser for public pages | Article research and structured benchmark data are different jobs |
| Company IR pages and public web | In-app Browser or Chrome | Computer Use | Public, source-native research |

Do not build a brittle pseudo-API around a changing website just to call it a CLI. The repository CLI opens repeatable research workspaces and handles genuinely structured retrieval; the agent's Chrome integration performs the authenticated UI work.

## Repository commands

```bash
# See local capabilities without reading credentials or account data
npm run research:check

# Initialize private machine-local research directories with owner-only permissions
npm run research:init

# List the browser research routes
npm run research:browser -- list

# Preview the Gemini handoff; use the skill for account-safe launch
npm run research:browser -- guide gemini

# Ask macOS to open one non-Gemini source in Chrome
npm run research:browser -- open youtube --query "Evan Spiegel 20VC"
npm run research:browser -- open revelio --query "Snap Inc"
npm run research:browser -- open ft --query "Snap advertising"

# Preview a company research workspace across the useful services
npm run research:browser -- workspace --company "Snap Inc" --ticker SNAP

# Open only the sources needed for the current question
npm run research:browser -- workspace --company "Snap Inc" --ticker SNAP --sources youtube,revelio,sec --open

# Optional structured SEC retrieval
npm run research:sec -- filings SNAP --forms 10-K,10-Q,8-K --limit 20
npm run research:sec -- facts SNAP --concept RevenueFromContractWithCustomerExcludingAssessedTax --unit USD --limit 20
```

From a Codex task, call the authenticated Gemini workflow directly:

```text
Use $gemini-deep-research to run one first-pass report on Snap's advertising recovery, including the strongest falsifiers and primary-source citations.
```

The browser CLI contains no passwords, cookies, or session tokens. A workspace is preview-only unless `--open` is passed, and `--sources` limits it to the providers needed for the current question. When URLs are opened, macOS may select Chrome's default or last-active profile, so the agent must verify the required session; if the profile is ambiguous, navigate an already claimed, authorized tab through the Chrome integration instead.

## Agent UI skills

When the corresponding capability is available, load its instructions before first use:

- **Authenticated Chrome:** `chrome:control-chrome`. Use it for the user's logged-in Gemini, YouTube, Revelio, FT, SemiAnalysis, and Google services. Claim only relevant tabs, use visible page controls, and release the session when done.
- **Public in-app Browser:** `browser:control-in-app-browser`. Use it for public discovery, issuer pages, and corroboration. It does not share Chrome's login state.
- **Mac application UI:** `computer-use:computer-use`. Use it only when the work cannot be completed through the browser integrations. Reuse one session and capture a fresh screenshot before interaction.

Normal research actions are authorized: searches, prompts, Deep Research runs, report views, video playback, transcript controls, filters, pagination, and downloads the user asks for. Posting, messaging, purchasing, trading, changing account settings, or accepting new terms remains outside normal research scope.

Repository-local authenticated workflows are `$gemini-deep-research`, `$revelio-workforce-research`, `$youtube-interview-research`, and `$ft-source-discovery`. Invoke the narrow skill instead of improvising a generic browser macro.

## Provider playbooks

### SEC EDGAR and company filings

Use EDGAR as the canonical source for US filings. The repository CLI uses the SEC's keyless submissions and Company Facts interfaces, caches responses, and outputs source links.

- Set `SEC_USER_AGENT` to a truthful project name and monitored contact before automated retrieval.
- Keep aggregate traffic below the SEC's [fair-access ceiling](https://www.sec.gov/about/developer-resources). The CLI is sequential, rate-limited, retries temporary failures, and caches under `.local/cache/sec/`.
- Verify material XBRL values against the linked filing because issuer-specific concepts and filing contexts can differ.
- Use the EDGAR website through Chrome or the in-app Browser when the filing itself, exhibits, or visual context matter more than structured output.

Official reference: [EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces).

### Gemini Deep Research

Invoke `$gemini-deep-research` with one company-specific brief. The repo-local skill uses the signed-in Gemini app through Chrome, selects **Deep Research**, submits the brief once, reviews the generated plan, makes at most one material correction, starts the research, waits for completion, and collects the report and its cited links under ignored `.local/` storage.

The skill deliberately runs one prompt per invocation. It does not perform bulk research, upload files without explicit approval, switch Google accounts silently, or use screen coordinates when semantic Chrome controls are available. Raw Gemini reports remain local-only; independently verified findings can later be promoted into the company research.

Gemini is a second analyst, not primary evidence. Follow its citations and independently verify material claims. Upload a repository file or a licensed source only when the user's request requires that exact transfer.

The consumer UI is the preferred route because it uses the user's existing subscription. Google's programmatic [Deep Research Agent](https://ai.google.dev/gemini-api/docs/deep-research) is an optional separately billed route, not a prerequisite. Google's June 2026 [Gemini CLI transition](https://github.com/google-gemini/gemini-cli/discussions/28017) means the old consumer-subscription CLI is not a dependable substitute for this UI workflow.

### Revelio Labs

For targeted company research, use the visible signed-in dashboard through Chrome to inspect hiring, departures, tenure, functions, geography, skills, and comparable-company movement. Run focused queries and record aggregate findings, dates, applied filters, and screenshots or exports only under `.local/`.

If the account already includes a documented export, API, SDK, MCP, or flat-file delivery, prefer it for repeatable aggregate analysis. Do not script username/password login, extract browser state, or reverse-engineer hidden endpoints. Avoid bulk person-level collection unless a specific research question requires it.

Official reference: [Revelio API documentation](https://dashboard.reveliolabs.com/docs/).

### YouTube Premium and interview transcripts

Use the signed-in YouTube site through Chrome for small-volume, company-specific research:

1. search for the executive, company, and relevant channels such as 20VC;
2. open the interview and inspect channel, publication date, duration, and description;
3. use **Show transcript** when available;
4. search or scroll the transcript while checking important passages against playback;
5. cite the video plus timestamps and classify the speaker's incentives.

Premium supplies the user's viewing experience; it is not needed as an API credential. The [YouTube Data API](https://developers.google.com/youtube/v3/docs) is optional for repeatable public metadata/search, while visible transcripts and playback remain a Chrome workflow. Do not bulk-download videos or extract cookies.

### Google Finance

Use Google Finance through Chrome for quick company pages, comparisons, news discovery, and price cross-checks. For a target price or prospective scorecard, record an exact as-of time and corroborate the figure with a reproducible market-data source; Google Finance values can be delayed.

### Financial Times

Use the direct signed-in FT site through Chrome for navigation and source discovery. Record the headline, author, publication/access dates, canonical FT URL, and corroborating primary source. FT's standard policy restricts AI use of subscriber content, so an agent must not ingest or summarize article text unless the applicable subscription or licence grants that right. The user can provide their own notes, and the agent can build the thesis from those notes plus public primary evidence.

The toolkit does not automate archive mirrors or access-control circumvention. If a browser extension redirects a direct FT page elsewhere, the user controls that extension; agents should use direct publisher access or public corroboration.

Reference: [FT copyright policy](https://help.ft.com/legal-privacy/copyright-policy/).

### SemiAnalysis

Use the signed-in site through Chrome for targeted article research and cite the canonical article. For structured public benchmark data, the documented [InferenceX public API](https://inferencex.semianalysis.com/api) is an appropriate reproducible route. The prohibition on systematic site collection does not turn the documented public API into scraping; do not scrape article pages or mirror paid prose.

Reference: [SemiAnalysis terms](https://semianalysis.com/terms-and-conditions/).

### Company investor relations and public web

Use issuer IR pages for earnings releases, presentations, event notices, and webcasts. Prefer the SEC copy when an item was filed as an exhibit. Use the in-app Browser for public pages and Chrome when an existing site session is helpful. Store source metadata and canonical links when redistribution rights are unclear.

## Source capture and provenance

Every material source entry records:

- canonical URL, publisher, title, publication date, and access date;
- evidence type, access state, and rights class;
- retrieval surface: web search, in-app Browser, Chrome, Computer Use, CLI, or API;
- claim or section supported and verification status;
- whether the capture is absent, local-only, or a permitted committed derivative.

```text
authorized source or structured response
                  ↓
       focused extraction or note
                  ↓
     verify claim and provenance
                  ↓
         update source log
                  ↓
      commit citation + analysis
```

## Local state and credentials

`.local/` is ignored and reserved for caches, focused temporary captures, authorized downloads, and logs. Run `npm run research:init` after cloning to create its fixed subdirectories with owner-only permissions. Keep full publication archives out of it; retain only what the current research task needs and delete stale temporary captures. It is not a password store. Browser authentication stays in Chrome; provider-managed CLI authentication stays in its supported store; API secrets, when genuinely needed, belong in an OS credential store or user-controlled environment.

Never put a password, API key, MFA code, cookie, token, browser profile, HAR, authenticated URL, or account identity in a tracked file. Agents may check whether a required environment variable exists but must not print its value.

If a credential appears in chat, a screenshot, a staged diff, or Git history, stop using it, tell the owner to rotate it, remove local/staged copies, scan the repository and history, and perform reviewed history cleanup if it was committed. Removing only the latest copy does not revoke exposure.
