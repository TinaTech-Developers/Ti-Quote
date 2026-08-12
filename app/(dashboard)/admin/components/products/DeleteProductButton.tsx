"use client";

import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";

interface Props {
  productId: string;
  productName: string;
  onDeleted?: () => void;
}

export default function DeleteProductButton({
  productId,
  productName,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to deactivate product.");
      }

      setOpen(false);

      onDeleted?.();
    } catch (error) {
      setError(
        error instanceof Error ?
          error.message
        : "Unable to deactivate product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        title="Deactivate product"
        className="
          inline-flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition
          hover:bg-red-50
          hover:text-red-600
        "
      >
        <Trash2 size={17} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Deactivate Product
              </h3>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>

              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to deactivate{" "}
                <span className="font-semibold text-slate-800">
                  {productName}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm text-slate-500">
                The product will no longer appear as an active product. Its
                records will remain in the system.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
