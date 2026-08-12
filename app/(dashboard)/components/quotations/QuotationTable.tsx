"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Search, FileText } from "lucide-react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  FileCheck2,
  FileClock,
  Ban,
} from "lucide-react";

interface Quotation {
  id: string;

  quotationNumber: string;

  status: string;

  total: number;

  createdAt: string;

  client: {
    id: string;
    name: string;
    companyName?: string | null;
  };
}

interface Props {
  quotations: Quotation[];
}

export default function QuotationTable({ quotations }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return quotations.filter((quotation) => {
      const query = search.toLowerCase();

      return (
        quotation.quotationNumber.toLowerCase().includes(query) ||
        quotation.client.name.toLowerCase().includes(query) ||
        quotation.status.toLowerCase().includes(query)
      );
    });
  }, [quotations, search]);

  function statusBadge(status: string) {
    switch (status) {
      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "PENDING":
        return {
          label: "Pending",
          icon: Clock3,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };

      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
        };

      case "CONVERTED":
        return {
          label: "Converted",
          icon: FileCheck2,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "EXPIRED":
        return {
          label: "Expired",
          icon: Ban,
          className: "bg-gray-100 text-gray-700 border-gray-200",
        };

      default:
        return {
          label: "Draft",
          icon: FileClock,
          className: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Header */}

      <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Quotations</h2>

          <p className="text-sm text-gray-500">Manage quotations</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />

          <input
            placeholder="Search quotation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4 text-slate-700 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-5 py-3">Quotation</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  <FileText size={42} className="mx-auto mb-3 text-gray-300" />
                  No quotations found.
                </td>
              </tr>
            )}

            {filtered.map((quotation) => (
              <tr key={quotation.id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-slate-500 text-sm">
                  {quotation.quotationNumber}
                </td>

                <td className="px-5 py-4">
                  <div className="font-medium text-slate-400 text-sm">
                    {quotation.client.name}
                  </div>

                  {quotation.client.companyName && (
                    <div className="text-sm text-gray-500">
                      {quotation.client.companyName}
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  {(() => {
                    const status = statusBadge(quotation.status);

                    const Icon = status.icon;

                    return (
                      <span
                        className={`
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          px-3
          py-1.5
          text-xs
          font-semibold
          ${status.className}
        `}
                      >
                        <Icon size={14} />

                        {status.label}
                      </span>
                    );
                  })()}
                </td>

                <td className="px-5 py-4 font-medium text-slate-500">
                  $
                  {Number(quotation.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {new Date(quotation.createdAt).toISOString().split("T")[0]}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/super-admin/quotations/${quotation.id}`}
                      className="rounded-lg p-2 hover:bg-gray-100"
                    >
                      <Eye size={18} color="gray" />
                    </Link>

                    <Link
                      href={`/super-admin/quotations/${quotation.id}/edit`}
                      className="rounded-lg p-2 hover:bg-blue-100"
                    >
                      <Pencil size={18} color="gray" />
                    </Link>

                    <button className="rounded-lg p-2 hover:bg-red-300">
                      <Trash2 size={18} color="gray" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
