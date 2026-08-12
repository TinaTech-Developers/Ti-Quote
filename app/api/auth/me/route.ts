import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        message: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        message: "Invalid session",
      },
      {
        status: 401,
      },
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId as string,
      active: true,
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

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    id: user.id,

    fullName: user.fullName,

    email: user.email,

    role: user.role.name,

    company: user.company,

    permissions: user.role.permissions.map((item) => item.permission.name),
  });
}
