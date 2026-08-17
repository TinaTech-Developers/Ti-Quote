"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteServiceButtonProps {
  serviceId: string;
  serviceName: string;
}

export default function DeleteServiceButton({
  serviceId,
  serviceName,
}: DeleteServiceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${serviceName}"?`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to delete service",
      );
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
      {loading ?
        <Loader2 size={16} className="animate-spin" />
      : <Trash2 size={16} />}
    </button>
  );
}
