import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// =====================================================
// GET CLIENT
// =====================================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("clients.view");

    const { id } = await params;

    const client = await prisma.client.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        quotations: true,
        invoices: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          message: "Client not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("GET CLIENT ERROR:", error);

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
// UPDATE CLIENT
// =====================================================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("clients.update");

    const { id } = await params;

    const body = await req.json();

    const client = await prisma.client.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          message: "Client not found",
        },
        {
          status: 404,
        },
      );
    }

    const updated = await prisma.client.update({
      where: {
        id,
      },

      data: body,
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "UPDATE_CLIENT",

        entity: "Client",

        entityId: updated.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE CLIENT ERROR:", error);

    return NextResponse.json(
      {
        message: "Update failed",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// DELETE CLIENT
// =====================================================

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("clients.delete");

    const { id } = await params;

    const client = await prisma.client.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          message: "Client not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.client.delete({
      where: {
        id: client.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "DELETE_CLIENT",

        entity: "Client",

        entityId: client.id,
      },
    });

    return NextResponse.json({
      message: "Client deleted",
    });
  } catch (error) {
    console.error("DELETE CLIENT ERROR:", error);

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
