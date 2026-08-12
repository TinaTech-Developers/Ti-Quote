import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken } from "./auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload || !payload.userId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId as string,
      companyId: payload.companyId as string,
    },

    include: {
      company: true,

      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.active) {
    return null;
  }

  return user;
}
