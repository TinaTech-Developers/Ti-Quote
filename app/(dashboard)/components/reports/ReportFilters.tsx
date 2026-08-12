"use client";

import { CalendarDays, Filter } from "lucide-react";

interface Props {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApply: () => void;
}

export default function ReportFilters({
  from,
  to,
  onFromChange,
  onToChange,
  onApply,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Filter className="text-[#0B3954]" size={20} />

        <h2 className="text-lg font-semibold text-slate-800">Report Filters</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* From */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            From Date
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

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
                pl-10
                pr-3
                outline-none
                focus:border-[#0097A7]
                focus:ring-2
                focus:ring-cyan-100
              "
            />
          </div>
        </div>

        {/* To */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            To Date
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

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
                pl-10
                pr-3
                outline-none
                focus:border-[#0097A7]
                focus:ring-2
                focus:ring-cyan-100
              "
            />
          </div>
        </div>

        {/* Button */}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="
              h-11
              w-full
              rounded-xl
              bg-[#0B3954]
              text-white
              font-semibold
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
