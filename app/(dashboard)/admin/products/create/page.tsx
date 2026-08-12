"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Package, Save, Loader2, AlertCircle } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    unit: "",
    price: "",
    stockQuantity: "0",
    lowStockAlert: "5",
    trackStock: true,
    active: true,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      form.trackStock &&
      form.stockQuantity !== "" &&
      Number(form.stockQuantity) < 0
    ) {
      setError("Opening stock cannot be negative.");
      return;
    }

    if (
      form.trackStock &&
      form.lowStockAlert !== "" &&
      Number(form.lowStockAlert) < 0
    ) {
      setError("Low stock alert cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          sku: form.sku.trim() || null,
          unit: form.unit.trim() || null,

          price: Number(form.price),

          stockQuantity: form.trackStock ? Number(form.stockQuantity || 0) : 0,

          lowStockAlert: form.trackStock ? Number(form.lowStockAlert || 0) : 0,

          trackStock: form.trackStock,

          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Create product error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/products"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              hover:text-[#0B3954]
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Package size={22} className="text-[#0097A7]" />

              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Create Product
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Add a new product to your company inventory.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
          "
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to create product</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* MAIN INFORMATION */}
          <div
            className="
              lg:col-span-2
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic information for this product.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Product Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Portland Cement 50kg"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                />
              </div>

              {/* SKU + UNIT */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="sku"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    SKU
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="e.g. CEM-50KG-001"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Optional unique product code.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="unit"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Unit
                  </label>

                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g. Each, Box, Kg, Litre"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Enter a short description of the product..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* PRICING */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Pricing
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set the selling price for this product.
                </p>
              </div>

              <div className="p-6">
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Selling Price
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-medium
                      text-slate-400
                    "
                  >
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      pl-9
                      pr-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />
                </div>
              </div>
            </div>

            {/* INVENTORY */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Inventory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure stock tracking and opening inventory.
                </p>
              </div>

              <div className="space-y-5 p-6">
                {/* TRACK STOCK */}
                <label
                  className="
                    flex
                    cursor-pointer
                    items-start
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    transition
                    hover:bg-slate-50
                  "
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Track stock
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Automatically record stock movements for this product.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="trackStock"
                    checked={form.trackStock}
                    onChange={handleCheckbox}
                    className="
                      mt-1
                      h-5
                      w-5
                      shrink-0
                      cursor-pointer
                      accent-[#0097A7]
                    "
                  />
                </label>

                {/* OPENING STOCK */}
                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Opening Stock
                  </label>

                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    disabled={!form.trackStock}
                    placeholder="0"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      disabled:text-slate-400
                    "
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    The quantity currently available when creating this product.
                  </p>
                </div>

                {/* LOW STOCK */}
                <div>
                  <label
                    htmlFor="lowStockAlert"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Low Stock Alert
                  </label>

                  <input
                    id="lowStockAlert"
                    name="lowStockAlert"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.lowStockAlert}
                    onChange={handleChange}
                    disabled={!form.trackStock}
                    placeholder="5"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                      disabled:cursor-not-allowed
                      disabled:bg-slate-100
                      disabled:text-slate-400
                    "
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    You'll be alerted when stock reaches this level.
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Product Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Control whether this product can be used in transactions.
                </p>
              </div>

              <div className="p-6">
                <label
                  className="
                    flex
                    cursor-pointer
                    items-start
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    transition
                    hover:bg-slate-50
                  "
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Active Product
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Active products are available when creating quotations and
                      invoices.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleCheckbox}
                    className="
                      mt-1
                      h-5
                      w-5
                      shrink-0
                      cursor-pointer
                      accent-[#0097A7]
                    "
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:flex-row
            sm:justify-end
          "
        >
          <Link
            href="/admin/products"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              rounded-xl
              border
              border-slate-300
              bg-white
              px-6
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0B3954]
              px-7
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#092C42]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ?
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Product...
              </>
            : <>
                <Save size={18} />
                Create Product
              </>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
