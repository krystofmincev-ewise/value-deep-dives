#!/usr/bin/env node

const REFERENCE_PRICE = 87.62;
const SAMPLE_COUNT = 100000;
const SEED = 20260830;

const CAUSAL_NODE_PROBABILITIES = Object.freeze({
  coreHealth: Object.freeze({ weak: 0.26, stable: 0.52, strong: 0.22 }),
  base44Adoption: Object.freeze({ weak: 0.29, progress: 0.51, breakout: 0.2 }),
  base44Economics: Object.freeze({ weak: 0.35, adequate: 0.49, strong: 0.16 }),
  agentAttachment: Object.freeze({ adverse: 0.32, neutral: 0.51, platform: 0.17 }),
});

const DEFAULT_DEPENDENCY_LOADINGS = Object.freeze({
  adoptionAgentLoading: 0.42,
  adoptionFrontierLoading: 0.1,
  coreAgentLoading: 0.28,
  coreFrontierLoading: -0.12,
  economicsAdoptionLoading: 0.22,
  economicsFrontierLoading: 0.12,
});

const CORE_HEALTH_PARAMETERS = Object.freeze({
  weak: Object.freeze({ growth: -0.01, multiple: 1.55 }),
  stable: Object.freeze({ growth: 0.065, multiple: 2.45 }),
  strong: Object.freeze({ growth: 0.095, multiple: 3.25 }),
});

const BASE44_ADOPTION_PARAMETERS = Object.freeze({
  weak: Object.freeze({ growth: 0.15, multiple: 3.25 }),
  progress: Object.freeze({ growth: 0.55, multiple: 7 }),
  breakout: Object.freeze({ growth: 0.95, multiple: 11 }),
});

const BASE44_ECONOMICS_PARAMETERS = Object.freeze({
  weak: Object.freeze({ grossMargin: 0.5, postGrossProfitOwnerCostLoad: 0.9, multipleAdjustment: -1.4 }),
  adequate: Object.freeze({ grossMargin: 0.6, postGrossProfitOwnerCostLoad: 0.78, multipleAdjustment: 0 }),
  strong: Object.freeze({ grossMargin: 0.7, postGrossProfitOwnerCostLoad: 0.62, multipleAdjustment: 1.4 }),
});

const AGENT_ATTACHMENT_PARAMETERS = Object.freeze({
  adverse: Object.freeze({
    newFunnelGrowthAdjustment: -0.02,
    transactionGrowthAdjustment: -0.025,
    attachmentMultipleAdjustment: -0.25,
    transactionMultipleAdjustment: -0.15,
  }),
  neutral: Object.freeze({
    newFunnelGrowthAdjustment: 0,
    transactionGrowthAdjustment: 0,
    attachmentMultipleAdjustment: 0,
    transactionMultipleAdjustment: 0,
  }),
  platform: Object.freeze({
    newFunnelGrowthAdjustment: 0.018,
    transactionGrowthAdjustment: 0.03,
    attachmentMultipleAdjustment: 0.3,
    transactionMultipleAdjustment: 0.18,
  }),
});

const DEFAULT_STRESSES = Object.freeze({
  coreGrowth: 0,
  coreMultiple: 0,
  base44Growth: 0,
  base44Multiple: 0,
  base44CostLoad: 0,
  netClaims: 0,
  dilutedShares: 0,
});

const STRESS_BOUNDS = Object.freeze({
  coreGrowth: 0.05,
  coreMultiple: 1,
  base44Growth: 0.5,
  base44Multiple: 4,
  base44CostLoad: 0.2,
  netClaims: 0.25,
  dilutedShares: 5,
});

// Approximately 2026 raw FCF placeholder ($350m), less a $110m economic charge
// for future award vintages that are not added to the target-date denominator,
// plus $30m normalized after-tax interest. The 45.989m starting denominator
// already includes the currently granted unvested RSU/PSU pool and an option /
// ESPP buffer; it is therefore held flat rather than charging those awards twice.
const CURRENT_NORMALIZED_OWNER_FCFF = 270;
const NORMALIZED_AFTER_TAX_INTEREST = 30;
const STARTING_DILUTED_SHARES = 45.989;
const STARTING_NET_CLAIMS = 0.78;

function mulberry32(seed) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random) {
  const first = Math.max(random(), Number.EPSILON);
  const second = random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function clamp(value, lower, upper) {
  return Math.max(lower, Math.min(upper, value));
}

function quantile(sorted, probability) {
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
}

function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function variance(values, expected = mean(values)) {
  return values.reduce((total, value) => total + (value - expected) ** 2, 0) / values.length;
}

function sortedSummary(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return {
    p10: quantile(sorted, 0.1),
    p50: quantile(sorted, 0.5),
    p90: quantile(sorted, 0.9),
    mean: mean(values),
  };
}

function probabilitySum(probabilities) {
  return Object.values(probabilities).reduce((total, probability) => total + probability, 0);
}

function ordinalState(latent, probabilities) {
  const entries = Object.entries(probabilities);
  let cumulative = 0;
  // Convert the latent normal to a uniform percentile without needing an
  // inverse-CDF approximation. The error-function approximation is more than
  // precise enough for state assignment and is deterministic.
  const sign = latent < 0 ? -1 : 1;
  const absolute = Math.abs(latent) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * absolute);
  const erf = sign * (1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-(absolute ** 2)));
  const percentile = 0.5 * (1 + erf);
  for (const [state, probability] of entries) {
    cumulative += probability;
    if (percentile <= cumulative + Number.EPSILON) return state;
  }
  return entries.at(-1)[0];
}

