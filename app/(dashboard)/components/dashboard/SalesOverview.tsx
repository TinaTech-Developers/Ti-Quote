"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  {
    month: "Jan",
    quotations: 35,
    invoices: 24,
    payments: 18,
  },
  {
    month: "Feb",
    quotations: 42,
    invoices: 30,
    payments: 25,
  },
  {
    month: "Mar",
    quotations: 50,
    invoices: 38,
    payments: 32,
  },
  {
    month: "Apr",
    quotations: 45,
    invoices: 35,
    payments: 29,
  },
  {
    month: "May",
    quotations: 60,
    invoices: 48,
    payments: 40,
  },
  {
    month: "Jun",
    quotations: 70,
    invoices: 55,
    payments: 46,
  },
];

export default function SalesOverview() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Sales Overview</h2>

        <p className="text-sm text-slate-500">
          Quotations, invoices and payments comparison
        </p>
      </div>

      {/* Chart */}

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip
              cursor={{
                fill: "rgba(0,0,0,0.05)",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
              }}
            />

            <Legend />

            <Bar
              dataKey="quotations"
              name="Quotations"
              radius={[6, 6, 0, 0]}
              fill="#0B3954"
            />

            <Bar
              dataKey="invoices"
              name="Invoices"
              radius={[6, 6, 0, 0]}
              fill="#0097A7"
            />

            <Bar
              dataKey="payments"
              name="Payments"
              radius={[6, 6, 0, 0]}
              fill="#64748B"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
