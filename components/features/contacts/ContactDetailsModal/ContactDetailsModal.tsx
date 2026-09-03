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
      setError("Sessao nao encontrada.");
      return;
    }

    setContact(null);
    setError(null);
    setIsLoading(true);

    void fetchCrmContact(token, contactId)
      .then(setContact)
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar o contato.",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do contato"
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">Perfil do contato</p>
            <h2 className="text-xl font-semibold text-slate-900">
              {contact?.name || "Carregando..."}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5">
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando dados do contato...</p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          ) : null}
          {contact ? (
            <>
              <section>
                <h3 className="text-sm font-semibold text-slate-900">Dados do cliente</h3>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">E-mail</dt>
                    <dd className="font-medium text-slate-800">{contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Telefone</dt>
                    <dd className="font-medium text-slate-800">
                      {contact.phone || "Nao informado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">CPF</dt>
                    <dd className="font-medium text-slate-800">{contact.cpf || "Nao informado"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Cadastro</dt>
                    <dd className="font-medium text-slate-800">{formatDate(contact.createdAt)}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-slate-900">Enderecos</h3>
                <div className="mt-3 space-y-3">
                  {contact.addresses.length ? (
                    contact.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="rounded-md border border-slate-200 p-3 text-sm text-slate-700"
                      >
                        <p className="font-medium text-slate-900">
                          {address.street}, {address.number}
                          {address.complement ? ` - ${address.complement}` : ""}
                        </p>
                        <p>
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p>
                          CEP {address.zipCode}
                          {address.isDefault ? " - Principal" : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Nenhum endereco cadastrado.</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-slate-900">
                  Compras ({contact.orders.length})
                </h3>
                <div className="mt-3 space-y-3">
                  {contact.orders.length ? (
                    contact.orders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-md border border-slate-200 p-4 text-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              Pedido #{order.orderNumber}
                            </p>
                            <p className="text-slate-500">
                              {formatDate(order.createdAt)} - {order.status}
                            </p>
                          </div>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <ul className="mt-3 space-y-1 text-slate-700">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity}x {item.variant.product.name} ({item.variant.size}, SKU{" "}
                              {item.variant.sku}) - {formatCurrency(item.price)}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-slate-600">
                          Pagamento: {order.paymentMethod} | Frete: {order.shippingService} (
                          {formatCurrency(order.shippingCost)})
                        </p>
                        <p className="text-slate-600">
                          Entrega: {order.shippingAddress}, {order.shippingCity}/
                          {order.shippingState} - CEP {order.shippingZip}
                        </p>
                        {order.trackingCode ? (
                          <p className="text-slate-600">Rastreio: {order.trackingCode}</p>
                        ) : null}
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Nenhuma compra realizada.</p>
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
