"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
}

export default function UserActions({ userId }: UserActionsProps) {
  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    // API delete will be connected later

    console.log("Delete user:", userId);
  }

  return (
    <div className="flex gap-2">
      {/* View */}

      <Link
        href={`/super-admin/users/${userId}`}
        className="
          p-2
          rounded-lg
          text-slate-500
          hover:bg-slate-100
          transition
        "
      >
        <Eye size={17} />
      </Link>

      {/* Edit */}

      <Link
        href={`/super-admin/users/${userId}/edit`}
        className="
          p-2
          rounded-lg
          text-blue-600
          hover:bg-blue-50
          transition
        "
      >
        <Pencil size={17} />
      </Link>

      {/* Delete */}

      <button
        onClick={handleDelete}
        className="
          p-2
          rounded-lg
          text-red-600
          hover:bg-red-50
          transition
        "
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
