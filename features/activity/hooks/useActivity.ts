"use client";

import { useEffect, useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/crm-session";
import { CrmActivity, fetchCrmActivities, fetchCurrentUser } from "@/lib/api";
import type { ActivityItem } from "@/components/features/activity/ActivityTimeline";

export function useActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getStoredToken();

      if (!token) {
        setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
        setIsLoading(false);
        return;
      }

      try {
        const user = await fetchCurrentUser(token);
        const loadedActivities = await fetchCrmActivities(token, user.tenantId);
        setActivities(loadedActivities.map(mapApiActivityToUi));
      } catch (loadError) {
        clearStoredToken();
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar atividades.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  return { activities: activities.slice(0, 10), error, isLoading };
}

function mapApiActivityToUi(activity: CrmActivity): ActivityItem {
  return {
    id: activity.id,
    actor: activity.actorName,
    action: activity.action,
    target: activity.target,
    time: formatRelativeTime(activity.createdAt),
    kind: mapApiKindToUi(activity.kind),
  };
}

function mapApiKindToUi(kind: CrmActivity["kind"]): ActivityItem["kind"] {
  switch (kind) {
    case "DEAL":
      return "product";
    case "TASK":
      return "task";
    case "CONTACT":
      return "address";
    case "NOTE":
      return "category";
    default:
      return "category";
  }
}

function formatRelativeTime(createdAt: string) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m atras`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h atras`;
  return `${Math.round(diffHours / 24)}d atras`;
}
