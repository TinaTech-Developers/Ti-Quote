import { notFound } from "next/navigation";
import ClientDetails from "../../../components/clients/ClientDetails";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientPage({ params }: PageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          quotations: true,
          invoices: true,
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ClientDetails client={client} />
    </div>
  );
}
