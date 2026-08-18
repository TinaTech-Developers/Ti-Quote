"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

import PaymentForm from "../../../components/payments/PaymentForm";

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

interface EditPaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPaymentPage({ params }: EditPaymentPageProps) {
  const [paymentId, setPaymentId] = useState<string>("");

  const [payment, setPayment] = useState<Payment | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPage() {
      try {
        const { id } = await params;

        setPaymentId(id);

        /*
         * Load payment and invoices together.
         */
        const [paymentResponse, invoicesResponse] = await Promise.all([
          fetch(`/api/payments/${id}`, {
            cache: "no-store",
          }),

          fetch("/api/invoices", {
            cache: "no-store",
          }),
        ]);

        const paymentData = await paymentResponse.json();

        const invoicesData = await invoicesResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(
            paymentData?.error ||
              paymentData?.message ||
              "Failed to load payment.",
          );
        }

        if (!invoicesResponse.ok) {
          throw new Error(
            invoicesData?.error ||
              invoicesData?.message ||
              "Failed to load invoices.",
          );
        }

        const loadedPayment =
          paymentData?.payment || paymentData?.data || paymentData;

        const invoiceList =
          Array.isArray(invoicesData) ? invoicesData
          : Array.isArray(invoicesData?.invoices) ? invoicesData.invoices
          : [];

        if (!loadedPayment?.id) {
          throw new Error("Payment could not be found.");
        }

        /*
         * Make sure the payment's invoice is included
         * even if the invoice API normally filters out
         * fully-paid invoices.
         */
        const paymentInvoice = loadedPayment.invoice;

        const invoiceExists = invoiceList.some(
          (invoice: Invoice) => invoice.id === paymentInvoice?.id,
        );

        const availableInvoices =
          paymentInvoice && !invoiceExists ?
            [paymentInvoice, ...invoiceList]
          : invoiceList;

        setPayment(loadedPayment);
        setInvoices(availableInvoices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load payment.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={28} className="animate-spin text-slate-500" />

          <p className="mt-3 text-sm text-slate-500">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-5">
        <Link
          href="/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Payments
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-base font-semibold text-red-800">
            Unable to load payment
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {error || "Payment not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/payments/${paymentId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Payment
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <CreditCard size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Payment
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update payment {payment.paymentNumber}.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <PaymentForm
        payment={payment}
        invoices={invoices}
        loadingInvoices={false}
      />
    </div>
  );
}
