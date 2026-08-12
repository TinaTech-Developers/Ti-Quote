"use client";

import { Eye } from "lucide-react";
import UserStatus from "./UserStatus";
import UserActions from "./UserActions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  active: boolean;
  companyId: string;
  createdAt: string;

  role: {
    id: string;
    name: string;
  } | null;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await fetch("/api/users");

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  function roleStyle(role: string) {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700";

      case "ADMIN":
        return "bg-blue-100 text-blue-700";

      case "STAFF":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function statusStyle(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "INACTIVE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          p-10
          text-center
          text-slate-500
        "
      >
        Loading users...
      </div>
    );
  }

  return (
    <div
      className="
bg-white
rounded-2xl
border
border-slate-200
shadow-sm
overflow-hidden
"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead
            className="
bg-slate-50
border-b
border-slate-100
"
          >
            <tr className="text-left text-slate-500">
              <th className="px-6 py-4">User</th>

              <th className="px-6 py-4">Email</th>

              <th className="px-6 py-4">Role</th>

              <th className="px-6 py-4">Company</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4">Created</th>

              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="
border-b
border-slate-100
hover:bg-slate-50
transition
"
              >
                <td
                  className="
px-6
py-4
font-semibold
text-slate-800
"
                >
                  {user.fullName}
                </td>

                <td
                  className="
px-6
py-4
text-slate-600
"
                >
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
px-3
py-1
rounded-full
text-xs
font-semibold
${roleStyle(user.role?.name ?? "STAFF")}
`}
                  >
                    {user.role?.name ?? "No Role"}
                  </span>
                </td>

                <td
                  className="
px-6
py-4
text-slate-600
"
                >
                  {user.companyId || "System"}
                </td>

                <td className="px-6 py-4">
                  <UserStatus status={user.active ? "ACTIVE" : "INACTIVE"} />
                </td>

                <td
                  className="
px-6
py-4
text-slate-500
"
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/super-admin/users/${user.id}`}
                      className="
p-2
rounded-lg
text-slate-500
hover:bg-slate-100
"
                    >
                      <Eye size={17} />
                    </Link>

                    <Link
                      href={`/super-admin/users/${user.id}/edit`}
                      className="
p-2
rounded-lg
text-blue-600
hover:bg-blue-50
"
                    >
                      <Pencil size={17} />
                    </Link>

                    <button
                      className="
p-2
rounded-lg
text-red-600
hover:bg-red-50
"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
py-10
text-center
text-slate-400
"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
