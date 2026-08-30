#!/usr/bin/env node

const REFERENCE_PRICE = 87.62;
const SAMPLE_COUNT = 100000;
const SEED = 20260830;
const DEFAULT_REGIME_WEIGHTS = {
  erosion: 0.2,
  defend: 0.58,
  platformWin: 0.22,
};
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
  return covariance / Math.sqrt(firstVariance * secondVariance);
}

function regimeParameters(regime) {
  if (regime === "erosion") {
    return {
      coreGrowth: -0.01,
      base44Growth: 0.15,
      coreMultiple: 1.55,
      base44Multiple: 3.25,
      transactionMultiple: 0.75,
    };
  }
  if (regime === "platform_win") {
    return {
      coreGrowth: 0.095,
      base44Growth: 0.95,
      coreMultiple: 3.25,
      base44Multiple: 11,
      transactionMultiple: 1.3,
    };
  }
  return {
    coreGrowth: 0.065,
    base44Growth: 0.55,
    coreMultiple: 2.45,
    base44Multiple: 7,
    transactionMultiple: 1,
  };
}

export function computeBase44OwnerContribution({
  arrBn,
  grossMargin,
  postGrossProfitOwnerCostLoad,
}) {
  return arrBn * 1000 * grossMargin * (1 - postGrossProfitOwnerCostLoad);
}

export function computeEndingNetClaims({
  startingNetClaims,
  cumulativeOwnerFcfe,
  balanceSheetRetentionRate,
  incrementalBase44ArrMillions,
  earnoutParticipation,
}) {
  const retainedCashOrDebtPaydown = cumulativeOwnerFcfe * balanceSheetRetentionRate;
  const earnoutIncrease = incrementalBase44ArrMillions * earnoutParticipation;
  return {
    retainedCashOrDebtPaydown,
    earnoutIncrease,
    endingNetClaims: clamp(
      startingNetClaims - retainedCashOrDebtPaydown / 1000 + earnoutIncrease / 1000,
      0.5,
      0.95,
    ),
  };
}

function sampleCapitalPath({ random }) {
  const startingDilutedShares = clamp(
    STARTING_DILUTED_SHARES + 0.12 * normal(random),
    45.7,
    46.3,
  );
  const startingNetClaims = clamp(STARTING_NET_CLAIMS + 0.035 * normal(random), 0.68, 0.88);
  // The fraction of cumulative owner FCFE retained as balance-sheet cash or
  // used to repay debt. The residual is excluded from target-date company
  // value: it is assumed paid out or deployed at fair value through
  // distributions, repurchases, or M&A, with no incremental value credited.
  const balanceSheetRetentionRate = clamp(0.32 + 0.08 * normal(random), 0.12, 0.55);
  // Approximate share of incremental Base44 ARR that remeasures into the
  // revenue-linked contingent claim. This ties the claim to the same simulated
  // Base44 path rather than drawing it independently.
  const earnoutParticipation = clamp(0.38 + 0.08 * normal(random), 0.18, 0.58);
  return {
    startingDilutedShares,
    startingNetClaims,
    balanceSheetRetentionRate,
    earnoutParticipation,
  };
}

