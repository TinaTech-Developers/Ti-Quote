"use client";

import { Search, Calendar, Filter } from "lucide-react";

interface Props {
  from: string;
  to: string;
  search: string;

  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSearchChange: (value: string) => void;

  onApply: () => void;
}

export default function ProductSalesFilters({
  from,
  to,
  search,
  onFromChange,
  onToChange,
  onSearchChange,
  onApply,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-4">
        {/* Search */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Product
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search product..."
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* From */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            From
          </label>

          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* To */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            To
          </label>

          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* Button */}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B3954] px-5 font-medium text-white transition hover:bg-[#092C42]"
          >
            <Filter size={18} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
