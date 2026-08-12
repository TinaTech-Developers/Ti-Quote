import Link from "next/link";
import { ArrowLeft, Pencil, Download, Send, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

import InvoiceDetails from "../../../../(dashboard)/components/invoices/InvoiceDetails";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoiceDetailsPage({ params }: Props) {
  const { id } = await params;

  // ==========================
  // AUTH
  // ==========================

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    notFound();
  }

  const user: any = await verifyToken(token);

  if (!user) {
    notFound();
  }

  // ==========================
  // FETCH INVOICE
  // ==========================

  const rawInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      company: true,

      client: true,

      quotation: true,

      createdBy: true,

      items: {
        include: {
          product: true,
          service: true,
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!rawInvoice) {
    notFound();
  }

  // ==========================
  // SERIALIZE FOR CLIENT
  // ==========================

  const invoice = JSON.parse(
    JSON.stringify(rawInvoice, (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }

      if (
        value &&
        typeof value === "object" &&
        typeof value.toJSON === "function"
      ) {
        return value.toJSON();
      }

      return value;
    }),
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/super-admin/invoices"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to invoices
          </Link>

          <h1 className="mt-3 text-2xl text-slate-700 font-bold">
            {invoice.invoiceNumber}
          </h1>

          <p className="text-gray-500">Invoice Details</p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/super-admin/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border text-slate-600 px-4 py-2 hover:bg-gray-50"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Download size={16} />
            PDF
          </a>

          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Send size={16} />
            Send
          </button>

          {Number(invoice.balance) > 0 && (
            <Link
              href={`/super-admin/invoices/${invoice.id}/payments/new`}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              <CreditCard size={16} />
              Record Payment
            </Link>
          )}
        </div>
      </div>

      <InvoiceDetails invoice={invoice} />
    </div>
  );
}
