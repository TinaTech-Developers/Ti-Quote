"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Mail,
  Pencil,
  Receipt,
  Smartphone,
  User,
  Wallet,
} from "lucide-react";
import DeletePaymentButton from "./DeletePaymentButton";

interface PaymentDetailsProps {
  payment: any;
}

export default function PaymentDetails({ payment }: PaymentDetailsProps) {
  const formatCurrency = (value: number | string | null | undefined) => {
    return new Intl.NumberFormat("en-ZW", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
  };

  const formatDate = (
    value: string | null | undefined,
    includeTime = false,
  ) => {
    if (!value) return "-";

    const date = new Date(value);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      ...(includeTime ?
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
    }).format(date);
  };

  const getClientName = () => {
    const client = payment?.client || payment?.invoice?.client;

    if (!client) return "Unknown Client";

    return (
      client.companyName ||
      client.name ||
      client.fullName ||
      client.email ||
      "Unknown Client"
    );
  };

  const getClientEmail = () => {
    const client = payment?.client || payment?.invoice?.client;

    return client?.email || null;
  };

  const getClientPhone = () => {
    const client = payment?.client || payment?.invoice?.client;

    return client?.phone || client?.phoneNumber || null;
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "Other";

    const labels: Record<string, string> = {
      CASH: "Cash",
      BANK: "Bank Transfer",
      BANK_TRANSFER: "Bank Transfer",
      ECOCASH: "EcoCash",
      ZIPIT: "ZIPIT",
      CARD: "Card",
      MOBILE_MONEY: "Mobile Money",
      OTHER: "Other",
    };

    return (
      labels[method.toUpperCase()] ||
      method
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char: string) => char.toUpperCase())
    );
  };

  const getPaymentIcon = (method?: string) => {
    const normalized = method?.toUpperCase();

    if (normalized === "BANK" || normalized === "BANK_TRANSFER") {
      return Banknote;
    }

    if (
      normalized === "ECOCASH" ||
      normalized === "ZIPIT" ||
      normalized === "MOBILE_MONEY"
    ) {
      return Smartphone;
    }

    if (normalized === "CARD") {
      return CreditCard;
    }

    return Wallet;
  };

  const PaymentIcon = getPaymentIcon(payment?.paymentMethod);

  const status = (payment?.status || "COMPLETED").toUpperCase();

  const isCompleted = status === "COMPLETED" || status === "PAID";

  const invoice = payment?.invoice;

  const invoiceTotal = Number(invoice?.total ?? 0);

  const paymentAmount = Number(payment?.amount ?? 0);

  const invoiceBalance =
    invoice?.balanceDue !== undefined && invoice?.balanceDue !== null ?
      Number(invoice.balanceDue)
    : Math.max(invoiceTotal - paymentAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Payments
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {invoice?.id && (
            <Link
              href={`/admin/invoices/${invoice.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <FileText size={16} />
              View Invoice
            </Link>
          )}

          {payment?.id && (
            <Link
              href={`/admin/payments/${payment.id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Pencil size={16} />
              Edit
            </Link>
          )}

          {payment?.id && (
            <DeletePaymentButton
              paymentId={payment.id}
              paymentNumber={payment.paymentNumber}
            />
          )}

          {payment?.id && (
            <a
              href={`/api/payments/${payment.id}/receipt`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Download size={16} />
              Receipt
            </a>
          )}
        </div>
      </div>

      {/* Main payment card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Receipt size={23} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-300">
                    Payment Receipt
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {payment?.paymentNumber || "Payment"}
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">
                Payment recorded against invoice{" "}
                <span className="font-semibold text-white">
                  {invoice?.invoiceNumber || "-"}
                </span>
                .
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Payment Amount
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight">
                {formatCurrency(paymentAmount)}
              </p>

              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isCompleted ? "bg-emerald-400/15 text-emerald-300"
                  : status === "PENDING" ? "bg-amber-400/15 text-amber-300"
                  : "bg-red-400/15 text-red-300"
                }`}
              >
                <CheckCircle2 size={14} />

                {status
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char: string) => char.toUpperCase())}
              </span>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Payment information */}
          <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <CreditCard size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Payment Information
                </h2>

                <p className="text-xs text-slate-400">
                  Details of this transaction
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow
                label="Payment Number"
                value={payment?.paymentNumber || "-"}
              />

              <InfoRow
                label="Payment Date"
                value={formatDate(payment?.createdAt)}
                icon={<CalendarDays size={15} />}
              />

              <InfoRow
                label="Payment Method"
                value={getPaymentMethodLabel(payment?.paymentMethod)}
                icon={<PaymentIcon size={15} />}
              />

              <InfoRow label="Reference" value={payment?.reference || "-"} />

              <InfoRow
                label="Recorded"
                value={formatDate(payment?.createdAt, true)}
              />

              {payment?.createdBy && (
                <InfoRow
                  label="Recorded By"
                  value={
                    payment.createdBy.fullName ||
                    payment.createdBy.name ||
                    payment.createdBy.email ||
                    "-"
                  }
                />
              )}
            </div>
          </div>

          {/* Client */}
          <div className="p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <User size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Customer
                </h2>

                <p className="text-xs text-slate-400">
                  Customer associated with this payment
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">
                {getClientName()}
              </h3>

              {getClientEmail() && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={15} />
                  {getClientEmail()}
                </div>
              )}

              {getClientPhone() && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Smartphone size={15} />
                  {getClientPhone()}
                </div>
              )}
            </div>

            {invoice && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Invoice
                    </p>

                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="mt-1 inline-block text-sm font-semibold text-slate-800 hover:text-blue-600"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </div>

                  <FileText size={19} className="text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard
          label="Invoice Total"
          value={formatCurrency(invoiceTotal)}
          icon={<FileText size={19} />}
        />

        <SummaryCard
          label="Payment Received"
          value={formatCurrency(paymentAmount)}
          icon={<CreditCard size={19} />}
        />

        <SummaryCard
          label="Remaining Balance"
          value={formatCurrency(invoiceBalance)}
          icon={<Wallet size={19} />}
          highlight={invoiceBalance <= 0}
        />
      </div>

      {/* Notes */}
      {payment?.notes && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText size={17} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Payment Notes
              </h2>

              <p className="text-xs text-slate-400">Additional information</p>
            </div>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {payment.notes}
          </p>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Payment {payment?.paymentNumber}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Recorded on {formatDate(payment?.paymentDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/payments"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Payments
          </Link>

          {payment?.id && (
            <a
              href={`/api/payments/${payment.id}/receipt`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Download size={16} />
              Download Receipt
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Helper components
--------------------------------------------------------- */

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="flex items-center gap-1.5 text-right text-sm font-medium text-slate-800">
        {icon && <span className="text-slate-400">{icon}</span>}

        {value}
      </span>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        highlight ? "border-emerald-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>

        {highlight && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={14} />
            Paid
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${
          highlight ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
