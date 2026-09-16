import { Mail, Phone } from "lucide-react";
import type { ContactsTableProps } from "./ContactsTable.types";

export function ContactsTable({ contacts, isLoading, onContactSelect }: ContactsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <th className="px-4 py-3 sm:px-5">Contato</th>
              <th className="px-4 py-3 sm:px-5">Empresa</th>
              <th className="px-4 py-3 sm:px-5">Localidade</th>
              <th className="px-4 py-3 sm:px-5">Status</th>
              <th className="px-4 py-3 sm:px-5 text-right">Valor estimado</th>
              <th className="px-4 py-3 sm:px-5 text-right">
                <span className="sr-only">Abrir detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                  <p className="font-medium text-slate-900">{contact.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {contact.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {contact.phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-xs sm:text-sm text-slate-700">{contact.company}</td>
                <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-xs sm:text-sm text-slate-700">
                  {contact.state ? `${contact.city}/${contact.state}` : contact.city}
                </td>
                <td className="px-4 py-3.5 sm:px-5 sm:py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      contact.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {contact.status === "active" ? "Ativo" : "Lead"}
                  </span>
                </td>
                <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-right font-semibold text-slate-900">
                  ${Math.round(contact.value / 1000)}k
                </td>
                <td className="px-4 py-3.5 sm:px-5 sm:py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onContactSelect(contact.id)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#6C8FB4] hover:text-[#6C8FB4]"
                  >
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && contacts.length === 0 ? (
        <p className="p-8 text-center text-xs sm:text-sm text-slate-500">Nenhum contato encontrado.</p>
      ) : null}
      {isLoading ? <p className="p-8 text-center text-xs sm:text-sm text-slate-500">Carregando contatos...</p> : null}
    </div>
  );
}

