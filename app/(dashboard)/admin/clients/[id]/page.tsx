"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Receipt,
  User,
  Wallet,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  taxNumber?: string | null;
  active: boolean;
  createdAt: string;

  quotations?: Quotation[];
  invoices?: Invoice[];
}

interface Quotation {
  id: string;
  quotationNumber: string;
  status: string;
  total: number | string;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number | string;
  createdAt: string;
}

interface ClientResponse extends Client {}

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [clientId, setClientId] = useState("");

  const [client, setClient] = useState<ClientResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setClientId(resolvedParams.id);
    }

    getParams();
  }, [params]);

  useEffect(() => {
    if (!clientId) return;

    async function loadClient() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/clients/${clientId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load client.");
        }

        setClient(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : "Failed to load client.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#0097A7]" />

          <p className="text-sm text-slate-500">Loading client...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0097A7]"
        >
          <ArrowLeft size={17} />
          Back to Clients
        </Link>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50">
          <User size={42} className="text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-red-700">
            Unable to load client
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error || "Client not found."}
          </p>
        </div>
      </div>
    );
  }

  const quotations = client.quotations || [];
  const invoices = client.invoices || [];

  const totalQuotationValue = quotations.reduce(
    (sum, quotation) => sum + Number(quotation.total || 0),
    0,
  );

  const totalInvoiceValue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total || 0),
    0,
  );

  const paidInvoiceValue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  const outstanding = Math.max(totalInvoiceValue - paidInvoiceValue, 0);

  function formatCurrency(value: number) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "PAID":
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700";

      case "PARTIAL":
      case "PENDING":
      case "SENT":
        return "bg-amber-50 text-amber-700";

      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "CONVERTED":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin/clients" className="hover:text-[#0097A7]">
              Clients
            </Link>

            <span>/</span>

            <span className="text-slate-700">{client.name}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">Client Details</h1>

          <p className="mt-1 text-sm text-slate-500">
            View client information, quotations and invoices.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/clients"
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              shadow-sm
              hover:bg-slate-50
            "
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          <Link
            href={`/admin/clients/${client.id}/edit`}
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-[#0B3954]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              hover:bg-[#092C42]
            "
          >
            <Edit size={17} />
            Edit Client
          </Link>
        </div>
      </div>

      {/* CLIENT PROFILE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="bg-gradient-to-r from-[#0B3954] to-[#0097A7] px-6 py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                text-3xl
                font-bold
                text-white
                ring-1
                ring-white/30
              "
            >
              {client.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="text-white">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">{client.name}</h2>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${
                      client.active ?
                        "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                    }
                  `}
                >
                  {client.active ? "Active" : "Inactive"}
                </span>
              </div>

              {client.companyName && (
                <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <Building2 size={16} />

                  {client.companyName}
                </div>
              )}

              <p className="mt-2 text-sm text-white/70">
                Client since {formatDate(client.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}

        <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <Mail size={17} className="text-[#0097A7]" />

              <span>{client.email || "Not provided"}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <Phone size={17} className="text-[#0097A7]" />

              <span>{client.phone || "Not provided"}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tax Number
            </p>

            <div className="mt-2 text-sm text-slate-700">
              {client.taxNumber || "Not provided"}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Location
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <MapPin size={17} className="text-[#0097A7]" />

              <span>
                {client.city || client.country ?
                  <>
                    {client.city}

                    {client.city && client.country && ", "}

                    {client.country}
                  </>
                : "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {client.address && (
          <div className="border-t border-slate-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Address
            </p>

            <p className="mt-2 text-sm text-slate-700">{client.address}</p>
          </div>
        )}
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Quotations</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {quotations.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {formatCurrency(totalQuotationValue)} total value
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Invoices</p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {invoices.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {formatCurrency(totalInvoiceValue)} total value
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Receipt size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Paid</p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(paidInvoiceValue)}
              </p>

              <p className="mt-1 text-xs text-slate-400">From paid invoices</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Outstanding</p>

              <p className="mt-2 text-2xl font-bold text-orange-600">
                {formatCurrency(outstanding)}
              </p>

              <p className="mt-1 text-xs text-slate-400">Estimated balance</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Wallet size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* QUOTATIONS */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-800">Quotations</h2>

            <p className="mt-1 text-xs text-slate-500">
              Quotations created for this client.
            </p>
          </div>

          <Link
            href="/admin/quotations/create"
            className="text-sm font-medium text-[#0097A7] hover:underline"
          >
            New Quotation
          </Link>
        </div>

        {quotations.length === 0 ?
          <div className="flex h-32 items-center justify-center text-sm text-slate-400">
            No quotations found.
          </div>
        : <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Number
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {quotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {quotation.quotationNumber}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={15} />

                        {formatDate(quotation.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${getStatusClass(quotation.status)}
                        `}
                      >
                        {quotation.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      {formatCurrency(Number(quotation.total))}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/quotations/${quotation.id}`}
                        className="text-sm font-medium text-[#0097A7] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {/* INVOICES */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-800">Invoices</h2>

            <p className="mt-1 text-xs text-slate-500">
              Invoices issued to this client.
            </p>
          </div>

          <Link
            href="/admin/invoices/create"
            className="text-sm font-medium text-[#0097A7] hover:underline"
          >
            New Invoice
          </Link>
        </div>

        {invoices.length === 0 ?
          <div className="flex h-32 items-center justify-center text-sm text-slate-400">
            No invoices found.
          </div>
        : <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Number
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {invoice.invoiceNumber}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={15} />

                        {formatDate(invoice.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${getStatusClass(invoice.status)}
                        `}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      {formatCurrency(Number(invoice.total))}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="text-sm font-medium text-[#0097A7] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
