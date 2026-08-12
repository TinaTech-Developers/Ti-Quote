"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const paths = pathname
    .split("/")
    .filter(Boolean)
    .filter(
      (segment) =>
        segment !== "admin" && segment !== "super-admin" && segment !== "staff",
    );

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link
        href="/"
        className="flex items-center gap-1 transition hover:text-[#0B3954]"
      >
        <Home size={16} />
      </Link>

      {paths.map((segment, index) => {
        const href =
          "/" +
          pathname
            .split("/")
            .filter(Boolean)
            .slice(0, index + 2)
            .join("/");

        const isLast = index === paths.length - 1;

        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight size={15} />

            {isLast ?
              <span className="font-medium text-slate-700">{label}</span>
            : <Link href={href} className="transition hover:text-[#0B3954]">
                {label}
              </Link>
            }
          </div>
        );
      })}
    </nav>
  );
}
