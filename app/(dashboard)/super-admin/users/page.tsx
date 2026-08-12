"use client";

import Link from "next/link";
import { Plus, Users } from "lucide-react";

import UserTable from "../../components/users/UserTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Users Management
          </h1>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Manage system users, roles and access.
          </p>
        </div>

        <Link
          href="/super-admin/users/create"
          className="
            inline-flex
            items-center
            gap-2
            bg-[#0B3954]
            hover:bg-[#092C42]
            text-white
            px-5
            py-3
            rounded-xl
            font-medium
            transition
          "
        >
          <Plus size={18} />
          Add User
        </Link>
      </div>

      {/* Summary Card */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            h-12
            w-12
            rounded-xl
            bg-[#0B3954]
            text-white
            flex
            items-center
            justify-center
          "
        >
          <Users size={24} />
        </div>

        <div>
          <p className="text-sm text-slate-500">Total Users</p>

          <h2
            className="
            text-2xl
            font-bold
            text-slate-800
          "
          >
            0
          </h2>
        </div>
      </div>

      {/* Users Table */}

      <UserTable />
    </div>
  );
}
