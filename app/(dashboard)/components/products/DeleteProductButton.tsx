"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  id: string;
  onDeleted?: () => void;
}

export default function DeleteProductButton({
  id,
  onDeleted,
}: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      onDeleted?.();
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
      title="Delete Product"
      className="
        rounded-lg
        border
        border-red-200
        p-2
        text-red-600
        transition
        hover:bg-red-50
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <Trash2 size={18} />
    </button>
  );
}
