import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await requirePermission("roles.update");

    const body = await req.json();

    const { roleId, permissions } = body;

    if (!roleId || !permissions) {
      return NextResponse.json(
        {
          message: "Invalid data",
        },
        {
          status: 400,
        },
      );
    }

    // remove old permissions

    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    // add new permissions

    await prisma.rolePermission.createMany({
      data: permissions.map((permissionId: string) => ({
        roleId,

        permissionId,
      })),
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "UPDATE_ROLE_PERMISSIONS",

        entity: "Role",

        entityId: roleId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed assigning permissions",
      },
      {
        status: 500,
      },
    );
  }
}
