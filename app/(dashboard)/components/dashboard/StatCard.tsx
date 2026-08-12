"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-xl font-bold text-slate-800">{value}</h2>

          {change && (
            <div
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                positive ?
                  "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
            >
              {positive ?
                <TrendingUp size={14} />
              : <TrendingDown size={14} />}

              {change}
            </div>
          )}
        </div>

        <div
          className="
            rounded-xl
            bg-[#0B3954]
            p-3
            text-white
          "
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
