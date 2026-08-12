import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// =====================================================
// GET SINGLE USER
// =====================================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requirePermission("users.view");

    const { id } = await params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
      },

      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
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

    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }
}

// =====================================================
// UPDATE USER
// =====================================================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requirePermission("users.update");

    const { id } = await params;

    const body = await req.json();

    const { fullName, email, roleId, active } = body;

    // -------------------------------------------------
    // FIND EXISTING USER
    // -------------------------------------------------

    const existing = await prisma.user.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // -------------------------------------------------
    // VALIDATE ROLE
    // -------------------------------------------------

    if (roleId) {
      const role = await prisma.role.findFirst({
        where: {
          id: roleId,
          companyId: currentUser.companyId,
        },
      });

      if (!role) {
        return NextResponse.json(
          {
            message: "Invalid role",
          },
          {
            status: 400,
          },
        );
      }
    }

    // -------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------

    const updated = await prisma.user.update({
      where: {
        id,
      },

      data: {
        fullName,
        email,
        password: existing.password,
        roleId,
        active,
      },
    });

    // -------------------------------------------------
    // ACTIVITY LOG
    // -------------------------------------------------

    await prisma.activityLog.create({
      data: {
        companyId: currentUser.companyId,

        userId: currentUser.id,

        action: "UPDATE_USER",

        entity: "User",

        entityId: updated.id,
      },
    });

    const { password, ...safeUser } = updated;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Update failed",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// DELETE USER
// =====================================================

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requirePermission("users.delete");

    const { id } = await params;

    // -------------------------------------------------
    // PREVENT SELF DELETE
    // -------------------------------------------------

    if (currentUser.id === id) {
      return NextResponse.json(
        {
          message: "You cannot delete yourself",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await prisma.user.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
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

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await prisma.user.delete({
      where: {
        id,
      },
    });

    // -------------------------------------------------
    // ACTIVITY LOG
    // -------------------------------------------------

    await prisma.activityLog.create({
      data: {
        companyId: currentUser.companyId,

        userId: currentUser.id,

        action: "DELETE_USER",

        entity: "User",

        entityId: user.id,
      },
    });

    return NextResponse.json({
      message: "User deleted",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        message: "Delete failed",
      },
      {
        status: 500,
      },
    );
  }
}
