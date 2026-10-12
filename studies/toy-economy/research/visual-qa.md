# Visual edition: implementation and presentation QA

> Historical snapshot: the optional bank model and appendix were added later on 11 October 2026. This record describes its stated earlier scope; its hashes are not a current certification of changed files. See [banking review](banking-review.md) and [banking verification](banking-validation.md) for the extension.

11 October 2026. Both editions are drafts for user review, not published.

## What changed

The follow-up is now a slower illustrated narrative with twelve figures: cast,
income, purchases, private incentive, zero wages, shared ownership, a smaller
economy, shrinking purchases, missed payroll, incomplete recovery, replacement,
and distinct output/consumption maxima. The car story still opens and closes it.
The static PNG/SVG figures were created and inspected before motion was added.
Both HTML editions embed identical complete SVGs from the same generator; the
Markdown manuscript uses matching PNGs. The animation has no economic equations.

The animated edition starts still. Next/Previous focus one stage while preserving
context; Play traces declared routes, including the sales number becoming next
round’s income. Equal-sized moving dots indicate direction, not monetary scale.
Only one figure plays. Pause, Show all, leaving the figure and hiding the page
stop motion. Readers can always return to the static version at the top.

## Verification performed

- Full Python suite: 87 tests pass (84 existing economic tests plus three asset
  tests). Ruff checks and formatting pass for all 27 Python files.
- Seven Node tests pass for player transitions, completion, declared route
  geometry, invalid input, playback coordination and viewport overlap. JavaScript
  syntax check passes. No dependency was added for animation or these tests.
- Targeted independent editorial review inspected all twelve PNGs and reviewed
  the manuscript, manifest and generator. Its eight-file source snapshot matches.
  Numerical model and saved results remain unchanged. See
  [the editorial review](visual-editorial-review.md) and
  [figure data mapping](visual-data-review.md).
- Browser review at desktop width and a 390 × 844 phone viewport: static money
  flow, recovery and animated ownership/feedback views inspected. All twelve
  diagrams’ visible text bounds stay inside their SVGs. Neither edition has
  horizontal page overflow at the phone width.
- In the browser, all twelve players passed Next → Next → Previous → Show all.
  Playback visibly moved the sales number and advanced between spending stages.
  Pause and automatic stopping after scrolling away were verified. Keyboard
  Enter activated Next. No browser warnings or errors were reported.
- Both editions use the same complete diagram markup. Controls start hidden
  until JavaScript initializes, so the no-JavaScript fallback retains the full
  paper. Reduced-motion and print behavior were inspected in source; they were
  not separately exercised by changing the user’s browser/OS preferences.

This is implementation/editorial QA, not a comprehension study with teenagers
or people with ADHD. No claim of measured reading improvement is made.

## Reproduce

From the study directory, after installing the locked optional development tools:

```sh
.venv/bin/python scripts/build_report.py
PYTHONPATH=src .venv/bin/python -m unittest discover -s tests -q
node --test tests/teaching.test.cjs
node --check site/teaching.js
```

The report builder regenerates the static images and both reading editions.
Open `site/03-when-the-economy-breaks.html` directly in a browser. No server or
network call is needed. The previous delivery bundles are preserved separately.

## Presentation snapshot

SHA-256 identifies the checked deliverables and their generators. This document
excludes itself. A subsequent material edit requires relevant checks again.

