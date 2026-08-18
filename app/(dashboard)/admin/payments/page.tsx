"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  DollarSign,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";

import PaymentTable from "../components/payments/PaymentTable";

interface Payment {
  id: string;
  paymentNumber: string;
  amount: number | string;
  paymentDate: string;
  paymentMethod: string;
  status: string;

  reference?: string | null;
  notes?: string | null;

  invoice?: {
    id: string;
    invoiceNumber: string;
    total: number | string;
    balanceDue?: number | string;

    client?: {
      id: string;
      name?: string;
      companyName?: string;
      email?: string;
      phone?: string;
    } | null;
  } | null;

  client?: {
    id: string;
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
  } | null;

  createdBy?: {
    id: string;
    fullName?: string;
    email?: string;
  } | null;

  createdAt?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (value: number | string | null | undefined) => {
    return new Intl.NumberFormat("en-ZW", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
  };

  const fetchPayments = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/payments", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to load payments.",
        );
      }

      /*
       * Support common API response formats:
       *
       * [...]
       *
       * {
       *   payments: [...]
       * }
       *
       * {
       *   data: [...]
       * }
       */
      const paymentList =
        Array.isArray(data) ? data
        : Array.isArray(data?.payments) ? data.payments
        : Array.isArray(data?.data) ? data.data
        : [];

      setPayments(paymentList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  /*
   * Only completed/paid payments count toward
   * collected amounts.
   */
  const completedPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status = payment.status?.toUpperCase();

      return status === "COMPLETED" || status === "PAID";
    });
  }, [payments]);

  const totalCollected = useMemo(() => {
    return completedPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );
  }, [completedPayments]);

  const todayCollected = useMemo(() => {
    const today = new Date();

    return completedPayments.reduce((total, payment) => {
      const paymentDate = new Date(payment.paymentDate);

      const sameDay =
        paymentDate.getFullYear() === today.getFullYear() &&
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getDate() === today.getDate();

      if (sameDay) {
        return total + Number(payment.amount || 0);
      }

      return total;
    }, 0);
  }, [completedPayments]);

  const monthlyCollected = useMemo(() => {
    const today = new Date();

    return completedPayments.reduce((total, payment) => {
      const paymentDate = new Date(payment.paymentDate);

      const sameMonth =
        paymentDate.getFullYear() === today.getFullYear() &&
        paymentDate.getMonth() === today.getMonth();

      if (sameMonth) {
        return total + Number(payment.amount || 0);
      }

      return total;
    }, 0);
  }, [completedPayments]);

  const pendingAmount = useMemo(() => {
    return payments
      .filter((payment) => payment.status?.toUpperCase() === "PENDING")
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);
  }, [payments]);

  const completedCount = completedPayments.length;

  const pendingCount = payments.filter(
    (payment) => payment.status?.toUpperCase() === "PENDING",
  ).length;

  const failedCount = payments.filter((payment) => {
    const status = payment.status?.toUpperCase();

    return status === "FAILED" || status === "CANCELLED";
  }).length;

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------
          Page Header
      -------------------------------------------------- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <CreditCard size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Payments
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track and manage customer payments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchPayments(true)}
            disabled={loading || refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/admin/payments/create"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Record Payment
          </Link>
        </div>
      </div>

      {/* --------------------------------------------------
          Error
      -------------------------------------------------- */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load payments
            </p>

            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchPayments(true)}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* --------------------------------------------------
          Statistics
      -------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalCollected)}
          subtitle={`${completedCount} completed payments`}
          icon={<DollarSign size={19} />}
          loading={loading}
        />

        <StatCard
          title="This Month"
          value={formatCurrency(monthlyCollected)}
          subtitle="Completed payments this month"
          icon={<CalendarDays size={19} />}
          loading={loading}
          trend={
            monthlyCollected > 0 ? "Collections active" : "No collections yet"
          }
        />

        <StatCard
          title="Today"
          value={formatCurrency(todayCollected)}
          subtitle="Payments received today"
          icon={<Wallet size={19} />}
          loading={loading}
          trend={todayCollected > 0 ? "Received today" : "No payments today"}
        />

        <StatCard
          title="Pending"
          value={formatCurrency(pendingAmount)}
          subtitle={`${pendingCount} pending payment${
            pendingCount === 1 ? "" : "s"
          }`}
          icon={<Activity size={19} />}
          loading={loading}
          warning={pendingCount > 0}
        />
      </div>

      {/* --------------------------------------------------
          Secondary summary
      -------------------------------------------------- */}
      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat
          label="Completed"
          value={completedCount}
          icon={<ArrowUpRight size={16} />}
          description="Successfully recorded"
        />

        <MiniStat
          label="Pending"
          value={pendingCount}
          icon={<Activity size={16} />}
          description="Awaiting confirmation"
        />

        <MiniStat
          label="Failed / Cancelled"
          value={failedCount}
          icon={<ArrowDownRight size={16} />}
          description="Unsuccessful transactions"
        />
      </div>

      {/* --------------------------------------------------
          Payments table
      -------------------------------------------------- */}
      <PaymentTable
        payments={payments}
        loading={loading}
        onRefresh={() => fetchPayments(true)}
      />
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading,
  trend,
  warning = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  loading?: boolean;
  trend?: string;
  warning?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="mt-5 h-7 w-32 animate-pulse rounded bg-slate-100" />

        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        warning ? "border-amber-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            warning ?
              "bg-amber-50 text-amber-600"
            : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>

        {trend && (
          <span
            className={`text-xs font-medium ${
              warning ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>

        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>
    </div>
  );
}
