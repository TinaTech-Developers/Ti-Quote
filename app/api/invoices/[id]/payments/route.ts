import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { verifyToken } from "../../../../../lib/auth";

// ======================================================
// GET PAYMENTS FOR INVOICE
// ======================================================

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
        {
          message: "Invoice not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(invoice.payments);
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
// CREATE PAYMENT
// ======================================================

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

    const body = await req.json();

    const { amount, method, reference, notes } = body;

    if (!amount || !method) {
      return NextResponse.json(
        {
          message: "Amount and payment method required",
        },
        {
          status: 400,
        },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // ==========================================
      // FIND INVOICE
      // ==========================================

      const invoice = await tx.invoice.findFirst({
        where: {
          id,
          companyId: user.companyId,
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      if (Number(invoice.balance) <= 0) {
        throw new Error("Invoice already paid");
      }

      // ==========================================
      // GET SETTINGS
      // ==========================================

      const settings = await tx.setting.findUnique({
        where: {
          companyId: user.companyId,
        },
      });

      if (!settings) {
        throw new Error("Company settings not found");
      }

      const paymentNumber = `${settings.paymentPrefix}-${String(
        settings.paymentCounter,
      ).padStart(6, "0")}`;

      // ==========================================
      // CHECK AMOUNT
      // ==========================================

      const paymentAmount = Number(amount);

      if (paymentAmount > Number(invoice.balance)) {
        throw new Error("Payment exceeds invoice balance");
      }

      const newBalance = Number(invoice.balance) - paymentAmount;

      let newStatus = invoice.status;

      if (newBalance === 0) {
        newStatus = "PAID";
      } else {
        newStatus = "PARTIAL";
      }

      // ==========================================
      // CREATE PAYMENT
      // ==========================================

      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          companyId: user.companyId,
          invoiceId: invoice.id,
          receivedById: user.userId,
          amount: paymentAmount,
          method,
          reference,
          notes,
          status: "COMPLETED",
          paidAt: new Date(), // if your schema has paidAt
        },
      });
      // ==========================================
      // UPDATE INVOICE
      // ==========================================

      const updatedInvoice = await tx.invoice.update({
        where: {
          id: invoice.id,
        },

        data: {
          balance: newBalance,

          status: newStatus,

          paidAt: newBalance === 0 ? new Date() : null,
        },
      });

      // ==========================================
      // UPDATE PAYMENT COUNTER
      // ==========================================

      await tx.setting.update({
        where: {
          companyId: user.companyId,
        },

        data: {
          paymentCounter: {
            increment: 1,
          },
        },
      });

      // ==========================================
      // ACTIVITY LOG
      // ==========================================

      await tx.activityLog.create({
        data: {
          companyId: user.companyId,

          userId: user.userId,

          action: "CREATE_PAYMENT",

          entity: "Payment",

          entityId: payment.id,
        },
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message || "Server error",
      },

      {
        status: 500,
      },
    );
  }
}
