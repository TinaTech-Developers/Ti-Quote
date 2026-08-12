"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Search, Package } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  unit?: string | null;
  price: string | number;
  active: boolean;
  createdAt: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.unit?.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-slate-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              px-4
              py-2
              pl-10
              outline-none
              focus:border-blue-600
            "
          />
        </div>

        <Link
          href="/super-admin/products/new"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left text-sm">
              <th className="px-5 py-3 text-slate-700">Product</th>

              <th className="px-5 py-3 text-slate-700">SKU</th>

              <th className="px-5 py-3 text-slate-700">Unit</th>

              <th className="px-5 py-3 text-slate-700">Price</th>

              <th className="px-5 py-3 text-slate-700">Status</th>

              <th className="px-5 py-3 text-right text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ?
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-12
                    text-center
                  "
                >
                  <Package
                    size={42}
                    className="
                      mx-auto
                      mb-3
                      text-slate-300
                    "
                  />

                  <h3 className="font-semibold">No products found</h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add your first product.
                  </p>
                </td>
              </tr>
            : filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="
                    border-t
                    hover:bg-slate-50
                  "
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-400">
                        {product.name}
                      </p>

                      {product.description && (
                        <p className="text-sm text-slate-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {product.sku || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {product.unit || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-500 font-medium">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${
                          product.active ?
                            "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {product.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/super-admin/products/${product.id}`}
                        className="
                          rounded-lg
                          border
                          p-2
                          hover:bg-slate-100
                        "
                      >
                        <Eye size={18} color="gray" />
                      </Link>

                      <Link
                        href={`/super-admin/products/${product.id}/edit`}
                        className="
                          rounded-lg
                          border
                          p-2
                          hover:bg-slate-100
                        "
                      >
                        <Pencil size={18} color="gray" />
                      </Link>

                      <DeleteProductButton
                        id={product.id}
                        onDeleted={fetchProducts}
                      />
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
