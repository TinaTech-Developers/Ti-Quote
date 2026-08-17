"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Wrench,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CreateServicePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleActiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      active: e.target.checked,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name) {
      setError("Service name is required.");
      return;
    }

    if (!form.price || Number.isNaN(price) || price < 0) {
      setError("Please enter a valid service price.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          description: description || null,
          price,
          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create service.");
      }

      router.push(`/admin/services/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("CREATE SERVICE ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to create service.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start gap-4">
        <Link
          href="/admin/services"
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
            <Wrench size={22} className="text-[#0097A7]" />

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Create Service
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Add a service to your catalogue for use on quotations and invoices.
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

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
            <p className="font-semibold">Unable to create service</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* =================================================
              SERVICE INFORMATION
          ================================================= */}

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
              <h2 className="text-lg font-semibold text-slate-800">
                Service Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic information for this service.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* SERVICE NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Service Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Web Hosting"
                  required
                  autoFocus
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
                    placeholder:text-slate-400
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                />

                <p className="mt-2 text-xs text-slate-400">
                  Use a clear name that will be easy to identify on quotations
                  and invoices.
                </p>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Describe what this service includes..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-50
                  "
                />

                <p className="mt-2 text-xs text-slate-400">
                  This description can be displayed when the service is added to
                  a quotation or invoice.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                PRICING
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
                  Pricing
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set the standard selling price.
                </p>
              </div>

              <div className="p-6">
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Service Price
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-medium
                      text-slate-400
                    "
                  >
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      pl-9
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  This is the default price used when selecting the service.
                </p>
              </div>
            </div>

            {/* =================================================
                STATUS
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
                  Service Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Control whether this service can be used.
                </p>
              </div>

              <div className="p-6">
                <label
                  className="
                    flex
                    cursor-pointer
                    items-start
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    transition
                    hover:bg-slate-50
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        mt-0.5
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${form.active ? "bg-emerald-50" : "bg-slate-100"}
                      `}
                    >
                      <CheckCircle2
                        size={18}
                        className={
                          form.active ? "text-emerald-600" : "text-slate-400"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Active Service
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Active services can be selected when creating quotations
                        and invoices.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={handleActiveChange}
                    className="
                      mt-1
                      h-5
                      w-5
                      shrink-0
                      cursor-pointer
                      accent-[#0097A7]
                    "
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          className="
            mt-6
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
            href="/admin/services"
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
                Creating Service...
              </>
            : <>
                <Save size={18} />
                Create Service
              </>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
