import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/super-admin/services"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <h1 className="text-3xl font-bold text-slate-800">{service.name}</h1>

          <p className="mt-1 text-slate-500">Service Details</p>
        </div>

        <Link
          href={`/super-admin/services/${service.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit Service
        </Link>
      </div>

      {/* Details Card */}

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="grid gap-6 p-8 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-slate-500">Service Name</p>

            <p className="font-semibold text-slate-800">{service.name}</p>
          </div>

          <div>
            <p className="mb-1 text-sm text-slate-500">Price</p>

            <p className="text-lg font-bold text-green-600">
              $
              {Number(service.price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-slate-500">Status</p>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                service.active ?
                  "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
            >
              {service.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <p className="mb-1 text-sm text-slate-500">Created</p>

            <p className="text-slate-800">
              {new Date(service.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-slate-500">Last Updated</p>

            <p className="text-slate-800">
              {new Date(service.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="mb-2 text-sm text-slate-500">Description</p>

            <div className="rounded-lg border bg-slate-50 p-4 text-slate-700">
              {service.description?.trim() || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
