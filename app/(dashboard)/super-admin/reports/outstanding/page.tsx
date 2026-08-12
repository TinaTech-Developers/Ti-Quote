"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Loader2, AlertTriangle } from "lucide-react";

import OutstandingSummaryCards from "@/app/(dashboard)/components/reports/OutstandingSummaryCards";
import OutstandingFilters from "@/app/(dashboard)/components/reports/OutstandingFilters";
import OutstandingTable from "@/app/(dashboard)/components/reports/OutstandingTable";

interface Summary {
  outstanding: number;
  invoices: number;
  overdue: number;
  partial: number;
  unpaid: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  email: string;
  date: string;
  total: number;
  paid: number;
  balance: number;
  status: string;
  daysOverdue: number;
}

export default function OutstandingBalancesPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<Summary | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  async function loadReport() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", page.toString());

      if (search) params.append("search", search);

      if (status !== "ALL") params.append("status", status);

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      const response = await fetch(`/api/reports/outstanding?${params}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setInvoices(data.invoices);

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

      <div
        className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
      >
        <div>
          <h1
            className="
            text-3xl
            font-bold
            text-slate-800
          "
          >
            Outstanding Balances
          </h1>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
          "
          >
            Track unpaid invoices and customer balances.
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

      <OutstandingFilters
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
      />

      {/* SUMMARY */}

      {summary && <OutstandingSummaryCards summary={summary} />}

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
      : invoices.length === 0 ?
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
          <AlertTriangle size={40} />

          <p>No outstanding invoices found.</p>
        </div>
      : <OutstandingTable
          invoices={invoices}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      }
    </div>
  );
}
