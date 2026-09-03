"use client";

import { useEffect, useMemo, useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/crm-session";
import {
  CrmTask,
  CrmTaskPriority,
  CrmTaskType,
  fetchCrmTasks,
  fetchCurrentUser,
  toggleCrmTask,
} from "@/lib/api";
import type { TaskItem, TaskPriority, TaskType } from "@/components/features/tasks/types/TaskTypes";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingTaskId, setIsTogglingTaskId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

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
        setTenantId(user.tenantId);
        setTasks((await fetchCrmTasks(token, user.tenantId)).map(mapApiTaskToUiTask));
      } catch (loadError) {
        clearStoredToken();
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar tarefas.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  async function toggleTask(id: string) {
    const token = getStoredToken();
    if (!token) {
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
      return;
    }
    if (!tenantId) {
      setError("Tenant da sessao nao encontrado.");
      return;
    }
    setIsTogglingTaskId(id);
    setError(null);
    try {
      const updated = await toggleCrmTask(token, id);
      if (updated.tenantId !== tenantId)
        throw new Error("Tarefa atualizada pertence a outro tenant.");
      setTasks((current) =>
        current.map((task) => (task.id === id ? mapApiTaskToUiTask(updated) : task)),
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error ? toggleError.message : "Nao foi possivel atualizar a tarefa.",
      );
    } finally {
      setIsTogglingTaskId(null);
    }
  }

  return {
    openTasks: useMemo(() => tasks.filter((task) => !task.done), [tasks]),
    doneTasks: useMemo(() => tasks.filter((task) => task.done), [tasks]),
    error,
    isLoading,
    isTogglingTaskId,
    toggleTask,
  };
}

function mapApiTaskTypeToUi(type: CrmTaskType): TaskType {
  switch (type) {
    case "CALL":
      return "call";
    case "EMAIL":
      return "email";
    case "MEETING":
      return "meeting";
    default:
      return "follow-up";
  }
}

function mapApiTaskPriorityToUi(priority: CrmTaskPriority): TaskPriority {
  switch (priority) {
    case "HIGH":
      return "high";
    case "LOW":
      return "low";
    default:
      return "medium";
  }
}

function mapApiTaskToUiTask(task: CrmTask): TaskItem {
  return {
    id: task.id,
    title: task.title,
    assignee: task.assigneeName,
    due: task.dueLabel,
    done: task.isDone,
    type: mapApiTaskTypeToUi(task.type),
    priority: mapApiTaskPriorityToUi(task.priority),
  };
}
