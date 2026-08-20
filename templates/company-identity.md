---
type: company_identity
company: "{Legal company name}"
ticker: "{TICKER}"
exchange: "{Exchange or venue}"
issuer_id: "{stable repository issuer ID}"
security_id: "{stable repository security ID}"
listing_id: "{stable repository listing ID}"
status: draft
as_of: "{YYYY-MM-DD}"
known_at: "{ISO-8601 timestamp}"
valid_from: "{YYYY-MM-DD}"
valid_to: null
domicile: "{ISO 3166-1 alpha-2 country code}"
reporting_currency: "{ISO 4217 currency}"
fiscal_year_end: null
cik: null
lei: null
primary_security_type: common_stock
source_version: null
source_checksum: null
---

# {Company} identity

Resolve identity before joining filings, prices, trials, subsidiaries, or alternative data. Do not guess an identifier from a similar name.

## Legal entity and listing

| Field | Value | Effective date | Source | Verification |
| --- | --- | --- | --- | --- |
| Legal name | | | | |
| Primary ticker and exchange | | | | |
| Domicile and incorporation | | | | |
| Reporting currency and fiscal year end | | | | |
| CIK | | | SEC mapping | |
| LEI | | | GLEIF | |
| ISIN / FIGI, if licensed for use | | | | |

## Aliases and history

| Alias or prior identity | Type | Valid from | Valid to | Source / notes |
| --- | --- | --- | --- | --- |
| | legal name / ticker / brand / acquired entity | | | |

## Economic perimeter

| Entity or segment | Relationship | Ownership / economics | Consolidation treatment | Source |
| --- | --- | --- | --- | --- |
| | subsidiary / JV / partner / VIE / discontinued operation | | | |

## Domain identifiers

Record only those relevant to the company. Examples include trial IDs, drug aliases, target IDs, regulatory application IDs, power plants, mines, leases, bank RSSD IDs, insurance NAIC codes, brands, and major product aliases.

| Identifier | System | Entity represented | Validity / version | Source |
| --- | --- | --- | --- | --- |
| | | | | |

## Join risks

- Dual listings, ADR ratio, share-class differences, currency conversions, corporate actions, spin-offs, renamed drugs, sponsor transfers, or data-provider symbol differences.
