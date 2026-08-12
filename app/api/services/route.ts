import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requirePermission("services.view");

    const services = await prisma.service.findMany({
      where: {
        companyId: user.companyId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(services);
  } catch {
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

export async function POST(req: Request) {
  try {
    const user = await requirePermission("services.create");

    const body = await req.json();

    const { name, description, price } = body;

    const service = await prisma.service.create({
      data: {
        name,

        description,

        price,

        companyId: user.companyId,
      },
    });

    return NextResponse.json(service, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed creating service",
      },
      {
        status: 500,
      },
    );
  }
}
