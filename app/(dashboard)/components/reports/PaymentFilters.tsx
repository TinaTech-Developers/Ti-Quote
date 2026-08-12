"use client";

import { Search, Calendar } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;

  method: string;
  onMethodChange: (value: string) => void;

  from: string;
  to: string;

  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;

  onApply: () => void;
}

export default function PaymentFilters({
  search,
  onSearchChange,
  method,
  onMethodChange,
  from,
  to,
  onFromChange,
  onToChange,
  onApply,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Search */}

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">
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
              placeholder="Payment, Invoice, Client..."
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* Method */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Method
          </label>

          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#0097A7]"
          >
            <option value="ALL">All</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card</option>
            <option value="ECOCASH">Ecocash</option>
            <option value="ZIPIT">ZIPIT</option>
            <option value="RTGS">RTGS</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* From */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
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
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* To */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
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
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-[#0097A7]"
            />
          </div>
        </div>

        {/* Apply */}

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="h-11 w-full rounded-xl bg-[#0B3954] font-medium text-white transition hover:bg-[#092C42]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
