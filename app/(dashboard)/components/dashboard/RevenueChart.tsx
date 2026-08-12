"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  {
    month: "Jan",
    revenue: 4500,
  },
  {
    month: "Feb",
    revenue: 6200,
  },
  {
    month: "Mar",
    revenue: 5800,
  },
  {
    month: "Apr",
    revenue: 9000,
  },
  {
    month: "May",
    revenue: 7600,
  },
  {
    month: "Jun",
    revenue: 12000,
  },
  {
    month: "Jul",
    revenue: 14500,
  },
];

export default function RevenueChart() {
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
        <h2 className="text-lg font-bold text-slate-800">Revenue Overview</h2>

        <p className="text-sm text-slate-500">Monthly income performance</p>
      </div>

      {/* Chart */}

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0097A7" stopOpacity={0.3} />

                <stop offset="95%" stopColor="#0097A7" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0B3954"
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
