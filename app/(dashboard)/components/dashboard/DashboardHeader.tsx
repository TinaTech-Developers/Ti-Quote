"use client";

import { CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  userName?: string;
}

export default function DashboardHeader({
  title = "Dashboard",
  description = "Monitor your business performance and manage operations.",
  userName = "Administrator",
}: DashboardHeaderProps) {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Welcome back,{" "}
          <span className="font-semibold text-[#0B3954]">{userName}</span>
          👋
        </p>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {/* Right */}
      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-sm
        "
      >
        <div
          className="
            rounded-lg
            bg-cyan-50
            p-2
            text-[#0097A7]
          "
        >
          <CalendarDays size={20} />
        </div>

        <div>
          <p className="text-xs text-slate-400">Today</p>

          <p className="text-sm font-semibold text-slate-700">{date}</p>
        </div>
      </div>
    </div>
  );
}
