"use client";

import { CalendarDays, User, FileText } from "lucide-react";

import ApproveQuotationButton from "./ApproveQuotationButton";
import ConvertInvoiceButton from "./ConvertInvoiceButton";
import DownloadQuotationPDFButton from "./DownloadQuotationPDFButton";

interface QuotationDetailsProps {
  quotation: any;
}

export default function QuotationDetails({ quotation }: QuotationDetailsProps) {
  function statusStyle(status: string) {
    const styles: any = {
      DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",

      PENDING: "bg-amber-50 text-amber-700 ring-amber-200",

      APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",

      REJECTED: "bg-red-50 text-red-700 ring-red-200",

      EXPIRED: "bg-gray-100 text-gray-700 ring-gray-200",

      CONVERTED: "bg-blue-50 text-blue-700 ring-blue-200",
    };

    return styles[status] || "bg-gray-100 text-gray-700 ring-gray-200";
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      "
      >
        <div
          className="
          flex
          flex-col
          justify-between
          gap-4
          md:flex-row
        "
        >
          <div>
            <h1 className="text-xl font-bold text-slate-700">
              Quotation #{quotation.quotationNumber}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created on{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(quotation.createdAt))}
            </p>

            {/* ACTION BUTTONS */}

            <div className="mt-4 flex flex-wrap gap-3">
              <DownloadQuotationPDFButton quotationId={quotation.id} />

              {quotation.status === "DRAFT" && (
                <ApproveQuotationButton quotationId={quotation.id} />
              )}

              {quotation.status === "APPROVED" && !quotation.invoice && (
                <ConvertInvoiceButton quotationId={quotation.id} />
              )}
            </div>
          </div>

          <span
            className={`
    inline-flex
    items-center
    gap-2
    h-16
    px-4
    py-2
    text-sm
    font-semibold
    ring-1
    ${statusStyle(quotation.status)}
  `}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />

            {quotation.status}
          </span>
        </div>
      </div>

      {/* Client Information */}

      <div
        className="
        grid
        gap-6
        md:grid-cols-2
      "
      >
        <div
          className="
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <div className="mb-4 flex items-center gap-2 ">
            <User size={18} color="gray" />

            <h2 className="font-semibold text-slate-600">Client</h2>
          </div>

          <p className="font-medium text-slate-800">{quotation.client?.name}</p>

          {quotation.client?.companyName && (
            <p className="text-sm text-gray-500">
              {quotation.client.companyName}
            </p>
          )}

          <p className="text-sm text-gray-500">{quotation.client?.email}</p>

          <p className="text-sm text-gray-500">{quotation.client?.phone}</p>
        </div>

        <div
          className="
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} color="gray" />

            <h2 className="font-semibold text-slate-600">Dates</h2>
          </div>

          <p className="text-sm text-slate-600">
            Created:{" "}
            {quotation?.createdAt ?
              new Date(quotation.createdAt).toLocaleDateString()
            : "N/A"}
          </p>
          {quotation.validUntil && (
            <p className="text-sm text-slate-600">
              Valid Until: {new Date(quotation.validUntil).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Items */}

      <div
        className="
        rounded-xl
        border
        bg-white
        p-6
      "
      >
        <div
          className="
          mb-5
          flex
          items-center
          gap-2
        "
        >
          <FileText size={18} color="gray" />

          <h2 className="font-semibold text-slate-800">Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="p-3 text-slate-800 text-left">Description</th>

                <th className="p-3 text-slate-800">Qty</th>

                <th className="p-3 text-slate-800">Price</th>

                <th className="p-3 text-slate-800">Total</th>
              </tr>
            </thead>

            <tbody>
              {quotation.items?.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 text-slate-600">{item.description}</td>

                  <td className="p-3 text-slate-600 text-center">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-slate-600 text-center">
                    ${Number(item.unitPrice).toFixed(2)}
                  </td>

                  <td className="p-3 text-slate-600 text-center font-medium">
                    ${Number(item.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}

      <div
        className="
        ml-auto
        max-w-md
        rounded-xl
        border
        bg-white
        p-6
      "
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-700">Subtotal</span>

            <span className="text-slate-600">
              ${Number(quotation.subtotal).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-700">Discount</span>

            <span className="text-slate-600">
              ${Number(quotation.discount).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-700">Tax</span>

            <span className="text-slate-600">
              ${Number(quotation.tax).toFixed(2)}
            </span>
          </div>

          <div
            className="
            flex
            justify-between
            border-t
            pt-3
            text-lg
            font-bold
          "
          >
            <span className="text-slate-700">Total</span>

            <span className="text-slate-600">
              ${Number(quotation.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}

      {quotation.notes && (
        <div
          className="
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <h2 className="mb-2 font-semibold text-slate-700">Notes</h2>

          <p className="text-gray-600">{quotation.notes}</p>
        </div>
      )}
    </div>
  );
}
