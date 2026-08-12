import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalInvoices,
      totalQuotations,
      revenue,
      recentInvoices,
      recentPayments,
      recentQuotations,
      activities,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.company.count(),

      prisma.invoice.count(),

      prisma.quotation.count(),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },

        where: {
          status: "COMPLETED",
        },
      }),

      prisma.invoice.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          client: true,
        },
      }),

      prisma.payment.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          invoice: {
            include: {
              client: true,
            },
          },
        },
      }),

      prisma.quotation.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          client: true,
        },
      }),

      prisma.activityLog.findMany({
        take: 10,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          user: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        users: totalUsers,

        companies: totalCompanies,

        invoices: totalInvoices,

        quotations: totalQuotations,

        revenue: revenue._sum.amount ?? 0,
      },

      recentInvoices,

      recentPayments,

      recentQuotations,

      activities,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Dashboard loading failed",
      },
      {
        status: 500,
      },
    );
  }
}
