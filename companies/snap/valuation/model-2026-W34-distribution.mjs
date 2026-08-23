const DEFAULT_SEED = 20_260_821;
const DEFAULT_SAMPLE_COUNT = 100_000;

export const modelContract = Object.freeze({
  modelVersion: "structured_elicitation_monte_carlo_v2_joint_horizons",
  asOf: "2026-08-22",
  sourceCutoffAt: "2026-08-22T23:57:00+02:00",
  currency: "USD",
  referencePrice: 5.21,
  sixMonthHorizon: "2027-02-20",
  targetHorizon: "2027-08-20",
  seed: DEFAULT_SEED,
  sampleCount: DEFAULT_SAMPLE_COUNT,
  scenarioDisplayPoints: Object.freeze({
    bear: 0.10,
    base: 0.50,
    bull: 0.90,
  }),
});

// Every curve is an analyst-elicited numeric marginal distribution, expressed
// as minimum / P10 / P50 / P90 / maximum. Higher-is-worse inputs are stored in
// numeric ascending order and sampled with the complement of the favorable
// state score below. Endpoints make the tails visible instead of truncating the
// model at the old downside and upside paths.
export const marginalCurves = Object.freeze({
  advertisingRevenueBeforeRegulatoryDrag: [4.90, 5.620, 6.093, 6.442, 6.85],
  otherRevenue: [1.00, 1.286, 1.435, 1.628, 1.95],
  fcfBeforeIncrementalLegalCash: [0.25, 0.950, 1.250, 1.550, 1.90],
  cashUseOutsideNetDebtPerimeter: [0.35, 0.500, 0.675, 0.800, 0.95],
  dilutedShares: [1.84, 1.880, 1.920, 1.980, 2.05],
  enterpriseValueRevenueMultiple: [0.50, 0.90, 2.20, 3.30, 4.50],
  advertisingRevenueMultiple: [0.40, 0.70, 1.80, 2.80, 4.00],
  otherRevenueMultiple: [1.00, 1.50, 3.00, 5.00, 7.00],
  specsNetOptionValue: [-0.40, 0.00, 0.25, 0.75, 1.25],
  yearFiveFcfMargin: [0.060, 0.095, 0.165, 0.200, 0.230],
  annualDilutionAfterYearOne: [-0.005, 0.000, 0.010, 0.030, 0.050],
  costOfEquity: [0.110, 0.120, 0.130, 0.140, 0.160],
  terminalCompanyGrowth: [0.010, 0.020, 0.025, 0.030, 0.035],
  revenueGrowthYearTwo: [-0.05, 0.04, 0.14, 0.20, 0.28],
  revenueGrowthYearThree: [-0.03, 0.03, 0.12, 0.18, 0.25],
  revenueGrowthYearFour: [-0.02, 0.02, 0.10, 0.15, 0.22],
  revenueGrowthYearFive: [0.00, 0.02, 0.08, 0.12, 0.18],
});

// Treat the deterministic checkpoint paths as including half of the displayed
// twelve-month downside / central / upside legal allowances. This explicit
// timing assumption is reversed before sampling the shared legal branch so the
// model never deducts the same exposure twice. The endpoints make the outer
// deciles explicit.
export const sixMonthEmbeddedLegalAllowances = Object.freeze({
  revenueDrag: Object.freeze({
    downside: 0.0375,
    central: 0.0225,
    upside: 0.0100,
  }),
  cashEffect: Object.freeze({
    downside: 0.1375,
    central: 0.0625,
    upside: 0.0175,
  }),
});

export const sixMonthMarginalCurves = Object.freeze({
  trailingRevenueBeforeRegulatoryDrag: [6.47, 6.7135, 6.9505, 7.173, 7.42],
  enterpriseValueRevenueMultiple: [0.60, 1.20, 1.95, 2.90, 4.00],
  netDebtBeforeIncrementalLegalCash: [0.08, 0.3325, 0.5875, 0.6875, 0.95],
  dilutedShares: [1.86, 1.890, 1.910, 1.940, 1.99],
});

