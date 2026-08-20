---
name: gemini-deep-research
description: "Run one first-pass Gemini Deep Research job through the user's signed-in Chrome UI, review its generated plan, start the research, wait for completion, and return the report with unverified source links. Use for requests to use Gemini Deep Research, get a Gemini second opinion, or produce a preliminary external research pass. Do not use for ordinary web search, bulk or multi-company runs, the Gemini API, or unsupervised recurring research."
---

# Gemini Deep Research

Run exactly one Gemini Deep Research workflow per invocation through the user's existing subscription in Chrome. Treat the result as analyst input, never as verified evidence.

## Inputs

Require a research prompt. Accept an optional `plan_only` instruction. Raw reports always stay under the repository's ignored `.local/captures/gemini/` directory; do not accept an arbitrary output path.

- Default to a full run: generate the plan, assess it, and click **Start research**.
- If `plan_only` is requested, stop after presenting the plan and keep the live tab for handoff.
- Never fan out into additional prompts, companies, or follow-up runs without a new invocation.
- Never upload files unless the user explicitly asks to send those exact files to Gemini.

## Use the authenticated Chrome session

1. Read and follow `chrome:control-chrome` before browser work. Use `computer-use:computer-use` only when Chrome's semantic controls cannot complete a visible step.
2. Name the Chrome session for the research topic.
3. List the user's open Chrome tabs and find a Gemini tab the user has made available. Claim the exact tab from that fresh list.
4. Inspect visible state. Do not inspect cookies, storage, browser profiles, or account identifiers.
5. Verify the selected Gemini context exposes **Pro** and **Deep Research**. A generic `https://gemini.google.com/app` may open a different Google account.
6. Prefer a fresh agent tab using the verified Gemini tab's `/u/<number>/` account prefix. If no eligible signed-in tab exists, ask the user to open the intended Gemini account and stop.

Do not submit a prompt until the eligible account and Deep Research control are visible.

## Select Deep Research and submit

Use role/name locators from a fresh DOM snapshot; tolerate minor wording variants such as `&` versus `and`.

1. If **Deselect Deep Research** is visible, the mode is already active.
2. Otherwise click **Upload and tools**, then **More tools**, then the **Deep Research** menu item.
3. Verify **Deselect Deep Research** is visible and the prompt placeholder changed to **What do you want to research?**.
4. Fill the prompt textbox and submit once.
5. Wait for an enabled **Start research** button. Do not resubmit the prompt when plan generation is merely slow.

If Gemini shows login, CAPTCHA, quota, or availability trouble, stop and report the visible blocker. Never switch to another Google account silently.

## Review the plan

Read the complete visible plan before starting. Check whether it:

- directly answers the requested question and identifies the right company or subject;
- uses a current information cutoff when the request is time-sensitive;
- prioritizes filings and other primary sources for material facts;
- covers the business, financial, competitive, valuation, catalyst, risk, and falsifier questions relevant to an investment prompt;
- avoids unrelated geography, product, or background work that would crowd out the core question.

If the plan is adequate, continue. If it has a material omission or mismatch, click **Edit plan**, wait for Gemini to ask for changes, submit one concise correction, and assess the revised plan. Make at most one revision; record any remaining limitation rather than looping.

For a full run, click the enabled **Start research** button without requesting another confirmation. The repository authorizes one requested Deep Research run as a normal research action.

## Wait and collect

1. Keep the task alive while Gemini researches. Use waits of no more than 30 seconds and give the user a brief update at least once per minute.
2. After each wait, inspect fresh visible state. Do not infer completion only from elapsed time.
3. Treat the run as complete only when research-progress controls are gone and the newest Gemini response contains the report and its source links.
4. Read the report and collect its title, visible report text, cited URLs, Gemini conversation URL, prompt, plan summary, and completion time.
5. Do not click unrelated suggested prompts or automatically run follow-up research.

Save the raw result under `.local/captures/gemini/` using a UTC timestamp and short topic slug. Resolve and verify the destination remains beneath that directory before writing. Keep this capture untracked. Include:

```markdown
# Gemini Deep Research capture

- Accessed: {ISO-8601 timestamp}
- Conversation: {URL}
- Status: unverified analyst input

## Prompt

{prompt}

## Plan summary

{plan summary}

## Report

{report}

## Gemini-cited sources

{links; not yet independently verified}
```

Do not commit the raw report. Promote only independently checked facts, citations, and original analysis into the tracked company research.

## Return

Return:

- whether the run completed, stopped at plan, or hit a blocker;
- the plan assessment and any single revision made;
- the local capture path, if created;
- the Gemini conversation URL;
- the key findings and source links, clearly labelled unverified;
- the next primary-source checks Codex should perform.

Keep a completed report tab as a deliverable. Keep a plan-only or blocked tab as a handoff. Finalize all other Chrome tabs.
