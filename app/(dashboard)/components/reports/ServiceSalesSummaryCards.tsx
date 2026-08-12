"use client";

import {
  BriefcaseBusiness,
  DollarSign,
  FileText,
  PackageCheck,
} from "lucide-react";

interface Props {
  summary: {
    totalServices: number;
    totalQuantity: number;
    totalRevenue: number;
    totalInvoices: number;
  };
}

export default function ServiceSalesSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Services Sold",
      value: summary.totalServices,
      icon: BriefcaseBusiness,
      color: "bg-blue-500",
    },

    {
      title: "Total Quantity",
      value: summary.totalQuantity,
      icon: PackageCheck,
      color: "bg-green-500",
    },

    {
      title: "Revenue Generated",
      value: `$${summary.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-500",
    },

    {
      title: "Invoices",
      value: summary.totalInvoices,
      icon: FileText,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
            p-6
            shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {card.value}
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
