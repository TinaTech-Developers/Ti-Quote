"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search } from "lucide-react";

import DeleteServiceButton from "./DeleteServiceButton";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  active: boolean;
  createdAt: string;
}

interface Props {
  services: Service[];
}

export default function ServiceTable({ services }: Props) {
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const query = search.toLowerCase();

      return (
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    });
  }, [services, search]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services</h1>

          <p className="text-sm text-slate-500">
            Manage all services offered by your company.
          </p>
        </div>

        <Link
          href="/super-admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Link>
      </div>

      {/* Search */}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm font-semibold text-slate-700">
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.length === 0 ?
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No services found.
                  </td>
                </tr>
              : filteredServices.map((service) => (
                  <tr key={service.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {service.name}
                    </td>

                    <td className="max-w-sm truncate px-6 py-4 text-slate-600">
                      {service.description || "-"}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      $
                      {Number(service.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          service.active ?
                            "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/super-admin/services/${service.id}`}
                          className="rounded-lg border p-2 hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/super-admin/services/${service.id}/edit`}
                          className="rounded-lg border p-2 hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <DeleteServiceButton id={service.id} />
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
