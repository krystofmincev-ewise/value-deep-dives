# Research and article harness audit — 18 October 2026

The largest opportunity is to improve the connection from a worthwhile question,
through evidence and economic reasoning, to a coherent article. More versions and
more review instructions do not reliably repair a missing premise or a fragmented
argument. Keep the existing repository, strengthen its executable boundaries, and
test editorial changes against complete real articles.

This audit changed the prospective workflow and its checks. It did not update
historical investment conclusions, publish or resend a Substack post, upload
private research, change the selected model, or install an external agent runtime.

## Evidence and limits

Ten relevant research and drafting conversations were reviewed locally alongside
representative complete company reports, explanatory articles and revision chains.
The sample included company valuation, an AI business comparison, technical
explanation and an economic simulation article. It was selected to investigate
known difficulties and accepted strengths, not randomly sampled to estimate a
failure rate. Unfinished research was not graded as a finished deliverable.

Private messages, audience data, local drafts and comparison records remain local.
This report contains original process findings, public examples and verified
implementation changes. Follow-up messages were classified as corrections, new
scope, preferences, enhancements or explicit acceptance; counting every follow-up
as a failed draft would misrepresent the evidence.

The code review covered the company coverage/review contracts, joint-horizon
validation, CLI gate and public Git surface. It did not independently reproduce
every company's valuation or validate every external source. The preceding
[valuation retrospective](2026-W34-VALUATION-HARNESS-RETROSPECTIVE.md) remains
relevant: mechanical agreement cannot establish economic or statistical meaning.

## What the review found

| Finding | Evidence and reader consequence | Implemented response |
| --- | --- | --- |
| Some apparent writing failures were unresolved research or model choices. | An operating narrative can sound plausible while the cash-flow path, multiple or annualized cost remains unexplained. Later investigation can change the conclusion, making surface edits obsolete. | The research plan preserves the requested depth and budget, identifies questions that could change the decision, and links dominant assumptions to evidence, judgment, bounds and sensitivity. Stabilize those dependencies before polishing a conclusion. |
| Strong observations were sometimes buried or repeated. | [Snap's](../companies/snap/thesis/2026-W34-final-report.md) 100 → 90 → 99 price example and [Wix's](../companies/wix/thesis/2026-W35-final-report.md) distinction between generating a page and moving a working business are useful mechanisms. Repeated caveats and front-loaded valuation apparatus can obscure them. | Build the article around the finding and the next question it raises. Assign each section a contribution, explain conventions once, and preserve the counterevidence that affects the verdict. |
| Simplification sometimes removed the explanation rather than simplifying it. | A reader needs to see the difficult transition: business to cash, cash to value, or one technical state to the next. Familiar terminology and shorter paragraphs do not supply it. | Carry a concrete example through the difficult step. Explain what changes, what stays fixed and why the next result follows. Explicitly announce changed assumptions when reusing an example across experiments. |
| Integrated pieces could retain seams from separate workstreams. | Task history, repeated definitions, abrupt additions and tool troubleshooting distract from the reader's question. New evidence in one derivative does not update the others. | One writer owns the argument. Read the whole current piece, diagnose the failure, preserve strong passages, integrate the repair, then read continuously again. Track affected derivatives. |
| Successful passages supplied reusable positive evidence. | A sequential worked example with a visible payoff was accepted even when an earlier abstract explanation required correction. An accepted piece can also receive legitimate new scope. | Retain accepted strengths as well as failures. Store conditional lessons and material corrections, without exporting full conversations or enforcing a universal style score. |
| Review freshness omitted external inputs and evidence. | A review bound canonical Markdown and principal model/verifier files but could miss changed input JSON, evidence and local model dependencies. | New v2 coverage cycles bind a SHA-256 dependency manifest into the independent review. Mutations and owner-only rehashing invalidate the prior binding. Historical v1 reviews remain explicitly limited. |
| A shared statistical check encoded one economic theory. | Later outcomes were required to improve monotonically across earlier valuation bands. That rejects valid mean-reversion or nonmonotonic joint models. | Retain ordered earlier bands, probability bounds and complete diagnostics; leave the direction of later conditional outcomes to the declared model and its verifier. |

The [article guide](ARTICLE_CRAFT.md) and [short evidence brief](../templates/article-evidence-brief.md)
make these changes usable. The brief is a working aid, not a second report; a
narrow edit stays narrow. Readability must preserve decision-relevant depth. A
novel insight must identify the added observation, calculation or interpretation,
its causal mechanism, its consequence and the evidence that could overturn it.
Novel language and source volume do not establish novelty.

## Two complete editorial trials

A 2,073-word historical [economic explainer](../studies/toy-economy/articles/00-gdp-without-wages.md)
was frozen as the baseline. One candidate used the same evidence, arithmetic and
scope, with financing explained before the stronger growth result and a clearer
sequence of reader questions. The public source and current published edition
were left intact.

A separate agent compared the complete texts under neutral A/B labels without
being told which was newer. It preferred the candidate **by a modest margin**,
citing causal order and easier navigation through the owner-income argument.
It found no material numerical drift between the texts. This was one editorial
judgment, not independent source verification or human audience acceptance.

The comparison also found defects shared by both versions: the growth experiment
changed the spending rule without explicitly announcing it, and the transfer
example blurred a financed settled outcome with the initial payment sequence.
Those are material comprehension findings. The local candidate was corrected at
those passages, with its pre-feedback version preserved. The guide now calls out
assumption resets in reused examples.

This trial supports a narrow lesson about explanation and catches a real defect.
It does not show that the full new workflow reduces revisions, creates original
investment insight or increases engagement. A before/after preference on the
same article cannot establish those outcomes.

