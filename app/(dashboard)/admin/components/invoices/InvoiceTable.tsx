"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import DeleteInvoiceButton from "./DeleteInvoiceButton";

interface InvoiceTableProps {
  invoices: any[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Invoice
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Client
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Balance
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ?
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No invoices found.
                </td>
              </tr>
            : invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </p>

                      <p className="text-xs text-slate-500">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {invoice.client?.companyName || invoice.client?.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(Number(invoice.total))}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(Number(invoice.balance))}
                  </td>

                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/invoices/${invoice.id}/edit`}
                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                      </Link>

                      <DeleteInvoiceButton invoiceId={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
