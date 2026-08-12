"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Search, Users } from "lucide-react";
import DeleteClientButton from "./DeleteClientButton";

interface Client {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export default function ClientTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function fetchClients() {
    try {
      setLoading(true);

      const res = await fetch("/api/clients", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch clients");
      }

      setClients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const q = search.toLowerCase();

      return (
        client.name.toLowerCase().includes(q) ||
        client.contactPerson?.toLowerCase().includes(q) ||
        client.email?.toLowerCase().includes(q) ||
        client.phone?.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-slate-500">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              py-2
              pl-10
              pr-4
              outline-none
              focus:border-blue-600
              text-gray-700
            "
          />
        </div>

        <Link
          href="/super-admin/clients/new"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            hover:bg-blue-700
          "
        >
          <Plus size={18} />
          New Client
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left text-sm">
              <th className="px-5 py-3 text-gray-800">Client</th>
              <th className="px-5 py-3 text-gray-800">Contact</th>
              <th className="px-5 py-3 text-gray-800">Email</th>
              <th className="px-5 py-3 text-gray-800">Phone</th>
              <th className="px-5 py-3 text-gray-800">Location</th>
              <th className="px-5 py-3 text-gray-800">Status</th>
              <th className="px-5 py-3 text-gray-800 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.length === 0 ?
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Users className="mx-auto mb-3 text-slate-300" size={42} />

                  <h3 className="font-semibold text-slate-700">
                    No clients found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add your first client to get started.
                  </p>
                </td>
              </tr>
            : filteredClients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {client.name}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {client.contactPerson || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {client.email || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {client.phone || "-"}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {[client.city, client.country].filter(Boolean).join(", ") ||
                      "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium z-20 ${
                        client.status === "ACTIVE" ?
                          "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/super-admin/clients/${client.id}`}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                      >
                        <Eye size={18} color="gray" />
                      </Link>

                      <Link
                        href={`/super-admin/clients/${client.id}/edit`}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                      >
                        <Pencil size={18} color="gray" />
                      </Link>

                      <DeleteClientButton
                        id={client.id}
                        onDeleted={fetchClients}
                      />
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
