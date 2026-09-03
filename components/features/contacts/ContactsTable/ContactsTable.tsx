import { Mail, Phone } from "lucide-react";
import type { ContactsTableProps } from "./ContactsTable.types";

export function ContactsTable({ contacts, isLoading, onContactSelect }: ContactsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-500">
            <th className="px-4 py-3 font-semibold">Contato</th>
            <th className="px-4 py-3 font-semibold">Empresa</th>
            <th className="px-4 py-3 font-semibold">Localidade</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Valor estimado</th>
            <th className="px-4 py-3">
              <span className="sr-only">Abrir detalhes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{contact.name}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {contact.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {contact.phone}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-700">{contact.company}</td>
              <td className="px-4 py-3 text-slate-700">
                {contact.state ? `${contact.city}/${contact.state}` : contact.city}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${contact.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {contact.status === "active" ? "Ativo" : "Lead"}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">
                ${Math.round(contact.value / 1000)}k
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onContactSelect(contact.id)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-700"
                >
                  Ver perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && contacts.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">Nenhum contato encontrado.</p>
      ) : null}
      {isLoading ? <p className="p-4 text-sm text-slate-500">Carregando contatos...</p> : null}
    </div>
  );
}
