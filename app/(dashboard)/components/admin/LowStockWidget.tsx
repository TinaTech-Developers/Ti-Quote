"use client";

import { AlertTriangle, Package } from "lucide-react";

interface Product {
  id: string;

  name: string;

  quantity: number;

  alert: number;
}

interface Props {
  products: Product[];
}

export default function LowStockWidget({ products }: Props) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-sm
      "
    >
      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        border-b
        border-slate-200
        px-6
        py-5
        "
      >
        <div>
          <h2
            className="
            text-lg
            font-semibold
            text-slate-800
            "
          >
            Low Stock Alert
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            "
          >
            Products requiring attention.
          </p>
        </div>

        <AlertTriangle className="text-red-500" size={24} />
      </div>

      {/* CONTENT */}

      {products.length === 0 ?
        <div
          className="
          flex
          h-56
          flex-col
          items-center
          justify-center
          gap-3
          text-slate-500
          "
        >
          <Package size={40} />

          <p>No low stock products.</p>
        </div>
      : <div
          className="
          divide-y
          divide-slate-100
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
              flex
              items-center
              justify-between
              px-6
              py-4
              hover:bg-slate-50
              transition
              "
            >
              <div>
                <p
                  className="
                  font-medium
                  text-slate-800
                  "
                >
                  {product.name}
                </p>

                <p
                  className="
                  text-sm
                  text-slate-500
                  "
                >
                  Alert level: {product.alert}
                </p>
              </div>

              <div
                className="
                rounded-lg
                bg-red-100
                px-3
                py-2
                text-sm
                font-semibold
                text-red-700
                "
              >
                {product.quantity} left
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
