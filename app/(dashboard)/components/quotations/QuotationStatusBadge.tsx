"use client";



interface QuotationStatusBadgeProps {
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED"
    | "CONVERTED"
    | string;
}

export default function QuotationStatusBadge({
  status,
}: QuotationStatusBadgeProps) {
  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 ",

    PENDING: "bg-yellow-100 text-yellow-700",

    APPROVED: "bg-green-100 text-green-700",

    REJECTED: "bg-red-100 text-red-700",

    EXPIRED: "bg-orange-100 text-orange-700",

    CONVERTED: "bg-blue-100 text-blue-700",
  };

  const labels: Record<string, string> = {
    DRAFT: "Draft",

    PENDING: "Pending",

    APPROVED: "Approved",

    REJECTED: "Rejected",

    EXPIRED: "Expired",

    CONVERTED: "Converted",
  };

  return (
    <span
      className={`
        
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
      
        ${styles[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {labels[status] || status}
    </span>
  );
}
