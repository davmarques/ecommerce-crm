import type { Order, OrderStatus } from "@/features/orders/types/Order.types";

export interface OrdersMetricsData {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  shippedDeliveredCount: number;
}

export interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  filterStatus: string;
  searchTerm?: string;
  metrics?: OrdersMetricsData;
  onFilterChange: (status: string) => void;
  onSearchChange?: (search: string) => void;
  onOrderSelect?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => Promise<void> | void;
}