function sampleHorizon({
  random,
  regime,
  months,
  sharedFactors,
  horizonShocks,
  capitalPath,
  base44CostLoadShift,
}) {
  const parameters = regimeParameters(regime);
  const years = months / 12;
  const coreQuality = 0.85 * sharedFactors.coreExecution + 0.53 * horizonShocks.core;
  const base44Quality = 0.85 * sharedFactors.base44ProductMarketFit + 0.53 * horizonShocks.base44;
  const unitEconomicsQuality =
    0.85 * sharedFactors.unitEconomics + 0.53 * horizonShocks.unitEconomics;
  const marketRisk = 0.85 * sharedFactors.marketRisk + 0.53 * horizonShocks.marketRisk;

  // Frontier capability helps Base44 but pressures the new-site funnel. The
  // structural regime deliberately bundles adoption/growth/multiple centroids;
  // separate factors keep it from also choosing unit economics, WACC, and all
  // execution noise. Weight sensitivity remains decision-critical.
  const coreGrowth = clamp(
    parameters.coreGrowth + 0.02 * coreQuality - 0.008 * sharedFactors.aiCapability,
    -0.08,
    0.16,
  );
  const base44Growth = clamp(
    parameters.base44Growth + 0.18 * base44Quality + 0.08 * sharedFactors.aiCapability,
    -0.3,
    1.6,
  );
  const coreArr = 1.813 * (1 + coreGrowth) ** years;
  const base44Arr = 0.15 * (1 + base44Growth) ** years;
  const transactionRevenue = 0.30 * (1 + clamp(coreGrowth + 0.02, -0.08, 0.2)) ** years;

  // Q2 management expects Base44 non-GAAP gross margin near 60% in H2 2026.
  // The post-GP load is broader than marketing: it includes all Base44 S&M,
  // product/R&D, security/support, G&A, tax, capex/capitalized software,
  // retention, and future-award economics. Only the residual is owner FCFF.
  const base44GrossMargin = clamp(0.6 + 0.055 * unitEconomicsQuality, 0.35, 0.8);
  const base44PostGrossProfitOwnerCostLoad = clamp(
    0.78 + base44CostLoadShift - 0.055 * unitEconomicsQuality + 0.015 * base44Quality,
    0.55,
    0.96,
  );
  const base44OwnerMargin =
    base44GrossMargin * (1 - base44PostGrossProfitOwnerCostLoad);

  const coreMultiple = clamp(
    parameters.coreMultiple + 2.5 * (coreGrowth - parameters.coreGrowth) +
      0.16 * coreQuality - 0.25 * marketRisk,
    0.9,
    4.3,
  );
  const base44Multiple = clamp(
    parameters.base44Multiple + 1.5 * (base44Growth - parameters.base44Growth) +
      0.55 * base44Quality - 0.6 * marketRisk + 14 * (base44OwnerMargin - 0.132),
    1.5,
    14,
  );
  const transactionMultiple = clamp(
    parameters.transactionMultiple + 1.2 * (coreGrowth - parameters.coreGrowth) +
      0.08 * coreQuality - 0.15 * marketRisk,
    0.4,
    1.6,
  );

  const futureAwardEconomicCharge = clamp(
    110 + 8 * unitEconomicsQuality,
    90,
    130,
  );
  const targetCoreRawFcfeBeforeFutureAwards = clamp(
    359 + 900 * (coreGrowth - 0.065) + 26 * unitEconomicsQuality + 8 * normal(random),
    250,
    460,
  );
  const targetCoreOwnerFcff = clamp(
    targetCoreRawFcfeBeforeFutureAwards -
      futureAwardEconomicCharge +
      NORMALIZED_AFTER_TAX_INTEREST,
    175,
    360,
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
      targetOwnerFcff * interpolationWeight +
      8 * normal(random),
    80,
    520,
  );

  // Debt repayment and cash accumulation use levered owner cash (FCFE), not
  // FCFF. Remove normalized after-tax interest before the sources-and-uses
  // bridge, while the DCF/multiple continue to value enterprise FCFF.
  const cumulativeOwnerCash =
    ((CURRENT_NORMALIZED_OWNER_FCFF - NORMALIZED_AFTER_TAX_INTEREST +
      ownerFcff - NORMALIZED_AFTER_TAX_INTEREST) /
      2) *
    years;
  const incrementalBase44Arr = Math.max(0, base44Arr - 0.15) * 1000;
  const capitalBridge = computeEndingNetClaims({
    startingNetClaims: capitalPath.startingNetClaims,
    cumulativeOwnerFcfe: cumulativeOwnerCash,
    balanceSheetRetentionRate: capitalPath.balanceSheetRetentionRate,
    incrementalBase44ArrMillions: incrementalBase44Arr,
    earnoutParticipation: capitalPath.earnoutParticipation,
  });
  const { retainedCashOrDebtPaydown, earnoutIncrease, endingNetClaims: netClaims } =
    capitalBridge;
  // Current unvested awards are already in this denominator. Future award
  // vintages are charged in owner FCFF and therefore are not also issued here.
  const dilutedShares = capitalPath.startingDilutedShares;

  const sotpEnterpriseValue =
    coreArr * coreMultiple +
    base44Arr * base44Multiple +
    transactionRevenue * transactionMultiple;
  const sotp = Math.max(
    0,
    enterpriseValuePerShare(sotpEnterpriseValue * 1000, netClaims * 1000, dilutedShares),
  );

  const fcffMultiple = clamp(
    19 + 18 * (coreGrowth - 0.065) + 1.3 * base44Quality - 1.2 * marketRisk,
    12,
    26,
  );
  // Owner FCFF adds normalized after-tax interest back to levered cash flow.
  // Value it as enterprise cash flow, then apply the debt/claim bridge once.
  const ownerFcffMultiple = Math.max(
    0,
    enterpriseValuePerShare(ownerFcff * fcffMultiple, netClaims * 1000, dilutedShares),
  );

  const wacc = clamp(
    0.11 + 0.005 * marketRisk + 0.002 * normal(random),
    0.095,
    0.125,
  );
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
  const terminalValue =
    forecastFcf * (1 + terminalGrowth) / (wacc - terminalGrowth);
  dcfEnterpriseValue += terminalValue / (1 + wacc) ** 5;
  const dcf = Math.max(
    0,
    enterpriseValuePerShare(dcfEnterpriseValue, netClaims * 1000, dilutedShares),
  );

  return {
    // Formal value is SOTP because Wix has a separately modeled, high-growth
    // Base44 option whose present cash contribution is intentionally small.
    // DCF and the cash multiple are cross-checks, not averaged votes.
    value: sotp,
    methods: { sotp, ownerFcffMultiple, dcf },
    drivers: {
      coreArr,
      base44Arr,
      base44GrossMargin,
      base44PostGrossProfitOwnerCostLoad,
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
        netClaims -
        computeEndingNetClaims({
          startingNetClaims: capitalPath.startingNetClaims,
          cumulativeOwnerFcfe: cumulativeOwnerCash,
          balanceSheetRetentionRate: capitalPath.balanceSheetRetentionRate,
          incrementalBase44ArrMillions: incrementalBase44Arr,
          earnoutParticipation: capitalPath.earnoutParticipation,
        }).endingNetClaims,
      dilutedShares,
      netClaims,
    },
  };
}

