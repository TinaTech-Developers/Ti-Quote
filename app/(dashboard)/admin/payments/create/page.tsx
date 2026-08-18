"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

import PaymentForm from "../../components/payments/PaymentForm";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number | string;
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

export default function CreatePaymentPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoadingInvoices(true);
        setError("");

        const response = await fetch("/api/invoices", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to load invoices.",
          );
        }

        /*
         * Support both:
         *
         * { invoices: [...] }
         *
         * and:
         *
         * [...]
         *
         * This makes the page tolerant of the API response
         * structure currently being used.
         */
        const invoiceList =
          Array.isArray(data) ? data
          : Array.isArray(data?.invoices) ? data.invoices
          : [];

        /*
         * Only show invoices that can reasonably receive
         * another payment.
         *
         * We also keep invoices where balanceDue is missing,
         * because some existing invoice responses may only
         * contain total.
         */
        const availableInvoices = invoiceList.filter((invoice: Invoice) => {
          const status = invoice.status?.toUpperCase();

          const balance =
            invoice.balanceDue !== undefined ?
              Number(invoice.balanceDue)
            : Number(invoice.total || 0);

          if (status === "CANCELLED") {
            return false;
          }

          if (status === "VOID") {
            return false;
          }

          if (invoice.balanceDue !== undefined && balance <= 0) {
            return false;
          }

          return true;
        });

        setInvoices(availableInvoices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load invoices.",
        );
      } finally {
        setLoadingInvoices(false);
      }
    }

    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/payments"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Payments
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <CreditCard size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Record Payment
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Record a customer payment against an outstanding invoice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice loading error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Unable to load invoices</p>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loadingInvoices ?
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center">
            <Loader2 size={28} className="animate-spin text-slate-500" />

            <p className="mt-3 text-sm text-slate-500">
              Loading outstanding invoices...
            </p>
          </div>
        </div>
      : invoices.length === 0 ?
        /* No invoices */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <CreditCard size={24} className="text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No outstanding invoices
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            There are currently no invoices available for recording a payment.
          </p>

          <Link
            href="/payments"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Payments
          </Link>
        </div>
      : <PaymentForm invoices={invoices} loadingInvoices={loadingInvoices} />}
    </div>
  );
}
