import type { CrmPageShellProps } from "./CrmPageShell.types";

export function CrmPageShell({
  title,
  description,
  maxWidthClassName = "max-w-6xl",
  children,
}: CrmPageShellProps) {
  return (
    <main className="min-h-full bg-[#EEF2F7] p-3.5 sm:p-6 md:p-8">
      <section className={`mx-auto ${maxWidthClassName}`}>
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">CRM</p>
            <h1 className="mt-0.5 sm:mt-1 text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
            {description && <p className="mt-1 text-xs sm:text-sm text-slate-600">{description}</p>}
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}

