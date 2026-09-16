"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CrmPageShell } from "@/components/ui/CrmPageShell";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ltv: number; // Lifetime Value
  purchaseHistory: Array<{
    id: string;
    date: string;
    amount: number;
    products: string[];
  }>;
  favorites: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  activities: Array<{
    id: string;
    type: "purchase" | "interaction" | "note";
    description: string;
    date: string;
  }>;
}

export default function CustomerProfilePage() {
  const params = useParams();
  const customerId = params.id as string;
  const [profile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder - será integrado com a API
    setIsLoading(false);
  }, [customerId]);

  if (isLoading) {
    return (
      <CrmPageShell title="Carregando..." description="">
        <div className="text-center py-12">
          <p className="text-xs sm:text-sm text-slate-500">Carregando perfil...</p>
        </div>
      </CrmPageShell>
    );
  }

  if (!profile) {
    return (
      <CrmPageShell title="Perfil do Cliente" description="">
        <div className="text-center py-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <p className="text-xs sm:text-sm text-slate-500">Cliente não encontrado.</p>
        </div>
      </CrmPageShell>
    );
  }

  return (
    <CrmPageShell title={profile.name} description={profile.email}>
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {/* LTV Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600">Valor Lifetime (LTV)</h3>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">R$ {profile.ltv.toFixed(2)}</p>
          </div>

          {/* Total de Compras */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600">Pedidos Realizados</h3>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              {profile.purchaseHistory.length}
            </p>
          </div>

          {/* Favoritos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600">Itens Favoritos</h3>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{profile.favorites.length}</p>
          </div>
        </div>

        {/* Endereço */}
        {profile.address && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Endereço</h2>
            <p className="text-xs sm:text-sm text-slate-600">{profile.address.street}</p>
            <p className="text-xs sm:text-sm text-slate-600">
              {profile.address.city}, {profile.address.state} {profile.address.zipCode}
            </p>
          </div>
        )}

        {/* Histórico de Compras */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Histórico de Compras</h2>
          {profile.purchaseHistory.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500">Nenhuma compra realizada.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4 divide-y divide-slate-100">
              {profile.purchaseHistory.map((order) => (
                <div key={order.id} className="pt-3 sm:pt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <div>
                      <p className="font-medium text-slate-900 text-xs sm:text-sm">
                        {new Date(order.date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-slate-600">{order.products.join(", ")}</p>
                    </div>
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm">R$ {order.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline de Atividades */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Atividades</h2>
          {profile.activities.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500">Nenhuma atividade registrada.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {profile.activities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-500 pl-3.5 py-1.5">
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">{activity.description}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    {new Date(activity.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CrmPageShell>
  );
}

