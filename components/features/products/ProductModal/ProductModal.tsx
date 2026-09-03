"use client";

import { Plus, Trash2, X } from "lucide-react";
import type { ProductVariantPayload } from "@/lib/api";
import type { ProductModalProps } from "./ProductModal.types";

export function ProductModal({
  categories,
  editing,
  form,
  isSaving,
  onChange,
  onNameChange,
  onVariantsChange,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const numberField = (
    field: "price" | "weight" | "height" | "width" | "length",
    label: string,
  ) => (
    <label className="text-sm font-medium text-gray-700">
      {label}
      <input
        required
        type="number"
        min="0"
        step={field === "price" || field === "weight" ? "0.01" : "1"}
        value={form[field]}
        onChange={(event) => onChange(field, Number(event.target.value))}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
      />
    </label>
  );

  function updateVariant(index: number, patch: Partial<ProductVariantPayload>) {
    onVariantsChange(
      form.variants.map((variant, position) =>
        position === index ? { ...variant, ...patch } : variant,
      ),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="product-modal-title" className="text-xl font-semibold text-slate-900">
            {editing ? "Editar produto" : "Adicionar produto"}
          </h2>
          <button
            type="button"
            title="Fechar"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Nome
              <input
                required
                value={form.name}
                onChange={(event) => onNameChange(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Slug
              <input
                required
                readOnly
                value={form.slug}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-normal text-gray-600"
              />
            </label>
          </div>
          <label className="text-sm font-medium text-gray-700">
            Descricao
            <textarea
              required
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Categoria
            <select
              required
              value={form.categoryId}
              onChange={(event) => onChange("categoryId", event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {numberField("price", "Preço (R$)")}
            {numberField("weight", "Peso (kg)")}
            {numberField("height", "Altura (cm)")}
            {numberField("width", "Largura (cm)")}
            {numberField("length", "Comprimento (cm)")}
          </div>

          <fieldset className="space-y-3 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <legend className="text-sm font-semibold text-gray-900">Tamanhos</legend>
              <button
                type="button"
                onClick={() =>
                  onVariantsChange([...form.variants, { size: "", sku: "", stock: 0 }])
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus size={15} aria-hidden="true" />
                Adicionar tamanho
              </button>
            </div>
            {form.variants.map((variant, index) => (
              <div key={variant.id ?? index} className="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto]">
                <label className="text-xs font-medium text-gray-600">
                  Tamanho
                  <input
                    required
                    value={variant.size}
                    onChange={(event) => updateVariant(index, { size: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-medium text-gray-600">
                  SKU
                  <input
                    required
                    value={variant.sku}
                    onChange={(event) => updateVariant(index, { sku: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-medium text-gray-600">
                  Estoque
                  <input
                    required
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(index, { stock: Number(event.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal"
                  />
                </label>
                <button
                  type="button"
                  title="Remover tamanho"
                  aria-label={`Remover tamanho ${variant.size || index + 1}`}
                  disabled={form.variants.length === 1}
                  onClick={() =>
                    onVariantsChange(form.variants.filter((_, position) => position !== index))
                  }
                  className="mt-5 h-9 rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </fieldset>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : editing ? "Salvar alteracoes" : "Criar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
