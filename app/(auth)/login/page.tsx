"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid login details");
        return;
      }

      if (data.user.role === "SUPER_ADMIN") {
        router.push("/super-admin/dashboard");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/staff/dashboard");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white ">
      <div className=" border-slate-200 bg-white shadow-2xl">
        <div className="px-6 py-6 ">
          {/* Logo */}
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-[#0B3954] p-4 shadow-lg">
              <Image
                src="/logo.png"
                alt="Trebo Accounting"
                width={70}
                height={70}
                priority
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your Trebo Accounting workspace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-100
                    text-slate-700
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#0B3954] transition hover:text-[#0097A7]"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-[#0097A7]
                    focus:ring-4
                    focus:ring-cyan-100
                    text-slate-700
                  "
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#0B3954] focus:ring-[#0097A7]"
                />
                Remember me
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                h-12
                w-full
                rounded-xl
                bg-[#0B3954]
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-[#092C42]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-3 border-t border-slate-100 pt-5">
            <p className="text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Ti-Quote System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