// Each draw is a linked six-/twelve-month path. The six-month driver score is
// paired with the corresponding twelve-month score at the declared rank
// correlation, retaining room for evidence and market-specific shocks between
// checkpoints. These are analyst-elicited transition assumptions, not measured
// serial correlations. The legal branch is shared; half of its twelve-month
// cash and annualized revenue effects are recognized by the six-month point.
export const horizonLinkages = Object.freeze({
  revenueAdvertisingWeight: 0.82,
  revenueRankCorrelation: 0.85,
  valuationRankCorrelation: 0.80,
  capitalRankCorrelation: 0.90,
  sixMonthLegalCashRealization: 0.50,
  sixMonthLegalRevenueDragRealization: 0.50,
});

// Factor loadings encode direction and dependence without pretending that a
// small Snap-only record can estimate a full covariance matrix. The remaining
// weight is idiosyncratic and is calculated as sqrt(1 - loading^2).
export const dependencyLoadings = Object.freeze({
  advertisingOnBusiness: 0.85,
  otherRevenueOnBusiness: 0.50,
  cashFlowOnBusiness: 0.65,
  capitalOnBusiness: 0.60,
  valuationOnBusiness: 0.70,
  specsOnBusiness: 0.30,
  longTermOnBusiness: 0.75,
});

// Probabilities and state labels come from the jurisdiction-level tail map in
// 2026-08-21-regulation-costs-revalidation.md. Within-state ranges are analyst
// elicitation ranges for incremental cash and annualized revenue drag. They are
// sampled explicitly and replace the old practice of hiding all legal outcomes
// inside three company-wide scenario weights.
export const legalStates = Object.freeze([
  Object.freeze({
    name: "manageable",
    probability: 0.60,
    cashEffect: [0.00, 0.03, 0.08],
    revenueDrag: [0.00, 0.01, 0.02],
  }),
  Object.freeze({
    name: "material",
    probability: 0.30,
    cashEffect: [0.10, 0.20, 0.40],
    revenueDrag: [0.03, 0.05, 0.10],
  }),
  Object.freeze({
    name: "severe",
    probability: 0.08,
    cashEffect: [0.40, 0.70, 1.00],
    revenueDrag: [0.10, 0.15, 0.25],
  }),
  Object.freeze({
    name: "extreme",
    probability: 0.02,
    cashEffect: [1.00, 1.40, 2.00],
    revenueDrag: [0.25, 0.35, 0.50],
  }),
]);

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function createNormalSampler(random) {
  let spare = null;
  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }

    const first = Math.max(random(), Number.EPSILON);
    const second = random();
    const radius = Math.sqrt(-2 * Math.log(first));
    const angle = 2 * Math.PI * second;
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };
}

function normalCdf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const polynomial =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
    t;
  const erf = sign * (1 - polynomial * Math.exp(-x * x));
  return 0.5 * (1 + erf);
}

function factorScore(business, idiosyncratic, loading) {
  return loading * business + Math.sqrt(1 - loading ** 2) * idiosyncratic;
}

function linkedScore(twelveMonthScore, sixMonthShock, rankCorrelation) {
  return (
    rankCorrelation * twelveMonthScore +
    Math.sqrt(1 - rankCorrelation ** 2) * sixMonthShock
  );
}

function normalizedWeightedScore(
  firstScore,
  secondScore,
  firstWeight,
  scoreCorrelation,
) {
  const secondWeight = 1 - firstWeight;
  const variance =
    firstWeight ** 2 +
    secondWeight ** 2 +
    2 * firstWeight * secondWeight * scoreCorrelation;
  return (
    (firstWeight * firstScore + secondWeight * secondScore) /
    Math.sqrt(variance)
  );
}

export function interpolateMarginal(curve, probability) {
  const breakpoints = [0, 0.10, 0.50, 0.90, 1];
  const boundedProbability = Math.min(1, Math.max(0, probability));

  for (let index = 1; index < breakpoints.length; index += 1) {
    if (boundedProbability <= breakpoints[index]) {
      const lowerProbability = breakpoints[index - 1];
      const upperProbability = breakpoints[index];
      const progress =
        (boundedProbability - lowerProbability) /
        (upperProbability - lowerProbability);
      return curve[index - 1] + (curve[index] - curve[index - 1]) * progress;
    }
  }

  return curve.at(-1);
}

