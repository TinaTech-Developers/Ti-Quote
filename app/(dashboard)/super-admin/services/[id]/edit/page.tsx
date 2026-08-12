import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

import ServiceForm from "../../../../components/services/ServiceForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;

  const user = await requirePermission("services.update");

  const service = await prisma.service.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <Link
          href={`/super-admin/services/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Service
        </Link>

        <h1 className="text-3xl font-bold text-slate-800">Edit Service</h1>

        <p className="mt-1 text-slate-500">Update the service information.</p>
      </div>

      <ServiceForm
        initialData={{
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          active: service.active,
        }}
      />
    </div>
  );
}
