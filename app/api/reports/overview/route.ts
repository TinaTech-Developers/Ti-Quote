import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

function toNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}

function getDateRange(range: string | null) {
  const now = new Date();

  let start: Date;
  let end: Date = endOfDay(now);

  switch (range) {
    case "today": {
      start = startOfDay(now);
      break;
    }

    case "7days": {
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      start = startOfDay(start);
      break;
    }

    case "30days": {
      start = new Date(now);
      start.setDate(start.getDate() - 29);
      start = startOfDay(start);
      break;
    }

    case "90days": {
      start = new Date(now);
      start.setDate(start.getDate() - 89);
      start = startOfDay(start);
      break;
    }

    case "year": {
      start = new Date(now.getFullYear(), 0, 1);
      start = startOfDay(start);
      break;
    }

    case "all": {
      start = new Date(2000, 0, 1);
      start = startOfDay(start);
      break;
    }

    case "month":
    default: {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start = startOfDay(start);
      break;
    }
  }

  return {
    start,
    end,
  };
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { searchParams } = new URL(request.url);

    const range = searchParams.get("range") || "month";

    const { start, end } = getDateRange(range);

    const companyId = currentUser.companyId;

    /*
     * ============================================================
     * INVOICES
     * ============================================================
     */

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,

        createdAt: {
          gte: start,
          lte: end,
        },
      },

      include: {
        client: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },

        payments: {
          where: {
            status: "COMPLETED",
          },

          select: {
            id: true,
            amount: true,
            method: true,
            paidAt: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    /*
     * ============================================================
     * PAYMENTS
     * ============================================================
     */

    const payments = await prisma.payment.findMany({
      where: {
        companyId,

        status: "COMPLETED",

        paidAt: {
          gte: start,
          lte: end,
        },
      },

      include: {
        invoice: {
          select: {
            invoiceNumber: true,
          },
        },
      },

      orderBy: {
        paidAt: "desc",
      },
    });

    /*
     * ============================================================
     * TOTALS
     * ============================================================
     */

    let totalInvoiced = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;

    let paidInvoices = 0;
    let partialInvoices = 0;
    let sentInvoices = 0;
    let overdueInvoices = 0;
    let draftInvoices = 0;
    let cancelledInvoices = 0;

    for (const invoice of invoices) {
      const total = toNumber(invoice.total);
      const balance = toNumber(invoice.balance);

      totalInvoiced += total;

      if (invoice.status !== "CANCELLED") {
        totalOutstanding += balance;
      }

      switch (invoice.status) {
        case "PAID":
          paidInvoices++;
          break;

        case "PARTIAL":
          partialInvoices++;
          break;

        case "SENT":
          sentInvoices++;
          break;

        case "OVERDUE":
          overdueInvoices++;
          totalOverdue += balance;
          break;

        case "DRAFT":
          draftInvoices++;
          break;

        case "CANCELLED":
          cancelledInvoices++;
          break;
      }
    }

    /*
     * ============================================================
     * PAYMENT TOTAL
     * ============================================================
     */

    let totalPayments = 0;

    for (const payment of payments) {
      totalPayments += toNumber(payment.amount);
    }

    /*
     * ============================================================
     * PAYMENT METHODS
     * ============================================================
     */

    const paymentMethods: Record<string, number> = {
      CASH: 0,
      BANK_TRANSFER: 0,
      ECOCASH: 0,
      INNBUCKS: 0,
      CARD: 0,
      OTHER: 0,
    };

    for (const payment of payments) {
      const method = payment.method;

      if (paymentMethods[method] !== undefined) {
        paymentMethods[method] += toNumber(payment.amount);
      } else {
        paymentMethods.OTHER += toNumber(payment.amount);
      }
    }

    /*
     * ============================================================
     * SALES BY DAY
     * ============================================================
     */

    const salesMap: Record<
      string,
      {
        date: string;
        sales: number;
        payments: number;
      }
    > = {};

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const key = date.toISOString().split("T")[0];

      salesMap[key] = {
        date: key,
        sales: 0,
        payments: 0,
      };
    }

    for (const invoice of invoices) {
      if (invoice.status === "CANCELLED") {
        continue;
      }

      const key = new Date(invoice.createdAt).toISOString().split("T")[0];

      if (salesMap[key]) {
        salesMap[key].sales += toNumber(invoice.total);
      }
    }

    for (const payment of payments) {
      const key = new Date(payment.paidAt).toISOString().split("T")[0];

      if (salesMap[key]) {
        salesMap[key].payments += toNumber(payment.amount);
      }
    }

    const salesOverview = Object.values(salesMap).map((item) => ({
      ...item,
      sales: Number(item.sales.toFixed(2)),
      payments: Number(item.payments.toFixed(2)),
    }));

    /*
     * ============================================================
     * RECENT INVOICES
     * ============================================================
     */

    const recentInvoices = invoices.slice(0, 8).map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,

      client:
        invoice.client?.companyName || invoice.client?.name || "Unknown Client",

      total: toNumber(invoice.total),
      balance: toNumber(invoice.balance),

      status: invoice.status,

      createdAt: invoice.createdAt,
    }));

    /*
     * ============================================================
     * RECENT PAYMENTS
     * ============================================================
     */

    const recentPayments = payments.slice(0, 8).map((payment) => ({
      id: payment.id,

      paymentNumber: payment.paymentNumber,

      invoiceNumber: payment.invoice?.invoiceNumber || "—",

      amount: toNumber(payment.amount),

      method: payment.method,

      paidAt: payment.paidAt,
    }));

    /*
     * ============================================================
     * RESPONSE
     * ============================================================
     */

    return NextResponse.json({
      range,

      period: {
        start,
        end,
      },

      summary: {
        totalInvoiced: Number(totalInvoiced.toFixed(2)),

        totalPayments: Number(totalPayments.toFixed(2)),

        totalOutstanding: Number(totalOutstanding.toFixed(2)),

        totalOverdue: Number(totalOverdue.toFixed(2)),

        invoiceCount: invoices.length,

        paymentCount: payments.length,

        paidInvoices,

        partialInvoices,

        sentInvoices,

        overdueInvoices,

        draftInvoices,

        cancelledInvoices,
      },

      paymentMethods: Object.entries(paymentMethods).map(
        ([method, amount]) => ({
          method,

          amount: Number(amount.toFixed(2)),
        }),
      ),

      salesOverview,

      recentInvoices,

      recentPayments,
    });
  } catch (error) {
    console.error("Reports overview error:", error);

    return NextResponse.json(
      {
        error: "Failed to load reports.",
      },
      {
        status: 500,
      },
    );
  }
}
