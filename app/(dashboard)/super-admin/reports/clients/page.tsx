"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Users } from "lucide-react";

import ClientStatementFilters from "@/app/(dashboard)/components/reports/ClientStatementFilters";
import ClientStatementSummary from "@/app/(dashboard)/components/reports/ClientStatementSummary";
import ClientStatementTable from "@/app/(dashboard)/components/reports/ClientStatementTable";
import ExportButtons from "@/app/(dashboard)/components/reports/ExportButtons";

interface Transaction {
  id: string;
  type: string;
  reference: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
}

interface Statement {
  client: {
    id: string;
    name: string;
    companyName?: string;
    email?: string;
    phone?: string;
  };

  summary: {
    totalInvoices: number;
    totalPayments: number;
    balance: number;
  };

  transactions: Transaction[];
}

export default function ClientStatementsPage() {
  const [loading, setLoading] = useState(true);

  const [statements, setStatements] = useState<Statement[]>([]);

  const [clientId, setClientId] = useState("");

  const [clients, setClients] = useState([]);

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  async function loadStatements() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (clientId) params.append("clientId", clientId);

      if (from) params.append("from", from);

      if (to) params.append("to", to);

      const response = await fetch(`/api/reports/clients?${params.toString()}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStatements(data.statements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  async function loadClients() {
    const res = await fetch("/api/clients");

    const data = await res.json();

    setClients(data);
  }

  useEffect(() => {
    loadStatements();
    loadClients();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div
        className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
      >
        <div>
          <h1
            className="
            text-xl
            font-bold
            text-slate-800
          "
          >
            Client Statements
          </h1>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
          "
          >
            View customer balances and transaction history.
          </p>
        </div>

        <button
          onClick={loadStatements}
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#0B3954]
          px-5
          py-3
          text-white
          hover:bg-[#092C42]
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* FILTERS */}

      <ClientStatementFilters
        clients={clients}
        clientId={clientId}
        from={from}
        to={to}
        onClientChange={setClientId}
        onFromChange={setFrom}
        onToChange={setTo}
        onApply={loadStatements}
      />

      {loading ?
        <div
          className="
          flex
          h-72
          items-center
          justify-center
          rounded-2xl
          border
          bg-white
        "
        >
          <Loader2 size={34} className="animate-spin text-slate-400" />
        </div>
      : statements.length === 0 ?
        <div
          className="
          flex
          h-72
          flex-col
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          bg-white
        "
        >
          <Users size={42} className="text-slate-400" />

          <p className="text-slate-500">No client statements found.</p>
        </div>
      : statements.map((statement) => (
          <div key={statement.client.id} className="space-y-5">
            <ClientStatementSummary statement={statement} />

            <div className="flex justify-end">
              <ExportButtons
                title={`${statement.client.name} Statement`}
                fileName="client-statement"
                data={statement.transactions}
              />
            </div>

            <ClientStatementTable transactions={statement.transactions} />
          </div>
        ))
      }
    </div>
  );
}
