import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фирменная палитра KEX Group — глубокий синий
        kex: {
          bg: "#0A0F1A",        // Фоновый — почти чёрный с синевой
          surface: "#111827",   // Карточки
          elevated: "#1A2236",  // Поднятые карточки
          border: "#1F2A3F",    // Границы
          muted: "#64748B",     // Приглушённый текст
          text: "#E2E8F0",      // Основной текст
          heading: "#F8FAFC",   // Заголовки
          accent: "#3B82F6",    // Акцент основной (синий)
          accent2: "#60A5FA",   // Акцент светлее
          gold: "#F59E0B",      // Золотой акцент для итогов
          success: "#10B981",   // Зелёный
          warning: "#F59E0B",   // Жёлтый
          danger: "#EF4444",    // Красный
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 50%)",
      },
      boxShadow: {
        "glow": "0 0 40px rgba(59,130,246,0.15)",
        "card": "0 4px 16px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
