# Banking extension: delivery verification

11 October 2026. Optional experiment and paper appendix; local draft, not published.

## What changed and what was preserved

A separate one-bank engine adds deposit creation, finite underwriting, loan
vintages, principal repayment, cash interest, bank profit distribution, and explicit
zero-recovery forgiveness. It reuses the original production and purchase rules.
The only shared-model source changes introduce a structural payment interface;
credit-disabled runs reproduce the original engine's complete period records and
payment ordering across six matched schedules/allocation choices.

The existing article body through its original car conclusion is byte-for-byte
unchanged against the pre-extension backup. The optional appendix follows it.
The original twelve SVG/PNG diagrams retain their saved hashes. Five new diagrams
show funded capitalization, a loan's lifecycle, a successful payroll bridge,
household repayment, and bank capital absorbing a failed loan. The static version
was generated and visually inspected before the matching motion edition.

Seventeen named paths and 64 sensitivity results are saved. The bank report
embeds recorded Python data: selectors do not run a separate economic model in
JavaScript. A standard-library command regenerates the JSON, and the regenerated
file was byte-equal to the saved result. No data fitting, random seeds, paid APIs,
new runtime dependency, account information or remote service is involved.

## Verification

- Python suite: 119 tests passed after the audit corrections, including 28 banking
  tests and four explorer/export checks. All 87 pre-extension tests also pass
  after updating the intended illustration count from twelve to seventeen.
- Strict mypy: all sixteen source modules pass. Ruff lint and format checks pass
  on all 36 Python source, test and build files.
- Seven existing animation-state/route/coordinator Node tests pass; the animation
  engine is unchanged. Both banking and teaching JavaScript syntax checks pass.
- Display checks reconcile every saved row's deposit, principal and equity changes
  and ensure every modeled path and actual stop reaches the explorer. Principal
  and unpaid interest remain separate. A specific timing regression checks final
  repayment in round 17, partial consumption recovery in 18, and full recovery in 19.
