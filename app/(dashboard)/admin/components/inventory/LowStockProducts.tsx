"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Package, XCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
  stockQuantity: number;
  lowStockAlert: number;
  price: number;
}

interface LowStockProductsProps {
  products: Product[];
  currency?: string;
}

export default function LowStockProducts({
  products,
  currency = "USD",
}: LowStockProductsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Stock Alerts</h2>

          <p className="mt-1 text-sm text-slate-500">
            Products that need your attention.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* EMPTY */}

      {products.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Package className="h-5 w-5 text-emerald-600" />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            Inventory looks good
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            There are currently no stock alerts.
          </p>
        </div>
      )}

      {/* PRODUCTS */}

      {products.length > 0 && (
        <div className="divide-y divide-slate-100">
          {products.map((product) => {
            const isOutOfStock = product.stockQuantity <= 0;

            return (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isOutOfStock ? "bg-red-50" : "bg-amber-50"
                    }`}
                  >
                    {isOutOfStock ?
                      <XCircle className="h-5 w-5 text-red-600" />
                    : <AlertTriangle className="h-5 w-5 text-amber-600" />}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      {product.sku && <span>SKU: {product.sku}</span>}

                      {product.unit && <span>Unit: {product.unit}</span>}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`font-bold ${
                      isOutOfStock ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {product.stockQuantity} {product.unit || "units"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Alert at {product.lowStockAlert}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
