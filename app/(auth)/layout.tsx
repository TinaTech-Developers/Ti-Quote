import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </main>
  );
}
