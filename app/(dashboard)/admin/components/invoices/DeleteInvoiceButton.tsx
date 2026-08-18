"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteInvoiceButtonProps {
  invoiceId: string;
}

export default function DeleteInvoiceButton({
  invoiceId,
}: DeleteInvoiceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete invoice");
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete invoice",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={16} />

      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
