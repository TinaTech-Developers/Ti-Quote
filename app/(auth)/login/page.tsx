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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061b2a] px-4 py-10">
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main background gradient */}

        <div className="absolute inset-0 bg-gradient-to-br from-[#061b2a] via-[#08263a] to-[#041521]" />

        {/* =====================================================
            LARGE GLOW - TOP LEFT
        ====================================================== */}

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/20
            blur-[100px]
            animate-pulse
          "
        />

        {/* =====================================================
            LARGE GLOW - BOTTOM RIGHT
        ====================================================== */}

        <div
          className="
            absolute
            -bottom-48
            -right-40
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-600/20
            blur-[120px]
            animate-pulse
          "
          style={{
            animationDelay: "2s",
          }}
        />

        {/* =====================================================
            CENTER GLOW
        ====================================================== */}

        <div
          className="
            absolute
            left-[45%]
            top-[30%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#0097A7]/10
            blur-[100px]
            animate-pulse
          "
          style={{
            animationDelay: "4s",
          }}
        />

        {/* =====================================================
            TOP RIGHT GLOW
        ====================================================== */}

        <div
          className="
            absolute
            -right-20
            -top-20
            h-[300px]
            w-[300px]
            rounded-full
            bg-cyan-400/10
            blur-[90px]
          "
        />

        {/* =====================================================
            BOTTOM LEFT GLOW
        ====================================================== */}

        <div
          className="
            absolute
            -bottom-32
            -left-20
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#0B3954]/50
            blur-[90px]
          "
        />

        {/* =====================================================
            FLOATING LIGHT 1
        ====================================================== */}

        <div
          className="
            absolute
            left-[10%]
            top-[18%]
            h-2
            w-2
            rounded-full
            bg-cyan-300/70
            shadow-[0_0_20px_rgba(103,232,249,0.8)]
            animate-bounce
          "
          style={{
            animationDuration: "4s",
          }}
        />

        {/* =====================================================
            FLOATING LIGHT 2
        ====================================================== */}

        <div
          className="
            absolute
            left-[18%]
            top-[70%]
            h-1.5
            w-1.5
            rounded-full
            bg-cyan-200/50
            shadow-[0_0_15px_rgba(103,232,249,0.6)]
            animate-pulse
          "
        />

        {/* =====================================================
            FLOATING LIGHT 3
        ====================================================== */}

        <div
          className="
            absolute
            right-[15%]
            top-[22%]
            h-2
            w-2
            rounded-full
            bg-white/50
            shadow-[0_0_18px_rgba(255,255,255,0.5)]
            animate-pulse
          "
          style={{
            animationDelay: "1s",
          }}
        />

        {/* =====================================================
            FLOATING LIGHT 4
        ====================================================== */}

        <div
          className="
            absolute
            right-[22%]
            bottom-[20%]
            h-3
            w-3
            rounded-full
            bg-cyan-300/40
            shadow-[0_0_25px_rgba(103,232,249,0.5)]
            animate-bounce
          "
          style={{
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />

        {/* =====================================================
            FLOATING LIGHT 5
        ====================================================== */}

        <div
          className="
            absolute
            left-[35%]
            bottom-[15%]
            h-1.5
            w-1.5
            rounded-full
            bg-blue-300/50
            animate-pulse
          "
          style={{
            animationDelay: "2s",
          }}
        />

        {/* =====================================================
            FLOATING LIGHT 6
        ====================================================== */}

        <div
          className="
            absolute
            right-[35%]
            top-[12%]
            h-1
            w-1
            rounded-full
            bg-cyan-300/60
            shadow-[0_0_12px_rgba(103,232,249,0.7)]
            animate-pulse
          "
          style={{
            animationDelay: "3s",
          }}
        />

        {/* =====================================================
            DECORATIVE ORBIT - LEFT
        ====================================================== */}

        <div
          className="
            absolute
            -left-24
            top-[35%]
            h-[300px]
            w-[300px]
            rounded-full
            border
            border-cyan-400/10
          "
        />

        <div
          className="
            absolute
            -left-12
            top-[40%]
            h-[200px]
            w-[200px]
            rounded-full
            border
            border-cyan-400/10
          "
        />

        {/* =====================================================
            DECORATIVE ORBIT - RIGHT
        ====================================================== */}

        <div
          className="
            absolute
            -right-28
            top-[10%]
            h-[400px]
            w-[400px]
            rounded-full
            border
            border-blue-400/10
          "
        />

        <div
          className="
            absolute
            -right-16
            top-[18%]
            h-[280px]
            w-[280px]
            rounded-full
            border
            border-cyan-400/5
          "
        />

        {/* =====================================================
            SUBTLE GRID
        ====================================================== */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* =====================================================
            RADIAL VIGNETTE
        ====================================================== */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.28)_100%)]" />
      </div>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-lg">
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-white/20
            bg-white/95
            shadow-2xl
            backdrop-blur-xl
          "
        >
          {/* =====================================================
              TOP ACCENT
          ====================================================== */}

          <div className="h-10 w-full bg-gradient-to-r from-[#0B3954] via-[#0097A7] to-[#0B3954]" />

          <div className="px-6 py-8 sm:px-8">
            {/* =====================================================
                LOGO
            ====================================================== */}

            <div className="mb-5 flex justify-center">
              <div
                className="
                  rounded-2xl
                  bg-[#0B3954]
                  p-4
                  shadow-xl
                  ring-4
                  ring-cyan-100
                "
              >
                <Image
                  src="/logo.png"
                  alt="Trebo Accounting"
                  width={70}
                  height={70}
                  priority
                />
              </div>
            </div>

            {/* =====================================================
                HEADING
            ====================================================== */}

            <div className="mb-7 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your Trebo Accounting workspace.
              </p>
            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* =====================================================
                FORM
            ====================================================== */}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
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
                      text-slate-700
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-100
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="
                      text-sm
                      font-medium
                      text-[#0B3954]
                      transition
                      hover:text-[#0097A7]
                    "
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={20}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
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
                      text-slate-700
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[#0097A7]
                      focus:ring-4
                      focus:ring-cyan-100
                    "
                  />
                </div>
              </div>

              {/* REMEMBER ME */}

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      text-[#0B3954]
                      focus:ring-[#0097A7]
                    "
                  />
                  Remember me
                </label>
              </div>

              {/* BUTTON */}

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
                  hover:-translate-y-0.5
                  hover:bg-[#092C42]
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
                "
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Ti-Quote System. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BRANDING
        ====================================================== */}

        <p className="mt-5 text-center text-xs text-white/50">
          Secure accounting management platform
        </p>
      </div>
    </main>
  );
}
