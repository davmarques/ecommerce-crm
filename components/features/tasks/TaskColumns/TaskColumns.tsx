import { CalendarClock, CheckSquare, Mail, Phone, RotateCw } from "lucide-react";
import type { TaskType } from "@/components/features/tasks/types/TaskTypes";
import type { TaskColumnsProps } from "./TaskColumns.types";

const typeIcon: Record<TaskType, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: CalendarClock,
  "follow-up": RotateCw,
};

const typeColor: Record<TaskType, string> = {
  call: "#2D9BA0",
  email: "#2F65A9",
  meeting: "#F2A107",
  "follow-up": "#E2384D",
};

export function TaskColumns({
  openTasks,
  doneTasks,
  isLoading,
  isTogglingTaskId,
  onToggleTask,
}: TaskColumnsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="space-y-3 lg:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Em aberto</h2>
        {openTasks.map((task) => {
          const Icon = typeIcon[task.type];
          return (
            <article
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                disabled={isTogglingTaskId === task.id}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300"
                aria-label="Concluir tarefa"
              >
                <CheckSquare className="h-3.5 w-3.5 text-slate-300" />
              </button>
              <div
                className="grid h-9 w-9 place-items-center rounded-lg text-white"
                style={{ background: typeColor[task.type] }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500">
                  {task.assignee} · {task.due}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${task.priority === "high" ? "bg-rose-100 text-rose-700" : task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}
              >
                {task.priority}
              </span>
            </article>
          );
        })}
        {!isLoading && openTasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            Nenhuma tarefa aberta.
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Concluidas</h2>
        {doneTasks.map((task) => {
          const Icon = typeIcon[task.type];
          return (
            <article
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3.5"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                disabled={isTogglingTaskId === task.id}
                className="grid h-5 w-5 place-items-center rounded-md bg-emerald-600 text-white disabled:opacity-70"
                aria-label="Reabrir tarefa"
              >
                <CheckSquare className="h-3.5 w-3.5" />
              </button>
              <div
                className="grid h-8 w-8 place-items-center rounded-lg text-white opacity-60"
                style={{ background: typeColor[task.type] }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm text-slate-500 line-through">{task.title}</p>
            </article>
          );
        })}
        {!isLoading && doneTasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            Sem tarefas concluidas.
          </p>
        ) : null}
      </section>
    </div>
  );
}
