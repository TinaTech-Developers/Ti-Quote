"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DownloadInvoiceButton from "./DownloadInvoiceButton";
import SendInvoiceButton from "./SendInvoiceButton";

interface Props {
  invoiceId: string;

  invoiceNumber: string;

  onDelete?: () => void;
}

export default function InvoiceActions({
  invoiceId,
  invoiceNumber,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* VIEW */}

      <Link
        href={`/super-admin/invoices/${invoiceId}`}
        className="
        px-2
        rounded-lg
        hover:bg-gray-100
        text-gray-700
        "
        title="View Invoice"
      >
        <Eye size={17} />
      </Link>

      {/* EDIT */}

      <Link
        href={`/super-admin/invoices/${invoiceId}/edit`}
        className="
        px-2
        rounded-lg
        hover:bg-gray-100
        text-blue-600
        "
        title="Edit Invoice"
      >
        <Pencil size={17} />
      </Link>

      {/* PDF */}

      <DownloadInvoiceButton
        invoiceId={invoiceId}
        invoiceNumber={invoiceNumber}
      />

      {/* SEND */}

      {/* <SendInvoiceButton invoiceId={invoiceId} /> */}

      {/* DELETE */}

      {onDelete && (
        <button
          onClick={onDelete}
          className="
          px-2
          rounded-lg
          hover:bg-red-100
          text-red-600
          "
          title="Delete Invoice"
        >
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}
