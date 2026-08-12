"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ServiceFormProps {
  initialData?: {
    id?: string;
    name: string;
    description?: string | null;
    price: string | number;
    active: boolean;
  };
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();

  const editing = Boolean(initialData?.id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    active: initialData?.active ?? true,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      active: e.target.checked,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        editing ? `/api/services/${initialData?.id}` : "/api/services",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/super-admin/services");
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
      className="space-y-6 rounded-xl border bg-white p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Service Name *
          </label>

          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-600 text-slate-500"
          />
        </div>

        {/* Price */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price *
          </label>

          <input
            required
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-600 text-slate-500"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-600 text-slate-500"
          />
        </div>

        {/* Active */}

        <div className="flex items-center gap-3">
          <input
            id="active"
            type="checkbox"
            checked={form.active}
            onChange={handleCheckbox}
            className="h-4 w-4"
          />

          <label
            htmlFor="active"
            className="text-sm font-medium text-slate-700"
          >
            Active Service
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
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
            "Update Service"
          : "Create Service"}
        </button>
      </div>
    </form>
  );
}
