"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  FileText,
  Package,
  BriefcaseBusiness,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type QuoteStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CONVERTED";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
}

interface Product {
  id: string;
  name: string;
  sku?: string | null;
  unit?: string | null;
  price: number | string;
  active?: boolean;
}

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  active?: boolean;
}

interface QuotationItem {
  id?: string;

  productId?: string | null;
  serviceId?: string | null;

  product?: Product | null;
  service?: Service | null;

  description: string;

  quantity: number | string;
  unitPrice: number | string;
  total: number | string;
}

interface Quotation {
  id: string;
  quotationNumber: string;

  companyId: string;

  clientId: string;
  client?: Client | null;

  status: QuoteStatus;

  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;

  notes?: string | null;
  validUntil?: string | null;

  items: QuotationItem[];

  createdAt: string;
  updatedAt: string;
}

interface FormItem {
  id?: string;

  type: "PRODUCT" | "SERVICE";

  productId: string;
  serviceId: string;

  description: string;

  quantity: string;
  unitPrice: string;
}

// =====================================================
// HELPERS
// =====================================================

function numberValue(value: number | string | null | undefined) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateForInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

// =====================================================
// PAGE
// =====================================================

export default function EditQuotationPage() {
  const router = useRouter();
  const params = useParams();

  const quotationId = params.id as string;

  // =====================================================
  // DATA
  // =====================================================

  const [quotation, setQuotation] = useState<Quotation | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // =====================================================
  // FORM
  // =====================================================

  const [clientId, setClientId] = useState("");

  const [validUntil, setValidUntil] = useState("");

  const [discount, setDiscount] = useState("0");

  const [tax, setTax] = useState("0");

  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<FormItem[]>([]);

  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (!quotationId) return;

    loadData();
  }, [quotationId]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [
        quotationResponse,
        clientsResponse,
        productsResponse,
        servicesResponse,
      ] = await Promise.all([
        fetch(`/api/quotations/${quotationId}`, {
          credentials: "include",
          cache: "no-store",
        }),

        fetch("/api/clients", {
          credentials: "include",
          cache: "no-store",
        }),

        fetch("/api/products", {
          credentials: "include",
          cache: "no-store",
        }),

        fetch("/api/services", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const quotationData = await quotationResponse.json();
      const clientsData = await clientsResponse.json();
      const productsData = await productsResponse.json();
      const servicesData = await servicesResponse.json();

      if (!quotationResponse.ok) {
        throw new Error(quotationData.message || "Failed to load quotation.");
      }

      if (!clientsResponse.ok) {
        throw new Error(clientsData.message || "Failed to load clients.");
      }

      if (!productsResponse.ok) {
        throw new Error(productsData.message || "Failed to load products.");
      }

      if (!servicesResponse.ok) {
        throw new Error(servicesData.message || "Failed to load services.");
      }

      const loadedQuotation: Quotation =
        quotationData.quotation || quotationData.data || quotationData;

      const loadedClients: Client[] =
        Array.isArray(clientsData) ? clientsData : (
          clientsData.clients || clientsData.data || []
        );

      const loadedProducts: Product[] =
        Array.isArray(productsData) ? productsData : (
          productsData.products || productsData.data || []
        );

      const loadedServices: Service[] =
        Array.isArray(servicesData) ? servicesData : (
          servicesData.services || servicesData.data || []
        );

      setQuotation(loadedQuotation);

      setClients(loadedClients);
      setProducts(loadedProducts);
      setServices(loadedServices);

      setClientId(loadedQuotation.clientId);

      setValidUntil(formatDateForInput(loadedQuotation.validUntil));

      setDiscount(String(loadedQuotation.discount ?? 0));

      setTax(String(loadedQuotation.tax ?? 0));

      setNotes(loadedQuotation.notes || "");

      const loadedItems: FormItem[] = (loadedQuotation.items || []).map(
        (item) => {
          const isProduct = Boolean(item.productId);

          return {
            id: item.id,

            type: isProduct ? "PRODUCT" : "SERVICE",

            productId: item.productId || "",

            serviceId: item.serviceId || "",

            description:
              item.description ||
              item.product?.name ||
              item.service?.name ||
              "",

            quantity: String(item.quantity ?? 1),

            unitPrice: String(item.unitPrice ?? 0),
          };
        },
      );

      setItems(loadedItems);
    } catch (error) {
      console.error("Load quotation edit error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load quotation.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const quantity = numberValue(item.quantity);
      const unitPrice = numberValue(item.unitPrice);

      return sum + quantity * unitPrice;
    }, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return Math.max(0, numberValue(discount));
  }, [discount]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const taxAmount = useMemo(() => {
    return taxableAmount * (numberValue(tax) / 100);
  }, [taxableAmount, tax]);

  const total = taxableAmount + taxAmount;

  // =====================================================
  // ADD ITEM
  // =====================================================

  function addItem(type: "PRODUCT" | "SERVICE") {
    setItems((prev) => [
      ...prev,
      {
        type,

        productId: "",
        serviceId: "",

        description: "",

        quantity: "1",
        unitPrice: "0",
      },
    ]);
  }

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  // =====================================================
  // UPDATE ITEM
  // =====================================================

  function updateItem(index: number, field: keyof FormItem, value: string) {
    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  }

  // =====================================================
  // CHANGE ITEM TYPE
  // =====================================================

  function changeItemType(index: number, type: "PRODUCT" | "SERVICE") {
    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,

          type,

          productId: "",
          serviceId: "",

          description: "",
          unitPrice: "0",
        };
      }),
    );
  }

  // =====================================================
  // SELECT PRODUCT
  // =====================================================

  function handleProductChange(index: number, productId: string) {
    const product = products.find((item) => item.id === productId);

    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,

          type: "PRODUCT",

          productId,

          serviceId: "",

          description: product?.name || "",

          unitPrice: String(product?.price ?? 0),
        };
      }),
    );
  }

  // =====================================================
  // SELECT SERVICE
  // =====================================================

  function handleServiceChange(index: number, serviceId: string) {
    const service = services.find((item) => item.id === serviceId);

    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,

          type: "SERVICE",

          productId: "",

          serviceId,

          description: service?.name || "",

          unitPrice: String(service?.price ?? 0),
        };
      }),
    );
  }

  // =====================================================
  // SAVE
  // =====================================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!clientId) {
      setError("Please select a client.");

      return;
    }

    if (items.length === 0) {
      setError("Please add at least one quotation item.");

      return;
    }

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (item.type === "PRODUCT" && !item.productId) {
        setError(`Please select a product for item ${index + 1}.`);

        return;
      }

      if (item.type === "SERVICE" && !item.serviceId) {
        setError(`Please select a service for item ${index + 1}.`);

        return;
      }

      if (!item.description.trim()) {
        setError(`Description is required for item ${index + 1}.`);

        return;
      }

      if (numberValue(item.quantity) <= 0) {
        setError(`Quantity must be greater than 0 for item ${index + 1}.`);

        return;
      }

      if (numberValue(item.unitPrice) < 0) {
        setError(`Unit price cannot be negative for item ${index + 1}.`);

        return;
      }
    }

    if (discountAmount > subtotal) {
      setError("Discount cannot be greater than the subtotal.");

      return;
    }

    if (numberValue(tax) < 0) {
      setError("Tax cannot be negative.");

      return;
    }

    setSaving(true);

    try {
      const payload = {
        clientId,

        validUntil:
          validUntil ? new Date(`${validUntil}T23:59:59`).toISOString() : null,

        discount: discountAmount,

        tax: taxAmount,

        notes: notes.trim() || null,

        subtotal,

        total,

        items: items.map((item) => {
          const quantity = numberValue(item.quantity);

          const unitPrice = numberValue(item.unitPrice);

          return {
            id: item.id,

            productId: item.type === "PRODUCT" ? item.productId : null,

            serviceId: item.type === "SERVICE" ? item.serviceId : null,

            description: item.description.trim(),

            quantity,

            unitPrice,

            total: quantity * unitPrice,
          };
        }),
      };

      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quotation.");
      }

      router.push(`/admin/quotations/${quotationId}`);

      router.refresh();
    } catch (error) {
      console.error("Update quotation error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update quotation.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#0097A7]" />

          <p className="text-sm text-slate-500">Loading quotation...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!quotation) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/quotations"
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            font-semibold
            text-slate-600
            shadow-sm
            hover:bg-slate-50
          "
        >
          <ArrowLeft size={17} />
          Back to Quotations
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={20} />

            <div>
              <p className="font-semibold">Quotation could not be loaded</p>

              <p className="mt-1 text-sm">{error || "Quotation not found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ONLY DRAFTS CAN BE EDITED
  // =====================================================

  if (quotation.status !== "DRAFT") {
    return (
      <div className="space-y-6">
        <Link
          href={`/admin/quotations/${quotationId}`}
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            font-semibold
            text-slate-600
            shadow-sm
            hover:bg-slate-50
          "
        >
          <ArrowLeft size={17} />
          Back to Quotation
        </Link>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3 text-amber-700">
            <AlertCircle size={20} />

            <div>
              <p className="font-semibold">Quotation cannot be edited</p>

              <p className="mt-1 text-sm">
                Only draft quotations can be edited.
              </p>

              <p className="mt-2 text-sm font-medium">
                {quotation.quotationNumber} — {quotation.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-full space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={`/admin/quotations/${quotationId}`}
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
              <FileText size={22} className="text-[#0097A7]" />

              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Edit Quotation
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Update quotation {quotation.quotationNumber}
            </p>
          </div>
        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2
            self-start
            rounded-full
            bg-slate-100
            px-3
            py-1.5
            text-xs
            font-semibold
            text-slate-600
          "
        >
          <span className="h-2 w-2 rounded-full bg-slate-400" />
          Draft
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

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
            <p className="font-semibold">Unable to update quotation</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

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
                Quotation Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the customer and quotation validity.
              </p>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* QUOTATION NUMBER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quotation Number
                </label>

                <input
                  value={quotation.quotationNumber}
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                />
              </div>

              {/* CLIENT */}

              <div>
                <label
                  htmlFor="clientId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Client
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
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
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                >
                  <option value="">Select client</option>

                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName ?
                        `${client.companyName} — ${client.name}`
                      : client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* VALID UNTIL */}

              <div>
                <label
                  htmlFor="validUntil"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Valid Until
                </label>

                <input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
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
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ITEMS
          ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Quotation Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add products and services to this quotation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addItem("PRODUCT")}
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  <Package size={16} />
                  Add Product
                </button>

                <button
                  type="button"
                  onClick={() => addItem("SERVICE")}
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0B3954]
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#092C42]
                  "
                >
                  <BriefcaseBusiness size={16} />
                  Add Service
                </button>
              </div>
            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Item
                    </th>

                    <th className="w-28 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Qty
                    </th>

                    <th className="w-40 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Unit Price
                    </th>

                    <th className="w-36 px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total
                    </th>

                    <th className="w-14 px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ?
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <FileText size={25} />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-700">
                          No quotation items
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Add a product or service above.
                        </p>
                      </td>
                    </tr>
                  : items.map((item, index) => {
                      const lineTotal =
                        numberValue(item.quantity) *
                        numberValue(item.unitPrice);

                      return (
                        <tr key={item.id || index}>
                          {/* TYPE */}

                          <td className="px-5 py-4 align-top">
                            <select
                              value={item.type}
                              onChange={(e) =>
                                changeItemType(
                                  index,
                                  e.target.value as "PRODUCT" | "SERVICE",
                                )
                              }
                              className="
                                h-10
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                text-xs
                                font-medium
                                outline-none
                                focus:border-[#0097A7]
                                text-slate-800
                              "
                            >
                              <option value="PRODUCT">Product</option>

                              <option value="SERVICE">Service</option>
                            </select>
                          </td>

                          {/* ITEM */}

                          <td className="px-5 py-4 align-top">
                            {item.type === "PRODUCT" ?
                              <select
                                value={item.productId}
                                onChange={(e) =>
                                  handleProductChange(index, e.target.value)
                                }
                                className="
                                  h-10
                                  w-full
                                  min-w-[220px]
                                  rounded-lg
                                  border
                                  border-slate-300
                                  bg-white
                                  px-3
                                  text-sm
                                  outline-none
                                  focus:border-[#0097A7]
                                  text-slate-800
                                "
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
                            : <select
                                value={item.serviceId}
                                onChange={(e) =>
                                  handleServiceChange(index, e.target.value)
                                }
                                className="
                                  h-10
                                  w-full
                                  min-w-[220px]
                                  rounded-lg
                                  border
                                  border-slate-300
                                  bg-white
                                  px-3
                                  text-sm
                                  outline-none
                                  focus:border-[#0097A7]
                                  text-slate-800
                                "
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
                            }

                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(index, "description", e.target.value)
                              }
                              placeholder="Description"
                              className="
                                mt-2
                                h-10
                                w-full
                                min-w-[220px]
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                text-sm
                                outline-none
                                focus:border-[#0097A7]
                                text-slate-800
                              "
                            />
                          </td>

                          {/* QUANTITY */}

                          <td className="px-5 py-4 align-top">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(index, "quantity", e.target.value)
                              }
                              className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                text-sm
                                outline-none
                                focus:border-[#0097A7]
                                text-slate-800
                              "
                            />
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4 align-top">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                $
                              </span>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateItem(index, "unitPrice", e.target.value)
                                }
                                className="
                                  h-10
                                  w-full
                                  rounded-lg
                                  border
                                  border-slate-300
                                  pl-7
                                  pr-3
                                  text-sm
                                  outline-none
                                  focus:border-[#0097A7]
                                  text-slate-800
                                "
                              />
                            </div>
                          </td>

                          {/* TOTAL */}

                          <td className="px-5 py-4 text-right align-top">
                            <p className="pt-2 text-sm font-bold text-slate-800">
                              {formatMoney(lineTotal)}
                            </p>
                          </td>

                          {/* REMOVE */}

                          <td className="px-5 py-4 align-top">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-red-50
                                hover:text-red-600
                              "
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>

            {/* MOBILE */}

            <div className="divide-y divide-slate-100 lg:hidden">
              {items.length === 0 ?
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FileText size={25} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    No quotation items
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a product or service above.
                  </p>
                </div>
              : items.map((item, index) => {
                  const lineTotal =
                    numberValue(item.quantity) * numberValue(item.unitPrice);

                  return (
                    <div key={item.id || index} className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <select
                          value={item.type}
                          onChange={(e) =>
                            changeItemType(
                              index,
                              e.target.value as "PRODUCT" | "SERVICE",
                            )
                          }
                          className="
                            h-10
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-xs
                            font-medium
                            text-slate-800
                          "
                        >
                          <option value="PRODUCT">Product</option>

                          <option value="SERVICE">Service</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            hover:bg-red-50
                            hover:text-red-600
                          "
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      {item.type === "PRODUCT" ?
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-sm
                          "
                        >
                          <option value="">Select product</option>

                          {products
                            .filter((product) => product.active !== false)
                            .map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                        </select>
                      : <select
                          value={item.serviceId}
                          onChange={(e) =>
                            handleServiceChange(index, e.target.value)
                          }
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-3
                            text-sm
                            text-slate-800
                          "
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
                      }

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-500">
                          Description
                        </label>

                        <input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            px-3
                            text-sm
                            text-slate-800
                          "
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-500">
                            Quantity
                          </label>

                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-slate-300
                              px-3
                              text-sm
                              text-slate-800
                            "
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-500">
                            Unit Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(index, "unitPrice", e.target.value)
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-slate-300
                              px-3
                              text-sm
                              text-slate-800
                            "
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                        <span className="text-xs font-medium text-slate-500">
                          Item Total
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                          {formatMoney(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* NOTES */}

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
                <h2 className="text-lg font-semibold text-slate-800">Notes</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add any additional information for the quotation.
                </p>
              </div>

              <div className="p-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={7}
                  placeholder="Enter quotation notes..."
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
                    text-slate-800
                  "
                />
              </div>
            </div>

            {/* TOTALS */}

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
                  Summary
                </h2>
              </div>

              <div className="space-y-5 p-6">
                {/* SUBTOTAL */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Subtotal</span>

                  <span className="text-sm font-semibold text-slate-700">
                    {formatMoney(subtotal)}
                  </span>
                </div>

                {/* DISCOUNT */}

                <div>
                  <label
                    htmlFor="discount"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Discount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>

                    <input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        pl-8
                        pr-4
                        text-sm
                        outline-none
                        focus:border-[#0097A7]
                        focus:ring-4
                        focus:ring-cyan-50
                        text-slate-800
                      "
                    />
                  </div>
                </div>

                {/* TAX */}

                <div>
                  <label
                    htmlFor="tax"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Tax Rate
                  </label>

                  <div className="relative">
                    <input
                      id="tax"
                      type="number"
                      min="0"
                      step="0.01"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        px-4
                        pr-10
                        text-sm
                        outline-none
                        focus:border-[#0097A7]
                        focus:ring-4
                        focus:ring-cyan-50
                        text-slate-800
                      "
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Tax amount: {formatMoney(taxAmount)}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-bold text-[#0B3954]">
                        {formatMoney(total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="
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
              href={`/admin/quotations/${quotationId}`}
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
        </div>
      </form>
    </div>
  );
}
