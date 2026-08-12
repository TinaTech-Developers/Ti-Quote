import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import UserForm from "../../../../components/users/UserForm";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
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
          href={`/super-admin/users/${id}`}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit User</h1>

          <p className="text-sm text-slate-500">
            Update user information and permissions.
          </p>
        </div>
      </div>

      <UserForm
        user={{
          id: user.id,

          name: user.fullName,

          email: user.email,

          roleId: user.roleId,

          status: user.active ? "ACTIVE" : "INACTIVE",
        }}
      />
    </div>
  );
}
