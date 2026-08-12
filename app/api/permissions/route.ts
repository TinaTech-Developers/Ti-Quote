import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requirePermission("roles.view");

    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
}
