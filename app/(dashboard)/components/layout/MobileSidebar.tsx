"use client";

import { X } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;

  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}

      <div
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/40
        "
      />

      {/* Sidebar */}

      <aside
        className="
          relative
          w-72
          h-full
          bg-white
          shadow-xl
          p-6
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-8
          "
        >
          <h2
            className="
            text-xl
            font-bold
            text-[#0B3954]
          "
          >
            Trebo
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              hover:bg-slate-100
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Temporary menu */}

        <nav className="space-y-3">
          <p className="text-slate-600">Dashboard</p>

          <p className="text-slate-600">Invoices</p>

          <p className="text-slate-600">Quotations</p>
        </nav>
      </aside>
    </div>
  );
}
