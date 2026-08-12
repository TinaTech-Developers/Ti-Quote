"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Package,
  Plus,
  Minus,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Boxes,
  History,
  DollarSign,
  Barcode,
  Ruler,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
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
  createdAt?: string;
  updatedAt?: string;
}

interface StockMovement {
  id: string;
  type: string;
  quantity: number | string;
  previousQuantity?: number | string;
  newQuantity?: number | string;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
  createdBy?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
  } | null;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [loading, setLoading] = useState(true);
  const [movementsLoading, setMovementsLoading] = useState(true);
  const [stockSaving, setStockSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [movementError, setMovementError] = useState("");

  const [showStockModal, setShowStockModal] = useState(false);

  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE">("ADD");

  const [stockForm, setStockForm] = useState({
    quantity: "",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    if (!productId) return;

    loadProduct();
    loadMovements();
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

      setProduct(data);
    } catch (error) {
      console.error("Load product error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load product.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMovements() {
    setMovementsLoading(true);
    setMovementError("");

    try {
      const response = await fetch(
        `/api/products/${productId}/stock-movements`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load stock movements.");
      }

      /*
       * Supports either:
       * [
       *   ...
       * ]
       *
       * or:
       *
       * {
       *   movements: [...]
       * }
       */
      if (Array.isArray(data)) {
        setMovements(data);
      } else {
        setMovements(data.movements || []);
      }
    } catch (error) {
      console.error("Load stock movements error:", error);

      setMovementError(
        error instanceof Error ?
          error.message
        : "Failed to load stock movements.",
      );
    } finally {
      setMovementsLoading(false);
    }
  }

  const stockQuantity = Number(product?.stockQuantity ?? 0);

  const lowStockAlert = Number(product?.lowStockAlert ?? 0);

  const isLowStock =
    Boolean(product?.trackStock) && stockQuantity <= lowStockAlert;

  const isOutOfStock = Boolean(product?.trackStock) && stockQuantity <= 0;

  const formattedPrice = useMemo(() => {
    if (!product) return "$0.00";

    return `$${Number(product.price ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [product]);

  function openStockModal(action: "ADD" | "REMOVE") {
    setStockAction(action);

    setStockForm({
      quantity: "",
      reference: "",
      notes: "",
    });

    setMovementError("");

    setShowStockModal(true);
  }

  function closeStockModal() {
    if (stockSaving) return;

    setShowStockModal(false);
  }

  async function handleStockSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMovementError("");

    const quantity = Number(stockForm.quantity);

    if (!quantity || quantity <= 0) {
      setMovementError("Please enter a valid quantity.");
      return;
    }

    if (stockAction === "REMOVE" && quantity > stockQuantity) {
      setMovementError(
        `You cannot remove ${quantity} ${product?.unit || "units"}. Only ${stockQuantity} is currently available.`,
      );
      return;
    }

    setStockSaving(true);

    try {
      const response = await fetch(
        `/api/products/${productId}/stock-movements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type: stockAction,
            quantity,
            reference: stockForm.reference.trim() || null,
            notes: stockForm.notes.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update stock.");
      }

      setShowStockModal(false);

      await Promise.all([loadProduct(), loadMovements()]);

      router.refresh();
    } catch (error) {
      console.error("Stock movement error:", error);

      setMovementError(
        error instanceof Error ? error.message : "Failed to update stock.",
      );
    } finally {
      setStockSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Delete product error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete product.",
      );

      setDeleting(false);
    }
  }

  function formatMovementType(type: string) {
    switch (type) {
      case "ADD":
      case "STOCK_IN":
      case "PURCHASE":
      case "RECEIVED":
        return "Stock Added";

      case "REMOVE":
      case "STOCK_OUT":
      case "SALE":
      case "ISSUE":
        return "Stock Removed";

      case "ADJUSTMENT":
        return "Stock Adjustment";

      default:
        return type
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }
  }

  function isIncomingMovement(type: string) {
    return ["ADD", "STOCK_IN", "PURCHASE", "RECEIVED"].includes(type);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              flex h-11 w-11 items-center justify-center
              rounded-xl border border-slate-200 bg-white
              text-slate-600 shadow-sm transition
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Product</h1>

            <p className="mt-1 text-sm text-slate-500">Product details</p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />

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
    <>
      <div className="min-h-full space-y-6 pb-10">
        {/* HEADER */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/admin/products"
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl border border-slate-200 bg-white
                text-slate-600 shadow-sm transition
                hover:bg-slate-50 hover:text-[#0B3954]
              "
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl bg-cyan-50 text-[#0097A7]
                  "
                >
                  <Package size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    {product.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Product details and inventory management
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`
                inline-flex items-center gap-2 rounded-full
                px-3 py-2 text-xs font-semibold
                ${
                  product.active ?
                    "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
                }
              `}
            >
              <span
                className={`
                  h-2 w-2 rounded-full
                  ${product.active ? "bg-emerald-500" : "bg-slate-400"}
                `}
              />

              {product.active ? "Active" : "Inactive"}
            </div>

            <Link
              href={`/admin/products/${productId}/edit`}
              className="
                inline-flex h-11 items-center justify-center
                gap-2 rounded-xl bg-[#0B3954] px-5
                text-sm font-semibold text-white shadow-sm
                transition hover:bg-[#092C42]
              "
            >
              <Edit size={17} />
              Edit Product
            </Link>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              flex items-start gap-3 rounded-xl
              border border-red-200 bg-red-50 p-4
              text-sm text-red-700
            "
          >
            <AlertTriangle size={19} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Something went wrong</p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* STOCK ALERT */}

        {product.trackStock && isOutOfStock && (
          <div
            className="
              flex items-start gap-4 rounded-2xl
              border border-red-200 bg-red-50 p-5
            "
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <p className="font-semibold text-red-800">Out of stock</p>

              <p className="mt-1 text-sm text-red-700">
                This product currently has no available stock.
              </p>
            </div>
          </div>
        )}

        {product.trackStock && !isOutOfStock && isLowStock && (
          <div
            className="
                flex items-start gap-4 rounded-2xl
                border border-amber-200 bg-amber-50 p-5
              "
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <p className="font-semibold text-amber-800">Low stock</p>

              <p className="mt-1 text-sm text-amber-700">
                Current stock is {stockQuantity.toLocaleString()}{" "}
                {product.unit || "units"}. Your low-stock threshold is{" "}
                {lowStockAlert.toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        {/* OVERVIEW CARDS */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* PRICE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Selling Price
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {formattedPrice}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                <DollarSign size={21} />
              </div>
            </div>
          </div>

          {/* STOCK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Current Stock
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {stockQuantity.toLocaleString()}
                </p>

                {product.unit && (
                  <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
                )}
              </div>

              <div
                className={`
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  ${
                    isOutOfStock ? "bg-red-50 text-red-600"
                    : isLowStock ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                  }
                `}
              >
                <Boxes size={21} />
              </div>
            </div>
          </div>

          {/* SKU */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SKU
                </p>

                <p className="mt-2 truncate text-lg font-bold text-slate-800">
                  {product.sku || "No SKU"}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Barcode size={21} />
              </div>
            </div>
          </div>

          {/* TRACK STOCK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Inventory
                </p>

                <p className="mt-2 text-lg font-bold text-slate-800">
                  {product.trackStock ? "Stock Tracked" : "Not Tracked"}
                </p>
              </div>

              <div
                className={`
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  ${
                    product.trackStock ?
                      "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                {product.trackStock ?
                  <CheckCircle2 size={21} />
                : <XCircle size={21} />}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* PRODUCT INFORMATION */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic details and pricing information.
              </p>
            </div>

            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <Package size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Product Name
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">{product.name}</p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <Barcode size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      SKU
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {product.sku || "—"}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <Ruler size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Unit
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {product.unit || "—"}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-slate-400">
                    <DollarSign size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Selling Price
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {formattedPrice}
                  </p>
                </div>
              </div>

              <div className="my-6 border-t border-slate-100" />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {product.description ||
                      "No description has been added for this product."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INVENTORY */}

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Inventory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage current stock quantity.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Available Quantity
                  </p>

                  <p
                    className={`
                      mt-2 text-4xl font-bold
                      ${
                        isOutOfStock ? "text-red-600"
                        : isLowStock ? "text-amber-600"
                        : "text-slate-800"
                      }
                    `}
                  >
                    {stockQuantity.toLocaleString()}
                  </p>

                  {product.unit && (
                    <p className="mt-1 text-sm text-slate-500">
                      {product.unit}
                    </p>
                  )}
                </div>

                {product.trackStock && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openStockModal("ADD")}
                      className="
                        inline-flex h-11 items-center justify-center
                        gap-2 rounded-xl bg-emerald-600 px-4
                        text-sm font-semibold text-white
                        transition hover:bg-emerald-700
                      "
                    >
                      <Plus size={17} />
                      Add Stock
                    </button>

                    <button
                      type="button"
                      onClick={() => openStockModal("REMOVE")}
                      disabled={stockQuantity <= 0}
                      className="
                        inline-flex h-11 items-center justify-center
                        gap-2 rounded-xl bg-red-600 px-4
                        text-sm font-semibold text-white
                        transition hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Minus size={17} />
                      Remove
                    </button>
                  </div>
                )}

                {!product.trackStock && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <Warehouse
                        size={19}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Stock tracking disabled
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Enable stock tracking from the Edit Product page to
                          manage stock movements.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {product.trackStock && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Low stock threshold
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {lowStockAlert.toLocaleString()}{" "}
                          {product.unit || "units"}
                        </p>
                      </div>

                      {isLowStock ?
                        <AlertTriangle size={20} className="text-amber-500" />
                      : <CheckCircle2 size={20} className="text-emerald-500" />}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT STATUS */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Product Status
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>

                  <span
                    className={`
                      rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        product.active ?
                          "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Stock Tracking</span>

                  <span className="text-sm font-semibold text-slate-700">
                    {product.trackStock ? "Enabled" : "Disabled"}
                  </span>
                </div>

                {product.createdAt && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Created</span>

                    <span className="text-right text-sm font-medium text-slate-700">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                )}

                {product.updatedAt && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Last Updated</span>

                    <span className="text-right text-sm font-medium text-slate-700">
                      {formatDate(product.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STOCK MOVEMENTS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                <History size={19} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Stock Movements
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  History of inventory changes for this product.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadMovements}
              disabled={movementsLoading}
              className="
                inline-flex h-10 items-center justify-center
                gap-2 rounded-xl border border-slate-200
                bg-white px-4 text-sm font-semibold
                text-slate-700 transition hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              <RefreshCw
                size={16}
                className={movementsLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {movementError && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3 text-sm text-red-700">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-semibold">
                    Could not load stock movements
                  </p>

                  <p className="mt-1">{movementError}</p>
                </div>
              </div>
            </div>
          )}

          {movementsLoading ?
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 size={20} className="animate-spin text-[#0097A7]" />
                Loading stock movements...
              </div>
            </div>
          : movements.length === 0 ?
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <History size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No stock movements yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Stock movements will appear here when stock is added, removed or
                adjusted.
              </p>
            </div>
          : <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Movement
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Previous
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      New Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reference
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {movements.map((movement) => {
                    const incoming = isIncomingMovement(movement.type);

                    return (
                      <tr
                        key={movement.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                                flex h-9 w-9 items-center
                                justify-center rounded-xl
                                ${
                                  incoming ?
                                    "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-600"
                                }
                              `}
                            >
                              {incoming ?
                                <ArrowDownToLine size={17} />
                              : <ArrowUpFromLine size={17} />}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {formatMovementType(movement.type)}
                              </p>

                              {movement.notes && (
                                <p className="mt-0.5 max-w-[250px] truncate text-xs text-slate-400">
                                  {movement.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`
                              text-sm font-bold
                              ${incoming ? "text-emerald-600" : "text-red-600"}
                            `}
                          >
                            {incoming ? "+" : "-"}
                            {Number(movement.quantity).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {movement.previousQuantity !== undefined ?
                            Number(movement.previousQuantity).toLocaleString()
                          : "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-800">
                            {movement.newQuantity !== undefined ?
                              Number(movement.newQuantity).toLocaleString()
                            : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {movement.reference || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(movement.createdAt)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {formatDateTime(movement.createdAt)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
        </div>

        {/* DANGER ZONE */}

        <div className="rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>

            <p className="mt-1 text-sm text-slate-500">
              Permanently remove this product from your product catalogue.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Delete this product
              </p>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                This action may fail if the product is already referenced by
                quotations, invoices or other records.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="
                inline-flex h-11 shrink-0 items-center
                justify-center gap-2 rounded-xl
                border border-red-200 bg-red-50 px-5
                text-sm font-semibold text-red-700
                transition hover:bg-red-100
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {deleting ?
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Deleting...
                </>
              : <>
                  <Trash2 size={17} />
                  Delete Product
                </>
              }
            </button>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="
              inline-flex h-11 items-center justify-center
              rounded-xl border border-slate-300 bg-white
              px-5 text-sm font-semibold text-slate-700
              transition hover:bg-slate-50
            "
          >
            Back to Products
          </Link>

          <Link
            href={`/admin/products/${productId}/edit`}
            className="
              inline-flex h-11 items-center justify-center
              gap-2 rounded-xl bg-[#0B3954] px-5
              text-sm font-semibold text-white
              transition hover:bg-[#092C42]
            "
          >
            <Edit size={17} />
            Edit Product
          </Link>
        </div>
      </div>

      {/* STOCK MODAL */}

      {showStockModal && (
        <div
          className="
            fixed inset-0 z-50 flex items-center
            justify-center bg-slate-900/50 p-4
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeStockModal();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    ${
                      stockAction === "ADD" ?
                        "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                    }
                  `}
                >
                  {stockAction === "ADD" ?
                    <Plus size={20} />
                  : <Minus size={20} />}
                </div>

                <div>
                  <h2 className="font-semibold text-slate-800">
                    {stockAction === "ADD" ? "Add Stock" : "Remove Stock"}
                  </h2>

                  <p className="text-xs text-slate-500">{product.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeStockModal}
                disabled={stockSaving}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg text-slate-400 transition
                  hover:bg-slate-100 hover:text-slate-600
                  disabled:cursor-not-allowed
                "
              >
                <XCircle size={21} />
              </button>
            </div>

            {/* MODAL BODY */}

            <form onSubmit={handleStockSubmit}>
              <div className="space-y-5 p-6">
                {movementError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3 text-sm text-red-700">
                      <AlertTriangle size={18} className="mt-0.5 shrink-0" />

                      <p>{movementError}</p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Current Stock
                    </span>

                    <span className="font-bold text-slate-800">
                      {stockQuantity.toLocaleString()} {product.unit || ""}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      After Movement
                    </span>

                    <span className="font-bold text-[#0097A7]">
                      {(stockAction === "ADD" ?
                        stockQuantity + (Number(stockForm.quantity) || 0)
                      : stockQuantity - (Number(stockForm.quantity) || 0)
                      ).toLocaleString()}{" "}
                      {product.unit || ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Quantity
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    placeholder="Enter quantity"
                    required
                    autoFocus
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-300 px-4
                      text-sm text-slate-800
                      outline-none transition
                      focus:border-[#0097A7]
                      focus:ring-4 focus:ring-cyan-50
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="reference"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Reference
                  </label>

                  <input
                    id="reference"
                    type="text"
                    value={stockForm.reference}
                    onChange={(e) =>
                      setStockForm((prev) => ({
                        ...prev,
                        reference: e.target.value,
                      }))
                    }
                    placeholder={
                      stockAction === "ADD" ? "e.g. PO-0001" : "e.g. INV-0001"
                    }
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-300 px-4
                      text-sm text-slate-800
                      outline-none transition
                      focus:border-[#0097A7]
                      focus:ring-4 focus:ring-cyan-50
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Notes
                  </label>

                  <textarea
                    id="notes"
                    rows={3}
                    value={stockForm.notes}
                    onChange={(e) =>
                      setStockForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Optional notes about this stock movement..."
                    className="
                      w-full resize-none rounded-xl
                      border border-slate-300 px-4 py-3
                      text-sm text-slate-800
                      outline-none transition
                      focus:border-[#0097A7]
                      focus:ring-4 focus:ring-cyan-50
                    "
                  />
                </div>
              </div>

              {/* MODAL ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={stockSaving}
                  className="
                    inline-flex h-11 items-center
                    justify-center rounded-xl
                    border border-slate-300 bg-white
                    px-5 text-sm font-semibold
                    text-slate-700 transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={stockSaving}
                  className={`
                    inline-flex h-11 items-center
                    justify-center gap-2 rounded-xl
                    px-5 text-sm font-semibold text-white
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      stockAction === "ADD" ?
                        "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                    }
                  `}
                >
                  {stockSaving ?
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  : stockAction === "ADD" ?
                    <>
                      <Plus size={17} />
                      Add Stock
                    </>
                  : <>
                      <Minus size={17} />
                      Remove Stock
                    </>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
