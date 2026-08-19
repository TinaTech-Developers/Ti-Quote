"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  FileText,
  User,
  Calendar,
  Percent,
  Package,
  Wrench,
  AlertCircle,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  sku?: string | null;
  unit?: string | null;
  active?: boolean;
}

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  active?: boolean;
}

interface InvoiceItem {
  id: string;
  type: "PRODUCT" | "SERVICE" | "CUSTOM";
  productId?: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormProps {
  clients: Client[];
  products: Product[];
  services: Service[];
  initialData?: any;
  mode?: "create" | "edit";
}

function generateItemId() {
  return Math.random().toString(36).substring(2, 10);
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZW", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvoiceForm({
  clients,
  products,
  services,
  initialData,
  mode = "create",
}: InvoiceFormProps) {
  const router = useRouter();
  const invoice = initialData;
  const isEditing = mode === "edit";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [clientId, setClientId] = useState(invoice?.clientId || "");

  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ?
      new Date(invoice.dueDate).toISOString().split("T")[0]
    : "",
  );

  const [discount, setDiscount] = useState(toNumber(invoice?.discount));

  const [tax, setTax] = useState(toNumber(invoice?.tax));

  const [notes, setNotes] = useState(invoice?.notes || "");

  const [terms, setTerms] = useState(invoice?.terms || "");

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items?.length ?
      invoice.items.map((item: any) => ({
        id: item.id || generateItemId(),

        type:
          item.productId ? "PRODUCT"
          : item.serviceId ? "SERVICE"
          : "CUSTOM",

        productId: item.productId || undefined,

        serviceId: item.serviceId || undefined,

        description: item.description || "",

        quantity: toNumber(item.quantity) || 1,

        unitPrice: toNumber(item.unitPrice),

        total: toNumber(item.total),
      }))
    : [
        {
          id: generateItemId(),
          type: "PRODUCT",
          description: "",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
  );

  /*
   * ================================
   * CALCULATIONS
   * ================================
   */

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + toNumber(item.quantity) * toNumber(item.unitPrice);
    }, 0);
  }, [items]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - toNumber(discount) + toNumber(tax));
  }, [subtotal, discount, tax]);

  /*
   * ================================
   * ADD ITEM
   * ================================
   */

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: generateItemId(),
        type: "PRODUCT",
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  }

  /*
   * ================================
   * REMOVE ITEM
   * ================================
   */

  function removeItem(id: string) {
    setItems((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((item) => item.id !== id);
    });
  }

  /*
   * ================================
   * UPDATE ITEM
   * ================================
   */

  function updateItem(id: string, updates: Partial<InvoiceItem>) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updated = {
          ...item,
          ...updates,
        };

        updated.total =
          toNumber(updated.quantity) * toNumber(updated.unitPrice);

        return updated;
      }),
    );
  }

  /*
   * ================================
   * CHANGE ITEM TYPE
   * ================================
   */

  function changeItemType(id: string, type: InvoiceItem["type"]) {
    updateItem(id, {
      type,
      productId: undefined,
      serviceId: undefined,
      description: "",
      unitPrice: 0,
    });
  }

  /*
   * ================================
   * SELECT PRODUCT
   * ================================
   */

  function selectProduct(itemId: string, productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      updateItem(itemId, {
        productId: undefined,
      });

      return;
    }

    updateItem(itemId, {
      type: "PRODUCT",

      productId: product.id,

      serviceId: undefined,

      description: product.description || product.name,

      unitPrice: toNumber(product.price),
    });
  }

  /*
   * ================================
   * SELECT SERVICE
   * ================================
   */

  function selectService(itemId: string, serviceId: string) {
    const service = services.find((item) => item.id === serviceId);

    if (!service) {
      updateItem(itemId, {
        serviceId: undefined,
      });

      return;
    }

    updateItem(itemId, {
      type: "SERVICE",

      serviceId: service.id,

      productId: undefined,

      description: service.description || service.name,

      unitPrice: toNumber(service.price),
    });
  }

  /*
   * ================================
   * SUBMIT
   * ================================
   */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!clientId) {
      setError("Please select a client.");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one invoice item.");
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0,
    );

    if (invalidItem) {
      setError("Please complete all invoice items correctly.");
      return;
    }

    if (discount < 0) {
      setError("Discount cannot be negative.");
      return;
    }

    if (tax < 0) {
      setError("Tax cannot be negative.");
      return;
    }

    if (discount > subtotal) {
      setError("Discount cannot be greater than the subtotal.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        clientId,

        dueDate: dueDate ? new Date(`${dueDate}T23:59:59`).toISOString() : null,

        subtotal: Number(subtotal.toFixed(2)),

        discount: Number(discount.toFixed(2)),

        tax: Number(tax.toFixed(2)),

        total: Number(total.toFixed(2)),

        balance: Number(total.toFixed(2)),

        notes: notes.trim() || null,

        terms: terms.trim() || null,

        items: items.map((item) => ({
          productId: item.productId || null,

          serviceId: item.serviceId || null,

          description: item.description.trim(),

          quantity: Number(item.quantity.toFixed(2)),

          unitPrice: Number(item.unitPrice.toFixed(2)),

          total: Number((item.quantity * item.unitPrice).toFixed(2)),
        })),
      };

      const url = isEditing ? `/api/invoices/${invoice.id}` : "/api/invoices";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to save invoice.",
        );
      }

      const savedInvoice = data?.invoice || data?.data || data;

      const invoiceId = savedInvoice?.id;

      if (invoiceId) {
        router.push(`/admin/invoices/${invoiceId}`);
      } else {
        router.push("/admin/invoices");
      }

      router.refresh();
    } catch (err: any) {
      console.error("Invoice save error:", err);

      setError(
        err?.message || "Something went wrong while saving the invoice.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ================================
   * RENDER
   * ================================
   */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to save invoice</p>

            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ================================
          INVOICE INFORMATION
      ================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Invoice Information
              </h2>

              <p className="text-sm text-slate-500">
                Select the client and invoice details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* CLIENT */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Client
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select a client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}

                    {client.companyName ? ` — ${client.companyName}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DUE DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Due Date
            </label>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================
          ITEMS
      ================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Items
            </h2>

            <p className="text-sm text-slate-500">
              Add products, services, or custom items.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-700">
                      {index + 1}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      Item {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-12">
                  {/* TYPE */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </label>

                    <select
                      value={item.type}
                      onChange={(e) =>
                        changeItemType(
                          item.id,
                          e.target.value as InvoiceItem["type"],
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 text-slate-600 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="PRODUCT">Product</option>

                      <option value="SERVICE">Service</option>

                      <option value="CUSTOM">Custom</option>
                    </select>
                  </div>

                  {/* PRODUCT */}

                  {item.type === "PRODUCT" && (
                    <div className="md:col-span-4">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </label>

                      <div className="relative">
                        <Package className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                          value={item.productId || ""}
                          onChange={(e) =>
                            selectProduct(item.id, e.target.value)
                          }
                          className="w-full rounded-xl text-slate-600 border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select product</option>

                          {products
                            .filter((product) => product.active !== false)
                            .map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}

                                {product.sku ? ` (${product.sku})` : ""}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SERVICE */}

                  {item.type === "SERVICE" && (
                    <div className="md:col-span-4">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Service
                      </label>

                      <div className="relative">
                        <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                          value={item.serviceId || ""}
                          onChange={(e) =>
                            selectService(item.id, e.target.value)
                          }
                          className="w-full rounded-xl text-slate-600 border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select service</option>

                          {services
                            .filter((service) => service.active !== false)
                            .map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  <div
                    className={
                      item.type === "CUSTOM" ? "md:col-span-5" : "md:col-span-3"
                    }
                  >
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </label>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Item description"
                      className="w-full rounded-xl border text-slate-600 border-slate-300 text-slate-600 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* QUANTITY */}

                  <div className="md:col-span-1">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Qty
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: toNumber(e.target.value),
                        })
                      }
                      className="w-full rounded-xl text-slate-500 border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* PRICE */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unit Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unitPrice: toNumber(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border text-slate-600 border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* TOTAL */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </label>

                    <div className="flex h-[46px] items-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Another Item
          </button>
        </div>
      </div>

      {/* ================================
          ADJUSTMENTS + SUMMARY
      ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Percent className="h-5 w-5 text-purple-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Adjustments
                </h2>

                <p className="text-sm text-slate-500">
                  Apply discounts and tax.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            {/* DISCOUNT */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Discount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(toNumber(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* TAX */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tax
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={(e) => setTax(toNumber(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Invoice Summary</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>

              <span className="font-medium text-white">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>Discount</span>

              <span className="font-medium text-white">
                - {formatCurrency(discount)}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>Tax</span>

              <span className="font-medium text-white">
                {formatCurrency(tax)}
              </span>
            </div>

            <div className="my-4 border-t border-slate-700" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-400">Total</p>

                <p className="mt-1 text-3xl font-bold">
                  {formatCurrency(total)}
                </p>
              </div>

              <div className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-slate-300">
                USD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================
          NOTES / TERMS
      ================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Additional Information
          </h2>

          <p className="text-sm text-slate-500">Add notes or payment terms.</p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add a note for the client..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Terms & Conditions
            </label>

            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={5}
              placeholder="Payment terms and conditions..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* ================================
          ACTIONS
      ================================= */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/invoices")}
          disabled={saving}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ?
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          : <>
              <Save className="h-4 w-4" />
              {isEditing ? "Update Invoice" : "Create Invoice"}
            </>
          }
        </button>
      </div>
    </form>
  );
}
