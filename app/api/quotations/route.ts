import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET QUOTATIONS

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        client: true,

        createdBy: true,

        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quotations);
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

// CREATE QUOTATION

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();

    const { clientId, items, discount = 0, tax = 0, notes, validUntil } = body;

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json(
        {
          message: "Client and items required",
        },
        {
          status: 400,
        },
      );
    }

    // Verify client belongs to company

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        companyId: user.companyId,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          message: "Invalid client",
        },
        {
          status: 400,
        },
      );
    }

    let subtotal = 0;

    const quotationItems = items.map((item: any) => {
      const quantity = Number(item.quantity);

      const unitPrice = Number(item.unitPrice);

      const total = quantity * unitPrice;

      subtotal += total;

      return {
        // custom items
        description: item.description,

        quantity,

        unitPrice,

        total,

        // only saved when available

        productId: item.type === "PRODUCT" ? item.productId : null,

        serviceId: item.type === "SERVICE" ? item.serviceId : null,
      };
    });

    const quotation = await prisma.$transaction(async (tx) => {
      const created = await tx.quotation.create({
        data: {
          quotationNumber: `QTN-${Date.now()}`,

          companyId: user.companyId,

          clientId,

          createdById: user.userId,

          subtotal,

          discount: Number(discount),

          tax: Number(tax),

          total: subtotal - Number(discount) + Number(tax),

          notes,

          validUntil: validUntil ? new Date(validUntil) : null,

          items: {
            create: quotationItems,
          },
        },

        include: {
          client: true,

          createdBy: true,

          items: {
            include: {
              product: true,
              service: true,
            },
          },
        },
      });

      // Activity log

      await tx.activityLog.create({
        data: {
          companyId: user.companyId,

          userId: user.userId,

          action: "CREATE_QUOTATION",

          entity: "Quotation",

          entityId: created.id,
        },
      });

      return created;
    });

    return NextResponse.json(quotation, {
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
