"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

interface Quotation {
  id: string;

  quotationNumber?: string;

  total: number | string;

  status: string;

  createdAt: string;

  client?: {
    name: string;
  };
}

interface Props {
  quotations: Quotation[];
}

function statusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "CONVERTED":
      return "bg-blue-100 text-blue-700";

    case "EXPIRED":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function RecentQuotations({ quotations }: Props) {
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
          <h2 className="text-lg font-bold text-slate-800">
            Recent Quotations
          </h2>

          <p className="text-sm text-slate-500">Latest quotations created</p>
        </div>

        <Link
          href="/admin/quotations"
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
              <th className="px-6 py-3">Quotation</th>

              <th className="px-6 py-3">Client</th>

              <th className="px-6 py-3">Amount</th>

              <th className="px-6 py-3">Date</th>

              <th className="px-6 py-3">Status</th>

              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {quotations.map((quotation) => (
              <tr
                key={quotation.id}
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
                  {quotation.quotationNumber || quotation.id}
                </td>

                <td
                  className="
px-6
py-4
text-slate-600
"
                >
                  {quotation.client?.name || "Unknown Client"}
                </td>

                <td
                  className="
px-6
py-4
font-semibold
text-slate-800
"
                >
                  ${Number(quotation.total).toLocaleString()}
                </td>

                <td
                  className="
px-6
py-4
text-slate-500
"
                >
                  {new Date(quotation.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
rounded-full
px-3
py-1
text-xs
font-semibold
${statusStyle(quotation.status)}
`}
                  >
                    {quotation.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/admin/quotations/${quotation.id}`}
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

            {quotations.length === 0 && (
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
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
