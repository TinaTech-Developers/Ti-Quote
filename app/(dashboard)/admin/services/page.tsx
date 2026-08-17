"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import ServiceTable from "../components/services/ServiceTable";

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/services", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load services.");
      }

      /*
       * Your API currently returns:
       *
       * [
       *   {
       *     id,
       *     companyId,
       *     name,
       *     description,
       *     price,
       *     active,
       *     createdAt,
       *     updatedAt
       *   }
       * ]
       */

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD SERVICES ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load services.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    });
  }, [services, search]);

  const totalServices = services.length;

  const activeServices = services.filter((service) => service.active).length;

  const inactiveServices = services.filter((service) => !service.active).length;

  return (
    <div className="min-h-full space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-cyan-50
            "
          >
            <Wrench size={24} className="text-[#0097A7]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Services
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the services you offer and use them on quotations and
              invoices.
            </p>
          </div>
        </div>

        <Link
          href="/admin/services/create"
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#092C42]
          "
        >
          <Plus size={18} />
          Add Service
        </Link>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
          "
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                Unable to load services
              </p>

              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadServices}
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-red-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-red-700
              hover:bg-red-50
            "
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* TOTAL */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Services
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "—" : totalServices}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
              <Wrench size={21} className="text-[#0097A7]" />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            All services in your catalogue
          </p>
        </div>

        {/* ACTIVE */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Services
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "—" : activeServices}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 size={21} className="text-emerald-600" />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Available for quotations and invoices
          </p>
        </div>

        {/* INACTIVE */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:col-span-2
            xl:col-span-1
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive Services
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "—" : inactiveServices}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <XCircle size={21} className="text-slate-500" />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Services currently unavailable
          </p>
        </div>
      </div>

      {/* =====================================================
          SEARCH + TABLE
      ===================================================== */}

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
        {/* TOOLBAR */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-slate-100
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Service Catalogue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {search ?
                `${filteredServices.length} service${
                  filteredServices.length === 1 ? "" : "s"
                } found`
              : `${totalServices} service${totalServices === 1 ? "" : "s"}`}
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                pl-10
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
        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={34} className="animate-spin text-[#0097A7]" />

              <p className="text-sm text-slate-500">Loading services...</p>
            </div>
          </div>
        )}

        {/* EMPTY SEARCH RESULT */}

        {!loading &&
          !error &&
          services.length > 0 &&
          filteredServices.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search size={24} className="text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No matching services
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search term.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-[#0097A7]
                  hover:text-[#0B3954]
                "
              >
                Clear search
              </button>
            </div>
          )}

        {/* TABLE */}

        {!loading && !error && <ServiceTable services={filteredServices} />}
      </div>
    </div>
  );
}
