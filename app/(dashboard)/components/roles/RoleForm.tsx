"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Permission {
  id: string;
  name: string;
  description?: string | null;
  module?: string | null;
}

interface RolePermission {
  permissionId: string;
  permission?: {
    id: string;
    name: string;
  };
}

interface Role {
  id?: string;
  name?: string;
  description?: string;
  permissions?: RolePermission[];
}

interface RoleFormProps {
  role?: Role;
  mode?: "create" | "edit";
}

export default function RoleForm({ role, mode = "create" }: RoleFormProps) {
  const router = useRouter();

  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions?.map((p) => p.permissionId) || [],
  );

  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, []);

  async function fetchPermissions() {
    try {
      const response = await fetch("/api/permissions");

      const data = await response.json();

      setPermissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPermissions(false);
    }
  }

  function togglePermission(id: string) {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const method = role?.id ? "PUT" : "POST";

      const url = role?.id ? `/api/roles/${role.id}` : "/api/roles";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
          permissionIds: selectedPermissions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save role");
      }

      router.push("/super-admin/roles");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Group permissions by module

  const groupedPermissions = permissions.reduce(
    (acc: Record<string, Permission[]>, permission) => {
      const module = permission.module || "General";

      if (!acc[module]) {
        acc[module] = [];
      }

      acc[module].push(permission);

      return acc;
    },
    {},
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        shadow-sm
        p-6
        space-y-8
      "
    >
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}

      <div className="space-y-5">
        <h2 className="text-lg font-bold text-slate-800">Role Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Role Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g Administrator"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#0097A7]
                text-gray-800
              "
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#0097A7]
                text-gray-800
              "
            />
          </div>
        </div>
      </div>

      {/* Permissions */}

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Permissions</h2>

          <span
            className="
rounded-full
bg-[#0097A7]/10
px-3
py-1
text-sm
font-medium
text-[#0097A7]
"
          >
            {selectedPermissions.length} selected
          </span>
        </div>

        {loadingPermissions ?
          <div className="rounded-xl bg-slate-50 p-10 text-center text-slate-500">
            Loading permissions...
          </div>
        : <div className="space-y-6">
            {Object.entries(groupedPermissions).map(
              ([module, modulePermissions]) => (
                <div
                  key={module}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    overflow-hidden
                  "
                >
                  <div className="bg-slate-50 px-5 py-3">
                    <h3 className="font-semibold text-slate-800">{module}</h3>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
                    {modulePermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-slate-200
                          p-3
                          hover:bg-slate-50
                        "
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="h-4 w-4 accent-[#0097A7]"
                        />

                        <div>
                          <p className="font-medium text-slate-800">
                            {permission.name}
                          </p>

                          {permission.description && (
                            <p className="text-xs text-slate-500">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        }
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="
            rounded-xl
            border
            border-slate-300
            px-6
            py-3
            font-medium
            text-slate-700
            hover:bg-slate-100
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-[#0B3954]
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[#092C42]
            disabled:opacity-50
          "
        >
          {loading ?
            "Saving..."
          : role ?
            "Update Role"
          : "Create Role"}
        </button>
      </div>
    </form>
  );
}
