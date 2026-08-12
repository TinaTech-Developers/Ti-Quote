"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus } from "lucide-react";

interface ConvertInvoiceButtonProps {
  quotationId: string;
}

export default function ConvertInvoiceButton({
  quotationId,
}: ConvertInvoiceButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function convertInvoice() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/quotations/${quotationId}/convert`,

        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed converting invoice");
      }

      router.push(`/super-admin/invoices/${data.id}`);

      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={convertInvoice}
      disabled={loading}
      className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
        hover:bg-blue-700
        disabled:opacity-50
      "
    >
      <FilePlus size={18} />

      {loading ? "Converting..." : "Convert To Invoice"}
    </button>
  );
}
