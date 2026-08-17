"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type QuoteStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CONVERTED";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
}

interface CreatedBy {
  id: string;
  fullName: string;
}

interface Quotation {
  id: string;
  quotationNumber: string;

  companyId: string;

  clientId: string;
  client?: Client | null;

  createdById: string;
  createdBy?: CreatedBy | null;

  status: QuoteStatus;

  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;

  notes?: string | null;
  validUntil?: string | null;

  approvedAt?: string | null;
  acceptedAt?: string | null;
  sentAt?: string | null;
  convertedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  items?: unknown[];
}

// =====================================================
// CONSTANTS
// =====================================================

const PAGE_SIZE = 10;

const STATUS_OPTIONS: {
  value: "ALL" | QuoteStatus;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All Statuses",
  },
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "EXPIRED",
    label: "Expired",
  },
  {
    value: "CONVERTED",
    label: "Converted",
  },
];

// =====================================================
// HELPERS
// =====================================================

function formatMoney(value: number | string) {
  const amount = Number(value || 0);

  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getClientName(quotation: Quotation) {
  if (quotation.client?.companyName) {
    return quotation.client.companyName;
  }

  return quotation.client?.name || "Unknown Client";
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }: { status: QuoteStatus }) {
  const styles: Record<
    QuoteStatus,
    {
      wrapper: string;
      dot: string;
      label: string;
    }
  > = {
    DRAFT: {
      wrapper: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
      label: "Draft",
    },

    PENDING: {
      wrapper: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },

    APPROVED: {
      wrapper: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      label: "Approved",
    },

    REJECTED: {
      wrapper: "bg-red-50 text-red-700",
      dot: "bg-red-500",
      label: "Rejected",
    },

    EXPIRED: {
      wrapper: "bg-orange-50 text-orange-700",
      dot: "bg-orange-500",
      label: "Expired",
    },

    CONVERTED: {
      wrapper: "bg-cyan-50 text-cyan-700",
      dot: "bg-cyan-500",
      label: "Converted",
    },
  };

  const style = styles[status] || styles.DRAFT;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1.5
        text-xs
        font-semibold
        ${style.wrapper}
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${style.dot}
        `}
      />

      {style.label}
    </span>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | QuoteStatus>("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =====================================================
  // LOAD QUOTATIONS
  // =====================================================

  useEffect(() => {
    loadQuotations();
  }, []);

  async function loadQuotations(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/quotations", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load quotations.");
      }

      let quotationData: Quotation[] = [];

      if (Array.isArray(data)) {
        quotationData = data;
      } else if (Array.isArray(data.quotations)) {
        quotationData = data.quotations;
      } else if (Array.isArray(data.data)) {
        quotationData = data.data;
      }

      setQuotations(quotationData);
    } catch (error) {
      console.error("Load quotations error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load quotations.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDelete(quotation: Quotation) {
    if (quotation.status !== "DRAFT") {
      setError("Only draft quotations can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete quotation ${quotation.quotationNumber}?`,
    );

    if (!confirmed) return;

    setDeletingId(quotation.id);
    setError("");

    try {
      const response = await fetch(`/api/quotations/${quotation.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete quotation.");
      }

      setQuotations((prev) => prev.filter((item) => item.id !== quotation.id));
    } catch (error) {
      console.error("Delete quotation error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete quotation.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredQuotations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return quotations.filter((quotation) => {
      const matchesStatus =
        statusFilter === "ALL" || quotation.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const quotationNumber = quotation.quotationNumber?.toLowerCase() || "";

      const clientName = getClientName(quotation).toLowerCase();

      return (
        quotationNumber.includes(searchValue) ||
        clientName.includes(searchValue)
      );
    });
  }, [quotations, search, statusFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuotations.length / PAGE_SIZE),
  );

  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =====================================================
  // STATS
  // =====================================================

  const totalCount = quotations.length;

  const draftCount = quotations.filter(
    (item) => item.status === "DRAFT",
  ).length;

  const pendingCount = quotations.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approvedCount = quotations.filter(
    (item) => item.status === "APPROVED",
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#0097A7]" />

          <p className="text-sm text-slate-500">Loading quotations...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-full space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-cyan-50
              text-[#0097A7]
            "
          >
            <FileText size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Quotations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, manage and track customer quotations.
            </p>
          </div>
        </div>

        <Link
          href="/admin/quotations/create"
          className="
            inline-flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            px-6
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#092C42]
          "
        >
          <Plus size={19} />
          New Quotation
        </Link>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Quotations
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FileText size={19} />
            </div>
          </div>
        </div>

        {/* DRAFT */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Drafts
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {draftCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Pencil size={18} />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {pendingCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <RefreshCw size={18} />
            </div>
          </div>
        </div>

        {/* APPROVED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Approved
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {approvedCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
          "
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to complete request</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* FILTER BAR */}

        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quotation number or client..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#0097A7]
                  focus:ring-4
                  focus:ring-cyan-50
                "
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* STATUS */}

              <div className="relative">
                <Filter
                  size={16}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "ALL" | QuoteStatus)
                  }
                  className="
                    h-11
                    w-full
                    min-w-[170px]
                    appearance-none
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-9
                    pr-8
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={() => loadQuotations(true)}
                disabled={refreshing}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quotation
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Valid Until
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedQuotations.length === 0 ?
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FileText size={25} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-700">
                      No quotations found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {search || statusFilter !== "ALL" ?
                        "Try changing your search or filter."
                      : "Create your first quotation to get started."}
                    </p>

                    {!search && statusFilter === "ALL" && (
                      <Link
                        href="/admin/quotations/create"
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#0B3954]
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#092C42]
                          "
                      >
                        <Plus size={17} />
                        Create Quotation
                      </Link>
                    )}
                  </td>
                </tr>
              : paginatedQuotations.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* QUOTATION */}

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/quotations/${quotation.id}`}
                        className="
                            text-sm
                            font-semibold
                            text-[#0B3954]
                            hover:text-[#0097A7]
                          "
                      >
                        {quotation.quotationNumber}
                      </Link>

                      <p className="mt-1 text-xs text-slate-400">
                        {quotation.items?.length ?? 0} item
                        {(quotation.items?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </td>

                    {/* CLIENT */}

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {getClientName(quotation)}
                      </p>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {formatDate(quotation.createdAt)}
                      </p>
                    </td>

                    {/* VALID UNTIL */}

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {formatDate(quotation.validUntil)}
                      </p>
                    </td>

                    {/* TOTAL */}

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-800">
                        {formatMoney(quotation.total)}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <StatusBadge status={quotation.status} />
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/quotations/${quotation.id}`}
                          title="View quotation"
                          className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-slate-500
                              transition
                              hover:bg-cyan-50
                              hover:text-[#0097A7]
                            "
                        >
                          <Eye size={17} />
                        </Link>

                        {quotation.status === "DRAFT" && (
                          <>
                            <Link
                              href={`/admin/quotations/${quotation.id}/edit`}
                              title="Edit quotation"
                              className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-slate-500
                                  transition
                                  hover:bg-slate-100
                                  hover:text-[#0B3954]
                                "
                            >
                              <Pencil size={17} />
                            </Link>

                            <button
                              type="button"
                              title="Delete quotation"
                              onClick={() => handleDelete(quotation)}
                              disabled={deletingId === quotation.id}
                              className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-slate-400
                                  transition
                                  hover:bg-red-50
                                  hover:text-red-600
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                            >
                              {deletingId === quotation.id ?
                                <Loader2 size={17} className="animate-spin" />
                              : <Trash2 size={17} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* MOBILE */}

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedQuotations.length === 0 ?
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileText size={25} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                No quotations found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No quotations match your current filters.
              </p>
            </div>
          : paginatedQuotations.map((quotation) => (
              <div key={quotation.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/admin/quotations/${quotation.id}`}
                      className="text-sm font-bold text-[#0B3954]"
                    >
                      {quotation.quotationNumber}
                    </Link>

                    <p className="mt-1 text-sm text-slate-600">
                      {getClientName(quotation)}
                    </p>
                  </div>

                  <StatusBadge status={quotation.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Date</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(quotation.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Valid Until</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(quotation.validUntil)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Items</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {quotation.items?.length ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Total</p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatMoney(quotation.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <Link
                    href={`/admin/quotations/${quotation.id}`}
                    className="
                      inline-flex
                      h-9
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-slate-200
                      px-3
                      text-xs
                      font-semibold
                      text-slate-600
                      hover:bg-slate-50
                    "
                  >
                    <Eye size={15} />
                    View
                  </Link>

                  {quotation.status === "DRAFT" && (
                    <>
                      <Link
                        href={`/admin/quotations/${quotation.id}/edit`}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-slate-200
                          px-3
                          text-xs
                          font-semibold
                          text-slate-600
                          hover:bg-slate-50
                        "
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(quotation)}
                        disabled={deletingId === quotation.id}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          text-xs
                          font-semibold
                          text-red-600
                          hover:bg-red-50
                          disabled:opacity-50
                        "
                      >
                        {deletingId === quotation.id ?
                          <Loader2 size={15} className="animate-spin" />
                        : <Trash2 size={15} />}
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          }
        </div>

        {/* PAGINATION */}

        {filteredQuotations.length > 0 && (
          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-slate-100
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * PAGE_SIZE, filteredQuotations.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredQuotations.length}
              </span>{" "}
              quotations
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-500
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft size={17} />
              </button>

              <span className="px-2 text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-500
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
