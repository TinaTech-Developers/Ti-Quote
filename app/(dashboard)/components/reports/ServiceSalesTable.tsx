"use client";

interface ServiceSale {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  invoices: number;
}

interface Props {
  services: ServiceSale[];
}

export default function ServiceSalesTable({ services }: Props) {
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
      <div
        className="
        border-b
        border-slate-200
        px-6
        py-5
        "
      >
        <h2 className="text-lg font-semibold text-slate-800">
          Service Sales Breakdown
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Services grouped by sales performance.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr
              className="
              text-left
              text-sm
              font-semibold
              text-slate-700
              "
            >
              <th className="px-5 py-4">Service</th>

              <th className="px-5 py-4 text-center">Quantity</th>

              <th className="px-5 py-4 text-right">Revenue</th>

              <th className="px-5 py-4 text-center">Invoices</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="
                border-t
                transition
                hover:bg-slate-50
                "
              >
                <td
                  className="
                  px-5
                  py-4
                  font-medium
                  text-slate-700
                  "
                >
                  {service.name}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-center
                  text-slate-600
                  "
                >
                  {service.quantity}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-right
                  font-medium
                  text-green-600
                  "
                >
                  ${service.revenue.toFixed(2)}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-center
                  text-slate-600
                  "
                >
                  {service.invoices}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
