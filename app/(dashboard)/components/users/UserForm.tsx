"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Role {
  id: string;
  name: string;
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;

  roleId?: string;

  status?: string;

  companyId?: string;
}

interface UserFormProps {
  user?: UserData;
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [name, setName] = useState(user?.name || "");

  const [email, setEmail] = useState(user?.email || "");

  const [password, setPassword] = useState("");

  const [roleId, setRoleId] = useState(user?.roleId || "");

  const [status, setStatus] = useState(user?.status || "ACTIVE");

  const [companyId, setCompanyId] = useState(user?.companyId || "");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        const response = await fetch("/api/roles");

        const data = await response.json();

        setRoles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRoles(false);
      }
    }

    loadRoles();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const method = user?.id ? "PUT" : "POST";

      const url = user?.id ? `/api/users/${user.id}` : "/api/users";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: name,

          email,

          password,

          roleId,

          active: status === "ACTIVE",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/super-admin/users");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
space-y-6
"
    >
      {error && (
        <div
          className="
bg-red-50
text-red-600
p-3
rounded-xl
text-sm
"
        >
          {error}
        </div>
      )}

      <div
        className="
grid
md:grid-cols-2
gap-5
"
      >
        {/* Name */}

        <div>
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
focus:ring-[#0097A7] text-gray-800
"
          />
        </div>

        {/* Email */}

        <div>
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
focus:ring-[#0097A7] text-gray-800
"
          />
        </div>

        {/* Password */}

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              user ? "Leave blank to keep password" : "Enter password"
            }
            required={!user}
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
focus:ring-[#0097A7] text-gray-800
"
          />
        </div>

        {/* Role */}

        <div>
          <label className="text-sm font-medium text-slate-700">Role</label>

          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            className="
 mt-2
 w-full
 rounded-xl
 border
 border-slate-200
 px-4
 py-3
 text-gray-800
 "
          >
            <option value="">Select Role</option>

            {loadingRoles ?
              <option>Loading roles...</option>
            : roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            }
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3 text-gray-800
"
          >
            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Company */}

        {/* <div>
          <label className="text-sm font-medium text-slate-700">
            Company ID
          </label>

          <input
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            placeholder="Company ID"
            className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3 text-gray-800
"
          />
        </div> */}
      </div>

      <button
        disabled={loading}
        className="
bg-[#0B3954]
hover:bg-[#092C42]
text-white
px-6
py-3
rounded-xl
font-semibold
disabled:opacity-50
"
      >
        {loading ?
          "Saving..."
        : user ?
          "Update User"
        : "Create User"}
      </button>
    </form>
  );
}
