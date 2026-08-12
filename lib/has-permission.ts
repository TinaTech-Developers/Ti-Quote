export function hasPermission(user: any, permission: string) {
  const permissions = user.role.permissions.map((p: any) => p.permission.name);

  return permissions.includes(permission);
}
