import { getCurrentUser } from "./current-user";
import { UnauthorizedError, ForbiddenError } from "./errors";

export async function requirePermission(permission: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const permissions = user.role.permissions.map((p) => p.permission.name);

  if (!permissions.includes(permission)) {
    throw new ForbiddenError("Forbidden");
  }

  return user;
}
