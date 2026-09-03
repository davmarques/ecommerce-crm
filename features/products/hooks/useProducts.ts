"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ApiCategory,
  ApiProduct,
  createProduct,
  deleteProduct,
  ProductPayload,
  ProductVariantPayload,
  updateProduct,
} from "@/lib/api";
import { clearStoredToken, fetchCrmSnapshot, getStoredToken } from "@/lib/crm-session";
import type { Product } from "@/features/products/types/Product.types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductPayload>(createEmptyProductForm());

  useEffect(() => {
    async function loadProducts() {
      const token = getStoredToken();
      if (!token) {
        setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
        setIsLoading(false);
        return;
      }
      try {
        const snapshot = await fetchCrmSnapshot(token);
        setProducts(snapshot.products.map(mapApiProductToProduct));
        setCategories(snapshot.categories);
      } catch (loadError) {
        clearStoredToken();
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar produtos.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.variants.some((variant) => variant.sku.toLowerCase().includes(query)),
    );
  }, [products, searchTerm]);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(toProductForm(null, categories[0]?.id || ""));
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm(toProductForm(product, product.categoryId));
    setError(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const saved = editingProduct
        ? await updateProduct(token, editingProduct.id, form)
        : await createProduct(token, form);
      const mapped = mapApiProductToProduct(saved);
      setProducts((current) =>
        editingProduct
          ? current.map((product) => (product.id === mapped.id ? mapped : product))
          : [mapped, ...current],
      );
      setIsModalOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Nao foi possivel salvar o produto.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Excluir o produto "${product.name}"?`)) return;
    const token = getStoredToken();
    if (!token) {
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
      return;
    }
    setDeletingId(product.id);
    setError(null);
    try {
      await deleteProduct(token, product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o produto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function updateField<K extends keyof ProductPayload>(field: K, value: ProductPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleNameChange(name: string) {
    const slug = slugify(name);
    setForm((current) => ({
      ...current,
      name,
      slug,
      variants: current.variants.map((variant) => ({
        ...variant,
        sku: buildSku(slug, variant.size, variant.sku),
      })),
    }));
  }

  function handleVariantsChange(variants: ProductVariantPayload[]) {
    setForm((current) => ({
      ...current,
      variants: variants.map((variant) => ({
        ...variant,
        sku: buildSku(current.slug, variant.size, variant.sku),
      })),
    }));
  }

  return {
    products,
    categories,
    filteredProducts,
    isLoading,
    isSaving,
    deletingId,
    searchTerm,
    error,
    isModalOpen,
    isCategoriesOpen,
    editingProduct,
    form,
    setCategories,
    setSearchTerm,
    setError,
    setIsModalOpen,
    setIsCategoriesOpen,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    updateField,
    handleNameChange,
    handleVariantsChange,
  };
}

function createEmptyProductVariant(size = "Unico", sku = "", stock = 0): ProductVariantPayload {
  return { size, sku, stock };
}
function createEmptyProductForm(overrides: Partial<ProductPayload> = {}): ProductPayload {
  return {
    name: "",
    slug: "",
    description: "",
    price: 0,
    weight: 0,
    height: 0,
    width: 0,
    length: 0,
    categoryId: "",
    variants: [createEmptyProductVariant()],
    ...overrides,
  };
}
function toProductForm(product: Product | null, fallbackCategoryId = ""): ProductPayload {
  if (!product)
    return createEmptyProductForm({
      categoryId: fallbackCategoryId,
      variants: [createEmptyProductVariant()],
    });
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    weight: product.weight,
    height: product.height,
    width: product.width,
    length: product.length,
    categoryId: product.categoryId || fallbackCategoryId,
    variants: product.variants.map((variant) => ({ ...variant })),
    isFeatured: product.isFeatured,
  };
}
function mapApiProductToProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    price: Number(product.price || 0),
    weight: Number(product.weight || 0),
    height: product.height || 0,
    width: product.width || 0,
    length: product.length || 0,
    categoryId: product.categoryId || "",
    category: product.category?.name || "Sem categoria",
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock,
    })),
    isFeatured: product.isFeatured,
  };
}
function buildSku(slug: string, size: string, currentSku: string) {
  if (!slug) return "";
  const suffix =
    currentSku.match(/-([A-Z0-9]{6})$/)?.[1] ||
    Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKU-${slug.toUpperCase()}-${slugify(size).toUpperCase() || "UNICO"}-${suffix}`;
}
function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
