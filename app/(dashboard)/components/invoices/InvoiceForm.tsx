"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  clients: Client[];

  products: Product[];

  services: Service[];

  invoice?: any;
}

interface InvoiceItem {
  type: "PRODUCT" | "SERVICE";

  productId: string;

  serviceId: string;

  description: string;

  quantity: number;

  unitPrice: number;
}

interface Product {
  id: string;

  name: string;

  description: string;

  price: number;

  stockQuantity: number;

  lowStockAlert: number;

  trackStock: boolean;

  active: boolean;
}

interface Service {
  id: string;

  name: string;

  description: string;

  price: number;

  active: boolean;
}

interface Client {
  id: string;

  name: string;
}

export default function InvoiceForm({
  clients,
  products,
  services,
  invoice,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<{
    clientId: string;
    discount: number;
    tax: number;
    notes: string;
    terms: string;
    items: InvoiceItem[];
  }>({
    clientId: invoice?.clientId || "",

    discount: Number(invoice?.discount || 0),

    tax: Number(invoice?.tax || 0),

    notes: invoice?.notes || "",

    terms: invoice?.terms || "",

    items:
      invoice?.items?.length ?
        invoice.items.map((item: any) => ({
          type: item.productId ? "PRODUCT" : "SERVICE",

          productId: item.productId ?? "",

          serviceId: item.serviceId ?? "",

          description:
            item.product?.name || item.service?.name || item.description || "",

          quantity: Number(item.quantity),

          unitPrice: Number(item.unitPrice),
        }))
      : [
          {
            type: "PRODUCT",
            productId: "",
            serviceId: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
          },
        ],
  });

  function addItem() {
    setForm({
      ...form,

      items: [
        ...form.items,

        {
          type: "PRODUCT",

          productId: "",

          serviceId: "",

          description: "",

          quantity: 1,

          unitPrice: 0,
        },
      ],
    });
  }

  function removeItem(index: number) {
    const items = [...form.items];

    items.splice(index, 1);

    setForm({
      ...form,

      items,
    });
  }

  function updateItem(index: number, field: string, value: any) {
    const items = [...form.items];

    items[index] = {
      ...items[index],

      [field]: value,
    };

    setForm({
      ...form,

      items,
    });
  }

  const subtotal = form.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),

    0,
  );

  const total = subtotal - Number(form.discount) + Number(form.tax);

  async function submit() {
    try {
      setLoading(true);

      const payload = {
        ...form,

        subtotal,

        total,

        items: form.items.map((item) => ({
          ...item,

          total: Number(item.quantity) * Number(item.unitPrice),
        })),
      };

      const url = invoice ? `/api/invoices/${invoice.id}` : "/api/invoices";

      const method = invoice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed saving invoice");

        return;
      }

      router.push(`/super-admin/invoices/${data.id || invoice.id}`);
    } catch (error) {
      console.log(error);

      alert("Failed saving invoice");
    } finally {
      setLoading(false);
    }
  }

  console.log("PRODUCTS", products);
  console.log("SERVICES", services);
  console.log("ITEMS", form.items);

  return (
    <div className="space-y-6">
      {/* CLIENT */}

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-5 text-slate-600">
          Invoice Details
        </h2>

        <label className="text-sm text-slate-600">Client</label>

        <select
          className="w-full border rounded-lg p-3 mt-2 text-slate-500"
          value={form.clientId}
          onChange={(e) =>
            setForm({
              ...form,

              clientId: e.target.value,
            })
          }
        >
          <option value="">Select client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* ITEMS */}

      <div className="bg-white border rounded-xl p-6">
        <div className="flex justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-600">Items</h2>

          <button
            onClick={addItem}
            className="
flex items-center gap-2
bg-blue-600
text-white
px-3 py-2
rounded-lg
text-sm
"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {form.items.map((item, index) => (
          <div
            key={index}
            className="
grid grid-cols-12 gap-3 mb-4
"
          >
            <select
              className="
border rounded-lg p-2 col-span-2 text-slate-500
"
              value={item.type}
              onChange={(e) => {
                const type = e.target.value as "PRODUCT" | "SERVICE";

                const items = [...form.items];

                items[index] = {
                  ...items[index],

                  type,

                  productId: "",
                  serviceId: "",
                  description: "",
                  unitPrice: 0,
                };

                setForm({
                  ...form,
                  items,
                });
              }}
            >
              <option value="PRODUCT">Product</option>

              <option value="SERVICE">Service</option>
            </select>

            <select
              className="
  border rounded-lg p-2 col-span-3 text-slate-500
  "
              value={item.type === "PRODUCT" ? item.productId : item.serviceId}
              onChange={(e) => {
                const id = e.target.value;

                const items = [...form.items];

                if (item.type === "PRODUCT") {
                  const product = products.find((p) => p.id === id);

                  items[index] = {
                    ...items[index],

                    productId: id,

                    serviceId: "",

                    description: product?.name ?? "",

                    unitPrice: Number(product?.price ?? 0),
                  };
                } else {
                  const service = services.find((s) => s.id === id);

                  items[index] = {
                    ...items[index],

                    serviceId: id,

                    productId: "",

                    description: service?.name ?? "",

                    unitPrice: Number(service?.price ?? 0),
                  };
                }

                setForm({
                  ...form,
                  items,
                });
              }}
            >
              <option value="">Select {item.type.toLowerCase()}</option>

              {item.type === "PRODUCT" &&
                products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}

              {item.type === "SERVICE" &&
                services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
            </select>
            <input
              type="number"
              className="
border rounded-lg p-2 col-span-2 text-slate-500
"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,

                  "quantity",

                  Number(e.target.value),
                )
              }
            />

            <input
              type="number"
              className="
border rounded-lg p-2 col-span-2 text-slate-500
"
              value={item.unitPrice}
              onChange={(e) =>
                updateItem(
                  index,

                  "unitPrice",

                  Number(e.target.value),
                )
              }
            />

            <div
              className="
col-span-2
flex items-center
font-semibold text-slate-500
"
            >
              {(item.quantity * item.unitPrice).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="
text-red-600
"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* TOTALS */}

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4 text-slate-600">Totals</h2>

        <p className="text-slate-600">
          Subtotal:
          <b>{subtotal.toFixed(2)}</b>
        </p>

        <input
          type="number"
          className="
border rounded-lg p-2 w-full mt-3 text-slate-500
"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) =>
            setForm({
              ...form,

              discount: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          className="
border rounded-lg p-2 w-full mt-3 text-slate-600
"
          placeholder="Tax"
          value={form.tax}
          onChange={(e) =>
            setForm({
              ...form,

              tax: Number(e.target.value),
            })
          }
        />

        <div
          className="
text-xl font-bold mt-4 text-slate-600
"
        >
          Total:
          {total.toFixed(2)}
        </div>
      </div>

      {/* NOTES */}

      <div className="bg-white border rounded-xl p-6">
        <textarea
          className="
border rounded-lg w-full p-3 text-slate-500
"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,

              notes: e.target.value,
            })
          }
        />
      </div>

      <button
        disabled={loading}
        onClick={submit}
        className="
bg-green-600
text-white
px-6 py-3
rounded-lg
font-semibold
"
      >
        {loading ?
          "Saving..."
        : invoice ?
          "Update Invoice"
        : "Create Invoice"}
      </button>
    </div>
  );
}
