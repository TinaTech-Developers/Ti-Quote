"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Package,
  BriefcaseBusiness,
  FileText,
  Receipt,
  CreditCard,
  Boxes,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Quotations",
    href: "/admin/quotations",
    icon: FileText,
  },
  {
    name: "Invoices",
    href: "/admin/invoices",
    icon: Receipt,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
      {/* BRAND */}

      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B3954]">Trebo Accounting</h1>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Admin Portal
          </p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/admin" ?
              pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active ?
                  "bg-[#0B3954] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#0B3954]"
              }`}
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
