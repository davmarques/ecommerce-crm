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
      title="Catalogo de Produtos"
      description="Produtos disponiveis para propostas e pedidos"
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Tags size={18} aria-hidden="true" />
            Categorias
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} aria-hidden="true" />
            Adicionar produto
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <input
            type="search"
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />

          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Nenhum produto encontrado</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Nenhum produto corresponde a busca.
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

        {error && <p className="text-sm text-red-600">{error}</p>}
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