A second trial used the complete 7,972-word historical Wix report. Diagnosis
favored a bounded integration edit: preserve its strong business analysis while
moving the SOTP/DCF disagreement before the headline table, the formal stance
beside the action zones, and share-count mechanics into the valuation section.
The initial candidate was 7,988 words, with frontmatter, headings, citation targets
and numerical coverage preserved. A separately reviewed anonymized comparison
preferred the candidate for its clearer entrance, without calling it a new
analytical insight or a transformation of the largely unchanged body.

That review found another shared reasoning gap: attributing most upside to
Base44/platform optionality without a decomposition separating it from other
valuation assumptions. The local candidate now narrows that causal claim; no
new model result was invented. The public report remains unchanged. Both trials
therefore produced useful comprehension or inference corrections beyond a prose
preference. Neither establishes human acceptance or a lower future revision rate.

## External tools: borrow the method before adding a runtime

The [source review and options comparison](2026-10-18-HARNESS-OPTIONS.md) inspected
pinned revisions of Google's [Harness²](https://github.com/google-research/harness2)
and Promptfoo, their official documentation, licenses and runtime requirements.
No dependency or provider was added.

Harness² offers useful ideas: compare behavior on the same task, preserve evidence
for a conditional lesson, and distinguish a proposed change from measured
improvement. Its reviewed selector excludes the original output, and its runtime
repeats substantial work with execution defaults unsuited to direct use against
this personal research environment. Our adapted comparison keeps the baseline,
permits ties or rejection of both outputs, and freezes evidence when testing prose.

Promptfoo may become useful when repeating a stable evaluation matrix is itself a
bottleneck. It does not supply the missing research, trustworthy judgment or
reader acceptance. Neither package's benchmark results establish performance on
these articles, so installation would currently add more integration work than
useful evidence.

## Public repository cleanup

Keep the existing repository. Its dated research, source history and working
companion site are useful; untidy navigation is repairable. A new repository would
not erase the old public history. The root, company and studies indexes now give
readers direct entry points and distinguish source cutoffs and review states.

The new public-data scanner checks the exact Git index or committed snapshot,
rejects private/authentication paths before reading blobs, and reports finding
locations without printing matched values. It flags high-confidence credential
patterns, authenticated URLs and common personal identifiers. Browser-generated
artifact directories are ignored and rejected even when force-added. This does
not replace full diff review, source-rights review or visual inspection.

A read-only, SHA-pinned GitHub Actions workflow runs the snapshot check and root
research-harness validation on pull requests and main. No research credentials,
publication action or companion deployment is part of this workflow. See
[public repository maintenance](PUBLIC_REPOSITORY.md) for its limits.

The public branch-history scan covered **39 unique reachable commits** across
main and four distinct non-ancestor tips. It found no suspected real credential
or session artifact in inspected text. Authenticated-URL matches were traced to
synthetic tests using reserved example hosts. Current fixtures now construct
those values at runtime, preserving the actual regression cases without a blanket
scanner exemption. All 36 existing PNGs were inspected visually and for embedded metadata; they
were generated research charts and diagrams, with no observed account UI or
private material. Three oversized JSON artifacts were parsed and their strings
checked; the large HTML viewer was reconciled to its embedded simulation cases.
These 40 artifacts match the existing public blobs and support published viewers
and reproducibility. This targeted inspection is not a guarantee against every
possible hidden datum or a new rights certification.

Removed three obsolete remote branches: `research-tooling`, `snap`, and
`ewisenl/valuation-harness-hardening`. Their exact tips were verified as ancestors
of main with no open pull request, active worktree or Pages-source dependency;
expected-tip leases protected against concurrent changes. Divergent branches,
attached worktrees and the Pages branch are preserved. No repository,
published URL or Git history is deleted or rewritten.

A separate commit-metadata check found historical non-noreply email identities.
Their values are not reproduced here. New work uses GitHub
noreply attribution, and the scanner reports metadata requiring review without
printing email values. Existing public metadata remains: changing it would require
coordinated history remediation across active branches, clones and published
references. No claim of full historical anonymity is made.

## Verification and remaining work

The completed root gate passes **128 tests**, with no validation errors. It checks
12 skills, 18 schemas and two public company coverage cycles. The staged-snapshot
scan checked 427 text files with no blocking findings; its 40 manual-review
artifacts received the separate inspection described above. All 141 relative
Markdown links in the changed documentation resolved. The optional generic skill
validator was unavailable because its Python YAML dependency was absent; the
repository's own skill-contract checks passed without installing anything.

The regression cases exercise changed input/evidence bytes, stale dependency
manifests, owner-only hash updates, missing roles, path escape, aliases, private
paths and valid mean-reverting joint distributions. Public-scanner cases cover
staged-versus-working-tree content, redacted findings, commit history and forbidden
paths rejected before blob access. Validation results and final cleanup details
are recorded with the implementation change.

A manifest proves the freshness of the **declared** files, not that every dependency
was declared or every input is justified. Existing v1 review records are not
retroactively certified. Scripts cannot prove novelty, correct economics,
complete research, readable prose, redistribution rights or absence of all private
data. These remain substantive review responsibilities.

Evaluate the next four eligible substantial articles prospectively: preserve the
first delivered draft, classify material human corrections and repeat corrections,
record accepted strengths and explicit acceptance, and note scope/complexity.
Exclude title-only and narrow factual edits. Keep this small ledger locally using
the brief; do not count autosaves or new scope as failures. Treat the four cases
as diagnostic evidence, not a controlled estimate of reader engagement. Change
the harness again only where those observations identify a recurring failure or
an independently demonstrated defect.
