import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requirePermission } from "@/lib/permissions";
import ServiceForm from "../../../components/services/ServiceForm";

export default async function NewServicePage() {
  await requirePermission("services.create");

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <Link
          href="/super-admin/services"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <h1 className="text-3xl font-bold text-slate-800">Create Service</h1>

        <p className="mt-1 text-slate-500">
          Add a new service to your catalogue.
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}
