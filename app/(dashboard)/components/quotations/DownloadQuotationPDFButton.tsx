"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadQuotationPDFButtonProps {
  quotationId: string;
}

export default function DownloadQuotationPDFButton({
  quotationId,
}: DownloadQuotationPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);

      const response = await fetch(`/api/quotations/${quotationId}/pdf`);

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message || "Failed to generate PDF.");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Quotation-${quotationId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        bg-red-600
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition
        hover:bg-red-700
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading ?
        <>
          <Loader2 size={18} className="animate-spin" />
          Generating...
        </>
      : <>
          <Download size={18} />
          Download PDF
        </>
      }
    </button>
  );
}
