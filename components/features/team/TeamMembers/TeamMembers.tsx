import type { TeamRole } from "@/features/team/types/TeamMember.types";
import type { TeamMembersProps } from "./TeamMembers.types";

export function TeamMembers({
  members,
  isLoading,
  showInviteForm,
  inviteEmail,
  inviteRole,
  onToggleInvite,
  onEmailChange,
  onRoleChange,
  onInvite,
}: TeamMembersProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggleInvite}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          + Convidar Usuário
        </button>
      </div>

      {showInviteForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-900">Convidar Novo Usuário</h2>
          <div className="space-y-3.5">
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="usuario@exemplo.com"
            />
            <select
              value={inviteRole}
              onChange={(event) => onRoleChange(event.target.value as TeamRole)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="salesperson">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
            <button
              type="button"
              onClick={onInvite}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              Enviar Convite
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
        <h2 className="mb-4 text-base sm:text-lg font-bold text-slate-900">Membros da Equipe</h2>
        {isLoading ? (
          <div className="py-12 text-center text-xs sm:text-sm text-slate-500">Carregando membros...</div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-xs sm:text-sm text-slate-500">Nenhum membro encontrado</div>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between p-3 sm:px-4 text-xs sm:text-sm">
                <span className="font-medium text-slate-900">{member.name}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">{member.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

