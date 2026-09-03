"use client";

import { useEffect, useState } from "react";
import type { TeamMember, TeamRole } from "@/features/team/types/TeamMember.types";

export function useTeamSettings() {
  const [members] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("salesperson");
  useEffect(() => {
    setIsLoading(false);
  }, []);
  function handleInvite() {
    if (!inviteEmail) return;
    setInviteEmail("");
    setShowInviteForm(false);
  }
  return {
    members,
    isLoading,
    showInviteForm,
    inviteEmail,
    inviteRole,
    setShowInviteForm,
    setInviteEmail,
    setInviteRole,
    handleInvite,
  };
}
