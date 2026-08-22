# Report presentation plan

Status: planned

Date: 2026-08-23

## Objective

Keep GitHub as the public, auditable home of the research while giving each
canonical company report a presentation layer that demonstrates investment
judgment, valuation rigor, data visualization, and software-engineering
quality.

The presentation layer must improve comprehension without creating a second
hand-maintained thesis. Markdown, valuation records, source logs, and
deterministic models remain the canonical research artifacts.

## Product principles

1. **One research source.** Generate presentation artifacts from canonical
   Markdown metadata and verified valuation outputs. Never maintain a separate
   "pretty" thesis with independently entered numbers.
2. **Progressive depth.** Let a reader understand the stance and valuation in
   seconds, the thesis in minutes, and the evidence and calculations on demand.
3. **Auditability is visible.** Preserve direct paths to source records,
   calculations, methodology, coverage-cycle history, and the exact Git
   revision.
4. **Static by default.** The narrative and essential charts must work without
   client-side JavaScript. Use interaction only where it improves analytical
   understanding.
5. **Frozen means frozen.** A presented report must retain its declared price,
   dates, information cutoff, status, and coverage-cycle identity. Live market
   data must not silently alter a historical thesis.
6. **Public-data safe.** Generated pages and assets follow the same source,
   rights, privacy, and credential rules as the repository.

## Target architecture

```text
canonical Markdown + verified valuation modules
                       |
                       v
              typed report compiler
                       |
                       v
     static website + print view + social card
                       |
                       v
               GitHub Pages deployment
```

Use a content-oriented static site generator, with Astro as the initial
candidate, inside this repository. A GitHub Actions workflow should validate
the research, build the site, and deploy the resulting static artifact to
GitHub Pages.

The compiler should discover canonical reports through their existing flat
YAML front matter, validate a presentation contract, resolve related valuation
and source records, and create stable URLs such as:

```text
/companies/snap/
/companies/snap/2026-W34-01/
```

The generated report must link back to the corresponding GitHub source and
commit. The repository README should link prominently to the presented report,
while the Markdown version remains readable on GitHub.

## Improvement levels

### Two-times presentation

- Strengthen the opening decision and valuation summary.
- Add deterministic static charts to the Markdown report.
- Add a repository banner and a direct presented-report call to action.
- Improve navigation, section anchors, and print behavior.

This is useful fallback work but does not by itself create a differentiated
reader experience.

### Five-times presentation: first release

- A custom portfolio homepage and company landing page.
- One fully presented coverage-cycle report, starting with Snap.
- Editorial typography, responsive layout, and sticky section navigation.
- Visible draft/published status, cutoff, disclosure, confidence, and review
  date.
- A valuation strip showing reference price, operating anchors, distribution
  percentiles, and central value measures.
- Generated visualizations for the valuation distribution, revenue mix,
  operating forecast, value bridge, and principal risks.
- Direct links to specialist memos, source records, calculations, and Git
  history.
- Print-quality styling and an optional generated PDF.
- An automatically generated social-preview image.

### Ten-times presentation: differentiated analytical product

- An interactive sensitivity explorer with the published case visually locked
  and experimental inputs clearly labeled.
- Catalyst, monitoring, and falsifier timelines.
- Fact, estimate, author-calculation, and judgment labels for material claims.
- Coverage-cycle comparisons showing what changed and why.
- A prospective track-record dashboard with declared benchmark rules.
- Search, company filters, and update feeds as the archive expands.

## Snap report experience

The first viewport should answer four questions quickly:

1. What security and coverage cycle is this?
2. What is the current research stance?
3. What valuation range and downside distribution does the model produce?
4. What evidence would confirm or invalidate the thesis?

The page should then provide:

- a report header with status, cutoff, reference price, disclosure, confidence,
  and next review;
- an executive decision and strongest counterargument;
- the small set of conditions the investment depends on;
- the valuation distribution and enterprise-to-equity bridge;
- operating drivers, catalysts, risks, and falsifiers;
- the full existing narrative with persistent navigation; and
- source, model, methodology, print, and Git-history actions.

Visualizations must use the same values consumed by the deterministic
verification scripts. Where a chart is interactive, include a static or tabular
fallback and distinguish the adopted report from user-adjusted sensitivities.

