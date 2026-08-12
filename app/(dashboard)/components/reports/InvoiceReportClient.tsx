"use client";

import { useEffect, useState } from "react";
import { Loader2, Receipt, RefreshCw } from "lucide-react";

import InvoiceSummaryCards from "@/app/(dashboard)/components/reports/InvoiceSummaryCards";

import InvoiceFilters from "@/app/(dashboard)/components/reports/InvoiceFilters";

import InvoiceTable from "@/app/(dashboard)/components/reports/InvoiceTable";

import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";

export interface InvoiceReportSummary {
  total: number;

  totalAmount: number;

  paid: number;

  partial: number;

  unpaid: number;

  cancelled: number;
}

export interface ReportInvoice {
  id: string;

  invoiceNumber: string;

  client: string;

  email: string;

  date: string;

  total: number;

  paid: number;

  balance: number;

  status: string;

  createdBy: string;
}

export default function InvoiceReportClient() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<InvoiceReportSummary | null>(null);

  const [invoices, setInvoices] = useState<ReportInvoice[]>([]);

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [status, setStatus] = useState("ALL");

  const [search, setSearch] = useState("");

  async function loadReport() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      if (status !== "ALL") params.append("status", status);

      if (search) params.append("search", search);

      const res = await fetch(`/api/reports/invoices?${params.toString()}`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSummary(data.summary);

      setInvoices(data.invoices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

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
            Invoice Report
          </h1>

          <p
            className="
            text-sm
            text-slate-500
            mt-1
          "
          >
            Monitor invoice performance, payments and balances.
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
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}

      <InvoiceFilters
        from={from}
        to={to}
        status={status}
        search={search}
        onFromChange={setFrom}
        onToChange={setTo}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onApply={loadReport}
      />

      {/* SUMMARY */}

      {summary && <InvoiceSummaryCards summary={summary} />}

      {/* EXPORT */}

      {invoices.length > 0 && (
        <div className="flex justify-end">
          <ExportButtons
            data={invoices.map((item) => ({
              month: item.invoiceNumber,
              invoices: 1,
              revenue: item.total,
              paid: item.paid,
              outstanding: item.balance,
              tax: 0,
              discount: 0,
            }))}
            title="Invoice Report"
          />
        </div>
      )}

      {/* TABLE */}

      {loading ?
        <div
          className="
          h-72
          flex
          items-center
          justify-center
        "
        >
          <Loader2 className="animate-spin" size={35} />
        </div>
      : invoices.length === 0 ?
        <div
          className="
          h-72
          flex
          flex-col
          items-center
          justify-center
          text-slate-500
        "
        >
          <Receipt size={45} />

          <p>No invoices found</p>
        </div>
      : <InvoiceTable invoices={invoices} />}
    </div>
  );
}
