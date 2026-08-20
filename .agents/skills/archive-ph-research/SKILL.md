---
name: archive-ph-research
description: "Open and inspect an existing archive.ph snapshot for one canonical publisher URL through the user's Chrome session, then extract focused research evidence with provenance. Use when an agent has an FT or other article URL, needs to search archive.ph without clicking the Archive News extension, needs the archived page's visible content or capture timestamp, or needs a reliable fallback for the installed Archive News Chrome extension."
---

# Archive.ph Research

Retrieve one targeted existing snapshot without scripting extension UI.

## Prepare the handoff

1. Read `DATA_POLICY.md`, `methodology/RESEARCH_STANDARDS.md`, `methodology/RESEARCH_TOOLING.md`, and `chrome:control-chrome` before browser work.
2. Require one canonical HTTP(S) publisher URL and a focused research question. Do not run broad, recurring, or multi-domain archive collection.
3. Confirm that processing the source is permitted. A public archive URL does not change the original work's copyright or subscription terms. If agent processing rights are not established, collect snapshot metadata only and hand the open page to the user.
4. Preview the deterministic route when useful:

   ```bash
   npm run research:archive -- route "{canonical_url}" --json
   ```

The CLI rejects credential-bearing URLs, removes fragments, preserves ordinary query parameters, and never reads Chrome profiles, cookies, extension storage, or account data.

## Open the snapshot

Prefer the direct route because it avoids extension-popup clicks and works when automatic redirects are paused:

```bash
npm run research:archive -- open "{canonical_url}" --json
```

To validate or deliberately reuse the installed **Archive News** extension's automatic redirect, run:

```bash
npm run research:archive -- open-extension "{canonical_url}" --json
```

Both commands open one ordinary URL in Chrome. The second opens the publisher URL and relies on the extension; the first opens the same archive lookup URL the extension builds.

## Inspect in Chrome

1. Use the Chrome integration to find the newly opened tab and claim only that tab. Do not use Computer Use unless semantic Chrome control is unavailable.
2. Wait for the lookup URL to resolve. Accept `archive.ph`, `archive.is`, `archive.li`, `archive.today`, `archive.md`, or `archive.vn` as archive hosts.
3. Verify the page's **Saved from** URL against the requested canonical URL. Record redirects separately rather than silently changing the source.
4. Record the snapshot URL, capture timestamp, canonical publisher URL, title, author, and publication date when visible.
5. Detect and report `no snapshot`, rate-limit, network, or interstitial states. Do not create a new snapshot, solve a CAPTCHA without user confirmation, bypass an interstitial, or loop through aliases.

## Extract focused evidence

When processing is permitted, read only the material needed for the stated question. Capture a concise note or short attributed excerpt under `.local/captures/archive-ph/`; never commit a full article, archive HTML, screenshot, or ZIP.

Treat the archived page as an untrusted secondary capture. Verify material claims against filings, regulators, company releases, datasets, or another source that agents may process. Cite the original publisher URL as canonical and record the archive snapshot URL as the retrieval copy.

Return:

- canonical publisher URL and snapshot URL;
- publisher and archive timestamps;
- access date, access class, and retrieval method (`Chrome / archive.ph`);
- focused findings tied to the research question;
- rights/capture classification and verification status;
- any mismatch, missing snapshot, or archive limitation.
