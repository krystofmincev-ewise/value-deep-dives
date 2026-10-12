# Experiment record and handoff

10 October 2026. Original, uncalibrated experiments. The user asked whether fixed
wages or lost jobs impose a fundamental demand ceiling on GDP in a small closed
economy. The deliverable is two follow-up article drafts, a typed executable
model, generated data/figures and an offline interactive companion. No publication
or forecast registration has occurred.

## Design decisions

The ten firms form five stages with two firms in each. Equal splitting avoids
an assumed single supplier but does not establish competition. Workers and owners
are pooled into two household groups. An acyclic input-output network makes
intermediate consolidation inspectable. Three separate models prevent an
accounting identity from masquerading as a demand or financing mechanism:

1. A simultaneous allocation with declared spending propensities, investment,
   prices, transfers and capacity.
2. A cash ledger with inherited balances, lagged income, explicit equipment
   finance, depreciation and an insolvency stop.
3. A scalable automated-capital growth example with willing demand and clearing
   prices, constructed to challenge the strongest “no wages means no growth” claim.

## Hypotheses and results

| Question | Experiment | What happened |
| --- | --- | --- |
| Does productive capacity create purchases? | Double capacity with spending rules fixed | GDP stays 100 |
| Must fixed wages prevent real growth? | Halve the common price with spare capacity | Nominal GDP 100; real GDP 200 |
| Can every price rise finance extra AI spending? | Raise the common price 25% | Nominal GDP 100; real GDP 80; this is not a relative-price model |
| What do layoffs do under baseline spending rules? | Remove 1/3/5/10 of ten jobs | Stationary GDP 94/82/70/40 versus 100 |
| Can investment replace that demand? | Remove all jobs; raise investment 20 to 50 | GDP 100; former workers' consumption 0 |
| Can redistribution support consumption? | No jobs; owner-to-worker transfer 60 | GDP 100; worker consumption 60; investment 20 |
| Must owner income rise when payroll falls? | Compare baseline stationary cases | Gross surplus stays 40 under these specific propensities; worker-saving sensitivity changes this result |
| Does money disappear after layoffs? | Replay every cash payment | Money remains 200; full-layoff GDP approaches 40; workers' initial cash runs out |
| Does saving inevitably collapse GDP? | Stop equity funding, compare depreciation on/off | With depreciation, eventual wage arrears stop the run; without it, GDP approaches 60 without arrears |
| Can output and consumption grow without wages? | Scalable automated capital; invest 30%, productivity .5, depreciation 10% | Both grow 5% per invented period; former workers have no consumption |
| Does rising GDP guarantee consumption? | Invest all automated output | GDP grows while consumption is zero |
| Do income identities determine scale? | Everyone spends all income; no investment | Static output is indeterminate; a further rule is needed |

The main conclusion survives the counterexamples: there is no wage-only GDP
ceiling. The growth rate depends on technology and constraints; realized output
depends on spending, prices and finance; who benefits depends on access to income
and ownership. These are distinct questions.

## Research resolution

The requested Big Technology interview was identified. Its visible transcript
supports the approximate capital-spending discussion and the host's roughly
$700 billion combined lab-revenue restatement. Captions do not resolve a garbled
unit or annual revenue versus year-end pace. This limitation is explicit in the
notes and articles; no precise estimate is inferred from it. A related
SemiAnalysis financing episode uses a different cumulative 2024–2029 scope.

The BLS historical labor-share claim was checked with a same-vintage primary
release. It concerns US nonfarm-business compensation, not all world GDP and
not just wages. A declining share need not mean declining labor dollars.

The previous essay already distinguished demand, investment, prices and broad
prosperity. These drafts make its mechanisms tangible rather than claiming to
correct a position it did not take. The domestic intermediate-input example
clarifies why eliminating an HR invoice is not automatically lost aggregate GDP.

## Verification

- 43 unit tests passed on Python 3.14.4 and Python 3.12.14, including all 3,168 explorer records,
  cash-payment replay, insolvency, full-spending indeterminacy and counterexamples.
- Strict mypy passed all eight model source files; Ruff lint and formatting passed.
- Independent economics review checked all 14 cash paths, the 2,304 feasible
  explorer allocations, formula derivations and article numbers. Remaining
  zero-capital growth boundary is documented in the specification.
- Independent prose/source review refreshed both article hashes after corrections.
- Three figures were rendered and visually inspected. All generated HTML local
  links resolve. Browser QA used a loopback server exposing only sanitized
  companion files. Baseline, full layoffs, lower prices, investment replacement,
  redistribution, capacity rationing and indeterminate cases were inspected.
- Desktop and 390-pixel layouts were checked; no horizontal document overflow,
  and both companion charts loaded. Browser checks establish presentation, not
  empirical economics validity.

The exact optional development dependencies are in `requirements-dev.lock`.
No runtime dependency, stochastic draw, API call or credential is needed to run
the model. Generated outputs are original synthetic data; source logs hold
metadata and original notes rather than paid-source copies or viewing history.

## Publication boundary

The package is an article-and-code review candidate. Before public release,
resolve or deliberately retain the interview ambiguity, accept the editorial
voice, select the final title and refresh reviews after substantive changes.
The experiment does not validate the trillion-dollar forecasts, estimate
investment returns, or establish a policy recommendation. No extra calibration
or larger macroeconomic project is required to understand its stated results.
