"use client";

import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { OrdersTable } from "@/components/features/orders/OrdersTable";
import { OrderDetailsModal } from "@/components/features/orders/OrderDetailsModal";
import { useOrders } from "@/features/orders/hooks/useOrders";

export default function OrdersPage() {
  const {
    filteredOrders,
    isLoading,
    error,
    filterStatus,
    searchTerm,
    selectedOrder,
    isUpdatingStatus,
    metrics,
    setFilterStatus,
    setSearchTerm,
    setSelectedOrderId,
    handleUpdateStatus,
  } = useOrders();

  return (
    <CrmPageShell
      title="Gestão de Pedidos"
      description="Acompanhe, filtre e gerencie todos os pedidos do seu e-commerce"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <OrdersTable
        orders={filteredOrders}
        isLoading={isLoading}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        metrics={metrics}
        onFilterChange={setFilterStatus}
        onSearchChange={setSearchTerm}
        onOrderSelect={setSelectedOrderId}
        onStatusChange={handleUpdateStatus}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onStatusChange={handleUpdateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </CrmPageShell>
  );
}

