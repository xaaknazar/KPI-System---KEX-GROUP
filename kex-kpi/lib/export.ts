"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type {
  CalculationResult,
  DistributionResult,
  PointParams,
  PositionConfig,
} from "./types";
import { formatMoney, formatPercent, formatKpiValue } from "./calculations";
import { DEFAULT_KPI_CONFIG } from "./constants";

/**
 * Экспорт расчёта в Excel
 */
export function exportToExcel(
  pointParams: PointParams,
  result: CalculationResult,
  distribution: DistributionResult,
  positions: PositionConfig[]
): void {
  const wb = XLSX.utils.book_new();

  // Лист 1: Параметры и фонд
  const sheet1Data: any[][] = [
    ["KEX Group — Расчёт KPI бонусного фонда"],
    [],
    ["Точка:", pointParams.pointName],
    ["Период:", pointParams.period],
    ["Товарооборот:", pointParams.turnover],
    ["% от оборота на фонд:", pointParams.bonusPercent],
    ["Максимальный фонд:", result.maxBonusFund],
    ["Балл аудита:", pointParams.auditScore + "%"],
    ["Коэф. аудита:", result.auditCoefficient],
    [],
    ["KPI", "Вес", "План", "Факт", "Выполнение", "Коэф.", "Бонус, тг"],
    ...result.kpiResults.map((kpi) => {
      const cfg = DEFAULT_KPI_CONFIG.find((c) => c.key === kpi.key)!;
      return [
        kpi.name,
        kpi.weight,
        kpi.plan,
        kpi.fact,
        kpi.performance,
        kpi.coefficient,
        kpi.bonus,
      ];
    }),
    [],
    ["ФАКТИЧЕСКИЙ ФОНД ТОЧКИ:", "", "", "", "", "", result.actualBonusFund],
    ["% от максимального:", "", "", "", "", "", result.fundPerformancePercent],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  ws1["!cols"] = [
    { wch: 30 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "Фонд точки");

  // Лист 2: Распределение
  const sheet2Data: any[][] = [
    ["Распределение фонда по сотрудникам"],
    [],
    ["Бонусный фонд:", result.actualBonusFund],
    ["Сумма коэффициентов:", distribution.totalCoefficients],
    ["Стоимость 1 доли:", distribution.shareValue],
    [],
    ["Позиция", "Кол-во", "Коэф.", "Сумма коэф.", "Бонус 1 чел.", "Всего", "Доля"],
    ...distribution.positions.map((p) => [
      p.name,
      p.count,
      p.coefficient,
      p.totalCoef,
      p.bonusPerPerson,
      p.totalBonus,
      p.shareOfFund,
    ]),
    [],
    ["ИТОГО:", "", "", "", "", distribution.checkSum, ""],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  ws2["!cols"] = [
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, "Распределение");

  const filename = `KEX_KPI_${pointParams.pointName}_${pointParams.period}.xlsx`.replace(
    /[\\/:*?"<>|]/g,
    "_"
  );
  XLSX.writeFile(wb, filename);
}

/**
 * Экспорт расчёта в PDF
 */
export function exportToPDF(
  pointParams: PointParams,
  result: CalculationResult,
  distribution: DistributionResult
): void {
  const doc = new jsPDF();

  // Шапка
  doc.setFillColor(10, 15, 26);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(20);
  doc.text("KEX Group", 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(226, 232, 240);
  doc.text("Расчёт KPI бонусного фонда", 14, 28);

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(new Date().toLocaleDateString("ru-RU"), 196 - 30, 18);

  // Параметры точки
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  let y = 50;
  doc.text(`Tochka: ${pointParams.pointName}`, 14, y);
  y += 7;
  doc.text(`Period: ${pointParams.period}`, 14, y);
  y += 7;
  doc.text(`Tovarooborot: ${formatMoney(pointParams.turnover)}`, 14, y);
  y += 7;
  doc.text(
    `Maks. fond (${(pointParams.bonusPercent * 100).toFixed(1)}%): ${formatMoney(result.maxBonusFund)}`,
    14,
    y
  );
  y += 7;
  doc.text(
    `Ball audita: ${pointParams.auditScore}% (koef. ${result.auditCoefficient.toFixed(2)})`,
    14,
    y
  );
  y += 10;

  // Таблица KPI
  autoTable(doc, {
    startY: y,
    head: [["KPI", "Ves", "Plan", "Fakt", "Vyp.", "Koef.", "Bonus"]],
    body: result.kpiResults.map((k) => [
      k.name,
      formatPercent(k.weight, 0),
      formatKpiValue(k.plan, getFormat(k.key)),
      formatKpiValue(k.fact, getFormat(k.key)),
      formatPercent(k.performance, 1),
      k.coefficient.toFixed(2),
      formatMoney(k.bonus),
    ]),
    theme: "grid",
    headStyles: { fillColor: [31, 78, 120], textColor: 255 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 50 },
      6: { halign: "right" },
    },
  });

  // @ts-ignore - autotable добавляет lastAutoTable
  y = (doc as any).lastAutoTable.finalY + 10;

  // Итоговый блок
  doc.setFillColor(245, 158, 11);
  doc.rect(14, y, 182, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("FAKTICHESKIY FOND TOCHKI:", 18, y + 10);
  doc.setFontSize(13);
  doc.text(formatMoney(result.actualBonusFund), 196 - 4, y + 10, { align: "right" });
  y += 22;

  // Распределение
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.text("Raspredelenie po sotrudnikam", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Pozitsiya", "Kol-vo", "Koef.", "Bonus/chel", "Vsego", "Dolya"]],
    body: distribution.positions.map((p) => [
      p.name,
      p.count.toString(),
      p.coefficient.toFixed(1),
      formatMoney(p.bonusPerPerson),
      formatMoney(p.totalBonus),
      formatPercent(p.shareOfFund, 1),
    ]),
    theme: "grid",
    headStyles: { fillColor: [31, 78, 120], textColor: 255 },
    styles: { fontSize: 8 },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  const filename = `KEX_KPI_${pointParams.pointName}_${pointParams.period}.pdf`.replace(
    /[\\/:*?"<>|]/g,
    "_"
  );
  doc.save(filename);
}

function getFormat(key: string): string {
  const cfg = DEFAULT_KPI_CONFIG.find((c) => c.key === key);
  return cfg?.format || "number";
}
