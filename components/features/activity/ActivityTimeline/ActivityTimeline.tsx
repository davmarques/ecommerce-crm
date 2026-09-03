import { Boxes, MapPin, Tag, UserRound } from "lucide-react";
import type { ActivityTimelineProps } from "./ActivityTimeline.types";

const kindMeta = {
  product: { icon: Boxes, color: "#2F65A9", label: "Produto" },
  category: { icon: Tag, color: "#389B5D", label: "Categoria" },
  address: { icon: MapPin, color: "#E2384D", label: "Endereco" },
  task: { icon: UserRound, color: "#2D9BA0", label: "Tarefa" },
};

export function ActivityTimeline({ items, isLoading }: ActivityTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="relative">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-200" />

        <div className="space-y-5">
          {items.map((item) => {
            const meta = kindMeta[item.kind];
            const Icon = meta.icon;

            return (
              <article key={item.id} className="relative flex gap-3">
                <div
                  className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-white text-white"
                  style={{ background: meta.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.actor}</span>{" "}
                      {item.action}{" "}
                      <span className="font-medium text-slate-900">{item.target}</span>
                    </p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      <UserRound className="h-3 w-3" /> {meta.label}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!isLoading && items.length === 0 ? (
          <p className="text-sm text-slate-500">Sem atividades para exibir.</p>
        ) : null}
        {isLoading ? <p className="text-sm text-slate-500">Carregando atividades...</p> : null}
      </div>
    </div>
  );
}
