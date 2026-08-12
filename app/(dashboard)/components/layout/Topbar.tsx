"use client";

import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import Breadcrumb from "./Breadcrumb";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-slate-200
        bg-white/90
        backdrop-blur
      "
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="
              rounded-lg
              p-2
              text-slate-600
              transition
              hover:bg-slate-100
              lg:hidden
            "
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <Breadcrumb />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
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
              placeholder="Search..."
              className="
                h-10
                w-72
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:bg-white
                focus:ring-4
                focus:ring-cyan-100
              "
            />
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
