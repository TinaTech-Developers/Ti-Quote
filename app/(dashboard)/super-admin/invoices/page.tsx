import Link from "next/link";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

import InvoiceTable from "../../../(dashboard)/components/invoices/InvoiceTable";

export default async function InvoicesPage() {
  // =========================
  // AUTH
  // =========================

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Unauthorized</h2>
      </div>
    );
  }

  const user: any = await verifyToken(token);

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Invalid session</h2>
      </div>
    );
  }

  // =========================
  // FETCH INVOICES
  // =========================

  const rawInvoices = await prisma.invoice.findMany({
    where: {
      companyId: user.companyId,
    },

    include: {
      client: true,
      company: true,
      payments: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // =========================
  // SERIALIZE DECIMAL VALUES
  // =========================

  const invoices = rawInvoices.map((invoice) => ({
    ...invoice,

    subtotal: Number(invoice.subtotal),
    discount: Number(invoice.discount),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    balance: Number(invoice.balance),

    payments: invoice.payments.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
    })),
  }));

  // =========================
  // DASHBOARD STATS
  // =========================

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID",
  ).length;

  const outstandingInvoices = invoices.filter(
    (invoice) => invoice.balance > 0,
  ).length;

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0,
  );

  const outstandingBalance = invoices.reduce(
    (sum, invoice) => sum + invoice.balance,
    0,
  );

  const currency = invoices[0]?.company?.currency || "$";

  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Invoices</h1>

          <p className="mt-1 text-gray-500">
            Manage customer invoices and payments.
          </p>
        </div>

        <Link
          href="/super-admin/invoices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
        >
          <Plus size={18} />
          New Invoice
        </Link>
      </div>

      {/* ========================= */}
      {/* SUMMARY */}
      {/* ========================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Invoices</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {totalInvoices}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Paid</p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {paidInvoices}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Outstanding</p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {outstandingInvoices}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {currency} {totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Outstanding Balance</p>

          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            {currency} {outstandingBalance.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <InvoiceTable invoices={invoices} />
    </div>
  );
}