## Delivery phases

### Phase 1: presentation contract

- Define the required report metadata and stable URL rules.
- Specify how verified valuation modules expose report-facing structured data.
- Define draft, published, superseded, and withdrawn presentation behavior.
- Decide how the generated page records the source commit.
- Add tests that prevent chart values from diverging from verified values.

### Phase 2: visual selection

- Produce three materially different concepts using the real Snap content.
- Compare an editorial memo, an analytical research terminal, and a restrained
  hybrid.
- Select one direction before initializing the production interface.

### Phase 3: five-times site

- Implement the site shell, homepage, company page, and Snap report.
- Implement reusable report components and deterministic charts.
- Add GitHub source links, print output, responsive behavior, and social cards.
- Add the README entry point and GitHub Pages deployment workflow.

### Phase 4: analytical interaction

- Add the sensitivity explorer and catalyst/falsifier tracking.
- Add evidence-type presentation and coverage-cycle comparisons.
- Add the portfolio and prospective scorecard views when the underlying record
  count justifies them.

### Phase 5: release hardening

- Run research validation before every site build.
- Validate presentation schemas, internal links, and generated-data freshness.
- Test mobile and desktop layouts, keyboard navigation, contrast, and semantic
  structure.
- Enforce performance budgets and useful no-JavaScript behavior.
- Check the staged site and assets against the repository public-data and
  source-rights policy before publication.

### Phase 6: extract the proven workflow into a skill

After the first Snap presentation passes the release criteria, create a
repository-local `company-report-presentation` skill under `.agents/skills/`.
Do not scaffold it earlier: its instructions should encode a workflow proven by
the working site rather than turn design assumptions into permanent rules.

The skill should apply when an agent creates, upgrades, or republishes the main
presentation for a canonical company report. It should preserve these
non-negotiable invariants:

- canonical research records and verified models remain the only source of
  thesis and valuation data;
- a generated presentation never becomes a parallel editable thesis;
- published coverage-cycle dates, reference prices, cutoffs, disclosures, and
  commit provenance remain frozen;
- charts and summary values are generated from or checked against the same
  deterministic outputs used by repository validation;
- interactive sensitivities are visibly separate from the adopted report;
- every material visual retains a source, calculation path, and accessible
  static or tabular fallback; and
- repository validation, presentation validation, visual checks, and the
  public-data safety gate run before publication.

Keep the skill entrypoint concise. Put the implemented presentation contract,
component/data mappings, and release checklist in focused references only when
they are needed. Add a deterministic helper script only if the implementation
reveals a repeated validation or generation step that should not be rewritten
by each agent.

Before treating the skill as the default for future reports:

1. validate its metadata and resources with the repository skill validator;
2. test it against a second company report or an isolated representative
   fixture, not only the Snap report from which it was derived;
3. verify that the result reuses the presentation system without copying Snap's
   company-specific content or assumptions; and
4. link the skill from the company-investment research workflow so completing a
   canonical report naturally routes into presentation and release checks.

## Acceptance criteria for the first release

- A reader can reach the current presented company report from the repository
  README in one click.
- The stance, reference price, valuation distribution, cutoff, and review date
  are understandable within the opening screen.
- Every displayed material number is generated from or checked against a
  canonical research record or deterministic model.
- Every material visualization exposes its source or calculation within two
  interactions.
- The report is usable on mobile, by keyboard, in print, and without JavaScript
  for its core narrative.
- The site deploys from a clean GitHub Actions run only after repository
  research validation passes.
- Published coverage-cycle URLs and displayed historical inputs remain stable.
- The verified presentation workflow has been captured in and independently
  exercised through the repository-local `company-report-presentation` skill.

## Non-goals

- A separately edited HTML, MDX, or PDF thesis.
- A live-price widget that changes a time-stamped report.
- Decorative financial-dashboard effects without analytical purpose.
- A server, database, authentication system, or paid hosting dependency.
- Charts or generated summaries whose inputs cannot be reproduced.

## Initial implementation sequence

Build the five-times Snap report first, but establish the typed compiler and
data contract needed for the later ten-times features. After the first visual
direction is selected, deliver the smallest complete vertical slice: canonical
Snap inputs, generated data, one report route, essential charts, source links,
validation, and GitHub Pages deployment.