function validateCausalProbabilities(causalProbabilities) {
  if (!causalProbabilities || typeof causalProbabilities !== "object" || Array.isArray(causalProbabilities)) {
    throw new Error("causalProbabilities must be an object");
  }
  const expectedNodes = Object.keys(CAUSAL_NODE_PROBABILITIES).sort();
  const actualNodes = Object.keys(causalProbabilities).sort();
  if (actualNodes.length !== expectedNodes.length || actualNodes.some((node, index) => node !== expectedNodes[index])) {
    throw new Error(`causalProbabilities must contain exactly ${expectedNodes.join(", ")}`);
  }
  for (const node of expectedNodes) {
    const probabilities = causalProbabilities[node];
    if (!probabilities || typeof probabilities !== "object" || Array.isArray(probabilities)) {
      throw new Error(`causalProbabilities.${node} must be an object`);
    }
    const expectedStates = Object.keys(CAUSAL_NODE_PROBABILITIES[node]).sort();
    const actualStates = Object.keys(probabilities).sort();
    if (actualStates.length !== expectedStates.length || actualStates.some((state, index) => state !== expectedStates[index])) {
      throw new Error(`causalProbabilities.${node} must contain exactly ${expectedStates.join(", ")}`);
    }
    if (Math.abs(probabilitySum(probabilities) - 1) > 1e-12) {
      throw new Error(`${node} causal-node probabilities must sum to one`);
    }
    if (Object.values(probabilities).some((probability) => !Number.isFinite(probability) || probability <= 0)) {
      throw new Error(`${node} causal-node probabilities must be finite and positive`);
    }
  }
}

function validateDependencyLoadings(dependencyLoadings) {
  const expectedKeys = Object.keys(DEFAULT_DEPENDENCY_LOADINGS).sort();
  const actualKeys = Object.keys(dependencyLoadings).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) {
    throw new Error(`dependencyLoadings must contain exactly ${expectedKeys.join(", ")}`);
  }
  for (const [field, value] of Object.entries(dependencyLoadings)) {
    if (!Number.isFinite(value) || Math.abs(value) > 0.8) {
      throw new Error(`dependencyLoadings.${field} must be finite and between -0.8 and 0.8`);
    }
  }
  const adoptionResidualVariance =
    1 - dependencyLoadings.adoptionAgentLoading ** 2 - dependencyLoadings.adoptionFrontierLoading ** 2;
  const coreResidualVariance =
    1 - dependencyLoadings.coreAgentLoading ** 2 - dependencyLoadings.coreFrontierLoading ** 2;
  const economicsExplainedVariance =
    dependencyLoadings.economicsAdoptionLoading ** 2 +
    dependencyLoadings.economicsFrontierLoading ** 2 +
    2 * dependencyLoadings.economicsAdoptionLoading * dependencyLoadings.economicsFrontierLoading *
      dependencyLoadings.adoptionFrontierLoading;
  if (adoptionResidualVariance < 0 || coreResidualVariance < 0 || economicsExplainedVariance > 1) {
    throw new Error("dependencyLoadings must leave non-negative residual variance");
  }
}

function sampleCausalNodes(random, causalProbabilities, dependencyLoadings) {
  const frontierCapability = normal(random);
  const agentIndependent = normal(random);
  const adoptionIndependent = normal(random);
  const coreIndependent = normal(random);
  const economicsIndependent = normal(random);

  const agentLatent = agentIndependent;
  const { adoptionAgentLoading, adoptionFrontierLoading } = dependencyLoadings;
  const adoptionLatent =
    adoptionAgentLoading * agentLatent +
    adoptionFrontierLoading * frontierCapability +
    Math.sqrt(1 - adoptionAgentLoading ** 2 - adoptionFrontierLoading ** 2) *
      adoptionIndependent;

  const { coreAgentLoading, coreFrontierLoading } = dependencyLoadings;
  const coreLatent =
    coreAgentLoading * agentLatent +
    coreFrontierLoading * frontierCapability +
    Math.sqrt(1 - coreAgentLoading ** 2 - coreFrontierLoading ** 2) * coreIndependent;

  // Adoption already has a 0.10 loading on frontier capability. Include the
  // covariance term so the economics latent remains standard normal.
  const { economicsAdoptionLoading, economicsFrontierLoading } = dependencyLoadings;
  const adoptionFrontierCorrelation = adoptionFrontierLoading;
  const economicsExplainedVariance =
    economicsAdoptionLoading ** 2 +
    economicsFrontierLoading ** 2 +
    2 * economicsAdoptionLoading * economicsFrontierLoading * adoptionFrontierCorrelation;
  const economicsLatent =
    economicsAdoptionLoading * adoptionLatent +
    economicsFrontierLoading * frontierCapability +
    Math.sqrt(1 - economicsExplainedVariance) * economicsIndependent;

  return {
    states: {
      coreHealth: ordinalState(coreLatent, causalProbabilities.coreHealth),
      base44Adoption: ordinalState(adoptionLatent, causalProbabilities.base44Adoption),
      base44Economics: ordinalState(economicsLatent, causalProbabilities.base44Economics),
      agentAttachment: ordinalState(agentLatent, causalProbabilities.agentAttachment),
    },
    frontierCapability,
  };
}