function triangular(random, [minimum, mode, maximum]) {
  const draw = random();
  const modeProbability = (mode - minimum) / (maximum - minimum);
  if (draw <= modeProbability) {
    return minimum + Math.sqrt(draw * (maximum - minimum) * (mode - minimum));
  }
  return maximum - Math.sqrt((1 - draw) * (maximum - minimum) * (maximum - mode));
}

function sampleLegalState(random) {
  const stateDraw = random();
  let cumulativeProbability = 0;

  for (const state of legalStates) {
    cumulativeProbability += state.probability;
    if (stateDraw <= cumulativeProbability) {
      return {
        name: state.name,
        cashEffect: triangular(random, state.cashEffect),
        revenueDrag: triangular(random, state.revenueDrag),
      };
    }
  }

  throw new Error("Legal-state probabilities do not sum to one");
}

function medianOfThree(first, second, third) {
  return first + second + third - Math.min(first, second, third) - Math.max(first, second, third);
}

function discountedCashFlow({
  yearOneRevenue,
  yearOneFcf,
  dilutedShares,
  futureRevenueGrowth,
  yearFiveFcfMargin,
  annualDilution,
  costOfEquity,
  terminalCompanyGrowth,
}) {
  const yearOneMargin = yearOneFcf / yearOneRevenue;
  let revenue = yearOneRevenue;
  let shares = dilutedShares;
  let presentValue = 0;
  let finalFcfPerShare = 0;

  for (let year = 1; year <= 5; year += 1) {
    if (year > 1) {
      revenue *= 1 + futureRevenueGrowth[year - 2];
      shares *= 1 + annualDilution;
    }
    const progress = (year - 1) / 4;
    const margin = yearOneMargin + (yearFiveFcfMargin - yearOneMargin) * progress;
    finalFcfPerShare = revenue * margin / shares;
    presentValue += finalFcfPerShare / (1 + costOfEquity) ** year;
  }

  const terminalPerShareGrowth =
    (1 + terminalCompanyGrowth) / (1 + annualDilution) - 1;
  const spread = costOfEquity - terminalPerShareGrowth;
  if (spread <= 0.02) {
    throw new Error(`DCF terminal spread is too narrow: ${spread}`);
  }
  const terminalValue =
    finalFcfPerShare * (1 + terminalPerShareGrowth) / spread;

  return Math.max(
    0,
    presentValue + terminalValue / (1 + costOfEquity) ** 5,
  );
}

function quantile(sortedValues, probability) {
  const position = (sortedValues.length - 1) * probability;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }
  const progress = position - lowerIndex;
  return (
    sortedValues[lowerIndex] +
    (sortedValues[upperIndex] - sortedValues[lowerIndex]) * progress
  );
}

function mean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function summarize(values, referencePrice) {
  const sortedValues = values.toSorted((first, second) => first - second);
  const bottomDecileCount = Math.ceil(sortedValues.length * 0.10);
  return {
    mean: mean(sortedValues),
    p05: quantile(sortedValues, 0.05),
    p10: quantile(sortedValues, 0.10),
    p25: quantile(sortedValues, 0.25),
    p50: quantile(sortedValues, 0.50),
    p75: quantile(sortedValues, 0.75),
    p90: quantile(sortedValues, 0.90),
    p95: quantile(sortedValues, 0.95),
    probabilityBelowReference:
      sortedValues.filter((value) => value < referencePrice).length /
      sortedValues.length,
    probabilityLossThirtyPercent:
      sortedValues.filter((value) => value < referencePrice * 0.70).length /
      sortedValues.length,
    probabilityLossFiftyPercent:
      sortedValues.filter((value) => value < referencePrice * 0.50).length /
      sortedValues.length,
    probabilityAboveEightPercentHurdle:
      sortedValues.filter((value) => value > referencePrice * 1.08).length /
      sortedValues.length,
    expectedShortfallTenPercent: mean(sortedValues.slice(0, bottomDecileCount)),
  };
}

