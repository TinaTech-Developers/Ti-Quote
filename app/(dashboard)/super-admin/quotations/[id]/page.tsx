import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";

import QuotationDetails from "../../../components/quotations/QuotationDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuotationDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div className="p-6">Unauthorized</div>;
  }

  const user: any = await verifyToken(token);

  const quotation = await prisma.quotation.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      client: true,

      createdBy: true,

      invoice: true,

      items: {
        include: {
          product: true,
          service: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!quotation) {
    notFound();
  }

  const formattedQuotation = {
    id: quotation.id,

    quotationNumber: quotation.quotationNumber,

    status: quotation.status,

    subtotal: Number(quotation.subtotal),

    discount: Number(quotation.discount),

    tax: Number(quotation.tax),

    total: Number(quotation.total),

    notes: quotation.notes,

    validUntil:
      quotation.validUntil ? quotation.validUntil.toISOString() : null,

    createdAt: quotation.createdAt.toISOString(),

    updatedAt: quotation.updatedAt.toISOString(),

    client: {
      id: quotation.client.id,

      name: quotation.client.name,

      companyName: quotation.client.companyName,

      email: quotation.client.email,

      phone: quotation.client.phone,
    },

    invoice:
      quotation.invoice ?
        {
          id: quotation.invoice.id,
        }
      : null,

    items: quotation.items.map((item) => ({
      id: item.id,

      quotationId: item.quotationId,

      productId: item.productId,

      serviceId: item.serviceId,

      description: item.description,

      quantity: Number(item.quantity),

      unitPrice: Number(item.unitPrice),

      total: Number(item.total),

      createdAt: item.createdAt.toISOString(),
    })),
  };

  return (
    <div className="space-y-6">
      <QuotationDetails quotation={formattedQuotation} />
    </div>
  );
}
