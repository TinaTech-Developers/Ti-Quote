"use client";

import { CreditCard, FileText, User, Wallet } from "lucide-react";

interface Props {
  statement: {
    client: {
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
  };
}

export default function ClientStatementSummary({ statement }: Props) {
  const cards = [
    {
      title: "Total Invoices",
      value: `$${statement.summary.totalInvoices.toFixed(2)}`,
      icon: FileText,
      color: "bg-blue-500",
    },

    {
      title: "Payments Received",
      value: `$${statement.summary.totalPayments.toFixed(2)}`,
      icon: CreditCard,
      color: "bg-green-500",
    },

    {
      title: "Outstanding Balance",
      value: `$${statement.summary.balance.toFixed(2)}`,
      icon: Wallet,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-5">
      {/* CLIENT INFORMATION */}

      <div
        className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-[#0B3954]
            text-white
            "
          >
            <User size={24} />
          </div>

          <div>
            <h2
              className="
              text-xl
              font-bold
              text-slate-800
            "
            >
              {statement.client.name}
            </h2>

            {statement.client.companyName && (
              <p className="text-sm text-slate-500">
                {statement.client.companyName}
              </p>
            )}

            <div
              className="
              mt-2
              space-y-1
              text-sm
              text-slate-500
            "
            >
              {statement.client.email && <p>Email: {statement.client.email}</p>}

              {statement.client.phone && <p>Phone: {statement.client.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div
        className="
        grid
        gap-5
        md:grid-cols-3
      "
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              "
            >
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <p
                    className="
                    text-sm
                    text-slate-500
                  "
                  >
                    {card.title}
                  </p>

                  <h3
                    className="
                    mt-2
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                  >
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    text-white
                    ${card.color}
                  `}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
