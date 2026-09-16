import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import type { CrmSidebarProps } from "./CrmSidebar.types";

interface NavigationItem {
  href: string;
  label: string;
  disabled?: boolean;
  badge?: string;
}

const navigation: NavigationItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/orders", label: "Pedidos" },
  { href: "/products", label: "Produtos" },
  { href: "/contacts", label: "Contatos" },
  { href: "/activity", label: "Atividade" },
  { href: "/pipeline", label: "Pipeline", disabled: true, badge: "Em breve" },
  { href: "/tasks", label: "Tarefas", disabled: true, badge: "Em breve" },
];

const settingsSubNavigation = [
  { href: "/settings/store", label: "Loja" },
  { href: "/settings/team", label: "Equipe" },
];

export function CrmSidebar({ isOpen = false, onClose }: CrmSidebarProps) {
  const pathname = usePathname();
  const isSettingsActive = pathname.startsWith("/settings");
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] max-w-[85vw] flex-col justify-between bg-[#1D2735] p-4 text-slate-200 transition-transform duration-300 ease-in-out md:w-[250px] md:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-1 flex-col overflow-y-auto pr-1">
        <div className="mb-6 flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/12 text-sm font-semibold text-white">
              SD
            </div>
            <div>
              <p className="text-lg font-semibold leading-none text-white">Storms</p>
              <p className="mt-1 text-xs tracking-[0.18em] text-slate-400">Development</p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="px-2 text-xs uppercase tracking-[0.22em] text-slate-500">Workspace</p>
        <nav className="mt-3 space-y-1">
          {navigation.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 opacity-50 cursor-not-allowed select-none"
                  title="Módulo temporariamente indisponível"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  isActive ? "bg-[#6C8FB4] font-medium text-white" : "text-slate-300 hover:bg-white/8"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen((open) => !open)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                isSettingsActive ? "bg-[#6C8FB4] font-medium text-white" : "text-slate-300 hover:bg-white/8"
              }`}
            >
              <span>Configurações</span>
              <svg
                className={`h-4 w-4 transition-transform ${isSettingsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isSettingsOpen && (
              <div className="mt-1 space-y-1 pl-3">
                {settingsSubNavigation.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onClose?.()}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        isActive ? "bg-[#6C8FB4] font-medium text-white" : "text-slate-300 hover:bg-white/8"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="mt-4 rounded-2xl bg-[#2A3647] p-4">
        <p className="text-sm font-semibold text-slate-100">Meta do trimestre</p>
        <p className="mt-1 text-sm text-slate-300">$780k de $1.2M target</p>
        <div className="mt-3 h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-[#8BC2FF]" style={{ width: "65%" }} />
        </div>
      </div>
    </aside>
  );
}
