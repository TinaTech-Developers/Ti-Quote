"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, DollarSign } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  balance: number;
  client?: {
    name: string;
  };
}

interface Props {
  invoice: Invoice;
}

export default function PaymentForm({ invoice }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: invoice.balance,
    method: "CASH",
    reference: "",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (Number(form.amount) <= 0) {
      return alert("Enter a valid payment amount.");
    }

    if (Number(form.amount) > invoice.balance) {
      return alert("Payment cannot exceed the invoice balance.");
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/invoices/${invoice.id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          method: form.method,
          reference: form.reference,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to record payment.");
        return;
      }

      alert("Payment recorded successfully.");

      router.push(`/super-admin/invoices/${invoice.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6 mx-auto">
      {/* Invoice Summary */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-700">
          Invoice Information
        </h2>

        <div className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <p className="text-gray-500">Invoice</p>
            <p className="font-semibold text-gray-700">
              {invoice.invoiceNumber}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-semibold text-gray-700">
              {invoice.client?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Invoice Total</p>
            <p className="font-semibold text-gray-700">
              ${invoice.total.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Balance Due</p>
            <p className="text-xl font-bold text-red-600">
              ${invoice.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-xl border bg-white p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-700">
          Payment Details
        </h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <div className="relative ">
            <DollarSign
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="number"
              step="0.01"
              min="0"
              max={invoice.balance}
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border py-3 pl-10 pr-4 text-slate-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Payment Method
          </label>

          <select
            value={form.method}
            onChange={(e) =>
              setForm({
                ...form,
                method: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3 text-slate-500"
          >
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="ECOCASH">EcoCash</option>
            <option value="INNBUCKS">InnBucks</option>
            <option value="CARD">Card</option>
            <option value="CHEQUE">Cheque</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Reference Number
          </label>

          <input
            type="text"
            value={form.reference}
            onChange={(e) =>
              setForm({
                ...form,
                reference: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3 text-slate-500"
            placeholder="Bank reference / Receipt number"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Notes
          </label>

          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3 text-slate-500"
            placeholder="Optional payment notes..."
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-3"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <CreditCard size={18} />

          {loading ? "Recording..." : "Record Payment"}
        </button>
      </div>
    </form>
  );
}
