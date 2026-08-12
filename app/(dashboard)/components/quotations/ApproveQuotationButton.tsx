"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface ApproveQuotationButtonProps {
  quotationId: string;
}

export default function ApproveQuotationButton({
  quotationId,
}: ApproveQuotationButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function approveQuotation() {
    try {
      setLoading(true);

      const response = await fetch(`/api/quotations/${quotationId}/approve`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve quotation");
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
      onClick={approveQuotation}
      disabled={loading}
      className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-green-600
        px-4
        py-2
        text-white
        hover:bg-green-700
        disabled:opacity-50
      "
    >
      <CheckCircle size={18} />

      {loading ? "Approving..." : "Approve Quotation"}
    </button>
  );
}
