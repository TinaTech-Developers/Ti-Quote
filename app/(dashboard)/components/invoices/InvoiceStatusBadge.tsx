"use client";

interface Props {
  status: string;
}

export default function InvoiceStatusBadge({ status }: Props) {
  const statusConfig: any = {
    DRAFT: {
      label: "Draft",
      style: "bg-gray-100 text-gray-700",
    },

    SENT: {
      label: "Sent",
      style: "bg-blue-100 text-blue-700",
    },

    PARTIALLY_PAID: {
      label: "Partially Paid",
      style: "bg-yellow-100 text-yellow-700",
    },

    PAID: {
      label: "Paid",
      style: "bg-green-100 text-green-700",
    },

    OVERDUE: {
      label: "Overdue",
      style: "bg-red-100 text-red-700",
    },

    CANCELLED: {
      label: "Cancelled",
      style: "bg-red-100 text-red-800",
    },
  };

  const current = statusConfig[status] || {
    label: status,
    style: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        ${current.style}
      `}
    >
      {current.label}
    </span>
  );
}
