import Link from "next/link";
import { Plus, Users } from "lucide-react";
import ClientTable from "../../components/clients/ClientTable";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Clients</span>
          </div>

          <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold text-slate-900">
            <Users className="h-8 w-8 text-blue-600" />
            Clients
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your customers and client information.
          </p>
        </div>

        <Link
          href="/super-admin/clients/new"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <Plus size={20} />
          New Client
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Clients</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">--</h2>

          <p className="mt-1 text-sm text-slate-400">Connected clients</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">New This Month</p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">--</h2>

          <p className="mt-1 text-sm text-slate-400">
            Newly registered clients
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Active Quotations</p>

          <h2 className="mt-2 text-3xl font-bold text-amber-600">--</h2>

          <p className="mt-1 text-sm text-slate-400">Open quotations</p>
        </div>
      </div>

      {/* Client Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Client Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View, search, edit and manage all your clients.
          </p>
        </div>

        <div className="p-6">
          <ClientTable />
        </div>
      </div>
    </div>
  );
}
