interface PaymentMethodItem {
  method: string;
  amount: number;
}

interface Props {
  data: PaymentMethodItem[];
}

const labels: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  ECOCASH: "EcoCash",
  INNBUCKS: "InnBucks",
  CARD: "Card",
  OTHER: "Other",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function PaymentMethodsOverview({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Payment Methods
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Payments received by method.
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;

          return (
            <div key={item.method}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {labels[item.method] || item.method}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            No payments received.
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Total Payments
          </span>

          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
