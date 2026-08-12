import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// GET COMPANY SETTINGS

export async function GET() {
  try {
    const user = await requirePermission("settings.view");

    const company = await prisma.company.findUnique({
      where: {
        id: user.companyId,
      },

      include: {
        settings: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          message: "Company not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(company);
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

// UPDATE COMPANY SETTINGS

export async function PUT(req: Request) {
  try {
    const user = await requirePermission("settings.update");

    const body = await req.json();

    const updatedCompany = await prisma.company.update({
      where: {
        id: user.companyId,
      },

      data: {
        name: body.name,

        email: body.email || null,

        phone: body.phone || null,

        address: body.address || null,

        website: body.website || null,

        logoUrl: body.logoUrl || null,

        taxNumber: body.taxNumber || null,

        currency: body.currency || "USD",
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "UPDATE_COMPANY_SETTINGS",

        entity: "Company",

        entityId: updatedCompany.id,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed updating company",
      },
      {
        status: 500,
      },
    );
  }
}
