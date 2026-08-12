"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Users,
  Loader2,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  active?: boolean;
  createdAt?: string;
}

export default function ClientTable() {
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadClients() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/clients", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load clients");
      }

      /*
       * Your API may return the clients directly
       * or inside { clients: [...] }.
       */

      const result = Array.isArray(data) ? data : data.clients || [];

      setClients(result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to load clients.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return clients;
    }

    return clients.filter((client) => {
      return (
        client.name?.toLowerCase().includes(value) ||
        client.companyName?.toLowerCase().includes(value) ||
        client.email?.toLowerCase().includes(value) ||
        client.phone?.toLowerCase().includes(value) ||
        client.city?.toLowerCase().includes(value)
      );
    });
  }, [clients, search]);

  async function handleDelete(client: Client) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(client.id);
    setError("");

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete client.");
      }

      setClients((current) => current.filter((item) => item.id !== client.id));
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to delete client.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* SEARCH */}

        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              pl-10
              pr-4
              text-sm
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-50
            "
          />
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">
          <div className="hidden text-sm text-slate-500 sm:block">
            {filteredClients.length}{" "}
            {filteredClients.length === 1 ? "client" : "clients"}
          </div>

          <button
            type="button"
            onClick={loadClients}
            disabled={loading}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {loading ?
          <div
            className="
              flex
              h-72
              flex-col
              items-center
              justify-center
              gap-3
              text-slate-500
            "
          >
            <Loader2 size={34} className="animate-spin text-[#0097A7]" />

            <p className="text-sm">Loading clients...</p>
          </div>
        : filteredClients.length === 0 ?
          <div
            className="
              flex
              h-72
              flex-col
              items-center
              justify-center
              gap-3
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
              "
            >
              <Users size={28} />
            </div>

            <div>
              <p className="font-semibold text-slate-700">No clients found</p>

              <p className="mt-1 text-sm text-slate-500">
                {search ?
                  "Try changing your search."
                : "Create your first client to get started."}
              </p>
            </div>

            {!search && (
              <Link
                href="/admin/clients/create"
                className="
                  mt-2
                  rounded-xl
                  bg-[#0B3954]
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#092C42]
                "
              >
                Add Client
              </Link>
            )}
          </div>
        : <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* HEADER */}

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Client
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Contact
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Location
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              {/* BODY */}

              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const isDeleting = deletingId === client.id;

                  return (
                    <tr
                      key={client.id}
                      className="
                        transition
                        hover:bg-slate-50/70
                      "
                    >
                      {/* CLIENT */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#0B3954]
                              text-sm
                              font-bold
                              text-white
                            "
                          >
                            {client.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {client.name}
                            </p>

                            {client.companyName && (
                              <p className="truncate text-xs text-slate-500">
                                {client.companyName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-700">
                            {client.email || "—"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {client.phone || "No phone"}
                          </p>
                        </div>
                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {client.city || client.country ?
                            [client.city, client.country]
                              .filter(Boolean)
                              .join(", ")
                          : "—"}
                        </p>

                        {client.address && (
                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            {client.address}
                          </p>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              client.active === false ?
                                "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                            }
                          `}
                        >
                          {client.active === false ? "Inactive" : "Active"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            title="View client"
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-600
                              transition
                              hover:border-[#0097A7]
                              hover:bg-cyan-50
                              hover:text-[#0097A7]
                            "
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            href={`/admin/clients/${client.id}/edit`}
                            title="Edit client"
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-600
                              transition
                              hover:border-blue-300
                              hover:bg-blue-50
                              hover:text-blue-600
                            "
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(client)}
                            title="Delete client"
                            className="
                              inline-flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-red-100
                              text-red-500
                              transition
                              hover:bg-red-50
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {isDeleting ?
                              <Loader2 size={17} className="animate-spin" />
                            : <Trash2 size={17} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
