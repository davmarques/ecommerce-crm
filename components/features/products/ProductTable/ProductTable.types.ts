import type { Product } from "@/features/products/types/Product.types";

export interface ProductTableProps {
  products: Product[];
  deletingId: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}
