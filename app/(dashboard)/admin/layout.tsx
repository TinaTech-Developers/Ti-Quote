import { redirect } from "next/navigation";

import DashboardShell from "@/app/(dashboard)/components/layout/DashboardShell";
import AdminSidebar from "@/app/(dashboard)/components/admin/AdminSidebar";
import { getCurrentUser } from "@/lib/current-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "ADMIN" && user.role.name !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return <DashboardShell sidebar={<AdminSidebar />}>{children}</DashboardShell>;
}
