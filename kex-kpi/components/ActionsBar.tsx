"use client";

import { Save, FileDown, FileSpreadsheet, Check } from "lucide-react";
import { useState } from "react";

interface ActionsBarProps {
  onSave: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function ActionsBar({ onSave, onExportPDF, onExportExcel }: ActionsBarProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="kex-card p-4 animate-slide-up">
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={handleSave}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              saved
                ? "bg-kex-success/20 text-kex-success border border-kex-success/30"
                : "bg-kex-accent text-white hover:bg-blue-500 shadow-glow"
            }
          `}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Сохранено" : "Сохранить в историю"}
        </button>

        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-kex-elevated text-kex-text hover:bg-kex-border border border-kex-border transition-colors"
        >
          <FileDown size={16} />
          PDF
        </button>

        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-kex-elevated text-kex-text hover:bg-kex-border border border-kex-border transition-colors"
        >
          <FileSpreadsheet size={16} />
          Excel
        </button>
      </div>
    </div>
  );
}
