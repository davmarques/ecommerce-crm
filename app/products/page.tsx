"use client";

import { Plus, Tags } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { CategoriesModal } from "@/components/features/products/CategoriesModal";
import { ProductModal } from "@/components/features/products/ProductModal";
import { ProductTable } from "@/components/features/products/ProductTable";

export default function ProductsPage() {
  const {
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
    setIsModalOpen,
    setIsCategoriesOpen,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    updateField,
    handleNameChange,
    handleVariantsChange,
  } = useProducts();

  return (
    <CrmPageShell
      title="Catálogo de Produtos"
      description="Gerencie os produtos disponíveis para sua loja"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <Tags size={16} aria-hidden="true" />
            Categorias
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Plus size={16} aria-hidden="true" />
            Adicionar produto
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <input
            type="search"
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mb-4 sm:mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          {isLoading ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500">Nenhum produto encontrado</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
              Nenhum produto corresponde à busca.
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              deletingId={deletingId}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>

        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
      </div>

      {isModalOpen && (
        <ProductModal
          categories={categories}
          editing={Boolean(editingProduct)}
          form={form}
          isSaving={isSaving}
          onChange={updateField}
          onNameChange={handleNameChange}
          onVariantsChange={handleVariantsChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {isCategoriesOpen && (
        <CategoriesModal
          categories={categories}
          onChange={setCategories}
          onClose={() => setIsCategoriesOpen(false)}
        />
      )}
    </CrmPageShell>
  );
}

