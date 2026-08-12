"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClientFormProps {
  initialData?: {
    id?: string;
    name: string;
    companyName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    notes?: string | null;
  };
}

export default function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter();

  const editing = Boolean(initialData?.id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    companyName: initialData?.companyName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    notes: initialData?.notes || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        editing ? `/api/clients/${initialData?.id}` : "/api/clients",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/super-admin/clients");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Client Name *
          </label>

          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Name
          </label>

          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            City
          </label>

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            rows={5}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 text-slate-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2"
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
            "Update Client"
          : "Create Client"}
        </button>
      </div>
    </form>
  );
}
