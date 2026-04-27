export type KpiKey =
  | "averageCheck"
  | "transactions"
  | "audit"
  | "rating"
  | "fotPercent"
  | "turnover"
  | "writeoffs";

export type KpiGroup = "revenue" | "quality" | "expenses";

export interface KpiConfig {
  key: KpiKey;
  name: string;
  group: KpiGroup;
  weight: number;       // Доля в общем фонде, 0..1
  reverse: boolean;     // true для расходных метрик (план÷факт)
  format: "money" | "number" | "percent" | "rating" | "auditPercent";
}

export interface KpiInput {
  plan: number;
  fact: number;
}

export interface PositionConfig {
  key: string;
  name: string;
  count: number;
  coefficient: number;
}

export interface PointParams {
  pointName: string;
  period: string;
  turnover: number;        // Товарооборот точки за месяц
  bonusPercent: number;    // % от оборота на бонусный фонд (0.03 = 3%)
  auditScore: number;      // Балл аудита 0-100
}

export interface KpiResult {
  key: KpiKey;
  name: string;
  weight: number;
  plan: number;
  fact: number;
  performance: number;     // % выполнения
  coefficient: number;     // Коэф. выполнения по шкале
  bonus: number;           // Сумма бонуса по этому KPI
}

export interface CalculationResult {
  maxBonusFund: number;          // Максимальный фонд (без коэф. аудита)
  auditCoefficient: number;       // Коэф. аудита
  auditStatus: "review" | "reduced" | "ok";
  actualBonusFund: number;       // Фактический фонд с учётом аудита
  fundPerformancePercent: number;// % от максимального фонда
  kpiResults: KpiResult[];
}

export interface PositionBonus {
  key: string;
  name: string;
  count: number;
  coefficient: number;
  totalCoef: number;
  bonusPerPerson: number;
  totalBonus: number;
  shareOfFund: number;
}

export interface DistributionResult {
  totalCoefficients: number;
  shareValue: number;
  positions: PositionBonus[];
  checkSum: number;
}

export interface SavedCalculation {
  id: string;
  date: string;
  pointName: string;
  period: string;
  turnover: number;
  actualBonusFund: number;
  fundPerformancePercent: number;
  kpiInputs: Record<KpiKey, KpiInput>;
  pointParams: PointParams;
  positions: PositionConfig[];
}
