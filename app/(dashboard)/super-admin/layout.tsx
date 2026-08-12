import DashboardShell from "../components/layout/DashboardShell";
import SuperAdminSidebar from "../components/layout/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell sidebar={<SuperAdminSidebar />}>{children}</DashboardShell>
  );
}
