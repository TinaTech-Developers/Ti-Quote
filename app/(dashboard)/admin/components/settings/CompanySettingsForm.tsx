"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  taxNumber?: string | null;
  currency?: string | null;
}

interface Props {
  company: Company;
}

export default function CompanySettingsForm({ company }: Props) {
  const [form, setForm] = useState({
    name: company.name || "",
    email: company.email || "",
    phone: company.phone || "",
    address: company.address || "",
    website: company.website || "",
    logoUrl: company.logoUrl || "",
    taxNumber: company.taxNumber || "",
    currency: company.currency || "USD",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    if (!form.name.trim()) {
      setError("Company name is required.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/settings/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          website: form.website.trim() || null,
          logoUrl: form.logoUrl.trim() || null,
          taxNumber: form.taxNumber.trim() || null,
          currency: form.currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update company settings.");
      }

      setSuccess("Company settings updated successfully.");
    } catch (err) {
      console.error("Company settings error:", err);

      setError(
        err instanceof Error ?
          err.message
        : "Failed to update company settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ALERTS */}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">Unable to save settings</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* COMPANY INFORMATION */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Company Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information about your business.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* COMPANY NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Company Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                placeholder="Your company name"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* TAX NUMBER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tax Number
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={form.taxNumber}
                onChange={(e) => updateField("taxNumber", e.target.value)}
                placeholder="VAT / Tax number"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Contact Information
          </h2>

          <p className="text-sm text-slate-500">
            Contact details that will appear on invoices and quotations.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="company@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+263..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* WEBSITE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Website
            </label>

            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="url"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* CURRENCY */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Currency
            </label>

            <div className="relative">
              <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="ZWG">ZWG — Zimbabwe Gold</option>
                <option value="ZAR">ZAR — South African Rand</option>
                <option value="BWP">BWP — Botswana Pula</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Business Address
            </label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

              <textarea
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                rows={4}
                placeholder="Enter your business address"
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LOGO */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">Company Logo</h2>

          <p className="text-sm text-slate-500">
            Provide the URL of your company logo.
          </p>
        </div>

        <div className="p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Logo URL
          </label>

          <input
            type="url"
            value={form.logoUrl}
            onChange={(e) => updateField("logoUrl", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          {form.logoUrl && (
            <div className="mt-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.logoUrl}
                alt="Company logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </section>

      {/* SAVE */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ?
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          : <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          }
        </button>
      </div>
    </form>
  );
}
