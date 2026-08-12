"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, RefreshCw } from "lucide-react";

import ProductSalesSummaryCards from "@/app/(dashboard)/components/reports/ProductSalesSummaryCards";
import ProductSalesFilters from "@/app/(dashboard)/components/reports/ProductSalesFilters";
import ProductSalesTable from "@/app/(dashboard)/components/reports/ProductSalesTable";
import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";

interface ProductSummary {
  totalProducts: number;
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

interface ProductSale {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  invoices: number;
}

export default function ProductSalesReportPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<ProductSummary | null>(null);

  const [products, setProducts] = useState<ProductSale[]>([]);

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
        `/api/reports/products?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSummary(data.summary);

      setProducts(data.products);
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
            Product Sales Report
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View product sales, quantities sold and generated revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons fileName="product-sales-report" data={products} />

          <button
            onClick={loadReport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3954] px-5 py-3 text-white hover:bg-[#092C42]"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <ProductSalesFilters
        from={from}
        to={to}
        search={search}
        onFromChange={setFrom}
        onToChange={setTo}
        onSearchChange={setSearch}
        onApply={loadReport}
      />

      {/* SUMMARY */}

      {summary && <ProductSalesSummaryCards summary={summary} />}

      {/* TABLE */}

      {loading ?
        <div className="flex h-72 items-center justify-center rounded-2xl border bg-white">
          <Loader2 className="animate-spin text-slate-400" size={34} />
        </div>
      : products.length === 0 ?
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border bg-white">
          <Package className="text-slate-400" size={42} />

          <p className="text-slate-500">No product sales found.</p>
        </div>
      : <ProductSalesTable products={products} />}
    </div>
  );
}
