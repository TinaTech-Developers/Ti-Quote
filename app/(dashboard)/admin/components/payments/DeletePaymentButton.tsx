"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeletePaymentButtonProps {
  paymentId: string;
  paymentNumber?: string;
  onDeleted?: () => void;
}

export default function DeletePaymentButton({
  paymentId,
  paymentNumber,
  onDeleted,
}: DeletePaymentButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to delete payment.",
        );
      }

      setOpen(false);

      if (onDeleted) {
        onDeleted();
      } else {
        router.push("/payments");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Delete button */}
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={16} />
        Delete
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Delete Payment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                {paymentNumber ?
                  <span className="font-semibold text-slate-900">
                    {paymentNumber}
                  </span>
                : "this payment"}
                ?
              </p>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-medium leading-5 text-amber-800">
                  Deleting this payment may change the outstanding balance of
                  the associated invoice.
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ?
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                : <>
                    <Trash2 size={16} />
                    Delete Payment
                  </>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
