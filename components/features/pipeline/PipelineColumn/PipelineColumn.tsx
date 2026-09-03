import type { PipelineColumnProps } from "./PipelineColumn.types";

export function PipelineColumn({
  stage,
  deals,
  isUpdatingDealId,
  onMoveNextStage,
}: PipelineColumnProps) {
  const stageTotal = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <article className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: stage.color }} />
          <h2 className="text-sm font-semibold text-slate-900">{stage.label}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {deals.length}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500">${Math.round(stageTotal / 1000)}k</p>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => (
          <div key={deal.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="font-semibold text-slate-900">{deal.title}</p>
            <p className="text-xs text-slate-500">Produto #{deal.productId.slice(0, 8)}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">
                ${Math.round(deal.value / 1000)}k
              </span>
              <span className="text-slate-500">{deal.probability}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-200">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${deal.probability}%`, background: stage.color }}
              />
            </div>
            <button
              type="button"
              onClick={() => onMoveNextStage(deal)}
              disabled={deal.stage === "WON" || isUpdatingDealId === deal.id}
              className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deal.stage === "WON"
                ? "Deal finalizado"
                : isUpdatingDealId === deal.id
                  ? "Atualizando..."
                  : "Mover para proximo estagio"}
            </button>
          </div>
        ))}

        {deals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
            Sem deals neste estagio.
          </p>
        ) : null}
      </div>
    </article>
  );
}
