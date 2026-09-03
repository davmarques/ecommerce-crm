import type { ApiCategory } from "@/lib/api";

export interface CategoriesModalProps {
  categories: ApiCategory[];
  onChange: (categories: ApiCategory[]) => void;
  onClose: () => void;
}
