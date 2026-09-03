export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "awaiting_payment"
  | "in_preparation"
  | "shipped"
  | "completed"
  | "cancelled";

export interface OrderItemDetail {
  id: string;
  quantity: number;
  price: number;
  variantId: string;
  variant: {
    id?: string;
    size: string;
    sku: string;
    color?: string | null;
    product: {
      name: string;
      slug?: string;
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string | number;
  customerName: string;
  customerEmail: string;
  customerCpf?: string | null;
  customerPhone?: string | null;
  status: OrderStatus;
  total: number;
  totalAmount?: number;
  shippingCost?: number;
  shippingService?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  trackingCode?: string | null;
  paymentMethod?: string;
  paymentId?: string | null;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItemDetail[];
}

