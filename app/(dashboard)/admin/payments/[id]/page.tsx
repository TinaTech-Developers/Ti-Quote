"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

import PaymentDetails from "../../components/payments/PaymentDetails";

export default function PaymentPage() {
  const params = useParams();

  const id = params.id as string;

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadPayment() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/payments/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to load payment.",
          );
        }

        const loadedPayment = data?.payment || data?.data || data;

        if (!loadedPayment?.id) {
          throw new Error("Payment could not be found.");
        }

        setPayment(loadedPayment);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load payment.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 size={30} className="animate-spin text-slate-500" />

          <p className="mt-3 text-sm text-slate-500">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-5">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Payments
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <CreditCard size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-red-800">
                Unable to load payment
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "Payment not found."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PaymentDetails payment={payment} />;
}
