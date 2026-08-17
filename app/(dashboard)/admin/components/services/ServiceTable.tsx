"use client";

import Link from "next/link";
import { Eye, Pencil, Search, Wrench, DollarSign } from "lucide-react";
import DeleteServiceButton from "./DeleteServiceButton";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  active: boolean;
  createdAt: string;
}

interface ServiceTableProps {
  services: Service[];
}

export default function ServiceTable({ services }: ServiceTableProps) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
          <Wrench className="h-8 w-8 text-[#0097A7]" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          No Services Found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create your first service to start adding it to quotations and
          invoices.
        </p>

        <Link
          href="/admin/services/create"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0B3954] px-5 text-sm font-semibold text-white hover:bg-[#092C42]"
        >
          Create Service
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Service
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Created
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                      <Wrench size={18} className="text-[#0097A7]" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {service.name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="max-w-xs px-6 py-4">
                  <p className="truncate text-sm text-slate-600">
                    {service.description || "-"}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <DollarSign size={14} />
                    {Number(service.price).toFixed(2)}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      service.active ?
                        "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
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
                      href={`/admin/services/${service.id}`}
                      className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                    </Link>

                    <DeleteServiceButton
                      serviceId={service.id}
                      serviceName={service.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