function summarizeDriver(values) {
  const sortedValues = values.toSorted((first, second) => first - second);
  return {
    mean: mean(sortedValues),
    p05: quantile(sortedValues, 0.05),
    p10: quantile(sortedValues, 0.10),
    p25: quantile(sortedValues, 0.25),
    p50: quantile(sortedValues, 0.50),
    p75: quantile(sortedValues, 0.75),
    p90: quantile(sortedValues, 0.90),
    p95: quantile(sortedValues, 0.95),
  };
}

function pearsonCorrelation(firstValues, secondValues) {
  const firstMean = mean(firstValues);
  const secondMean = mean(secondValues);
  let covariance = 0;
  let firstVariance = 0;
  let secondVariance = 0;

  for (let index = 0; index < firstValues.length; index += 1) {
    const firstDifference = firstValues[index] - firstMean;
    const secondDifference = secondValues[index] - secondMean;
    covariance += firstDifference * secondDifference;
    firstVariance += firstDifference ** 2;
    secondVariance += secondDifference ** 2;
  }

  return covariance / Math.sqrt(firstVariance * secondVariance);
}

function summarizeTransitionBands(
  checkpointValues,
  targetValues,
  referencePrice,
) {
  const sortedCheckpointValues = checkpointValues.toSorted(
    (first, second) => first - second,
  );
  const thresholds = [
    quantile(sortedCheckpointValues, 0.25),
    quantile(sortedCheckpointValues, 0.50),
    quantile(sortedCheckpointValues, 0.75),
  ];
  const bands = {
    bottomQuartile: [],
    lowerMiddleQuartile: [],
    upperMiddleQuartile: [],
    topQuartile: [],
  };

  for (let index = 0; index < checkpointValues.length; index += 1) {
    const checkpointValue = checkpointValues[index];
    const targetValue = targetValues[index];
    if (checkpointValue <= thresholds[0]) {
      bands.bottomQuartile.push(targetValue);
    } else if (checkpointValue <= thresholds[1]) {
      bands.lowerMiddleQuartile.push(targetValue);
    } else if (checkpointValue <= thresholds[2]) {
      bands.upperMiddleQuartile.push(targetValue);
    } else {
      bands.topQuartile.push(targetValue);
    }
  }

  return Object.fromEntries(
    Object.entries(bands).map(([name, values]) => [
      name,
      {
        sampleShare: values.length / checkpointValues.length,
        ...summarize(values, referencePrice),
      },
    ]),
  );
}

