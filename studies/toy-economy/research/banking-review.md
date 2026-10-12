# Independent review of the optional bank experiment

Status: passed within the scope below, after the exposed-ledger API corrections recorded here. Reviewed 2026-10-11. This is an independent code, accounting and numerical review of the banking extension, not a new calibration, forecast or recertification of the preceding shock study.

## Scope and conclusion

Read the three bank modules, their tests, the shared payment and production sequencing, all saved banking results, the banking model note, the article's bank appendix, and the five bank-diagram definitions. Inspected the five generated PNGs. The appendix and diagrams accurately distinguish temporary payroll finance, household consumption smoothing, forecast-error losses and a physical supply ceiling. No unresolved material defect was found in the named experiment paths or their stated conclusions after the fixes below.

No browser, mobile, animation, accessibility or reader testing was performed in this review. Primary-source banking background, full-project QA, and interactive presentation behavior belong to the other workstreams. This review does not claim that fair lending always succeeds, that a positive book-equity figure measures economic solvency, or that these examples exhaust what banks can do. Bank-funded productive expansion is outside this experiment.

## Findings and corrections

1. **Resolved: public ledger chronology and false forgiveness events.** Before correction, originating a loan in round 5 and calling `forgive(4, id)` booked a loss before origination. Forgiveness also accepted already repaid or previously forgiven loans and could emit a spurious zero-value default event. Transactions now reject periods before the last recorded event. Forgiveness requires an active unpaid obligation at or after maturity. Independent probes verify that rejected calls leave balances, loans, payments and events unchanged, and that a failed future overdraft does not advance the transaction clock.
2. **Resolved: direct principal payment or forgiveness could bypass interest accrual.** A loan of 10 at 10% originated in round 0 could be repaid directly in round 1 before service; subsequent service saw zero principal and charged zero rather than 1 interest. Direct forgiveness at maturity 2 could similarly omit the 2 interest memo. Positive principal repayment and forgiveness on interest-bearing loans now require current-round accrual. Regression probes reject the premature direct calls without mutation, then verify service pays 1 interest plus 10 principal, or separately forgives 10 principal plus 2 interest. Zero-interest standalone repayment remains available.

Both defects concerned exposed `BankLedger` caller ordering. The simulation already accrued interest and resolved loans in the correct order; every saved named path and sensitivity result remained unchanged after correction. No reachable partial-service mutation from a repeated ordinary chronological call was demonstrated, so a broad transactional rewrite was not warranted. The API permits delayed service, charging simple interest through the actual service date; the engine services every round.

## Independent numerical checks

A separate standard-library audit regenerated all **17 named paths and 64 sensitivity summaries** and compared their JSON-normalized contents with the saved result. It independently replayed **727 rounds, 51,869 transaction events, 210 debt-service records and 998 vintage snapshots**. The largest absolute reconciliation discrepancy was **6.821210263296962e-13** invented currency units.

The replay checked customer-account balances against every transfer and banking event; `R + L = D + E`; loan principal advanced minus repaid minus forgiven; deposits after lending, principal payments, interest and dividends; equity after interest, distributions and principal forgiveness; and each vintage's principal and interest memo. It verified that recorded defaults occur at maturity in the engine, that remaining obligations stay visible at early stops, and that origination respects the assumed book-capital ratio. It also checked `GDP = C + I = wages + gross operating surplus = summed firm value added`, household consumption payments, and physical capital accumulation.

At every service event, eligible cash excluded unspent same-round advances. Recorded firm service did not exceed positive current operating surplus; household service did not exceed 20% of actual received wages and ownership dividends. These are the implemented restrictions, not a claim that credit-funded spending can never circulate back as another borrower's earned income. Principal repayment and unpaid interest are never inserted into GDP or bank earned profit.

The matched no-credit tests independently passed exact equality with the original engine at firm buffers 80, including payment ordering. The bank's opening reserve asset 200 backs deposits 180 and funded equity 20. The equity sensitivity holds the reserve asset at 200 while moving funds from firm deposits to bank capital; it cannot isolate a pure capital-ratio effect.

Confirmed teaching quantities:

| Comparison | Independently confirmed result |
|---|---|
| Five-round equipment freeze, no credit | Round 7 pays 58 of 60 wages; 2 unpaid; GDP 69.5. |
| Same freeze, zero interest | Closing principal 2 at 7, 14 at 9, 10 at 10, zero at 13; all wages paid. |
| Same freeze, 1% per round | All 14 principal repaid at 13; total interest 0.42805818. Round 10 principal 10.18 plus interest memo 0.06 gives debt owed 10.24. |
| Ten-round freeze, finite credit | Stops at 12 with unpaid wages, principal 30 and interest memo 0.7; bank equity remains 20. This is an extension, not a completed rescue. |
| Two-round household wage gap, 1% | Advances 120 across two vintages; maximum closing principal 108.6. Purchases 60 at rounds 5–7 and 48 at 8. Final repayment 17; purchases 53.648282 at 18 and 60 at 19. Total interest 6.351717957839126. |
| Household cumulative comparison, 60 rounds | Worker consumption 3480 without credit and with zero-interest credit; 3473.648282 with 1% credit. GDP respectively 5885, 5880 and 5873.648282. Different terminal firm buffers explain the additional 5 in the no-credit arm; no welfare ranking follows. |
| Permanent loss, prudent refusal | No credit advanced; worker purchases zero from 6; fixed-investment output tends to 40. |
| Wrong recovery forecast, limit 20 | At maturity 26, principal 20 and interest memo 4 legally forgiven; loans zero, deposits 200, bank equity zero. Forgiveness preserves aggregate deposits, not a particular seller's account. |
| Wrong recovery forecast, limit 120 | First 60 vintage forgiven at 26; equity −40, while principal 60 and its interest memo remain unresolved at the stop. |
| Matched physical-capacity comparison | Both arms start with productivity 0.4 and capacity 80. Credit advances 76 and is fully repaid; GDP never exceeds 80. Cumulative GDP 4800 with credit versus 4780 without. This differs from the unconstrained household example's initial GDP 100. |

