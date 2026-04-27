import type { KpiConfig, PositionConfig, PointParams, KpiKey, KpiInput } from "./types";

// Конфигурация всех 7 KPI с весами 40/30/30
export const DEFAULT_KPI_CONFIG: KpiConfig[] = [
  { key: "averageCheck",  name: "Средний чек",            group: "revenue",  weight: 0.20,  reverse: false, format: "money" },
  { key: "transactions",  name: "Количество транзакций",  group: "revenue",  weight: 0.20,  reverse: false, format: "number" },
  { key: "audit",         name: "Операционный аудит",     group: "quality",  weight: 0.15,  reverse: false, format: "auditPercent" },
  { key: "rating",        name: "Рейтинг (2ГИС + Яндекс)",group: "quality",  weight: 0.15,  reverse: false, format: "rating" },
  { key: "fotPercent",    name: "% ФОТ от товарооборота", group: "expenses", weight: 0.10,  reverse: true,  format: "percent" },
  { key: "turnover",      name: "Текучка персонала",      group: "expenses", weight: 0.10,  reverse: true,  format: "percent" },
  { key: "writeoffs",     name: "Списания товара",        group: "expenses", weight: 0.10,  reverse: true,  format: "percent" },
];

// Дефолтные позиции для DNA Абая 15
export const DEFAULT_POSITIONS: PositionConfig[] = [
  { key: "manager",        name: "Управляющий",       count: 1, coefficient: 6.0 },
  { key: "cook",           name: "Повар-универсал",   count: 8, coefficient: 1.5 },
  { key: "prep",           name: "Заготовщик",        count: 2, coefficient: 1.2 },
  { key: "cashier",        name: "Кассир",            count: 4, coefficient: 1.2 },
  { key: "runnerKitchen",  name: "Раннер-сборщик",    count: 2, coefficient: 0.6 },
  { key: "runnerHall",     name: "Раннер зала",       count: 0, coefficient: 0.5 },
  { key: "tech",           name: "Тех. персонал",     count: 4, coefficient: 0.5 },
];

// Дефолтные параметры точки (DNA Абая 15, май 2026)
export const DEFAULT_POINT_PARAMS: PointParams = {
  pointName: "DNA Абая 15",
  period: "Май 2026",
  turnover: 59907067,
  bonusPercent: 0.03,
  auditScore: 90,
};

// Дефолтные планы и факты по KPI
export const DEFAULT_KPI_INPUTS: Record<KpiKey, KpiInput> = {
  averageCheck:  { plan: 4157,    fact: 4200 },
  transactions:  { plan: 14410,   fact: 14410 },
  audit:         { plan: 100,     fact: 90 },
  rating:        { plan: 4.7,     fact: 4.7 },
  fotPercent:    { plan: 0.13,    fact: 0.125 },
  turnover:      { plan: 0.20,    fact: 0.15 },
  writeoffs:     { plan: 0.02,    fact: 0.018 },
};

// Шкала градаций KPI (выполнение → коэффициент)
export interface ScaleRow {
  threshold: number;
  coefficient: number;
  description: string;
}

export const KPI_SCALE: ScaleRow[] = [
  { threshold: 0,    coefficient: 0,   description: "Ниже 80% — бонус не начисляется" },
  { threshold: 0.80, coefficient: 0.5, description: "80–89% — половина бонуса" },
  { threshold: 0.90, coefficient: 0.8, description: "90–99% — почти полный бонус" },
  { threshold: 1.00, coefficient: 1.0, description: "100–109% — полный бонус" },
  { threshold: 1.10, coefficient: 1.2, description: "110–120% — перевыполнение" },
  { threshold: 1.20, coefficient: 1.2, description: "Выше 120% — потолок" },
];

// Шкала аудита KEX Group (применяется ко всему фонду)
export const AUDIT_SCALE = [
  { from: 0,  to: 70,  coefficient: 0,   label: "РАЗБОР",     description: "Индивидуальное рассмотрение комиссии" },
  { from: 70, to: 80,  coefficient: 0.8, label: "СНИЖЕНИЕ",   description: "Бонус 80% от расчётного" },
  { from: 80, to: 90,  coefficient: 0.9, label: "СНИЖЕНИЕ",   description: "Бонус 90% от расчётного" },
  { from: 90, to: 95,  coefficient: 1.0, label: "ОК",         description: "Полный бонус (целевой коридор)" },
  { from: 95, to: 101, coefficient: 1.1, label: "ПООЩРЕНИЕ",  description: "Бонус +10% (поощрение)" },
];

// Шкала рейтинга KEX Group (применяется только к KPI рейтинга)
export const RATING_SCALE = [
  { from: 0,   to: 4.3, coefficient: 0,    description: "Бонус по рейтингу не выплачивается" },
  { from: 4.3, to: 4.5, coefficient: 0.5,  description: "Половина бонуса" },
  { from: 4.5, to: 4.7, coefficient: 0.75, description: "75% бонуса" },
  { from: 4.7, to: 5.1, coefficient: 1.0,  description: "Полный бонус (целевой)" },
];
