"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  BriefcaseBusiness,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  XCircle,
  FileText,
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

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    loadService();
  }, [serviceId]);

  async function loadService() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load service.");
      }

      setService(data);
    } catch (error) {
      console.error("Load service error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load service.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!service) return;

    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${service.name}"?\n\nThe service will no longer be available for new quotations or invoices.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to deactivate service.");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Delete service error:", error);

      setError(
        error instanceof Error ?
          error.message
        : "Failed to deactivate service.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatDateTime(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(price: number | string) {
    return Number(price || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
  // NOT FOUND / ERROR
  // =====================================================

  if (!service) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="
              flex
              h-11
              w-11
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
            "
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Service Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View service information.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Service could not be loaded</p>

              <p className="mt-1 text-sm">{error || "Service not found."}</p>
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
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-50
                  text-[#0097A7]
                "
              >
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  {service.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Service details and information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/services/${service.id}/edit`}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              px-5
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
            "
          >
            <Edit size={17} />
            Edit Service
          </Link>

          {service.active && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-white
                px-5
                text-sm
                font-semibold
                text-red-600
                shadow-sm
                transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {deleting ?
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Deactivating...
                </>
              : <>
                  <Trash2 size={17} />
                  Deactivate
                </>
              }
            </button>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

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
            <p className="font-semibold">Something went wrong</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* STATUS */}
      {/* ================================================= */}

      <div
        className={`
          flex
          items-center
          justify-between
          gap-4
          rounded-2xl
          border
          p-5
          shadow-sm
          ${
            service.active ?
              "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
          }
        `}
      >
        <div className="flex items-center gap-3">
          {service.active ?
            <CheckCircle2 size={22} className="text-emerald-600" />
          : <XCircle size={22} className="text-slate-500" />}

          <div>
            <p
              className={`
                text-sm
                font-semibold
                ${service.active ? "text-emerald-800" : "text-slate-700"}
              `}
            >
              {service.active ? "Service is Active" : "Service is Inactive"}
            </p>

            <p
              className={`
                mt-1
                text-xs
                ${service.active ? "text-emerald-700" : "text-slate-500"}
              `}
            >
              {service.active ?
                "This service can be used on quotations and invoices."
              : "This service is no longer available for new transactions."}
            </p>
          </div>
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            ${
              service.active ?
                "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
            }
          `}
        >
          {service.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ================================================= */}
        {/* SERVICE INFORMATION */}
        {/* ================================================= */}

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
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-50
                  text-[#0097A7]
                "
              >
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Service Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information about this service.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* NAME */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Service Name
                </p>

                <p className="mt-2 text-base font-semibold text-slate-800">
                  {service.name}
                </p>
              </div>

              {/* PRICE */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Service Price
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <DollarSign size={18} className="text-[#0097A7]" />

                  <p className="text-xl font-bold text-slate-800">
                    ${formatPrice(service.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>

              <div
                className="
                  mt-3
                  min-h-[130px]
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                "
              >
                {service.description ?
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>
                : <p className="text-sm italic text-slate-400">
                    No description has been added.
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PRICE CARD */}
        {/* ================================================= */}

        <div className="space-y-6">
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
            <div className="bg-[#0B3954] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Current Price
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    ${formatPrice(service.price)}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                  "
                >
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${
                      service.active ?
                        "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {service.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* QUICK ACTIONS */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="font-semibold text-slate-800">Quick Actions</h3>
            </div>

            <div className="space-y-2 p-4">
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  p-3
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <Edit size={18} className="text-[#0097A7]" />
                Edit service
              </Link>

              <Link
                href="/admin/quotations/create"
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  p-3
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <FileText size={18} className="text-[#0097A7]" />
                Create quotation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* RECORD INFORMATION */}
      {/* ================================================= */}

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
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-600
              "
            >
              <CalendarDays size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Record Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Service creation and update information.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {formatDate(service.createdAt)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {formatDateTime(service.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Last Updated
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {formatDate(service.updatedAt)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {formatDateTime(service.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
