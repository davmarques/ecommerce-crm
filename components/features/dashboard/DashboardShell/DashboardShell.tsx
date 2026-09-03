import type { DashboardShellProps } from "./DashboardShell.types";

export function DashboardShell({ user, onLogout, children }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-[#EEF2F7] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 md:max-w-lg">
            <span className="text-slate-400">⌕</span>
            <input
              type="text"
              placeholder="Buscar contatos, deals e empresas..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-slate-400"
              >
                Sair
              </button>
            )}
            {user && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#326AA7] text-xs font-semibold text-white">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium leading-none text-slate-900">{user.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-6 md:px-6 lg:px-8">{children}</div>
    </main>
  );
}
