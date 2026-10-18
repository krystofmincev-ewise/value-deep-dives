# Maintaining the public research repository

The public repository is the durable record of original research, code, citations
and intentionally released artifacts. Private captures, drafts, chat feedback,
audience data and authentication material stay outside that record under the
[data policy](../DATA_POLICY.md). A filename being ignored does not protect a file
that is already tracked or force-added.

## Before each commit

Use GitHub noreply attribution for new commits; do not expose a personal email through author or committer metadata. Stage only the intended public files. Inspect `git diff --cached --name-status`
and the full staged diff, including new files. Check that images are necessary,
redistributable and free of personal information, account UI and watermarks.
Confirm that links lead to public canonical sources rather than edit pages,
signed downloads or authenticated previews.

Run:

```sh
npm run research:public -- --staged
npm run research:validate
git diff --cached --check
```

The public scanner reads the **Git index**, not the working copy. Editing a
problem out of a file after staging it does not repair the staged version. Stage
the corrected bytes and repeat the check. Forbidden private/authentication paths
are rejected before their content is read. Findings contain paths, rules and line
numbers without reproducing matched values; credential-like filenames are
redacted as well. Committed snapshot/history modes also flag non-noreply email
metadata without printing the addresses. The staged scan cannot certify the
author identity of a future commit.

Blocking findings require repair. `manual_review_required` means some content
needs direct inspection, including binary media and large artifacts; it is not a
clean bill of health. The scanner cannot determine redistribution rights, find
every secret, identify all personal information or establish whether a chart
contains an account identifier. Manual review remains part of the Git gate.

Use `npm run research:public -- --ref HEAD` to inspect a committed snapshot.
The CI workflow runs this snapshot check and the root research-harness tests on
pull requests and main. It uses read-only repository permissions and pinned
actions, does not require research-service credentials, and does not publish
articles or deploy the companion site. These tests do not run every study's
separate model suite or certify economic assumptions and editorial quality.

## Keep a clear public front door

Link each available company and cross-company study from the root and its area
index. Prefer linking to canonical dated records over copying price targets into
several tables. Distinguish draft, reviewed, prospectively registered and published
states. Keep historical source cutoffs visible; “final report” in a filename does
not mean the analysis reflects today's market.

A reader-facing article needs one argument. Its appendix and research dossier
provide depth and reproducibility. Use [article craft](ARTICLE_CRAFT.md) for the
editorial boundary and [Substack publishing](SUBSTACK_PUBLISHING.md) for delivery.
Keep source/manuscript, companion pages and publication records consistent after
an authorized material update.

## Clean up without breaking the record

Before removing a remote branch, verify that its work is merged or otherwise
durably preserved, that no active worktree or open pull request needs it, and
that it is not a GitHub Pages source. Squash-merged commits may not be ancestors
of main; branch names or closed PRs alone are insufficient evidence. Preserve
published URLs and the files required to reproduce or render them.

Large generated artifacts deserve an explicit reason and reproduction path.
Do not delete them merely because they are large if a published interactive
edition loads them. Future studies should separate compact public results from
rebuildable intermediate output before publication; history will retain old
blobs after ordinary deletion.

A new repository is justified by a real rights, privacy, architecture or audience
boundary, not untidy navigation. Moving future work does not erase the old
repository or any forks and caches. History rewriting, deleting repositories,
revoking credentials and changing visibility are separate operations with their
own concrete review and authorization.

If a real credential or session artifact has already been committed, follow the
incident rule in `AGENTS.md`: stop publication, revoke or rotate the credential,
and plan reviewed history remediation. Do not claim a current-tree scan cleaned
the past.

## Scope of the October 2026 cleanup

The cleanup retains the existing repository and the working companion site,
adds discoverable research and editorial navigation, protects browser-generated
local directories, and introduces public-snapshot CI. It does not republish
private research or change historical investment conclusions. The
[audit record](2026-10-18-HARNESS-AUDIT.md) distinguishes executed checks from
remaining manual and prospective evaluation.

GitHub workflow security was checked against the official
[secure-use reference](https://docs.github.com/en/actions/reference/security/secure-use)
on 18 October 2026 (public documentation, link-only, no source copy retained).
The action revisions were resolved through GitHub's public repository API.
