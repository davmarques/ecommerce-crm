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
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggleInvite}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
        >
          + Convidar Usuário
        </button>
      </div>
      {showInviteForm && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Convidar Novo Usuário</h2>
          <div className="space-y-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="usuario@exemplo.com"
            />
            <select
              value={inviteRole}
              onChange={(event) => onRoleChange(event.target.value as TeamRole)}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="salesperson">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
            <button
              type="button"
              onClick={onInvite}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Enviar Convite
            </button>
          </div>
        </div>
      )}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Membros da Equipe</h2>
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Carregando membros...</div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Nenhum membro encontrado</div>
        ) : (
          <ul>
            {members.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
