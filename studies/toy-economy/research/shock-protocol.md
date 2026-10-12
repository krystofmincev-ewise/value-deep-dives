# Second experiment: shocks, private incentives and limits

Started 10 October 2026, 19:28 UTC. Budget: up to four hours, including analysis,
implementation, experiments, writing, verification and cleanup. Same task-owned
worktree and isolated Python environment. Prior baseline outputs and the original
two essays remain the baseline record; their review does not certify new code.

## Requested deliverables

1. A consolidated paper stating the initial results and linking *AI needs a customer*.
2. Reproducible abrupt/gradual shock comparisons with identical initial conditions
   and intended endpoints, exposing spending and investment feedback.
3. A transparent test of privately beneficial automation versus collective demand.
4. Explicit conditions for falling consumption, payment failure and capital decline.
5. Conditional local/global maxima, distinguishing GDP, consumption and growth rate.
6. Updated readable companion, code, tests, figures and a portable review bundle.

## Discriminating hypotheses

| Hypothesis | Smallest test | Interpretation rule |
| --- | --- | --- |
| Speed alone causes collapse | Abrupt versus ten-step and fifty-step layoffs, same endpoint and starting money | Do not infer a speed threshold if both converge |
| Fixed investment hides the demand loop | Replace I20 with replacement plus adjustment to sales-supported capacity | Check analytical recurrence against cash paths |
| Reinvestment speed destabilizes demand | Vary adjustment speed around derived local stability boundary | A local oscillation/peak is not a global GDP ceiling |
| Owner spending can close the loop | Vary owner propensity around replacement investment's complementary share | Distinguish analytical desired spending from actual cash-capped spending |
| Temporary interruptions are reversible | Stop equipment purchases, resume after varying delay | Stop at first arrears; never reset cash/capital or resume an already failed run |
| Private incentives need not maximize total demand | Compare unilateral automation payoffs for 1/2/10/100 symmetric firms | Keep static payoff screen separate from actual installation finance and exit |
| Unlimited growth is a technology assumption | Replace linear capital technology with diminishing returns and optional resource ceiling | Derive maxima over a stated domain; distinguish household consumption from GDP |

## Outcome definitions set before reporting

- Worker access failure: the former-worker group has zero consumption. No biological
  survival or individual household welfare is modeled.
- Demand contraction: output or consumption falls; report continuous paths rather
  than choosing a sensational numerical collapse cutoff.
- Demand extinction: an analytical limit toward zero under a specified recurrence.
  Tiny positive floating-point output is not a finite-period bankruptcy event.
- Payment failure: contracted wages exceed cash available to pay them. Record first
  arrears and stop. No recovery, bankruptcy resolution or hidden credit is supplied.
- Capital erosion: investment falls below depreciation. It can follow, rather than
  cause, the first demand decline.
- Local maximum: a turning point on a particular path or a locally optimal point in
  a declared parameter domain. It is not the global feasible output maximum.
- Global maximum: only claim an analytical maximum over a specified model family,
  holding technology, depreciation and resource assumptions fixed. A grid maximum
  is merely the best sampled point unless supported by proof.

## Scope discipline

Do not create an empirical recession forecast, sovereign debt model, policy welfare
ranking or an optimizing general-equilibrium simulation. The debt analogy motivates
cash-flow and feedback conditions; it does not identify a universal debt/GDP number.
Separate input-output accounting, cash timing, stationary firm payoffs and physical
capital allocation. Explain any link between them and do not claim a joint model
where their assumptions differ. Preserve rejected hypotheses and counterexamples.