- Independent economics reading checked the appendix and all five new diagram
  quantities against the saved records. It caught and resolved the timing above,
  clarified that forgiveness preserves aggregate deposits (not necessarily the
  original sellers' account balances), and removed an untested expansion claim.
- The separate [banking code and accounting review](banking-review.md) records its
  own exact scope, findings, corrections and source hashes.

## Browser and visual inspection

Used an owned loopback-only preview in the in-app browser. Desktop inspection used
1280 × 900; phone inspection used 390 × 844. Read all five new static diagrams at
phone width and confirmed no document horizontal overflow. New illustrations are
legible, captions explain how to read amounts, and stocks at different dates are
not presented as additive flows. The two editions embed identical complete SVGs.

Exercised all seventeen case options in the explorer and moved each to its final
record. Confirmed successful zero debt, unpaid-wage stops, bank capital depletion,
and negative-equity insolvency with remaining debt visibly distinct. The account
and loan disclosure showed the forgiven contract and balanced final bank book.
Mobile selectors, explanatory text and charts fitted the viewport. Chart axis labels were enlarged and rechecked at phone width, including a negative-equity path. No warning or
error was captured in the browser console.

Exercised Next step and Show all for each of the five new diagrams. Watched a
three-stage desktop loan illustration advance through Play and stop at its last
stage, then restored the complete picture. Static is the default; no autoplay was
added. Reduced-motion and print behavior retain the previously tested engine and
CSS; this pass did not change the operating system's motion preference.

An attempted click on an already-disabled Show all control was rejected by the
browser as expected; subsequent QA used its enabled state. A read-only SVG
geometry probe was unsupported by the browser adapter; actual screenshots, not
that probe, supplied the visual inspection.

## Audit correction and cleanup

The independent audit found that the exposed ledger API accepted backdated
forgiveness and spurious forgiveness of closed loans. The fix rejects backdated
transactions and requires an active obligation at contractual maturity before
forgiveness. Five regression tests cover chronology, failed-call nonmutation, and the requirement to accrue interest before manual principal repayment or forgiveness.
Rebuilding all 17 paths and 64 sensitivity summaries remains byte-identical:
these invalid calls never occurred in the chronological experiment engine.

The owned browser tab was closed, viewport override reset, and loopback server
stopped. The resource helper verified cleanup and released the exact preview
claim. No Docker environment was started. The study worktree, existing virtualenv,
backups, saved outputs and portable delivery bundle are intentionally retained.

## Interpretive limits

Results distinguish temporary financing gaps from permanent income loss. A
successful bridge is identified by completed repayment, not merely surviving a
few more periods. In the household examples, smoother spending is not claimed to
increase cumulative GDP. The capacity comparison can fill a demand shortfall
without raising the production ceiling. Book equity does not include an early
expected-loss valuation. The model has no runs, interbank settlement, financial
service production, depositor loss allocation, bank recapitalization or bailout.

No universal interest-rate or debt-to-GDP failure threshold follows. Old review
snapshots are explicitly historical; they are not silently recertified for the
banking extension. This is verified experimental code and a draft explanation,
not empirical validation or publication approval.

## Delivery snapshot

SHA-256 identifies the checked artifact bytes. This note excludes itself to avoid a self-referential hash.

| File | SHA-256 |
|---|---|
| `README.md` | `b04e72965fcd8f90a2956e888cef4bb1df7adc13c52e4ca7e9dcde38105dca3f` |
| `articles/03-when-the-economy-breaks.md` | `ca8ce790c24bd5d6e2ec00d3e4c0a048ec17822e8a2579d91ad100d1b1da3e8b` |
| `outputs/banking/results.json` | `5c29123ea005b0739d880f0db0d95f4ebbf24778c6779d4514dddab44a46773a` |
| `outputs/teaching/13-bank-opening.png` | `f331f9505d2577214e631c418f33104dc26dc4929e70d551b0e8fc023e861d46` |
| `outputs/teaching/13-bank-opening.svg` | `2bb83f139c91244b60542b0fca8cf82f3bdb1a218f4aec071629f1b49fc31ddd` |
| `outputs/teaching/14-bank-money.png` | `6d5212724aad755ff8a2ddab71c51a8568d5a36eddc582a22b0d65197676f02a` |
| `outputs/teaching/14-bank-money.svg` | `bb7cf46630fe0fdf655a121a4d312fb75962367db69242f4e035e19556b74296` |
| `outputs/teaching/15-bank-bridge.png` | `dffa2383b3a0de829ca6a5bd12046052b04fc18c94cf5dbca5eb4b3bff1d73c1` |
| `outputs/teaching/15-bank-bridge.svg` | `844b23274592bda9690f081cdc2acd978f5ce7533282b1aea8d3726de32e4b47` |
| `outputs/teaching/16-bank-households.png` | `4a408534b0215c28500d7dbef20910368e09f71369955de46e743fa428dba968` |
| `outputs/teaching/16-bank-households.svg` | `9003419b880614e71bb2471149e6664d49de63c81840baf10b28e0f4f6f8096d` |
| `outputs/teaching/17-bank-loss.png` | `8c41d1590e94be1e9e680b5d1414cdd5dd2b3425815cf8089f0d8e2f9241ff72` |
| `outputs/teaching/17-bank-loss.svg` | `d782e0b0328619801cd26b64f61d39e185bf6cfc49645cc0a17ab2f097b4b3b2` |
| `outputs/teaching/manifest.json` | `0a1f634d3f29ba6e6dfbac836ed87cb25f4c0e5974ff356e73553cc054836a37` |
| `research/banking-model.md` | `91df3f86bdd2208aa7bc40955c6e284cfecee5829b076e74bc04183c09353686` |
| `research/banking-review.md` | `9021ed1dc5393c618a427158957da77fdff1bebc45ff8fc610428ec29b4c7344` |
| `scripts/banking_figures.py` | `f57b2df6a425013a99d99fc57ddf34714d72322c903dc7bf5bacd95fa1354a55` |
| `scripts/build_banking_report.py` | `d97815036b0400934093b27d052104aaef031037ce719690e474797436643e35` |
| `scripts/build_report.py` | `23589546ae1c56d6bbaf6b0675e69bbb84dd69b8ab5c3e1c64d1497a41f060f3` |
| `scripts/build_teaching.py` | `212faf762141adc317c10a49a7e03ae685c930400f8967952df64af8db5bf453` |
| `scripts/run_banking.py` | `bafe74a5f815de5a13dd94213b8c864f77e561c53e2babf23d986f89155998a5` |
| `site/03-when-the-economy-breaks-animated.html` | `b5089d1bf43ac305165088700fb387e549c5de407e53c33b1e147299cb2851b9` |
| `site/03-when-the-economy-breaks.html` | `1e700f6adc8cfc79ebeee1e6a1a979e7c4101c9a079c40889d2573d06be817f9` |
| `site/banking.css` | `b336951234e312b7a3f8b9ef03c32e4e4426445d531b773eed49434d7925f131` |
| `site/banking.html` | `fca624fa9a7a48f5ec6551296db753f154dc0a55705b4d029e20897a8e6bdff8` |
| `site/banking.js` | `00ca2e285e5869275e4cc9bcae79f9f4de3fd187bb3dace9f76627e246269712` |
| `site/banking.template.html` | `e7b3ec7cfe635464cd0fd25ffbf66ad45f96cd78433e63f2b9f7f853994ad997` |
| `src/toy_economy/bank.py` | `ef85404c5098053ffe596e5c11e28e0258235dfb524ed618f13149ee3599bc21` |
| `src/toy_economy/bank_cases.py` | `041d5ff7270dfea06797ee56fc4c1ab049628064968319a8f02e8e657a90e5c2` |
| `src/toy_economy/bank_dynamics.py` | `eeb41a18a4319030865ee72bf46b0dff2ed6966194f3c55502ac105a745825f5` |
| `src/toy_economy/dynamics.py` | `439cb5b9b3455c69bbb9002d8a15e0da0c7c200cba3c3e142af0cf5633b00b88` |
| `src/toy_economy/ledger.py` | `a57bdc65d086b1a3de642e5ebc59ed7794806392a1eabc30a376ebe6a5c48261` |
| `tests/test_bank.py` | `0eed28c9e20b58a4a06688eb834a57b7fe1bebd2d6372b7e61fb51a2e258870a` |
| `tests/test_bank_dynamics.py` | `2c2482f23568ce151d27461cba4acbe95fef8938f2480e219bbbfc305cb8a76c` |
| `tests/test_banking_assets.py` | `62bcb5aa076957b064a262988bc13bcd75c54bde86f3842d978e84d18c874cc6` |
| `tests/test_teaching_assets.py` | `6d4fa8f966ec6d3f4651d3773515cbb5d7be7231b8a2f2fb14a88d2e54ec3f4c` |
