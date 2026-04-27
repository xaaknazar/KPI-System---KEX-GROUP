import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KEX Group — KPI Калькулятор",
  description: "Система расчёта KPI бонусов для управляющих точек KEX Group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
