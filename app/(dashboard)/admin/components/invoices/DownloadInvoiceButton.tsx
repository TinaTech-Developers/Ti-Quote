"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadInvoiceButtonProps {
  invoiceId: string;
  invoiceNumber?: string;
}

export default function DownloadInvoiceButton({
  invoiceId,
  invoiceNumber,
}: DownloadInvoiceButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        let message = "Failed to download invoice PDF.";

        try {
          const data = await response.json();

          message = data?.message || data?.error || message;
        } catch {
          // Response was not JSON
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = invoiceNumber ? `${invoiceNumber}.pdf` : "invoice.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice PDF download error:", error);

      alert(
        error instanceof Error ?
          error.message
        : "Failed to download invoice PDF.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      title="Download PDF"
      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-2.5
        text-sm
        font-semibold
        text-slate-700
        transition
        hover:bg-slate-50
        hover:text-blue-600
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ?
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      : <>
          <Download className="h-4 w-4" />
          PDF
        </>
      }
    </button>
  );
}
