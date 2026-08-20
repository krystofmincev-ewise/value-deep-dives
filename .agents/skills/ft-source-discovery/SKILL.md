---
name: ft-source-discovery
description: "Find targeted Financial Times coverage and record search-result metadata through the user's signed-in Chrome session. Use when company research needs FT headlines, authors, dates, snippets, or canonical FT URLs for source discovery. Keep FT discovery metadata-only; hand a user-selected canonical URL to $archive-ph-research when a permitted existing archive snapshot is needed."
---

# FT Source Discovery

Find relevant FT articles without treating article text as agent-readable evidence.

## Inputs

Require a focused query. Accept an optional company, date range, result limit, source-log path, and `plan_only` instruction. Default to the ten most relevant results; do not perform broad or recurring collection. When `plan_only` is requested, return the generated search URL, metadata schema, and verification plan without opening Chrome.

## Open the search

1. Read `methodology/RESEARCH_TOOLING.md` and `chrome:control-chrome` before browser work.
2. Confirm the applicable subscription or licence permits agent processing of search-result metadata. If that basis is not established, stop at the generated URL and hand metadata entry to the user.
3. Generate the ordinary search URL with:

   ```bash
   npm run research:browser -- open ft --query "{query}" --dry-run --json
   ```

4. Use the user's authorized Chrome session. Prefer a freshly claimed FT search tab; verify that it is the expected signed-in session without inspecting account identity, cookies, storage, or credentials.
5. Navigate to the generated FT search URL. If sign-in is required, ask the user to sign in and stop.

## Collect metadata

Read only the search-results interface. For each relevant result, collect what the results page visibly exposes:

- original headline;
- canonical `ft.com/content/...` URL from the result link;
- author, section, and publication date when shown;
- displayed teaser or snippet, kept within the repository's source-use limits;
- access date and the search query that surfaced it;
- likely research question or claim to investigate.

Extract a result link's visible destination without navigating into the article. Do not let an automatic extension redirect mix article content into the search-metadata pass. Never capture authenticated query parameters, account details, article bodies, or bulk result pages.

## Optional archive handoff

After the user or research task selects one canonical URL, invoke `$archive-ph-research` for a targeted existing snapshot when source processing is permitted. Keep discovery and archive retrieval as separate provenance steps; do not bulk-open all search results.

## Assess and log

Rank results by relevance, recency, and whether they point toward independently verifiable evidence. Mark each item `unverified discovery` until its underlying claim is checked against a filing, regulator, company release, dataset, or another source that agents may process.

Add selected items to the relevant source log using its existing columns. Record:

- `Evidence type`: `press` or `secondary analysis`;
- `Access`: `signed-in`;
- `Rights`: `link-only` unless an applicable licence says otherwise;
- `Retrieval`: `Chrome / FT search metadata`;
- `Verification`: the corroborating source or `pending`;
- `Capture`: `none` unless a permitted local metadata capture is necessary.

Do not store article text or screenshots in the tracked tree.

## Return

Return the query, access time, result count, ranked metadata table, and the next primary-source checks. State explicitly that search snippets and FT URLs are discovery aids, not verified evidence. When relevant, identify the selected canonical URL that is ready for `$archive-ph-research`.
