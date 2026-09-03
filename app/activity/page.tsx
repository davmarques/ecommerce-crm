"use client";

import { useActivity } from "@/features/activity/hooks/useActivity";
import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { CrmFeedback } from "@/components/ui/CrmFeedback";
import { ActivityTimeline } from "@/components/features/activity/ActivityTimeline";

export default function ActivityPage() {
  const { activities, error, isLoading } = useActivity();

  return (
    <CrmPageShell
      title="Atividades"
      description="Timeline montada com eventos reais dos recursos carregados do backend."
      maxWidthClassName="max-w-4xl"
    >
      <ActivityTimeline items={activities} isLoading={isLoading} />
      <CrmFeedback error={error} />
    </CrmPageShell>
  );
}