export function enterpriseValuePerShare(enterpriseValue, netClaims, baseShares) {
  let adjustedEquityValue = enterpriseValue - netClaims;
  let adjustedShares = baseShares;
  let preliminaryValue = adjustedEquityValue / adjustedShares;

  // Above the $210.49 note strike, remove the $1.15bn principal from the
  // enterprise-to-equity bridge and add 5.464m conversion shares. The capped-
  // call benefit to $267.89 is intentionally omitted from formal value.
  if (preliminaryValue > 210.49) {
    adjustedEquityValue += 1150;
    adjustedShares += 5.464;
    preliminaryValue = adjustedEquityValue / adjustedShares;
  }

  // Treasury-stock treatment for the approximately 0.817m initial private-
  // placement warrant shares. The filing reserves up to 1.083m shares after
  // adjustment/make-whole capacity; that higher legal reserve is disclosed but
  // is not assumed issued in the formal distribution.
  if (preliminaryValue > 104.73) {
    adjustedShares += 0.817 * (1 - 104.73 / preliminaryValue);
  }
  return adjustedEquityValue / adjustedShares;
}

function pearson(first, second) {
  const firstMean = mean(first);
  const secondMean = mean(second);
  let covariance = 0;
  let firstVariance = 0;
  let secondVariance = 0;
  for (let index = 0; index < first.length; index += 1) {
    const firstDelta = first[index] - firstMean;
    const secondDelta = second[index] - secondMean;
    covariance += firstDelta * secondDelta;
    firstVariance += firstDelta ** 2;
    secondVariance += secondDelta ** 2;
  }
  const denominator = Math.sqrt(firstVariance * secondVariance);
  return denominator === 0 ? 0 : covariance / denominator;
}

function stateScore(node, state, causalProbabilities) {
  return Object.keys(causalProbabilities[node]).indexOf(state);
}

export function computeBase44OwnerContribution({ arrBn, grossMargin, postGrossProfitOwnerCostLoad }) {
  return arrBn * 1000 * grossMargin * (1 - postGrossProfitOwnerCostLoad);
}

export function computeEndingNetClaims({
  startingNetClaims,
  cumulativeOwnerFcfe,
  balanceSheetRetentionRate,
  incrementalBase44ArrMillions,
  earnoutParticipation,
  minimumNetClaims = 0.5,
  maximumNetClaims = 0.95,
}) {
  const retainedCashOrDebtPaydown = cumulativeOwnerFcfe * balanceSheetRetentionRate;
  const earnoutIncrease = incrementalBase44ArrMillions * earnoutParticipation;
  return {
    retainedCashOrDebtPaydown,
    earnoutIncrease,
    endingNetClaims: clamp(
      startingNetClaims - retainedCashOrDebtPaydown / 1000 + earnoutIncrease / 1000,
      minimumNetClaims,
      maximumNetClaims,
    ),
  };
}

function sampleCapitalPath({ random, stresses }) {
  const startingDilutedShares = clamp(
    STARTING_DILUTED_SHARES + stresses.dilutedShares + 0.12 * normal(random),
    45.7 + stresses.dilutedShares,
    46.3 + stresses.dilutedShares,
  );
  const startingNetClaims = clamp(
    STARTING_NET_CLAIMS + stresses.netClaims + 0.035 * normal(random),
    0.68 + stresses.netClaims,
    0.88 + stresses.netClaims,
  );
  const balanceSheetRetentionRate = clamp(0.32 + 0.08 * normal(random), 0.12, 0.55);
  const earnoutParticipation = clamp(0.38 + 0.08 * normal(random), 0.18, 0.58);
  return {
    startingDilutedShares,
    startingNetClaims,
    balanceSheetRetentionRate,
    earnoutParticipation,
    minimumNetClaims: 0.5 + stresses.netClaims,
    maximumNetClaims: 0.95 + stresses.netClaims,
  };
}

