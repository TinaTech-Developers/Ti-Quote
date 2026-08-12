"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Package,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/admin/clients",
    icon: Users,
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
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
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

export default function Sidebar({
  mobile = false,
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {mobile && open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0B3954] text-white transition-transform duration-300",

          mobile ?
            open ? "translate-x-0"
            : "-translate-x-full"
          : "hidden lg:flex",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2">
              <Image src="/logo.png" alt="Trebo" width={38} height={38} />
            </div>

            <div>
              <h1 className="text-lg font-bold">Trebo</h1>

              <p className="text-xs text-slate-300">Accounting</p>
            </div>
          </div>

          {mobile && (
            <button onClick={onClose}>
              <X size={22} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",

                  active ?
                    "bg-[#0097A7] text-white shadow-lg"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon size={20} />

                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-slate-300
              transition
              hover:bg-red-500
              hover:text-white
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
