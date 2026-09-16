"use client";

import { CheckCircle2, Clock, DollarSign, Eye, Package, Search, ShoppingBag, Truck } from "lucide-react";
import type { OrdersTableProps } from "./OrdersTable.types";

const statusLabels: Record<string, string> = {
  PENDING: "Aguardando Pagamento",
  PAID: "Em Separação",
  SHIPPED: "Enviado",
  DELIVERED: "Concluído",
  CANCELED: "Cancelado",
  awaiting_payment: "Aguardando Pagamento",
  in_preparation: "Em Separação",
  shipped: "Enviado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELED: "bg-rose-100 text-rose-800 border-rose-200",
  awaiting_payment: "bg-amber-100 text-amber-800 border-amber-200",
  in_preparation: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const filterTabs = [
  { id: "all", label: "Todos" },
  { id: "PENDING", label: "Aguardando Pagamento" },
  { id: "PAID", label: "Em Separação" },
  { id: "SHIPPED", label: "Enviados" },
  { id: "DELIVERED", label: "Concluídos" },
  { id: "CANCELED", label: "Cancelados" },
];

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value || 0,
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function OrdersTable({
  orders,
  isLoading,
  filterStatus,
  searchTerm = "",
  metrics,
  onFilterChange,
  onSearchChange,
  onOrderSelect,
}: OrdersTableProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metric KPI cards */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-500">Total Pedidos</span>
              <ShoppingBag className="h-4 w-4 text-[#6C8FB4]" />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{metrics.totalOrders}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-500">Faturamento</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {formatCurrency(metrics.totalRevenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-500">Pendentes</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{metrics.pendingCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-500">Concluídos/Env.</span>
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {metrics.shippedDeliveredCount}
            </p>
          </div>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por pedido, cliente, email ou rastreio..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6C8FB4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C8FB4]/20"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none -mx-1 px-1">
          {filterTabs.map((tab) => {
            const isActive =
              filterStatus === tab.id ||
              (tab.id === "PENDING" && filterStatus === "awaiting_payment") ||
              (tab.id === "PAID" && filterStatus === "in_preparation") ||
              (tab.id === "SHIPPED" && filterStatus === "shipped") ||
              (tab.id === "DELIVERED" && filterStatus === "completed") ||
              (tab.id === "CANCELED" && filterStatus === "cancelled");

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-[#1D2735] text-white shadow-xs"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#6C8FB4] border-t-transparent" />
            Carregando pedidos...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3 sm:px-5 font-semibold">Pedido</th>
                  <th className="px-4 py-3 sm:px-5 font-semibold">Cliente</th>
                  <th className="px-4 py-3 sm:px-5 font-semibold">Itens</th>
                  <th className="px-4 py-3 sm:px-5 font-semibold">Pagamento & Envio</th>
                  <th className="px-4 py-3 sm:px-5 font-semibold">Status</th>
                  <th className="px-4 py-3 sm:px-5 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 sm:px-5 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const statusKey = order.status;
                  const firstItem = order.items?.[0];
                  const extraItemsCount = (order.items?.length || 1) - 1;

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* Order Number & Date */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                        <p className="font-semibold text-slate-900">#{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                        <p className="font-medium text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerEmail}</p>
                      </td>

                      {/* Items Summary */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4 max-w-xs">
                        {firstItem ? (
                          <div className="text-xs text-slate-700">
                            <p className="truncate font-medium">
                              {firstItem.variant?.product?.name || "Produto"}
                              <span className="ml-1 text-slate-400 font-normal">
                                ({firstItem.variant?.size})
                              </span>
                            </p>
                            {extraItemsCount > 0 && (
                              <span className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                +{extraItemsCount} outro{extraItemsCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>

                      {/* Payment & Shipping */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            {order.paymentMethod || "PIX"}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Truck className="h-3 w-3" />
                            {order.shippingService || "Padrão"}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            statusColors[statusKey] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {statusLabels[statusKey] || statusKey}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-right font-semibold text-slate-900">
                        {formatCurrency(order.total || order.totalAmount)}
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onOrderSelect?.(order.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-[#6C8FB4] hover:text-[#6C8FB4]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


