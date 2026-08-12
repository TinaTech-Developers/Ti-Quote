"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber?: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  client?: {
    name: string;
  };
}

interface Props {
  invoices: Invoice[];
}

function statusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";

    case "SENT":
      return "bg-blue-100 text-blue-700";

    case "OVERDUE":
      return "bg-red-100 text-red-700";

    case "PARTIAL":
      return "bg-yellow-100 text-yellow-700";

    case "DRAFT":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function RecentInvoices({ invoices }: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Recent Invoices</h2>

          <p className="text-sm text-slate-500">Latest invoices created</p>
        </div>

        <Link
          href="/admin/invoices"
          className="
            text-sm
            font-medium
            text-[#0097A7]
            hover:underline
          "
        >
          View All
        </Link>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead
            className="
              border-y
              border-slate-100
              bg-slate-50
            "
          >
            <tr className="text-left text-slate-500">
              <th className="px-6 py-3">Invoice</th>

              <th className="px-6 py-3">Client</th>

              <th className="px-6 py-3">Amount</th>

              <th className="px-6 py-3">Date</th>

              <th className="px-6 py-3">Status</th>

              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  transition
                "
              >
                <td
                  className="
                    px-6
                    py-4
                    font-semibold
                    text-slate-800
                  "
                >
                  {invoice.invoiceNumber || invoice.id}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-slate-600
                  "
                >
                  {invoice.client?.name || "Unknown Client"}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    font-medium
                    text-slate-800
                  "
                >
                  ${Number(invoice.totalAmount).toLocaleString()}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-slate-500
                  "
                >
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${statusStyle(invoice.status)}
                    `}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/admin/invoices/${invoice.id}`}
                    className="
                      inline-flex
                      rounded-lg
                      p-2
                      text-slate-500
                      hover:bg-slate-100
                    "
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="
                    px-6
                    py-10
                    text-center
                    text-slate-400
                  "
                >
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
