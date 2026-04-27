"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { PointParamsCard } from "@/components/PointParamsCard";
import { KpiTable } from "@/components/KpiTable";
import { ResultsSummary } from "@/components/ResultsSummary";
import { StaffDistribution } from "@/components/StaffDistribution";
import { ActionsBar } from "@/components/ActionsBar";
import { HistoryView } from "@/components/HistoryView";
import { SettingsView } from "@/components/SettingsView";
import {
  DEFAULT_KPI_CONFIG,
  DEFAULT_KPI_INPUTS,
  DEFAULT_POINT_PARAMS,
  DEFAULT_POSITIONS,
} from "@/lib/constants";
import {
  calculateBonusFund,
  distributeBonusFund,
} from "@/lib/calculations";
import {
  generateId,
  getHistory,
  saveCalculation,
  deleteCalculation,
  clearHistory,
  loadKpiConfig,
  saveKpiConfig,
  loadPositions,
  savePositions,
} from "@/lib/storage";
import { exportToPDF, exportToExcel } from "@/lib/export";
import type {
  KpiConfig,
  KpiInput,
  KpiKey,
  PointParams,
  PositionConfig,
  SavedCalculation,
} from "@/lib/types";

type Tab = "calculator" | "history" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [pointParams, setPointParams] = useState<PointParams>(DEFAULT_POINT_PARAMS);
  const [kpiInputs, setKpiInputs] =
    useState<Record<KpiKey, KpiInput>>(DEFAULT_KPI_INPUTS);
  const [kpiConfig, setKpiConfig] = useState<KpiConfig[]>(DEFAULT_KPI_CONFIG);
  const [positions, setPositions] = useState<PositionConfig[]>(DEFAULT_POSITIONS);
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [mounted, setMounted] = useState(false);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());

    const savedConfig = loadKpiConfig();
    if (savedConfig) setKpiConfig(savedConfig);

    const savedPositions = loadPositions();
    if (savedPositions) setPositions(savedPositions);
  }, []);

  // Сохранение настроек
  useEffect(() => {
    if (mounted) saveKpiConfig(kpiConfig);
  }, [kpiConfig, mounted]);

  useEffect(() => {
    if (mounted) savePositions(positions);
  }, [positions, mounted]);

  // Главные расчёты
  const result = useMemo(
    () => calculateBonusFund(pointParams, kpiConfig, kpiInputs),
    [pointParams, kpiConfig, kpiInputs]
  );

  const distribution = useMemo(
    () => distributeBonusFund(result.actualBonusFund, positions),
    [result.actualBonusFund, positions]
  );

  // Обработчики KPI
  const handleKpiInputChange = (key: KpiKey, field: "plan" | "fact", value: number) => {
    setKpiInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  // Обработчики позиций
  const handlePositionChange = (
    index: number,
    field: "count" | "coefficient",
    value: number
  ) => {
    setPositions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handlePositionNameChange = (index: number, name: string) => {
    setPositions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name } : p))
    );
  };

  const handleAddPosition = () => {
    setPositions((prev) => [
      ...prev,
      {
        key: `custom-${Date.now()}`,
        name: "Новая позиция",
        count: 1,
        coefficient: 1.0,
      },
    ]);
  };

  const handleRemovePosition = (index: number) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  // История
  const handleSaveToHistory = () => {
    const calc: SavedCalculation = {
      id: generateId(),
      date: new Date().toISOString(),
      pointName: pointParams.pointName,
      period: pointParams.period,
      turnover: pointParams.turnover,
      actualBonusFund: result.actualBonusFund,
      fundPerformancePercent: result.fundPerformancePercent,
      kpiInputs,
      pointParams,
      positions,
    };
    saveCalculation(calc);
    setHistory(getHistory());
  };

  const handleLoadFromHistory = (calc: SavedCalculation) => {
    setPointParams(calc.pointParams);
    setKpiInputs(calc.kpiInputs);
    setPositions(calc.positions);
    setActiveTab("calculator");
  };

  const handleDeleteFromHistory = (id: string) => {
    deleteCalculation(id);
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    if (confirm("Удалить всю историю расчётов?")) {
      clearHistory();
      setHistory([]);
    }
  };

  // Сброс настроек
  const handleResetDefaults = () => {
    if (confirm("Сбросить все настройки KPI к значениям по умолчанию?")) {
      setKpiConfig(DEFAULT_KPI_CONFIG);
      setPositions(DEFAULT_POSITIONS);
    }
  };

  // Экспорт
  const handleExportPDF = () => {
    exportToPDF(pointParams, result, distribution);
  };

  const handleExportExcel = () => {
    exportToExcel(pointParams, result, distribution, positions);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-2xl text-kex-muted italic">
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <PointParamsCard
              params={pointParams}
              onChange={setPointParams}
              maxFund={result.maxBonusFund}
            />

            <ResultsSummary result={result} />

            <KpiTable
              kpiConfig={kpiConfig}
              kpiInputs={kpiInputs}
              result={result}
              onInputChange={handleKpiInputChange}
            />

            <StaffDistribution
              positions={positions}
              distribution={distribution}
              onPositionChange={handlePositionChange}
              onAddPosition={handleAddPosition}
              onRemovePosition={handleRemovePosition}
              onPositionNameChange={handlePositionNameChange}
            />

            <ActionsBar
              onSave={handleSaveToHistory}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
            />
          </div>
        )}

        {activeTab === "history" && (
          <HistoryView
            history={history}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
            onClear={handleClearHistory}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            kpiConfig={kpiConfig}
            onKpiConfigChange={setKpiConfig}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-kex-border mt-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs text-kex-muted font-mono">
            © 2026 KEX GROUP · HR Department
          </div>
          <div className="text-xs text-kex-muted">
            Версия 1.0 · Все данные хранятся локально в браузере
          </div>
        </div>
      </footer>
    </div>
  );
}
