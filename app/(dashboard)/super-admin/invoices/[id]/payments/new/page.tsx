import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

import PaymentForm from "../../../../../components/payments/PaymentForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewPaymentPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) notFound();

  const user: any = await verifyToken(token);

  if (!user) notFound();

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      client: true,
    },
  });

  if (!invoice) notFound();

  const serializedInvoice = {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    client: invoice.client,
    total: Number(invoice.total),
    balance: Number(invoice.balance),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Record Payment</h1>

        <p className="text-gray-500 mt-1">Invoice {invoice.invoiceNumber}</p>
      </div>

      <PaymentForm invoice={serializedInvoice} />
    </div>
  );
}
