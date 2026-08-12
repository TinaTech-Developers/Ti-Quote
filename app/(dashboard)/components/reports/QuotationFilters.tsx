"use client";

import { Search, Filter, RotateCcw } from "lucide-react";

interface Props {
  search: string;
  status: string;
  from: string;
  to: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;

  onApply: () => void;
  onReset: () => void;
}

export default function QuotationFilters({
  search,
  status,
  from,
  to,
  onSearchChange,
  onStatusChange,
  onFromChange,
  onToChange,
  onApply,
  onReset,
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
        grid-cols-1
        gap-4
        md:grid-cols-5
        "
      >
        {/* Search */}

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
            placeholder="Search quotation..."
            className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-300
            pl-10
            pr-3
            text-sm
            outline-none
            focus:border-[#0097A7]
            "
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="
          h-11
          rounded-xl
          border
          border-slate-300
          px-3
          text-sm
          outline-none
          focus:border-[#0097A7]
          "
        >
          <option value="ALL">All Status</option>

          <option value="DRAFT">Draft</option>

          <option value="PENDING">Pending</option>

          <option value="APPROVED">Approved</option>

          <option value="REJECTED">Rejected</option>

          <option value="CONVERTED">Converted</option>
        </select>

        {/* From */}

        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="
          h-11
          rounded-xl
          border
          border-slate-300
          px-3
          text-sm
          "
        />

        {/* To */}

        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="
          h-11
          rounded-xl
          border
          border-slate-300
          px-3
          text-sm
          "
        />

        {/* Buttons */}

        <div className="flex gap-2">
          <button
            onClick={onApply}
            className="
            inline-flex
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            px-4
            text-white
            hover:bg-[#092C42]
            "
          >
            <Filter size={17} />
            Apply
          </button>

          <button
            onClick={onReset}
            className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            border
            border-slate-300
            px-3
            text-slate-600
            hover:bg-slate-50
            "
            title="Reset filters"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
