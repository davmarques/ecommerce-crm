import type { ProductPayload } from "@/lib/api";

export interface Product extends ProductPayload {
  id: string;
  category: string;
}
