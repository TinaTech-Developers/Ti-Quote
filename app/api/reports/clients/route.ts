import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET CLIENT STATEMENT REPORT
// =====================================================

export async function GET(req: NextRequest) {
  try {
    // ==========================
    // AUTH
    // ==========================

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

    // ==========================
    // QUERY PARAMETERS
    // ==========================

    const { searchParams } = new URL(req.url);

    const clientId = searchParams.get("clientId");

    const from = searchParams.get("from");

    const to = searchParams.get("to");

    // ==========================
    // CLIENT FILTER
    // ==========================

    const clientWhere: any = {
      companyId: user.companyId,
    };

    if (clientId) {
      clientWhere.id = clientId;
    }

    // ==========================
    // GET CLIENTS
    // ==========================

    const clients = await prisma.client.findMany({
      where: clientWhere,

      orderBy: {
        name: "asc",
      },

      include: {
        invoices: {
          where: {
            ...(from || to ?
              {
                createdAt: {
                  ...(from && {
                    gte: new Date(from),
                  }),

                  ...(to && {
                    lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
                  }),
                },
              }
            : {}),
          },

          include: {
            payments: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // ==========================
    // FORMAT STATEMENTS
    // ==========================

    const statements = clients.map((client) => {
      let totalInvoices = 0;

      let totalPayments = 0;

      const transactions: any[] = [];

      client.invoices.forEach((invoice) => {
        const invoiceAmount = Number(invoice.total);

        totalInvoices += invoiceAmount;

        transactions.push({
          id: invoice.id,

          type: "INVOICE",

          reference: invoice.invoiceNumber,

          date: invoice.createdAt,

          description: `Invoice ${invoice.invoiceNumber}`,

          debit: invoiceAmount,

          credit: 0,
        });

        invoice.payments.forEach((payment) => {
          const amount = Number(payment.amount);

          totalPayments += amount;

          transactions.push({
            id: payment.id,

            type: "PAYMENT",

            reference: payment.paymentNumber,

            date: payment.paidAt,

            description: `Payment ${payment.paymentNumber}`,

            debit: 0,

            credit: amount,
          });
        });
      });

      return {
        client: {
          id: client.id,

          name: client.name,

          companyName: client.companyName,

          email: client.email,

          phone: client.phone,
        },

        summary: {
          totalInvoices,

          totalPayments,

          balance: totalInvoices - totalPayments,
        },

        transactions: transactions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      };
    });

    return NextResponse.json({
      statements,
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
