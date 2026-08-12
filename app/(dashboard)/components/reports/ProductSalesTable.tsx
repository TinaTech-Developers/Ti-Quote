"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface ProductSale {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  invoices: number;
}

interface Props {
  products: ProductSale[];
}

const PAGE_SIZE = 10;

export default function ProductSalesTable({ products }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return products.slice(start, start + PAGE_SIZE);
  }, [page, products]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Product Sales
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {products.length} product
            {products.length !== 1 && "s"} found
          </p>
        </div>

        <Package size={22} className="text-[#0B3954]" />
      </div>

      {/* Empty */}

      {products.length === 0 ?
        <div className="flex h-56 flex-col items-center justify-center gap-3 text-slate-500">
          <Package size={42} />

          <p>No products found.</p>
        </div>
      : <>
          {/* Table */}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-sm font-semibold text-slate-700">
                  <th className="px-6 py-4">#</th>

                  <th className="px-6 py-4">Product</th>

                  <th className="px-6 py-4 text-center">Quantity Sold</th>

                  <th className="px-6 py-4 text-center">Invoices</th>

                  <th className="px-6 py-4 text-right">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-t transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700 text-sm">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-700 text-sm">
                      {product.quantity.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-700 text-sm">
                      {product.invoices}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-green-600 text-sm">
                      $
                      {product.revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, products.length)} -{" "}
              {Math.min(page * PAGE_SIZE, products.length)} of {products.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      }
    </div>
  );
}
