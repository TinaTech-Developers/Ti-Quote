"use client";

import { useState } from "react";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";

export default function DashboardShell({
  children,
  sidebar,
}: {
  children: React.ReactNode;

  sidebar: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebar}

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
