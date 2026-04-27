"use client";

import type { KpiConfig, KpiKey } from "@/lib/types";
import { AUDIT_SCALE, KPI_SCALE, RATING_SCALE } from "@/lib/constants";
import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";

interface SettingsViewProps {
  kpiConfig: KpiConfig[];
  onKpiConfigChange: (config: KpiConfig[]) => void;
  onResetDefaults: () => void;
}

export function SettingsView({
  kpiConfig,
  onKpiConfigChange,
  onResetDefaults,
}: SettingsViewProps) {
  const totalWeight = kpiConfig.reduce((s, c) => s + c.weight, 0);
  const isValid = Math.abs(totalWeight - 1.0) < 0.001;

  const handleWeightChange = (key: KpiKey, weight: number) => {
    onKpiConfigChange(
      kpiConfig.map((c) => (c.key === key ? { ...c, weight } : c))
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-kex-heading italic">
            Настройки системы
          </h2>
          <p className="text-sm text-kex-muted mt-1">
            Веса KPI и шкалы градаций
          </p>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-kex-elevated text-kex-text hover:bg-kex-border border border-kex-border transition-colors"
        >
          <RotateCcw size={14} />
          Сбросить
        </button>
      </div>

      {/* Веса KPI */}
      <div className="kex-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-kex-accent rounded-full" />
            <h3 className="text-lg font-semibold text-kex-heading">Веса KPI</h3>
          </div>
          <div
            className={`text-sm font-mono font-bold ${
              isValid ? "text-kex-success" : "text-kex-danger"
            }`}
          >
            Σ = {(totalWeight * 100).toFixed(1)}%
            {!isValid && " (должно быть 100%)"}
          </div>
        </div>

        <div className="space-y-2">
          {kpiConfig.map((cfg) => (
            <div
              key={cfg.key}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-kex-elevated/50"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-kex-heading">
                  {cfg.name}
                </div>
                <div className="text-xs text-kex-muted">
                  Группа:{" "}
                  {cfg.group === "revenue"
                    ? "Товарооборот"
                    : cfg.group === "quality"
                    ? "Качество"
                    : "Расходы"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={cfg.weight}
                  onChange={(e) => handleWeightChange(cfg.key, Number(e.target.value))}
                  className="kex-input w-24 text-center"
                />
                <span className="text-sm font-mono text-kex-muted w-14 text-right">
                  {(cfg.weight * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Шкала KPI */}
      <div className="kex-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-6 bg-kex-accent rounded-full" />
          <h3 className="text-lg font-semibold text-kex-heading">
            Шкала выполнения KPI
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-kex-muted uppercase tracking-wider border-b border-kex-border">
                <th className="pb-2">Выполнение от</th>
                <th className="pb-2">Коэффициент</th>
                <th className="pb-2">Описание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kex-border">
              {KPI_SCALE.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-mono">{(row.threshold * 100).toFixed(0)}%</td>
                  <td className="py-2 font-mono font-bold">{row.coefficient.toFixed(2)}</td>
                  <td className="py-2 text-kex-muted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Шкала аудита */}
      <div className="kex-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-6 bg-kex-gold rounded-full" />
          <h3 className="text-lg font-semibold text-kex-heading">
            Шкала аудита KEX Group
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-kex-muted uppercase tracking-wider border-b border-kex-border">
                <th className="pb-2">Балл аудита</th>
                <th className="pb-2">Коэффициент</th>
                <th className="pb-2">Описание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kex-border">
              {AUDIT_SCALE.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-mono">
                    {row.from === 0 ? `<${row.to}%` : `${row.from}–${row.to}%`}
                  </td>
                  <td className="py-2 font-mono font-bold">{row.coefficient.toFixed(2)}</td>
                  <td className="py-2 text-kex-muted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-kex-muted">
          <strong className="text-kex-warning">Процедура при балле &lt;70%:</strong>
          <br />
          Бонус замораживается до решения комиссии (Опер. директор + HR + Дир. по производству).
        </div>
      </div>

      {/* Шкала рейтинга */}
      <div className="kex-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-6 bg-emerald-500 rounded-full" />
          <h3 className="text-lg font-semibold text-kex-heading">
            Шкала рейтинга (2ГИС + Яндекс)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-kex-muted uppercase tracking-wider border-b border-kex-border">
                <th className="pb-2">Рейтинг</th>
                <th className="pb-2">Коэффициент</th>
                <th className="pb-2">Описание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kex-border">
              {RATING_SCALE.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-mono">
                    {row.from === 0 ? `<${row.to}` : `${row.from}–${row.to}`}
                  </td>
                  <td className="py-2 font-mono font-bold">{row.coefficient.toFixed(2)}</td>
                  <td className="py-2 text-kex-muted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
