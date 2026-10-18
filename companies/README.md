# Company index

Company folders use lowercase tickers and serve as durable landing pages. Each full research or revaluation round receives an ISO-week coverage package under `companies/<ticker>/coverage-cycles/<YYYY-Www>-<NN>-<kind>/`; the company root points to the current cycle and preserves the full chronology. The detailed target price lives in the latest dated valuation—not in this index—to avoid conflicting copies.

| Company | Research focus | Dated cycle / status | Dossier |
| --- | --- | --- | --- |
| SNAP — Snap Inc. | Advertising repair, regional economics, subscriptions and dilution | [2026-W34](snap/coverage-cycles/2026-W34-01-initial/README.md); draft, review stale | [Open](snap/README.md) |
| WIX — Wix.com Ltd. | AI competition, operating infrastructure and capital allocation | [2026-W35](wix/coverage-cycles/2026-W35-01-initial/README.md); draft, legacy review coverage | [Open](wix/README.md) |

Dates and review states are preserved in the linked manifests. These are historical
research records, not refreshed market recommendations. Current position disclosures,
where provided, belong to their dated records rather than this navigation table.

## Lifecycle vocabulary

- Coverage: `active`, `watching`, `paused`, `archived`
- Research: `researching`, `published`, `superseded`, `withdrawn`
- Position: `long`, `short`, `no_position`, `not_disclosed`

When this index reaches roughly ten companies, metadata validation and generated tables will be worth adding. Until then, this manual index and consistent front matter keep the repository legible without a build system.

Use the [company template](../templates/company-readme.md) to start another dossier.
