import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import ServiceTable from "../../components/services/ServiceTable";

export default async function ServicesPage() {
  await requirePermission("services.view");

  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>

          <p className="mt-1 text-gray-500">
            Manage the services offered by your company.
          </p>
        </div>

        <Link
          href="/super-admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Link>
      </div>

      <ServiceTable services={JSON.parse(JSON.stringify(services))} />
    </div>
  );
}
