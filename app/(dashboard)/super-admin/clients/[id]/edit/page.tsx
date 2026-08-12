import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import ClientForm from "../../../../components/clients/ClientForm";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/super-admin" className="hover:text-blue-600">
          Dashboard
        </Link>

        <span>/</span>

        <Link href="/super-admin/clients" className="hover:text-blue-600">
          Clients
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-700">Edit</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <Pencil className="h-7 w-7 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Client</h1>

            <p className="mt-1 text-slate-500">
              Update client information and details.
            </p>
          </div>
        </div>

        <Link
          href={"/super-admin/clients"}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            px-4
            py-2
            hover:bg-slate-50
            text-slate-700
            hover:text-slate-900
          "
        >
          <ArrowLeft size={18} />
          Back to Client
        </Link>
      </div>

      {/* Edit Form */}
      <ClientForm
        initialData={{
          id: client.id,
          name: client.name,
          companyName: client.companyName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          notes: client.notes,
        }}
      />
    </div>
  );
}
