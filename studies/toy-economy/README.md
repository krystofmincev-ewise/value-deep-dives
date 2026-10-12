# Who buys the output?

Reproducible, uncalibrated toy economies for understanding wages, automation,
spending, ownership and GDP. The original ten-firm economy is preserved; a separate
four-firm experiment now follows gradual AI adoption and individual households. Prepared 10 October 2026 as a companion to
[AI needs a customer](https://krystofmincev.substack.com/p/ai-needs-a-customer).

[Public reading editions and simulations](https://krystofmincev-ewise.github.io/value-deep-dives/) · [Repository](https://github.com/krystofmincev-ewise/value-deep-dives/tree/main/studies/toy-economy)

**Start with the combined paper:**

[Who buys what AI makes?](site/05-who-buys-what-ai-makes.html) follows one story
through ten conclusions from both simulation families, with 17 diagrams.
Its [step-by-step edition](site/05-who-buys-what-ai-makes-animated.html) uses the
same pictures with reader-controlled emphasis. The [separate appendix](site/05-appendix.html)
explains the experiments, assumptions, detailed results, limitations and reproduction.
The combined edition was prepared on 12 October 2026; it leaves the simulation engines unchanged.

[AI arrives one shop at a time. Who still buys?](site/04-ai-arrives-one-shop-at-a-time.html)
remains available as the focused gradual-adoption paper, with its
[step-by-step edition](site/04-ai-arrives-one-shop-at-a-time-animated.html).
[Explore the saved rounds](site/adoption.html) to follow each shop and each of the ten workers.

**Earlier papers and companions remain available:**

1. [GDP without wages: consolidated first paper](articles/00-gdp-without-wages.md).
2. [Who buys the output when the paychecks stop? — static illustrated edition](site/03-when-the-economy-breaks.html), with 17 diagrams, slower explanations and an optional banking appendix.
   [Animated edition](site/03-when-the-economy-breaks-animated.html) follows the same story with reader-controlled steps.
   [Markdown manuscript](articles/03-when-the-economy-breaks.md) includes PNG versions for reuse.
3. [Interactive shock experiment](site/shocks.html) — sudden/gradual changes,
   investment feedback, firm liquidity and distinct GDP/consumption maxima.
4. [Banking experiment](site/banking.html) — 17 saved paths following loan creation, repayment, interest and losses.
5. [Original interactive experiment](site/index.html), with the earlier two essays.

The combined paper and reproducible code are available in this public repository.
Earlier manuscripts remain as research drafts. These are conditional possibilities,
not probabilities or forecasts. No model period is a calendar year.

## Findings

- Fixed wage income does not impose a universal ceiling on real GDP. Lower
  prices can buy more production with the same nominal spending.
- Baseline GDP of 100 becomes 94/82/70/40 after 1/3/5/10 layoffs under the chosen
  spending assumptions. These are conditional results, not a universal multiplier.
- Equipment purchases can restore GDP while former workers consume nothing.
- A fully automated, scalable capital technology can grow output and owner
  consumption with zero wages. The example grows 5% per invented period because
  investment exceeds depreciation; willing demand and clearing prices are assumed.
- Financial saving, investment finance and capital replacement are different
  mechanisms. The cash ledger conserves money and exposes their timing.
- Baseline firm sales sum to 169.4, but value added sums to 100. Intermediate
  purchases cannot be counted again as GDP.

- When equipment orders follow sales, the default fully automated economy returns
  only 70% of income as next-period demand: GDP follows 100, 70, 49, … toward zero.
- Different spending/ownership rules sustain GDP of 100 without wages; automation alone
  does not determine the result.
- A temporary investment freeze can cross a payroll boundary. Fixed firm payrolls
  can fail even while aggregate GDP exceeds total wages.
- Under the diminishing-return technology, stationary GDP peaks at 500 with zero
  consumption; stationary consumption peaks at 125 with GDP of 250. These are distinct
  objectives within a declared model, not universal bounds.

## Run without installing anything

Use Python 3.11 or newer. From this directory:

```sh
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m toy_economy.cli --output outputs
```

The model and tests use only Python's standard library. No API, credential,
network access or paid service is needed. The new timing experiments use documented
fixed seeds; the earlier experiments are deterministic. `outputs/results.json`
contains 18 stationary scenarios, 14 cash-transition paths, 4 automated-growth
paths and selected payment ledgers. `outputs/explorer.json` contains 3,168
parameter combinations. CSV files expose the main accounts.

Open `site/03-when-the-economy-breaks.html` for the static illustrated paper, or
`site/03-when-the-economy-breaks-animated.html` for the same paper with controlled
motion. Both work directly from the downloaded folder, without a server. Nothing
animates until Play is chosen. Next/Previous focus one explanation at a time;
Show all restores the complete picture. Reduced-motion preferences suppress
spatial motion, and printing restores every stage.

Open `site/index.html` directly in a normal browser. It loads adjacent CSS and
JavaScript and embedded model results; it does not fetch data or track readers.
Buttons select Python-calculated records rather than maintaining a second
version of the economic equations in JavaScript.

## Run the shock experiment

Scheduled changes preserve inherited balances and capital. The second experiment
adds sales-responsive investment, optional fixed firm payroll shares, abrupt/gradual
comparisons, exact investment-freeze boundaries and counterexamples. The separate
private-choice game includes exit and free entry; it is not the cash ledger. A
separate diminishing-return technology gives analytical stationary maxima.

After installing the optional development tools below:

```sh
PYTHONPATH=src .venv/bin/python scripts/build_shock_report.py
.venv/bin/python scripts/build_report.py
```

`outputs/shocks/` holds full named cash paths, sensitivity summaries, private
incentives, strategic equilibria and physical capital limits. The second build
refreshes all article HTML. For a standard-library-only computation without plots:

```sh
PYTHONPATH=src python3 -c 'from toy_economy.shock_cases import build_shock_results; r=build_shock_results(); print(r["freeze_thresholds"])'
```

Read [the shock specification](research/shock-specification.md),
[run record](research/shock-cash-results.md), [exit-game note](research/strategic-game-note.md)
and [current independent review](research/shock-review.md), and
[delivery verification](research/shock-validation.md). Earlier review files
concern their original baseline snapshots; they do not independently certify later extensions.

## Run the optional banking experiment

One closed bank is modeled separately from the original fixed-cash engine. Both
credit-on and credit-off arms fund the same bank capital from existing firm
buffers. Loans create deposits; repayment destroys principal; interest and
forgiveness have distinct effects. [Model rules and results](research/banking-model.md)
and [independent banking review](research/banking-review.md) state the scope.

```sh
PYTHONPATH=src python3 scripts/run_banking.py
python3 scripts/build_banking_report.py
```

The first command recomputes 17 named paths and 64 sensitivity runs; the second
embeds them in `site/banking.html`. Both use only the standard library. Open that
HTML directly: no server, account or network connection is required. Rebuild the
illustrations and both reading editions with the optional tools below.

Credit prevents missed payroll during the five-round order pause and is fully
repaid after orders return. Household loans smooth spending but reduce later
purchases during repayment. A known permanent absence of income produces a
refusal; a mistaken recovery forecast can exhaust bank capital. No universal
safe debt/GDP ratio or interest-rate threshold is inferred.

Earlier review snapshots remain historical. The banking review and
[banking delivery verification](research/banking-validation.md) cover this
extension; the old twelve-figure reviews do not certify the new appendix.

## Run the gradual AI adoption experiment

The new engine separates task automation, headcount, contracted hours, actual
work, wages, relative prices, AI fees, physical capacity and individual cash.
Two consumer shops make bounded adoption decisions or follow assigned paths.
Ten worker accounts make concentrated layoffs and rotating shifts visible.
All firms' dividends ultimately reach a pooled owner household unless specified
worker dividend rights apply. This is a declared behavioral experiment, not a
solved equilibrium, calibrated forecast or welfare optimizer.

```sh
PYTHONPATH=src python3 scripts/run_adoption.py --samples 1000
PYTHONPATH=src python3 scripts/analyze_adoption.py
PYTHONPATH=src python3 scripts/run_adoption_frontier.py
PYTHONPATH=src python3 scripts/run_adoption_structure.py
PYTHONPATH=src python3 scripts/run_gradual_legacy.py
PYTHONPATH=src python3 scripts/run_gradual_banking.py
.venv/bin/python scripts/adoption_figures.py
.venv/bin/python scripts/build_adoption_report.py
```

The first export contains 37 named paths, 192 declared sensitivities and 6,000
seeded runs across six policies. Paired comparisons use identical seeds and
report stopped runs separately from completed-horizon distributions. The finer
automation grid tests conditional maxima; the separate funded entry/acquisition
experiment isolates ownership transfers and newly produced equipment. The old
banking engine remains separate from the new relative-price engine.

Read the [model rules](research/adoption-model.md),
[experiment log](research/adoption-experiment-log.md),
[frontier results](research/adoption-frontier.md),
[entry/acquisition limits](research/adoption-structure.md), and
[verification record](research/adoption-validation.md). The source log and
independent Sol/Astra reviews are linked there. All numerical parameters and
opportunity probabilities are invented.

The new paper's key distinction: gradual automation does not uniquely determine
purchasing power. Protected pay and lower prices can increase worker consumption;
shorter paid hours can reduce it. A firm can avoid payment failure by shrinking,
while its workers buy less. Zero employment need not mean zero consumption when
people have income rights and adequate productive capacity. None of these cases
validates a real AI revenue, capital-spending or GDP forecast.

## Rebuild figures and reading pages

Optional development tools are locked in `requirements-dev.lock`:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.lock
PYTHONPATH=src .venv/bin/python -m toy_economy.cli --output outputs
.venv/bin/python scripts/build_report.py
.venv/bin/mypy --strict src
.venv/bin/ruff check src tests scripts
.venv/bin/ruff format --check src tests scripts
node --test tests/teaching.test.cjs
node --check site/teaching.js
```

Matplotlib renders PNG and SVG figures; Markdown renders reading pages. Neither
is needed by the core model. The lock records the tested development environment,
not guaranteed compatibility with every future platform.

## Code and research map

| File | Responsibility |
| --- | --- |
| `src/toy_economy/closure.py` | Simultaneous income/expenditure solution and explicit unresolved states |
| `src/toy_economy/production.py` | Five sectors, two firms each, consolidated input-output accounts |
| `src/toy_economy/ledger.py` | Cash transfers, validation and payment records |
| `src/toy_economy/dynamics.py` | Payment sequence, financing, capital replacement and insolvency stop |
| `src/toy_economy/shocks.py` / `shock_cases.py` | Persistent scheduled policy changes, named paths and sensitivity boundaries |
| `src/toy_economy/incentives.py` / `strategic_game.py` | Private adoption hurdle and separate human/robot/exit game |
| `src/toy_economy/limits.py` | Diminishing-return capital paths and analytical stationary maxima |
| `src/toy_economy/growth.py` | Separate fully automated growth counterexample |
| `src/toy_economy/scenarios.py` | Named experiments and explorer grid |
| `src/toy_economy/bank.py` / `bank_dynamics.py` / `bank_cases.py` | Separate bank ledger, optional engine, named cases and sensitivities |
| `src/toy_economy/adoption.py` / `adoption_engine.py` / `adoption_decisions.py` | Typed gradual-adoption state, household payments and bounded private choices |
| `src/toy_economy/adoption_experiments.py` / `adoption_analysis.py` | Paired timing draws, honest stop reporting and conditional summaries |
| `src/toy_economy/adoption_structure.py` | Separate funded entry and acquisition accounting |
| `src/toy_economy/cli.py` | Deterministic JSON/CSV export |
| `tests/` | Accounting, behavioral boundaries, payment replay and scenario regressions |
| `model-spec.md` | Equations, timing, scope and assumptions |
| `research/` | Protocol, original notes, source metadata and review records |
| `scripts/build_report.py` / `build_shock_report.py` | Deterministic exports, charts and static HTML presentation |

Model APIs use typed, frozen parameter/result records and explicit validation.
No fitting or optimizer hides the assumptions. The stationary allocation, cash
transition and price-flexible growth example are deliberately different models;
read the specification before combining their rules.

## Evidence and limits

The target podcast was identified and its visible transcript checked at relevant
timestamps. Automatic captions leave a revenue unit and annual-versus-year-end
pace ambiguous; the articles retain that uncertainty. Labor-share claims use
BLS's defined US nonfarm-business series. Source logs retain public metadata and
verification limits. No account identity, watch-history export, authenticated
URL, full transcript, paid article copy or browser/session data is included.

In the original model, workers and owners form two pooled household accounts.
The gradual-adoption model instead follows ten individual worker accounts and
one pooled owner account, with explicit but non-optimizing price/customer rules. The optional bank is
an accounting experiment, not a calibrated financial system. No empirical elasticity, optimal investment decision or welfare ranking is estimated. See the [experiment record](research/experiment-log.md)
and [independent review](research/adversarial-review.md).

## License and attribution

Code is [MIT licensed](LICENSE-CODE.md). Original prose, synthetic data and figures
are [CC BY 4.0](LICENSE.md), following Value Deep Dives. External sources retain
their owners' rights and are not redistributed. AI-assisted research, coding and
review were checked through primary sources, independent arithmetic and tests.
