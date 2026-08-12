"use client";

import Link from "next/link";
import { Eye, Banknote, Smartphone, CreditCard } from "lucide-react";

interface Payment {
  id: string;

  amount: number | string;

  method: string;

  status: string;

  createdAt: string;

  invoice?: {
    invoiceNumber?: string;

    client?: {
      name: string;
    };
  };
}

interface Props {
  payments: Payment[];
}

function statusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "REFUNDED":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function PaymentIcon({ method }: { method: string }) {
  switch (method) {
    case "BANK_TRANSFER":
      return <Banknote size={16} />;

    case "ECOCASH":
      return <Smartphone size={16} />;

    default:
      return <CreditCard size={16} />;
  }
}

export default function RecentPayments({ payments }: Props) {
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
          <h2 className="text-lg font-bold text-slate-800">Recent Payments</h2>

          <p className="text-sm text-slate-500">Latest customer payments</p>
        </div>

        <Link
          href="/admin/payments"
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
              <th className="px-6 py-3">Payment</th>

              <th className="px-6 py-3">Client</th>

              <th className="px-6 py-3">Invoice</th>

              <th className="px-6 py-3">Amount</th>

              <th className="px-6 py-3">Method</th>

              <th className="px-6 py-3">Status</th>

              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
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
                  {payment.id}
                </td>

                <td
                  className="
px-6
py-4
text-slate-600
"
                >
                  {payment.invoice?.client?.name || "Unknown Client"}
                </td>

                <td
                  className="
px-6
py-4
font-medium
text-[#0097A7]
"
                >
                  {payment.invoice?.invoiceNumber || "Invoice"}
                </td>

                <td
                  className="
px-6
py-4
font-semibold
text-slate-800
"
                >
                  ${Number(payment.amount).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <div
                    className="
flex
items-center
gap-2
text-slate-600
"
                  >
                    <PaymentIcon method={payment.method} />

                    <span>{payment.method.replace("_", " ")}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
rounded-full
px-3
py-1
text-xs
font-semibold
${statusStyle(payment.status)}
`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/admin/payments/${payment.id}`}
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

            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
px-6
py-10
text-center
text-slate-400
"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
