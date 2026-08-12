"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

interface Props {
  search: string;
  status: string;
  stockStatus: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  search,
  status,
  stockStatus,
  onSearchChange,
  onStatusChange,
  onStockStatusChange,
  onReset,
}: Props) {
  const hasFilters = search !== "" || status !== "ALL" || stockStatus !== "ALL";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-slate-500" />

          <h2 className="text-sm font-semibold text-slate-800">
            Product Filters
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#0097A7]"
          >
            <X size={15} />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}

        <div className="relative md:col-span-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products or SKU..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              pl-10
              pr-4
              text-sm
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-50
            "
          />
        </div>

        {/* Status */}

        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-50
            "
          >
            <option value="ALL">All Products</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Stock */}

        <div>
          <select
            value={stockStatus}
            onChange={(e) => onStockStatusChange(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-50
            "
          >
            <option value="ALL">All Stock Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="NOT_TRACKED">Not Tracked</option>
          </select>
        </div>
      </div>
    </div>
  );
}
