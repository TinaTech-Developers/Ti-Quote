"use client";

import { useEffect, useState } from "react";
import LogoUpload from "./LogoUpload";

export default function CompanySettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    taxNumber: "",
    currency: "USD",
    logoUrl: "",
  });

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      const res = await fetch("/api/settings/company");

      const data = await res.json();

      setForm({
        name: data.name || "",

        email: data.email || "",

        phone: data.phone || "",

        address: data.address || "",

        website: data.website || "",

        taxNumber: data.taxNumber || "",

        currency: data.currency || "USD",

        logoUrl: data.logoUrl || "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const res = await fetch("/api/settings/company", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Company settings updated successfully");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading company settings...</div>;
  }

  return (
    <form
      onSubmit={saveCompany}
      className="
bg-white
border
border-slate-200
rounded-2xl
p-6
space-y-6
"
    >
      <h2
        className="
text-xl
font-bold
text-slate-800
"
      >
        Company Information
      </h2>

      <LogoUpload
        logo={form.logoUrl}
        setLogo={(url) =>
          setForm({
            ...form,
            logoUrl: url,
          })
        }
      />

      <div
        className="
grid
md:grid-cols-2
gap-5
"
      >
        {[
          ["name", "Company Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["website", "Website"],
          ["taxNumber", "Tax Number"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="text-sm text-slate-600">{label}</label>

            <input
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value,
                })
              }
              className="
mt-2
w-full
rounded-xl
border
px-4
py-3
text-gray-800
"
            />
          </div>
        ))}

        <div>
          <label className="text-sm text-slate-600">Currency</label>

          <select
            value={form.currency}
            onChange={(e) =>
              setForm({
                ...form,
                currency: e.target.value,
              })
            }
            className="
mt-2
w-full
rounded-xl
border
px-4
py-3
text-gray-800
"
          >
            <option>USD</option>
            <option>ZWL</option>
            <option>ZAR</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-600">Address</label>

        <textarea
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
          className="
mt-2
w-full
rounded-xl
border
px-4
py-3
text-gray-800
"
        />
      </div>

      <button
        disabled={saving}
        className="
bg-[#0B3954]
text-white
px-6
py-3
rounded-xl
font-semibold
"
      >
        {saving ? "Saving..." : "Save Company Settings"}
      </button>

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
