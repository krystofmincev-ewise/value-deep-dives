# Data and source policy

This is a public repository. Data provenance, redistribution rights, and privacy are part of research quality.

## Allowed material

- Public filings, investor materials, regulatory publications, and other primary sources linked from their original publisher
- Small derived CSV or JSON datasets when redistribution is permitted and the transformation is documented
- Original code, calculations, charts, and summaries
- Public datasets with a recorded license, source URL, access date, and data cutoff

## Material that must not be committed

- Material non-public information
- Brokerage exports, account identifiers, private communications, or personal contact details
- API keys, credentials, cookies, `.env` files, or secrets
- Paid or proprietary datasets without redistribution rights
- Full copied articles, books, analyst reports, podcast transcripts, or other copyrighted works
- Large raw filings or downloads that can be reliably linked or rebuilt

Deleting a file later does not remove it from Git history. Check every staged change before pushing.

## Source records

Source logs should record:

| Field | Meaning |
| --- | --- |
| Title and publisher | What the source is and who produced it |
| Publication date | When the underlying information was published |
| Access date | When it was retrieved for the research |
| URL | Prefer the original publisher |
| Evidence type | Filing, investor material, regulator, dataset, interview, press, or secondary analysis |
| Access | Whether retrieval was public or required a signed-in session |
| Rights | Public, licensed-local-only, link-only, or unknown |
| Retrieval | API, CLI, Chrome, Browser, Computer Use, or another documented route |
| Use | Which claim, input, or question it informs |
| Verification | Whether and how the claim was checked |
| Capture | None, local note, local source copy, or a permitted committed derivative |
| Notes | Limitations, conflicts, restatements, or transformations |

For a non-redistributable or large dataset, commit a manifest or build instructions with its URL, license, version, checksum when useful, and exact transformation steps—not the data itself.

## LLM handling

LLM output is not a source. When an LLM surfaces a claim, cite the underlying document after checking it. Record the provider/model, date, task summary, source set, and verification status when AI assistance materially affects the work.

Authenticated sources, browser sessions, APIs, and local captures must also follow the [research tooling runbook](methodology/RESEARCH_TOOLING.md).
