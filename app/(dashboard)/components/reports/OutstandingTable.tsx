"use client";

import Link from "next/link";
import { Receipt, ChevronLeft, ChevronRight } from "lucide-react";

interface Invoice {
  id: string;

  invoiceNumber: string;

  client: string;

  email: string;

  date: string;

  total: number;

  paid: number;

  balance: number;

  status: string;

  daysOverdue: number;
}

interface Props {
  invoices: Invoice[];

  page: number;

  totalPages: number;

  onPageChange: (page: number) => void;
}

export default function OutstandingTable({
  invoices,

  page,

  totalPages,

  onPageChange,
}: Props) {
  function statusStyle(status: string) {
    if (status === "PARTIAL") return "bg-yellow-100 text-yellow-700";

    if (status === "SENT") return "bg-red-100 text-red-700";

    return "bg-green-100 text-green-700";
  }

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
      <div
        className="
 overflow-x-auto
"
      >
        <table
          className="
 min-w-full
"
        >
          <thead
            className="
 bg-slate-100
"
          >
            <tr
              className="
 text-left
 text-sm
 font-semibold
 text-slate-700
"
            >
              <th className="px-5 py-4">Invoice</th>

              <th className="px-5 py-4">Client</th>

              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4 text-right">Total</th>

              <th className="px-5 py-4 text-right">Paid</th>

              <th className="px-5 py-4 text-right">Balance</th>

              <th className="px-5 py-4">Status</th>

              <th className="px-5 py-4 text-center">Days</th>

              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="
border-t
hover:bg-slate-50
transition
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
                  {invoice.invoiceNumber}
                </td>

                <td
                  className="
px-5
py-4
"
                >
                  <div
                    className="
font-medium
text-slate-700
"
                  >
                    {invoice.client}
                  </div>

                  <p
                    className="
text-xs
text-slate-400
"
                  >
                    {invoice.email}
                  </p>
                </td>

                <td
                  className="
px-5
py-4
text-slate-500
"
                >
                  {new Date(invoice.date).toLocaleDateString()}
                </td>

                <td
                  className="
px-5
py-4
text-right
text-slate-600
"
                >
                  ${invoice.total.toFixed(2)}
                </td>

                <td
                  className="
px-5
py-4
text-right
text-green-600
font-medium
"
                >
                  ${invoice.paid.toFixed(2)}
                </td>

                <td
                  className="
px-5
py-4
text-right
font-semibold
text-red-600
"
                >
                  ${invoice.balance.toFixed(2)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`
rounded-full
px-3
py-1
text-xs
font-medium
${statusStyle(invoice.status)}
`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td
                  className="
px-5
py-4
text-center
"
                >
                  <span
                    className={`
text-sm
font-medium
${invoice.daysOverdue > 30 ? "text-red-600" : "text-slate-600"}
`}
                  >
                    {invoice.daysOverdue} days
                  </span>
                </td>

                <td
                  className="
px-5
py-4
text-center
"
                >
                  <Link
                    href={`/super-admin/invoices/${invoice.id}`}
                    className="
inline-flex
items-center
justify-center
rounded-lg
bg-blue-100
p-2
text-blue-700
hover:bg-blue-200
transition
"
                    title="View Invoice"
                  >
                    <Receipt size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div
        className="
flex
items-center
justify-between
border-t
px-5
py-4
"
      >
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="
inline-flex
items-center
gap-2
rounded-lg
border
px-4
py-2
text-sm
disabled:opacity-40
"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <p
          className="
text-sm
text-slate-500
"
        >
          Page {page} of {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
inline-flex
items-center
gap-2
rounded-lg
border
px-4
py-2
text-sm
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
