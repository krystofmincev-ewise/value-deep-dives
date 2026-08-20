# Fact snapshot manifest

Store the manifest as JSON next to the forecast and validate it through the event ledger linkage audit.

```json
{
  "type": "fact_snapshot",
  "snapshot_id": "FS-001",
  "created_at": "2026-08-20T09:00:00Z",
  "source_cutoff_at": "2026-08-20T09:00:00Z",
  "records": [
    {
      "fact_path": "companies/example/facts/F-001.md",
      "source_path": "companies/example/sources/S-001.md"
    }
  ]
}
```

The SHA-256 digest covers the exact committed JSON bytes. Each fact must validate, link to the listed source ID, and have `known_from` no later than the forecast cutoff. Each source must validate and have `first_public_at` no later than that cutoff.
