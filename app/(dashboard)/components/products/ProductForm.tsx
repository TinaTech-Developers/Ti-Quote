"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description?: string | null;
    sku?: string | null;
    unit?: string | null;
    price: string | number;

    stockQuantity?: string | number;
    lowStockAlert?: string | number;
    trackStock?: boolean;

    active: boolean;
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();

  const editing = Boolean(initialData?.id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    sku: initialData?.sku || "",
    unit: initialData?.unit || "",

    price: initialData?.price?.toString() || "",

    stockQuantity: initialData?.stockQuantity?.toString() || "0",

    lowStockAlert: initialData?.lowStockAlert?.toString() || "5",

    trackStock: initialData?.trackStock ?? true,

    active: initialData?.active ?? true,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        editing ? `/api/products/${initialData?.id}` : "/api/products",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...form,

            price: Number(form.price),

            stockQuantity: Number(form.stockQuantity),

            lowStockAlert: Number(form.lowStockAlert),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/super-admin/products");

      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
space-y-6
rounded-xl
border
bg-white
p-8
"
    >
      <div
        className="
grid
gap-6
md:grid-cols-2
"
      >
        {/* NAME */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Product Name *
          </label>

          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="
w-full
rounded-lg
border
px-4
py-2
focus:border-blue-600
outline-none text-slate-500
"
          />
        </div>

        {/* SKU */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            SKU
          </label>

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* UNIT */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Unit
          </label>

          <input
            name="unit"
            placeholder="piece, box, kg"
            value={form.unit}
            onChange={handleChange}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* PRICE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Selling Price *
          </label>

          <input
            type="number"
            step="0.01"
            required
            name="price"
            value={form.price}
            onChange={handleChange}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* STOCK */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Opening Stock
          </label>

          <input
            type="number"
            step="0.01"
            name="stockQuantity"
            value={form.stockQuantity}
            onChange={handleChange}
            disabled={!form.trackStock}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* LOW STOCK */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Low Stock Alert
          </label>

          <input
            type="number"
            step="0.01"
            name="lowStockAlert"
            value={form.lowStockAlert}
            onChange={handleChange}
            disabled={!form.trackStock}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Description
          </label>

          <textarea
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            className="
w-full
rounded-lg
border
px-4
py-2 text-slate-500
"
          />
        </div>

        {/* TRACK STOCK */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="trackStock"
            checked={form.trackStock}
            onChange={handleCheckbox}
            className="h-4 w-4"
          />

          <label className="text-sm font-medium text-slate-600">
            Track Inventory
          </label>
        </div>

        {/* ACTIVE */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleCheckbox}
            className="h-4 w-4"
          />

          <label className="text-sm font-medium text-slate-600">
            Active Product
          </label>
        </div>
      </div>

      <div
        className="
flex
justify-end
gap-3
"
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="
rounded-lg
border
px-5
py-2 bg-red-400 hover:backdrop:brightness-200
"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="
rounded-lg
bg-blue-600
px-6
py-2
text-white
hover:bg-blue-700
disabled:opacity-50
"
        >
          {loading ?
            editing ?
              "Updating..."
            : "Creating..."
          : editing ?
            "Update Product"
          : "Create Product"}
        </button>
      </div>
    </form>
  );
}
