"use client";

import {
  DollarSign,
  CreditCard,
  Wallet,
  Receipt,
  Percent,
  TrendingUp,
} from "lucide-react";

interface Props {
  summary: {
    revenue: number;
    paid: number;
    outstanding: number;
    tax: number;
    discount: number;
    netRevenue: number;
    invoices: number;
  };
}

interface CardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  bg: string;
  iconBg: string;
  textColor: string;
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  bg,
  iconBg,
  textColor,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        ${bg}
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className={`mt-3 text-3xl font-bold ${textColor}`}>
            $
            {value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>

        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
          `}
        >
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
}

export default function RevenueSummaryCards({ summary }: Props) {
  return (
    <>
      {/* KPI Cards */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Revenue"
          value={summary.revenue}
          icon={DollarSign}
          bg="bg-white"
          iconBg="bg-green-600"
          textColor="text-green-700"
        />

        <SummaryCard
          title="Payments Received"
          value={summary.paid}
          icon={CreditCard}
          bg="bg-white"
          iconBg="bg-blue-600"
          textColor="text-blue-700"
        />

        <SummaryCard
          title="Outstanding Balance"
          value={summary.outstanding}
          icon={Wallet}
          bg="bg-white"
          iconBg="bg-red-600"
          textColor="text-red-700"
        />

        <SummaryCard
          title="Tax Collected"
          value={summary.tax}
          icon={Receipt}
          bg="bg-white"
          iconBg="bg-purple-600"
          textColor="text-purple-700"
        />

        <SummaryCard
          title="Discount Given"
          value={summary.discount}
          icon={Percent}
          bg="bg-white"
          iconBg="bg-orange-500"
          textColor="text-orange-700"
        />

        <SummaryCard
          title="Net Revenue"
          value={summary.netRevenue}
          icon={TrendingUp}
          bg="bg-white"
          iconBg="bg-[#0B3954]"
          textColor="text-[#0B3954]"
        />
      </div>

      {/* Statistics */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Invoices Generated</p>

          <h2 className="mt-2 text-4xl font-bold text-slate-800">
            {summary.invoices}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Total invoices included in this report.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-sm">
          <p className="text-sm opacity-90">Collection Rate</p>

          <h2 className="mt-2 text-4xl font-bold">
            {summary.revenue > 0 ?
              ((summary.paid / summary.revenue) * 100).toFixed(1)
            : "0"}
            %
          </h2>

          <p className="mt-2 text-sm opacity-90">
            Percentage of revenue collected.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white shadow-sm">
          <p className="text-sm opacity-90">Outstanding Rate</p>

          <h2 className="mt-2 text-4xl font-bold">
            {summary.revenue > 0 ?
              ((summary.outstanding / summary.revenue) * 100).toFixed(1)
            : "0"}
            %
          </h2>

          <p className="mt-2 text-sm opacity-90">
            Percentage still outstanding.
          </p>
        </div>
      </div>
    </>
  );
}
