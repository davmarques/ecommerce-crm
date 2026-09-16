"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/lib/api";
import { getStoredToken } from "@/lib/crm-session";
import type { ApiCategory } from "@/lib/api";
import type { CategoriesModalProps } from "./CategoriesModal.types";
import type { FormEvent } from "react";

export function CategoriesModal({ categories, onChange, onClose }: CategoriesModalProps) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("Sessão não encontrada. Entre pelo dashboard do CRM.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const saved = editingId
        ? await updateCategory(token, editingId, { name })
        : await createCategory(token, { name });

      onChange(
        editingId
          ? categories.map((category) => (category.id === saved.id ? saved : category))
          : [...categories, saved],
      );
      setName("");
      setEditingId(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Não foi possível salvar a categoria.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: ApiCategory) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    const token = getStoredToken();
    if (!token) {
      setError("Sessão não encontrada. Entre pelo dashboard do CRM.");
      return;
    }

    setError(null);
    try {
      await deleteCategory(token, category.id);
      onChange(categories.filter((item) => item.id !== category.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Não foi possível excluir a categoria.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-2 sm:p-4">
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categories-modal-title"
      >
        <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 id="categories-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
            Categorias de Produtos
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

        <form onSubmit={handleSubmit} className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-3">
          <label className="flex-1 text-xs sm:text-sm font-medium text-slate-700">
            {editingId ? "Editar categoria" : "Nova categoria"}
            <input
              required
              placeholder="Ex: Camisetas, Calçados..."
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSaving ? "Salvando..." : editingId ? "Salvar" : "Adicionar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                }}
                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between p-3 sm:px-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">{category.name}</p>
                <p className="text-[11px] text-slate-500">{category._count?.products ?? 0} produto(s)</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title={`Editar ${category.name}`}
                  aria-label={`Editar ${category.name}`}
                  onClick={() => {
                    setEditingId(category.id);
                    setName(category.name);
                  }}
                  className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  title={`Excluir ${category.name}`}
                  aria-label={`Excluir ${category.name}`}
                  onClick={() => void handleDelete(category)}
                  className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="py-6 text-center text-xs sm:text-sm text-slate-500">Nenhuma categoria cadastrada</li>
          )}
        </ul>

        {error && <p className="mt-4 text-xs sm:text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );
}

