"use client";

import { useMemo } from "react";
import { QuotationItem } from "./QuotationItemRow";

interface Props {
  items: QuotationItem[];

  discount: number;

  tax: number;

  onDiscountChange: (value: number) => void;

  onTaxChange: (value: number) => void;
}

export default function QuotationTotals({
  items,
  discount,
  tax,
  onDiscountChange,
  onTaxChange,
}: Props) {
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const total = useMemo(() => {
    return subtotal - discount + tax;
  }, [subtotal, discount, tax]);

  return (
    <div className="ml-auto mt-8 w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-700">Totals</h3>

      <div className="space-y-4">
        {/* Subtotal */}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>

          <span className="font-semibold text-slate-700">
            $
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Discount */}

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-600">Discount</span>

          <input
            type="number"
            min={0}
            step="0.01"
            value={discount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            className="w-32 rounded-lg border px-3 py-2 text-right text-slate-500"
          />
        </div>

        {/* Tax */}

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-600">Tax</span>

          <input
            type="number"
            min={0}
            step="0.01"
            value={tax}
            onChange={(e) => onTaxChange(Number(e.target.value))}
            className="w-32 rounded-lg border px-3 py-2 text-right text-slate-500"
          />
        </div>

        <hr />

        {/* Grand Total */}

        <div className="flex items-center justify-between text-lg font-bold">
          <span className="text-slate-700">Total</span>

          <span className="text-blue-600">
            $
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
