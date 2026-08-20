---
name: youtube-interview-research
description: "Find and analyze a small number of company or executive interviews through the user's signed-in YouTube session, using visible transcripts and playback to produce timestamped research notes. Use for founder interviews, 20VC and venture-firm conversations, management statements, product history, strategy, culture, and qualitative diligence. Do not use for bulk video downloading or full-transcript collection."
---

# YouTube Interview Research

Turn targeted interviews into timestamped, source-linked qualitative evidence.

## Inputs

Require a company, executive, or research question. Accept optional channels, date range, maximum videos, source-log path, and `plan_only` instruction. Default to three videos and prefer original full-length interviews over clips or reactions. When `plan_only` is requested, return the search URL, selection rubric, and expected evidence table without opening Chrome.

## Find and select interviews

1. Read `methodology/RESEARCH_TOOLING.md` and `chrome:control-chrome` before browser work.
2. Generate a search URL with:

   ```bash
   npm run research:browser -- open youtube --query "{company executive topic channel}" --dry-run --json
   ```

3. Use the user's authorized Chrome session and verify the expected signed-in YouTube context through visible controls only.
4. Search narrowly. Record title, channel, publication date, duration, video URL, and why each selected interview matters.
5. Prefer channels and formats likely to contain first-hand information, including company channels, investor events, 20VC, Sequoia, Kleiner Perkins, Andreessen Horowitz, and Prof G when relevant.

## Inspect the transcript

For each selected video:

1. Open the video and use **Show transcript** when available.
2. Search or scroll the visible transcript for the research questions.
3. Check material passages against playback so timestamps, speaker identity, and context are correct.
4. Record concise notes and short attributed excerpts only. Never save or commit a full transcript.
5. Separate management claims, interviewer framing, and the researcher's inference. Note the speaker's incentives and the interview date relative to later events.

Use `computer-use:computer-use` only when Chrome's semantic controls cannot operate a visible transcript or playback control. Do not extract cookies, download videos, or automate large collections.

## Build evidence notes

For every material observation record:

- timestamp or timestamp range;
- concise paraphrase and, only when useful, a short quotation;
- whether the claim is historical fact, current metric, prediction, opinion, or promotional framing;
- what would corroborate or falsify it;
- verification status and linked primary source when found.

Treat interviews as qualitative evidence. Verify financial, operating, product, and market claims against filings or other primary sources before using them in a valuation.

## Save and return

Keep any raw working notes under `.local/captures/youtube/`. Promote only concise timestamped analysis and permitted excerpts into the tracked research. Update the source log with `Access: signed-in`, `Rights: link-only` unless the uploader grants broader rights, `Retrieval: Chrome / visible transcript + playback`, and the video URL as the canonical source.

Return selected videos, timestamped findings, contradictions, source-log updates, and the next verification tasks.