function sampleHorizon({ random, causalStates, months, sharedFactors, horizonShocks, capitalPath, stresses }) {
  const coreParameters = CORE_HEALTH_PARAMETERS[causalStates.coreHealth];
  const adoptionParameters = BASE44_ADOPTION_PARAMETERS[causalStates.base44Adoption];
  const economicsParameters = BASE44_ECONOMICS_PARAMETERS[causalStates.base44Economics];
  const agentParameters = AGENT_ATTACHMENT_PARAMETERS[causalStates.agentAttachment];
  const years = months / 12;
  // The valuation reference date is 30 August 2026, while the latest audited-
  // perimeter core ARR observation is 30 June and Base44's public run-rate
  // anchor is approximately 31 May. Compound each metric from its own
  // measurement date so a four-month target-date checkpoint does not silently
  // treat those stale observations as August starting values.
  const coreYearsFromMeasurement = (months + 2) / 12;
  const base44YearsFromMeasurement = (months + 3) / 12;
  const coreQuality = 0.85 * sharedFactors.coreExecution + 0.53 * horizonShocks.core;
  const base44Quality = 0.85 * sharedFactors.base44ProductMarketFit + 0.53 * horizonShocks.base44;
  const unitEconomicsQuality = 0.85 * sharedFactors.unitEconomics + 0.53 * horizonShocks.unitEconomics;
  const marketRisk = 0.85 * sharedFactors.marketRisk + 0.53 * horizonShocks.marketRisk;

  // Frontier capability is deliberately two-sided: it improves Base44's build
  // capability while pressuring Wix's new-site funnel. The four causal nodes
  // replace the former bundled regime, so their effects are not layered on top
  // of another adoption/growth/multiple vote.
  const coreGrowth = clamp(
    coreParameters.growth + agentParameters.newFunnelGrowthAdjustment + stresses.coreGrowth +
      0.02 * coreQuality - 0.008 * sharedFactors.frontierCapability,
    -0.1,
    0.18,
  );
  const base44Growth = clamp(
    adoptionParameters.growth + stresses.base44Growth + 0.18 * base44Quality +
      0.08 * sharedFactors.frontierCapability,
    -0.3,
    1.7,
  );
  const transactionGrowth = clamp(
    0.04 + agentParameters.transactionGrowthAdjustment + 0.012 * coreQuality,
    -0.08,
    0.2,
  );
  const coreArr = 1.813 * (1 + coreGrowth) ** coreYearsFromMeasurement;
  const base44Arr = 0.15 * (1 + base44Growth) ** base44YearsFromMeasurement;
  const totalArr = coreArr + base44Arr;
  const transactionRevenue = 0.3 * (1 + transactionGrowth) ** years;

  const base44GrossMargin = clamp(
    economicsParameters.grossMargin + 0.035 * unitEconomicsQuality,
    0.35,
    0.8,
  );
  const base44PostGrossProfitOwnerCostLoad = clamp(
    economicsParameters.postGrossProfitOwnerCostLoad + stresses.base44CostLoad -
      0.035 * unitEconomicsQuality + 0.012 * base44Quality,
    0.5,
    0.98,
  );
  const base44OwnerMargin = base44GrossMargin * (1 - base44PostGrossProfitOwnerCostLoad);
  const economicsCenterOwnerMargin =
    economicsParameters.grossMargin *
    (1 - economicsParameters.postGrossProfitOwnerCostLoad);

  const coreContinuousGrowthDelta =
    coreGrowth - coreParameters.growth - agentParameters.newFunnelGrowthAdjustment - stresses.coreGrowth;
  const base44ContinuousGrowthDelta = base44Growth - adoptionParameters.growth - stresses.base44Growth;
  const coreMultiple = clamp(
    coreParameters.multiple + agentParameters.attachmentMultipleAdjustment + stresses.coreMultiple +
      2.5 * coreContinuousGrowthDelta + 0.16 * coreQuality - 0.25 * marketRisk,
    0.7,
    4.8,
  );
  const base44Multiple = clamp(
    adoptionParameters.multiple + economicsParameters.multipleAdjustment + stresses.base44Multiple +
      1.5 * base44ContinuousGrowthDelta + 0.5 * base44Quality +
      12 * (base44OwnerMargin - economicsCenterOwnerMargin) - 0.6 * marketRisk,
    1,
    15,
  );
  const transactionMultiple = clamp(
    1 + agentParameters.transactionMultipleAdjustment + 0.08 * coreQuality - 0.15 * marketRisk,
    0.35,
    1.75,
  );

  const futureAwardEconomicCharge = clamp(110 + 8 * unitEconomicsQuality, 90, 130);
  const targetCoreRawFcfeBeforeFutureAwards = clamp(
    359 + 900 * (coreGrowth - 0.065) + 26 * unitEconomicsQuality + 8 * normal(random),
    230,
    475,
  );
  const targetCoreOwnerFcff = clamp(
    targetCoreRawFcfeBeforeFutureAwards - futureAwardEconomicCharge + NORMALIZED_AFTER_TAX_INTEREST,
    155,
    380,
  );
  const targetBase44Contribution = computeBase44OwnerContribution({
    arrBn: base44Arr,
    grossMargin: base44GrossMargin,
    postGrossProfitOwnerCostLoad: base44PostGrossProfitOwnerCostLoad,
  });
  const targetOwnerFcff = targetCoreOwnerFcff + targetBase44Contribution;
  const interpolationWeight = clamp(years, 0, 1);
  const ownerFcff = clamp(
    CURRENT_NORMALIZED_OWNER_FCFF * (1 - interpolationWeight) +
      targetOwnerFcff * interpolationWeight + 8 * normal(random),
    70,
    550,
  );

  const cumulativeOwnerCash =
    ((CURRENT_NORMALIZED_OWNER_FCFF - NORMALIZED_AFTER_TAX_INTEREST +
      ownerFcff - NORMALIZED_AFTER_TAX_INTEREST) / 2) * years;
  const incrementalBase44Arr = Math.max(0, base44Arr - 0.15) * 1000;
  const capitalBridge = computeEndingNetClaims({
    startingNetClaims: capitalPath.startingNetClaims,
    cumulativeOwnerFcfe: cumulativeOwnerCash,
    balanceSheetRetentionRate: capitalPath.balanceSheetRetentionRate,
    incrementalBase44ArrMillions: incrementalBase44Arr,
    earnoutParticipation: capitalPath.earnoutParticipation,
    minimumNetClaims: capitalPath.minimumNetClaims,
    maximumNetClaims: capitalPath.maximumNetClaims,
  });
  const { retainedCashOrDebtPaydown, earnoutIncrease, endingNetClaims: netClaims } = capitalBridge;
  const dilutedShares = capitalPath.startingDilutedShares;

  const coreEnterpriseValue = coreArr * coreMultiple;
  const base44EnterpriseValue = base44Arr * base44Multiple;
  const transactionEnterpriseValue = transactionRevenue * transactionMultiple;
  const sotpEnterpriseValue = coreEnterpriseValue + base44EnterpriseValue + transactionEnterpriseValue;
  const sotp = Math.max(
    0,
    enterpriseValuePerShare(sotpEnterpriseValue * 1000, netClaims * 1000, dilutedShares),
  );

  const fcffMultiple = clamp(
    19 + 18 * (coreGrowth - 0.065) + 1.3 * base44Quality - 1.2 * marketRisk,
    12,
    26,
  );
  const ownerFcffMultiple = Math.max(
    0,
    enterpriseValuePerShare(ownerFcff * fcffMultiple, netClaims * 1000, dilutedShares),
  );

  const wacc = clamp(0.11 + 0.005 * marketRisk + 0.002 * normal(random), 0.095, 0.125);
  const terminalGrowth = clamp(
    0.027 + 0.015 * (coreGrowth - 0.065) + 0.0015 * normal(random),
    0.018,
    0.035,
  );
  const forecastGrowth = clamp(
    0.06 + 0.35 * (coreGrowth - 0.065) + 0.025 * base44Quality,
    -0.02,
    0.14,
  );
  const marginGrowth = clamp(0.015 + 0.01 * unitEconomicsQuality, -0.005, 0.04);
  let dcfEnterpriseValue = 0;
  let forecastFcf = ownerFcff;
  for (let year = 1; year <= 5; year += 1) {
    forecastFcf *= 1 + clamp(forecastGrowth + marginGrowth * (1 - year / 6), -0.05, 0.2);
    dcfEnterpriseValue += forecastFcf / (1 + wacc) ** year;
  }
  const terminalValue = forecastFcf * (1 + terminalGrowth) / (wacc - terminalGrowth);
  dcfEnterpriseValue += terminalValue / (1 + wacc) ** 5;
  const dcf = Math.max(
    0,
    enterpriseValuePerShare(dcfEnterpriseValue, netClaims * 1000, dilutedShares),
  );

  return {
    value: sotp,
    methods: { sotp, ownerFcffMultiple, dcf },
    drivers: {
      coreGrowth,
      base44Growth,
      transactionGrowth,
      coreArr,
      base44Arr,
      totalArr,
      transactionRevenue,
      base44GrossMargin,
      base44PostGrossProfitOwnerCostLoad,
      base44OwnerMargin,
      coreMultiple,
      base44Multiple,
      transactionMultiple,
      coreEnterpriseValue,
      base44EnterpriseValue,
      transactionEnterpriseValue,
      targetBase44Contribution,
      base44ContributionIdentityError:
        targetBase44Contribution -
        base44Arr * 1000 * base44GrossMargin * (1 - base44PostGrossProfitOwnerCostLoad),
      futureAwardEconomicCharge,
      targetCoreRawFcfeBeforeFutureAwards,
      targetCoreOwnerFcff,
      ownerFcff,
      cumulativeOwnerCash,
      retainedCashOrDebtPaydown,
      earnoutIncrease,
      capitalIdentityError:
        netClaims - computeEndingNetClaims({
          startingNetClaims: capitalPath.startingNetClaims,
          cumulativeOwnerFcfe: cumulativeOwnerCash,
          balanceSheetRetentionRate: capitalPath.balanceSheetRetentionRate,
          incrementalBase44ArrMillions: incrementalBase44Arr,
          earnoutParticipation: capitalPath.earnoutParticipation,
          minimumNetClaims: capitalPath.minimumNetClaims,
          maximumNetClaims: capitalPath.maximumNetClaims,
        }).endingNetClaims,
      dilutedShares,
      netClaims,
    },
  };
}

