import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requirePermission("users.view");

    const roles = await prisma.role.findMany({
      where: {
        companyId: user.companyId,
      },

      select: {
        id: true,
        name: true,
        description: true,
      },

      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
}
