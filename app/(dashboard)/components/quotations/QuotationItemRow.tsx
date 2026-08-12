"use client";

import { Trash2 } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity?: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export type QuotationItemType = "PRODUCT" | "SERVICE" | "CUSTOM";

export interface QuotationItem {
  id: string;

  type: QuotationItemType;

  productId?: string | null;

  serviceId?: string | null;

  description: string;

  quantity: number;

  unitPrice: number;
}

interface Props {
  item: QuotationItem;

  index: number;

  products: Product[];

  services: Service[];

  onChange: (index: number, item: QuotationItem) => void;

  onRemove: (index: number) => void;
}

export default function QuotationItemRow({
  item,
  index,
  products,
  services,
  onChange,
  onRemove,
}: Props) {
  function update(values: Partial<QuotationItem>) {
    onChange(index, {
      ...item,
      ...values,
    });
  }

  return (
    <tr className="border-b">
      {/* Type */}

      <td className="p-2 text-slate-600">
        <select
          value={item.type}
          onChange={(e) =>
            update({
              type: e.target.value as "PRODUCT" | "SERVICE" | "CUSTOM",
              productId: "",
              serviceId: "",
              description: "",
              unitPrice: 0,
            })
          }
          className="w-full rounded-lg border p-2"
        >
          <option value="PRODUCT">Product</option>

          <option value="SERVICE">Service</option>

          <option value="CUSTOM">Custom</option>
        </select>
      </td>

      {/* Product */}

      {item.type === "PRODUCT" && (
        <td className="p-2 text-slate-600">
          <select
            value={item.productId || ""}
            onChange={(e) => {
              const product = products.find((p) => p.id === e.target.value);

              if (!product) return;

              update({
                productId: product.id,
                description: product.name,
                unitPrice: Number(product.price),
              });
            }}
            className="w-full rounded-lg border p-2"
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </td>
      )}

      {/* Service */}

      {item.type === "SERVICE" && (
        <td className="p-2 text-slate-600">
          <select
            value={item.serviceId || ""}
            onChange={(e) => {
              const service = services.find((s) => s.id === e.target.value);

              if (!service) return;

              update({
                serviceId: service.id,
                description: service.name,
                unitPrice: Number(service.price),
              });
            }}
            className="w-full rounded-lg border p-2"
          >
            <option value="">Select Service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </td>
      )}

      {/* Custom */}

      {item.type === "CUSTOM" && (
        <td className="p-2 text-slate-600">
          <input
            value={item.description}
            onChange={(e) =>
              update({
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="w-full rounded-lg border p-2"
          />
        </td>
      )}

      {/* Qty */}

      <td className="p-2 text-slate-600">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            update({
              quantity: Number(e.target.value),
            })
          }
          className="w-24 rounded-lg border p-2"
        />
      </td>

      {/* Price */}

      <td className="p-2 text-slate-600">
        <input
          type="number"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) =>
            update({
              unitPrice: Number(e.target.value),
            })
          }
          className="w-32 rounded-lg border p-2"
        />
      </td>

      {/* Total */}

      <td className="p-2 font-semibold text-slate-600">
        ${(item.quantity * item.unitPrice).toFixed(2)}
      </td>

      {/* Delete */}

      <td className="p-2">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
