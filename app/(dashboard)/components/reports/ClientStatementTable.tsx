"use client";

interface Transaction {
  id: string;

  type: string;

  reference: string;

  date: string;

  description: string;

  debit: number;

  credit: number;
}

interface Props {
  transactions: Transaction[];
}

export default function ClientStatementTable({ transactions }: Props) {
  return (
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
      <div
        className="
        border-b
        border-slate-200
        px-6
        py-5
        "
      >
        <h2
          className="
          text-lg
          font-semibold
          text-slate-800
        "
        >
          Transaction History
        </h2>

        <p
          className="
          mt-1
          text-sm
          text-slate-500
        "
        >
          Complete invoice and payment history.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr
              className="
              text-left
              text-sm
              font-semibold
              text-slate-700
              "
            >
              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4">Type</th>

              <th className="px-5 py-4">Reference</th>

              <th className="px-5 py-4">Description</th>

              <th
                className="
                px-5
                py-4
                text-right
              "
              >
                Debit
              </th>

              <th
                className="
                px-5
                py-4
                text-right
              "
              >
                Credit
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="
                border-t
                hover:bg-slate-50
                transition
                "
              >
                <td
                  className="
                  px-5
                  py-4
                  text-sm
                  text-slate-600
                "
                >
                  {new Date(transaction.date).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    
                    ${
                      transaction.type === "INVOICE" ?
                        "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                    }
                    `}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td
                  className="
                  px-5
                  py-4
                  font-medium
                  text-slate-700
                "
                >
                  {transaction.reference}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-slate-500
                "
                >
                  {transaction.description}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-right
                  font-medium
                  text-red-600
                "
                >
                  {transaction.debit > 0 ?
                    `$${transaction.debit.toFixed(2)}`
                  : "-"}
                </td>

                <td
                  className="
                  px-5
                  py-4
                  text-right
                  font-medium
                  text-green-600
                "
                >
                  {transaction.credit > 0 ?
                    `$${transaction.credit.toFixed(2)}`
                  : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