export function runDistributionModel({
  seed = modelContract.seed,
  sampleCount = modelContract.sampleCount,
  loadingMultiplier = 1,
  horizonLinkageMultiplier = 1,
} = {}) {
  if (!Number.isInteger(sampleCount) || sampleCount < 10_000) {
    throw new Error("sampleCount must be an integer of at least 10,000");
  }
  if (loadingMultiplier < 0 || loadingMultiplier > 1.25) {
    throw new Error("loadingMultiplier must be between 0 and 1.25");
  }
  if (horizonLinkageMultiplier < 0 || horizonLinkageMultiplier > 1.20) {
    throw new Error(
      "horizonLinkageMultiplier must be between 0 and 1.20",
    );
  }

  const loading = (name) =>
    Math.min(0.95, dependencyLoadings[name] * loadingMultiplier);
  const horizonLinkage = (name) =>
    Math.min(0.99, horizonLinkages[name] * horizonLinkageMultiplier);

  const random = mulberry32(seed);
  const normal = createNormalSampler(random);
  // A separate stream adds checkpoint-specific uncertainty without changing
  // the already-published twelve-month deterministic-seed draws.
  const sixMonthRandom = mulberry32(seed ^ 0x6d6f6e74);
  const sixMonthNormal = createNormalSampler(sixMonthRandom);
  const methodValues = {
    multiple: [],
    sotp: [],
    dcf: [],
    triangulated: [],
  };
  const sixMonthValues = [];
  const sixMonthDiagnostics = {
    revenue: [],
    netDebt: [],
    dilutedShares: [],
    revenueMultiple: [],
    value: sixMonthValues,
  };
  const diagnostics = {
    revenue: [],
    advertisingRevenue: [],
    otherRevenue: [],
    fcf: [],
    netDebt: [],
    dilutedShares: [],
    revenueMultiple: [],
    legalCashEffect: [],
    legalRevenueDrag: [],
    legalStateCounts: Object.fromEntries(legalStates.map(({ name }) => [name, 0])),
  };
  const legalStateValues = Object.fromEntries(
    legalStates.map(({ name }) => [name, []]),
  );

  for (let sample = 0; sample < sampleCount; sample += 1) {
    const business = normal();
    const advertisingScore = factorScore(
      business,
      normal(),
      loading("advertisingOnBusiness"),
    );
    const otherRevenueScore = factorScore(
      business,
      normal(),
      loading("otherRevenueOnBusiness"),
    );
    const cashFlowScore = factorScore(
      business,
      normal(),
      loading("cashFlowOnBusiness"),
    );
    const capitalScore = factorScore(
      business,
      normal(),
      loading("capitalOnBusiness"),
    );
    const valuationScore = factorScore(
      business,
      normal(),
      loading("valuationOnBusiness"),
    );
    const specsScore = factorScore(
      business,
      normal(),
      loading("specsOnBusiness"),
    );
    const longTermScore = factorScore(
      business,
      normal(),
      loading("longTermOnBusiness"),
    );

    const probability = {
      advertising: normalCdf(advertisingScore),
      otherRevenue: normalCdf(otherRevenueScore),
      cashFlow: normalCdf(cashFlowScore),
      capital: normalCdf(capitalScore),
      valuation: normalCdf(valuationScore),
      specs: normalCdf(specsScore),
      longTerm: normalCdf(longTermScore),
    };
    const legal = sampleLegalState(random);
    diagnostics.legalStateCounts[legal.name] += 1;

    const twelveMonthRevenueScore = normalizedWeightedScore(
      advertisingScore,
      otherRevenueScore,
      horizonLinkages.revenueAdvertisingWeight,
      loading("advertisingOnBusiness") * loading("otherRevenueOnBusiness"),
    );
    const sixMonthProbability = {
      revenue: normalCdf(
        linkedScore(
          twelveMonthRevenueScore,
          sixMonthNormal(),
          horizonLinkage("revenueRankCorrelation"),
        ),
      ),
      valuation: normalCdf(
        linkedScore(
          valuationScore,
          sixMonthNormal(),
          horizonLinkage("valuationRankCorrelation"),
        ),
      ),
      capital: normalCdf(
        linkedScore(
          capitalScore,
          sixMonthNormal(),
          horizonLinkage("capitalRankCorrelation"),
        ),
      ),
    };

    const sixMonthRevenueBeforeDrag = interpolateMarginal(
      sixMonthMarginalCurves.trailingRevenueBeforeRegulatoryDrag,
      sixMonthProbability.revenue,
    );
    const sixMonthRevenue = Math.max(
      0,
      sixMonthRevenueBeforeDrag -
        legal.revenueDrag *
          horizonLinkages.sixMonthLegalRevenueDragRealization,
    );
    const sixMonthNetDebtBeforeLegal = interpolateMarginal(
      sixMonthMarginalCurves.netDebtBeforeIncrementalLegalCash,
      1 - sixMonthProbability.capital,
    );
    const sixMonthNetDebt =
      sixMonthNetDebtBeforeLegal +
      legal.cashEffect * horizonLinkages.sixMonthLegalCashRealization;
    const sixMonthDilutedShares = interpolateMarginal(
      sixMonthMarginalCurves.dilutedShares,
      1 - sixMonthProbability.capital,
    );
    const sixMonthRevenueMultiple = interpolateMarginal(
      sixMonthMarginalCurves.enterpriseValueRevenueMultiple,
      sixMonthProbability.valuation,
    );
    const sixMonthValue = Math.max(
      0,
      (sixMonthRevenue * sixMonthRevenueMultiple - sixMonthNetDebt) /
        sixMonthDilutedShares,
    );

    const advertisingRevenueBeforeDrag = interpolateMarginal(
      marginalCurves.advertisingRevenueBeforeRegulatoryDrag,
      probability.advertising,
    );
    const advertisingRevenue = Math.max(
      0,
      advertisingRevenueBeforeDrag - legal.revenueDrag,
    );
    const otherRevenue = interpolateMarginal(
      marginalCurves.otherRevenue,
      probability.otherRevenue,
    );
    const revenue = advertisingRevenue + otherRevenue;
    const fcfBeforeLegalCash = interpolateMarginal(
      marginalCurves.fcfBeforeIncrementalLegalCash,
      probability.cashFlow,
    );
    const fcf = fcfBeforeLegalCash - legal.cashEffect;
    const cashUse = interpolateMarginal(
      marginalCurves.cashUseOutsideNetDebtPerimeter,
      1 - probability.capital,
    );
    const netDebt = 0.875 - fcf + cashUse;
    const dilutedShares = interpolateMarginal(
      marginalCurves.dilutedShares,
      1 - probability.capital,
    );
    const revenueMultiple = interpolateMarginal(
      marginalCurves.enterpriseValueRevenueMultiple,
      probability.valuation,
    );
    const advertisingMultiple = interpolateMarginal(
      marginalCurves.advertisingRevenueMultiple,
      probability.valuation,
    );
    const otherMultiple = interpolateMarginal(
      marginalCurves.otherRevenueMultiple,
      probability.valuation,
    );
    const specsValue = interpolateMarginal(
      marginalCurves.specsNetOptionValue,
      probability.specs,
    );

    const multipleValue = Math.max(
      0,
      (revenue * revenueMultiple - netDebt) / dilutedShares,
    );
    const sotpValue = Math.max(
      0,
      (advertisingRevenue * advertisingMultiple +
        otherRevenue * otherMultiple +
        specsValue -
        netDebt) /
        dilutedShares,
    );
    const dcfValue = discountedCashFlow({
      yearOneRevenue: revenue,
      yearOneFcf: fcf,
      dilutedShares,
      futureRevenueGrowth: [
        interpolateMarginal(marginalCurves.revenueGrowthYearTwo, probability.longTerm),
        interpolateMarginal(marginalCurves.revenueGrowthYearThree, probability.longTerm),
        interpolateMarginal(marginalCurves.revenueGrowthYearFour, probability.longTerm),
        interpolateMarginal(marginalCurves.revenueGrowthYearFive, probability.longTerm),
      ],
      yearFiveFcfMargin: interpolateMarginal(
        marginalCurves.yearFiveFcfMargin,
        probability.cashFlow,
      ),
      annualDilution: interpolateMarginal(
        marginalCurves.annualDilutionAfterYearOne,
        1 - probability.capital,
      ),
      costOfEquity: interpolateMarginal(
        marginalCurves.costOfEquity,
        1 - probability.valuation,
      ),
      terminalCompanyGrowth: interpolateMarginal(
        marginalCurves.terminalCompanyGrowth,
        probability.longTerm,
      ),
    });
    const triangulatedValue = medianOfThree(multipleValue, sotpValue, dcfValue);

    methodValues.multiple.push(multipleValue);
    methodValues.sotp.push(sotpValue);
    methodValues.dcf.push(dcfValue);
    methodValues.triangulated.push(triangulatedValue);
    sixMonthValues.push(sixMonthValue);
    legalStateValues[legal.name].push(triangulatedValue);
    diagnostics.revenue.push(revenue);
    diagnostics.advertisingRevenue.push(advertisingRevenue);
    diagnostics.otherRevenue.push(otherRevenue);
    diagnostics.fcf.push(fcf);
    diagnostics.netDebt.push(netDebt);
    diagnostics.dilutedShares.push(dilutedShares);
    diagnostics.revenueMultiple.push(revenueMultiple);
    diagnostics.legalCashEffect.push(legal.cashEffect);
    diagnostics.legalRevenueDrag.push(legal.revenueDrag);
    sixMonthDiagnostics.revenue.push(sixMonthRevenue);
    sixMonthDiagnostics.netDebt.push(sixMonthNetDebt);
    sixMonthDiagnostics.dilutedShares.push(sixMonthDilutedShares);
    sixMonthDiagnostics.revenueMultiple.push(sixMonthRevenueMultiple);
  }

  const methodSummaries = Object.fromEntries(
    Object.entries(methodValues).map(([name, values]) => [
      name,
      summarize(values, modelContract.referencePrice),
    ]),
  );
  const diagnosticSummaries = Object.fromEntries(
    Object.entries(diagnostics)
      .filter(([name]) => name !== "legalStateCounts")
      .map(([name, values]) => [name, summarizeDriver(values)]),
  );
  const legalStateFrequencies = Object.fromEntries(
    Object.entries(diagnostics.legalStateCounts).map(([name, count]) => [
      name,
      count / sampleCount,
    ]),
  );
  const legalStateValueSummaries = Object.fromEntries(
    Object.entries(legalStateValues).map(([name, values]) => [
      name,
      summarizeDriver(values),
    ]),
  );
  const driverCorrelationsWithValue = Object.fromEntries(
    Object.entries(diagnostics)
      .filter(([name]) => name !== "legalStateCounts")
      .map(([name, values]) => [
        name,
        pearsonCorrelation(values, methodValues.triangulated),
      ]),
  );
  const sixMonthSummary = summarize(
    sixMonthValues,
    modelContract.referencePrice,
  );
  const sixMonthDiagnosticSummaries = Object.fromEntries(
    Object.entries(sixMonthDiagnostics)
      .filter(([name]) => name !== "value")
      .map(([name, values]) => [name, summarizeDriver(values)]),
  );
  const horizonValueCorrelation = pearsonCorrelation(
    sixMonthValues,
    methodValues.triangulated,
  );
  const horizonTransitions = summarizeTransitionBands(
    sixMonthValues,
    methodValues.triangulated,
    modelContract.referencePrice,
  );

  return {
    contract: {
      ...modelContract,
      seed,
      sampleCount,
      loadingMultiplier,
      horizonLinkageMultiplier,
    },
    methods: methodSummaries,
    diagnostics: diagnosticSummaries,
    legalStateFrequencies,
    legalStateValueSummaries,
    driverCorrelationsWithValue,
    sixMonth: {
      value: sixMonthSummary,
      diagnostics: sixMonthDiagnosticSummaries,
    },
    horizonLink: {
      valueCorrelation: horizonValueCorrelation,
      probabilityTwelveMonthAboveSixMonth:
        methodValues.triangulated.filter(
          (value, index) => value > sixMonthValues[index],
        ).length / sampleCount,
    },
    horizonTransitions,
  };
}

