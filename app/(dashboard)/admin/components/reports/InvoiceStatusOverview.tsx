interface Props {
  summary: {
    paidInvoices: number;
    partialInvoices: number;
    sentInvoices: number;
    overdueInvoices: number;
    draftInvoices: number;
    cancelledInvoices: number;
  };
}

export default function InvoiceStatusOverview({ summary }: Props) {
  const statuses = [
    {
      label: "Paid",
      value: summary.paidInvoices,
      className: "bg-emerald-500",
    },
    {
      label: "Partial",
      value: summary.partialInvoices,
      className: "bg-amber-500",
    },
    {
      label: "Sent",
      value: summary.sentInvoices,
      className: "bg-blue-500",
    },
    {
      label: "Overdue",
      value: summary.overdueInvoices,
      className: "bg-red-500",
    },
    {
      label: "Draft",
      value: summary.draftInvoices,
      className: "bg-slate-400",
    },
    {
      label: "Cancelled",
      value: summary.cancelledInvoices,
      className: "bg-slate-700",
    },
  ];

  const total = statuses.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Invoice Status</h2>

        <p className="mt-1 text-sm text-slate-500">
          Breakdown of invoices for the selected period.
        </p>
      </div>

      <div className="space-y-4">
        {statuses.map((status) => {
          const percentage = total > 0 ? (status.value / total) * 100 : 0;

          return (
            <div key={status.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${status.className}`}
                  />

                  <span className="text-slate-600">{status.label}</span>
                </div>

                <span className="font-semibold text-slate-900">
                  {status.value}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${status.className}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
