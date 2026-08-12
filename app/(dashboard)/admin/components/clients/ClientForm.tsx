"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface Client {
  id?: string;
  name?: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  taxNumber?: string | null;
  active?: boolean;
}

interface Props {
  client?: Client;
  mode?: "create" | "edit";
}

export default function ClientForm({ client, mode = "create" }: Props) {
  const router = useRouter();

  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * Populate form when editing
   */

  useEffect(() => {
    if (!client) return;

    setName(client.name || "");
    setCompanyName(client.companyName || "");
    setEmail(client.email || "");
    setPhone(client.phone || "");
    setAddress(client.address || "");
    setCity(client.city || "");
    setCountry(client.country || "");
    setTaxNumber(client.taxNumber || "");
    setActive(client.active !== false);
  }, [client]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        companyName: companyName.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        taxNumber: taxNumber.trim() || null,
        active,
      };

      const url = isEdit ? `/api/clients/${client?.id}` : "/api/clients";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${isEdit ? "update" : "create"} client.`,
        );
      }

      /*
       * Go back to clients after successful save.
       */

      router.push("/admin/clients");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* BASIC INFORMATION */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-cyan-50
                text-[#0097A7]
              "
            >
              <User size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Client Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information about the client.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {/* CLIENT NAME */}

          <div>
            <label
              htmlFor="name"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Client Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <User
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
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter client name"
                required
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#0097A7]
                  focus:ring-4
                  focus:ring-cyan-50
                "
              />
            </div>
          </div>

          {/* COMPANY */}

          <div>
            <label
              htmlFor="companyName"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Company Name
            </label>

            <div className="relative">
              <Building2
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
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company or organization"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#0097A7]
                  focus:ring-4
                  focus:ring-cyan-50
                "
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
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
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#0097A7]
                  focus:ring-4
                  focus:ring-cyan-50
                "
              />
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label
              htmlFor="phone"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Phone Number
            </label>

            <div className="relative">
              <Phone
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
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+263 7X XXX XXXX"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-[#0097A7]
                  focus:ring-4
                  focus:ring-cyan-50
                "
              />
            </div>
          </div>

          {/* TAX NUMBER */}

          <div className="md:col-span-2">
            <label
              htmlFor="taxNumber"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Tax Number
            </label>

            <input
              id="taxNumber"
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="Tax / VAT number"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:ring-4
                focus:ring-cyan-50
              "
            />
          </div>
        </div>
      </div>

      {/* ADDRESS */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-cyan-50
                text-[#0097A7]
              "
            >
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">Address</h2>

              <p className="text-sm text-slate-500">
                Client location and address details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {/* ADDRESS */}

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Street Address
            </label>

            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address"
              rows={3}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:ring-4
                focus:ring-cyan-50
              "
            />
          </div>

          {/* CITY */}

          <div>
            <label
              htmlFor="city"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              City
            </label>

            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Harare"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:ring-4
                focus:ring-cyan-50
              "
            />
          </div>

          {/* COUNTRY */}

          <div>
            <label
              htmlFor="country"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              "
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Zimbabwe"
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                text-sm
                outline-none
                transition
                focus:border-[#0097A7]
                focus:ring-4
                focus:ring-cyan-50
              "
            />
          </div>
        </div>
      </div>

      {/* STATUS */}

      {isEdit && (
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-800">Client Status</h2>

              <p className="mt-1 text-sm text-slate-500">
                Inactive clients won't appear as active clients.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className={`
                relative
                h-7
                w-12
                rounded-full
                transition
                ${active ? "bg-[#0097A7]" : "bg-slate-300"}
              `}
              aria-label="Toggle client status"
            >
              <span
                className={`
                  absolute
                  top-1
                  h-5
                  w-5
                  rounded-full
                  bg-white
                  shadow
                  transition
                  ${active ? "left-6" : "left-1"}
                `}
              />
            </button>
          </div>
        </div>
      )}

      {/* ACTIONS */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          sm:flex-row
          sm:justify-between
        "
      >
        <button
          type="button"
          onClick={() => router.push("/admin/clients")}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-300
            px-5
            text-sm
            font-medium
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          <ArrowLeft size={17} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0B3954]
            px-6
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#092C42]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ?
            <>
              <Loader2 size={18} className="animate-spin" />

              {isEdit ? "Updating..." : "Creating..."}
            </>
          : <>
              <Save size={18} />

              {isEdit ? "Update Client" : "Create Client"}
            </>
          }
        </button>
      </div>
    </form>
  );
}
