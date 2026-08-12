"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteServiceButtonProps {
  id: string;
}

export default function DeleteServiceButton({ id }: DeleteServiceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete service");
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
      onClick={handleDelete}
      disabled={loading}
      title="Delete Service"
      className="
        rounded-lg
        border
        p-2
        text-red-600
        transition
        hover:bg-red-50
        hover:border-red-300
        disabled:opacity-50
      "
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
