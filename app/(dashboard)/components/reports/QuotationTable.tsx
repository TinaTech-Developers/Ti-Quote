"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Receipt } from "lucide-react";

interface Quotation {
  id: string;
  quotationNumber: string;
  client: string;
  email: string;
  amount: number;
  status: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  createdBy: string;
  createdAt: string;
}

interface Props {
  quotations: Quotation[];

  page: number;

  totalPages: number;

  onPageChange: (page: number) => void;
}

export default function QuotationTable({
  quotations,
  page,
  totalPages,
  onPageChange,
}: Props) {
  function statusStyle(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CONVERTED":
        return "bg-purple-100 text-purple-700";

      case "DRAFT":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div
      className="
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-sm
    "
    >
      {/* Header */}

      <div
        className="
        border-b
        border-slate-200
        px-6
        py-5
      "
      >
        <h2
          className="
          text-lg
          font-semibold
          text-slate-800
        "
        >
          Quotations
        </h2>

        <p
          className="
          mt-1
          text-sm
          text-slate-500
        "
        >
          Manage quotation history and conversions.
        </p>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr
              className="
              text-left
              text-sm
              font-semibold
              text-slate-700
            "
            >
              <th className="px-5 py-4">Quotation #</th>

              <th className="px-5 py-4">Client</th>

              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4 text-right">Amount</th>

              <th className="px-5 py-4">Status</th>

              <th className="px-5 py-4">Created By</th>

              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quotations.map((quotation) => (
              <tr
                key={quotation.id}
                className="
                border-t
                hover:bg-slate-50
              "
              >
                <td
                  className="
                px-5
                py-4
                font-medium
                text-slate-700
              "
                >
                  {quotation.quotationNumber}
                </td>

                <td
                  className="
                px-5
                py-4
              "
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {quotation.client}
                    </p>

                    <p className="text-xs text-slate-500">{quotation.email}</p>
                  </div>
                </td>

                <td
                  className="
                px-5
                py-4
                text-slate-500
              "
                >
                  {new Date(quotation.createdAt).toLocaleDateString()}
                </td>

                <td
                  className="
                px-5
                py-4
                text-right
                font-semibold
                text-slate-700
              "
                >
                  ${quotation.amount.toFixed(2)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    ${statusStyle(quotation.status)}
                  `}
                  >
                    {quotation.status}
                  </span>
                </td>

                <td
                  className="
                px-5
                py-4
                text-slate-600
              "
                >
                  {quotation.createdBy}
                </td>

                <td className="px-5 py-4">
                  <div
                    className="
                  flex
                  justify-center
                  gap-2
                "
                  >
                    {/* View quotation */}

                    <Link
                      href={`/super-admin/quotations/${quotation.id}`}
                      className="
                      rounded-lg
                      bg-slate-100
                      p-2
                      hover:bg-slate-200
                    "
                      title="View quotation"
                    >
                      <Eye size={16} color="#64748B" />
                    </Link>

                    {/* Converted invoice */}

                    {quotation.invoiceId && (
                      <Link
                        href={`/super-admin/invoices/${quotation.invoiceId}`}
                        className="
                        rounded-lg
                        bg-green-100
                        p-2
                        text-green-700
                        hover:bg-green-200
                      "
                        title="View invoice"
                      >
                        <Receipt size={16} />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {quotations.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
                  py-12
                  text-center
                  text-slate-500
                "
                >
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div
        className="
        flex
        items-center
        justify-between
        border-t
        border-slate-200
        px-6
        py-4
      "
      >
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            px-4
            py-2
            disabled:opacity-40
          "
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span
          className="
          text-sm
          text-slate-600
        "
        >
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            px-4
            py-2
            disabled:opacity-40
          "
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
