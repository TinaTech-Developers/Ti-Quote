"use client";

import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  Wallet,
} from "lucide-react";

interface Props {
  summary: {
    totalPayments: number;
    totalAmount: number;
    completed: number;
    pending: number;
    cancelled: number;
    methods: Record<string, number>;
  };
}

export default function PaymentSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Payments",
      value: summary.totalPayments,
      icon: CreditCard,
      color: "bg-blue-500",
    },
    {
      title: "Amount Received",
      value: `$${summary.totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: Wallet,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className="mt-2 font-bold text-slate-800">{card.value}</h2>
              </div>

              <div className={`${card.color} rounded-xl p-3 text-white`}>
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Payment Methods */}
      <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-700">
          Payment Methods
        </h3>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(summary.methods).map(([method, amount]) => (
            <div
              key={method}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-medium text-slate-600">
                {method.replaceAll("_", " ")}
              </p>

              <p className="mt-2 text-xl font-bold text-[#0B3954]">
                ${Number(amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
