import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET PAYMENT REPORT
// =====================================================

export async function GET(req: NextRequest) {
  try {
    // ==========================================
    // AUTH
    // ==========================================

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ==========================================
    // QUERY PARAMETERS
    // ==========================================

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const method = searchParams.get("method");
    const search = searchParams.get("search");

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    // ==========================================
    // WHERE CLAUSE
    // ==========================================

    const where: any = {
      companyId: user.companyId,
    };

    if (method && method !== "ALL") {
      where.method = method;
    }

    if (from || to) {
      where.createdAt = {};

      if (from) {
        where.createdAt.gte = new Date(from);
      }

      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        {
          paymentNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          reference: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          invoice: {
            invoiceNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          invoice: {
            client: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // ==========================================
    // SUMMARY
    // ==========================================

    const summaryPayments = await prisma.payment.findMany({
      where,
      select: {
        amount: true,
        method: true,
        status: true,
      },
    });

    let totalAmount = 0;

    const methods: Record<string, number> = {};

    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    for (const payment of summaryPayments) {
      const amount = Number(payment.amount);

      totalAmount += amount;

      methods[payment.method] = (methods[payment.method] || 0) + amount;

      if (payment.status === "COMPLETED") completed++;
      else if (payment.status === "PENDING") pending++;
      else cancelled++;
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    const totalRecords = await prisma.payment.count({
      where,
    });

    const payments = await prisma.payment.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        invoice: {
          include: {
            client: {
              select: {
                name: true,
              },
            },
          },
        },

        receivedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // ==========================================
    // SERIALIZE
    // ==========================================

    const rows = payments.map((payment) => ({
      id: payment.id,

      paymentNumber: payment.paymentNumber,

      invoiceId: payment.invoice?.id ?? "",

      invoiceNumber: payment.invoice?.invoiceNumber ?? "",

      client: payment.invoice?.client?.name ?? "",

      amount: Number(payment.amount),

      method: payment.method,

      status: payment.status,

      reference: payment.reference,

      receivedBy: payment.receivedBy?.fullName ?? "",

      createdAt: payment.createdAt,
    }));

    // ==========================================
    // MONTHLY TOTALS
    // ==========================================

    const monthlyMap: Record<
      string,
      {
        month: string;
        total: number;
        count: number;
      }
    > = {};

    for (const payment of payments) {
      const month = new Date(payment.createdAt).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          total: 0,
          count: 0,
        };
      }

      monthlyMap[month].count++;

      monthlyMap[month].total += Number(payment.amount);
    }

    return NextResponse.json({
      summary: {
        totalPayments: totalRecords,
        totalAmount,
        completed,
        pending,
        cancelled,
        methods,
      },

      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },

      monthly: Object.values(monthlyMap),

      payments: rows,
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
