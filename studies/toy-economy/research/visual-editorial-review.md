# Illustrated edition: targeted editorial and diagram review

> Historical snapshot: the optional bank model and appendix were added later on 11 October 2026. This record describes its stated earlier scope; its hashes are not a current certification of changed files. See [banking review](banking-review.md) and [banking verification](banking-validation.md) for the extension.

Reviewed 11 October 2026. Status: no unresolved material finding in the reviewed
static narrative, diagrams and reading-step text after the corrections below.
This is an editorial and semantic review of the existing economics, not a new
simulation study.

## Scope and evidence

Read the complete article, all twelve manifest descriptions and reading steps,
`scripts/visual_figures.py`, and `research/visual-data-review.md`. Inspected all
twelve PNG diagrams directly, then rechecked the regenerated feedback and
replacement figures after the palette correction. Checked the revised income
and payroll-allocation resets in both the article and regenerated manifest.

The saved numerical sources and model files retain their prior hashes: all
23 model/output entries in the earlier shock-review snapshot still match. The
private-incentive diagram was additionally checked directly against
`outputs/shocks/incentives.json`, `firms_10_cost_1.result`: wage saving 6,
aggregate sales loss 10, own sales loss 1, private gain 5 before setup, and
GDP 100→90. Its source mapping is now included in the visual data review.
No new simulation, research retrieval, package installation or production-code
edit was performed by this reviewer.

## Corrections discussed and verified

1. **The feedback sequence needed an explicit income reset.** A reader just
   taught the wage 60/owner 40 split could not infer why owners next consume half
   of 100. The article and diagram 08 now say inherited wage spending has ended,
   and the previous 100 is all owner income. The 50+20=70 calculation therefore
   begins after that transition, matching the saved t6 row rather than falsely
   removing worker purchases in the first layoff period.
2. **The surviving freeze needed a payroll-allocation reset.** Diagram 09 uses
   fixed firm payroll commitments. Diagram 10 survives with the original flexible
   allocation of worker hours across firms. The revised article and first
   reading step for 10 explicitly keep all ten workers employed while allowing
   their hours to move as orders change; each firm's wage bill is no longer fixed.
   The longer surviving pause is not presented as a continuation of the rigid
   payroll failure experiment.
3. **Colors should retain their teaching meaning.** The unrelated “Expand”
   result in diagram 11 is now neutral rather than worker green. Timeline arrows
   in 07/08/10 are neutral rather than equipment blue. The regenerated images
   preserve the worker/owner/equipment distinctions without suggesting that
   expansion itself creates worker income or that a time arrow is equipment.
4. **Source handling was repaired.** The MIT PDF link was restored after a
   numerical-spacing edit inserted spaces into its path. Figure 04 now has an
   explicit saved-data source alongside the other illustrations.

## Conclusions

The continuous arc is coherent: deferred car purchase, the town's cast, one
complete income/spending round, a separate private-incentive example, three
alternative spending endings, payment timing, replacement and physical limits,
then the return to the car. Definitions appear before they are used. Short
paragraphs and captions tell the reader which branch or box to follow. Each
figure performs a distinct explanatory job; the sequence does not require the
reader to remember all ten business names.

The important model changes remain visible. The equal-share adoption game is
separate from the supplier network. The three endings are alternatives. The
ownership case restores owner spending to 50%, rather than silently retaining
80%. Rigid payroll and flexible recovery cases are now distinguished. The
maxima section explicitly switches to a separate physical production model.

Quantities and geometry support the claims. Baseline consumption 80 and
investment 20 sum to GDP 100; financing is not counted again as output. The
zero-wage cases preserve the distinction between aggregate GDP and former-worker
purchases. The feedback arithmetic 100→70→49→34.3 uses lagged income, with the
cash stock remaining 200. Payroll 3 versus cash 1 leaves 2 unpaid per equipment
firm; aggregate wages 56 paid plus 4 unpaid reconcile to 60 contracted while GDP
is 67.75. The recovery bar shows 60+0+20=80. The physical-model bars use the same
scale: real output 250 splits 125/125, while 500 is entirely replacement with no
household consumption. No bar suggests money has been destroyed, financing is
extra GDP, or larger GDP guarantees better household access.

The static figures are legible at their native supplied size, with large labels,
explicit quantities and ample separation. The reading-step text exposes causal
order and can support meaningful optional animation. That is an editorial
judgment, not testing with fifteen-year-old readers or people with ADHD. This
review does not establish comprehension, clinical accessibility, mobile/browser
layout quality or animated-control behavior. Those presentation checks belong
to the implementation owner's separate QA. Moving symbols must retain the
stated interpretation of direction, with amounts supplied by labels; their
motion must not imply additional transactions or invented economic time paths.

## Reviewed source snapshot

Hashes identify the current reviewed article, figure generator, manifest,
data mapping and saved numerical sources. A material change calls for a targeted
refresh. The earlier shock-review numerical findings are retained; its changed
article entry must be refreshed separately by the owner before a release claim.

Snapshot recorded: 2026-10-10 23:23:19 UTC.

| File | SHA-256 |
| --- | --- |
| `articles/03-when-the-economy-breaks.md` | `5ddadc202cb15c763b431f7ab49c56a676d342814f79385df1e70af35120cf38` |
| `scripts/visual_figures.py` | `6f5156890ef73d5a9562aba7c24c52480625160d9be68a984396e1ee0dea205b` |
| `outputs/teaching/manifest.json` | `95f6d1cc119e99a9c4cf9f8637a67268eee913bdb6fc87ec2a9d57b932e4c4c8` |
| `research/visual-data-review.md` | `23157c8d7f9b9d74a5eecce6aa2caf76b8aee3a4ad27599ee16bafeff7dd00ac` |
| `outputs/results.json` | `0f169322fdb7119d8cd5dcc448ce966c4c304dd784925e0109f9a12d774d9c5a` |
| `outputs/shocks/results.json` | `70abb218384b9b969b1b5df2888f4b6d24b47f3fc0b74dcf553e5f682f607d02` |
| `outputs/shocks/incentives.json` | `962cb5ff62f9d67f5396ba5d376c0f6cce7208358424e730da58b3f500c4885d` |
| `outputs/shocks/limits.json` | `c0c70b6e3ba094317445b3cf8359091ce3fc73f3ee7d17c9ef90a67fde494a7c` |
