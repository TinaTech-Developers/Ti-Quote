"use client";

import { useEffect, useState } from "react";

interface Permission {
  id: string;
  name: string;
  module: string;
  description?: string;
}

export default function PermissionTable() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const res = await fetch("/api/permissions");

        if (!res.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await res.json();

        setPermissions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading permissions...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left px-6 py-4 text-gray-800 ">Permission</th>

            <th className="text-left px-6 py-4 text-gray-800 ">Module</th>

            <th className="text-left px-6 py-4 text-gray-800 ">Description</th>
          </tr>
        </thead>

        <tbody>
          {permissions.length === 0 ?
            <tr>
              <td colSpan={3} className="text-center py-8 text-gray-500">
                No permissions found
              </td>
            </tr>
          : permissions.map((permission) => (
              <tr key={permission.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-500">
                  {permission.name}
                </td>

                <td className="px-6 py-4 text-gray-500">{permission.module}</td>

                <td className="px-6 py-4 text-gray-500">
                  {permission.description || "-"}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
