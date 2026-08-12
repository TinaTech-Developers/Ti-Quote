"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

interface Props {
  invoiceId: string;
  invoiceNumber?: string;
}

export default function DownloadInvoiceButton({
  invoiceId,
  invoiceNumber,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function downloadPDF() {
    try {
      setLoading(true);

      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate invoice PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${invoiceNumber || "invoice"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);

      alert("Unable to download invoice PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPDF}
      disabled={loading}
      className="
        flex
        items-center
        gap-2
        px-3
        py-2
        rounded-lg
        bg-blue-600
        text-white
        text-sm
        hover:bg-blue-700
        disabled:opacity-50
      "
    >
      <FileDown size={16} />

      {loading ? "Generating..." : "PDF"}
    </button>
  );
}
