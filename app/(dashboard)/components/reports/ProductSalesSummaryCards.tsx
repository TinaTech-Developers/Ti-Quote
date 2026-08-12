"use client";

import { Package, ShoppingCart, DollarSign, Receipt } from "lucide-react";

interface Summary {
  totalProducts: number;
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

interface Props {
  summary: Summary;
}

export default function ProductSalesSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Products Sold",
      value: summary.totalProducts.toLocaleString(),
      icon: Package,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      title: "Quantity Sold",
      value: summary.totalQuantity.toLocaleString(),
      icon: ShoppingCart,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      title: "Revenue",
      value: `$${summary.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      bg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
    },
    {
      title: "Invoices",
      value: summary.totalInvoices.toLocaleString(),
      icon: Receipt,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className={`mt-3 text-lg font-bold ${card.valueColor}`}>
                  {card.value}
                </h2>
              </div>

              <div className={`rounded-2xl p-4 ${card.bg}`}>
                <Icon className={card.iconColor} size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
