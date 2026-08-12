"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  invoiceId: string;
}

export default function SendInvoiceButton({ invoiceId }: Props) {
  const [loading, setLoading] = useState(false);

  async function sendInvoice() {
    try {
      setLoading(true);

      const res = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send invoice");
      }

      alert("Invoice sent successfully");
    } catch (error: any) {
      console.log(error);

      alert(error.message || "Unable to send invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={sendInvoice}
      disabled={loading}
      className="
        flex
        items-center
        gap-2
        px-3
        py-2
        rounded-lg
        bg-green-600
        text-white
        text-sm
        hover:bg-green-700
        disabled:opacity-50
      "
    >
      <Send size={16} />

      {loading ? "Sending..." : "Send"}
    </button>
  );
}
