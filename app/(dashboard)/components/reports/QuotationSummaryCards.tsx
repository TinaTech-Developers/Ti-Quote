"use client";

import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Receipt,
} from "lucide-react";

interface Props {
  summary: {
    totalQuotations: number;
    totalValue: number;
    approved: number;
    pending: number;
    rejected: number;
    draft: number;
    converted: number;
  };
}

export default function QuotationSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Quotations",
      value: summary.totalQuotations,
      icon: FileText,
      color: "bg-blue-500",
    },

    {
      title: "Quotation Value",
      value: `$${summary.totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },

    {
      title: "Approved",
      value: summary.approved,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },

    {
      title: "Pending",
      value: summary.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },

    {
      title: "Rejected",
      value: summary.rejected,
      icon: XCircle,
      color: "bg-red-500",
    },

    {
      title: "Converted",
      value: summary.converted,
      icon: Receipt,
      color: "bg-purple-500",
    },
  ];

  return (
    <div
      className="
      grid
      grid-cols-1
      gap-5
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-6
      "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
            "
          >
            <div className="flex items-center justify-between">
              <div
                className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                text-white
                ${card.color}
                `}
              >
                <Icon size={22} />
              </div>
            </div>

            <p
              className="
              mt-4
              text-sm
              text-slate-500
              "
            >
              {card.title}
            </p>

            <h2
              className="
              mt-1
              
              font-bold
              text-slate-800
              "
            >
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
