"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteClientButtonProps {
  id: string;
  onDeleted?: () => void;
}

export default function DeleteClientButton({
  id,
  onDeleted,
}: DeleteClientButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete client");
      }

      onDeleted?.();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Delete Client"
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
