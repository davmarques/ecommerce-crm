"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { CrmSidebar } from "@/components/ui/CrmSidebar";

interface CrmLayoutClientProps {
  children: ReactNode;
}

export function CrmLayoutClient({ children }: CrmLayoutClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-slate-900 md:pl-[250px]">
      {/* Mobile Top Navigation Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#1D2735] text-xs font-bold text-white">
              SD
            </div>
            <span className="text-sm font-bold text-slate-900">CRM Forge</span>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <CrmSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Page Area */}
      <div className="min-h-[calc(100vh-57px)] md:min-h-screen">{children}</div>
    </div>
  );
}

