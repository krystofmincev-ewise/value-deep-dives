# Templates

Copy the smallest template that fits the work, then delete instructions and sections that do not add evidence. Templates create consistency; they are not a reason to manufacture content.

| Template | Use |
| --- | --- |
| [Company landing page](company-readme.md) | Start a company dossier |
| [Company identity](company-identity.md) | Resolve the legal entity, security, identifiers, aliases, and data-join perimeter |
| [Coverage-cycle manifest](coverage-cycle-readme.md) | Package an initial or repeat valuation under an ISO-week and sequence identifier |
| [Research plan](research-plan.md) | Define questions and publication gates |
| [Canonical company report](company-report.md) | Integrate the final thesis, valuation summary, stance, risks, and monitoring plan for one coverage cycle |
| [Valuation](valuation.md) | Record dated narrative anchors, distribution outputs, methods, and sensitivities |
| [Valuation-horizon contract](valuation-horizon-contract.json) | Freeze the modeled quantity, exact horizon outputs, model paths, and multi-horizon relationship |
| [Independent review](independent-review.md) | Bind a review disposition to exact canonical, contract, model, and verifier hashes |
| [Source log](sources.md) | Track source provenance and AI assistance |
| [Source record](source-record.md) | Validate one source's timing, rights, retrieval, verification, and intended use |
| [Fact record](fact-record.md) | Preserve one bitemporal fact or model input with stable subject and source IDs |
| [Fact snapshot](fact-snapshot.md) | Freeze the exact fact/source manifest used by a formal forecast |
| [Discovery study](discovery-study.md) | Run a screen, sector study, or theme |
| [Update](update.md) | Supersede or amend published research |
| [Decision](decision.md) | Record an action or pass |
| [Retrospective](retrospective.md) | Evaluate outcome, thesis, and process |
| [Event forecast](event-forecast.md) | Pre-register a catalyst outcome and a separate security-return outcome |
| [Event outcome](event-outcome.md) | Resolve and score a frozen event forecast without hindsight edits |
| [Exchange calendar snapshot](exchange-calendar-snapshot.json) | Freeze the provider/version and exact eligible sessions used by event scoring |
| [Market observation bundle](market-observation-bundle.json) | Commit provider-versioned security and benchmark observations used to resolve a target |
| [Market-data capture](market-data-capture.json) | Preserve the normalized provider observations whose SHA-256 digest is bound to a market-data source record |
| [Experiment README](experiment-readme.md) | Scope and reproduce technical work |

Use ISO 8601 dates and filenames such as `YYYY-MM-DD-descriptive-slug.md`. Store a full company review under a path such as `companies/example/coverage-cycles/2026-W34-01-initial/`; use the ISO week-year, not the calendar year around New Year boundaries. Each cycle exposes one `YYYY-Www-final-report.md`; drafts evolve in that file until finalization. Formal valuation outputs also use one JSON horizon contract referenced by every canonical artifact.
