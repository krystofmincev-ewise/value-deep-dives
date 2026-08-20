---
name: biopharma-evidence-research
description: "Build source-grounded evidence packs for pharmaceutical and biotechnology valuation by tracing a drug candidate across targets, mechanisms, papers, clinical-trial protocols/results, regulatory records, and sponsor disclosures. Use for pharma or biotech company research, probability-of-success assessment, trial readout preparation, drug-pipeline diligence, target validation, or post-readout review."
---

# Biopharma Evidence Research

Assess a candidate from primary evidence outward. Separate biological plausibility, clinical execution, regulatory probability, commercial value, and valuation impact instead of collapsing them into one confidence score.

## Establish scope

Read `DATA_POLICY.md`, `methodology/RESEARCH_STANDARDS.md`, `methodology/RESEARCH_TOOLING.md`, and `methodology/BIOPHARMA_RESEARCH.md` before retrieval.

Record:

- company, ticker, candidate names and aliases;
- target, mechanism, modality, indication, line of therapy, and combination partner;
- trial identifiers, development phase, expected readout, and information cutoff;
- the decision being informed and the claims that would change it.

If aliases or identifiers are uncertain, resolve them before broad search. Keep the company code name, generic name, brand name, ChEMBL ID, target ID, and NCT ID distinct.

## Build the public evidence landscape

Start with the repository CLI:

```bash
npm run --silent research:biomed -- landscape --query "candidate indication" --json
npm run --silent research:biomed -- preprints search --query '"method or model" indication' --json
npm run --silent research:biomed -- literature search --query "candidate OR code-name" --json
npm run --silent research:biomed -- trials search --query "candidate OR sponsor-protocol-id" --json
```

Use `preprints get` for an exact arXiv identifier, `literature get` for an exact PMCID, PMID, or DOI, and `trials get` for an exact NCT ID. Preserve the returned source version, ClinicalTrials.gov data timestamp, canonical links, OA status, and article licence.

Use arXiv for AI/ML, computational biology, bioinformatics, protein or molecule models, and early methods work that may precede biomedical indexing. Keep every arXiv result in the preprint evidence class. A DOI, journal reference, conference comment, or acceptance claim is a discovery lead; verify the published record independently before treating it as peer reviewed.

Use `literature fetch <PMCID>` only when full text is necessary. The CLI stores JATS XML and a manifest under ignored `.local/` storage and blocks non-OA or unknown-licence content. Do not pass `--allow-noncommercial` unless the intended use clearly qualifies.

## Trace target and mechanism evidence

Prefer the official Open Targets MCP when it is configured. Use its entity search before GraphQL queries, inspect the focused schema, then query the smallest set of fields needed. Treat Open Targets as an evidence index: follow material genetics, safety, tractability, disease-association, and known-drug claims to their underlying sources.

Use ChEMBL and PubChem for molecule, bioactivity, assay, and identifier questions. Distinguish binding or in-vitro potency from target engagement, pharmacodynamic effect, and clinical efficacy.

## Audit the trial before reading the conclusion

Compare registry versions and capture:

- population, setting, inclusion/exclusion criteria, and geographic mix;
- randomized arms, comparator, dosing, background therapy, masking, and crossover;
- primary and key secondary endpoints, estimand, timepoint, analysis population, and multiplicity;
- enrollment, event target, power assumptions, interim analyses, and censoring when disclosed;
- protocol changes, status changes, completion dates, results-posting lag, and missing data;
- efficacy magnitude and uncertainty, safety, discontinuations, subgroup consistency, and clinical relevance.

Do not equate “met endpoint” with approval, commercial success, or adequate value creation. Separate sponsor-reported top-line results from posted registry results, conference data, peer-reviewed publications, and regulator analysis.

## Add regulatory and sponsor evidence

Check FDA, openFDA, Drugs@FDA approval packages, labels, advisory-committee materials, safety communications, and relevant EMA EPAR/CTIS records. Use regulator reviews for prior drugs in the class when they illuminate endpoint precedent, safety, pharmacology, or manufacturing risk.

Cross-check company releases against the registry and source documents. Record what was not disclosed. Treat FAERS and spontaneous-report data as signal detection, never incidence or causal proof.

## Assess probability and valuation impact

Produce separate, explicitly reasoned estimates for:

1. target/mechanism validity;
2. technical success in the current trial;
3. regulatory approval conditional on the observed data;
4. launch, adoption, reimbursement, and manufacturing execution;
5. net economic value to the company after partner splits, dilution, spend, and timing.

State the historical base rate used, then list evidence-based adjustments without double-counting correlated signals. Give a range or scenarios when calibration data is weak. Pre-register material forecasts before a readout and never backfill a prospective call.

## Write the evidence pack

Return:

- identity map and information cutoff;
- development timeline and upcoming catalysts;
- trial-design audit and endpoint interpretation;
- target/mechanism, translational, clinical, safety, regulatory, and commercial evidence;
- strongest confirming and disconfirming evidence;
- conflicts, missing data, protocol changes, and source limitations;
- probability tree with base rates, adjustments, ranges, and sensitivity cases;
- valuation bridge and explicit falsifiers;
- claim-level source log entries using the repository schema.

Label abstracts, preprints, sponsor disclosures, registry records, and peer-reviewed papers distinctly. An LLM summary, Open Targets score, citation count, or market reaction is not primary evidence.

## Rights and access boundary

Do not use Sci-Hub, pirate mirrors, credential sharing, hidden endpoints, or access-control circumvention. Do not automate publisher pages when a documented API or permitted OA copy exists. Use SciSpace or a signed-in publisher UI only for content the user is authorized to process, keep restricted captures local-only, and commit citations plus original analysis rather than copied text.
