import CompanySettingsForm from "../components/settings/CompanySettingsForm";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function SettingsPage() {
  const user = await requirePermission("settings.view");

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
    include: {
      settings: true,
    },
  });

  if (!company) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Company not found</h2>

        <p className="mt-1 text-sm text-red-600">
          We could not load your company settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your company and accounting system settings.
        </p>
      </div>

      {/* SETTINGS NAVIGATION */}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* SIDEBAR */}

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-1">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Company
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Invoice
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Quotations
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Payments
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Email
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Appearance
            </div>

            <div className="rounded-xl px-4 py-3 text-sm text-slate-500">
              Security
            </div>
          </div>
        </aside>

        {/* CONTENT */}

        <main>
          <CompanySettingsForm company={company} />
        </main>
      </div>
    </div>
  );
}
