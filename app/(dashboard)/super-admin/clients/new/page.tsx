import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import ClientForm from "../../../components/clients/ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/super-admin" className="hover:text-blue-600">
          Dashboard
        </Link>

        <span>/</span>

        <Link href="/super-admin/clients" className="hover:text-blue-600">
          Clients
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-700">New Client</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
          <PlusCircle className="h-7 w-7 text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Client</h1>

          <p className="mt-1 text-slate-500">
            Add a new client to your company database.
          </p>
        </div>
      </div>

      {/* Form */}
      <ClientForm />
    </div>
  );
}