function correlatedHorizonShocks(source, correlation, random) {
  return Object.fromEntries(
    Object.entries(source).map(([factor, shock]) => [
      factor,
      correlation * shock + Math.sqrt(1 - correlation ** 2) * normal(random),
    ]),
  );
}

function summarizeFairValue(values) {
  const summary = sortedSummary(values);
  const sorted = [...values].sort((left, right) => left - right);
  const bottomDecile = sorted.slice(0, Math.max(1, Math.floor(sorted.length * 0.1)));
  return {
    ...summary,
    probability_below_reference: values.filter((value) => value < REFERENCE_PRICE).length / values.length,
    probability_loss_30_pct: values.filter((value) => value < REFERENCE_PRICE * 0.7).length / values.length,
    probability_loss_50_pct: values.filter((value) => value < REFERENCE_PRICE * 0.5).length / values.length,
    bottom_decile_mean: mean(bottomDecile),
  };
}

function summarizeDrivers(drivers) {
  const fields = [
    "coreGrowth", "base44Growth", "transactionGrowth", "coreArr", "base44Arr", "totalArr",
    "transactionRevenue", "base44GrossMargin", "base44PostGrossProfitOwnerCostLoad",
    "base44OwnerMargin", "coreMultiple", "base44Multiple", "transactionMultiple",
    "coreEnterpriseValue", "base44EnterpriseValue", "transactionEnterpriseValue",
    "targetBase44Contribution", "base44ContributionIdentityError", "futureAwardEconomicCharge",
    "targetCoreRawFcfeBeforeFutureAwards", "targetCoreOwnerFcff", "ownerFcff",
    "cumulativeOwnerCash", "retainedCashOrDebtPaydown", "earnoutIncrease", "capitalIdentityError",
    "dilutedShares", "netClaims",
  ];
  return Object.fromEntries(fields.map((field) => [field, mean(drivers.map((driver) => driver[field]))]));
}

