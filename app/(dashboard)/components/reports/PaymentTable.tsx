"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Receipt } from "lucide-react";

interface Payment {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  method: string;
  status: string;
  reference?: string;
  receivedBy: string;
  createdAt: string;
}

interface Props {
  payments: Payment[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentTable({
  payments,
  page,
  totalPages,
  onPageChange,
}: Props) {
  function statusClass(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function methodClass(method: string) {
    switch (method) {
      case "CASH":
        return "bg-green-100 text-green-700";

      case "BANK_TRANSFER":
        return "bg-blue-100 text-blue-700";

      case "CARD":
        return "bg-purple-100 text-purple-700";

      case "ECOCASH":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-800">Payments</h2>

        <p className="mt-1 text-sm text-slate-500">
          {payments.length} payment(s) found
        </p>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left text-sm font-semibold text-slate-700">
              <th className="px-5 py-4">Payment #</th>
              <th className="px-5 py-4">Invoice</th>
              <th className="px-5 py-4">Client</th>
              <th className="px-5 py-4">Method</th>
              <th className="px-5 py-4 text-right">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Received By</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t transition hover:bg-slate-50"
              >
                <td className="px-5 py-4 font-medium text-slate-700 text-sm">
                  {payment.paymentNumber}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {payment.invoiceNumber}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {payment.client}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${methodClass(
                      payment.method,
                    )}`}
                  >
                    {payment.method.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="px-5 py-4 text-right font-semibold text-green-700">
                  ${payment.amount.toFixed(2)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {payment.receivedBy}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/super-admin/payments/${payment.id}`}
                      className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200"
                      title="View Payment"
                    >
                      <Eye size={16} color="gray" />
                    </Link>

                    {/* Replace this Link */}
                    <Link
                      href={`/super-admin/invoices`}
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                      title="View Invoice"
                    >
                      <Receipt size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
