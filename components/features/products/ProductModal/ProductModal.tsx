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
    <label className="text-xs sm:text-sm font-medium text-slate-700">
      {label}
      <input
        required
        type="number"
        min="0"
        step={field === "price" || field === "weight" ? "0.01" : "1"}
        value={form[field]}
        onChange={(event) => onChange(field, Number(event.target.value))}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-2 sm:p-4">
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 id="product-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
            {editing ? "Editar produto" : "Adicionar produto"}
          </h2>
          <button
            type="button"
            title="Fechar"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            <label className="text-xs sm:text-sm font-medium text-slate-700">
              Nome
              <input
                required
                value={form.name}
                onChange={(event) => onNameChange(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="text-xs sm:text-sm font-medium text-slate-700">
              Slug (URL)
              <input
                required
                readOnly
                value={form.slug}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-500 cursor-not-allowed"
              />
            </label>
          </div>

          <label className="block text-xs sm:text-sm font-medium text-slate-700">
            Descrição
            <textarea
              required
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <label className="block text-xs sm:text-sm font-medium text-slate-700">
            Categoria
            <select
              required
              value={form.categoryId}
              onChange={(event) => onChange("categoryId", event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            {numberField("price", "Preço (R$)")}
            {numberField("weight", "Peso (kg)")}
            {numberField("height", "Altura (cm)")}
            {numberField("width", "Largura (cm)")}
            {numberField("length", "Comprimento (cm)")}
          </div>

          <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <legend className="text-xs sm:text-sm font-bold text-slate-900">Tamanhos e Estoque</legend>
              <button
                type="button"
                onClick={() =>
                  onVariantsChange([...form.variants, { size: "", sku: "", stock: 0 }])
                }
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              >
                <Plus size={14} aria-hidden="true" />
                Adicionar tamanho
              </button>
            </div>

            <div className="space-y-3">
              {form.variants.map((variant, index) => (
                <div
                  key={variant.id ?? index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_auto] gap-2.5 sm:gap-3 items-end rounded-xl border border-slate-200 bg-white p-3 sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <label className="text-xs font-medium text-slate-600">
                    Tamanho
                    <input
                      required
                      placeholder="Ex: P, M, G"
                      value={variant.size}
                      onChange={(event) => updateVariant(index, { size: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-600">
                    SKU
                    <input
                      required
                      placeholder="Ex: CAM-M-01"
                      value={variant.sku}
                      onChange={(event) => updateVariant(index, { sku: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-600">
                    Estoque
                    <input
                      required
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(event) =>
                        updateVariant(index, { stock: Number(event.target.value) })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                    className="flex h-9 w-full sm:w-9 items-center justify-center rounded-lg border border-rose-200 sm:border-0 text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    <span className="ml-1 sm:hidden text-xs font-medium">Remover</span>
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSaving ? "Salvando..." : editing ? "Salvar alterações" : "Criar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

