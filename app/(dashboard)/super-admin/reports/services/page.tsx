"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Wrench } from "lucide-react";

import ServiceSalesSummaryCards from "@/app/(dashboard)/components/reports/ServiceSalesSummaryCards";
import ServiceSalesFilters from "@/app/(dashboard)/components/reports/ServiceSalesFilters";
import ServiceSalesTable from "@/app/(dashboard)/components/reports/ServiceSalesTable";
import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";

interface ServiceSummary {
  totalServices: number;
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

interface ServiceSale {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  invoices: number;
}

export default function ServiceSalesReportPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<ServiceSummary | null>(null);

  const [services, setServices] = useState<ServiceSale[]>([]);

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [search, setSearch] = useState("");

  async function loadReport() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      if (search) params.append("search", search);

      const response = await fetch(
        `/api/reports/services?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setServices(data.services);
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Service Sales Report
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View services sold, quantities and generated revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons
            title="Service Sales Report"
            fileName="service-sales-report"
            data={services}
          />

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
      </div>

      {/* FILTERS */}

      <ServiceSalesFilters
        from={from}
        to={to}
        search={search}
        onFromChange={setFrom}
        onToChange={setTo}
        onSearchChange={setSearch}
        onApply={loadReport}
      />

      {/* SUMMARY */}

      {summary && <ServiceSalesSummaryCards summary={summary} />}

      {/* TABLE */}

      {loading ?
        <div
          className="
          flex
          h-72
          items-center
          justify-center
          rounded-2xl
          border
          bg-white
        "
        >
          <Loader2 size={34} className="animate-spin text-slate-400" />
        </div>
      : services.length === 0 ?
        <div
          className="
          flex
          h-72
          flex-col
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          bg-white
        "
        >
          <Wrench size={42} className="text-slate-400" />

          <p className="text-slate-500">No service sales found.</p>
        </div>
      : <ServiceSalesTable services={services} />}
    </div>
  );
}
