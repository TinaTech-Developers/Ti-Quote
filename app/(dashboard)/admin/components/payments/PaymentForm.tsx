"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Smartphone,
  Wallet,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number | string;
  balance?: number | string;
  balanceDue?: number | string;
  status?: string;

  client?: {
    id: string;
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
  } | null;
}

interface Payment {
  id: string;
  paymentNumber: string;
  amount: number | string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  reference?: string | null;
  notes?: string | null;

  invoice?: Invoice | null;
}

interface PaymentFormProps {
  payment?: Payment;
  invoices?: Invoice[];
  loadingInvoices?: boolean;
}

const PAYMENT_METHODS = [
  {
    value: "CASH",
    label: "Cash",
    description: "Cash payment",
    icon: Wallet,
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    description: "Bank or electronic transfer",
    icon: Banknote,
  },
  {
    value: "ECOCASH",
    label: "EcoCash",
    description: "EcoCash mobile payment",
    icon: Smartphone,
  },

  {
    value: "CARD",
    label: "Card",
    description: "Debit or credit card",
    icon: CreditCard,
  },

  {
    value: "OTHER",
    label: "Other",
    description: "Other payment method",
    icon: Wallet,
  },
];

export default function PaymentForm({
  payment,
  invoices = [],
  loadingInvoices = false,
}: PaymentFormProps) {
  const router = useRouter();

  const isEditing = Boolean(payment);

  const [invoiceId, setInvoiceId] = useState(payment?.invoice?.id || "");

  const [amount, setAmount] = useState(payment ? String(payment.amount) : "");

  const [paymentDate, setPaymentDate] = useState(
    payment?.paymentDate ?
      new Date(payment.paymentDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  );

  const [paymentMethod, setPaymentMethod] = useState(
    payment?.paymentMethod || "CASH",
  );

  const [reference, setReference] = useState(payment?.reference || "");

  const [notes, setNotes] = useState(payment?.notes || "");

  const [status, setStatus] = useState(payment?.status || "COMPLETED");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const selectedInvoice = useMemo(() => {
    return invoices.find((invoice) => invoice.id === invoiceId);
  }, [invoices, invoiceId]);

  const invoiceTotal = Number(
    selectedInvoice?.total ?? payment?.invoice?.total ?? 0,
  );

  const invoiceBalance = Number(
    selectedInvoice?.balance ??
      selectedInvoice?.balanceDue ??
      payment?.invoice?.balance ??
      payment?.invoice?.balanceDue ??
      invoiceTotal,
  );

  const enteredAmount = Number(amount || 0);

  /*
   * When editing a payment, the existing payment is already
   * included in the invoice's balance calculations.
   *
   * Therefore we add the current payment back to the available
   * balance so that the user can keep the same amount.
   */
  const currentPaymentAmount = isEditing ? Number(payment?.amount || 0) : 0;

  const availableBalance =
    isEditing ? invoiceBalance + currentPaymentAmount : invoiceBalance;

  const remainingAfterPayment = Math.max(availableBalance - enteredAmount, 0);

  const isOverpayment = enteredAmount > availableBalance;

  const isFullPayment =
    enteredAmount > 0 && Math.abs(enteredAmount - availableBalance) < 0.01;

  useEffect(() => {
    if (!invoiceId && payment?.invoice?.id) {
      setInvoiceId(payment.invoice.id);
    }
  }, [invoiceId, payment]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZW", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getClientName = (invoice?: Invoice) => {
    if (!invoice?.client) return "-";

    return (
      invoice.client.companyName ||
      invoice.client.name ||
      invoice.client.email ||
      "-"
    );
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!invoiceId) {
      setError("Please select an invoice.");
      return;
    }

    if (!amount || enteredAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (isOverpayment) {
      setError(
        `Payment cannot exceed the available invoice balance of ${formatCurrency(
          availableBalance,
        )}.`,
      );
      return;
    }

    if (!paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        invoiceId,
        amount: enteredAmount,
        method: paymentMethod,
        paidAt: paymentDate,
        reference: reference.trim() || null,
        notes: notes.trim() || null,
        status,
      };

      const endpoint =
        isEditing ? `/api/payments/${payment?.id}` : "/api/payments";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to save payment.",
        );
      }

      setSuccess(
        isEditing ?
          "Payment updated successfully."
        : "Payment recorded successfully.",
      );

      setTimeout(() => {
        if (data?.payment?.id) {
          router.push(`/payments/${data.payment.id}`);
        } else if (data?.id) {
          router.push(`/admin/payments/${data.id}`);
        } else {
          router.push("/payments");
        }

        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error ?
          err.message
        : "Something went wrong while saving the payment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleInvoiceChange(value: string) {
    setInvoiceId(value);

    /*
     * Clear amount when changing invoices.
     * This prevents accidentally carrying a payment amount
     * from another invoice.
     */
    if (!isEditing) {
      setAmount("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to save payment</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">{success}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main form */}
        <div className="space-y-6">
          {/* Invoice */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Invoice
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select the invoice this payment belongs to.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Invoice
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                value={invoiceId}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                disabled={loadingInvoices || isEditing}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                required
              >
                <option value="">
                  {loadingInvoices ?
                    "Loading invoices..."
                  : "Select an invoice"}
                </option>

                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber} — {getClientName(invoice)} —{" "}
                    {formatCurrency(
                      Number(
                        invoice.balance ??
                          invoice.balanceDue ??
                          invoice.total ??
                          0,
                      ),
                    )}{" "}
                    due
                  </option>
                ))}
              </select>

              {isEditing && (
                <p className="mt-2 text-xs text-slate-400">
                  The invoice cannot be changed when editing an existing
                  payment.
                </p>
              )}

              {selectedInvoice && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Invoice
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {selectedInvoice.invoiceNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Client
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {getClientName(selectedInvoice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Invoice Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatCurrency(invoiceTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment details */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Payment Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the payment information below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Amount + Date */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Amount
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      $
                    </span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`h-11 w-full rounded-xl border bg-white pl-8 pr-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        isOverpayment ?
                          "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                      }`}
                      required
                    />
                  </div>

                  {isOverpayment && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      Amount exceeds the available balance.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Date
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Payment Method
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const selected = paymentMethod === method.value;

                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selected ?
                            "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected ?
                              "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {method.label}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {method.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reference */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Reference
                </label>

                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Bank transaction ID, receipt number..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Optional reference supplied by the customer or payment
                  provider.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="COMPLETED">Completed</option>

                  <option value="PENDING">Pending</option>

                  <option value="FAILED">Failed</option>

                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes about this payment..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Payment Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the payment before saving.
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Invoice total</span>

                <span className="text-sm font-semibold text-slate-800">
                  {formatCurrency(invoiceTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Available balance
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {formatCurrency(availableBalance)}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Payment amount</span>

                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(enteredAmount)}
                  </span>
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  isOverpayment ? "border-red-200 bg-red-50"
                  : isFullPayment ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Remaining balance
                    </p>

                    <p
                      className={`mt-1 text-xl font-bold ${
                        isOverpayment ? "text-red-700"
                        : isFullPayment ? "text-emerald-700"
                        : "text-slate-900"
                      }`}
                    >
                      {formatCurrency(remainingAfterPayment)}
                    </p>
                  </div>

                  {isFullPayment && (
                    <CheckCircle2 size={21} className="text-emerald-600" />
                  )}

                  {isOverpayment && (
                    <AlertCircle size={21} className="text-red-600" />
                  )}
                </div>

                {isFullPayment && (
                  <p className="mt-2 text-xs text-emerald-700">
                    This payment will fully settle the invoice.
                  </p>
                )}

                {isOverpayment && (
                  <p className="mt-2 text-xs text-red-700">
                    The payment amount is greater than the available invoice
                    balance.
                  </p>
                )}
              </div>

              {selectedInvoice?.client && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Customer
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {getClientName(selectedInvoice)}
                  </p>

                  {selectedInvoice.client.email && (
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedInvoice.client.email}
                    </p>
                  )}

                  {selectedInvoice.client.phone && (
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedInvoice.client.phone}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingInvoices ||
                  !invoiceId ||
                  !amount ||
                  isOverpayment
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ?
                  <>
                    <Loader2 size={17} className="animate-spin" />

                    {isEditing ? "Updating Payment..." : "Recording Payment..."}
                  </>
                : <>
                    <CheckCircle2 size={17} />

                    {isEditing ? "Update Payment" : "Record Payment"}
                  </>
                }
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => router.back()}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
