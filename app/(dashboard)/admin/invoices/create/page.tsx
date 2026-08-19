import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import InvoiceForm from "../../components/invoices/InvoiceForm";

async function getData() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [clients, products, services] = await Promise.all([
    prisma.client.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.service.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    clients,

    products: products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      stockQuantity: product.stockQuantity.toNumber(),
      lowStockAlert: product.lowStockAlert.toNumber(),
    })),

    services: services.map((service) => ({
      ...service,
      price: service.price.toNumber(),
    })),
  };
}

export default async function CreateInvoicePage() {
  const { clients, products, services } = await getData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Invoice</h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new invoice for a customer and add products or services.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <InvoiceForm
          clients={clients}
          products={products}
          services={services}
        />
      </div>
    </div>
  );
}
