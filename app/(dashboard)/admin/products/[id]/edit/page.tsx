"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Boxes,
  Power,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  unit: string | null;
  price: number | string;
  lowStockAlert: number | string;
  trackStock: boolean;
  stockQuantity?: number | string;
  active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    unit: "",
    price: "",
    stockQuantity: "0",
    lowStockAlert: "0",
    trackStock: true,
    active: true,
  });

  useEffect(() => {
    if (!productId) return;

    loadProduct();
  }, [productId]);

  async function loadProduct() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load product.");
      }

      const loadedProduct: Product = data;

      setProduct(loadedProduct);

      setForm({
        name: loadedProduct.name || "",
        description: loadedProduct.description || "",
        sku: loadedProduct.sku || "",
        unit: loadedProduct.unit || "",
        price: String(loadedProduct.price ?? ""),
        stockQuantity: String(loadedProduct.stockQuantity ?? 0),
        lowStockAlert: String(loadedProduct.lowStockAlert ?? 0),
        trackStock: loadedProduct.trackStock ?? true,
        active: loadedProduct.active ?? true,
      });
    } catch (error) {
      console.error("Load product error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load product.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleTrackStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      trackStock: e.target.checked,
    }));
  }

  function handleActiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      active: e.target.checked,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      form.trackStock &&
      (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
    ) {
      setError("Stock quantity cannot be negative.");
      return;
    }

    if (form.trackStock && Number(form.lowStockAlert) < 0) {
      setError("Low stock alert cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",

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
        throw new Error(data.message || "Failed to update product.");
      }

      router.push(`/admin/products/${productId}`);

      router.refresh();
    } catch (error) {
      console.error("Update product error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#0097A7]" />

          <p className="text-sm text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="
              flex
              h-11
              w-11
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
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Product could not be loaded</p>

              <p className="mt-1 text-sm">{error || "Product not found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={`/admin/products/${productId}`}
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
                Edit Product
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Update product information, pricing and inventory settings.
            </p>
          </div>
        </div>

        {/* ACTIVE STATUS */}

        <div
          className={`
            inline-flex
            items-center
            gap-2
            self-start
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            ${
              product.active ?
                "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
            }
          `}
        >
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${product.active ? "bg-emerald-500" : "bg-slate-400"}
            `}
          />

          {product.active ? "Active" : "Inactive"}
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

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
            <p className="font-semibold">Unable to update product</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* =================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              lg:col-span-2
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the basic information for this product.
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
                  required
                  placeholder="e.g. Portland Cement 50kg"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
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
                    placeholder="e.g. PROD-001"
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
                    placeholder="e.g. Each, Box, Kg"
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
                  rows={6}
                  placeholder="Enter product description..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
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

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="space-y-6">
            {/* =================================================
                PRICING
            ================================================== */}

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
                  Current selling price.
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
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                STOCK QUANTITY
            ================================================== */}

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
                <div className="flex items-center gap-2">
                  <Boxes size={19} className="text-[#0097A7]" />

                  <h2 className="text-lg font-semibold text-slate-800">
                    Stock Quantity
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Update the available quantity for this product.
                </p>
              </div>

              <div className="p-6">
                <label
                  htmlFor="stockQuantity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Stock Quantity
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
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:text-slate-400
                  "
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  {form.unit ?
                    `Quantity is measured in ${form.unit}.`
                  : "Enter the current available quantity."}
                </p>
              </div>
            </div>

            {/* =================================================
                INVENTORY SETTINGS
            ================================================== */}

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
                  Inventory Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure stock tracking and alerts.
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
                      Enable automatic stock tracking for this product.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.trackStock}
                    onChange={handleTrackStockChange}
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
                    step="1"
                    value={form.lowStockAlert}
                    onChange={handleChange}
                    disabled={!form.trackStock}
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

            {/* =================================================
                PRODUCT STATUS
            ================================================== */}

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
                <div className="flex items-center gap-2">
                  <Power size={19} className="text-[#0097A7]" />

                  <h2 className="text-lg font-semibold text-slate-800">
                    Product Status
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Control whether this product is available for use.
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
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        mt-0.5
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        ${
                          form.active ?
                            "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                        }
                      `}
                    >
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Active Product
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Active products can be selected when creating quotations
                        and invoices.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={handleActiveChange}
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

        {/* =====================================================
            ACTIONS
        ====================================================== */}

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
            href={`/admin/products/${productId}`}
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
            disabled={saving}
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
            {saving ?
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Changes...
              </>
            : <>
                <Save size={18} />
                Save Changes
              </>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
