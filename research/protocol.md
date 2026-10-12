# Experiment protocol

Status: exploratory, uncalibrated. Information cutoff: 10 October 2026.

## Question and deliverables

Can a closed economy grow without increasing employment or nominal wages? What happens to GDP and household access to output when 1, 3, 5 or all 10 workers lose their wages? Which spending, price, ownership and investment assumptions change the answer?

Deliver a reproducible Python package with small typed functions and economic-invariant tests, inspectable scenario outputs, an interactive reading companion, and two connected draft essays. Prepare for later publication; do not publish, create an external repository or send subscriber notifications during this research run. The user's budget is up to six hours. Use local deterministic simulation and authorized Sol Ultra subagents; no separately billed API calls. Stop when the study has meaningful discriminating results and verified deliverables, rather than filling the time allowance.

## Starting point

Owned worktree `toy-economy-gdp`, branch `ewisenl/toy-economy-gdp`, base revision `6585ef75a310c3b6587ab00e69d5cba58c83122a`. The main checkout contains unrelated changes and is left intact. The original essay is [AI needs a customer](https://krystofmincev.substack.com/p/ai-needs-a-customer), published 25 September 2026. Its local manuscript was read in place; no paid captures or watch-history exports are copied into this study.

The earlier article already allows real consumption growth through lower prices, GDP growth through investment, and rising aggregate GDP with worsening distribution. This follow-up tests those mechanisms numerically; it must not misrepresent the earlier essay as asserting an accounting impossibility.

## Modeling choices

Compare three representations:

1. A simultaneous spending equilibrium, useful because the answer can be derived with pencil and paper. Financing and price assumptions are explicit.
2. A ten-firm supply chain, useful for showing why business revenue is not GDP. Two firms at each of five stages. Two firms do not establish perfect competition; prices are scenario assumptions, not an equilibrium of strategic price-setting.
3. A cash-conserving dynamic model, useful for distinguishing a coherent steady-state allocation from a feasible transition. Payment order, prior-period spending information, initial wealth and financing are explicit.

No banking, foreign trade or government purchases in the baseline. An explicitly budget-balanced income transfer or broad ownership can redistribute surplus. The population remains present after its jobs disappear. Owner and worker are income categories; in reality they overlap. Automation capacity is assumed, not proved. Land, energy, resources, replacement and finance can limit any extrapolation.

## Discriminating experiments

- Baseline and requested layoff counts at fixed prices/investment/spending habits.
- Increased productive capacity with unchanged spending.
- Lower prices, unchanged nominal wages, and physical supply sufficient to fulfill demand.
- Higher prices with unchanged spending; separate nominal receipts from real output and quality.
- Owner consumption propensity and budget-balanced redistribution.
- Investment required to preserve GDP after layoffs; household consumption may still fall.
- No wage income, including a full-spending circulation case and a hoarding case.
- No new money versus changed circulation; finite wealth buffers versus permanent income.
- Fixed investment versus investment that responds to utilization, if the dynamic model can express it transparently.
- Intermediate input spending and replacement; no double-counting firm turnover.

## Acceptance evidence

Check expenditure/income/value-added agreement, spending/saving consistency, nonnegative feasible cash balances, conservation of money, input validation, base-price real quantities, and clear statuses for indeterminate or infeasible cases. Inspect representative actual outputs and adversarially review the economic conclusions. Scenario values demonstrate possibility and conditional mechanisms, not likelihood or a calibrated forecast of AI revenue or GDP.

## Public source boundary

Track only original analysis, code, source metadata and reproducible illustrative outputs. Do not include account identifiers, watch dates/history, transcript copies, subscription articles, authentication artifacts or proprietary tables. Interview forecasts require timestamps and an explicit distinction between quoted forecasts, verified facts and unresolved units/date bases.
