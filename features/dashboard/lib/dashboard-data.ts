import type { CrmDealStage } from "@/lib/api";

export const STAGE_CONFIG: Record<CrmDealStage, { label: string; color: string }> = {
  LEAD: { label: "Lead", color: "#6A87A7" },
  QUALIFIED: { label: "Qualificado", color: "#2D9BA0" },
  PROPOSAL: { label: "Proposta", color: "#F2A107" },
  NEGOTIATION: { label: "Negociação", color: "#E2384D" },
  WON: { label: "Ganho", color: "#389B5D" },
};

export function formatCompactCurrency(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  if (safeValue >= 1_000_000) return `R$ ${(safeValue / 1_000_000).toFixed(1)}M`;
  if (safeValue >= 1_000) return `R$ ${(safeValue / 1_000).toFixed(1)}k`;
  return `R$ ${Math.round(safeValue)}`;
}

export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value || 0,
  );
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "agora mesmo";
  if (diffInMinutes < 60) return `há ${diffInMinutes}m`;
  if (diffInHours < 24) return `há ${diffInHours}h`;
  if (diffInDays === 1) return "ontem";
  if (diffInDays < 7) return `há ${diffInDays} dias`;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date);
}

export function generateLast6Months() {
  const months: Array<{ label: string; monthIndex: number; year: number }> = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleDateString("pt-BR", { month: "short" });
    const formattedLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1, 3);
    months.push({
      label: formattedLabel,
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
    });
  }

  return months;
}

export function createLinePoints(series: number[], width: number, height: number) {
  if (series.length <= 1) return "36,120 880,120";

  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const range = max - min || 1;
  const step = (width - 72) / (series.length - 1);

  return series
    .map((value, index) => {
      const x = 36 + index * step;
      const normalized = (value - min) / range;
      const y = 30 + (1 - normalized) * (height - 60);
      return `${Math.round(x)},${Math.round(y)}`;
    })
    .join(" ");
}
