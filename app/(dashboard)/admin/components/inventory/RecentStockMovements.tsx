"use client";

import { ArrowDown, ArrowUp, RefreshCcw, Package } from "lucide-react";

interface StockMovement {
  id: string;
  type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";
  quantity: number;
  reference?: string | null;
  notes?: string | null;
  createdAt: string | Date;

  product: {
    id: string;
    name: string;
    sku?: string | null;
    unit?: string | null;
  };
}

interface RecentStockMovementsProps {
  movements: StockMovement[];
}

export default function RecentStockMovements({
  movements,
}: RecentStockMovementsProps) {
  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getMovement(type: StockMovement["type"]) {
    switch (type) {
      case "STOCK_IN":
        return {
          label: "Stock In",
          icon: ArrowDown,
          wrapper: "bg-emerald-50",
          iconColor: "text-emerald-600",
          quantity: "+",
          quantityColor: "text-emerald-600",
        };

      case "STOCK_OUT":
        return {
          label: "Stock Out",
          icon: ArrowUp,
          wrapper: "bg-red-50",
          iconColor: "text-red-600",
          quantity: "-",
          quantityColor: "text-red-600",
        };

      default:
        return {
          label: "Adjustment",
          icon: RefreshCcw,
          wrapper: "bg-blue-50",
          iconColor: "text-blue-600",
          quantity: "",
          quantityColor: "text-blue-600",
        };
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Stock Movements
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest inventory activity.
        </p>
      </div>

      {movements.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-5 w-5 text-slate-400" />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            No stock movements
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Inventory movements will appear here.
          </p>
        </div>
      )}

      {movements.length > 0 && (
        <div className="divide-y divide-slate-100">
          {movements.map((movement) => {
            const config = getMovement(movement.type);
            const Icon = config.icon;

            return (
              <div
                key={movement.id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.wrapper}`}
                  >
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {movement.product.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{config.label}</span>

                      <span>•</span>

                      <span>{formatDate(movement.createdAt)}</span>

                      {movement.reference && (
                        <>
                          <span>•</span>
                          <span>{movement.reference}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`shrink-0 text-sm font-bold ${config.quantityColor}`}
                >
                  {config.quantity}
                  {movement.quantity}
                  {movement.product.unit ? ` ${movement.product.unit}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
