import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// ADMIN DASHBOARD API
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

    const companyId = user.companyId;

    // ==========================
    // REVENUE
    // ==========================

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,
      },

      select: {
        total: true,
        balance: true,
        status: true,
      },
    });

    let totalRevenue = 0;

    let totalPaid = 0;

    let outstanding = 0;

    let paidInvoices = 0;

    let partialInvoices = 0;

    let pendingInvoices = 0;

    let overdueInvoices = 0;

    invoices.forEach((invoice) => {
      const total = Number(invoice.total);

      const balance = Number(invoice.balance);

      totalRevenue += total;

      totalPaid += total - balance;

      outstanding += balance;

      switch (invoice.status) {
        case "PAID":
          paidInvoices++;

          break;

        case "PARTIAL":
          partialInvoices++;

          break;

        case "OVERDUE":
          overdueInvoices++;

          break;

        default:
          pendingInvoices++;
      }
    });

    // ==========================
    // CLIENTS
    // ==========================

    const totalClients = await prisma.client.count({
      where: {
        companyId,
      },
    });

    // ==========================
    // PRODUCTS
    // ==========================

    const totalProducts = await prisma.product.count({
      where: {
        companyId,
      },
    });

    const lowStockProducts = await prisma.product.findMany({
      where: {
        companyId,

        trackStock: true,

        stockQuantity: {
          lte: prisma.product.fields.lowStockAlert,
        },
      },

      select: {
        id: true,

        name: true,

        stockQuantity: true,

        lowStockAlert: true,
      },

      take: 10,
    });

    // ==========================
    // RECENT ACTIVITIES
    // ==========================

    const activities = await prisma.activityLog.findMany({
      where: {
        companyId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,

      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // ==========================
    // RESPONSE
    // ==========================

    return NextResponse.json({
      revenue: {
        total: totalRevenue,

        paid: totalPaid,

        outstanding,
      },

      invoices: {
        total: invoices.length,

        paid: paidInvoices,

        partial: partialInvoices,

        pending: pendingInvoices,

        overdue: overdueInvoices,
      },

      clients: {
        total: totalClients,
      },

      products: {
        total: totalProducts,

        lowStock: lowStockProducts.length,

        lowStockItems: lowStockProducts.map((product) => ({
          id: product.id,

          name: product.name,

          quantity: Number(product.stockQuantity),

          alert: Number(product.lowStockAlert),
        })),
      },

      activities: activities.map((activity) => ({
        id: activity.id,

        user: activity.user.fullName,

        action: activity.action,

        entity: activity.entity,

        createdAt: activity.createdAt,
      })),
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

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
