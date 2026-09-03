import type { CrmFeedbackProps } from "./CrmFeedback.types";

export function CrmFeedback({ isLoading, loadingText, error }: CrmFeedbackProps) {
  return (
    <>
      {isLoading ? (
        <p className="mt-4 text-sm text-slate-500">{loadingText || "Carregando..."}</p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      ) : null}
    </>
  );
}
