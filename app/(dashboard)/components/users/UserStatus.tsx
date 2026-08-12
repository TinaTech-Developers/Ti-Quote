"use client";

interface UserStatusProps {
  status: string;
}

export default function UserStatus({ status }: UserStatusProps) {
  function getStyle(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "INACTIVE":
        return "bg-red-100 text-red-700";

      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${getStyle(status)}
      `}
    >
      {status}
    </span>
  );
}
