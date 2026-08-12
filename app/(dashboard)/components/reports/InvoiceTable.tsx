"use client";

interface Props {
  invoices: any[];
}

export default function InvoiceTable({ invoices }: Props) {
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
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left text-sm text-slate-700">
              <th className="px-5 py-4">Invoice</th>

              <th className="px-5 py-4">Client</th>

              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4 text-right">Amount</th>

              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="
border-t
hover:bg-slate-50
"
              >
                <td className="px-5 py-4 font-medium text-slate-500">
                  {invoice.invoiceNumber}
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {invoice.client?.name}
                </td>

                <td className="px-5 py-4 text-slate-500">
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                </td>

                <td className="px-5 py-4 text-right text-slate-500">
                  ${Number(invoice.total).toFixed(2)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className="
rounded-full
bg-slate-600
px-3
py-1
text-xs
font-medium
text-white
"
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
