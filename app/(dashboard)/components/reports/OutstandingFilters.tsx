"use client";

import { Search, Filter } from "lucide-react";

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
}

export default function OutstandingFilters({
  search,
  status,
  from,
  to,
  onSearchChange,
  onStatusChange,
  onFromChange,
  onToChange,
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
        {/* SEARCH */}

        <div
          className="
 relative
 md:col-span-2
"
        >
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
            placeholder="
 Search invoice or client...
"
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
"
          />
        </div>

        {/* STATUS */}

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="
 h-11
 rounded-xl
 border
 border-slate-300
 px-4
 text-sm
 outline-none
"
        >
          <option value="ALL">All Status</option>

          <option value="SENT">Unpaid</option>

          <option value="PARTIAL">Partial</option>

          <option value="PAID">Paid</option>
        </select>

        {/* FROM */}

        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="
 h-11
 rounded-xl
 border
 border-slate-300
 px-4
 text-sm
"
        />

        {/* TO */}

        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="
 h-11
 rounded-xl
 border
 border-slate-300
 px-4
 text-sm
"
        />
      </div>

      <button
        onClick={onApply}
        className="
 mt-4
 inline-flex
 items-center
 gap-2
 rounded-xl
 bg-[#0B3954]
 px-5
 py-2.5
 text-sm
 font-medium
 text-white
 hover:bg-[#092C42]
"
      >
        <Filter size={17} />
        Apply Filters
      </button>
    </div>
  );
}
