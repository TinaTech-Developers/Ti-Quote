import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// GET ALL CLIENTS

export async function GET() {
  try {
    const user = await requirePermission("clients.view");

    const clients = await prisma.client.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        _count: {
          select: {
            quotations: true,
            invoices: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
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

// CREATE CLIENT

export async function POST(req: Request) {
  try {
    const user = await requirePermission("clients.create");

    const body = await req.json();

    const { name, companyName, email, phone, address, city, notes } = body;

    if (!name) {
      return NextResponse.json(
        {
          message: "Client name required",
        },
        {
          status: 400,
        },
      );
    }

    const client = await prisma.client.create({
      data: {
        name,

        companyName,

        email,

        phone,

        address,

        city,

        notes,

        companyId: user.companyId,
      },
    });

    // activity log

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "CREATE_CLIENT",

        entity: "Client",

        entityId: client.id,
      },
    });

    return NextResponse.json(client, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed creating client",
      },
      {
        status: 500,
      },
    );
  }
}
