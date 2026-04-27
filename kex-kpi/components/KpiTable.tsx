"use client";

import type { KpiKey, KpiInput, CalculationResult, KpiConfig } from "@/lib/types";
import { formatMoney, formatPercent, formatKpiValue } from "@/lib/calculations";
import { TrendingUp, Award, Wallet } from "lucide-react";

interface KpiTableProps {
  kpiConfig: KpiConfig[];
  kpiInputs: Record<KpiKey, KpiInput>;
  result: CalculationResult;
  onInputChange: (key: KpiKey, field: "plan" | "fact", value: number) => void;
}

const GROUP_META = {
  revenue: {
    title: "Товарооборот",
    icon: TrendingUp,
    color: "text-kex-accent",
    bg: "bg-blue-500/5 border-blue-500/20",
    bar: "bg-kex-accent",
  },
  quality: {
    title: "Качество",
    icon: Award,
    color: "text-kex-gold",
    bg: "bg-amber-500/5 border-amber-500/20",
    bar: "bg-kex-gold",
  },
  expenses: {
    title: "Контроль расходов",
    icon: Wallet,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5 border-emerald-500/20",
    bar: "bg-emerald-500",
  },
};

export function KpiTable({ kpiConfig, kpiInputs, result, onInputChange }: KpiTableProps) {
  const grouped = {
    revenue: kpiConfig.filter((c) => c.group === "revenue"),
    quality: kpiConfig.filter((c) => c.group === "quality"),
    expenses: kpiConfig.filter((c) => c.group === "expenses"),
  };

  const groupSums = {
    revenue: grouped.revenue.reduce((s, c) => s + c.weight, 0),
    quality: grouped.quality.reduce((s, c) => s + c.weight, 0),
    expenses: grouped.expenses.reduce((s, c) => s + c.weight, 0),
  };

  return (
    <div className="kex-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-kex-accent rounded-full" />
        <h2 className="text-lg font-semibold text-kex-heading">KPI показатели</h2>
        <span className="ml-auto text-xs text-kex-muted font-mono">
          7 показателей · 100%
        </span>
      </div>

      <div className="space-y-4">
        {(["revenue", "quality", "expenses"] as const).map((groupKey) => {
          const meta = GROUP_META[groupKey];
          const Icon = meta.icon;
          const items = grouped[groupKey];
          const weightSum = groupSums[groupKey];

          return (
            <div key={groupKey} className={`rounded-xl border ${meta.bg} overflow-hidden`}>
              {/* Заголовок группы */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={meta.color} />
                  <span className={`font-semibold ${meta.color}`}>{meta.title}</span>
                </div>
                <span className="text-sm font-mono text-kex-muted">
                  {(weightSum * 100).toFixed(0)}%
                </span>
              </div>

              {/* KPI строки */}
              <div className="divide-y divide-white/5">
                {items.map((cfg) => {
                  const input = kpiInputs[cfg.key];
                  const kpiResult = result.kpiResults.find((r) => r.key === cfg.key)!;
                  const perf = kpiResult.performance;
                  const isOver100 = perf >= 1.0;

                  return (
                    <div
                      key={cfg.key}
                      className="px-4 py-3 grid grid-cols-12 gap-3 items-center"
                    >
                      {/* Название и вес */}
                      <div className="col-span-12 md:col-span-3">
                        <div className="text-sm font-medium text-kex-heading">{cfg.name}</div>
                        <div className="text-xs text-kex-muted font-mono mt-0.5">
                          вес {(cfg.weight * 100).toFixed(1)}%
                          {cfg.reverse && " · реверс"}
                        </div>
                      </div>

                      {/* План */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-[10px] text-kex-muted uppercase tracking-wider mb-1">
                          План
                        </div>
                        <input
                          type="number"
                          step={cfg.format === "percent" ? "0.001" : cfg.format === "rating" ? "0.1" : "1"}
                          value={input.plan}
                          onChange={(e) => onInputChange(cfg.key, "plan", Number(e.target.value))}
                          className="kex-input w-full text-sm"
                        />
                      </div>

                      {/* Факт */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-[10px] text-kex-muted uppercase tracking-wider mb-1">
                          Факт
                        </div>
                        <input
                          type="number"
                          step={cfg.format === "percent" ? "0.001" : cfg.format === "rating" ? "0.1" : "1"}
                          value={input.fact}
                          onChange={(e) => onInputChange(cfg.key, "fact", Number(e.target.value))}
                          className="kex-input w-full text-sm"
                        />
                      </div>

                      {/* Выполнение */}
                      <div className="col-span-4 md:col-span-2">
                        <div className="text-[10px] text-kex-muted uppercase tracking-wider mb-1">
                          Выполнение
                        </div>
                        <div className={`text-sm font-mono font-semibold ${isOver100 ? "text-kex-success" : perf >= 0.9 ? "text-kex-text" : "text-kex-warning"}`}>
                          {formatPercent(perf, 1)}
                        </div>
                        <div className="mt-1 h-1.5 bg-kex-elevated rounded-full overflow-hidden">
                          <div
                            className={meta.bar}
                            style={{
                              width: `${Math.min(perf * 100, 120) / 1.2}%`,
                              height: "100%",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                      </div>

                      {/* Коэф */}
                      <div className="col-span-3 md:col-span-1 text-center">
                        <div className="text-[10px] text-kex-muted uppercase tracking-wider mb-1">
                          Коэф.
                        </div>
                        <div className="text-sm font-mono font-bold text-kex-heading">
                          {kpiResult.coefficient.toFixed(2)}
                        </div>
                      </div>

                      {/* Бонус */}
                      <div className="col-span-5 md:col-span-2 text-right">
                        <div className="text-[10px] text-kex-muted uppercase tracking-wider mb-1">
                          Бонус
                        </div>
                        <div className="text-sm font-mono font-bold text-kex-gold">
                          {formatMoney(kpiResult.bonus)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
