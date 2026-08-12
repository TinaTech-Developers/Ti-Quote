"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteInvoiceButtonProps {
  id: string;
}

export default function DeleteInvoiceButton({ id }: DeleteInvoiceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete invoice");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        px-3
        py-2
        text-sm
        text-red-600
        hover:bg-red-50
        disabled:opacity-50
      "
    >
      <Trash2 size={16} />

      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
