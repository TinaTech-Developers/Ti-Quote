import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyToken } from "../../../../lib/auth";

// ===============================
// GET SINGLE INVOICE
// ===============================

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = await verifyToken(token);

    if (!user)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        client: true,

        quotation: true,

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

    if (!invoice)
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(invoice, (key, value) =>
          typeof value === "object" && value?.constructor?.name === "Decimal" ?
            Number(value)
          : value,
        ),
      ),
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ===============================
// UPDATE INVOICE
// ===============================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const body = await req.json();

    const {
      clientId,
      dueDate,
      notes,
      terms,
      discount = 0,
      tax = 0,
      items = [],
    } = body;

    // ==========================================
    // FIND INVOICE
    // ==========================================

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );
    }

    if (invoice.status === "PAID") {
      return NextResponse.json(
        { message: "Paid invoices cannot be edited" },
        { status: 400 },
      );
    }

    if (invoice.payments.length > 0) {
      return NextResponse.json(
        { message: "Invoice has payments and cannot be edited" },
        { status: 400 },
      );
    }

    // ==========================================
    // VERIFY CLIENT
    // ==========================================

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        companyId: user.companyId,
      },
    });

    if (!client) {
      return NextResponse.json({ message: "Invalid client" }, { status: 400 });
    }

    // ==========================================
    // BUILD ITEMS
    // ==========================================

    let subtotal = 0;

    const invoiceItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const lineTotal = quantity * unitPrice;

      subtotal += lineTotal;

      if (item.type === "PRODUCT") {
        const product = await prisma.product.findFirst({
          where: {
            id: item.productId,
            companyId: user.companyId,
          },
        });

        if (!product) {
          return NextResponse.json(
            { message: "Invalid product" },
            { status: 400 },
          );
        }
      }

      if (item.type === "SERVICE") {
        const service = await prisma.service.findFirst({
          where: {
            id: item.serviceId,
            companyId: user.companyId,
          },
        });

        if (!service) {
          return NextResponse.json(
            { message: "Invalid service" },
            { status: 400 },
          );
        }
      }

      invoiceItems.push({
        description: item.description ?? "",

        quantity,

        unitPrice,

        total: lineTotal,

        productId: item.type === "PRODUCT" ? item.productId : null,

        serviceId: item.type === "SERVICE" ? item.serviceId : null,
      });
    }

    const grandTotal = subtotal - Number(discount) + Number(tax);

    // ==========================================
    // UPDATE INVOICE
    // ==========================================

    await prisma.$transaction([
      prisma.invoiceItem.deleteMany({
        where: {
          invoiceId: id,
        },
      }),

      prisma.invoice.update({
        where: {
          id,
        },

        data: {
          clientId,

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
      }),
    ]);

    // ==========================================
    // FETCH UPDATED INVOICE
    // ==========================================

    const updatedInvoice = await prisma.invoice.findUnique({
      where: {
        id,
      },

      include: {
        client: true,

        items: {
          include: {
            product: true,
            service: true,
          },
        },

        payments: true,
      },
    });

    // ==========================================
    // ACTIVITY LOG
    // ==========================================

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.userId,

        action: "UPDATE_INVOICE",

        entity: "Invoice",

        entityId: id,
      },
    });

    return NextResponse.json(updatedInvoice);
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

// ===============================
// DELETE INVOICE
// ===============================

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user: any = await verifyToken(token);

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        payments: true,
      },
    });

    if (!invoice)
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 },
      );

    if (invoice.payments.length)
      return NextResponse.json(
        {
          message: "Invoice has payments",
        },
        {
          status: 400,
        },
      );

    await prisma.invoice.delete({
      where: {
        id,
      },
    });

    // log after delete

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.userId as string,

        action: "DELETE_INVOICE",

        entity: "Invoice",

        entityId: id,
      },
    });

    return NextResponse.json({
      message: "Invoice deleted successfully",
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
