import type { CrmPageShellProps } from "./CrmPageShell.types";

export function CrmPageShell({
  title,
  description,
  maxWidthClassName = "max-w-6xl",
  children,
}: CrmPageShellProps) {
  return (
    <main className="min-h-screen bg-[#EEF2F7] p-4 md:p-8">
      <section className={`mx-auto ${maxWidthClassName}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">CRM</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
