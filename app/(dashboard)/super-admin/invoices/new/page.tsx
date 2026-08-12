import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

import InvoiceForm from "../../../../(dashboard)/components/invoices/InvoiceForm";

export default async function NewInvoicePage() {
  // AUTH

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    notFound();
  }

  const user: any = await verifyToken(token);

  if (!user) {
    notFound();
  }

  // CLIENTS

  const clients = await prisma.client.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      name: "asc",
    },
  });

  // PRODUCTS

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
      active: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  // SERVICES

  const services = await prisma.service.findMany({
    where: {
      companyId: user.companyId,
      active: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  // SERIALIZE PRODUCTS

  const serializedProducts = products.map((product) => ({
    id: product.id,

    name: product.name,

    description: product.description || "",

    price: Number(product.price),

    stockQuantity: Number(product.stockQuantity),

    lowStockAlert: Number(product.lowStockAlert),

    trackStock: product.trackStock,

    active: product.active,
  }));

  // SERIALIZE SERVICES

  const serializedServices = services.map((service) => ({
    id: service.id,

    name: service.name,

    description: service.description || "",

    price: Number(service.price),

    active: service.active,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Invoice</h1>

        <p className="text-gray-500 mt-1">Create a new customer invoice.</p>
      </div>

      <InvoiceForm
        clients={clients}
        products={serializedProducts}
        services={serializedServices}
      />
    </div>
  );
}
