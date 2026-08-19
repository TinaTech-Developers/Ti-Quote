"use client";

import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  DollarSign,
} from "lucide-react";

interface InventoryStatsProps {
  stats: {
    totalProducts: number;
    totalStock: number;
    lowStock: number;
    outOfStock: number;
    inventoryValue: number;
  };

  currency?: string;
}

export default function InventoryStats({
  stats,
  currency = "USD",
}: InventoryStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      description: "Products tracking inventory",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Stock",
      value: stats.totalStock.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
      description: "Units currently in stock",
      icon: Boxes,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Low Stock",
      value: stats.lowStock.toLocaleString(),
      description: "Products need attention",
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },

    {
      title: "Out of Stock",
      value: stats.outOfStock.toLocaleString(),
      description: "Products currently unavailable",
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },

    {
      title: "Inventory Value",
      value: formatCurrency(stats.inventoryValue),
      description: "Current stock value",
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
