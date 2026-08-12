import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

// ======================================================
// GET ALL INVOICES
// ======================================================

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

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        client: true,

        quotation: {
          select: {
            id: true,
            quotationNumber: true,
          },
        },

        createdBy: true,

        items: {
          include: {
            product: true,
            service: true,
          },
        },

        payments: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
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

// ======================================================
// CREATE MANUAL INVOICE
// ======================================================

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const {
      clientId,
      dueDate,
      notes,
      terms,
      discount = 0,
      tax = 0,
      items,
    } = body;

    if (!clientId) {
      return NextResponse.json(
        { message: "Client is required" },
        { status: 400 },
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Invoice requires at least one item" },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // VERIFY CLIENT (OUTSIDE TRANSACTION)
    // --------------------------------------------------

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        companyId: user.companyId,
      },
    });

    if (!client) {
      return NextResponse.json({ message: "Invalid client" }, { status: 400 });
    }

    // --------------------------------------------------
    // CALCULATE TOTALS (OUTSIDE TRANSACTION)
    // --------------------------------------------------

    let subtotal = 0;

    const invoiceItems = items.map((item: any) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      const total = quantity * unitPrice;

      subtotal += total;

      return {
        description: item.description,
        quantity,
        unitPrice,
        total,
        productId:
          item.type === "PRODUCT" && item.productId ? item.productId : null,
        serviceId:
          item.type === "SERVICE" && item.serviceId ? item.serviceId : null,
      };
    });

    const grandTotal = subtotal - Number(discount) + Number(tax);

    // --------------------------------------------------
    // TRANSACTION
    // --------------------------------------------------

    const invoice = await prisma.$transaction(
      async (tx) => {
        const settings = await tx.setting.findUnique({
          where: {
            companyId: user.companyId,
          },
        });

        if (!settings) {
          throw new Error("Company settings not found");
        }

        const invoiceNumber = `${settings.invoicePrefix}-${String(
          settings.invoiceCounter,
        ).padStart(6, "0")}`;

        const created = await tx.invoice.create({
          data: {
            invoiceNumber,

            companyId: user.companyId,

            clientId,

            createdById: user.userId,

            subtotal,

            discount: Number(discount),

            tax: Number(tax),

            total: grandTotal,

            balance: grandTotal,

            dueDate: dueDate ? new Date(dueDate) : null,

            notes,

            terms,

            items: {
              create: invoiceItems,
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

            payments: true,
          },
        });

        await tx.setting.update({
          where: {
            companyId: user.companyId,
          },

          data: {
            invoiceCounter: {
              increment: 1,
            },
          },
        });

        await tx.activityLog.create({
          data: {
            companyId: user.companyId,

            userId: user.userId,

            action: "CREATE_INVOICE",

            entity: "Invoice",

            entityId: created.id,
          },
        });

        return created;
      },
      {
        timeout: 20000,
        maxWait: 10000,
      },
    );

    return NextResponse.json(invoice, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
