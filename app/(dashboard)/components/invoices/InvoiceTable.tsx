"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

interface Props {
  invoices: any[];
}

export default function InvoiceTable({ invoices }: Props) {
  const [search, setSearch] = useState("");

  const invoiceList = invoices ?? [];

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return invoiceList;
    }

    return invoiceList.filter((invoice) => {
      const invoiceNumber =
        invoice.invoiceNumber?.toString().toLowerCase() ?? "";

      const clientName = invoice.client?.name?.toString().toLowerCase() ?? "";

      const clientEmail = invoice.client?.email?.toString().toLowerCase() ?? "";

      const status = invoice.status?.toString().toLowerCase() ?? "";

      return (
        invoiceNumber.includes(query) ||
        clientName.includes(query) ||
        clientEmail.includes(query) ||
        status.includes(query)
      );
    });
  }, [invoiceList, search]);

  async function deleteInvoice(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        alert(data?.message || data?.error || "Failed to delete invoice.");

        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Delete invoice error:", error);

      alert("An error occurred while deleting the invoice.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          SEARCH HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}

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
                placeholder="Search by invoice number, client, email or status..."
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

          {/* Results */}

          <div className="flex items-center justify-between gap-3 text-sm text-slate-500 md:justify-end">
            <span>
              {search ?
                `${filteredInvoices.length} matching`
              : `${invoiceList.length} total`}
            </span>

            <span className="font-medium text-slate-700">
              {filteredInvoices.length === 1 ? "Invoice" : "Invoices"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          NO INVOICES
      ===================================================== */}

      {invoiceList.length === 0 && (
        <div className="p-12 text-center">
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

      {/* =====================================================
          NO SEARCH RESULTS
      ===================================================== */}

      {invoiceList.length > 0 && filteredInvoices.length === 0 && (
        <div className="p-12 text-center">
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
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear search
          </button>
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      {filteredInvoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Invoice
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Balance
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="
                      border-b
                      border-slate-100
                      transition
                      hover:bg-slate-50
                    "
                >
                  {/* INVOICE */}

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {invoice.invoiceNumber}
                    </div>
                  </td>

                  {/* CLIENT */}

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">
                      {invoice.client?.name || "—"}
                    </div>

                    {invoice.client?.email && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {invoice.client.email}
                      </div>
                    )}
                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {invoice.createdAt ?
                      new Date(invoice.createdAt).toLocaleDateString("en-GB")
                    : "—"}
                  </td>

                  {/* TOTAL */}

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {invoice.company?.currency || "$"}{" "}
                    {Number(invoice.total || 0).toFixed(2)}
                  </td>

                  {/* BALANCE */}

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {invoice.company?.currency || "$"}{" "}
                    {Number(invoice.balance || 0).toFixed(2)}
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <InvoiceActions
                        invoiceId={invoice.id}
                        invoiceNumber={invoice.invoiceNumber}
                        onDelete={() => deleteInvoice(invoice.id)}
                      />
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
