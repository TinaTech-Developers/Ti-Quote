"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";

import ReportStatCard from "./ReportStatCard";
import SalesOverview from "./SalesOverview";
import InvoiceStatusOverview from "./InvoiceStatusOverview";
import PaymentMethodsOverview from "./PaymentMethodsOverview";

interface ReportData {
  summary: {
    totalInvoiced: number;
    totalPayments: number;
    totalOutstanding: number;
    totalOverdue: number;

    invoiceCount: number;
    paymentCount: number;

    paidInvoices: number;
    partialInvoices: number;
    sentInvoices: number;
    overdueInvoices: number;
    draftInvoices: number;
    cancelledInvoices: number;
  };

  paymentMethods: {
    method: string;
    amount: number;
  }[];

  salesOverview: {
    date: string;
    sales: number;
    payments: number;
  }[];

  recentInvoices: {
    id: string;
    invoiceNumber: string;
    client: string;
    total: number;
    balance: number;
    status: string;
    createdAt: string;
  }[];

  recentPayments: {
    id: string;
    paymentNumber: string;
    invoiceNumber: string;
    amount: number;
    method: string;
    paidAt: string;
  }[];
}

const RANGES = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7days",
    label: "Last 7 Days",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "30days",
    label: "Last 30 Days",
  },
  {
    value: "90days",
    label: "Last 90 Days",
  },
  {
    value: "year",
    label: "This Year",
  },
  {
    value: "all",
    label: "All Time",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReportsDashboard() {
  const [range, setRange] = useState("month");

  const [data, setData] = useState<ReportData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/reports/overview?range=${range}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to load reports.");
      }

      setData(result);
    } catch (error: any) {
      console.error("Reports loading error:", error);

      setError(error?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, [range]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm text-slate-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />

        <h2 className="mt-3 font-semibold text-red-800">
          Unable to load reports
        </h2>

        <p className="mt-1 text-sm text-red-600">{error}</p>

        <button
          type="button"
          onClick={loadReports}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Reports
              </h1>

              <p className="text-sm text-slate-500">
                Financial overview and business performance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-48"
            >
              {RANGES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          title="Total Invoiced"
          value={formatCurrency(summary.totalInvoiced)}
          description={`${summary.invoiceCount} invoices`}
          icon={FileText}
        />

        <ReportStatCard
          title="Payments Received"
          value={formatCurrency(summary.totalPayments)}
          description={`${summary.paymentCount} payments`}
          icon={Wallet}
        />

        <ReportStatCard
          title="Outstanding"
          value={formatCurrency(summary.totalOutstanding)}
          description="Current receivables"
          icon={CircleDollarSign}
        />

        <ReportStatCard
          title="Overdue"
          value={formatCurrency(summary.totalOverdue)}
          description={`${summary.overdueInvoices} overdue invoices`}
          icon={Clock3}
        />
      </div>

      {/* =====================================================
          SALES CHART
      ===================================================== */}

      <SalesOverview data={data.salesOverview} />

      {/* =====================================================
          STATUS + PAYMENT METHODS
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <InvoiceStatusOverview summary={summary} />

        <PaymentMethodsOverview data={data.paymentMethods} />
      </div>

      {/* =====================================================
          RECENT INVOICES
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Invoices
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest invoices within the selected period.
            </p>
          </div>

          <Link
            href="/admin/invoices"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Invoice
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Balance
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.recentInvoices.length === 0 ?
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No invoices found for this period.
                  </td>
                </tr>
              : data.recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {invoice.client}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(invoice.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                      {formatCurrency(invoice.total)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">
                      {formatCurrency(invoice.balance)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          invoice.status === "PAID" ?
                            "bg-emerald-50 text-emerald-700"
                          : invoice.status === "OVERDUE" ?
                            "bg-red-50 text-red-700"
                          : invoice.status === "PARTIAL" ?
                            "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          RECENT PAYMENTS
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Payments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest completed payments.
            </p>
          </div>

          <Link
            href="/admin/payments"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Invoice
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Method
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.recentPayments.length === 0 ?
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No payments found for this period.
                  </td>
                </tr>
              : data.recentPayments.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {payment.paymentNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.invoiceNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.method.replace(/_/g, " ")}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(payment.paidAt)}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
