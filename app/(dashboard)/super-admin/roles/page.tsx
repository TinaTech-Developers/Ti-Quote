import Link from "next/link";
import { Plus } from "lucide-react";
import RoleTable from "../../components/roles/RoleTable";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Roles & Permissions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage system roles and assign permissions to control user access.
          </p>
        </div>

        <Link
          href="/super-admin/roles/create"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[#092C42]
          "
        >
          <Plus size={18} />
          Create Role
        </Link>
      </div>

      {/* Table */}

      <RoleTable />
    </div>
  );
}
