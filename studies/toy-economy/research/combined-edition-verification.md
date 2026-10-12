# Combined edition: editorial and artifact checks

12 October 2026. Scope: the new combined paper, appendix, one new cash-buffer diagram, generated reading editions and entrypoint links. Earlier papers and simulation engines are unchanged.

## What was checked

- Ten numbered conclusions follow the opening customer story through contracts, purchasing power, private decisions, income recipients, investment, adoption timing, credit, ownership, survival and the limits of GDP.
- The combined paper uses 17 complete SVG diagrams, with the same figures in its static and reader-controlled step editions. Sixteen reuse saved figures from the previous papers; the new buffer diagram takes its numerical snapshot from the saved frontier.
- New HTML and Markdown local destinations and HTML anchors were checked for existence. Generated pages have no duplicate IDs. Each diagram has an SVG title and description.
- The animated edition has one initially hidden control group per figure, no initial muted stages, and uses the unchanged player. The static edition does not load the player. All seven existing player tests pass.
- Both new rendering scripts pass Ruff and strict Mypy with imported modules skipped. The optional Markdown dependency lacks installed type stubs; only that external import has an explicit `import-untyped` exemption. No dependencies were installed.
- The saved frontier's model source hashes match the current engine. The combined build manifest records manuscript, renderer and reused-figure hashes.
- The 58% protected-pay, ample-AI path was replayed with 120 requested rounds. It reproduces cash of 3.268883332497019 per consumer shop at round 79 and unpaid wages in round 90. This directly checks the new illustration against execution, rather than relying only on the prose note.
- The new PNG was visually inspected. The reused town map and ownership comparison were also inspected. Other reused diagrams retain the preceding editions' layout and evidence.
- The war analogy was checked against BEA primary guidance. Exceptional destruction is not described as ordinary depreciation, and the paper does not claim war necessarily raises GDP.

## Limits of this check

The in-app browser rejected the local `file://` preview under its URL security policy. No alternate browser route or server workaround was attempted. Consequently this edition has file, link, SVG, source and player checks, but no new rendered-browser or mobile-layout review. The styles and player are reused from the preceding editions.

The original independent computational reviews concern the earlier recorded model snapshots. They are linked as model evidence, not represented as independent reviews of this combined manuscript. The model suite was not rerun wholesale for this editorial change.

The paper remains a local draft. No publication, commit or push was performed. Prior delivery archives remain unchanged.

## Public-release check — 12 October 2026

The user subsequently authorized public repository availability, two independent subagent reviews and Substack publication. Both reviewers checked the revised main paper and appendix; their final hash-bound verdicts are in `combined-economics-review.md` and `combined-readability-review.md`. All four readability findings and three economic clarifications were addressed.

Before public release, 187 Python tests and seven animation-player tests passed. Strict Mypy passed on all 22 engine modules; Ruff passed across source, scripts and tests. The three new rendering/export scripts passed their focused type and lint checks. The Substack export converts relative destinations to the public companion site and places the existing title/subtitle in separate native fields; the reviewed body is otherwise retained.

The initial local-preview limitation above is historical. Public companion and Substack layout, accessibility and final publication verification are recorded separately in the publication record when completed.
