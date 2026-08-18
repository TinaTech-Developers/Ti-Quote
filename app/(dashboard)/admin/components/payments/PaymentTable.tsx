"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  CalendarDays,
  MoreHorizontal,
  Receipt,
} from "lucide-react";

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
    } | null;
  } | null;

  client?: {
    id: string;
    name?: string;
    companyName?: string;
    email?: string;
  } | null;

  createdBy?: {
    id: string;
    fullName?: string;
    email?: string;
  } | null;
}

interface PaymentTableProps {
  payments?: Payment[];
  loading?: boolean;
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function PaymentTable({
  payments = [],
  loading = false,
  onRefresh,
}: PaymentTableProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const formatCurrency = (value: number | string | undefined | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-ZW", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getClientName = (payment: Payment) => {
    const client = payment.client || payment.invoice?.client;

    if (!client) return "Unknown client";

    return (
      client.companyName || client.name || client.email || "Unknown client"
    );
  };

  const normalizeStatus = (status?: string) => {
    return (status || "").toUpperCase();
  };

  const normalizeMethod = (method?: string) => {
    return (method || "").toUpperCase();
  };

  const getStatusClasses = (status: string) => {
    switch (normalizeStatus(status)) {
      case "COMPLETED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "FAILED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      case "REFUNDED":
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CASH: "Cash",
      BANK_TRANSFER: "Bank Transfer",
      BANK: "Bank Transfer",
      ECOCASH: "EcoCash",
      ZIPIT: "ZIPIT",
      CARD: "Card",
      MOBILE_MONEY: "Mobile Money",
      OTHER: "Other",
    };

    return labels[normalizeMethod(method)] || method || "Other";
  };

  const getMethodIcon = (method: string) => {
    const normalized = normalizeMethod(method);

    if (normalized === "BANK_TRANSFER" || normalized === "BANK") {
      return "Bank";
    }

    if (
      normalized === "ECOCASH" ||
      normalized === "ZIPIT" ||
      normalized === "MOBILE_MONEY"
    ) {
      return "Mobile";
    }

    if (normalized === "CARD") {
      return "Card";
    }

    return "Cash";
  };

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const clientName = getClientName(payment);

      const matchesSearch =
        !query ||
        payment.paymentNumber?.toLowerCase().includes(query) ||
        payment.invoice?.invoiceNumber?.toLowerCase().includes(query) ||
        clientName.toLowerCase().includes(query) ||
        payment.reference?.toLowerCase().includes(query);

      const matchesMethod =
        methodFilter === "ALL" ||
        normalizeMethod(payment.paymentMethod) === methodFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(payment.status) === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, search, methodFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ITEMS_PER_PAGE),
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Payments</h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage recorded customer payments.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payments..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white sm:w-64"
              />
            </div>

            {/* Method */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-slate-400"
            >
              <option value="ALL">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="ECOCASH">EcoCash</option>
              <option value="ZIPIT">ZIPIT</option>
              <option value="CARD">Card</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-slate-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1050px] w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Invoice
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Method
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ?
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 8 }).map((__, cell) => (
                    <td key={cell} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))
            : paginatedPayments.length === 0 ?
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Receipt size={22} className="text-slate-400" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No payments found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {(
                      search || methodFilter !== "ALL" || statusFilter !== "ALL"
                    ) ?
                      "Try adjusting your search or filters."
                    : "Payments recorded against invoices will appear here."}
                  </p>
                </td>
              </tr>
            : paginatedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="group transition hover:bg-slate-50/70"
                >
                  {/* Payment */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <CreditCard size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.paymentNumber}
                        </p>

                        {payment.reference && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Ref: {payment.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Invoice */}
                  <td className="px-5 py-4">
                    {payment.invoice ?
                      <Link
                        href={`/invoices/${payment.invoice.id}`}
                        className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
                      >
                        {payment.invoice.invoiceNumber}
                      </Link>
                    : <span className="text-sm text-slate-400">-</span>}
                  </td>

                  {/* Client */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="max-w-[190px] truncate text-sm font-medium text-slate-800">
                        {getClientName(payment)}
                      </p>

                      {payment.client?.email && (
                        <p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-400">
                          {payment.client.email}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={15} className="text-slate-400" />

                      {formatDate(payment.paymentDate)}
                    </div>
                  </td>

                  {/* Method */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                        {getMethodIcon(payment.paymentMethod).charAt(0)}
                      </span>

                      <span className="text-sm text-slate-700">
                        {getMethodLabel(payment.paymentMethod)}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        payment.status,
                      )}`}
                    >
                      {payment.status ?
                        payment.status
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "Unknown"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="relative px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenu(
                          openMenu === payment.id ? null : payment.id,
                        );
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenu === payment.id && (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        className="absolute right-5 top-12 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg"
                      >
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Eye size={16} />
                          View Payment
                        </Link>

                        <Link
                          href={`/admin/payments/${payment.id}/edit`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setOpenMenu(null)}
                        >
                          <CreditCard size={16} />
                          Edit Payment
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {filteredPayments.length === 0 ?
              0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-700">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {filteredPayments.length}
          </span>{" "}
          payments
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(totalPages, currentPage + 1),
              )
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                    currentPage === page ?
                      "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
