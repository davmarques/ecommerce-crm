"use client";

import { Home, FileText, CreditCard, Truck } from "lucide-react";
import type { StoreSettingsTabsProps } from "./StoreSettingsTabs.types";
import type { StoreTabKey } from "@/features/settings/types/StoreSettings.types";

interface TabItem {
  key: StoreTabKey;
  label: string;
  description: string;
  icon: typeof Home;
  statusBadge?: {
    active: boolean;
    activeText: string;
    inactiveText: string;
  };
}

export function StoreSettingsTabs({
  activeTab,
  onSelectTab,
  isMercadoPagoConnected,
  isMelhorEnvioConfigured,
}: StoreSettingsTabsProps) {
  const tabs: TabItem[] = [
    {
      key: "inicio",
      label: "Início",
      description: "Visual, banners, cores e textos da Home",
      icon: Home,
    },
    {
      key: "sobre",
      label: "Sobre",
      description: "Conteúdo, missão e história da marca",
      icon: FileText,
    },
    {
      key: "mercadopago",
      label: "Mercado Pago",
      description: "Pagamentos & Checkout Transparente",
      icon: CreditCard,
      statusBadge: {
        active: isMercadoPagoConnected,
        activeText: "Conectado",
        inactiveText: "Pendente",
      },
    },
    {
      key: "melhorenvio",
      label: "Melhor Envio",
      description: "Frete, token e endereço de origem",
      icon: Truck,
      statusBadge: {
        active: isMelhorEnvioConfigured,
        activeText: "Configurado",
        inactiveText: "Pendente",
      },
    },
  ];

  return (
    <div className="mb-4 sm:mb-6">
      <nav
        aria-label="Subpáginas de configurações"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`group relative flex flex-col items-start rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 ${
                isActive
                  ? "border-[#3B82F6] bg-white shadow-md ring-2 ring-[#3B82F6]/20"
                  : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white shadow-2xs"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={`grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>

                {tab.statusBadge && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-medium ${
                      tab.statusBadge.active
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                    }`}
                  >
                    <span
                      className={`mr-1 h-1.5 w-1.5 rounded-full ${
                        tab.statusBadge.active ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {tab.statusBadge.active
                      ? tab.statusBadge.activeText
                      : tab.statusBadge.inactiveText}
                  </span>
                )}
              </div>

              <span
                className={`mt-2.5 sm:mt-3 block text-sm sm:text-base font-semibold ${
                  isActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                }`}
              >
                {tab.label}
              </span>
              <span className="mt-0.5 block text-[11px] sm:text-xs text-slate-500 line-clamp-1">
                {tab.description}
              </span>

              {isActive && (
                <div className="absolute inset-x-0 -bottom-[1px] mx-auto h-[3px] w-10 sm:w-12 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

