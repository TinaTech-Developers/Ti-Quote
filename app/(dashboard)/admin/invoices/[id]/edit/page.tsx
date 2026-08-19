import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { redirect, notFound } from "next/navigation";
import InvoiceForm from "../../../components/invoices/InvoiceForm";

interface EditInvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getData(invoiceId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [invoice, clients, products, services] = await Promise.all([
    prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        companyId: user.companyId,
      },
      include: {
        client: true,

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
    }),

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
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.service.findMany({
      where: {
        companyId: user.companyId,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!invoice) {
    notFound();
  }

  return {
    invoice: {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,

      subtotal: Number(invoice.subtotal),
      discount: Number(invoice.discount),
      tax: Number(invoice.tax),
      total: Number(invoice.total),
      balance: Number(invoice.balance),

      dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,

      notes: invoice.notes,
      terms: invoice.terms,

      status: invoice.status,

      items: invoice.items.map((item) => ({
        id: item.id,

        productId: item.productId,
        serviceId: item.serviceId,

        description: item.description,

        quantity: Number(item.quantity),

        unitPrice: Number(item.unitPrice),

        total: Number(item.total),
      })),
    },

    clients,

    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      unit: product.unit,

      price: Number(product.price),

      stockQuantity: Number(product.stockQuantity),

      lowStockAlert: Number(product.lowStockAlert),

      trackStock: product.trackStock,

      active: product.active,
    })),

    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,

      price: Number(service.price),

      active: service.active,
    })),
  };
}

export default async function EditInvoicePage({
  params,
}: EditInvoicePageProps) {
  const { id } = await params;

  const { invoice, clients, products, services } = await getData(id);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Invoice
          </h1>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {invoice.invoiceNumber}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Update the invoice details, customer, products, services, and payment
          terms.
        </p>
      </div>

      {/* FORM */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <InvoiceForm
          clients={clients}
          products={products}
          services={services}
          initialData={invoice}
          mode="edit"
        />
      </div>
    </div>
  );
}
