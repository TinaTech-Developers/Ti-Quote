import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";
import QuotationTable from "../../components/quotations/QuotationTable";

export default async function QuotationsPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div className="p-6">Unauthorized</div>;
  }

  const user: any = await verifyToken(token);

  const quotations = await prisma.quotation.findMany({
    where: {
      companyId: user.companyId,
    },

    include: {
      client: true,
      createdBy: true,
      invoice: true,
      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedQuotations = quotations.map((quotation) => ({
    id: quotation.id,

    quotationNumber: quotation.quotationNumber,

    status: quotation.status,

    total: Number(quotation.total),

    subtotal: Number(quotation.subtotal),

    discount: Number(quotation.discount),

    tax: Number(quotation.tax),

    createdAt: quotation.createdAt.toISOString(),

    client: {
      id: quotation.client.id,
      name: quotation.client.name,
      companyName: quotation.client.companyName,
    },

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
  }));

  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
          flex
          flex-col
          justify-between
          gap-4
          rounded-xl
          border
          bg-white
          p-6
          md:flex-row
          md:items-center
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quotations</h1>

          <p className="text-sm text-gray-500">
            Manage client quotations and convert them into invoices.
          </p>
        </div>

        <Link
          href="/super-admin/quotations/create"
          className="
            rounded-lg
            bg-blue-600
            px-5
            py-3
            text-white
            hover:bg-blue-700
          "
        >
          + New Quotation
        </Link>
      </div>

      {/* Table */}

      <QuotationTable quotations={formattedQuotations} />
    </div>
  );
}
