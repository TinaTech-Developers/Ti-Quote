"use client";

import Link from "next/link";
import { ChevronRight, Edit3, Package, Warehouse } from "lucide-react";

import DeleteProductButton from "./DeleteProductButton";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  unit?: string | null;
  price: number | string;
  stockQuantity?: number | string;
  lowStockAlert?: number | string;
  trackStock?: boolean;
  active?: boolean;
}

interface Props {
  products: Product[];
  onRefresh: () => void;
}

function formatCurrency(value: number | string) {
  const amount = Number(value || 0);

  return `$${amount.toFixed(2)}`;
}

function getStockStatus(product: Product) {
  if (!product.trackStock) {
    return {
      label: "Not tracked",
      className: "bg-slate-100 text-slate-600",
    };
  }

  const stock = Number(product.stockQuantity || 0);
  const lowStock = Number(product.lowStockAlert || 0);

  if (stock <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-50 text-red-700",
    };
  }

  if (stock <= lowStock) {
    return {
      label: "Low stock",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "In stock",
    className: "bg-emerald-50 text-emerald-700",
  };
}

export default function ProductTable({ products, onRefresh }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop table */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                SKU
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);

              return (
                <tr
                  key={product.id}
                  className="group transition hover:bg-slate-50/70"
                >
                  {/* Product */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                        <Package size={20} />
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="block truncate font-semibold text-slate-800 transition hover:text-[#0097A7]"
                        >
                          {product.name}
                        </Link>

                        <p className="mt-0.5 max-w-[250px] truncate text-xs text-slate-400">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}

                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {product.sku || "—"}
                    </span>
                  </td>

                  {/* Price */}

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {formatCurrency(product.price)}
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      per {product.unit || "unit"}
                    </div>
                  </td>

                  {/* Stock */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Warehouse size={16} className="text-slate-400" />

                      <span className="font-medium text-slate-700">
                        {product.trackStock ?
                          Number(product.stockQuantity || 0)
                        : "—"}
                      </span>
                    </div>

                    {product.trackStock && (
                      <p className="mt-1 text-xs text-slate-400">
                        Alert at {Number(product.lowStockAlert || 0)}
                      </p>
                    )}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                      >
                        {stockStatus.label}
                      </span>

                      {product.active === false ?
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          Inactive
                        </span>
                      : <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          Active
                        </span>
                      }
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        title="View product"
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-slate-700
                        "
                      >
                        <ChevronRight size={18} />
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        title="Edit product"
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-cyan-50
                          hover:text-[#0097A7]
                        "
                      >
                        <Edit3 size={17} />
                      </Link>

                      {product.active !== false && (
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                          onDeleted={onRefresh}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet cards */}

      <div className="divide-y divide-slate-100 lg:hidden">
        {products.map((product) => {
          const stockStatus = getStockStatus(product);

          return (
            <div key={product.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                    <Package size={20} />
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="block truncate font-semibold text-slate-800"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-1 text-xs text-slate-400">
                      SKU: {product.sku || "—"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                >
                  {stockStatus.label}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Price</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Stock</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {product.trackStock ?
                      Number(product.stockQuantity || 0)
                    : "Not tracked"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                >
                  View
                </Link>

                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-lg bg-[#0B3954] px-3 py-2 text-sm font-medium text-white"
                >
                  Edit
                </Link>

                {product.active !== false && (
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                    onDeleted={onRefresh}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
