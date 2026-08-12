"use client";

import { useEffect, useState } from "react";

import {
  Loader2,
  RefreshCw,
  Users,
  FileText,
  DollarSign,
  Package,
} from "lucide-react";

import AdminSummaryCards from "@/app/(dashboard)/components/admin/AdminSummaryCards";
import RecentActivityWidget from "@/app/(dashboard)/components/admin/RecentActivityWidget";
import LowStockWidget from "@/app/(dashboard)/components/admin/LowStockWidget";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard/admin");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div
        className="
        flex
        h-[500px]
        items-center
        justify-center
        "
      >
        <Loader2
          className="
          animate-spin
          text-slate-400
          "
          size={40}
        />
      </div>
    );
  }

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
            text-xl
            font-bold
            text-slate-800
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            "
          >
            Overview of your business performance.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#0B3954]
          px-5
          py-3
          font-semibold
          text-white
          hover:bg-[#092C42]
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}

      {dashboard && (
        <AdminSummaryCards
          revenue={dashboard.revenue}
          invoices={dashboard.invoices}
          clients={dashboard.clients}
          products={dashboard.products}
        />
      )}

      {/* LOWER SECTION */}

      <div
        className="
        grid
        gap-6
        lg:grid-cols-2
        "
      >
        {dashboard && (
          <LowStockWidget products={dashboard.products.lowStockItems} />
        )}

        {dashboard && (
          <RecentActivityWidget activities={dashboard.activities} />
        )}
      </div>
    </div>
  );
}
