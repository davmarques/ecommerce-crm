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
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
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
        saveError instanceof Error ? saveError.message : "Nao foi possivel salvar a categoria.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: ApiCategory) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    const token = getStoredToken();
    if (!token) {
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
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
          : "Nao foi possivel excluir a categoria.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categories-modal-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="categories-modal-title" className="text-xl font-semibold text-slate-900">
            Categorias
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

        <form onSubmit={handleSubmit} className="mb-5 flex items-end gap-3">
          <label className="flex-1 text-sm font-medium text-gray-700">
            {editingId ? "Editar categoria" : "Nova categoria"}
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </form>

        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category._count?.products ?? 0} produto(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title={`Editar ${category.name}`}
                  aria-label={`Editar ${category.name}`}
                  onClick={() => {
                    setEditingId(category.id);
                    setName(category.name);
                  }}
                  className="rounded p-2 text-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  title={`Excluir ${category.name}`}
                  aria-label={`Excluir ${category.name}`}
                  onClick={() => void handleDelete(category)}
                  className="rounded p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="py-6 text-center text-sm text-gray-500">Nenhuma categoria cadastrada</li>
          )}
        </ul>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
