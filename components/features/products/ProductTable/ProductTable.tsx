import { Pencil, Trash2 } from "lucide-react";
import type { ProductTableProps } from "./ProductTable.types";

export function ProductTable({ products, deletingId, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 sm:px-6">Produto</th>
            <th className="px-4 py-3 sm:px-6">Tamanhos</th>
            <th className="px-4 py-3 sm:px-6">Categoria</th>
            <th className="px-4 py-3 sm:px-6">Preço</th>
            <th className="px-4 py-3 sm:px-6">Estoque</th>
            <th className="px-4 py-3 sm:px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-medium text-slate-900">{product.name}</td>
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm text-slate-600">
                {product.variants.map((variant) => variant.size).join(", ") || "-"}
              </td>
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm text-slate-600">{product.category}</td>
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 font-semibold text-slate-900">
                R$ {product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm text-slate-600">
                {product.variants.reduce((total, variant) => total + variant.stock, 0)} un.
              </td>
              <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    title={`Editar ${product.name}`}
                    aria-label={`Editar ${product.name}`}
                    onClick={() => onEdit(product)}
                    className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    title={`Excluir ${product.name}`}
                    aria-label={`Excluir ${product.name}`}
                    onClick={() => void onDelete(product)}
                    disabled={deletingId === product.id}
                    className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

