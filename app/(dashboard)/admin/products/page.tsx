"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Box,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import ProductTable, { Product } from "../components/products/ProductTable";
import ProductFilters from "../components/products/ProductFilters";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [stockStatus, setStockStatus] = useState("ALL");

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      const products =
        Array.isArray(data) ? data
        : Array.isArray(data.products) ? data.products
        : [];

      setProducts(products);
    } catch (error) {
      console.error("Failed to load products:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        (product.sku || "").toLowerCase().includes(searchValue) ||
        (product.description || "").toLowerCase().includes(searchValue);

      if (!matchesSearch) {
        return false;
      }

      // Active / inactive

      if (status === "ACTIVE" && product.active === false) {
        return false;
      }

      if (status === "INACTIVE" && product.active !== false) {
        return false;
      }

      // Stock

      if (stockStatus !== "ALL") {
        if (stockStatus === "NOT_TRACKED") {
          if (product.trackStock) {
            return false;
          }
        }

        if (stockStatus === "OUT_OF_STOCK") {
          if (!product.trackStock || Number(product.stockQuantity || 0) > 0) {
            return false;
          }
        }

        if (stockStatus === "LOW_STOCK") {
          const stock = Number(product.stockQuantity || 0);
          const alert = Number(product.lowStockAlert || 0);

          if (!product.trackStock || stock <= 0 || stock > alert) {
            return false;
          }
        }

        if (stockStatus === "IN_STOCK") {
          const stock = Number(product.stockQuantity || 0);
          const alert = Number(product.lowStockAlert || 0);

          if (!product.trackStock || stock <= alert) {
            return false;
          }
        }
      }

      return true;
    });
  }, [products, search, status, stockStatus]);

  const statistics = useMemo(() => {
    const active = products.filter(
      (product) => product.active !== false,
    ).length;

    const inactive = products.filter(
      (product) => product.active === false,
    ).length;

    const tracked = products.filter((product) => product.trackStock);

    const lowStock = tracked.filter((product) => {
      const stock = Number(product.stockQuantity || 0);
      const alert = Number(product.lowStockAlert || 0);

      return stock > 0 && stock <= alert;
    }).length;

    const outOfStock = tracked.filter(
      (product) => Number(product.stockQuantity || 0) <= 0,
    ).length;

    return {
      total: products.length,
      active,
      inactive,
      lowStock,
      outOfStock,
    };
  }, [products]);

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setStockStatus("ALL");
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-[#0097A7]">
              <Package size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your products, pricing and inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              font-semibold
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              disabled:opacity-50
            "
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/admin/products/create"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-[#0B3954]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#092C42]
            "
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {/* Total */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
              <Box size={21} />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statistics.active}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Package size={21} />
            </div>
          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Inactive</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statistics.inactive}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Package size={21} />
            </div>
          </div>
        </div>

        {/* Low Stock */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statistics.lowStock}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingDown size={21} />
            </div>
          </div>
        </div>

        {/* Out of Stock */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Out of Stock</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {statistics.outOfStock}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}

      <ProductFilters
        search={search}
        status={status}
        stockStatus={stockStatus}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onStockStatusChange={setStockStatus}
        onReset={resetFilters}
      />

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <h3 className="font-semibold text-red-800">
                Unable to load products
              </h3>

              <p className="mt-1 text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}

      {loading ?
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-4"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-slate-200" />

                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>

                <div className="hidden h-4 w-20 rounded bg-slate-200 sm:block" />

                <div className="hidden h-4 w-24 rounded bg-slate-200 md:block" />

                <div className="h-8 w-20 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      : filteredProducts.length === 0 ?
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package size={30} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            No products found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {products.length === 0 ?
              "You haven't added any products yet. Create your first product to start managing your inventory."
            : "No products match your current filters. Try changing your search or clearing the filters."
            }
          </p>

          {products.length === 0 ?
            <Link
              href="/admin/products/create"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#0B3954]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#092C42]
              "
            >
              <Plus size={17} />
              Add Product
            </Link>
          : <button
              type="button"
              onClick={resetFilters}
              className="
                mt-6
                rounded-xl
                border
                border-slate-300
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
              "
            >
              Clear Filters
            </button>
          }
        </div>
      : <div>
          {/* Results count */}

          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {products.length}
              </span>{" "}
              products
            </p>
          </div>

          <ProductTable products={filteredProducts} onRefresh={loadProducts} />
        </div>
      }
    </div>
  );
}
