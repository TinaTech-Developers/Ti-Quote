"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  FileText,
  Receipt,
  CreditCard,
  Users,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "invoice" | "quotation" | "payment" | "client";
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Invoice Paid",
      message: "INV-00012 has been paid.",
      time: "2 mins ago",
      read: false,
      type: "payment",
    },
    {
      id: 2,
      title: "Quotation Approved",
      message: "Quotation QT-0007 was approved.",
      time: "20 mins ago",
      read: false,
      type: "quotation",
    },
    {
      id: 3,
      title: "New Client",
      message: "ABC Hardware has been added.",
      time: "1 hour ago",
      read: true,
      type: "client",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      })),
    );
  }

  function getIcon(type: Notification["type"]) {
    switch (type) {
      case "invoice":
        return <Receipt size={18} />;
      case "quotation":
        return <FileText size={18} />;
      case "payment":
        return <CreditCard size={18} />;
      default:
        return <Users size={18} />;
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}

      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2.5 transition hover:bg-slate-100"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {open && (
        <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-50">
          {/* Header */}

          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold text-slate-800">Notifications</h3>

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-[#0097A7] hover:underline"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          </div>

          {/* List */}

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ?
              <div className="py-10 text-center text-sm text-slate-500">
                No notifications
              </div>
            : notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 border-b p-4 transition hover:bg-slate-50 ${
                    !item.read ? "bg-cyan-50/40" : ""
                  }`}
                >
                  <div className="mt-1 rounded-lg bg-slate-100 p-2">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{item.title}</h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.message}
                    </p>

                    <span className="mt-2 block text-xs text-slate-400">
                      {item.time}
                    </span>
                  </div>

                  {!item.read && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-[#0097A7]" />
                  )}
                </div>
              ))
            }
          </div>

          {/* Footer */}

          <div className="border-t p-3">
            <Link
              href="/notifications"
              className="block rounded-xl py-2 text-center text-sm font-medium text-[#0B3954] transition hover:bg-slate-50"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
