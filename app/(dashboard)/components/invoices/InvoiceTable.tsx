"use client";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

interface Props {
  invoices: any[];
}

export default function InvoiceTable({ invoices }: Props) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No invoices found
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  async function deleteInvoice(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmDelete) return;

    await fetch(`/api/invoices/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Invoice
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Client
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Date
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Total
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Balance
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Status
            </th>

            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="
              border-b
              hover:bg-gray-50
              transition
              "
            >
              <td className="px-6 py-4">
                <div className="font-medium text-gray-800">
                  {invoice.invoiceNumber}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="font-medium text-gray-700">
                  {invoice.client?.name}
                </div>

                <div className="text-xs text-gray-500">
                  {invoice.client?.email}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
              </td>

              <td className="px-6 py-4 font-medium text-gray-700">
                {invoice.company?.currency || "$"}{" "}
                {Number(invoice.total).toFixed(2)}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {invoice.company?.currency || "$"}{" "}
                {Number(invoice.balance).toFixed(2)}
              </td>

              <td className="px-6 py-4">
                <InvoiceStatusBadge status={invoice.status} />
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <InvoiceActions
                    invoiceId={invoice.id}
                    invoiceNumber={invoice.invoiceNumber}
                    onDelete={() => deleteInvoice(invoice.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
