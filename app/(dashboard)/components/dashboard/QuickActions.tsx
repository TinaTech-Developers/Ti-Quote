"use client";

import Link from "next/link";
import {
  FilePlus2,
  FileText,
  Users,
  PackagePlus,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "New Invoice",
    description: "Create a customer invoice",
    href: "/admin/invoices/create",
    icon: FilePlus2,
  },
  {
    title: "New Quotation",
    description: "Prepare a quotation",
    href: "/admin/quotations/create",
    icon: FileText,
  },
  {
    title: "Add Client",
    description: "Register new client",
    href: "/admin/clients/create",
    icon: Users,
  },
  {
    title: "Add Product",
    description: "Create inventory item",
    href: "/admin/products",
    icon: PackagePlus,
  },
  {
    title: "Record Payment",
    description: "Capture customer payment",
    href: "/admin/payments",
    icon: CreditCard,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access common tasks
        </p>
      </div>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                group
                rounded-xl
                border
                border-slate-200
                p-4
                transition-all
                hover:border-[#0097A7]
                hover:shadow-md
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0B3954]
                  text-white
                  transition
                  group-hover:bg-[#0097A7]
                "
              >
                <Icon size={20} />
              </div>

              <h3 className="font-semibold text-slate-800">{action.title}</h3>

              <p className="mt-1 text-xs text-slate-500">
                {action.description}
              </p>

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  text-[#0097A7]
                  opacity-0
                  transition
                  group-hover:opacity-100
                "
              >
                Open
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
