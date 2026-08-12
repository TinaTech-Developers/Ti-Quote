import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";

import InvoiceForm from "../../../../../../app/(dashboard)/components/invoices/InvoiceForm";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ==========================
  // AUTH
  // ==========================

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) notFound();

  const user: any = await verifyToken(token);

  if (!user) notFound();

  // ==========================
  // INVOICE
  // ==========================

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      items: {
        include: {
          product: true,
          service: true,
        },
      },
    },
  });

  if (!invoice) notFound();

  // ==========================
  // CLIENTS
  // ==========================

  const clients = await prisma.client.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      name: "asc",
    },
  });

  // ==========================
  // PRODUCTS
  // ==========================

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
      active: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  // ==========================
  // SERVICES
  // ==========================

  const services = await prisma.service.findMany({
    where: {
      companyId: user.companyId,
      active: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  // ==========================
  // SERIALIZE CLIENTS
  // ==========================

  const serializedClients = clients.map((client) => ({
    id: client.id,
    name: client.name,
  }));

  // ==========================
  // SERIALIZE PRODUCTS
  // ==========================

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),
    stockQuantity: Number(product.stockQuantity),
    lowStockAlert: Number(product.lowStockAlert),
    trackStock: product.trackStock,
    active: product.active,
  }));

  // ==========================
  // SERIALIZE SERVICES
  // ==========================

  const serializedServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description ?? "",
    price: Number(service.price),
    active: service.active,
  }));

  // ==========================
  // SERIALIZE INVOICE
  // ==========================

  const serializedInvoice = {
    id: invoice.id,

    clientId: invoice.clientId,

    notes: invoice.notes ?? "",

    terms: invoice.terms ?? "",

    discount: Number(invoice.discount),

    tax: Number(invoice.tax),

    subtotal: Number(invoice.subtotal),

    total: Number(invoice.total),

    balance: Number(invoice.balance),

    dueDate: invoice.dueDate,

    items: invoice.items.map((item) => ({
      id: item.id,

      type: item.productId ? "PRODUCT" : "SERVICE",

      productId: item.productId ?? "",

      serviceId: item.serviceId ?? "",

      description: item.description,

      quantity: Number(item.quantity),

      unitPrice: Number(item.unitPrice),

      total: Number(item.total),

      product:
        item.product ?
          {
            id: item.product.id,
            name: item.product.name,
          }
        : null,

      service:
        item.service ?
          {
            id: item.service.id,
            name: item.service.name,
          }
        : null,
    })),
  };

  // ==========================
  // PAGE
  // ==========================

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-700">Edit Invoice</h1>

      <InvoiceForm
        invoice={serializedInvoice}
        clients={serializedClients}
        products={serializedProducts}
        services={serializedServices}
      />
    </div>
  );
}
