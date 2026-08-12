import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import ClientForm from "../../components/clients/ClientForm";


export default function CreateClientPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/admin/clients"
              className="transition hover:text-[#0097A7]"
            >
              Clients
            </Link>

            <span>/</span>

            <span className="text-slate-700">Add Client</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-cyan-50
                text-[#0097A7]
              "
            >
              <Users size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">Add Client</h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new client for your company.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/clients"
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
            px-5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <ArrowLeft size={17} />
          Back to Clients
        </Link>
      </div>

      {/* FORM */}

      <ClientForm mode="create" />
    </div>
  );
}
