# Wix valuation verification

Run from the repository root:

```bash
node companies/wix/valuation/verify-2026-W35-distribution.mjs
npm run research:company -- validate companies/wix
```

The model is a deterministic, uncalibrated shadow model. It triangulates a recurring-revenue/transaction/Base44 enterprise-value sum of parts, an owner-FCFF enterprise-value multiple, and a five-year FCFF DCF. Its AI regimes are structured judgments, not measured probabilities.