Figures 13–17 use the corresponding verified opening balances, money changes, outstanding-principal dates, household consumption and loss case. The 48/12 bar divides a wage into purchases and debt service; it is not 60 of consumption. Round-number boxes are stocks at different dates and are not additive loan flows. The article preserves these distinctions and states the experiment reset, repayment sources, zero-recovery convention and unmodeled expansion boundary.

## Verification record

Independently ran `PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_bank*.py'`: **32 tests passed**, comprising 28 model tests and four banking display-data tests. Also ran separate input-validation, transaction-chronology, interest-accrual and rejection-without-mutation probes. The implementation workstream separately reported 119 full-suite Python tests, strict typing and lint; those broader checks were not rerun for this review.

The independent replay script is retained locally in `.local/banking-audit/audit.py` at the repository root. Public reproduction of the named outputs uses `PYTHONPATH=src python3 scripts/run_banking.py --output <temporary-path>`; compare the resulting JSON with `outputs/banking/results.json`. The SHA-256 snapshot below identifies the exact reviewed inputs and generated artifacts. README and delivery-validation notes are intentionally excluded because they were still being finalized.

## Review snapshot

| Reviewed file | SHA-256 |
|---|---|
| `src/toy_economy/bank.py` | `ef85404c5098053ffe596e5c11e28e0258235dfb524ed618f13149ee3599bc21` |
| `src/toy_economy/bank_dynamics.py` | `eeb41a18a4319030865ee72bf46b0dff2ed6966194f3c55502ac105a745825f5` |
| `src/toy_economy/bank_cases.py` | `041d5ff7270dfea06797ee56fc4c1ab049628064968319a8f02e8e657a90e5c2` |
| `src/toy_economy/dynamics.py` | `439cb5b9b3455c69bbb9002d8a15e0da0c7c200cba3c3e142af0cf5633b00b88` |
| `src/toy_economy/ledger.py` | `a57bdc65d086b1a3de642e5ebc59ed7794806392a1eabc30a376ebe6a5c48261` |
| `tests/test_bank.py` | `0eed28c9e20b58a4a06688eb834a57b7fe1bebd2d6372b7e61fb51a2e258870a` |
| `tests/test_bank_dynamics.py` | `2c2482f23568ce151d27461cba4acbe95fef8938f2480e219bbbfc305cb8a76c` |
| `tests/test_banking_assets.py` | `62bcb5aa076957b064a262988bc13bcd75c54bde86f3842d978e84d18c874cc6` |
| `outputs/banking/results.json` | `5c29123ea005b0739d880f0db0d95f4ebbf24778c6779d4514dddab44a46773a` |
| `research/banking-model.md` | `91df3f86bdd2208aa7bc40955c6e284cfecee5829b076e74bc04183c09353686` |
| `articles/03-when-the-economy-breaks.md` | `ca8ce790c24bd5d6e2ec00d3e4c0a048ec17822e8a2579d91ad100d1b1da3e8b` |
| `scripts/banking_figures.py` | `f57b2df6a425013a99d99fc57ddf34714d72322c903dc7bf5bacd95fa1354a55` |
| `outputs/teaching/manifest.json` | `0a1f634d3f29ba6e6dfbac836ed87cb25f4c0e5974ff356e73553cc054836a37` |
| `site/banking.html` | `fca624fa9a7a48f5ec6551296db753f154dc0a55705b4d029e20897a8e6bdff8` |
| `site/03-when-the-economy-breaks.html` | `1e700f6adc8cfc79ebeee1e6a1a979e7c4101c9a079c40889d2573d06be817f9` |
| `site/03-when-the-economy-breaks-animated.html` | `b5089d1bf43ac305165088700fb387e549c5de407e53c33b1e147299cb2851b9` |
| `outputs/teaching/13-bank-opening.svg` | `2bb83f139c91244b60542b0fca8cf82f3bdb1a218f4aec071629f1b49fc31ddd` |
| `outputs/teaching/13-bank-opening.png` | `f331f9505d2577214e631c418f33104dc26dc4929e70d551b0e8fc023e861d46` |
| `outputs/teaching/14-bank-money.svg` | `bb7cf46630fe0fdf655a121a4d312fb75962367db69242f4e035e19556b74296` |
| `outputs/teaching/14-bank-money.png` | `6d5212724aad755ff8a2ddab71c51a8568d5a36eddc582a22b0d65197676f02a` |
| `outputs/teaching/15-bank-bridge.svg` | `844b23274592bda9690f081cdc2acd978f5ce7533282b1aea8d3726de32e4b47` |
| `outputs/teaching/15-bank-bridge.png` | `dffa2383b3a0de829ca6a5bd12046052b04fc18c94cf5dbca5eb4b3bff1d73c1` |
| `outputs/teaching/16-bank-households.svg` | `9003419b880614e71bb2471149e6664d49de63c81840baf10b28e0f4f6f8096d` |
| `outputs/teaching/16-bank-households.png` | `4a408534b0215c28500d7dbef20910368e09f71369955de46e743fa428dba968` |
| `outputs/teaching/17-bank-loss.svg` | `d782e0b0328619801cd26b64f61d39e185bf6cfc49645cc0a17ab2f097b4b3b2` |
| `outputs/teaching/17-bank-loss.png` | `8c41d1590e94be1e9e680b5d1414cdd5dd2b3425815cf8089f0d8e2f9241ff72` |
