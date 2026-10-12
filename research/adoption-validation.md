# Gradual AI adoption: delivery verification

11 October 2026. Local research draft, not a calibrated forecast or public release.
The [short illustrated paper](../site/04-ai-arrives-one-shop-at-a-time.html),
[optional step edition](../site/04-ai-arrives-one-shop-at-a-time-animated.html),
and [saved-round explorer](../site/adoption.html) are built from the checked records.
Earlier papers and banking results remain available.

## What was executed

| Experiment | Recorded scope |
| --- | ---: |
| Named gradual-adoption paths | 37 |
| Coarse contract/capacity/fee/price sensitivities | 192 |
| Paired seeded timing runs | 6,000: 1,000 under each of six policies |
| Fine automation grid | 1,010: 101 stages under each of ten profiles |
| Separate funded entry/acquisition paths | 14 |
| Entry/acquisition sensitivities | 18 |
| Original-engine gradual displacement paths | 8 |
| Original banking-engine gradual paths | 6 |

These are controlled invented scenarios. Monte Carlo frequencies are not empirical
probabilities. Failed runs retain their last payment record and stop reason;
no subsequent output is imputed. Paired full-horizon comparisons retain only
seeds completing both policies and disclose exclusions separately.

## Software verification

- **187 Python tests passed**, including original-model regressions, individual
  household accounting, capacity bounds, private-choice forecasts, rotating shifts,
  near-full-automation boundaries, seeded pairing, flat maxima, acquisition versus
  investment, failed financing and output-to-figure provenance.
- **Strict mypy passed across 22 source modules.** Ruff lint and formatting checks
  passed across 59 Python source, test and script files.
- **Seven animation tests passed**, covering step state, timing, pause/reset,
  declared payment routes, coordinated playback and offscreen stopping.
- The explorer JavaScript syntax check passed. It renders saved Python records;
  it does not contain a second economic engine.
- Exported explorer cases match the results JSON exactly. Figure manifests retain
  their source file hashes and displayed values. Source hashes in the main result
  file match the corresponding current modules and generator.

Reproduce from the study directory with the existing development environment:

```sh
PYTHONPATH=src .venv/bin/python -m unittest discover -s tests -q
.venv/bin/mypy --strict src
.venv/bin/ruff check src tests scripts
.venv/bin/ruff format --check src tests scripts
node --test tests/teaching.test.cjs
node --check site/adoption.js
```

The [README](../README.md#run-the-gradual-ai-adoption-experiment) lists the complete
export/build commands. Core computation and Python tests use the standard library;
optional locked development tools build the images and HTML.

## Independent checks

The [Sol review](adoption-sol-review.md) records reproduced implementation defects,
corrections, independent payment/physical stress checks, analytical comparisons,
private-choice checks and a complete numerical replay of the 37 named paths,
192 grid points and 6,000 timing runs. Later schema-only changes preserve those
numerical outcomes; final hashes identify the current snapshot.

The [Astra review](adoption-astra-review.md) records independent core stress and
selected-seed replay, recomputed distribution/paired statistics, 51 structure runs
covering 1,525 periods, and 65 fine-grid maximum/neighbor path replays. It also
checks the physical upper bound and the longer run that exposes an apparently
better 80-round endpoint as temporary buffer depletion. These reviews validate
specified accounting and behavior, not empirical accuracy or optimal decisions.

## Reading and browser checks

The new paper has approximately 2,200 words versus approximately 4,700 in its
predecessor, plus eleven matching SVG/PNG figures. Static diagrams were checked
before building the matching step edition. Figures have descriptive SVG titles,
text alternatives and captions. The step player starts still, offers manual
navigation and honors reduced-motion settings; payment dots indicate direction,
not extra money or proportional flow amounts.

The paper and explorer were inspected at desktop and 390-pixel narrow widths.
Checks covered numerical endpoint cards, private forecast disclosures, the recorded
payroll-failure boundary, individual household consumption, rotating-shift playback
and pause, diagram steps, and horizontal layout. The browser reported no JavaScript
errors in the inspected explorer session. Household tables scroll within their
container on narrow screens. Local pages require no account, network data fetch or
server after download; the temporary local server was used only for preview.

## Interpretation boundaries

- The four-firm town is separate from the earlier ten-firm input-output economy.
  Prices and purchasing rules are declared behavior, not an estimated or fully
  optimized competition equilibrium.
- Firms choose between their current stage and one next step, looking at their
  own operating surplus. This is not unrestricted shareholder-value optimization.
- Owners' final receipts are pooled; shop decisions remain decentralized.
  AI/equipment infrastructure is inherited and its own operating costs simplified.
- Dividend rights are an assumed gift. There is no automatic policy or ownership
  change predicted by the model. Spending depends on lagged income; households
  do not deliberately spend down small remaining wealth balances.
- The entry/acquisition module fixes household budgets and incumbent prices to
  isolate funded transaction mechanics. It is not integrated strategic entry into
  the main income-feedback engine. Provider monopoly pricing is not optimized.
- The bank remains a separate experiment. There is no combined bank/relative-price
  engine, endogenous new occupations, foreign trade, government or utility model.
- Physical capacity, completed-grid maxima and sustainable financial operation
  are different quantities. A no-buffer-draw tail is a diagnostic, not a proof of
  indefinite survival. No universal optimal automation share is established.

Primary-source conceptual grounding and access/rights details are in the
[source log](adoption-sources.md). All figures, code and numeric records are original
synthetic work. No account identity, watch-history export, source transcript,
paid-source copy, browser profile or credential is included.
