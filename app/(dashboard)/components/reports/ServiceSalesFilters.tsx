"use client";

import { Search } from "lucide-react";

interface Props {
  from: string;
  to: string;
  search: string;

  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSearchChange: (value: string) => void;

  onApply: () => void;
}

export default function ServiceSalesFilters({
  from,
  to,
  search,
  onFromChange,
  onToChange,
  onSearchChange,
  onApply,
}: Props) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
      "
    >
      <div
        className="
        grid
        gap-4
        md:grid-cols-4
        "
      >
        {/* FROM DATE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            From Date
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
            focus:border-[#0097A7]
            focus:ring-4
            focus:ring-cyan-100
            "
          />
        </div>

        {/* TO DATE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            To Date
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
            focus:border-[#0097A7]
            focus:ring-4
            focus:ring-cyan-100
            "
          />
        </div>

        {/* SEARCH */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search Service
          </label>

          <div className="relative">
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Service name..."
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
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-100
              "
            />
          </div>
        </div>

        {/* BUTTON */}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="
            h-11
            w-full
            rounded-xl
            bg-[#0B3954]
            px-5
            font-semibold
            text-white
            transition
            hover:bg-[#092C42]
            "
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
