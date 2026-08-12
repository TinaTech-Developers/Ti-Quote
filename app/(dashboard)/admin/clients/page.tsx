import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { requirePermission } from "@/lib/permissions";
import ClientTable from "../components/clients/ClientTable";

export default async function AdminClientsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "ADMIN" && user.role.name !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  try {
    await requirePermission("clients.view");
  } catch {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clients</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your company's clients and customer information.
          </p>
        </div>

        <a
          href="/admin/clients/create"
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-[#0B3954]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#092C42]
          "
        >
          + Add Client
        </a>
      </div>

      {/* CLIENT TABLE */}

      <ClientTable />
    </div>
  );
}
