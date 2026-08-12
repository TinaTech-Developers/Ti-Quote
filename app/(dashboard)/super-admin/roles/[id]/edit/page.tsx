"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoleForm from "../../../../components/roles/RoleForm";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;

  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await fetch(`/api/roles/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch role");
        }

        const data = await response.json();

        setRole(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRole();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading role...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Role not found</h1>

        <Link
          href="/super-admin/roles"
          className="text-blue-600 hover:underline"
        >
          Back to Roles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>

          <p className="text-sm text-gray-500 mt-1">
            Update role information and permissions.
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

      {/* Form */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <RoleForm role={role} />
      </div>
    </div>
  );
}
