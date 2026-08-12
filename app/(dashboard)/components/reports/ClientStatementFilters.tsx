"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

interface Client {
  id: string;

  name: string;

  companyName?: string;

  email?: string;
}

interface Props {
  clients: Client[];

  clientId: string;

  from: string;

  to: string;

  onClientChange: (value: string) => void;

  onFromChange: (value: string) => void;

  onToChange: (value: string) => void;

  onApply: () => void;
}

export default function ClientStatementFilters({
  clients,

  clientId,

  from,

  to,

  onClientChange,

  onFromChange,

  onToChange,

  onApply,
}: Props) {
  const [search, setSearch] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const filteredClients = clients
    .filter((client) => {
      const value = search.toLowerCase();

      return (
        client.name.toLowerCase().includes(value) ||
        client.companyName?.toLowerCase().includes(value) ||
        client.email?.toLowerCase().includes(value)
      );
    })
    .slice(0, 5);

  // update search text when selected client changes

  useEffect(() => {
    const selected = clients.find((client) => client.id === clientId);

    if (selected) {
      setSearch(selected.name);
    }
  }, [clientId, clients]);

  function selectClient(client: Client) {
    onClientChange(client.id);

    setSearch(client.name);

    setShowDropdown(false);
  }

  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
      "
    >
      <div
        className="
        grid
        gap-4
        md:grid-cols-4
        "
      >
        {/* CLIENT SEARCH */}

        <div className="relative">
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            "
          >
            Search Client
          </label>

          <div className="relative">
            <Search
              size={17}
              className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />

            <input
              value={search}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearch(e.target.value);

                setShowDropdown(true);

                // clear selected client when typing

                onClientChange("");
              }}
              placeholder="Search client name..."
              className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              pl-10
              pr-10
              text-sm
              outline-none
              focus:border-[#0097A7]
              focus:ring-4
              focus:ring-cyan-100
              "
            />

            <ChevronDown
              size={17}
              className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />
          </div>

          {showDropdown && search && filteredClients.length > 0 && (
            <div
              className="
              absolute
              z-50
              mt-2
              w-full
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-lg
              "
            >
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => selectClient(client)}
                  className="
                  w-full
                  px-4
                  py-3
                  text-left
                  transition
                  hover:bg-slate-50
                  "
                >
                  <p
                    className="
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                  >
                    {client.name}
                  </p>

                  {client.companyName && (
                    <p
                      className="
                      text-xs
                      text-slate-500
                    "
                    >
                      {client.companyName}
                    </p>
                  )}

                  {client.email && (
                    <p
                      className="
                      text-xs
                      text-slate-400
                    "
                    >
                      {client.email}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FROM DATE */}

        <div>
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            "
          >
            From Date
          </label>

          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            text-sm
            outline-none
            focus:border-[#0097A7]
            focus:ring-4
            focus:ring-cyan-100
            "
          />
        </div>

        {/* TO DATE */}

        <div>
          <label
            className="
            mb-2
            block
            text-sm
            font-medium
            text-slate-700
            "
          >
            To Date
          </label>

          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            text-sm
            outline-none
            focus:border-[#0097A7]
            focus:ring-4
            focus:ring-cyan-100
            "
          />
        </div>

        {/* APPLY */}

        <div
          className="
          flex
          items-end
          "
        >
          <button
            onClick={onApply}
            className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            font-semibold
            text-white
            transition
            hover:bg-[#092C42]
            "
          >
            <Search size={18} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
