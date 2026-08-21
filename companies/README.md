# Company index

Company folders use lowercase tickers and serve as durable landing pages. Each full research or revaluation round receives an ISO-week coverage package under `companies/<ticker>/coverage-cycles/<YYYY-Www>-<NN>-<kind>/`; the company root points to the current cycle and preserves the full chronology. The detailed target price lives in the latest dated valuation—not in this index—to avoid conflicting copies.

| Ticker | Company | Focus | Coverage | Research | Position disclosure | Last reviewed | Dossier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SNAP | Snap Inc. | Social media and digital advertising | Active | Draft complete; registration pending | Long | 2026-08-21 | [Open](snap/README.md) |

## Lifecycle vocabulary

- Coverage: `active`, `watching`, `paused`, `archived`
- Research: `researching`, `published`, `superseded`, `withdrawn`
- Position: `long`, `short`, `no_position`, `not_disclosed`

When this index reaches roughly ten companies, metadata validation and generated tables will be worth adding. Until then, this manual index and consistent front matter keep the repository legible without a build system.

Use the [company template](../templates/company-readme.md) to start another dossier.
