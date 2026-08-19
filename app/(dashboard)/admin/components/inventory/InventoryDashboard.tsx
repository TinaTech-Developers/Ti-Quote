"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Package, AlertCircle } from "lucide-react";

import InventoryStats from "./InventoryStats";
import LowStockProducts from "./LowStockProducts";
import RecentStockMovements from "./RecentStockMovements";

interface InventoryData {
  stats: {
    totalProducts: number;
    totalStock: number;
    lowStock: number;
    outOfStock: number;
    inventoryValue: number;
  };

  currency: string;

  lowStockProducts: {
    id: string;
    name: string;
    sku?: string | null;
    unit?: string | null;
    stockQuantity: number;
    lowStockAlert: number;
    price: number;
  }[];

  recentMovements: {
    id: string;
    type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
    quantity: number;
    reference?: string | null;
    notes?: string | null;
    createdAt: string;
    product: {
      id: string;
      name: string;
      sku?: string | null;
      unit?: string | null;
    };
  }[];
}

export default function InventoryDashboard() {
  const [data, setData] = useState<InventoryData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/inventory", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to load inventory.");
      }

      setData(result);
    } catch (error: any) {
      console.error("Inventory loading error:", error);

      setError(error?.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-white" />

          <div className="h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

          <div>
            <h3 className="font-semibold text-red-800">
              Unable to load inventory
            </h3>

            <p className="mt-1 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadInventory}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * EMPTY / FALLBACK
   * =====================================================
   */

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Package className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">Inventory</h1>

            <p className="text-sm text-slate-500">
              Monitor your stock and inventory value.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <InventoryStats stats={data.stats} currency={data.currency} />

      {/* =================================================
          ALERTS + MOVEMENTS
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockProducts
          products={data.lowStockProducts}
          currency={data.currency}
        />

        <RecentStockMovements movements={data.recentMovements} />
      </div>
    </div>
  );
}
