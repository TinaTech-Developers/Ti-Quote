"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";

interface ClientForm {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxNumber: string;
  active: boolean;
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();

  const clientId = params.id as string;

  const [form, setForm] = useState<ClientForm>({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    taxNumber: "",
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!clientId) return;

    async function loadClient() {
      try {
        setLoading(true);

        const response = await fetch(`/api/clients/${clientId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load client");
        }

        setForm({
          name: data.name ?? "",
          companyName: data.companyName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          taxNumber: data.taxNumber ?? "",
          active: data.active ?? true,
        });
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : "Failed to load client",
        );
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [clientId]);

  function updateField(field: keyof ClientForm, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Client name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          companyName: form.companyName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          taxNumber: form.taxNumber.trim(),
          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update client");
      }

      setSuccess("Client updated successfully.");

      setTimeout(() => {
        router.push(`/admin/clients/${clientId}`);
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to update client",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 size={38} className="animate-spin text-[#0097A7]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* HEADER */}

      <div>
        <Link
          href={`/admin/clients/${clientId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0097A7]"
        >
          <ArrowLeft size={17} />
          Back to Client
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-800">Edit Client</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the client's contact and business information.
          </p>
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFORMATION */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                <User size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">Basic Information</h2>

                <p className="text-sm text-slate-500">
                  Client identification details
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <InputField
              label="Client Name"
              required
              icon={User}
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Enter client name"
            />

            <InputField
              label="Company Name"
              icon={Building2}
              value={form.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="Enter company name"
            />

            <InputField
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(value) => updateField("email", value)}
              placeholder="client@example.com"
            />

            <InputField
              label="Phone"
              type="tel"
              icon={Phone}
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="+263 77 000 0000"
            />

            <InputField
              label="Tax Number"
              icon={Building2}
              value={form.taxNumber}
              onChange={(value) => updateField("taxNumber", value)}
              placeholder="Enter tax number"
            />
          </div>
        </div>

        {/* ADDRESS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#0097A7]">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Address Information
                </h2>

                <p className="text-sm text-slate-500">
                  Client location details
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Enter physical or postal address"
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0097A7] focus:ring-4 focus:ring-cyan-50"
              />
            </div>

            <InputField
              label="City"
              icon={MapPin}
              value={form.city}
              onChange={(value) => updateField("city", value)}
              placeholder="Enter city"
            />

            <InputField
              label="Country"
              icon={MapPin}
              value={form.country}
              onChange={(value) => updateField("country", value)}
              placeholder="Enter country"
            />
          </div>
        </div>

        {/* STATUS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-800">Client Status</h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether this client is active.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="font-medium text-slate-700">Active Client</p>

              <p className="mt-1 text-sm text-slate-500">
                Inactive clients can be retained for historical records but
                should not normally be used for new transactions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateField("active", !form.active)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                form.active ? "bg-[#0097A7]" : "bg-slate-300"
              }`}
              aria-label="Toggle client status"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                  form.active ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/admin/clients/${clientId}`}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0B3954] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#092C42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ?
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
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

/* =========================================
   INPUT FIELD
========================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon: any;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border text-slate-700 border-slate-300 pl-11 pr-4 text-sm outline-none transition focus:border-[#0097A7] focus:ring-4 focus:ring-cyan-50"
        />
      </div>
    </div>
  );
}
