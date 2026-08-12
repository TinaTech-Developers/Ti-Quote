import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Shield, Building2, Calendar } from "lucide-react";

import { prisma } from "@/lib/prisma";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailsPage({ params }: UserPageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
      company: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-4">
        <Link
          href="/super-admin/users"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Details</h1>

          <p className="text-sm text-slate-500">
            View user account information
          </p>
        </div>
      </div>

      {/* Profile */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {user.fullName}
            </h2>

            <p className="text-slate-500">{user.email}</p>
          </div>

          <Link
            href={`/super-admin/users/${user.id}/edit`}
            className="bg-[#0B3954] text-white px-5 py-3 rounded-xl font-medium"
          >
            Edit User
          </Link>
        </div>
      </div>

      {/* Information */}

      <div className="grid md:grid-cols-2 gap-5">
        <InfoCard icon={<Mail size={20} />} title="Email" value={user.email} />

        <InfoCard
          icon={<Shield size={20} />}
          title="Role"
          value={user.role.name}
        />

        <InfoCard
          icon={<Building2 size={20} />}
          title="Company"
          value={user.company?.name ?? "No Company"}
        />

        <InfoCard
          icon={<Shield size={20} />}
          title="Status"
          value={user.active ? "Active" : "Inactive"}
        />

        <InfoCard
          icon={<Calendar size={20} />}
          title="Created"
          value={new Date(user.createdAt).toLocaleDateString()}
        />

        <InfoCard
          icon={<Calendar size={20} />}
          title="Last Updated"
          value={new Date(user.updatedAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 items-center">
      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0B3954]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>

        <p className="font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
