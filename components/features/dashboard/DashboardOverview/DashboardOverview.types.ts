import type { ApiAuthUser, ApiOrder, CrmActivity } from "@/lib/api";

export interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral" | "negative";
}

export interface OrdersStatusSummary {
  status: string;
  label: string;
  count: number;
  value: number;
  color: string;
  percentage: number;
}

export interface DashboardOverviewProps {
  user: ApiAuthUser;
  cardStats: DashboardStat[];
  recentOrders: ApiOrder[];
  recentActivities: CrmActivity[];
  ordersStatusSummary: OrdersStatusSummary[];
  chartPoints: string;
  targetPoints: string;
  monthLabels: string[];
  isLoading: boolean;
  error: string | null;
  formatCurrency: (value: number) => string;
}
