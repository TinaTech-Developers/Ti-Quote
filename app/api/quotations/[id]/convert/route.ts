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
    // Verify user
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid token",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    // Find quotation
    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        client: true,

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

    // Only approved quotations
    if (quotation.status !== "APPROVED") {
      return NextResponse.json(
        {
          message: "Only approved quotations can be converted.",
        },
        {
          status: 400,
        },
      );
    }

    // Prevent duplicate conversion
    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        quotationId: quotation.id,
      },
    });

    if (existingInvoice) {
      return NextResponse.json(
        {
          message: "Quotation already converted.",
        },
        {
          status: 400,
        },
      );
    }

    // Transaction
    const invoice = await prisma.$transaction(async (tx) => {
      const createdInvoice = await tx.invoice.create({
        data: {
          invoiceNumber: `INV-${Date.now()}`,

          quotationId: quotation.id,

          companyId: quotation.companyId,

          clientId: quotation.clientId,

          createdById: user.userId,

          subtotal: quotation.subtotal,

          discount: quotation.discount,

          tax: quotation.tax,

          total: quotation.total,

          balance: quotation.total,

          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),

          items: {
            create: quotation.items.map((item) => ({
              description: item.description,

              quantity: item.quantity,

              unitPrice: item.unitPrice,

              total: item.total,
            })),
          },
        },

        include: {
          client: true,

          items: true,
        },
      });

      await tx.quotation.update({
        where: {
          id: quotation.id,
        },

        data: {
          status: "CONVERTED",

          convertedAt: new Date(),
        },
      });

      return createdInvoice;
    });

    return NextResponse.json(invoice, {
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
