import type {
  CalculationResult,
  DistributionResult,
  KpiConfig,
  KpiInput,
  KpiKey,
  KpiResult,
  PointParams,
  PositionBonus,
  PositionConfig,
} from "./types";
import { AUDIT_SCALE, KPI_SCALE, RATING_SCALE } from "./constants";

/**
 * Получает коэффициент аудита для всего фонда
 */
export function getAuditCoefficient(score: number): {
  coefficient: number;
  status: "review" | "reduced" | "ok";
  label: string;
} {
  for (const row of AUDIT_SCALE) {
    if (score >= row.from && score < row.to) {
      let status: "review" | "reduced" | "ok" = "ok";
      if (row.coefficient === 0) status = "review";
      else if (row.coefficient < 1.0) status = "reduced";
      return { coefficient: row.coefficient, status, label: row.label };
    }
  }
  // 100%+ → целевой
  return { coefficient: 1.1, status: "ok", label: "ПООЩРЕНИЕ" };
}

/**
 * Получает коэффициент по абсолютному значению рейтинга
 */
export function getRatingCoefficient(rating: number): number {
  for (const row of RATING_SCALE) {
    if (rating >= row.from && rating < row.to) {
      return row.coefficient;
    }
  }
  return rating >= 4.7 ? 1.0 : 0;
}

/**
 * Получает коэффициент по шкале выполнения KPI
 */
export function getKpiCoefficient(performance: number): number {
  let coef = 0;
  for (const row of KPI_SCALE) {
    if (performance >= row.threshold) {
      coef = row.coefficient;
    }
  }
  return coef;
}

/**
 * Считает % выполнения KPI с учётом реверсивности
 */
export function calculatePerformance(
  plan: number,
  fact: number,
  reverse: boolean
): number {
  if (plan === 0 || fact === 0) return 0;
  return reverse ? plan / fact : fact / plan;
}

/**
 * Главный расчёт фонда точки и всех KPI
 */
export function calculateBonusFund(
  pointParams: PointParams,
  kpiConfig: KpiConfig[],
  kpiInputs: Record<KpiKey, KpiInput>
): CalculationResult {
  const maxBonusFund = pointParams.turnover * pointParams.bonusPercent;

  const audit = getAuditCoefficient(pointParams.auditScore);

  const kpiResults: KpiResult[] = kpiConfig.map((cfg) => {
    const input = kpiInputs[cfg.key];
    const performance = calculatePerformance(input.plan, input.fact, cfg.reverse);

    // Особая логика для рейтинга — коэффициент по абсолютному значению
    let coefficient: number;
    if (cfg.key === "rating") {
      coefficient = getRatingCoefficient(input.fact);
    } else if (cfg.key === "audit") {
      // Аудит как KPI считается через выполнение
      coefficient = getKpiCoefficient(performance);
    } else {
      coefficient = getKpiCoefficient(performance);
    }

    // Доля фонда = макс.фонд × вес × коэф.выполнения × коэф.аудита
    const bonus = maxBonusFund * cfg.weight * coefficient * audit.coefficient;

    return {
      key: cfg.key,
      name: cfg.name,
      weight: cfg.weight,
      plan: input.plan,
      fact: input.fact,
      performance,
      coefficient,
      bonus,
    };
  });

  const actualBonusFund = kpiResults.reduce((sum, r) => sum + r.bonus, 0);
  const fundPerformancePercent =
    maxBonusFund > 0 ? actualBonusFund / maxBonusFund : 0;

  return {
    maxBonusFund,
    auditCoefficient: audit.coefficient,
    auditStatus: audit.status,
    actualBonusFund,
    fundPerformancePercent,
    kpiResults,
  };
}

/**
 * Распределяет фонд между сотрудниками по коэффициентам
 */
export function distributeBonusFund(
  fund: number,
  positions: PositionConfig[]
): DistributionResult {
  // Считаем сумму всех коэффициентов
  const totalCoefficients = positions.reduce(
    (sum, p) => sum + p.count * p.coefficient,
    0
  );

  // Стоимость одной "доли"
  const shareValue = totalCoefficients > 0 ? fund / totalCoefficients : 0;

  const positionBonuses: PositionBonus[] = positions.map((p) => {
    const totalCoef = p.count * p.coefficient;
    const bonusPerPerson = p.coefficient * shareValue;
    const totalBonus = bonusPerPerson * p.count;
    const shareOfFund = fund > 0 ? totalBonus / fund : 0;

    return {
      key: p.key,
      name: p.name,
      count: p.count,
      coefficient: p.coefficient,
      totalCoef,
      bonusPerPerson,
      totalBonus,
      shareOfFund,
    };
  });

  const checkSum = positionBonuses.reduce((sum, p) => sum + p.totalBonus, 0);

  return {
    totalCoefficients,
    shareValue,
    positions: positionBonuses,
    checkSum,
  };
}

/**
 * Форматирование числа в тенге
 */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " тг";
}

/**
 * Форматирование процентов
 */
export function formatPercent(value: number, digits = 1): string {
  return (value * 100).toFixed(digits) + "%";
}

/**
 * Форматирование чисел
 */
export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Универсальный форматтер по типу KPI
 */
export function formatKpiValue(value: number, format: string): string {
  switch (format) {
    case "money":
      return formatMoney(value);
    case "percent":
      return formatPercent(value, 2);
    case "rating":
      return value.toFixed(1);
    case "auditPercent":
      return value.toFixed(0) + "%";
    case "number":
    default:
      return formatNumber(value);
  }
}
