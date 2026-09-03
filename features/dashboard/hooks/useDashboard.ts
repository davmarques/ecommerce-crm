"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiAuthUser,
  ApiCategory,
  ApiCrmContact,
  ApiOrder,
  ApiProduct,
  CrmActivity,
  fetchCategories,
  fetchCrmActivities,
  fetchCrmContacts,
  fetchCrmOrders,
  fetchCurrentUser,
  fetchProducts,
} from "@/lib/api";
import {
  createLinePoints,
  formatCompactCurrency,
  formatCurrencyBRL,
  generateLast6Months,
} from "@/features/dashboard/lib/dashboard-data";
import { clearToken, getStoredToken } from "@/lib/crm-token";
import type { OrdersStatusSummary } from "@/components/features/dashboard/DashboardOverview/DashboardOverview.types";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Aguardando Pagamento", color: "#F59E0B" },
  PAID: { label: "Em Separação", color: "#3B82F6" },
  SHIPPED: { label: "Enviados", color: "#8B5CF6" },
  DELIVERED: { label: "Concluídos", color: "#10B981" },
  CANCELED: { label: "Cancelados", color: "#EF4444" },
};

export function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<ApiAuthUser | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [contacts, setContacts] = useState<ApiCrmContact[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bootstrapData = useCallback(
    async (authToken: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const me = await fetchCurrentUser(authToken);

        const [
          loadedProducts,
          loadedCategories,
          loadedContacts,
          loadedActivities,
          loadedOrders,
        ] = await Promise.all([
          fetchProducts(authToken, me.tenantId).catch(() => []),
          fetchCategories(authToken, me.tenantId).catch(() => []),
          fetchCrmContacts(authToken, me.tenantId).catch(() => []),
          fetchCrmActivities(authToken, me.tenantId).catch(() => []),
          fetchCrmOrders(authToken, me.tenantId).catch(() => []),
        ]);

        setUser(me);
        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setContacts(loadedContacts);
        setActivities(loadedActivities);
        setOrders(loadedOrders);
      } catch (err) {
        clearToken();
        router.push("/login");
        setError(err instanceof Error ? err.message : "Falha ao carregar dados do CRM.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }
    void bootstrapData(storedToken);
  }, [bootstrapData, router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  // 1. Receita Real (Pedidos pagos / entregues / enviados)
  const paidOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED",
      ),
    [orders],
  );

  const revenueClosed = useMemo(
    () => paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [paidOrders],
  );

  // 2. Ticket Médio
  const averageTicket = useMemo(() => {
    if (paidOrders.length === 0) return 0;
    return revenueClosed / paidOrders.length;
  }, [paidOrders.length, revenueClosed]);

  // 3. Taxa de Conclusão / Entregas
  const deliveredOrdersCount = useMemo(
    () => orders.filter((o) => o.status === "DELIVERED").length,
    [orders],
  );

  const conversionRate = useMemo(() => {
    if (orders.length === 0) return 0;
    return Math.round((deliveredOrdersCount / orders.length) * 100);
  }, [deliveredOrdersCount, orders.length]);

  // 4. Cards de Estatísticas
  const cardStats = useMemo(
    () => [
      {
        label: "Receita realizada",
        value: formatCompactCurrency(revenueClosed),
        trend: `${paidOrders.length} pedidos pagos`,
        tone: "positive" as const,
      },
      {
        label: "Ticket médio",
        value: formatCompactCurrency(averageTicket),
        trend: `${orders.length} pedidos no total`,
        tone: "neutral" as const,
      },
      {
        label: "Pedidos concluídos",
        value: `${conversionRate}%`,
        trend: `${deliveredOrdersCount} de ${orders.length}`,
        tone: conversionRate >= 40 ? ("positive" as const) : ("neutral" as const),
      },
      {
        label: "Total de contatos",
        value: String(contacts.length),
        trend: "clientes cadastrados",
        tone: "positive" as const,
      },
    ],
    [
      averageTicket,
      contacts.length,
      conversionRate,
      deliveredOrdersCount,
      orders.length,
      paidOrders.length,
      revenueClosed,
    ],
  );

  // 5. Gráfico Receita vs Meta (Últimos 6 meses)
  const monthsData = useMemo(() => generateLast6Months(), []);
  const monthLabels = useMemo(() => monthsData.map((m) => m.label), [monthsData]);

  const revenueSeries = useMemo(() => {
    return monthsData.map((month) => {
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === month.monthIndex &&
          orderDate.getFullYear() === month.year &&
          order.status !== "CANCELED"
        );
      });
      return monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    });
  }, [monthsData, orders]);

  const targetSeries = useMemo(() => {
    const maxRev = Math.max(...revenueSeries, 500);
    return revenueSeries.map((val) => Math.round(Math.max(val * 1.15, maxRev * 0.85)));
  }, [revenueSeries]);

  const chartPoints = useMemo(
    () => createLinePoints(revenueSeries, 880, 230),
    [revenueSeries],
  );

  const targetPoints = useMemo(
    () => createLinePoints(targetSeries, 880, 230),
    [targetSeries],
  );

  // 6. Resumo de Pedidos por Status
  const ordersStatusSummary: OrdersStatusSummary[] = useMemo(() => {
    const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"];
    const totalCount = orders.length || 1;

    return statuses.map((status) => {
      const matchingOrders = orders.filter((o) => o.status === status);
      const value = matchingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const count = matchingOrders.length;
      const percentage = Math.round((count / totalCount) * 100);

      return {
        status,
        label: STATUS_CONFIG[status]?.label || status,
        count,
        value,
        color: STATUS_CONFIG[status]?.color || "#64748B",
        percentage,
      };
    });
  }, [orders]);

  // 7. Últimos Pedidos
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  // 8. Atividades Recentes
  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);

  return {
    user,
    isLoading,
    error,
    handleLogout,
    cardStats,
    recentOrders,
    recentActivities,
    ordersStatusSummary,
    chartPoints,
    targetPoints,
    monthLabels,
    formatCurrency: formatCurrencyBRL,
  };
}