export function runModel({
  seed = SEED,
  sampleCount = SAMPLE_COUNT,
  regimeWeights = DEFAULT_REGIME_WEIGHTS,
  base44CostLoadShift = 0,
} = {}) {
  if (!Number.isInteger(sampleCount) || sampleCount < 10) {
    throw new Error("sampleCount must be an integer of at least 10");
  }
  if (!Number.isFinite(base44CostLoadShift) || Math.abs(base44CostLoadShift) > 0.2) {
    throw new Error("base44CostLoadShift must be finite and between -0.2 and 0.2");
  }
  const expectedWeightKeys = ["defend", "erosion", "platformWin"];
  const actualWeightKeys = Object.keys(regimeWeights).sort();
  if (
    actualWeightKeys.length !== expectedWeightKeys.length ||
    actualWeightKeys.some((key, index) => key !== expectedWeightKeys[index])
  ) {
    throw new Error("regimeWeights must contain exactly erosion, defend, and platformWin");
  }
  const weightSum = regimeWeights.erosion + regimeWeights.defend + regimeWeights.platformWin;
  if (
    Math.abs(weightSum - 1) > 1e-9 ||
    Object.values(regimeWeights).some((weight) => !Number.isFinite(weight) || weight <= 0)
  ) {
    throw new Error("Regime weights must be finite, positive, and sum to one");
  }
  const random = mulberry32(seed);
  const sixMonth = [];
  const twelveMonth = [];
  const sixMonthShares = [];
  const twelveMonthShares = [];
  const sixMonthNetClaims = [];
  const twelveMonthNetClaims = [];
  const regimeCounts = { erosion: 0, defend: 0, platform_win: 0 };
  const methodValues = {
    sixMonth: { sotp: [], ownerFcffMultiple: [], dcf: [] },
    twelveMonth: { sotp: [], ownerFcffMultiple: [], dcf: [] },
  };
  const regimePaths = {
    erosion: { twelveMonth: [], drivers: [] },
    defend: { twelveMonth: [], drivers: [] },
    platform_win: { twelveMonth: [], drivers: [] },
  };

  for (let draw = 0; draw < sampleCount; draw += 1) {
    const regimeDraw = random();
    const regime =
      regimeDraw < regimeWeights.erosion
        ? "erosion"
        : regimeDraw < regimeWeights.erosion + regimeWeights.defend
          ? "defend"
          : "platform_win";
    regimeCounts[regime] += 1;
    const aiCapability = normal(random);
    const coreIndependent = normal(random);
    const base44Independent = normal(random);
    const sharedFactors = {
      aiCapability,
      coreExecution: 0.2 * aiCapability + Math.sqrt(1 - 0.2 ** 2) * coreIndependent,
      base44ProductMarketFit:
        0.25 * aiCapability + Math.sqrt(1 - 0.25 ** 2) * base44Independent,
      unitEconomics:
        0.3 * base44Independent + Math.sqrt(1 - 0.3 ** 2) * normal(random),
      marketRisk: normal(random),
    };
    const capitalPath = sampleCapitalPath({ random });
    const sixShocks = {
      core: normal(random),
      base44: normal(random),
      unitEconomics: normal(random),
      marketRisk: normal(random),
    };
    const twelveShocks = Object.fromEntries(
      Object.entries(sixShocks).map(([factor, shock]) => [
        factor,
        0.62 * shock + Math.sqrt(1 - 0.62 ** 2) * normal(random),
      ]),
    );
    const sixResult = sampleHorizon({
      random,
      regime,
      months: 6,
      sharedFactors,
      horizonShocks: sixShocks,
      capitalPath,
      base44CostLoadShift,
    });
    const twelveResult = sampleHorizon({
      random,
      regime,
      months: 12,
      sharedFactors,
      horizonShocks: twelveShocks,
      capitalPath,
      base44CostLoadShift,
    });
    sixMonth.push(sixResult.value);
    twelveMonth.push(twelveResult.value);
    sixMonthShares.push(sixResult.drivers.dilutedShares);
    twelveMonthShares.push(twelveResult.drivers.dilutedShares);
    sixMonthNetClaims.push(sixResult.drivers.netClaims);
    twelveMonthNetClaims.push(twelveResult.drivers.netClaims);
    for (const method of ["sotp", "ownerFcffMultiple", "dcf"]) {
      methodValues.sixMonth[method].push(sixResult.methods[method]);
      methodValues.twelveMonth[method].push(twelveResult.methods[method]);
    }
    regimePaths[regime].twelveMonth.push(twelveResult.value);
    regimePaths[regime].drivers.push(twelveResult.drivers);
  }

  function summarize(values) {
    const sorted = [...values].sort((left, right) => left - right);
    const bottomDecile = sorted.slice(0, Math.floor(sorted.length * 0.1));
    return {
      p10: quantile(sorted, 0.1),
      p50: quantile(sorted, 0.5),
      p90: quantile(sorted, 0.9),
      mean: mean(values),
      probability_below_reference:
        values.filter((value) => value < REFERENCE_PRICE).length / values.length,
      probability_loss_30_pct:
        values.filter((value) => value < REFERENCE_PRICE * 0.7).length / values.length,
      probability_loss_50_pct:
        values.filter((value) => value < REFERENCE_PRICE * 0.5).length / values.length,
      bottom_decile_mean: mean(bottomDecile),
    };
  }

  function summarizeDrivers(drivers) {
    const fields = [
      "coreArr",
      "base44Arr",
      "base44GrossMargin",
      "base44PostGrossProfitOwnerCostLoad",
      "targetBase44Contribution",
      "base44ContributionIdentityError",
      "futureAwardEconomicCharge",
      "targetCoreRawFcfeBeforeFutureAwards",
      "targetCoreOwnerFcff",
      "ownerFcff",
      "cumulativeOwnerCash",
      "retainedCashOrDebtPaydown",
      "earnoutIncrease",
      "capitalIdentityError",
      "dilutedShares",
      "netClaims",
    ];
    return Object.fromEntries(
      fields.map((field) => [field, mean(drivers.map((driver) => driver[field]))]),
    );
  }

  const orderedSix = sixMonth
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value - right.value);
  const transitionBands = [];
  const labels = ["bottom_quartile", "lower_middle_quartile", "upper_middle_quartile", "top_quartile"];
  for (let band = 0; band < 4; band += 1) {
    const entries = orderedSix.slice(
      Math.floor((band * sampleCount) / 4),
      Math.floor(((band + 1) * sampleCount) / 4),
    );
    const laterValues = entries.map((entry) => twelveMonth[entry.index]);
    const sortedLater = [...laterValues].sort((left, right) => left - right);
    transitionBands.push({
      label: labels[band],
      earlier_band_upper_probability: (band + 1) / 4,
      earlier_band_sample_probability: entries.length / sampleCount,
      later_mean: mean(laterValues),
      later_median: quantile(sortedLater, 0.5),
      later_probability_below_reference:
        laterValues.filter((value) => value < REFERENCE_PRICE).length / laterValues.length,
    });
  }

  return {
    valuationQuantity: "fair_value_per_share_at_target_date",
    formalMethod: "sum_of_parts",
    calibrationStatus: "uncalibrated_shadow",
    probabilitySemantics:
      "model-implied fair-value frequency under elicited weights; not realized security-return probability",
    dilutionTreatment:
      "45.989m starting fully diluted shares include current unvested awards; future award vintages are charged in owner FCFF and not also issued in the horizon denominator",
    seed,
    sampleCount,
    referencePrice: REFERENCE_PRICE,
    regimeCounts,
    sixMonth: summarize(sixMonth),
    twelveMonth: summarize(twelveMonth),
    relationship: {
      value_correlation: pearson(sixMonth, twelveMonth),
      probability_later_above_earlier:
        twelveMonth.filter((value, index) => value > sixMonth[index]).length / sampleCount,
      capital_path_diagnostics: {
        probability_later_diluted_shares_gte_earlier:
          twelveMonthShares.filter((value, index) => value >= sixMonthShares[index]).length /
          sampleCount,
        probability_later_net_claims_above_earlier:
          twelveMonthNetClaims.filter((value, index) => value > sixMonthNetClaims[index]).length /
          sampleCount,
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
        six_month_probability_formal_value_above_conversion_strike:
          sixMonth.filter((value) => value > 210.49).length / sampleCount,
        six_month_probability_formal_value_above_capped_call_cap:
          sixMonth.filter((value) => value > 267.89).length / sampleCount,
        twelve_month_probability_formal_value_above_conversion_strike:
          twelveMonth.filter((value) => value > 210.49).length / sampleCount,
        twelve_month_probability_formal_value_above_capped_call_cap:
          twelveMonth.filter((value) => value > 267.89).length / sampleCount,
      },
      method_medians: {
        six_month: Object.fromEntries(
          Object.entries(methodValues.sixMonth).map(([method, values]) => [
            method,
            quantile([...values].sort((left, right) => left - right), 0.5),
          ]),
        ),
        twelve_month: Object.fromEntries(
          Object.entries(methodValues.twelveMonth).map(([method, values]) => [
            method,
            quantile([...values].sort((left, right) => left - right), 0.5),
          ]),
        ),
      },
      twelve_month_by_regime: Object.fromEntries(
        Object.entries(regimePaths).map(([regime, path]) => [
          regime,
          {
            summary: summarize(path.twelveMonth),
            mean_drivers: summarizeDrivers(path.drivers),
          },
        ]),
      ),
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runModel(), null, 2));
}
