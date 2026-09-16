"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ApiCrmContactDetails, fetchCrmContact } from "@/lib/api";
import { getStoredToken } from "@/lib/crm-session";
import type { ContactDetailsModalProps } from "./ContactDetailsModal.types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

export function ContactDetailsModal({ contactId, onClose }: ContactDetailsModalProps) {
  const [contact, setContact] = useState<ApiCrmContactDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!contactId) return;

    const token = getStoredToken();
    if (!token) {
      setError("Sessão não encontrada.");
      return;
    }

    setContact(null);
    setError(null);
    setIsLoading(true);

    void fetchCrmContact(token, contactId)
      .then(setContact)
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : "Não foi possível carregar o contato.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, [contactId]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!contactId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do contato"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase text-teal-700">Perfil do contato</p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {contact?.name || "Carregando..."}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 sm:space-y-6 p-4 sm:p-5">
          {isLoading ? (
            <p className="text-xs sm:text-sm text-slate-500">Carregando dados do contato...</p>
          ) : null}
          {error ? (
            <p className="rounded-xl bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">{error}</p>
          ) : null}
          {contact ? (
            <>
              <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Dados do cliente</h3>
                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <dt className="text-slate-500 text-xs">E-mail</dt>
                    <dd className="font-medium text-slate-800 break-all">{contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Telefone</dt>
                    <dd className="font-medium text-slate-800">
                      {contact.phone || "Não informado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">CPF</dt>
                    <dd className="font-medium text-slate-800">{contact.cpf || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Data de Cadastro</dt>
                    <dd className="font-medium text-slate-800">{formatDate(contact.createdAt)}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">Endereços</h3>
                <div className="mt-3 space-y-2.5 sm:space-y-3">
                  {contact.addresses.length ? (
                    contact.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 sm:p-3.5 text-xs sm:text-sm text-slate-700"
                      >
                        <p className="font-semibold text-slate-900">
                          {address.street}, {address.number}
                          {address.complement ? ` - ${address.complement}` : ""}
                        </p>
                        <p className="mt-0.5 text-slate-600">
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p className="text-slate-500 text-xs">
                          CEP {address.zipCode}
                          {address.isDefault ? " • Endereço Principal" : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500">Nenhum endereço cadastrado.</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Compras ({contact.orders.length})
                </h3>
                <div className="mt-3 space-y-3">
                  {contact.orders.length ? (
                    contact.orders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 text-xs sm:text-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              Pedido #{order.orderNumber}
                            </p>
                            <p className="text-[11px] sm:text-xs text-slate-500">
                              {formatDate(order.createdAt)} • Status: {order.status}
                            </p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <ul className="mt-2.5 space-y-1 text-slate-700">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-xs">
                              {item.quantity}x {item.variant.product.name} ({item.variant.size}, SKU{" "}
                              {item.variant.sku}) - {formatCurrency(item.price)}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] sm:text-xs text-slate-600 space-y-0.5">
                          <p>
                            Pagamento: {order.paymentMethod} | Frete: {order.shippingService} (
                            {formatCurrency(order.shippingCost)})
                          </p>
                          <p>
                            Entrega: {order.shippingAddress}, {order.shippingCity}/
                            {order.shippingState} - CEP {order.shippingZip}
                          </p>
                          {order.trackingCode ? (
                            <p className="font-mono text-purple-700 font-medium">Rastreio: {order.trackingCode}</p>
                          ) : null}
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500">Nenhuma compra realizada.</p>
                  )}
                </div>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