| File | SHA-256 |
| --- | --- |
| `articles/03-when-the-economy-breaks.md` | `5ddadc202cb15c763b431f7ab49c56a676d342814f79385df1e70af35120cf38` |
| `scripts/build_report.py` | `dfd3429b6358a428587be151942444ac5287b4170fe7283ac6e4564b82467fc9` |
| `scripts/build_teaching.py` | `212faf762141adc317c10a49a7e03ae685c930400f8967952df64af8db5bf453` |
| `scripts/visual_figures.py` | `6f5156890ef73d5a9562aba7c24c52480625160d9be68a984396e1ee0dea205b` |
| `site/03-when-the-economy-breaks.html` | `5885ec7ee32aa06261dc22912a729f937e579412d96ab7419482f4c8db6408d0` |
| `site/03-when-the-economy-breaks-animated.html` | `52f12bce83952b0989229142016e6ce9b04d045df701284bfea0ef5a4ad85bdb` |
| `site/teaching.css` | `33ae2d49b43f7ee63e1e99a97cf9c0df807be101ea65b257718c97ddba257a89` |
| `site/teaching.js` | `ca53ad4e36989614e899a2a4afa7da9f68832989a62036f36ffbefa8e2b76caf` |
| `tests/test_teaching_assets.py` | `b4a937c5e02a06ff254f7df48ea5eb750c5300b84f64fe2b17b889dbcba23c30` |
| `tests/teaching.test.cjs` | `c05cec3344936ef434ba50b2271d65e86043fdd7790293be4b189885b88a547e` |
| `outputs/teaching/01-town.png` | `c23ed6b05d04be2b01e4302a19f2c8b155e999b5c0dba0709cef722046e8cd56` |
| `outputs/teaching/01-town.svg` | `8cb65a335012234512b9cf74e202f4ab093d90fd6489bce0904e7b163057e180` |
| `outputs/teaching/02-income.png` | `f8f77c94604f89c838acf3e76a93d2ada3fcc61e2f2c63f2fc7910fa22bdf601` |
| `outputs/teaching/02-income.svg` | `874cc44ac93a32cb1344cb2ddb455ab0fe6168ad5e7b3756ba6e0135acbf398c` |
| `outputs/teaching/03-spending.png` | `98784e549aee972dcc4c03ececbb9536ae09fe965a48115d5b31b5f20d8bf308` |
| `outputs/teaching/03-spending.svg` | `f07839df56f684cd0b034b3574d9ff1cd794874064aa443ce4ee1c93d92d8048` |
| `outputs/teaching/04-incentive.png` | `df812412a918d89adedae3d68e5cc57eff1fc9504439c3e8a842cb8002d9b67b` |
| `outputs/teaching/04-incentive.svg` | `0482feb45438ee17bbb0c094366de843d739b171670f97082976ddbc0507a6db` |
| `outputs/teaching/05-no-wages.png` | `4dfe017373e9b31ab8820b46eb8c8761ae7c216d8b7d108a2d4be89c2ba39468` |
| `outputs/teaching/05-no-wages.svg` | `7bbd31ef950f15fa4d6b0ce324858eef0a8f8c50281f283af5c2dfe45876abc2` |
| `outputs/teaching/06-ownership.png` | `33868adda8e46bf90b2f078bc63beb90232c12a16ce9a7dd58874efdc7d1ea1e` |
| `outputs/teaching/06-ownership.svg` | `803aef53d3c000a9aee79db0acb78a56258144d645716ee262f29d11a80f0567` |
| `outputs/teaching/07-smaller.png` | `ee8238ab94692cbc5c80660e1a469ba9c35e5446ddabc2e5c0c4d1842962c384` |
| `outputs/teaching/07-smaller.svg` | `c0d771f9864201d9c37794768f50559ab23cb4168549d7b39b83b23dc19ed48f` |
| `outputs/teaching/08-shrinking.png` | `fb485eb76b32603d602c4eb4157eff48dff99c45af089bb525570b281572b042` |
| `outputs/teaching/08-shrinking.svg` | `79d6017e0291f1ba2600c1887ed26dd4258daa2e99cb69dcfb19055ad3367aae` |
| `outputs/teaching/09-payroll.png` | `b8b536f5bff6109711ffaf55a44428f718b66ca992307d5be3d9a7c6bf3d8b44` |
| `outputs/teaching/09-payroll.svg` | `c100d473b5aeeaf5d7d857b585edb66bcd7e1901bd6ba8a2dbca628e8387ea24` |
| `outputs/teaching/10-recovery.png` | `be1b57e4381cda8735456c37d12903fd01b4156a93993899beaf50dac1e6977d` |
| `outputs/teaching/10-recovery.svg` | `4e5c1f8759c422efca42928578d1bb3835d0d4593fda584dd7f4beb588f27903` |
| `outputs/teaching/11-replacement.png` | `69347b16f572ed87dbe11dd3ef3b4b734c55efe49bb8ff7c1a9ac79d976c63e5` |
| `outputs/teaching/11-replacement.svg` | `0b254d8193069ae6b002c06b467348dead72bef0507cf8800d76983ae2a5e448` |
| `outputs/teaching/12-maxima.png` | `fea294d65a84db775fe2bac12f0488fa1b02715da38b9e19b7047bd51798a96e` |
| `outputs/teaching/12-maxima.svg` | `d8b9f76730e8177a090176df056f17a94b277a3b8414420428a0ca10f846b146` |
| `outputs/teaching/manifest.json` | `95f6d1cc119e99a9c4cf9f8637a67268eee913bdb6fc87ec2a9d57b932e4c4c8` |
