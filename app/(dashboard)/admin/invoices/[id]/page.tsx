import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MoreVertical,
  Package,
  Phone,
  Receipt,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import DownloadInvoiceButton from "../../components/invoices/DownloadInvoiceButton";

interface InvoiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-ZW", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "PARTIAL":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "SENT":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "OVERDUE":
      return "bg-red-50 text-red-700 border-red-200";

    case "CANCELLED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "DRAFT":
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="h-4 w-4" />;

    case "PARTIAL":
      return <Clock className="h-4 w-4" />;

    case "OVERDUE":
      return <XCircle className="h-4 w-4" />;

    case "SENT":
      return <Mail className="h-4 w-4" />;

    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getPaymentMethodLabel(method: string) {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "ECOCASH":
      return "EcoCash";

    case "INNBUCKS":
      return "InnBucks";

    case "CASH":
      return "Cash";

    case "CARD":
      return "Card";

    case "OTHER":
      return "Other";

    default:
      return method.replaceAll("_", " ");
  }
}

export default async function InvoiceDetailsPage({
  params,
}: InvoiceDetailsPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      client: true,

      company: true,

      createdBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },

      quotation: {
        select: {
          id: true,
          quotationNumber: true,
        },
      },

      items: {
        include: {
          product: true,
          service: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },

      payments: {
        include: {
          receivedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },

        orderBy: {
          paidAt: "desc",
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const subtotal = Number(invoice.subtotal);
  const discount = Number(invoice.discount);
  const tax = Number(invoice.tax);
  const total = Number(invoice.total);
  const balance = Number(invoice.balance);

  const amountPaid = invoice.payments.reduce((sum, payment) => {
    if (payment.status !== "REFUNDED") {
      return sum + Number(payment.amount);
    }

    return sum;
  }, 0);

  const paymentPercentage =
    total > 0 ? Math.min(100, Math.round((amountPaid / total) * 100)) : 0;

  const isOverdue =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    invoice.dueDate &&
    new Date(invoice.dueDate) < new Date();

  const displayStatus =
    isOverdue && invoice.status !== "OVERDUE" ? "OVERDUE" : invoice.status;

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 pb-10">
      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/invoices"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {invoice.invoiceNumber}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  displayStatus,
                )}`}
              >
                {getStatusIcon(displayStatus)}

                {displayStatus}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Created on {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-2">
          <DownloadInvoiceButton
            invoiceId={invoice.id}
            invoiceNumber={invoice.invoiceNumber}
          />

          <Link
            href={`/admin/invoices/${invoice.id}/send`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" />
            Send
          </Link>

          <Link
            href={`/admin/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* =========================================
          PAYMENT SUMMARY
      ========================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Invoice Total
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* PAID */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Amount Paid</p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(amountPaid)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* BALANCE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Balance Due</p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  balance > 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Payment Progress
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {paymentPercentage}%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${paymentPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================
          CLIENT + INVOICE DETAILS
      ========================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* CLIENT */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Client Information
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Client
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {invoice.client.name}
                </p>

                {invoice.client.companyName && (
                  <p className="text-sm text-slate-500">
                    {invoice.client.companyName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Contact
              </p>

              <div className="mt-2 space-y-1">
                {invoice.client.email && (
                  <p className="text-sm text-slate-700">
                    {invoice.client.email}
                  </p>
                )}

                {invoice.client.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-3.5 w-3.5" />
                    {invoice.client.phone}
                  </div>
                )}
              </div>
            </div>

            {(invoice.client.address || invoice.client.city) && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {invoice.client.address}

                  {invoice.client.address && invoice.client.city && ", "}

                  {invoice.client.city}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created By
              </p>

              <p className="mt-2 text-sm font-medium text-slate-800">
                {invoice.createdBy.fullName}
              </p>

              <p className="text-xs text-slate-500">
                {invoice.createdBy.email}
              </p>
            </div>
          </div>
        </div>

        {/* INVOICE DETAILS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Details
            </h2>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Invoice Number
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {invoice.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Issue Date
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(invoice.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Due Date
              </p>

              <p
                className={`mt-1 text-sm font-medium ${
                  isOverdue ? "text-red-600" : "text-slate-700"
                }`}
              >
                {formatDate(invoice.dueDate)}
              </p>
            </div>

            {invoice.quotation && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  From Quotation
                </p>

                <Link
                  href={`/admin/quotations/${invoice.quotation.id}`}
                  className="mt-1 inline-flex text-sm font-semibold text-blue-600 hover:underline"
                >
                  {invoice.quotation.quotationNumber}
                </Link>
              </div>
            )}

            {invoice.sentAt && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Sent At
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDateTime(invoice.sentAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          ITEMS
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {invoice.items.length}{" "}
              {invoice.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Qty
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Unit Price
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5 text-sm text-slate-400">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        {item.productId ?
                          <Package className="h-4 w-4 text-slate-500" />
                        : <FileText className="h-4 w-4 text-slate-500" />}
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {item.description}
                        </p>

                        {item.product?.sku && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            SKU: {item.product.sku}
                          </p>
                        )}

                        {item.service && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Service: {item.service.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center text-sm text-slate-700">
                    {Number(item.quantity).toFixed(2)}
                  </td>

                  <td className="px-6 py-5 text-right text-sm text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  <td className="px-6 py-5 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE ITEMS */}

        <div className="divide-y divide-slate-100 md:hidden">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    {item.productId ?
                      <Package className="h-4 w-4 text-slate-500" />
                    : <FileText className="h-4 w-4 text-slate-500" />}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Item {index + 1}</p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {item.description}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(item.total)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Quantity</p>

                  <p className="mt-1 text-slate-700">
                    {Number(item.quantity).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Unit Price</p>

                  <p className="mt-1 text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOTALS */}

        <div className="border-t border-slate-200 bg-slate-50">
          <div className="ml-auto max-w-md space-y-3 px-6 py-6">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Discount</span>

              <span>- {formatCurrency(discount)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax</span>

              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>

                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Paid</span>

              <span className="font-semibold text-emerald-600">
                {formatCurrency(amountPaid)}
              </span>
            </div>

            <div className="flex justify-between rounded-xl bg-white px-4 py-3">
              <span className="font-semibold text-slate-700">Balance Due</span>

              <span
                className={`font-bold ${
                  balance > 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          PAYMENTS
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {invoice.payments.length}{" "}
              {invoice.payments.length === 1 ? "payment" : "payments"} recorded
            </p>
          </div>

          {balance > 0 && invoice.status !== "CANCELLED" && (
            <Link
              href={`/admin/payments/create?invoiceId=${invoice.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Wallet className="h-4 w-4" />
              Record Payment
            </Link>
          )}
        </div>

        {invoice.payments.length === 0 ?
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Wallet className="h-5 w-5 text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No payments yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No payment has been recorded for this invoice.
            </p>
          </div>
        : <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reference
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {invoice.payments.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {payment.paymentNumber}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {getPaymentMethodLabel(payment.method)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {payment.reference || "—"}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          payment.status === "COMPLETED" ?
                            "bg-emerald-50 text-emerald-700"
                          : payment.status === "REFUNDED" ?
                            "bg-purple-50 text-purple-700"
                          : payment.status === "FAILED" ?
                            "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* =========================================
          NOTES / TERMS
      ========================================== */}

      {(invoice.notes || invoice.terms) && (
        <div className="grid gap-6 md:grid-cols-2">
          {invoice.notes && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Notes</h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {invoice.notes}
              </p>
            </div>
          )}

          {invoice.terms && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Terms & Conditions
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {invoice.terms}
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          FOOTER INFORMATION
      ========================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Invoice created {formatDateTime(invoice.createdAt)}</p>

        <p>Last updated {formatDateTime(invoice.updatedAt)}</p>
      </div>
    </div>
  );
}
