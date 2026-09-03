import { Pencil, Trash2 } from "lucide-react";
import type { ProductTableProps } from "./ProductTable.types";

export function ProductTable({ products, deletingId, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Produto</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tamanhos</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preco</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estoque</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {product.variants.map((variant) => variant.size).join(", ")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                R$ {product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {product.variants.reduce((total, variant) => total + variant.stock, 0)} unidades
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title={`Editar ${product.name}`}
                    aria-label={`Editar ${product.name}`}
                    onClick={() => onEdit(product)}
                    className="rounded p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    title={`Excluir ${product.name}`}
                    aria-label={`Excluir ${product.name}`}
                    onClick={() => void onDelete(product)}
                    disabled={deletingId === product.id}
                    className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={17} aria-hidden="true" />
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