function varianceDecomposition(groups, allValues) {
  const overallMean = mean(allValues);
  const totalVariance = variance(allValues, overallMean);
  let betweenGroupVariance = 0;
  let withinGroupVariance = 0;
  const groupStatistics = {};
  for (const [label, values] of Object.entries(groups)) {
    if (values.length === 0) continue;
    const groupMean = mean(values);
    const groupVariance = variance(values, groupMean);
    const weight = values.length / allValues.length;
    betweenGroupVariance += weight * (groupMean - overallMean) ** 2;
    withinGroupVariance += weight * groupVariance;
    groupStatistics[label] = { sample_probability: weight, mean: groupMean, variance: groupVariance };
  }
  return {
    total_variance: totalVariance,
    between_group_variance: betweenGroupVariance,
    within_group_variance: withinGroupVariance,
    between_group_share: totalVariance === 0 ? 0 : betweenGroupVariance / totalVariance,
    within_group_share: totalVariance === 0 ? 0 : withinGroupVariance / totalVariance,
    identity_error: totalVariance - betweenGroupVariance - withinGroupVariance,
    groups: groupStatistics,
  };
}

function operatingSummary(results) {
  return {
    months_from_reference: results.months,
    core_arr_bn: sortedSummary(results.coreArr),
    base44_arr_bn: sortedSummary(results.base44Arr),
    total_arr_bn: sortedSummary(results.totalArr),
    base44_gross_margin: sortedSummary(results.base44GrossMargin),
    owner_fcff_usd_m: sortedSummary(results.ownerFcff),
    net_claims_usd_bn: sortedSummary(results.netClaims),
  };
}

function validateStresses(stresses) {
  const expectedKeys = Object.keys(DEFAULT_STRESSES).sort();
  const actualKeys = Object.keys(stresses).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) {
    throw new Error(`stresses must contain exactly ${expectedKeys.join(", ")}`);
  }
  for (const [field, value] of Object.entries(stresses)) {
    if (!Number.isFinite(value) || Math.abs(value) > STRESS_BOUNDS[field]) {
      throw new Error(`stresses.${field} must be finite and between -${STRESS_BOUNDS[field]} and ${STRESS_BOUNDS[field]}`);
    }
  }
}

