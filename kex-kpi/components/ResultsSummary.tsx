"use client";

import type { CalculationResult } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/calculations";
import { Sparkles } from "lucide-react";

interface ResultsSummaryProps {
  result: CalculationResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {
  return (
    <div className="relative kex-card p-6 overflow-hidden animate-slide-up">
      {/* Декоративный градиент */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-kex-gold" />
          <span className="text-xs text-kex-muted uppercase tracking-widest font-medium">
            Итоговый бонусный фонд точки
          </span>
        </div>

        <div className="flex items-baseline gap-3 mt-3 flex-wrap">
          <div className="font-display text-5xl md:text-6xl text-kex-heading italic">
            {formatMoney(result.actualBonusFund)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-kex-border">
          <div>
            <div className="text-xs text-kex-muted uppercase tracking-wider mb-1">
              Максимальный фонд
            </div>
            <div className="text-lg font-mono text-kex-text">
              {formatMoney(result.maxBonusFund)}
            </div>
          </div>
          <div>
            <div className="text-xs text-kex-muted uppercase tracking-wider mb-1">
              Выполнение
            </div>
            <div className="text-lg font-mono text-kex-gold font-bold">
              {formatPercent(result.fundPerformancePercent, 1)}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-xs text-kex-muted uppercase tracking-wider mb-1">
              Коэф. аудита
            </div>
            <div className="text-lg font-mono text-kex-text">
              × {result.auditCoefficient.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="mt-5">
          <div className="h-2 bg-kex-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-kex-accent to-kex-gold rounded-full transition-all duration-500"
              style={{ width: `${Math.min(result.fundPerformancePercent * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
