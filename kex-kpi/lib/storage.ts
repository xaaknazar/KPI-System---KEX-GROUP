import type { SavedCalculation, KpiConfig, PositionConfig } from "./types";

const HISTORY_KEY = "kex-kpi-history";
const KPI_CONFIG_KEY = "kex-kpi-config";
const POSITIONS_KEY = "kex-kpi-positions";

// История расчётов
export function getHistory(): SavedCalculation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCalculation(calc: SavedCalculation): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.unshift(calc);
  // Храним максимум 100 расчётов
  const trimmed = history.slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function deleteCalculation(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((c) => c.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

// Настройки KPI (веса)
export function saveKpiConfig(config: KpiConfig[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KPI_CONFIG_KEY, JSON.stringify(config));
}

export function loadKpiConfig(): KpiConfig[] | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(KPI_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Настройки позиций
export function savePositions(positions: PositionConfig[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
}

export function loadPositions(): PositionConfig[] | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(POSITIONS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
