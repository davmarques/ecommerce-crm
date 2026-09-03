"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCrmOrders, fetchCurrentUser, updateCrmOrderStatus } from "@/lib/api";
import { clearStoredToken, getStoredToken } from "@/lib/crm-session";
import type { Order, OrderStatus } from "@/features/orders/types/Order.types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadOrders = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setError("Sessão não encontrada. Entre pelo dashboard do CRM.");
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const user = await fetchCurrentUser(token);
      const apiOrders = await fetchCrmOrders(token, user.tenantId);

      const mappedOrders: Order[] = apiOrders.map((item) => ({
        id: item.id,
        orderNumber: item.orderNumber,
        customerName: item.customerName,
        customerEmail: item.customerEmail,
        customerCpf: item.customerCpf,
        customerPhone: item.customerPhone,
        status: item.status,
        total: item.totalAmount,
        totalAmount: item.totalAmount,
        shippingCost: item.shippingCost,
        shippingService: item.shippingService,
        shippingAddress: item.shippingAddress,
        shippingCity: item.shippingCity,
        shippingState: item.shippingState,
        shippingZip: item.shippingZip,
        trackingCode: item.trackingCode,
        paymentMethod: item.paymentMethod,
        paymentId: item.paymentId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        items: item.items,
      }));

      setOrders(mappedOrders);
    } catch (loadError) {
      clearStoredToken();
      setError(
        loadError instanceof Error ? loadError.message : "Não foi possível carregar os pedidos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      const token = getStoredToken();
      if (!token) return;

      setIsUpdatingStatus(true);
      try {
        const user = await fetchCurrentUser(token);
        await updateCrmOrderStatus(token, orderId, nextStatus, user.tenantId);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao atualizar o status do pedido.",
        );
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [],
  );

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.orderNumber).includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        (order.trackingCode && order.trackingCode.toLowerCase().includes(query));

      const normalizedStatus = order.status.toUpperCase();
      const matchesStatus =
        filterStatus === "all" ||
        normalizedStatus === filterStatus.toUpperCase() ||
        (filterStatus === "awaiting_payment" && normalizedStatus === "PENDING") ||
        (filterStatus === "in_preparation" && normalizedStatus === "PAID") ||
        (filterStatus === "shipped" && normalizedStatus === "SHIPPED") ||
        (filterStatus === "completed" && normalizedStatus === "DELIVERED") ||
        (filterStatus === "cancelled" && normalizedStatus === "CANCELED");

      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, orders, searchTerm]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "CANCELED" && (o.status as string) !== "cancelled")
      .reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
    const pendingCount = orders.filter(
      (o) => o.status === "PENDING" || (o.status as string) === "awaiting_payment",
    ).length;
    const shippedDeliveredCount = orders.filter(
      (o) =>
        o.status === "SHIPPED" ||
        o.status === "DELIVERED" ||
        (o.status as string) === "shipped" ||
        (o.status as string) === "completed",
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingCount,
      shippedDeliveredCount,
    };
  }, [orders]);

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    filterStatus,
    searchTerm,
    selectedOrderId,
    selectedOrder,
    isUpdatingStatus,
    metrics,
    setFilterStatus,
    setSearchTerm,
    setSelectedOrderId,
    handleUpdateStatus,
    refreshOrders: loadOrders,
  };
}

