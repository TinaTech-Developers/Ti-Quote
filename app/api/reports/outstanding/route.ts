import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET OUTSTANDING BALANCES REPORT
// =====================================================

export async function GET(req: NextRequest) {
  try {
    // ==============================
    // AUTH
    // ==============================

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

    // ==============================
    // QUERY PARAMETERS
    // ==============================

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");

    const status = searchParams.get("status");

    const from = searchParams.get("from");

    const to = searchParams.get("to");

    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 10);

    // ==============================
    // FILTERS
    // ==============================

    const where: any = {
      companyId: user.companyId,

      balance: {
        gt: 0,
      },
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          invoiceNumber: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          client: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
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

    // ==============================
    // SUMMARY
    // ==============================

    const summaryInvoices = await prisma.invoice.findMany({
      where,

      select: {
        total: true,

        balance: true,

        createdAt: true,

        status: true,
      },
    });

    let totalOutstanding = 0;

    let overdueAmount = 0;

    let partial = 0;

    let unpaid = 0;

    const today = new Date();

    for (const invoice of summaryInvoices) {
      const balance = Number(invoice.balance);

      totalOutstanding += balance;

      if (invoice.status === "PARTIAL") {
        partial++;
      }

      if (invoice.status === "SENT") {
        unpaid++;
      }

      const days = Math.floor(
        (today.getTime() - new Date(invoice.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (days > 30) {
        overdueAmount += balance;
      }
    }

    // ==============================
    // PAGINATION
    // ==============================

    const totalRecords = await prisma.invoice.count({
      where,
    });

    const skip = (page - 1) * limit;

    // ==============================
    // FETCH DATA
    // ==============================

    const invoices = await prisma.invoice.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    // ==============================
    // FORMAT
    // ==============================

    const formatted = invoices.map((invoice) => {
      const total = Number(invoice.total);

      const balance = Number(invoice.balance);

      const paid = total - balance;

      const daysOverdue = Math.floor(
        (Date.now() - new Date(invoice.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        id: invoice.id,

        invoiceNumber: invoice.invoiceNumber,

        client: invoice.client?.name || "N/A",

        email: invoice.client?.email || "",

        date: invoice.createdAt,

        total,

        paid,

        balance,

        status: invoice.status,

        daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
      };
    });

    return NextResponse.json({
      summary: {
        outstanding: totalOutstanding,

        invoices: totalRecords,

        overdue: overdueAmount,

        partial,

        unpaid,
      },

      invoices: formatted,

      pagination: {
        page,

        limit,

        totalRecords,

        totalPages: Math.ceil(totalRecords / limit),
      },
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
