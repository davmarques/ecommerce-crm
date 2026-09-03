import type { TaskItem } from "../types/TaskTypes";

export interface TaskColumnsProps {
  openTasks: TaskItem[];
  doneTasks: TaskItem[];
  isLoading: boolean;
  isTogglingTaskId: string | null;
  onToggleTask: (id: string) => void;
}
