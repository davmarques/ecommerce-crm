"use client";

import { useEffect } from "react";
import { CreditCard, MapPin, Package, Phone, Truck, User, X } from "lucide-react";
import type { OrderStatus } from "@/features/orders/types/Order.types";
import type { OrderDetailsModalProps } from "./OrderDetailsModal.types";

const statusLabels: Record<string, string> = {
  PENDING: "Aguardando Pagamento",
  PAID: "Pago / Em Separação",
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
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  PAID: "bg-blue-100 text-blue-800 border-blue-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELED: "bg-rose-100 text-rose-800 border-rose-300",
  awaiting_payment: "bg-amber-100 text-amber-800 border-amber-300",
  in_preparation: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
};

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value || 0,
  );
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
  isUpdatingStatus = false,
}: OrderDetailsModalProps) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!order) return null;

  const currentStatus = order.status;
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const total = order.total || order.totalAmount || subtotal + (order.shippingCost || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do pedido #${order.orderNumber}`}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6C8FB4]">
                Pedido
              </p>
              <h2 className="text-xl font-bold text-slate-900">#{order.orderNumber}</h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusColors[currentStatus] || "bg-slate-100 text-slate-800"
              }`}
            >
              {statusLabels[currentStatus] || currentStatus}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {/* Status Changer Toolbar */}
          {onStatusChange && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Alterar Status</p>
                <p className="text-sm font-medium text-slate-800">
                  Atualize o progresso deste pedido no sistema
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"] as OrderStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={isUpdatingStatus || order.status === status}
                      onClick={() => onStatusChange(order.id, status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        order.status === status
                          ? "bg-[#1D2735] text-white shadow-sm"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      } disabled:opacity-50`}
                    >
                      {statusLabels[status]}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Grid with Client & Shipping Data */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Customer Info Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-800">
                <User className="h-4 w-4 text-[#6C8FB4]" />
                <h3 className="text-sm font-semibold">Dados do Cliente</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">{order.customerName}</strong>
                </p>
                <p className="text-xs">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="flex items-center gap-1.5 text-xs">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {order.customerPhone}
                  </p>
                )}
                {order.customerCpf && (
                  <p className="text-xs text-slate-500">CPF: {order.customerCpf}</p>
                )}
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-800">
                <MapPin className="h-4 w-4 text-[#6C8FB4]" />
                <h3 className="text-sm font-semibold">Entrega & Rastreio</h3>
              </div>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="text-xs text-slate-800">{order.shippingAddress || "Endereço não informado"}</p>
                <p className="text-xs">
                  {order.shippingCity && order.shippingState
                    ? `${order.shippingCity} - ${order.shippingState}`
                    : ""}
                  {order.shippingZip ? ` | CEP ${order.shippingZip}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    <Truck className="h-3 w-3" />
                    {order.shippingService || "Envio padrão"}
                  </span>
                  {order.trackingCode && (
                    <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-mono font-medium text-purple-700">
                      {order.trackingCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
              <Package className="h-4 w-4 text-[#6C8FB4]" />
              <h3 className="text-sm font-semibold text-slate-900">Itens do Pedido</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{item.variant?.product?.name}</p>
                      <p className="text-xs text-slate-500">
                        Tam: {item.variant?.size} {item.variant?.color ? `• Cor: ${item.variant.color}` : ""}{" "}
                        • SKU: {item.variant?.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {item.quantity}x {formatCurrency(item.price)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-500">Nenhum item listado neste pedido.</p>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#6C8FB4]" />
                <span className="text-sm font-semibold text-slate-900">Resumo Financeiro</span>
              </div>
              <span className="rounded bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm border border-slate-200">
                {order.paymentMethod || "PIX"}
              </span>
            </div>
            <div className="space-y-1.5 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({order.items?.length || 0} itens)</span>
                <span>{formatCurrency(subtotal || total - (order.shippingCost || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete ({order.shippingService || "Padrão"})</span>
                <span>{formatCurrency(order.shippingCost || 0)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Total</span>
                <span className="text-base text-slate-950">{formatCurrency(total)}</span>
              </div>
              <div className="mt-2 text-right text-xs text-slate-400">
                Realizado em: {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
