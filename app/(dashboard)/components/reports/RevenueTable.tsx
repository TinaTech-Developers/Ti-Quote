"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyRevenue {
  month: string;
  invoices: number;
  revenue: number;
  paid: number;
  outstanding: number;
  tax: number;
  discount: number;
}

interface Props {
  data: MonthlyRevenue[];
}

export default function RevenueTable({ data }: Props) {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  const filtered = data.filter((item) =>
    item.month.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Search */}

      <div
        className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
      "
      >
        <div
          className="
          relative
          max-w-md
        "
        >
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search month..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              pl-10
              outline-none
              focus:border-[#0097A7]
            "
          />
        </div>
      </div>

      {/* Table */}

      <div
        className="
        overflow-hidden
        rounded-2xl
        border
        bg-white
        shadow-sm
      "
      >
        <div className="overflow-x-auto">
          <table
            className="
          min-w-full
          text-sm
        "
          >
            <thead
              className="
            bg-[#0B3954]
            text-white
          "
            >
              <tr>
                <th className="px-5 py-4 text-left">Month</th>

                <th className="px-5 py-4">Invoices</th>

                <th className="px-5 py-4">Revenue</th>

                <th className="px-5 py-4">Paid</th>

                <th className="px-5 py-4">Outstanding</th>

                <th className="px-5 py-4">Tax</th>

                <th className="px-5 py-4">Discount</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((row) => (
                <tr
                  key={row.month}
                  className="
                border-b
                hover:bg-slate-50
              "
                >
                  <td className="px-5 py-4 font-medium text-slate-500">
                    {row.month}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-500">
                    {row.invoices}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-500">
                    ${row.revenue.toFixed(2)}
                  </td>

                  <td
                    className="
                  px-5
                  py-4
                  text-center
                  text-green-600
                  font-medium
                "
                  >
                    ${row.paid.toFixed(2)}
                  </td>

                  <td
                    className="
                  px-5
                  py-4
                  text-center
                  text-red-600
                "
                  >
                    ${row.outstanding.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-500">
                    ${row.tax.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-500">
                    ${row.discount.toFixed(2)}
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                  py-10
                  text-center
                  text-slate-400
                "
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div
          className="
          flex
          items-center
          justify-between
          border-t
          px-5
          py-4
        "
        >
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="
              rounded-lg
              border
              p-2
              disabled:opacity-40
            "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="
              rounded-lg
              border
              p-2
              disabled:opacity-40
            "
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
