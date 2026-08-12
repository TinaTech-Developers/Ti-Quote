import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

import ServiceDetails from "../../../components/services/ServiceDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params;

  const user = await requirePermission("services.view");

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
      <ServiceDetails service={JSON.parse(JSON.stringify(service))} />
    </div>
  );
}
