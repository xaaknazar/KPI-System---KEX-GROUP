"use client";

import { Calculator, History, Settings } from "lucide-react";

interface HeaderProps {
  activeTab: "calculator" | "history" | "settings";
  onTabChange: (tab: "calculator" | "history" | "settings") => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { key: "calculator" as const, label: "Калькулятор", icon: Calculator },
    { key: "history" as const, label: "История", icon: History },
    { key: "settings" as const, label: "Настройки", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-kex-bg/80 border-b border-kex-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Лого */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="KEX Group" className="h-10" />
            <div className="hidden md:block w-px h-8 bg-kex-border" />
            <div className="hidden md:block">
              <div className="text-xs text-kex-muted uppercase tracking-wider font-medium">
                HR Department
              </div>
              <div className="font-display text-xl text-kex-heading italic leading-tight">
                KPI Калькулятор
              </div>
            </div>
          </div>

          {/* Табы */}
          <nav className="flex gap-1 p-1 rounded-xl bg-kex-surface border border-kex-border">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => onTabChange(key)}
                  className={`
                    flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-kex-accent text-white shadow-glow"
                        : "text-kex-muted hover:text-kex-text hover:bg-kex-elevated"
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
