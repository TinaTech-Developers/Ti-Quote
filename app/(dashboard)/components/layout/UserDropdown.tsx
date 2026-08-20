"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, Settings, KeyRound, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Administrator",
    email: "admin@trebo.com",
    role: "SUPER ADMIN",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load logged in user

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser({
          name: data.fullName || "Administrator",

          email: data.email || "admin@trebo.com",

          role: data.role || "USER",
        });
      } catch (error) {
        console.error("Failed loading user", error);
      }
    }

    loadUser();
  }, []);

  // Close dropdown outside click

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          py-2
          transition
          hover:bg-slate-50
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#0B3954]
            text-sm
            font-bold
            text-white
          "
        >
          {initials}
        </div>

        <div className="hidden text-left md:block">
          <h3 className="text-sm font-semibold text-slate-800">{user.name}</h3>

          <p className="text-xs text-slate-500">{user.role}</p>
        </div>

        <ChevronDown
          size={18}
          className={`
            hidden
            md:block
            transition
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            z-50
          "
        >
          {/* Header */}

          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#0B3954]
                  font-bold
                  text-white
                "
              >
                {initials}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>

                <p className="text-sm text-slate-500">{user.email}</p>

                <span
                  className="
                    mt-1
                    inline-block
                    rounded-full
                    bg-cyan-100
                    px-2
                    py-1
                    text-xs
                    font-medium
                    text-cyan-700
                  "
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu */}

          <div className="py-2">
            <Link
              href="/profile"
              className="
                flex
                items-center
                gap-3
                px-5
                py-3
                text-sm
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <User size={18} />
              My Profile
            </Link>

            <Link
              href="/settings"
              className="
                flex
                items-center
                gap-3
                px-5
                py-3
                text-sm
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <Settings size={18} />
              Account Settings
            </Link>

            <Link
              href="/change-password"
              className="
                flex
                items-center
                gap-3
                px-5
                py-3
                text-sm
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >
              <KeyRound size={18} />
              Change Password
            </Link>
          </div>

          {/* Logout */}

          <div className="border-t border-slate-100 p-3">
            <button
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
