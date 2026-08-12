import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET QUOTATION REPORT
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
    // QUERY PARAMS
    // ==============================

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");

    const status = searchParams.get("status");

    const from = searchParams.get("from");

    const to = searchParams.get("to");

    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 10);

    // ==============================
    // FILTER
    // ==============================

    const where: any = {
      companyId: user.companyId,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          quotationNumber: {
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

    const summaryData = await prisma.quotation.findMany({
      where,

      select: {
        total: true,
        status: true,
      },
    });

    let totalValue = 0;

    let approved = 0;

    let pending = 0;

    let rejected = 0;

    let draft = 0;

    let converted = 0;

    for (const quotation of summaryData) {
      totalValue += Number(quotation.total);

      switch (quotation.status) {
        case "APPROVED":
          approved++;
          break;

        case "PENDING":
          pending++;
          break;

        case "REJECTED":
          rejected++;
          break;

        case "DRAFT":
          draft++;
          break;
      }
    }

    // ==============================
    // PAGINATION
    // ==============================

    const totalRecords = await prisma.quotation.count({
      where,
    });

    const skip = (page - 1) * limit;

    // ==============================
    // FETCH QUOTATIONS
    // ==============================

    const quotations = await prisma.quotation.findMany({
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

        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
      },
    });

    // ==============================
    // FORMAT RESPONSE
    // ==============================

    const formatted = quotations.map((quotation) => ({
      id: quotation.id,

      quotationNumber: quotation.quotationNumber,

      client: quotation.client?.name || "N/A",

      email: quotation.client?.email || "",

      amount: Number(quotation.total),

      status: quotation.status,

      invoiceId: quotation.invoice?.id || null,

      invoiceNumber: quotation.invoice?.invoiceNumber || null,

      createdBy: quotation.createdBy?.fullName || "",

      createdAt: quotation.createdAt,
    }));

    return NextResponse.json({
      summary: {
        totalQuotations: totalRecords,

        totalValue,

        approved,

        pending,

        rejected,

        draft,

        converted,
      },

      quotations: formatted,

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
