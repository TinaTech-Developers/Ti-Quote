"use client";

import { useState } from "react";

export default function InvoiceSettingsForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form
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
      <h2
        className="
text-lg
font-bold
text-slate-800
"
      >
        Invoice Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Invoice Prefix
          </label>

          <input
            placeholder="INV"
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
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Quotation Prefix
          </label>

          <input
            placeholder="QTN"
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
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Payment Prefix
          </label>

          <input
            placeholder="PAY"
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
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Default Tax (%)
          </label>

          <input
            type="number"
            placeholder="15"
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
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="
rounded-xl
bg-[#0B3954]
px-6
py-3
font-semibold
text-white
hover:bg-[#092C42]
disabled:opacity-50
"
      >
        {loading ? "Saving..." : "Save Invoice Settings"}
      </button>
    </form>
  );
}
