import type { FormEvent } from "react";
import type { ApiCategory, ProductPayload, ProductVariantPayload } from "@/lib/api";

export interface ProductModalProps {
  categories: ApiCategory[];
  editing: boolean;
  form: ProductPayload;
  isSaving: boolean;
  onChange: <K extends keyof ProductPayload>(field: K, value: ProductPayload[K]) => void;
  onNameChange: (name: string) => void;
  onVariantsChange: (variants: ProductVariantPayload[]) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
