"use client";

import {
  DollarSign,
  FileText,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface Props {
  revenue: {
    total: number;

    paid: number;

    outstanding: number;
  };

  invoices: {
    total: number;

    paid: number;

    partial: number;

    pending: number;

    overdue: number;
  };

  clients: {
    total: number;
  };

  products: {
    total: number;

    lowStock: number;
  };
}

export default function AdminSummaryCards({
  revenue,

  invoices,

  clients,

  products,
}: Props) {
  const cards = [
    {
      title: "Total Revenue",

      value: `$${revenue.total.toFixed(2)}`,

      icon: DollarSign,

      color: "bg-green-500",
    },

    {
      title: "Paid Amount",

      value: `$${revenue.paid.toFixed(2)}`,

      icon: TrendingUp,

      color: "bg-blue-500",
    },

    {
      title: "Outstanding",

      value: `$${revenue.outstanding.toFixed(2)}`,

      icon: AlertCircle,

      color: "bg-red-500",
    },

    {
      title: "Invoices",

      value: invoices.total,

      icon: FileText,

      color: "bg-purple-500",
    },

    {
      title: "Clients",

      value: clients.total,

      icon: Users,

      color: "bg-cyan-500",
    },

    {
      title: "Products",

      value: products.total,

      icon: Package,

      color: "bg-orange-500",
    },
  ];

  return (
    <div
      className="
      grid
      gap-5
      sm:grid-cols-2
      xl:grid-cols-3
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
            p-6
            shadow-sm
            transition
            hover:shadow-md
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
                  font-medium
                  text-slate-500
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                  mt-2
                  text-2xl
                  font-bold
                  text-slate-800
                  "
                >
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
                <Icon size={23} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
