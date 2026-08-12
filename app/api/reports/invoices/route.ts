import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET INVOICE REPORT
// =====================================================

export async function GET(req: NextRequest) {
  try {
    // ==========================================
    // AUTH
    // ==========================================

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

    // ==========================================
    // QUERY PARAMETERS
    // ==========================================

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");

    const to = searchParams.get("to");

    const status = searchParams.get("status");

    const search = searchParams.get("search");

    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 10);

    // ==========================================
    // WHERE FILTER
    // ==========================================

    const where: any = {
      companyId: user.companyId,
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

    // ==========================================
    // SUMMARY
    // ==========================================

    const summaryInvoices = await prisma.invoice.findMany({
      where,

      select: {
        total: true,

        balance: true,

        status: true,
      },
    });

    let totalAmount = 0;

    let outstanding = 0;

    let paidAmount = 0;

    let paid = 0;

    let partial = 0;

    let unpaid = 0;

    for (const invoice of summaryInvoices) {
      const total = Number(invoice.total);

      const balance = Number(invoice.balance);

      totalAmount += total;

      outstanding += balance;

      paidAmount += total - balance;

      if (invoice.status === "PAID") {
        paid++;
      } else if (invoice.status === "PARTIAL") {
        partial++;
      } else {
        unpaid++;
      }
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    const skip = (page - 1) * limit;

    const totalRecords = await prisma.invoice.count({
      where,
    });

    // ==========================================
    // FETCH INVOICES
    // ==========================================

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

        createdBy: {
          select: {
            fullName: true,
          },
        },

        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    // ==========================================
    // SERIALIZE
    // ==========================================

    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,

      invoiceNumber: invoice.invoiceNumber,

      client: {
        id: invoice.client?.id || "",
        name: invoice.client?.name || "N/A",
        email: invoice.client?.email || "",
      },

      date: invoice.createdAt,

      total: Number(invoice.total),

      paid: Number(invoice.total) - Number(invoice.balance),

      balance: Number(invoice.balance),

      status: invoice.status,

      createdBy: invoice.createdBy?.fullName || "",
    }));

    return NextResponse.json({
      summary: {
        totalInvoices: totalRecords,

        paid,

        partial,

        unpaid,

        totalAmount,

        paidAmount,

        outstanding,
      },

      pagination: {
        page,

        limit,

        totalRecords,

        totalPages: Math.ceil(totalRecords / limit),
      },

      invoices: formattedInvoices,
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
