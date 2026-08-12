import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// GET SERVICE

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requirePermission("services.view");

  const { id } = await params;

  const service = await prisma.service.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!service) {
    return NextResponse.json({ message: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

// UPDATE SERVICE

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requirePermission("services.update");

  const { id } = await params;

  const data = await req.json();

  const service = await prisma.service.update({
    where: {
      id,
    },

    data,
  });

  return NextResponse.json(service);
}

// DELETE SERVICE

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requirePermission("services.delete");

  const { id } = await params;

  await prisma.service.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Service deleted",
  });
}
