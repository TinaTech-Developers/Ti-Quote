import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// ======================================
// GET SINGLE PAYMENT
// ======================================

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

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        invoice: {
          include: {
            client: true,
            payments: true,
          },
        },

        receivedBy: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          message: "Payment not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error(error);

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

// ======================================
// UPDATE PAYMENT
// ======================================

export async function PUT(
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

    const body = await req.json();

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        invoice: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          message: "Payment not found",
        },
        {
          status: 404,
        },
      );
    }

    const updatedPayment = await prisma.payment.update({
      where: {
        id,
      },

      data: {
        method: body.method,
        reference: body.reference,
        notes: body.notes,
        receiptUrl: body.receiptUrl,
      },

      include: {
        invoice: true,
        receivedBy: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,
        userId: user.userId,
        action: "UPDATE_PAYMENT",
        entity: "Payment",
        entityId: payment.id,
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error(error);

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

// ======================================
// DELETE PAYMENT
// ======================================

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

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        invoice: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          message: "Payment not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete payment

      await tx.payment.delete({
        where: {
          id: payment.id,
        },
      });

      // Calculate remaining payments

      const remainingPayments = await tx.payment.findMany({
        where: {
          invoiceId: payment.invoiceId,
        },
      });

      const totalPaid = remainingPayments.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      const invoiceTotal = Number(payment.invoice.total);

      const newBalance = invoiceTotal - totalPaid;

      let status: any = "DRAFT";
      let paidAt: Date | null = null;

      if (totalPaid === 0) {
        status = "DRAFT";
      } else if (newBalance <= 0) {
        status = "PAID";
        paidAt = new Date();
      } else {
        status = "PARTIAL";
      }

      await tx.invoice.update({
        where: {
          id: payment.invoiceId,
        },

        data: {
          balance: newBalance,
          status,
          paidAt,
        },
      });

      await tx.activityLog.create({
        data: {
          companyId: user.companyId,
          userId: user.userId,
          action: "DELETE_PAYMENT",
          entity: "Payment",
          entityId: payment.id,
        },
      });
    });

    return NextResponse.json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error(error);

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
