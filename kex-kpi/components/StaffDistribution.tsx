"use client";

import type { PositionConfig, DistributionResult } from "@/lib/types";
import { formatMoney, formatPercent } from "@/lib/calculations";
import { Users, Plus, Trash2 } from "lucide-react";

interface StaffDistributionProps {
  positions: PositionConfig[];
  distribution: DistributionResult;
  onPositionChange: (index: number, field: "count" | "coefficient", value: number) => void;
  onAddPosition: () => void;
  onRemovePosition: (index: number) => void;
  onPositionNameChange: (index: number, name: string) => void;
}

export function StaffDistribution({
  positions,
  distribution,
  onPositionChange,
  onAddPosition,
  onRemovePosition,
  onPositionNameChange,
}: StaffDistributionProps) {
  const totalPeople = positions.reduce((s, p) => s + p.count, 0);

  return (
    <div className="kex-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-kex-gold rounded-full" />
        <h2 className="text-lg font-semibold text-kex-heading">
          Распределение по сотрудникам
        </h2>
        <span className="ml-auto text-xs text-kex-muted font-mono">
          <Users size={12} className="inline mr-1" />
          {totalPeople} чел · Σ коэф. {distribution.totalCoefficients.toFixed(2)}
        </span>
      </div>

      {/* Стоимость 1 доли */}
      <div className="mb-5 p-4 rounded-xl bg-kex-elevated border border-kex-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-kex-muted uppercase tracking-wider">
              Стоимость 1 доли
            </div>
            <div className="text-2xl font-mono font-bold text-kex-gold mt-1">
              {formatMoney(distribution.shareValue)}
            </div>
          </div>
          <div className="text-xs text-kex-muted text-right max-w-xs font-mono">
            Бонус 1 чел = коэф. позиции × стоимость доли
          </div>
        </div>
      </div>

      {/* Таблица позиций */}
      <div className="space-y-2">
        {/* Заголовок */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-3 pb-2 text-[10px] text-kex-muted uppercase tracking-wider border-b border-kex-border">
          <div className="col-span-3">Позиция</div>
          <div className="col-span-1 text-center">Кол-во</div>
          <div className="col-span-1 text-center">Коэф.</div>
          <div className="col-span-2 text-center">Σ коэф.</div>
          <div className="col-span-2 text-right">Бонус 1 чел.</div>
          <div className="col-span-2 text-right">Всего</div>
          <div className="col-span-1 text-right">Доля</div>
        </div>

        {distribution.positions.map((p, i) => (
          <div
            key={p.key}
            className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg bg-kex-elevated/50 hover:bg-kex-elevated transition-colors group"
          >
            {/* Название */}
            <div className="col-span-12 md:col-span-3">
              <input
                type="text"
                value={positions[i].name}
                onChange={(e) => onPositionNameChange(i, e.target.value)}
                className="kex-input w-full text-sm font-sans bg-transparent border-transparent hover:border-kex-border focus:border-kex-accent"
              />
            </div>

            {/* Кол-во */}
            <div className="col-span-3 md:col-span-1">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">Кол-во</div>
              <input
                type="number"
                min="0"
                value={positions[i].count}
                onChange={(e) => onPositionChange(i, "count", Number(e.target.value))}
                className="kex-input w-full text-center text-sm"
              />
            </div>

            {/* Коэффициент */}
            <div className="col-span-3 md:col-span-1">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">Коэф.</div>
              <input
                type="number"
                step="0.1"
                min="0"
                value={positions[i].coefficient}
                onChange={(e) => onPositionChange(i, "coefficient", Number(e.target.value))}
                className="kex-input w-full text-center text-sm"
              />
            </div>

            {/* Σ коэф. */}
            <div className="col-span-3 md:col-span-2 text-center">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">Σ коэф.</div>
              <div className="text-sm font-mono text-kex-muted">{p.totalCoef.toFixed(2)}</div>
            </div>

            {/* Бонус 1 чел */}
            <div className="col-span-6 md:col-span-2 text-right">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">1 чел</div>
              <div className="text-sm font-mono text-kex-text">
                {formatMoney(p.bonusPerPerson)}
              </div>
            </div>

            {/* Всего */}
            <div className="col-span-6 md:col-span-2 text-right">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">Всего</div>
              <div className="text-sm font-mono font-bold text-kex-gold">
                {formatMoney(p.totalBonus)}
              </div>
            </div>

            {/* Доля */}
            <div className="col-span-10 md:col-span-1 text-right">
              <div className="md:hidden text-[10px] text-kex-muted uppercase mb-1">Доля</div>
              <div className="text-xs font-mono text-kex-muted">
                {formatPercent(p.shareOfFund, 1)}
              </div>
            </div>

            {/* Удаление */}
            <div className="col-span-2 md:col-span-1 flex justify-end">
              {positions.length > 1 && (
                <button
                  onClick={() => onRemovePosition(i)}
                  className="p-1.5 rounded-lg text-kex-muted hover:text-kex-danger hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Удалить позицию"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-kex-border">
        <button
          onClick={onAddPosition}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-kex-muted hover:text-kex-accent hover:bg-kex-accent/10 transition-colors"
        >
          <Plus size={14} />
          Добавить позицию
        </button>
        <div className="text-sm font-mono text-kex-muted">
          Проверка: <span className="text-kex-text font-bold">{formatMoney(distribution.checkSum)}</span>
        </div>
      </div>
    </div>
  );
}
