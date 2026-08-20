interface SalesItem {
  date: string;
  sales: number;
  payments: number;
}

interface Props {
  data: SalesItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalesOverview({ data }: Props) {
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.sales, item.payments)),
    1,
  );

  const displayData =
    data.length > 31 ?
      data.filter((_, index) => index % Math.ceil(data.length / 31) === 0)
    : data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Sales Overview</h2>

        <p className="mt-1 text-sm text-slate-500">
          Invoiced sales compared with payments received.
        </p>
      </div>

      <div className="mb-5 flex items-center gap-5 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          Sales
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Payments
        </div>
      </div>

      {data.length === 0 ?
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          No sales data available.
        </div>
      : <div className="flex h-72 items-end gap-1 overflow-hidden border-b border-slate-200 px-2">
          {displayData.map((item) => {
            const salesHeight = (item.sales / maxValue) * 100;

            const paymentHeight = (item.payments / maxValue) * 100;

            return (
              <div
                key={item.date}
                className="group flex h-full min-w-0 flex-1 items-end justify-center gap-0.5"
              >
                <div
                  title={`Sales: ${formatCurrency(item.sales)}`}
                  className="w-full rounded-t-sm bg-blue-500 transition hover:bg-blue-600"
                  style={{
                    height: `${Math.max(salesHeight, 1)}%`,
                  }}
                />

                <div
                  title={`Payments: ${formatCurrency(item.payments)}`}
                  className="w-full rounded-t-sm bg-emerald-500 transition hover:bg-emerald-600"
                  style={{
                    height: `${Math.max(paymentHeight, 1)}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      }

      {displayData.length > 0 && (
        <div className="mt-3 flex justify-between text-[10px] text-slate-400">
          <span>
            {new Date(displayData[0].date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </span>

          <span>
            {new Date(
              displayData[displayData.length - 1].date,
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
