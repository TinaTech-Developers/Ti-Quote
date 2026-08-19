"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Search, X } from "lucide-react";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import DeleteInvoiceButton from "./DeleteInvoiceButton";

interface InvoiceTableProps {
  invoices: any[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [search, setSearch] = useState("");

  const invoiceList = invoices ?? [];

  /*
   * ==========================================
   * FORMAT CURRENCY
   * ==========================================
   */

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  /*
   * ==========================================
   * SEARCH / FILTER
   * ==========================================
   */

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return invoiceList;
    }

    return invoiceList.filter((invoice) => {
      const invoiceNumber =
        invoice.invoiceNumber?.toString().toLowerCase() ?? "";

      const clientName = invoice.client?.name?.toString().toLowerCase() ?? "";

      const companyName =
        invoice.client?.companyName?.toString().toLowerCase() ?? "";

      const clientEmail = invoice.client?.email?.toString().toLowerCase() ?? "";

      const status = invoice.status?.toString().toLowerCase() ?? "";

      return (
        invoiceNumber.includes(query) ||
        clientName.includes(query) ||
        companyName.includes(query) ||
        clientEmail.includes(query) ||
        status.includes(query)
      );
    });
  }, [invoiceList, search]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ==========================================
          SEARCH HEADER
      ========================================== */}

      <div className="border-b border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}

          <div className="w-full md:max-w-xl">
            <div className="relative">
              <Search
                size={19}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice, client, email or status..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  py-3
                  pl-11
                  pr-11
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-1.5
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>

          {/* RESULTS COUNT */}

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              {search ?
                `${filteredInvoices.length} matching`
              : `${invoiceList.length} total`}
            </span>

            <span className="font-semibold text-slate-700">
              {filteredInvoices.length === 1 ? "Invoice" : "Invoices"}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          NO INVOICES
      ========================================== */}

      {invoiceList.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Search size={22} className="text-slate-400" />
          </div>

          <h3 className="text-lg font-semibold text-slate-700">
            No invoices found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Create your first invoice to get started.
          </p>
        </div>
      )}

      {/* ==========================================
          NO SEARCH RESULTS
      ========================================== */}

      {invoiceList.length > 0 && filteredInvoices.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Search size={22} className="text-slate-400" />
          </div>

          <h3 className="text-lg font-semibold text-slate-700">
            No matching invoices
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            No invoices match{" "}
            <span className="font-semibold text-slate-700">"{search}"</span>.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="
                mt-4
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
          >
            Clear search
          </button>
        </div>
      )}

      {/* ==========================================
          TABLE
      ========================================== */}

      {filteredInvoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            {/* HEADER */}

            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Invoice
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Balance
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="transition hover:bg-slate-50">
                  {/* INVOICE */}

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </p>

                      {invoice.dueDate && (
                        <p className="mt-1 text-xs text-slate-500">
                          Due:{" "}
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* CLIENT */}

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {invoice.client?.companyName ||
                          invoice.client?.name ||
                          "—"}
                      </p>

                      {invoice.client?.companyName && invoice.client?.name && (
                        <p className="mt-1 text-xs text-slate-500">
                          {invoice.client.name}
                        </p>
                      )}

                      {invoice.client?.email && (
                        <p className="mt-1 text-xs text-slate-400">
                          {invoice.client.email}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {invoice.invoiceDate ?
                      new Date(invoice.invoiceDate).toLocaleDateString("en-GB")
                    : invoice.createdAt ?
                      new Date(invoice.createdAt).toLocaleDateString("en-GB")
                    : "—"}
                  </td>

                  {/* TOTAL */}

                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {formatCurrency(Number(invoice.total || 0))}
                  </td>

                  {/* BALANCE */}

                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {formatCurrency(Number(invoice.balance || 0))}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {/* VIEW */}

                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        title="View invoice"
                        className="
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          p-2
                          text-slate-500
                          transition
                          hover:bg-slate-50
                          hover:text-blue-600
                        "
                      >
                        <Eye size={16} />
                      </Link>

                      {/* EDIT */}

                      <Link
                        href={`/admin/invoices/${invoice.id}/edit`}
                        title="Edit invoice"
                        className="
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          p-2
                          text-slate-500
                          transition
                          hover:bg-slate-50
                          hover:text-blue-600
                        "
                      >
                        <Pencil size={16} />
                      </Link>

                      {/* DELETE */}

                      <DeleteInvoiceButton invoiceId={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
