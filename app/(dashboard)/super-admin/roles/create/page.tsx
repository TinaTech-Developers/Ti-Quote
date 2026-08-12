"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RoleForm from "../../../components/roles/RoleForm";

export default function CreateRolePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>

          <p className="text-sm text-gray-500 mt-1">
            Create a new system role and assign permissions.
          </p>
        </div>

        <Link
          href="/super-admin/roles"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <RoleForm />
      </div>
    </div>
  );
}
