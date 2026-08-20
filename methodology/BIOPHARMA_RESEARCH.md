# Biopharma evidence research

_Current tool review: 20 August 2026._

Pharmaceutical valuation needs an auditable chain from a molecule and target to a trial, a readout, a regulatory path, commercial economics, and finally company value. Paper access is one part of that chain. A literature-only agent will miss protocol changes, unpublished failures, regulatory precedent, safety signals, manufacturing constraints, partner economics, and selective publication.

This workflow is for investment research, not medical advice or clinical decision-making.

## Recommended stack

| Layer | Preferred source | Interface | Repository status | Main use | Important boundary |
| --- | --- | --- | --- | --- | --- |
| AI/ML and computational preprints | [arXiv API](https://info.arxiv.org/help/api/) | API (Atom) | Implemented | Protein/molecule models, computational biology, bioinformatics, drug-discovery methods, and cutting-edge AI work | An arXiv record is a preprint evidence layer; a DOI or journal reference is a lead to verify, not proof of peer review |
| Biomedical literature | [Europe PMC REST API](https://europepmc.org/RestfulWebService) | API | Implemented | Metadata, abstracts, citations, identifiers, OA locations, article-level licence, JATS XML | Full text only when the record is in the OA subset and the licence permits the intended use |
| Trial protocols and results | [ClinicalTrials.gov API v2](https://clinicaltrials.gov/data-about-studies/learn-about-api) | API / OpenAPI | Implemented | Prespecified endpoints, arms, enrollment, status, results, documents, references | Registry content is submitted by sponsors or investigators and still needs verification |
| Target and mechanism | [Open Targets Platform MCP](https://platform-docs.opentargets.org/data-access/model-context-protocol) and [GraphQL API](https://platform-docs.opentargets.org/data-access/graphql-api) | Official MCP / API | Recommended complement | Target-disease evidence, genetics, safety, tractability, mechanisms, known drugs | Hosted MCP is experimental; follow material claims to underlying sources |
| Advanced NCBI retrieval | [Entrez Direct](https://www.ncbi.nlm.nih.gov/books/NBK179288/) | Official CLI | Recommended complement | PubMed/PMC/Gene/Protein search, links, related and citing records | NCBI rate and copyright rules apply; PubMed is not a full-text licence |
| Reusable PMC text mining | [PMC OA subset](https://pmc.ncbi.nlm.nih.gov/tools/openftlist/) and [BioC API](https://www.ncbi.nlm.nih.gov/research/bionlp/APIs/BioC-PMC/) | Dataset / API | Extension | Large-scale licensed text mining | Not every PMC article is reusable; inspect each licence and use approved retrieval services |
| DOI and OA resolution | [Crossref REST](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) and [Unpaywall](https://unpaywall.org/api/v2) | APIs | Extension | Resolve identifiers and find lawful repository/author copies | A free-to-read URL is not necessarily a redistribution licence |
| Broad scholarly graph | [OpenAlex](https://developers.openalex.org/api-reference/authentication) | API / snapshot | Optional | Citation graph, institutions, concepts, broad non-biomedical discovery | API is now freemium and key-based at scale; do not make it the required v1 dependency |
| Molecules and assays | [ChEMBL](https://www.ebi.ac.uk/chembl/api/data/docs) and [PubChem PUG](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) | APIs | Extension | Molecule resolution, mechanisms, assays, bioactivity, structures | In-vitro potency is not clinical validation |
| US regulatory | [openFDA](https://open.fda.gov/apis/drug/) and [Drugs@FDA](https://www.fda.gov/drugs/drug-approvals-and-databases/about-drugsfda) | API / public documents | Extension | Labels, approvals, submissions, adverse events, reviews, class precedent | Spontaneous reports are signals, not incidence or causality |
| Global trials | [WHO ICTRP](https://www.who.int/tools/clinical-trials-registry-platform) and source registries such as CTIS | Download / permitted service / public UI | Browser or future connector | Trials missing from ClinicalTrials.gov and cross-registry identifiers | WHO data has use conditions; prefer the originating registry for material evidence |
| Licensed interactive review | SciSpace or direct publisher/institutional access | Codex plugin or signed-in Chrome | Optional | Search assistance and analysis of content the user may lawfully process | Not a canonical source, not an evidence substitute, and never a circumvention layer |

## Repository CLI

The zero-key v1 wraps arXiv, Europe PMC, and ClinicalTrials.gov with normalized, provenance-rich JSON and local caching.

```bash
# Review interfaces and their access/rights status
npm run research:biomed -- sources

# Search papers and trials together
npm run --silent research:biomed -- landscape --query "intismeran melanoma" --json

# arXiv preprints, especially useful for AI/ML and computational drug discovery
npm run --silent research:biomed -- preprints search --query '"protein language model" drug discovery' --json
npm run --silent research:biomed -- preprints get 2501.12948 --json

# Literature discovery and exact records
npm run --silent research:biomed -- literature search --query "V940 pembrolizumab" --limit 20 --json
npm run --silent research:biomed -- literature search --query "V940 pembrolizumab" --open-access --json
npm run --silent research:biomed -- literature get 10.1200/jco-26-00835 --json

# Licence-gated full text; always saved under ignored .local/ storage
npm run --silent research:biomed -- literature fetch PMC13257369 --json

# Trial discovery and a detailed protocol/result record
npm run --silent research:biomed -- trials search --query "intismeran" --json
npm run --silent research:biomed -- trials get NCT05933577 --json
```

Europe PMC and ClinicalTrials.gov responses are cached for six hours under `.local/cache/biomed/`. arXiv responses are cached for 24 hours, and its connector uses one connection with at least three seconds between retries. Full-text XML and a source manifest go under `.local/captures/biomed/<PMCID>/`. Neither directory belongs in Git.

arXiv output is always labelled `evidenceState: "preprint"` and `peerReview.verified: false`. A journal reference or DOI changes the status to `linked-publication-not-verified`; follow that link to the journal or a trusted index before upgrading the evidence class. The CLI retrieves CC0 descriptive metadata and links only—it does not bulk-download e-prints, whose copyright and licence remain article-specific.

The full-text command deliberately blocks:

- records that Europe PMC does not mark open access;
- records without a machine-readable reuse licence;
- non-commercial licences unless the caller explicitly confirms a qualifying use with `--allow-noncommercial`.

That last decision is conservative because investment research can have a commercial purpose. A user having read access does not automatically grant automated reuse or redistribution rights.

## Why not a Sci-Hub CLI

A Sci-Hub client would depend on copyright infringement, unstable domains, access-control evasion, and an unverifiable chain of custody. It would be brittle research infrastructure and cannot be part of this public repository.

For a paywalled DOI, use this resolution order:

1. DOI and metadata from Crossref, Europe PMC, or PubMed;
2. article-level OA locations from Europe PMC or Unpaywall;
3. PMC/Europe PMC author manuscript or preprint, clearly labelled as a different version;
4. the user's direct publisher or institutional access when its terms permit agent processing;
5. library document delivery, interlibrary loan, or a request to the author;
6. metadata/abstract-only analysis with the missing full text disclosed.

Old analyst reports, proprietary databases, and subscriber articles remain link-only or licensed-local-only. A stale report can be useful for reconstructing old expectations, but it must not be copied into Git or treated as current evidence.

## Evidence workflow

### 1. Resolve identity before search

Create an identity map for:

- company and subsidiaries;
- internal code name, INN/generic name, brand name, formulation, and combination partner;
- target gene/protein IDs, pathway, modality, and mechanism;
- sponsor protocol ID, NCT ID, other registry IDs, and relevant DOI/PMID/PMCID values.

Name collisions are common. Never join records on a drug name alone when a stable identifier is available.

### 2. Audit the protocol before the readout

Record the original and current:

- population and line of therapy;
- arms, comparator, background therapy, dosing, masking, and crossover;
- primary and key secondary endpoints, estimand, analysis population, timepoint, and multiplicity;
- enrollment or event target, power assumptions, interim looks, and completion dates;
- status, outcome, eligibility, and statistical-analysis changes.

Registry history can reveal endpoint switching, timing slippage, enrollment changes, and selective reporting. A current snapshot alone is insufficient for high-stakes work; version comparison is a priority extension.

### 3. Grade the biological and translational chain

Keep distinct:

1. target-disease association;
2. causal human genetics or natural experiments;
3. tissue/cell expression and disease-state relevance;
4. tool-compound or genetic perturbation evidence;
5. animal-model relevance;
6. human pharmacokinetics and target engagement;
7. pharmacodynamic response;
8. clinical efficacy and safety.

Citation count, an Open Targets association score, and multiple papers reusing the same model are not independent replications.

### 4. Interpret the clinical evidence

Extract effect size and uncertainty, not only p-values or “endpoint met.” Check control performance, missing data, censoring, discontinuations, multiplicity, subgroup consistency, endpoint maturity, clinical relevance, and concordance across endpoints.

Classify each claim by evidence state:

- sponsor top-line disclosure;
- registry-posted result;
- conference abstract/poster;
- preprint;
- peer-reviewed paper;
- regulator or HTA assessment.

### 5. Build a probability tree

Estimate separately:

- mechanism/target validity;
- technical success in the current trial;
- approval conditional on the data;
- launch and reimbursement;
- manufacturing and commercial execution;
- net economics attributable to the listed company.

Start from a phase/indication/modality base rate, then make explicit evidence adjustments. Do not double-count correlated signals such as a paper, a conference abstract, and a company release describing the same trial. Use ranges when base-rate data or independence assumptions are weak.

### 6. Connect evidence to valuation

For each asset and scenario, model:

- addressable, eligible, diagnosed, and treated patients;
- penetration, price, gross-to-net, duration, adherence, and geographic rollout;
- probability and timing of trial, filing, approval, and launch milestones;
- partner economics, royalties, milestones, manufacturing cost, R&D and selling expense;
- patent/exclusivity period, competition, dilution, tax, and discount rate.

Use expected value as one lens, not a substitute for scenario analysis. Show how much of the share price depends on each asset and which evidence would move the probability or commercial assumptions.

## MCP and skill architecture

Use the repository skill `$biopharma-evidence-research` to orchestrate the workflow. Keep deterministic retrieval, caching, identifier validation, licence gates, and source manifests in the CLI. Let the agent handle query expansion, evidence comparison, contradiction search, trial interpretation, and probability scenarios.

The [official Open Targets MCP](https://github.com/opentargets/platform-mcp) is the first MCP to add. Prefer its hosted endpoint for a quick trial and a pinned local deployment for reproducibility if hosted initialization or global rate limits prove unreliable. The repository should not adopt an unmaintained PubMed MCP merely to wrap stable NCBI APIs; the local skill plus CLI gives tighter rights, provenance, and output control.

## Roadmap

1. Add exact DOI/PMID/PMCID resolution with Crossref and Unpaywall fallback.
2. Add Open Targets MCP configuration and a tested candidate → target → disease evidence query.
3. Add openFDA/Drugs@FDA commands for labels, applications, regulatory reviews, and class safety.
4. Add ChEMBL/PubChem identifier and assay commands.
5. Store ClinicalTrials.gov version snapshots and generate protocol-change diffs.
6. Add FDA, EMA/CTIS, and public HTA browser routes for documents without stable APIs.
7. Build a prospectively versioned trial-outcome dataset for calibrated phase/indication/modality base rates.
8. Add evidence-pack JSON schemas and evaluators for citation completeness, source independence, and double-counting.
9. Cross-link arXiv records to verified published versions through DOI/Crossref and retain both version histories.

Do not add more sources merely because they are available. Add a connector when it improves evidence coverage, provenance, reproducibility, or calibration enough to justify another failure mode.
