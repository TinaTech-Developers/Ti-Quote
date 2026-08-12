import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserForm from "../../../components/users/UserForm";

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-4">
        <Link
          href="/super-admin/users"
          className="
            p-2
            rounded-lg
            hover:bg-slate-100
            text-slate-600
          "
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Create User
          </h1>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            Add a new system user and assign access.
          </p>
        </div>
      </div>

      {/* Form */}

      <UserForm />
    </div>
  );
}
