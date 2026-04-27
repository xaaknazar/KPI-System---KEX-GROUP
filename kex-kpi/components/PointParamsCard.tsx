"use client";

import type { PointParams } from "@/lib/types";
import { formatMoney } from "@/lib/calculations";
import { Building2, Calendar, TrendingUp, Percent, ShieldCheck } from "lucide-react";
import { getAuditCoefficient } from "@/lib/calculations";

interface PointParamsCardProps {
  params: PointParams;
  onChange: (params: PointParams) => void;
  maxFund: number;
}

export function PointParamsCard({ params, onChange, maxFund }: PointParamsCardProps) {
  const audit = getAuditCoefficient(params.auditScore);

  const auditColor = {
    review: "text-kex-danger",
    reduced: "text-kex-warning",
    ok: "text-kex-success",
  }[audit.status];

  const auditBg = {
    review: "bg-red-500/10 border-red-500/30",
    reduced: "bg-amber-500/10 border-amber-500/30",
    ok: "bg-emerald-500/10 border-emerald-500/30",
  }[audit.status];

  return (
    <div className="kex-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-kex-accent rounded-full" />
        <h2 className="text-lg font-semibold text-kex-heading">Параметры точки</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Название */}
        <div>
          <label className="flex items-center gap-2 text-xs text-kex-muted uppercase tracking-wider mb-2">
            <Building2 size={12} />
            Название точки
          </label>
          <input
            type="text"
            value={params.pointName}
            onChange={(e) => onChange({ ...params, pointName: e.target.value })}
            className="kex-input w-full font-sans"
          />
        </div>

        {/* Период */}
        <div>
          <label className="flex items-center gap-2 text-xs text-kex-muted uppercase tracking-wider mb-2">
            <Calendar size={12} />
            Период
          </label>
          <input
            type="text"
            value={params.period}
            onChange={(e) => onChange({ ...params, period: e.target.value })}
            className="kex-input w-full font-sans"
          />
        </div>

        {/* Товарооборот */}
        <div>
          <label className="flex items-center gap-2 text-xs text-kex-muted uppercase tracking-wider mb-2">
            <TrendingUp size={12} />
            Товарооборот за месяц, тг
          </label>
          <input
            type="number"
            value={params.turnover}
            onChange={(e) => onChange({ ...params, turnover: Number(e.target.value) })}
            className="kex-input w-full"
          />
          <div className="text-xs text-kex-muted mt-1 font-mono">
            {formatMoney(params.turnover)}
          </div>
        </div>

        {/* % бонусного фонда */}
        <div>
          <label className="flex items-center gap-2 text-xs text-kex-muted uppercase tracking-wider mb-2">
            <Percent size={12} />
            % от оборота на бонусный фонд
          </label>
          <input
            type="number"
            step="0.001"
            value={params.bonusPercent}
            onChange={(e) => onChange({ ...params, bonusPercent: Number(e.target.value) })}
            className="kex-input w-full"
          />
          <div className="text-xs text-kex-muted mt-1 font-mono">
            {(params.bonusPercent * 100).toFixed(1)}% = {formatMoney(maxFund)}
          </div>
        </div>
      </div>

      {/* Аудит — отдельным акцентным блоком */}
      <div className={`mt-5 p-4 rounded-xl border ${auditBg}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldCheck className={auditColor} size={20} />
            <div>
              <div className="text-xs text-kex-muted uppercase tracking-wider">
                Балл операционного аудита
              </div>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={params.auditScore}
                  onChange={(e) =>
                    onChange({ ...params, auditScore: Number(e.target.value) })
                  }
                  className="kex-input w-20 text-lg font-bold"
                />
                <span className="text-kex-muted">%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-kex-muted uppercase tracking-wider">Коэф.</div>
              <div className={`text-2xl font-bold font-mono ${auditColor}`}>
                {audit.coefficient.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-kex-muted uppercase tracking-wider">Статус</div>
              <div className={`text-sm font-bold uppercase tracking-wider ${auditColor}`}>
                {audit.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
