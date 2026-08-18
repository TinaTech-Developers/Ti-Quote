interface InvoiceStatusBadgeProps {
  status: string;
}

export default function InvoiceStatusBadge({
  status,
}: InvoiceStatusBadgeProps) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",

    SENT: "bg-blue-100 text-blue-700 border-blue-200",

    PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",

    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",

    OVERDUE: "bg-red-100 text-red-700 border-red-200",

    CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
