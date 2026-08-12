"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Loader2, CreditCard } from "lucide-react";

import PaymentSummaryCards from "@/app/(dashboard)/components/reports/PaymentSummaryCards";
import PaymentFilters from "@/app/(dashboard)/components/reports/PaymentFilters";
import PaymentTable from "@/app/(dashboard)/components/reports/PaymentTable";
import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";

export default function PaymentReportPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<any>(null);

  const [payments, setPayments] = useState<any[]>([]);

  const [pagination, setPagination] = useState<any>(null);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [method, setMethod] = useState("ALL");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  async function loadReport() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", String(page));

      params.append("limit", "10");

      if (search) params.append("search", search);

      if (method !== "ALL") params.append("method", method);

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      const response = await fetch(
        `/api/reports/payments?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setPayments(data.payments);

      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [page]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payment Report</h1>

          <p className="mt-1 text-sm text-slate-500">
            Track all payments received across your company.
          </p>
        </div>

        <div className="flex gap-3">
          <ExportButtons
            title="Payment Report"
            data={payments}
            fileName="payment-report"
          />

          <button
            onClick={loadReport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3954] px-5 py-3 text-white hover:bg-[#082B40]"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <PaymentFilters
        search={search}
        onSearchChange={setSearch}
        method={method}
        onMethodChange={setMethod}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onApply={() => {
          setPage(1);
          loadReport();
        }}
      />

      {/* SUMMARY */}

      {summary && <PaymentSummaryCards summary={summary} />}

      {/* TABLE */}

      {loading ?
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={34} />
        </div>
      : <PaymentTable
          payments={payments}
          page={page}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setPage}
        />
      }

      {!loading && payments.length === 0 && (
        <div className="rounded-2xl border bg-white p-16 text-center">
          <CreditCard size={50} className="mx-auto mb-4 text-slate-400" />

          <h2 className="text-lg font-semibold text-slate-700">
            No payments found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing the filters or date range.
          </p>
        </div>
      )}
    </div>
  );
}
