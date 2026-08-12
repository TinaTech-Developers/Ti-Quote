import Link from "next/link";
import {
  Receipt,
  CreditCard,
  FileText,
  TrendingUp,
  Package,
  Wrench,
  Users,
  Download,
} from "lucide-react";

const reports = [
  {
    title: "Revenue Summary",
    description: "View revenue, taxes, discounts and profit summary.",
    href: "/super-admin/reports/revenue",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    title: "Invoice Report",
    description: "All invoices with filters and export options.",
    href: "/super-admin/reports/invoices",
    icon: Receipt,
    color: "bg-blue-500",
  },
  {
    title: "Payment Report",
    description: "Track all payments received.",
    href: "/super-admin/reports/payments",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    title: "Quotation Report",
    description: "Approved, pending and rejected quotations.",
    href: "/super-admin/reports/quotations",
    icon: FileText,
    color: "bg-cyan-500",
  },
  {
    title: "Outstanding Balances",
    description: "Invoices with outstanding balances.",
    href: "/super-admin/reports/outstanding",
    icon: Receipt,
    color: "bg-red-500",
  },
  {
    title: "Product Sales",
    description: "Sales grouped by products.",
    href: "/super-admin/reports/products",
    icon: Package,
    color: "bg-orange-500",
  },
  {
    title: "Service Sales",
    description: "Sales grouped by services.",
    href: "/super-admin/reports/services",
    icon: Wrench,
    color: "bg-indigo-500",
  },
  {
    title: "Client Statements",
    description: "Generate customer account statements.",
    href: "/super-admin/reports/clients",
    icon: Users,
    color: "bg-pink-500",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Reports & Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          View business performance, generate financial reports and export data.
        </p>
      </div>

      {/* Export */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              Export Center
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Export reports to PDF, Excel or CSV.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-[#0B3954] px-5 py-3 text-white hover:bg-[#082B40]">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Report Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <Link
              key={report.title}
              href={report.href}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${report.color}`}
              >
                <Icon className="text-white" size={28} />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                {report.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {report.description}
              </p>

              <div className="mt-5 text-sm font-medium text-[#0097A7]">
                Open Report →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
