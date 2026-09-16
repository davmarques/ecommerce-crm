import type { DashboardShellProps } from "./DashboardShell.types";

export function DashboardShell({ user, onLogout, children }: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-[#EEF2F7] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 px-3.5 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 sm:max-w-md md:max-w-lg">
            <span className="text-slate-400">⌕</span>
            <input
              type="text"
              placeholder="Buscar contatos, pedidos..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-700 outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                type="button"
                className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              >
                Sair
              </button>
            )}
            {user && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#326AA7] text-xs font-semibold text-white sm:h-8 sm:w-8">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium leading-none text-slate-900 sm:text-sm">{user.name}</p>
                  <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">{children}</div>
    </main>
  );
}

