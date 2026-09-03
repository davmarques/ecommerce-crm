"use client";

import Link from "next/link";
import { CheckCircle2, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { formatRelativeTime } from "@/features/dashboard/lib/dashboard-data";
import type { DashboardOverviewProps } from "./DashboardOverview.types";

const STATUS_BADGE_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELED: "bg-rose-100 text-rose-800 border-rose-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando Pagamento",
  PAID: "Em Separação",
  SHIPPED: "Enviado",
  DELIVERED: "Concluído",
  CANCELED: "Cancelado",
};

export function DashboardOverview({
  user,
  cardStats,
  recentOrders,
  recentActivities,
  ordersStatusSummary,
  chartPoints,
  targetPoints,
  monthLabels,
  isLoading,
  error,
  formatCurrency,
}: DashboardOverviewProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {getGreeting()}, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visão geral e métricas em tempo real da loja e dos clientes.
        </p>
      </div>

      {/* Error feedback */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* KPI Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardStats.map((item, index) => {
          const icons = [DollarSign, TrendingUp, CheckCircle2, Users];
          const Icon = icons[index % icons.length];

          return (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.65)] transition hover:border-[#6C8FB4]/40"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  <Icon className="h-5 w-5 text-[#6C8FB4]" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.tone === "positive"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.tone === "negative"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-sky-50 text-sky-700 border border-sky-200"
                  }`}
                >
                  {item.trend}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
            </article>
          );
        })}
      </section>

      {/* Charts Section: Receita vs Meta & Status dos Pedidos */}
      <section className="grid gap-6 xl:grid-cols-[2fr_1.2fr]">
        {/* Receita vs Meta Line Chart */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.65)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Receita vs Meta</h2>
              <p className="text-xs text-slate-500">
                Evolução nos últimos 6 meses a partir dos pedidos reais
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2F65A9]" />
                Realizado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#8DA8C9] bg-slate-100" />
                Meta
              </span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-[#F9FBFD] p-4">
            <svg viewBox="0 0 920 260" className="h-[240px] w-full">
              {[0, 1, 2, 3].map((line) => (
                <line
                  key={line}
                  x1="36"
                  y1={40 + line * 52}
                  x2="884"
                  y2={40 + line * 52}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
              ))}
              <polyline
                fill="none"
                stroke="#8DA8C9"
                strokeDasharray="6 6"
                strokeWidth="2.5"
                points={targetPoints}
              />
              <polyline
                fill="none"
                stroke="#2F65A9"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints}
              />
              {monthLabels.map((month, index) => (
                <text
                  key={month}
                  x={36 + index * (848 / Math.max(1, monthLabels.length - 1))}
                  y="250"
                  fill="#64748B"
                  fontSize="12"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {month}
                </text>
              ))}
            </svg>
          </div>
        </article>

        {/* Status dos Pedidos Breakdown */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.65)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Status dos Pedidos</h2>
              <p className="text-xs text-slate-500">Distribuição por etapa de atendimento</p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-semibold text-[#6C8FB4] hover:underline"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-6 space-y-3.5">
            {ordersStatusSummary.map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="text-slate-500">
                    {item.count} pedidos ({formatCurrency(item.value)})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, item.percentage)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Bottom Section: Últimos Pedidos & Atividade Recente */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent Orders */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.65)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#6C8FB4]" />
              <h2 className="text-lg font-bold text-slate-900">Últimos Pedidos</h2>
            </div>
            <Link
              href="/orders"
              className="text-xs font-semibold text-[#6C8FB4] hover:underline"
            >
              Gerenciar Pedidos →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">#{order.orderNumber}</p>
                    <span className="text-xs text-slate-400">•</span>
                    <p className="text-sm font-medium text-slate-700">{order.customerName}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {order.items.length} {order.items.length === 1 ? "item" : "itens"} •{" "}
                    {order.shippingService || "Envio Padrão"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-base font-bold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      STATUS_BADGE_STYLES[order.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}

            {recentOrders.length === 0 && (
              <p className="p-4 text-center text-sm text-slate-400">
                Nenhum pedido registrado até o momento.
              </p>
            )}
          </div>
        </article>

        {/* Recent Activities */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.65)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Atividade Recente</h2>
            <Link
              href="/activity"
              className="text-xs font-semibold text-[#6C8FB4] hover:underline"
            >
              Histórico →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3.5 transition hover:bg-slate-50/50"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1D2735] text-xs font-bold text-white shadow-sm">
                  {activity.actorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900">
                      {activity.actorName}
                    </strong>{" "}
                    {activity.action}{" "}
                    <strong className="text-slate-900">{activity.target}</strong>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <p className="p-4 text-center text-sm text-slate-400">
                Nenhuma atividade recente registrada.
              </p>
            )}
          </div>
        </article>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-4 text-xs font-medium text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#6C8FB4] border-t-transparent" />
          Sincronizando métricas da loja...
        </div>
      )}
    </div>
  );
}
