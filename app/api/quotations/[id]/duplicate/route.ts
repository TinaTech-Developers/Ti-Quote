import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        items: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        {
          message: "Quotation not found",
        },
        {
          status: 404,
        },
      );
    }

    const duplicated = await prisma.quotation.create({
      data: {
        quotationNumber: `QTN-${Date.now()}`,

        companyId: quotation.companyId,

        clientId: quotation.clientId,

        createdById: user.userId,

        subtotal: quotation.subtotal,

        discount: quotation.discount,

        tax: quotation.tax,

        total: quotation.total,

        notes: quotation.notes,

        validUntil: quotation.validUntil,

        status: "DRAFT",

        items: {
          create: quotation.items.map((item) => ({
            description: item.description,

            quantity: item.quantity,

            unitPrice: item.unitPrice,

            total: item.total,

            productId: item.productId,

            serviceId: item.serviceId,
          })),
        },
      },

      include: {
        client: true,

        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },
    });

    return NextResponse.json(duplicated, {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
