"use client";

import { Download, FileSpreadsheet, Printer } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  data: Record<string, any>[];
  title?: string;
  fileName?: string;
}

export default function ExportButtons({
  data,
  title = "Report",
  fileName = "report",
}: Props) {
  // =========================================
  // EXPORT EXCEL
  // =========================================

  function exportExcel() {
    if (!data || data.length === 0) {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `${fileName}.xlsx`);
  }

  // =========================================
  // PRINT
  // =========================================

  function printReport() {
    window.print();
  }

  // =========================================
  // PDF
  // =========================================

  function exportPDF() {
    if (!data || data.length === 0) {
      return;
    }

    const columns = Object.keys(data[0]);

    const headerHtml = columns
      .map(
        (column) => `
          <th>
            ${formatColumnName(column)}
          </th>
        `,
      )
      .join("");

    const rowsHtml = data
      .map(
        (item) => `
          <tr>
            ${columns
              .map(
                (column) => `
                  <td>
                    ${formatValue(item[column])}
                  </td>
                `,
              )
              .join("")}
          </tr>
        `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>

      <html>

      <head>

        <title>${title}</title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 30px;
            color: #1e293b;
          }

          h1 {
            color: #0B3954;
            margin-bottom: 5px;
          }

          .generated {
            color: #64748b;
            font-size: 13px;
            margin-bottom: 25px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #0B3954;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 12px;
          }

          td {
            padding: 9px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }

          tr:nth-child(even) {
            background: #f8fafc;
          }

          @media print {

            body {
              padding: 0;
            }

            button {
              display: none;
            }

          }

        </style>

      </head>

      <body>

        <h1>${title}</h1>

        <div class="generated">
          Generated: ${new Date().toLocaleDateString()}
        </div>

        <table>

          <thead>

            <tr>
              ${headerHtml}
            </tr>

          </thead>

          <tbody>
            ${rowsHtml}
          </tbody>

        </table>

      </body>

      </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();
  }

  // =========================================
  // FORMAT COLUMN
  // =========================================

  function formatColumnName(value: string) {
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());
  }

  // =========================================
  // FORMAT VALUE
  // =========================================

  function formatValue(value: any) {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "number") {
      return value.toFixed(2);
    }

    return String(value);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* PDF */}

      <button
        type="button"
        onClick={exportPDF}
        disabled={!data?.length}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-red-600
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-red-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Download size={18} />
        Export PDF
      </button>

      {/* EXCEL */}

      <button
        type="button"
        onClick={exportExcel}
        disabled={!data?.length}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-green-600
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-green-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <FileSpreadsheet size={18} />
        Excel
      </button>

      {/* PRINT */}

      <button
        type="button"
        onClick={printReport}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#0B3954]
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-[#092C42]
        "
      >
        <Printer size={18} />
        Print
      </button>
    </div>
  );
}
