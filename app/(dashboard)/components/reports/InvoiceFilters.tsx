"use client";

import { Search, RotateCcw } from "lucide-react";

interface Props {
  from: string;
  to: string;
  status: string;
  search: string;

  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;

  onApply: () => void;
}

export default function InvoiceFilters({
  from,
  to,
  status,
  search,
  onFromChange,
  onToChange,
  onStatusChange,
  onSearchChange,
  onApply,
}: Props) {
  function clearFilters() {
    onFromChange("");
    onToChange("");
    onStatusChange("ALL");
    onSearchChange("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* SEARCH */}

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Invoice number or client name..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:ring-4
                focus:ring-cyan-100
              "
            />
          </div>
        </div>

        {/* FROM */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            From
          </label>

          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              text-sm
              outline-none
              transition
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-100
            "
          />
        </div>

        {/* TO */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            To
          </label>

          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              text-sm
              outline-none
              transition
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-100
            "
          />
        </div>

        {/* STATUS */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

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
              px-4
              text-sm
              outline-none
              transition
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-100
            "
          >
            <option value="ALL">All</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={clearFilters}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            bg-white
            px-5
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          <RotateCcw size={16} />
          Clear
        </button>

        <button
          type="button"
          onClick={onApply}
          className="
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
          <Search size={16} />
          Apply Filters
        </button>
      </div>
    </div>
  );
}
