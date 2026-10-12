# Gradual adoption experiment log

## 20:43 UTC — first runnable comparison (six minutes after start)

Re-ran the existing ten-firm economy for 100 periods: unchanged employment; ten-to-zero at period 5; two-worker steps every two periods; two-worker steps every eight periods. Same initial state, two alternative investment rules. Reproduction: `PYTHONPATH=src .venv/bin/python scripts/run_gradual_legacy.py`.

With investment fixed at 20, all three employment-loss paths converge to nominal/real GDP 40. Cumulative 100-period GDP is 4,420 / 4,660 / 5,380 (sudden / faster steps / slower steps). With the existing sales-responsive replacement/adjustment rule, all converge toward zero; cumulative GDP is 833.33 / 1,233.33 / 2,433.33. The unchanged baseline stays at 100 under both rules.

Interpretation: slower displacement preserves more production during the transition but does not repair the final income/spending rule by itself. This is a result of the original model's closure, not evidence that gradual productivity adoption must fail. It motivates the separate price/hour/ownership experiment. The original engine models aggregate worker-equivalents across the supply chain, not ten individually assigned worker identities.

Initial invocation omitted PYTHONPATH and did not run; corrected without installing dependencies. Output: `outputs/adoption/legacy-gradual.json`.

## 20:48 UTC — banking continuity

Added six gradual-loss cases to the existing audited banking engine, separately from the new price model. Reproduction: `PYTHONPATH=src .venv/bin/python scripts/run_gradual_banking.py`.

A prudent bank that sees no future worker income refuses a permanent consumption bridge; gradual loss still ends at GDP40 and worker consumption0 under fixed investment. When wages return at period15, the bridge fully repays over the 100-period horizon. If that promised recovery never arrives, defaults follow. Replacing wages with a 60% profit share at period15 restores long-run worker consumption, but in this tested repayment schedule some debt is nevertheless forgiven: future income restoration is not the same as a repayment schedule that fits the transition. These are original-model sensitivities, not a claim that the new relative-price model already contains a bank. Retain stop reason, outstanding balances and all debt outcomes in the JSON.

## Core iteration and independent correction

The separate four-firm engine was built before the new prose. Independent Sol
and Astra probes found scarce AI incorrectly restricting a non-user, equipment
not following its actual purchaser, a bonus paid without matching household
income, and an artificial full-automation discontinuity. Those defects were
reproduced and corrected. The final model keeps ten individual worker accounts,
separates guaranteed paid hours from actual productive time, and retains the
failing payment round when a firm exhausts its cash. A final near-one boundary
check also fixed a positive fractional workload being rounded into zero jobs.

Added bounded private adoption choices only after the cash/physical core passed
those checks. Protected salary and hourly contracts can make different choices
under the same technology offer. Resource-aware normal-cost pricing replaces the
initial optimistic forecast as the default; the optimistic rule remains an
explicit sensitivity. The model does not solve a price game or long-run firm
optimization. Adding that claim would exceed what the code does.

## Final core batch — 6,000 timing runs

Regenerated 37 named paths, 192 coarse sensitivities and 1,000 seeds for each of
six policies after the boundary correction. Run time for this final export was
155 seconds on the local machine. Source hashes cover exactly the core modules
and generator used, rather than unrelated optional extensions. Independent Sol
replayed the whole earlier numerically identical batch; Astra independently
replayed 51 selected seeds and recomputed distribution statistics. Their final
review snapshots record the resulting artifacts and remaining scope limits.

Failures remain visible. Of 1,000 runs, bounded hourly adoption with the reference
payroll rule stopped 58 times; sales-responsive hours stopped none but produced
lower cumulative output on the 942 seeds where both policies finished. Forced
protected-pay adoption stopped 986 times, while bounded protected-pay firms
rejected the costly step and preserved the baseline. A survivor-only average of
the remaining 14 forced runs is not an average over the full policy experiment.

Paired comparisons now explicitly name cumulative real GDP and cumulative worker
real consumption over all 80 rounds. They do not subtract unrelated survivor
medians, invent post-failure GDP, or interpret simulation frequencies as empirical
probabilities. No additional Monte Carlo sampling was needed after the full batch
and independent replay agreed; the remaining investigation tests mechanisms and
boundaries instead.

## Reading and software checks

The new manuscript is under half the length of the previous illustrated paper
before its final small extensions. Nine initial SVG/PNG diagrams were built from
saved output, with source hashes and displayed values in their manifest. Static
pages were built first; the matching optional edition reuses the tested
reader-controlled step player. The explorer displays saved records and never
reimplements the economic engine in JavaScript.

At this checkpoint, 165 Python tests, strict typing across 21 source modules and
seven animation-state tests passed. Five additional asset checks then verified
source provenance, exact explorer records, figure provenance, zero-job household
consumption and explicit failure counts. Later optional modules receive their own
tests and review before the final verification record is written.

## Fine grid and company ownership

The additional 1,010-run grid exposes 152 payment stops and keeps them separate
from completed endpoints. It distinguishes local/flat grid peaks from an exact
static physical capacity envelope. The standard-capacity protected-pay peak
sells about 94.1 baskets despite physical room for 160. That peak is induced by
the assumed normal-capacity pricing rule and demand, not a discovered universal
best level of automation. With more AI capacity, an apparently better 80-round
endpoint at 58% automation is still losing cash and fails at recorded round 90
when the horizon is extended. The no-buffer-draw-tail screen is a diagnostic,
not proof of indefinite stability.

The separate company-structure module contains 14 named paths and 18 sensitivities.
It isolates funded equity acquisition from newly produced equipment, with fixed
household budgets and protected incumbent pay. Acquisition without a technology
change preserves production. Buying new equipment raises gross investment in the
purchase round; subsequent replacement raises gross GDP without more consumer
goods. Net domestic product makes this distinction explicit. Independent Astra
payment replay covers the final paths and additional financing/resource boundaries.

## Final delivery checks

All 187 Python tests, strict typing across 22 source modules, lint/format checks
across 59 Python files and seven animation tests passed. Main, frontier and
structure source hashes match their exports; paired analysis references the
current main result file. All local HTML assets and links resolve. The paper
contains 2,208 words and eleven figures, compared with 4,741 words in its prior
illustrated version. Sol and Astra finalized their independent review snapshots
with no blocking accounting or causal-wording issue within the declared scope.

Desktop and narrow-screen browser checks covered static reading, step controls,
actual versus forecast disclosures, stopped paths, individual baskets, rotating
paychecks and playback/pause. The full-path chart now uses both color and line
style. No model code is duplicated in the browser. Earlier delivered versions
are preserved; this is a new local review bundle, not a public release.
