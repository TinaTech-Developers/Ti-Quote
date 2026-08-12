"use client";

import { AlertCircle, DollarSign, FileWarning, Clock } from "lucide-react";

interface Props {
  summary: {
    outstanding: number;
    invoices: number;
    overdue: number;
    partial: number;
    unpaid: number;
  };
}

export default function OutstandingSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Outstanding",
      value: summary.outstanding,
      icon: DollarSign,
      color: "bg-red-500",
      money: true,
    },

    {
      title: "Outstanding Invoices",
      value: summary.invoices,
      icon: FileWarning,
      color: "bg-orange-500",
    },

    {
      title: "Overdue Amount",
      value: summary.overdue,
      icon: Clock,
      color: "bg-purple-500",
      money: true,
    },

    {
      title: "Partial Payments",
      value: summary.partial,
      icon: AlertCircle,
      color: "bg-blue-500",
    },
  ];

  return (
    <div
      className="
      grid
      gap-5
      sm:grid-cols-2
      xl:grid-cols-4
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
              "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                    mt-2
                    
                    font-bold
                    text-slate-800
                  "
                >
                  {card.money ?
                    `$${Number(card.value).toFixed(2)}`
                  : card.value}
                </h2>
              </div>

              <div
                className={`
                    flex
                    h-12
                    w-12
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
          </div>
        );
      })}
    </div>
  );
}
