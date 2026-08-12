import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

// GET ROLE

export async function GET(req: Request, { params }: Context) {
  try {
    const user = await requirePermission("roles.view");

    const { id } = await params;

    const role = await prisma.role.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },

        users: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        {
          message: "Role not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(role);
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

// UPDATE ROLE

// UPDATE ROLE

export async function PUT(req: Request, { params }: Context) {
  try {
    const user = await requirePermission("roles.update");

    const { id } = await params;

    const body = await req.json();

    const { name, description, permissionIds = [] } = body;

    // Check role belongs to company

    const existingRole = await prisma.role.findFirst({
      where: {
        id,

        companyId: user.companyId,
      },
    });

    if (!existingRole) {
      return NextResponse.json(
        {
          message: "Role not found",
        },
        {
          status: 404,
        },
      );
    }

    const updatedRole = await prisma.$transaction(async (tx) => {
      // Update basic role details

      const role = await tx.role.update({
        where: {
          id,
        },

        data: {
          name,

          description,
        },
      });

      // Remove old permissions

      await tx.rolePermission.deleteMany({
        where: {
          roleId: id,
        },
      });

      // Add new permissions

      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId: string) => ({
            roleId: id,

            permissionId,
          })),
        });
      }

      return tx.role.findUnique({
        where: {
          id,
        },

        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "UPDATE_ROLE",

        entity: "Role",

        entityId: id,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed updating role",
      },

      {
        status: 500,
      },
    );
  }
}

// DELETE ROLE

export async function DELETE(req: Request, { params }: Context) {
  try {
    const user = await requirePermission("roles.delete");

    const { id } = await params;

    const users = await prisma.user.count({
      where: {
        roleId: id,
      },
    });

    if (users > 0) {
      return NextResponse.json(
        {
          message: "Cannot delete role with assigned users",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          roleId: id,
        },
      });

      await tx.role.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed deleting role",
      },
      {
        status: 500,
      },
    );
  }
}
