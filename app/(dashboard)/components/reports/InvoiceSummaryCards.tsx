"use client";

import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Props {
  summary: {
    total: number;
    totalAmount: number;
    paid: number;
    partial: number;
    unpaid: number;
    cancelled: number;
  };
}

export default function InvoiceSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Invoices",
      value: summary.total,
      icon: FileText,
      color: "bg-blue-500",
    },

    {
      title: "Invoice Value",
      value: `$${summary.totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },

    {
      title: "Paid",
      value: summary.paid,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },

    {
      title: "Partial",
      value: summary.partial,
      icon: Clock,
      color: "bg-orange-500",
    },

    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: XCircle,
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
            className="
              rounded-2xl
              bg-white
              border
              border-slate-200
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h3 className="mt-2 text-lg font-bold text-slate-800">
                  {card.value}
                </h3>
              </div>

              <div
                className={`
                  rounded-xl
                  p-3
                  text-white
                  ${card.color}
                `}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
