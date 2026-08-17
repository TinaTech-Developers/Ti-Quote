"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  User,
  CalendarDays,
  Package,
  Receipt,
} from "lucide-react";
import ApproveQuotationButton from "@/app/(dashboard)/components/quotations/ApproveQuotationButton";

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
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
}

interface CreatedBy {
  id: string;
  fullName: string;
}

interface Product {
  id: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
}

interface Service {
  id: string;
  name: string;
}

interface QuotationItem {
  id: string;
  productId?: string | null;
  serviceId?: string | null;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
  total: number | string;
  product?: Product | null;
  service?: Service | null;
}

interface Quotation {
  id: string;
  quotationNumber: string;

  companyId: string;

  clientId: string;
  client?: Client | null;

  createdById: string;
  createdBy?: CreatedBy | null;

  approvedById?: string | null;
  approvedBy?: CreatedBy | null;

  approvedAt?: string | null;
  acceptedAt?: string | null;
  sentAt?: string | null;
  convertedAt?: string | null;

  status: QuoteStatus;

  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;

  notes?: string | null;
  validUntil?: string | null;

  items: QuotationItem[];

  createdAt: string;
  updatedAt: string;
}

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

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getClientName(quotation: Quotation) {
  if (quotation.client?.companyName) {
    return quotation.client.companyName;
  }

  return quotation.client?.name || "Unknown Client";
}

