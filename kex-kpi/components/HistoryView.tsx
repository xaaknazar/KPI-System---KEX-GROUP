"use client";

import type { SavedCalculation } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/calculations";
import { Trash2, RotateCcw, Building2, Calendar } from "lucide-react";

interface HistoryViewProps {
  history: SavedCalculation[];
  onLoad: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryView({ history, onLoad, onDelete, onClear }: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="kex-card p-12 text-center animate-slide-up">
        <div className="font-display text-3xl text-kex-muted italic mb-2">
          История пуста
        </div>
        <p className="text-sm text-kex-muted">
          Сохранённые расчёты будут отображаться здесь.
        </p>
        <p className="text-xs text-kex-muted mt-2">
          Перейдите в "Калькулятор" и нажмите "Сохранить в историю".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-kex-heading italic">
            История расчётов
          </h2>
          <p className="text-sm text-kex-muted mt-1">
            Сохранено: {history.length} {history.length === 1 ? "расчёт" : "расчётов"}
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm text-kex-muted hover:text-kex-danger transition-colors"
        >
          Очистить всё
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((calc) => (
          <div
            key={calc.id}
            className="kex-card p-5 hover:border-kex-accent/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-kex-muted mb-2">
                  <Building2 size={12} />
                  <span className="truncate">{calc.pointName}</span>
                </div>
                <div className="font-display text-2xl text-kex-heading italic truncate">
                  {calc.period}
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => onLoad(calc)}
                  className="p-2 rounded-lg text-kex-muted hover:text-kex-accent hover:bg-kex-accent/10 transition-colors"
                  title="Загрузить"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => onDelete(calc.id)}
                  className="p-2 rounded-lg text-kex-muted hover:text-kex-danger hover:bg-red-500/10 transition-colors"
                  title="Удалить"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-kex-muted">Товарооборот:</span>
                <span className="font-mono text-kex-text">
                  {formatMoney(calc.turnover)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-kex-muted">Выполнение:</span>
                <span className="font-mono text-kex-text">
                  {formatPercent(calc.fundPerformancePercent, 1)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-kex-border">
              <div className="text-xs text-kex-muted uppercase tracking-wider mb-1">
                Бонусный фонд
              </div>
              <div className="font-mono text-2xl font-bold text-kex-gold">
                {formatMoney(calc.actualBonusFund)}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-3 text-xs text-kex-muted">
              <Calendar size={11} />
              {new Date(calc.date).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
