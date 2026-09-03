import type { TeamMember, TeamRole } from "@/features/team/types/TeamMember.types";
export interface TeamMembersProps {
  members: TeamMember[];
  isLoading: boolean;
  showInviteForm: boolean;
  inviteEmail: string;
  inviteRole: TeamRole;
  onToggleInvite: () => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: TeamRole) => void;
  onInvite: () => void;
}
