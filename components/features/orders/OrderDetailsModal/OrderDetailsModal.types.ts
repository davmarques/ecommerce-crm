import type { Order, OrderStatus } from "@/features/orders/types/Order.types";

export interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => Promise<void> | void;
  isUpdatingStatus?: boolean;
}
