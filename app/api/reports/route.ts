import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET REVENUE REPORT
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
    // DATE FILTERS
    // ==========================================

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {
      companyId: user.companyId,
    };

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
    // FETCH INVOICES
    // ==========================================

    const invoices = await prisma.invoice.findMany({
      where,

      select: {
        id: true,
        createdAt: true,
        subtotal: true,
        discount: true,
        tax: true,
        total: true,
        balance: true,
        status: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    // ==========================================
    // SUMMARY TOTALS
    // ==========================================

    let revenue = 0;
    let paid = 0;
    let outstanding = 0;
    let taxes = 0;
    let discounts = 0;
    let netRevenue = 0;

    const monthlyMap: Record<
      string,
      {
        month: string;
        invoices: number;
        revenue: number;
        paid: number;
        outstanding: number;
        tax: number;
        discount: number;
      }
    > = {};

    for (const invoice of invoices) {
      const subtotal = Number(invoice.subtotal);
      const discount = Number(invoice.discount);
      const tax = Number(invoice.tax);
      const total = Number(invoice.total);
      const balance = Number(invoice.balance);

      const amountPaid = total - balance;

      revenue += total;
      paid += amountPaid;
      outstanding += balance;
      taxes += tax;
      discounts += discount;
      netRevenue += subtotal - discount;

      const month = new Date(invoice.createdAt).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          invoices: 0,
          revenue: 0,
          paid: 0,
          outstanding: 0,
          tax: 0,
          discount: 0,
        };
      }

      monthlyMap[month].invoices += 1;
      monthlyMap[month].revenue += total;
      monthlyMap[month].paid += amountPaid;
      monthlyMap[month].outstanding += balance;
      monthlyMap[month].tax += tax;
      monthlyMap[month].discount += discount;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      summary: {
        revenue,
        paid,
        outstanding,
        tax: taxes,
        discount: discounts,
        netRevenue,
        invoices: invoices.length,
      },

      monthly: Object.values(monthlyMap),
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
