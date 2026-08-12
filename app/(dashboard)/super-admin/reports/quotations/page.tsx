"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, RefreshCw, Calendar } from "lucide-react";

import QuotationSummaryCards from "@/app/(dashboard)/components/reports/QuotationSummaryCards";
import QuotationFilters from "@/app/(dashboard)/components/reports/QuotationFilters";
import QuotationTable from "@/app/(dashboard)/components/reports/QuotationTable";

interface Summary {
  totalQuotations: number;
  totalValue: number;
  approved: number;
  pending: number;
  rejected: number;
  draft: number;
  converted: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  client: string;
  email: string;
  amount: number;
  status: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  createdBy: string;
  createdAt: string;
}

export default function QuotationsReportPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<Summary | null>(null);

  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  async function loadReport() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.append("page", page.toString());

      if (search) params.append("search", search);

      if (status) params.append("status", status);

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      const res = await fetch(`/api/reports/quotations?${params}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setQuotations(data.quotations);

      setTotalPages(data.pagination.totalPages);
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Quotation Report
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track quotations, approvals and conversions.
          </p>
        </div>

        <button
          onClick={loadReport}
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#0B3954]
          px-5
          py-3
          text-white
          hover:bg-[#092C42]
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}

      <QuotationFilters
        search={search}
        status={status}
        from={from}
        to={to}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
        onApply={() => {
          setPage(1);
          loadReport();
        }}
        onReset={() => {
          setSearch("");
          setStatus("ALL");
          setFrom("");
          setTo("");
          setPage(1);
        }}
      />

      {/* SUMMARY */}

      {summary && <QuotationSummaryCards summary={summary} />}

      {/* TABLE */}

      {loading ?
        <div
          className="
          flex
          h-72
          items-center
          justify-center
        "
        >
          <Loader2 className="animate-spin text-slate-400" size={35} />
        </div>
      : quotations.length === 0 ?
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
          <Calendar size={40} />

          <p>No quotations found.</p>
        </div>
      : <QuotationTable
          quotations={quotations}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      }
    </div>
  );
}
