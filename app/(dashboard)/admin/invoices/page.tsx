import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import InvoiceTable from "../components/invoices/InvoiceTable";
import { FileText, DollarSign, CheckCircle, Clock, Plus } from "lucide-react";

async function getInvoices() {
  const user = await getCurrentUser();

  if (!user) return [];

  return prisma.invoice.findMany({
    where: {
      companyId: user.companyId,
    },
    include: {
      client: true,
      createdBy: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  const totalInvoices = invoices.length;

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total),
    0,
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID",
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "CANCELLED" ||
      invoice.status === "PARTIAL" ||
      invoice.status === "PAID" ||
      invoice.status === "OVERDUE",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>

          <p className="mt-1 text-slate-500">
            Manage, track and monitor all customer invoices.
          </p>
        </div>

        <Link
          href="/admin/invoices/create"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Create Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Invoices</span>

            <FileText className="h-5 w-5 text-slate-400" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {totalInvoices}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Value</span>

            <DollarSign className="h-5 w-5 text-slate-400" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            ${totalAmount.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Paid</span>

            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-emerald-600">
            {paidInvoices}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Outstanding</span>

            <Clock className="h-5 w-5 text-amber-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-amber-600">
            {pendingInvoices}
          </h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">Invoice List</h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all invoices in your organization.
          </p>
        </div>

        <div className="p-6">
          <InvoiceTable invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
