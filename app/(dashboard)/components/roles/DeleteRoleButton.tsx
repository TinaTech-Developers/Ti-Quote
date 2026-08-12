"use client";

import { ReactNode, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteRoleButtonProps {
  id: string;
  children?: ReactNode;
  onDeleted?: () => void;
}

export default function DeleteRoleButton({
  id,
  children,
  onDeleted,
}: DeleteRoleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role?\n\nThis action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete role.");
      }

      onDeleted?.();
    } catch (error: any) {
      alert(error.message || "Something went wrong.");
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
        justify-center
        rounded-lg
        p-2
        text-red-600
        transition
        hover:bg-red-50
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
      title="Delete Role"
    >
      {loading ?
        <Loader2 className="animate-spin" size={18} />
      : children ?
        children
      : <Trash2 size={18} />}
    </button>
  );
}
