import PermissionTable from "../../components/permissions/PermissionsTable";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>

        <p className="text-sm text-gray-500 mt-1">Manage system permissions.</p>
      </div>

      <PermissionTable />
    </div>
  );
}