function round(value, digits = 3) {
  return Number(value.toFixed(digits));
}

export function printableSummary(result) {
  const roundObject = (object, digits = 3) =>
    Object.fromEntries(
      Object.entries(object).map(([name, value]) => [name, round(value, digits)]),
    );
  return {
    contract: result.contract,
    methods: Object.fromEntries(
      Object.entries(result.methods).map(([name, summary]) => [
        name,
        roundObject(summary, 4),
      ]),
    ),
    diagnostics: Object.fromEntries(
      Object.entries(result.diagnostics).map(([name, summary]) => [
        name,
        roundObject(summary, 4),
      ]),
    ),
    legalStateFrequencies: roundObject(result.legalStateFrequencies, 4),
    legalStateValueSummaries: Object.fromEntries(
      Object.entries(result.legalStateValueSummaries).map(([name, summary]) => [
        name,
        roundObject(summary, 4),
      ]),
    ),
    driverCorrelationsWithValue: roundObject(
      result.driverCorrelationsWithValue,
      4,
    ),
    sixMonth: {
      value: roundObject(result.sixMonth.value, 4),
      diagnostics: Object.fromEntries(
        Object.entries(result.sixMonth.diagnostics).map(([name, summary]) => [
          name,
          roundObject(summary, 4),
        ]),
      ),
    },
    horizonLink: roundObject(result.horizonLink, 4),
    horizonTransitions: Object.fromEntries(
      Object.entries(result.horizonTransitions).map(([name, summary]) => [
        name,
        roundObject(summary, 4),
      ]),
    ),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runDistributionModel();
  console.log(JSON.stringify(printableSummary(result), null, 2));
}
