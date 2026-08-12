import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";

import QuotationForm from "../../../../components/quotations/QuotationForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuotationPage({ params }: PageProps) {
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
      items: true,
    },
  });

  if (!quotation) {
    notFound();
  }

  const formattedQuotation = {
    id: quotation.id,

    clientId: quotation.clientId,

    status: quotation.status,

    discount: Number(quotation.discount),

    tax: Number(quotation.tax),

    notes: quotation.notes,

    validUntil:
      quotation.validUntil ? quotation.validUntil.toISOString() : null,

    items: quotation.items.map((item) => ({
      id: item.id,

      type:
        item.productId ? ("PRODUCT" as const)
        : item.serviceId ? ("SERVICE" as const)
        : ("CUSTOM" as const),

      productId: item.productId ?? null,

      serviceId: item.serviceId ?? null,

      description: item.description,

      quantity: Number(item.quantity),

      unitPrice: Number(item.unitPrice),
    })),
  };

  return (
    <div className="space-y-6">
      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <h1 className="text-xl font-bold text-slate-700">Edit Quotation</h1>

        <p className="mt-2 text-sm text-gray-500">
          Update quotation details and items.
        </p>
      </div>

      <QuotationForm initialData={formattedQuotation} />
    </div>
  );
}
