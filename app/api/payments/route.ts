import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// ======================================
// GET ALL PAYMENTS
// ======================================

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

    const payments = await prisma.payment.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        invoice: {
          include: {
            client: true,
          },
        },

        receivedBy: true,
      },

      orderBy: {
        paidAt: "desc",
      },
    });

    return NextResponse.json(payments);
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
// CREATE PAYMENT
// ======================================

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
      invoiceId,
      amount,
      method,
      reference,
      notes,
      paidAt,
      receiptUrl,
      status,
    } = body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!invoiceId) {
      return NextResponse.json(
        {
          message: "Invoice is required",
        },
        {
          status: 400,
        },
      );
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return NextResponse.json(
        {
          message: "Valid payment amount is required",
        },
        {
          status: 400,
        },
      );
    }

    // ======================================
    // FIND INVOICE
    // ======================================

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        companyId: user.companyId,
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

    // ======================================
    // VALIDATE INVOICE
    // ======================================

    if (invoice.status === "CANCELLED") {
      return NextResponse.json(
        {
          message: "Cannot receive payment for cancelled invoice",
        },
        {
          status: 400,
        },
      );
    }

    const currentBalance = Number(invoice.balance);

    if (currentBalance <= 0) {
      return NextResponse.json(
        {
          message: "This invoice has already been fully paid",
        },
        {
          status: 400,
        },
      );
    }

    if (paymentAmount > currentBalance) {
      return NextResponse.json(
        {
          message: `Payment exceeds invoice balance of ${currentBalance.toFixed(
            2,
          )}`,
        },
        {
          status: 400,
        },
      );
    }

    // ======================================
    // CALCULATE NEW BALANCE
    // ======================================

    const newBalance = currentBalance - paymentAmount;

    let invoiceStatus = invoice.status;
    let invoicePaidAt: Date | null = invoice.paidAt;

    if (newBalance <= 0.009) {
      invoiceStatus = "PAID";
      invoicePaidAt = paidAt ? new Date(paidAt) : new Date();
    } else {
      invoiceStatus = "PARTIAL";
      invoicePaidAt = null;
    }

    // ======================================
    // CREATE PAYMENT
    // ======================================

    const payment = await prisma.$transaction(
      async (tx) => {
        // ----------------------------------
        // GET COMPANY SETTINGS
        // ----------------------------------

        const settings = await tx.setting.findUnique({
          where: {
            companyId: user.companyId,
          },
        });

        if (!settings) {
          throw new Error("Company settings not found");
        }

        // ----------------------------------
        // GENERATE PAYMENT NUMBER
        // ----------------------------------

        const paymentNumber = `${settings.paymentPrefix}-${String(
          settings.paymentCounter,
        ).padStart(6, "0")}`;

        // ----------------------------------
        // CREATE PAYMENT
        // ----------------------------------

        const createdPayment = await tx.payment.create({
          data: {
            paymentNumber,

            companyId: user.companyId,

            invoiceId: invoice.id,

            receivedById: user.userId,

            amount: paymentAmount,

            method: method || "CASH",

            reference: reference || null,

            notes: notes || null,

            receiptUrl: receiptUrl || null,

            paidAt: paidAt ? new Date(paidAt) : new Date(),
          },

          include: {
            invoice: true,

            receivedBy: true,
          },
        });

        // ----------------------------------
        // UPDATE INVOICE
        // ----------------------------------

        await tx.invoice.update({
          where: {
            id: invoice.id,
          },

          data: {
            balance: newBalance,

            status: invoiceStatus,

            paidAt: invoicePaidAt,
          },
        });

        // ----------------------------------
        // INCREMENT PAYMENT COUNTER
        // ----------------------------------

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

        // ----------------------------------
        // ACTIVITY LOG
        // ----------------------------------

        await tx.activityLog.create({
          data: {
            companyId: user.companyId,

            userId: user.userId,

            action: "CREATE_PAYMENT",

            entity: "Payment",

            entityId: createdPayment.id,
          },
        });

        return createdPayment;
      },

      {
        // Supabase can sometimes take longer
        // to establish/use a transaction.
        maxWait: 10000,

        // Give the complete transaction
        // enough time to finish.
        timeout: 15000,
      },
    );

    // ======================================
    // SUCCESS
    // ======================================

    return NextResponse.json(
      {
        message: "Payment recorded successfully",
        payment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to save payment",
      },
      {
        status: 500,
      },
    );
  }
}
