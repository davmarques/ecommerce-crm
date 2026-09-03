export type TaskType = "call" | "email" | "meeting" | "follow-up";

export type TaskPriority = "high" | "medium" | "low";

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  due: string;
  done: boolean;
  type: TaskType;
  priority: TaskPriority;
}
