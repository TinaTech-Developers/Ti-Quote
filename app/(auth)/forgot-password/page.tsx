"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(
        data.message ||
          "Password reset instructions have been sent to your email.",
      );

      setEmail("");
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-slate-100
        p-6
      "
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Forgot Password</h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your email address and we'll send you a password reset link.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl bg-green-50 p-3 text-center text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>

          <div className="relative mt-2">
            <Mail
              size={20}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type="email"
              required
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                pl-11
                py-3
                rounded-xl
                border
                border-slate-200
                outline-none
                focus:ring-2
                focus:ring-[#0097A7]
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-[#0B3954]
            hover:bg-[#092C42]
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <Link
        href="/login"
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-2
          text-sm
          font-medium
          text-[#0B3954]
          hover:text-[#0097A7]
        "
      >
        <ArrowLeft size={18} />
        Back to Login
      </Link>
    </div>
  );
}
