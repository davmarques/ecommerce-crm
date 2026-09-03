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
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </CrmPageShell>
    );
  }

  if (!profile) {
    return (
      <CrmPageShell title="Perfil do Cliente" description="">
        <div className="text-center py-12">
          <p className="text-gray-500">Cliente não encontrado</p>
        </div>
      </CrmPageShell>
    );
  }

  return (
    <CrmPageShell title={profile.name} description={profile.email}>
      <div className="space-y-6">
        <p className="text-gray-600">{profile.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LTV Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600">Valor Lifetime</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">R$ {profile.ltv.toFixed(2)}</p>
          </div>

          {/* Total de Compras */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600">Pedidos Realizados</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {profile.purchaseHistory.length}
            </p>
          </div>

          {/* Favoritos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600">Itens Favoritos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{profile.favorites.length}</p>
          </div>
        </div>

        {/* Endereço */}
        {profile.address && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h2>
            <p className="text-gray-600">{profile.address.street}</p>
            <p className="text-gray-600">
              {profile.address.city}, {profile.address.state} {profile.address.zipCode}
            </p>
          </div>
        )}

        {/* Histórico de Compras */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Compras</h2>
          {profile.purchaseHistory.length === 0 ? (
            <p className="text-gray-600">Nenhuma compra realizada</p>
          ) : (
            <div className="space-y-4">
              {profile.purchaseHistory.map((order) => (
                <div key={order.id} className="border-t pt-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(order.date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-600">{order.products.join(", ")}</p>
                    </div>
                    <p className="font-semibold text-gray-900">R$ {order.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline de Atividades */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades</h2>
          {profile.activities.length === 0 ? (
            <p className="text-gray-600">Nenhuma atividade registrada</p>
          ) : (
            <div className="space-y-4">
              {profile.activities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-600">
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
