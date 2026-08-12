"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Shield, Users } from "lucide-react";
import DeleteRoleButton from "./DeleteRoleButton";

interface Role {
  id: string;
  name: string;
  description?: string | null;

  users?: {
    id: string;
  }[];

  permissions?: {
    permission: {
      id: string;
      name: string;
    };
  }[];

  _count?: {
    users: number;
    permissions: number;
  };
}

export default function RoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  async function fetchRoles() {
    try {
      const res = await fetch("/api/roles");

      const data = await res.json();

      setRoles(data);
      setFilteredRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredRoles(
      roles.filter(
        (role) =>
          role.name.toLowerCase().includes(value) ||
          role.description?.toLowerCase().includes(value),
      ),
    );
  }, [search, roles]);

  const totalPermissions = (role: Role) => {
    if (role._count) return role._count.permissions;

    return role.permissions?.length ?? 0;
  };

  const totalUsers = (role: Role) => {
    if (role._count) return role._count.users;

    return role.users?.length ?? 0;
  };

  const roleBadge = useMemo(
    () => ({
      SUPER_ADMIN: "bg-red-100 text-red-700",
      ADMIN: "bg-blue-100 text-blue-700",
      STAFF: "bg-green-100 text-green-700",
    }),
    [],
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Roles</h2>

          <p className="text-sm text-slate-500">
            Manage user roles and permissions.
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
          New Role
        </Link>
      </div>

      {/* Search */}

      <div className="border-b border-slate-200 p-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              py-3
              pl-11
              pr-4
              outline-none
              focus:ring-2
              focus:ring-[#0097A7]
              text-gray-800
            "
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4 font-semibold">Role</th>

              <th className="px-6 py-4 font-semibold">Description</th>

              <th className="px-6 py-4 font-semibold text-center">Users</th>

              <th className="px-6 py-4 font-semibold text-center">
                Permissions
              </th>

              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-500">
                  No roles found.
                </td>
              </tr>
            )}

            {filteredRoles.map((role) => (
              <tr
                key={role.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2">
                      <Shield className="text-[#0B3954]" size={18} />
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                          roleBadge[role.name as keyof typeof roleBadge] ??
                          "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      {role.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {role.description || "-"}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="text-slate-400" size={16} />

                    <span>{totalUsers(role)}</span>
                  </div>
                </td>

                <td className="px-6 py-5 text-center">
                  {totalPermissions(role)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/super-admin/roles/${role.id}`}
                      className="
                        rounded-lg
                        p-2
                        text-slate-500
                        hover:bg-slate-100
                      "
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      href={`/super-admin/roles/${role.id}/edit`}
                      className="
                        rounded-lg
                        p-2
                        text-blue-600
                        hover:bg-blue-50
                      "
                    >
                      <Pencil size={18} />
                    </Link>

                    <DeleteRoleButton id={role.id} onDeleted={fetchRoles}>
                      <Trash2 size={18} />
                    </DeleteRoleButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
