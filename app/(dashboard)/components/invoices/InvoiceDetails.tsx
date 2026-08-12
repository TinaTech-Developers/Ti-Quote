"use client";

interface Props {
  invoice: any;
}

export default function InvoiceDetails({ invoice }: Props) {
  const currency = invoice.company?.currency || "$";

  return (
    <div className="space-y-6">
      {/* ===================================== */}
      {/* TOP CARDS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client */}

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-700">Client</h3>

          <div className="space-y-2 text-sm text-slate-500">
            <p className="font-semibold">{invoice.client?.name}</p>

            {invoice.client?.companyName && <p>{invoice.client.companyName}</p>}

            {invoice.client?.email && <p>{invoice.client.email}</p>}

            {invoice.client?.phone && <p>{invoice.client.phone}</p>}

            {invoice.client?.address && <p>{invoice.client.address}</p>}
          </div>
        </div>

        {/* Invoice */}

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-700">
            Invoice Information
          </h3>

          <div className="space-y-3 text-sm text-slate-500">
            <Info label="Invoice Number" value={invoice.invoiceNumber} />

            <Info
              label="Issued"
              value={new Date(invoice.createdAt).toLocaleDateString("en-GB")}
            />

            <Info
              label="Due Date"
              value={
                invoice.dueDate ?
                  new Date(invoice.dueDate).toLocaleDateString("en-GB")
                : "-"
              }
            />

            {invoice.quotation && (
              <Info
                label="Quotation"
                value={invoice.quotation.quotationNumber}
              />
            )}
          </div>
        </div>

        {/* Status */}

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-700">Status</h3>

          <StatusBadge status={invoice.status} />

          <div className="mt-6 space-y-3 text-sm text-slate-500">
            <Info
              label="Total"
              value={`${currency} ${Number(invoice.total).toFixed(2)}`}
            />

            <Info
              label="Balance"
              value={`${currency} ${Number(invoice.balance).toFixed(2)}`}
            />

            <Info label="Payments" value={invoice.payments.length} />
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* ITEMS */}
      {/* ===================================== */}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-slate-600">Invoice Items</h3>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-slate-600">
                Description
              </th>

              <th className="text-center px-6 py-4 text-slate-600">Qty</th>

              <th className="text-right px-6 py-4 text-slate-600">
                Unit Price
              </th>

              <th className="text-right px-6 py-4 text-slate-600">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item: any, index: number) => (
              <tr key={item.id || index} className="border-b">
                <td className="px-6 py-4 text-slate-500">{item.description}</td>

                <td className="text-center px-6 py-4 text-slate-500">
                  {item.quantity}
                </td>

                <td className="text-right px-6 py-4 text-slate-500">
                  {currency} {Number(item.unitPrice).toFixed(2)}
                </td>

                <td className="text-right px-6 py-4 font-medium text-slate-500">
                  {currency} {Number(item.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================== */}
      {/* TOTALS */}
      {/* ===================================== */}

      <div className="flex justify-end">
        <div className="w-full md:w-96 bg-white rounded-xl border p-6 text-slate-600">
          <Totals
            label="Subtotal"
            value={`${currency} ${Number(invoice.subtotal).toFixed(2)}`}
          />

          <Totals
            label="Discount"
            value={`${currency} ${Number(invoice.discount).toFixed(2)}`}
          />

          <Totals
            label="Tax"
            value={`${currency} ${Number(invoice.tax).toFixed(2)}`}
          />

          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total</span>

            <span>
              {currency} {Number(invoice.total).toFixed(2)}
            </span>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between text-red-600 font-bold">
            <span>Balance Due</span>

            <span>
              {currency} {Number(invoice.balance).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* PAYMENTS */}
      {/* ===================================== */}

      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-slate-700">Payment History</h3>
        </div>

        {invoice.payments.length === 0 ?
          <div className="p-8 text-center text-gray-500">
            No payment records found.
          </div>
        : <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-slate-600">Date</th>

                <th className="text-left px-6 py-4 text-slate-600">Method</th>

                <th className="text-right px-6 py-4 text-slate-600">Amount</th>

                <th className="text-left px-6 py-4 text-slate-600">
                  Reference
                </th>
              </tr>
            </thead>

            <tbody>
              {invoice.payments.map((payment: any) => (
                <tr key={payment.id} className="border-b">
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString("en-GB")}
                  </td>

                  <td className="px-6 py-4 text-slate-500">{payment.method}</td>

                  <td className="text-right px-6 py-4 font-medium text-slate-500">
                    {currency} {Number(payment.amount).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {payment.reference || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      {/* ===================================== */}
      {/* NOTES */}
      {/* ===================================== */}

      {(invoice.notes || invoice.terms) && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-3">Notes</h3>

            <p className="text-sm whitespace-pre-wrap text-gray-700">
              {invoice.notes || "No notes."}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-3">Terms & Conditions</h3>

            <p className="text-sm whitespace-pre-wrap text-gray-700">
              {invoice.terms || "No terms specified."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Totals({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2">
      <span>{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-blue-100 text-blue-700",
    PARTIAL: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
        styles[status] || styles.DRAFT
      }`}
    >
      {status}
    </span>
  );
}
