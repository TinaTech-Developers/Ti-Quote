"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  DollarSign,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import RevenueTable from "@/app/(dashboard)/components/reports/RevenueTable";
import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";
import ReportFilters from "@/app/(dashboard)/components/reports/ReportFilters";
import RevenueSummaryCards from "@/app/(dashboard)/components/reports/ReportSummaryCards";

interface RevenueSummary {
  revenue: number;
  paid: number;
  outstanding: number;
  tax: number;
  discount: number;
  netRevenue: number;
  invoices: number;
}

interface MonthlyRevenue {
  month: string;
  invoices: number;
  revenue: number;
  paid: number;
  outstanding: number;
  tax: number;
  discount: number;
}

export default function RevenueReportPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<RevenueSummary | null>(null);

  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  async function loadReport() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      const response = await fetch(`/api/reports/revenue?${params.toString()}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setMonthly(data.monthly);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  const totalMonths = useMemo(() => monthly.length, [monthly]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Revenue Summary</h1>

          <p className="mt-1 text-sm text-slate-500">
            Revenue, taxes, discounts and outstanding balances.
          </p>
        </div>

        <button
          onClick={loadReport}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B3954] px-5 py-3 text-white transition hover:bg-[#092C42]"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}

      <ReportFilters
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onApply={loadReport}
      />

      {/* SUMMARY */}

      {summary && <RevenueSummaryCards summary={summary} />}

      {/* MONTHLY TABLE */}

      {/* EXPORT BUTTONS */}

      {monthly.length > 0 && (
        <div className="flex justify-end">
          <ExportButtons data={monthly} title="Revenue Summary Report" />
        </div>
      )}

      {/* MONTHLY TABLE */}

      {loading ?
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={34} />
        </div>
      : monthly.length === 0 ?
        <div
          className="
      flex
      h-72
      flex-col
      items-center
      justify-center
      gap-3
      text-slate-500
    "
        >
          <Calendar size={42} />

          <p>No revenue found.</p>
        </div>
      : <RevenueTable data={monthly} />}

      {/* PLACEHOLDER */}

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10">
        <div className="flex items-center gap-3">
          <DollarSign className="text-green-600" />

          <div>
            <h3 className="font-semibold text-slate-800">Revenue Analytics</h3>

            <p className="mt-1 text-sm text-slate-500">
              Monthly charts, exports, printing and advanced analytics will be
              added in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