export function runModel({
  seed = SEED,
  sampleCount = SAMPLE_COUNT,
  causalProbabilities = CAUSAL_NODE_PROBABILITIES,
  dependencyLoadings: dependencyLoadingOverrides = {},
  stresses: stressOverrides = {},
  // Backward-compatible alias while the root verifier migrates to the common
  // stress object. It consumes no randomness, preserving common random numbers.
  base44CostLoadShift = 0,
} = {}) {
  validateCausalProbabilities(causalProbabilities);
  if (!dependencyLoadingOverrides || typeof dependencyLoadingOverrides !== "object" || Array.isArray(dependencyLoadingOverrides)) {
    throw new Error("dependencyLoadings must be an object");
  }
  const unknownDependencyKeys = Object.keys(dependencyLoadingOverrides).filter(
    (field) => !(field in DEFAULT_DEPENDENCY_LOADINGS),
  );
  if (unknownDependencyKeys.length > 0) {
    throw new Error(`Unknown dependency fields: ${unknownDependencyKeys.join(", ")}`);
  }
  const dependencyLoadings = { ...DEFAULT_DEPENDENCY_LOADINGS, ...dependencyLoadingOverrides };
  validateDependencyLoadings(dependencyLoadings);
  if (!Number.isInteger(sampleCount) || sampleCount < 10) {
    throw new Error("sampleCount must be an integer of at least 10");
  }
  if (!Number.isFinite(base44CostLoadShift) || Math.abs(base44CostLoadShift) > 0.2) {
    throw new Error("base44CostLoadShift must be finite and between -0.2 and 0.2");
  }
  if (!stressOverrides || typeof stressOverrides !== "object" || Array.isArray(stressOverrides)) {
    throw new Error("stresses must be an object");
  }
  const unknownStressKeys = Object.keys(stressOverrides).filter((field) => !(field in DEFAULT_STRESSES));
  if (unknownStressKeys.length > 0) throw new Error(`Unknown stress fields: ${unknownStressKeys.join(", ")}`);
  const stresses = {
    ...DEFAULT_STRESSES,
    ...stressOverrides,
    base44CostLoad: (stressOverrides.base44CostLoad ?? 0) + base44CostLoadShift,
  };
  validateStresses(stresses);

  const random = mulberry32(seed);
  const sixMonth = [];
  const twelveMonth = [];
  const sixMonthShares = [];
  const twelveMonthShares = [];
  const sixMonthNetClaims = [];
  const twelveMonthNetClaims = [];
  const methodValues = {
    sixMonth: { sotp: [], ownerFcffMultiple: [], dcf: [] },
    twelveMonth: { sotp: [], ownerFcffMultiple: [], dcf: [] },
  };
  const operatingPaths = {
    fourMonth: { months: 4, coreArr: [], base44Arr: [], totalArr: [], base44GrossMargin: [], ownerFcff: [], netClaims: [] },
    sixMonth: { months: 6, coreArr: [], base44Arr: [], totalArr: [], base44GrossMargin: [], ownerFcff: [], netClaims: [] },
    tenMonth: { months: 10, coreArr: [], base44Arr: [], totalArr: [], base44GrossMargin: [], ownerFcff: [], netClaims: [] },
    twelveMonth: { months: 12, coreArr: [], base44Arr: [], totalArr: [], base44GrossMargin: [], ownerFcff: [], netClaims: [] },
  };
  const conditionalPaths = Object.fromEntries(
    Object.entries(causalProbabilities).map(([node, probabilities]) => [
      node,
      Object.fromEntries(Object.keys(probabilities).map((state) => [state, { values: [], drivers: [] }])),
    ]),
  );
  const nodeCounts = Object.fromEntries(
    Object.entries(causalProbabilities).map(([node, probabilities]) => [
      node,
      Object.fromEntries(Object.keys(probabilities).map((state) => [state, 0])),
    ]),
  );
  const jointStateValues = {};
  const nodeScores = Object.fromEntries(Object.keys(causalProbabilities).map((node) => [node, []]));
  const frontierCapabilities = [];

  for (let draw = 0; draw < sampleCount; draw += 1) {
    const causalDraw = sampleCausalNodes(random, causalProbabilities, dependencyLoadings);
    const { states } = causalDraw;
    for (const [node, state] of Object.entries(states)) {
      nodeCounts[node][state] += 1;
      nodeScores[node].push(stateScore(node, state, causalProbabilities));
    }
    frontierCapabilities.push(causalDraw.frontierCapability);
    const sharedFactors = {
      frontierCapability: causalDraw.frontierCapability,
      coreExecution: normal(random),
      base44ProductMarketFit: normal(random),
      unitEconomics: normal(random),
      marketRisk: normal(random),
    };
    const capitalPath = sampleCapitalPath({ random, stresses });
    const sixShocks = {
      core: normal(random),
      base44: normal(random),
      unitEconomics: normal(random),
      marketRisk: normal(random),
    };
    const twelveShocks = correlatedHorizonShocks(sixShocks, 0.62, random);
    const fourShocks = correlatedHorizonShocks(sixShocks, 0.82, random);
    const tenShocks = correlatedHorizonShocks(twelveShocks, 0.82, random);
    const results = {
      fourMonth: sampleHorizon({ random, causalStates: states, months: 4, sharedFactors, horizonShocks: fourShocks, capitalPath, stresses }),
      sixMonth: sampleHorizon({ random, causalStates: states, months: 6, sharedFactors, horizonShocks: sixShocks, capitalPath, stresses }),
      tenMonth: sampleHorizon({ random, causalStates: states, months: 10, sharedFactors, horizonShocks: tenShocks, capitalPath, stresses }),
      twelveMonth: sampleHorizon({ random, causalStates: states, months: 12, sharedFactors, horizonShocks: twelveShocks, capitalPath, stresses }),
    };

    sixMonth.push(results.sixMonth.value);
    twelveMonth.push(results.twelveMonth.value);
    sixMonthShares.push(results.sixMonth.drivers.dilutedShares);
    twelveMonthShares.push(results.twelveMonth.drivers.dilutedShares);
    sixMonthNetClaims.push(results.sixMonth.drivers.netClaims);
    twelveMonthNetClaims.push(results.twelveMonth.drivers.netClaims);
    for (const method of ["sotp", "ownerFcffMultiple", "dcf"]) {
      methodValues.sixMonth[method].push(results.sixMonth.methods[method]);
      methodValues.twelveMonth[method].push(results.twelveMonth.methods[method]);
    }
    for (const [horizon, result] of Object.entries(results)) {
      operatingPaths[horizon].coreArr.push(result.drivers.coreArr);
      operatingPaths[horizon].base44Arr.push(result.drivers.base44Arr);
      operatingPaths[horizon].totalArr.push(result.drivers.totalArr);
      operatingPaths[horizon].base44GrossMargin.push(result.drivers.base44GrossMargin);
      operatingPaths[horizon].ownerFcff.push(result.drivers.ownerFcff);
      operatingPaths[horizon].netClaims.push(result.drivers.netClaims);
    }
    for (const [node, state] of Object.entries(states)) {
      conditionalPaths[node][state].values.push(results.twelveMonth.value);
      conditionalPaths[node][state].drivers.push(results.twelveMonth.drivers);
    }
    const jointStateKey = [states.coreHealth, states.base44Adoption, states.base44Economics, states.agentAttachment].join("|");
    if (!(jointStateKey in jointStateValues)) jointStateValues[jointStateKey] = [];
    jointStateValues[jointStateKey].push(results.twelveMonth.value);
  }

  const orderedSix = sixMonth.map((value, index) => ({ value, index })).sort((left, right) => left.value - right.value);
  const transitionBands = [];
  const labels = ["bottom_quartile", "lower_middle_quartile", "upper_middle_quartile", "top_quartile"];
  for (let band = 0; band < 4; band += 1) {
    const entries = orderedSix.slice(Math.floor((band * sampleCount) / 4), Math.floor(((band + 1) * sampleCount) / 4));
    const laterValues = entries.map((entry) => twelveMonth[entry.index]);
    const sortedLater = [...laterValues].sort((left, right) => left - right);
    transitionBands.push({
      label: labels[band],
      earlier_band_upper_probability: (band + 1) / 4,
      earlier_band_sample_probability: entries.length / sampleCount,
      later_mean: mean(laterValues),
      later_median: quantile(sortedLater, 0.5),
      later_probability_below_reference: laterValues.filter((value) => value < REFERENCE_PRICE).length / laterValues.length,
    });
  }

  const conditionalSummaries = Object.fromEntries(
    Object.entries(conditionalPaths).map(([node, states]) => [
      node,
      Object.fromEntries(Object.entries(states).map(([state, path]) => [
        state,
        {
          sample_probability: path.values.length / sampleCount,
          summary: path.values.length === 0 ? null : summarizeFairValue(path.values),
          mean_drivers: path.drivers.length === 0 ? null : summarizeDrivers(path.drivers),
        },
      ])),
    ]),
  );
  const byNodeVariance = Object.fromEntries(
    Object.entries(conditionalPaths).map(([node, states]) => [
      node,
      varianceDecomposition(Object.fromEntries(Object.entries(states).map(([state, path]) => [state, path.values])), twelveMonth),
    ]),
  );

  return {
    valuationQuantity: "fair_value_per_share_at_target_date",
    formalMethod: "sum_of_parts",
    calibrationStatus: "structured_elicitation_shadow_cross_sectionally_anchored",
    probabilitySemantics: "model-implied fair-value frequency under structured causal-node elicitations; not realized security-return probability",
    dilutionTreatment: "45.989m starting fully diluted shares include current unvested awards; future award vintages are charged in owner FCFF and not also issued in the horizon denominator",
    seed,
    sampleCount,
    referencePrice: REFERENCE_PRICE,
    stresses,
    causalModel: {
      declaredProbabilities: causalProbabilities,
      nodeSemantics: "Core health is pre-incremental outside-agent execution resilience; agent attachment then contributes a separate direct funnel, transaction and multiple effect. Correlation represents common platform readiness, not a second direct agent effect.",
      construction: "ordinal Gaussian-copula-like latent construction with exposed dependency loadings; frontier capability helps Base44 while pressuring the core funnel",
      dependencyLoadings,
      nodeCounts,
      observedOrdinalDependencies: {
        core_agent: pearson(nodeScores.coreHealth, nodeScores.agentAttachment),
        adoption_agent: pearson(nodeScores.base44Adoption, nodeScores.agentAttachment),
        adoption_economics: pearson(nodeScores.base44Adoption, nodeScores.base44Economics),
        frontier_core: pearson(frontierCapabilities, nodeScores.coreHealth),
        frontier_adoption: pearson(frontierCapabilities, nodeScores.base44Adoption),
        frontier_economics: pearson(frontierCapabilities, nodeScores.base44Economics),
      },
      jointStateCounts: Object.fromEntries(Object.entries(jointStateValues).map(([state, values]) => [state, values.length])),
    },
    sixMonth: summarizeFairValue(sixMonth),
    twelveMonth: summarizeFairValue(twelveMonth),
    operatingForecasts: {
      semantics: "operating-only distributions; four and ten months align to FY2026 and Q2-2027 period ends and are not additional fair-value horizons. ARR and claims are point-in-time measures; core ARR compounds from its 30 June 2026 measurement, Base44 ARR from the approximately 31 May 2026 public run-rate anchor, and the four-month gross-margin state is treated as the Q4 2026 quarterly average.",
      units: {
        core_arr_bn: "USD billions",
        base44_arr_bn: "USD billions",
        total_arr_bn: "USD billions",
        base44_gross_margin: "fraction",
        owner_fcff_usd_m: "USD millions",
        net_claims_usd_bn: "USD billions",
      },
      fourMonth: operatingSummary(operatingPaths.fourMonth),
      sixMonth: operatingSummary(operatingPaths.sixMonth),
      tenMonth: operatingSummary(operatingPaths.tenMonth),
      twelveMonth: operatingSummary(operatingPaths.twelveMonth),
    },
    relationship: {
      value_correlation: pearson(sixMonth, twelveMonth),
      probability_later_above_earlier: twelveMonth.filter((value, index) => value > sixMonth[index]).length / sampleCount,
      capital_path_diagnostics: {
        probability_later_diluted_shares_gte_earlier: twelveMonthShares.filter((value, index) => value >= sixMonthShares[index]).length / sampleCount,
        probability_later_net_claims_above_earlier: twelveMonthNetClaims.filter((value, index) => value > sixMonthNetClaims[index]).length / sampleCount,
        mean_six_month_diluted_shares: mean(sixMonthShares),
        mean_twelve_month_diluted_shares: mean(twelveMonthShares),
        mean_six_month_net_claims: mean(sixMonthNetClaims),
        mean_twelve_month_net_claims: mean(twelveMonthNetClaims),
      },
      transition_bands: transitionBands,
    },
    diagnostics: {
      capitalization_convention: {
        formal: "if-converted above $210.49; capped-call benefit through $267.89 omitted",
        six_month_probability_formal_value_above_conversion_strike: sixMonth.filter((value) => value > 210.49).length / sampleCount,
        six_month_probability_formal_value_above_capped_call_cap: sixMonth.filter((value) => value > 267.89).length / sampleCount,
        twelve_month_probability_formal_value_above_conversion_strike: twelveMonth.filter((value) => value > 210.49).length / sampleCount,
        twelve_month_probability_formal_value_above_capped_call_cap: twelveMonth.filter((value) => value > 267.89).length / sampleCount,
      },
      method_medians: {
        six_month: Object.fromEntries(Object.entries(methodValues.sixMonth).map(([method, values]) => [method, quantile([...values].sort((left, right) => left - right), 0.5)])),
        twelve_month: Object.fromEntries(Object.entries(methodValues.twelveMonth).map(([method, values]) => [method, quantile([...values].sort((left, right) => left - right), 0.5)])),
      },
      method_distributions: {
        six_month: Object.fromEntries(Object.entries(methodValues.sixMonth).map(([method, values]) => [method, summarizeFairValue(values)])),
        twelve_month: Object.fromEntries(Object.entries(methodValues.twelveMonth).map(([method, values]) => [method, summarizeFairValue(values)])),
      },
      twelve_month_by_causal_node: conditionalSummaries,
      variance_attribution: {
        semantics: "The joint-state split exactly separates variance between the 4-node structural combinations from variance within them. Per-node splits are exact partitions individually but are not additive because nodes are dependent.",
        joint_state: varianceDecomposition(jointStateValues, twelveMonth),
        by_node: byNodeVariance,
      },
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runModel(), null, 2));
}
