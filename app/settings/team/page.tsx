"use client";

import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { TeamMembers } from "@/components/features/team/TeamMembers";
import { useTeamSettings } from "@/features/team/hooks/useTeamSettings";

export default function TeamSettingsPage() {
  const state = useTeamSettings();
  return (
    <CrmPageShell title="Gestão da Equipe" description="Gerencie usuários e permissões de acesso">
      <TeamMembers
        members={state.members}
        isLoading={state.isLoading}
        showInviteForm={state.showInviteForm}
        inviteEmail={state.inviteEmail}
        inviteRole={state.inviteRole}
        onToggleInvite={() => state.setShowInviteForm((value) => !value)}
        onEmailChange={state.setInviteEmail}
        onRoleChange={state.setInviteRole}
        onInvite={state.handleInvite}
      />
    </CrmPageShell>
  );
}
