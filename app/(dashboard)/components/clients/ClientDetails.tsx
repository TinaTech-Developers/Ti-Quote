"use client";

import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  FileText,
  Calendar,
  Pencil,
  ArrowLeft,
  User,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;

  _count: {
    quotations: number;
    invoices: number;
  };
}

interface Props {
  client: Client;
}

export default function ClientDetails({ client }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <User className="h-7 w-7 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>

            {client.companyName && (
              <p className="text-slate-500">{client.companyName}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/super-admin/clients"
            className="inline-flex items-center gap-2 rounded-lg border text-red-500 px-4 py-2 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <Link
            href={`/super-admin/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit Client
          </Link>
        </div>
      </div>

      {/* Information */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-600">
            Client Information
          </h2>

          <div className="space-y-5">
            <InfoRow
              icon={<User size={18} />}
              label="Client Name"
              value={client.name}
            />

            <InfoRow
              icon={<Building2 size={18} />}
              label="Company"
              value={client.companyName}
            />

            <InfoRow
              icon={<Mail size={18} />}
              label="Email"
              value={client.email}
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="Phone"
              value={client.phone}
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="City"
              value={client.city}
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="Address"
              value={client.address}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-600">
            Additional Information
          </h2>

          <div className="space-y-5">
            <InfoRow
              icon={<Calendar size={18} />}
              label="Created"
              value={new Date(client.createdAt).toLocaleDateString()}
            />

            <InfoRow
              icon={<Calendar size={18} />}
              label="Last Updated"
              value={new Date(client.updatedAt).toLocaleDateString()}
            />

            <div className="flex items-start gap-3">
              <FileText className="mt-1 text-slate-400" size={18} />

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Notes</p>

                <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {client.notes || "No notes available."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Future Stats */}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Quotations"
          value={client._count.quotations.toString()}
        />

        <StatCard title="Invoices" value={client._count.invoices.toString()} />
        <StatCard title="Total Sales" value="$0.00" />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-400">{icon}</div>

      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <p className="mt-1 text-slate-900">{value || "-"}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}
