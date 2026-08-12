"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import QuotationItemRow, {
  QuotationItem,
  Product,
  Service,
} from "./QuotationItemRow";

import QuotationTotals from "./QuotationTotals";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
}

interface QuotationFormProps {
  initialData?: {
    id: string;
    clientId: string;
    status: string;
    discount: number;
    tax: number;
    notes?: string | null;
    validUntil?: string | null;

    items: QuotationItem[];
  };
}

export default function QuotationForm({ initialData }: QuotationFormProps) {
  const router = useRouter();

  const editing = Boolean(initialData);

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [clientId, setClientId] = useState(initialData?.clientId || "");

  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  const [discount, setDiscount] = useState(initialData?.discount ?? 0);

  const [tax, setTax] = useState(initialData?.tax ?? 0);

  const [notes, setNotes] = useState(initialData?.notes || "");

  const [validUntil, setValidUntil] = useState(
    initialData?.validUntil ? initialData.validUntil.substring(0, 10) : "",
  );

  const [items, setItems] = useState<QuotationItem[]>(
    initialData?.items || [
      {
        id: crypto.randomUUID(),
        type: "PRODUCT",
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, productsRes, servicesRes] = await Promise.all([
          fetch("/api/clients"),
          fetch("/api/products"),
          fetch("/api/services"),
        ]);

        const clientsData = await clientsRes.json();
        const productsData = await productsRes.json();
        const servicesData = await servicesRes.json();

        setClients(clientsData);
        setProducts(productsData);
        setServices(servicesData);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  function updateItem(index: number, updated: QuotationItem) {
    const copy = [...items];

    copy[index] = updated;

    setItems(copy);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;

    setItems(items.filter((_, i) => i !== index));
  }

  function addItem() {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),

        type: "PRODUCT",

        description: "",

        quantity: 1,

        unitPrice: 0,
      },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId) {
      alert("Please select a client.");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one quotation item.");
      return;
    }

    for (const item of items) {
      if (!item.description.trim()) {
        alert("Every item must have a description.");
        return;
      }

      if (item.quantity <= 0) {
        alert("Quantity must be greater than zero.");
        return;
      }

      if (item.unitPrice < 0) {
        alert("Price cannot be negative.");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        clientId,
        status,
        discount,
        tax,
        notes,
        validUntil: validUntil || null,
        items,
      };

      const response = await fetch(
        editing ? `/api/quotations/${initialData?.id}` : "/api/quotations",
        {
          method: editing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save quotation.");
      }

      router.push("/super-admin/quotations");

      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-700">
          {editing ? "Edit Quotation" : "New Quotation"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a quotation for your client.
        </p>
      </div>

      {/* General Information */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-slate-600">
          General Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Client */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Client *
            </label>

            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-lg border p-3 text-slate-600"
            >
              <option value="">Select Client</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                  {client.companyName ? ` (${client.companyName})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border p-3 text-slate-600"
            >
              <option value="DRAFT">Draft</option>

              <option value="PENDING">Pending</option>

              <option value="APPROVED">Approved</option>
            </select>
          </div>

          {/* Valid Until */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Valid Until
            </label>

            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full rounded-lg border p-3 text-slate-600"
            />
          </div>

          {/* Notes */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border p-3 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Items */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700">
            Quotation Items
          </h3>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-slate-700">Type</th>

                <th className="p-3 text-left text-slate-700">Item</th>

                <th className="p-3 text-slate-700">Qty</th>

                <th className="p-3 text-slate-700">Price</th>

                <th className="p-3 text-slate-700">Total</th>

                <th className="p-3 text-slate-700"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <QuotationItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  products={products}
                  services={services}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <QuotationTotals
        items={items}
        discount={discount}
        tax={tax}
        onDiscountChange={setDiscount}
        onTaxChange={setTax}
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-6 py-2"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ?
            editing ?
              "Updating..."
            : "Creating..."
          : editing ?
            "Update Quotation"
          : "Create Quotation"}
        </button>
      </div>
    </form>
  );
}