function getItemType(item: QuotationItem) {
  if (item.product) return "Product";
  if (item.service) return "Service";

  if (item.productId) return "Product";
  if (item.serviceId) return "Service";

  return "Item";
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
          h-2
          w-2
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

export default function QuotationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const quotationId = params.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);

  const [converting, setConverting] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    if (!quotationId) return;

    loadQuotation();
  }, [quotationId]);

  async function loadQuotation(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load quotation.");
      }

      console.log("Quotation status:", data.status);
      console.log("Quotation:", data);
      setQuotation(data);
    } catch (error) {
      console.error("Load quotation error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load quotation.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDelete() {
    if (!quotation) return;

    if (quotation.status !== "DRAFT") {
      setError("Only draft quotations can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete quotation ${quotation.quotationNumber}?`,
    );

    if (!confirmed) return;

    setDeleting(true);
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

      router.push("/admin/quotations");
      router.refresh();
    } catch (error) {
      console.error("Delete quotation error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete quotation.",
      );
    } finally {
      setDeleting(false);
    }
  }

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  async function handleDownloadPDF() {
    if (!quotation) return;

    setDownloading(true);
    setError("");

    try {
      const response = await fetch(`/api/quotations/${quotation.id}/pdf`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        let message = "Failed to generate quotation PDF.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {}

        throw new Error(message);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${quotation.quotationNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download quotation PDF error:", error);

      setError(
        error instanceof Error ?
          error.message
        : "Failed to download quotation PDF.",
      );
    } finally {
      setDownloading(false);
    }
  }

  // =====================================================
  // SEND
  // =====================================================

  async function handleSend() {
    if (!quotation) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch(`/api/quotations/${quotation.id}/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send quotation.");
      }

      await loadQuotation(true);
    } catch (error) {
      console.error("Send quotation error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to send quotation.",
      );
    } finally {
      setSending(false);
    }
  }

  // ======================================================
  // CONVERT TO INVOICE
  // ======================================================

  async function handleConvertToInvoice() {
    if (!quotation) return;

    const confirmed = window.confirm(
      `Convert quotation ${quotation.quotationNumber} to invoice?`,
    );

    if (!confirmed) return;

    try {
      setConverting(true);
      setError("");

      const response = await fetch(`/api/quotations/${quotation.id}/convert`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to convert quotation");
      }

      alert("Quotation converted successfully");

      router.push(`/admin/invoices/${data.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to convert quotation",
      );
    } finally {
      setConverting(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#0097A7]" />

          <p className="text-sm text-slate-500">Loading quotation...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!quotation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/quotations"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quotation</h1>

            <p className="mt-1 text-sm text-slate-500">
              Unable to load quotation.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5" />

            <div>
              <p className="font-semibold">Quotation could not be loaded</p>

              <p className="mt-1 text-sm">{error || "Quotation not found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-full space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/quotations"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              hover:text-[#0B3954]
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText size={22} className="text-[#0097A7]" />

                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  {quotation.quotationNumber}
                </h1>
              </div>

              <StatusBadge status={quotation.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Quotation details and customer information.
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadQuotation(true)}
            disabled={refreshing}
            className="
              inline-flex
              h-10
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
              disabled:opacity-50
            "
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          {quotation.status === "DRAFT" && (
            <ApproveQuotationButton quotationId={quotation.id} />
          )}

          {quotation.status === "APPROVED" && (
            <button
              type="button"
              onClick={handleConvertToInvoice}
              disabled={converting}
              className="
  inline-flex
  h-10
  items-center
  justify-center
  gap-2
  rounded-xl
  bg-emerald-600
  px-4
  text-sm
  font-semibold
  text-white
  transition
  hover:bg-emerald-700
  disabled:cursor-not-allowed
  disabled:opacity-60
"
            >
              {converting ?
                <Loader2 size={17} className="animate-spin" />
              : <Receipt size={17} />}
              Convert To Invoice
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="
              inline-flex
              h-10
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
              disabled:opacity-50
            "
          >
            {downloading ?
              <Loader2 size={16} className="animate-spin" />
            : <Download size={16} />}
            PDF
          </button>

          {quotation.status === "DRAFT" && (
            <Link
              href={`/admin/quotations/${quotation.id}/edit`}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0B3954]
                px-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#092C42]
              "
            >
              <Pencil size={16} />
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

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

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6 xl:col-span-2">
          {/* CLIENT */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-50
                    text-[#0097A7]
                  "
                >
                  <User size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Client Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Customer associated with this quotation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Client
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {getClientName(quotation)}
                </p>

                {quotation.client?.companyName &&
                  quotation.client.name !== quotation.client.companyName && (
                    <p className="mt-1 text-sm text-slate-500">
                      {quotation.client.name}
                    </p>
                  )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {quotation.client?.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {quotation.client?.address || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  City
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {quotation.client?.city || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS */}

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
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    text-slate-600
                  "
                >
                  <Package size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Quotation Items
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Products and services included in this quotation.
                  </p>
                </div>
              </div>
            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Qty
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Unit Price
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {quotation.items?.length > 0 ?
                    quotation.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {item.description}
                          </p>

                          {item.product?.sku && (
                            <p className="mt-1 text-xs text-slate-400">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-lg
                              bg-slate-100
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              text-slate-600
                            "
                          >
                            {getItemType(item)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="text-sm text-slate-600">
                            {Number(item.quantity).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="text-sm text-slate-600">
                            {formatMoney(item.unitPrice)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-slate-800">
                            {formatMoney(item.total)}
                          </span>
                        </td>
                      </tr>
                    ))
                  : <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No items found.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            {/* MOBILE */}

            <div className="divide-y divide-slate-100 md:hidden">
              {quotation.items?.length > 0 ?
                quotation.items.map((item) => (
                  <div key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.description}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {getItemType(item)}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-slate-800">
                        {formatMoney(item.total)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Quantity</p>

                        <p className="mt-1 text-sm text-slate-700">
                          {Number(item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Unit Price</p>

                        <p className="mt-1 text-sm text-slate-700">
                          {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : <div className="p-8 text-center text-sm text-slate-500">
                  No items found.
                </div>
              }
            </div>
          </div>

          {/* NOTES */}

          {quotation.notes && (
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-lg font-semibold text-slate-800">Notes</h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {quotation.notes}
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">
          {/* SUMMARY */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-50
                    text-[#0097A7]
                  "
                >
                  <Receipt size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Summary
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Quotation totals.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-700">
                  {formatMoney(quotation.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Discount</span>

                <span className="font-medium text-slate-700">
                  -{formatMoney(quotation.discount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tax</span>

                <span className="font-medium text-slate-700">
                  {formatMoney(quotation.tax)}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#0B3954]">
                    {formatMoney(quotation.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DATES */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <CalendarDays size={20} className="text-[#0097A7]" />

                <h2 className="text-lg font-semibold text-slate-800">Dates</h2>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDateTime(quotation.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Valid Until
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(quotation.validUntil)}
                </p>
              </div>

              {quotation.sentAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Sent
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDateTime(quotation.sentAt)}
                  </p>
                </div>
              )}

              {quotation.approvedAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Approved
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDateTime(quotation.approvedAt)}
                  </p>
                </div>
              )}

              {quotation.convertedAt && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Converted
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDateTime(quotation.convertedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CREATED BY */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created By
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {quotation.createdBy?.fullName || "Unknown"}
            </p>
          </div>

          {/* ACTIONS */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2 className="text-sm font-semibold text-slate-800">Actions</h2>

            <div className="mt-4 space-y-2">
              {/* SEND */}

              {quotation.status === "DRAFT" && (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0097A7]
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#008794]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {sending ?
                    <Loader2 size={17} className="animate-spin" />
                  : <Send size={17} />}
                  Send Quotation
                </button>
              )}

              {/* EDIT */}

              {quotation.status === "DRAFT" && (
                <Link
                  href={`/admin/quotations/${quotation.id}/edit`}
                  className="
                    flex
                    h-11
                    w-full
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
                  "
                >
                  <Pencil size={17} />
                  Edit Quotation
                </Link>
              )}

              {/* DOWNLOAD */}

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="
                  flex
                  h-11
                  w-full
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
                  disabled:opacity-60
                "
              >
                {downloading ?
                  <Loader2 size={17} className="animate-spin" />
                : <Download size={17} />}
                Download PDF
              </button>

              {/* DELETE */}

              {quotation.status === "DRAFT" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-200
                    bg-white
                    px-4
                    text-sm
                    font-semibold
                    text-red-600
                    transition
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {deleting ?
                    <Loader2 size={17} className="animate-spin" />
                  : <Trash2 size={17} />}
                  Delete Quotation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          STATUS TIMELINE
      ================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <h2 className="text-lg font-semibold text-slate-800">
          Quotation Timeline
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-[#0097A7]">
              <FileText size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Created</p>

              <p className="mt-1 text-xs text-slate-400">
                {formatDateTime(quotation.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  quotation.sentAt ?
                    "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-400"
                }
              `}
            >
              <Send size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Sent</p>

              <p className="mt-1 text-xs text-slate-400">
                {formatDateTime(quotation.sentAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  quotation.approvedAt ?
                    "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
                }
              `}
            >
              {quotation.status === "REJECTED" ?
                <XCircle size={16} />
              : <CheckCircle2 size={16} />}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                {quotation.status === "REJECTED" ? "Rejected" : "Approved"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {formatDateTime(quotation.approvedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  quotation.convertedAt ?
                    "bg-cyan-50 text-cyan-600"
                  : "bg-slate-100 text-slate-400"
                }
              `}
            >
              <Receipt size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Converted</p>

              <p className="mt-1 text-xs text-slate-400">
                {formatDateTime(quotation.convertedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
