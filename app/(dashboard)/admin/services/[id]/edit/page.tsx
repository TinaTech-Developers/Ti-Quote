"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  price: number | string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    active: true,
  });

  // =====================================================
  // LOAD SERVICE
  // =====================================================

  useEffect(() => {
    if (!serviceId) return;

    loadService();
  }, [serviceId]);

  async function loadService() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load service.");
      }

      const loadedService: Service = data;

      setService(loadedService);

      setForm({
        name: loadedService.name || "",
        description: loadedService.description || "",
        price: String(loadedService.price ?? ""),
        active: loadedService.active ?? true,
      });
    } catch (error) {
      console.error("Load service error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load service.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // =====================================================
  // HANDLE ACTIVE
  // =====================================================

  function handleActiveChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      active: e.target.checked,
    }));

    setError("");
    setSuccess("");
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!form.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid service price.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name: form.name.trim(),

          description: form.description.trim() || null,

          price: Number(form.price),

          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service.");
      }

      setService(data);

      setSuccess("Service updated successfully.");

      // Give the user a moment to see the success message
      setTimeout(() => {
        router.push(`/admin/services/${serviceId}`);
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("Update service error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to update service.",
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

          <p className="text-sm text-slate-500">Loading service...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // SERVICE NOT FOUND
  // =====================================================

  if (!service) {
    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex items-center gap-4">
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
              <BriefcaseBusiness size={22} className="text-[#0097A7]" />

              <h1 className="text-2xl font-bold text-slate-800">
                Edit Service
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Update your service information and pricing.
            </p>
          </div>
        </div>

        {/* ERROR */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Service could not be loaded</p>

              <p className="mt-1 text-sm">{error || "Service not found."}</p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/services"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            bg-[#0B3954]
            px-5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#092C42]
          "
        >
          Back to Services
        </Link>
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={`/admin/services/${serviceId}`}
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
              <BriefcaseBusiness size={22} className="text-[#0097A7]" />

              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Edit Service
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Update service information, pricing and status.
            </p>
          </div>
        </div>

        {/* STATUS */}

        <div
          className={`
            inline-flex
            items-center
            gap-2
            self-start
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            ${
              form.active ?
                "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
            }
          `}
        >
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${form.active ? "bg-emerald-500" : "bg-slate-400"}
            `}
          />

          {form.active ? "Active" : "Inactive"}
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
            <p className="font-semibold">Unable to update service</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            text-emerald-700
          "
        >
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">{success}</p>

            <p className="mt-1">Redirecting to the service...</p>
          </div>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

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
                Update the basic information for this service.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* SERVICE NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
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
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Enter a description of this service..."
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
                  This description can be displayed on quotations and invoices.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
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
                  Set the current selling price.
                </p>
              </div>

              <div className="p-6">
                <label
                  htmlFor="price"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
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
                      font-semibold
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
                      font-medium
                      text-slate-800
                      outline-none
                      transition
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-50
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Enter the standard price charged for this service.
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
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Active service
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Active services can be selected when creating quotations
                      and invoices.
                    </p>
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

            {/* =================================================
                SERVICE DETAILS
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
                  Service Details
                </h2>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Service ID
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {service.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(service.updatedAt).toLocaleDateString()}
                  </p>
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
            href={`/admin/services/${serviceId}`}
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
      </form>
    </div>
  );
}
