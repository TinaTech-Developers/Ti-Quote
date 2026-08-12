import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// GET ALL ROLES
export async function GET() {
  try {
    const user = await requirePermission("roles.view");

    const roles = await prisma.role.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 401,
      },
    );
  }
}

// CREATE ROLE
// CREATE ROLE
export async function POST(req: Request) {
  try {
    const user = await requirePermission("roles.create");

    const body = await req.json();

    const { name, description, permissionIds = [] } = body;

    if (!name) {
      return NextResponse.json(
        {
          message: "Role name required",
        },
        {
          status: 400,
        },
      );
    }

    const exists = await prisma.role.findFirst({
      where: {
        name,
        companyId: user.companyId,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Role already exists",
        },
        {
          status: 400,
        },
      );
    }

    // Create role + permissions
    const role = await prisma.role.create({
      data: {
        name,

        description,

        companyId: user.companyId,

        permissions: {
          create: permissionIds.map((permissionId: string) => ({
            permissionId,
          })),
        },
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "CREATE_ROLE",

        entity: "Role",

        entityId: role.id,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error creating role",
      },

      {
        status: 500,
      },
    );
  }
}
