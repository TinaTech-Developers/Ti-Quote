import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET PRODUCT SALES REPORT
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
    // QUERY FILTERS
    // ==========================

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");

    const to = searchParams.get("to");

    const search = searchParams.get("search");

    const where: any = {
      invoice: {
        companyId: user.companyId,
      },

      productId: {
        not: null,
      },
    };

    if (from || to) {
      where.invoice.createdAt = {};

      if (from) {
        where.invoice.createdAt.gte = new Date(from);
      }

      if (to) {
        const end = new Date(to);

        end.setHours(23, 59, 59, 999);

        where.invoice.createdAt.lte = end;
      }
    }

    if (search) {
      where.product = {
        name: {
          contains: search,

          mode: "insensitive",
        },
      };
    }

    // ==========================
    // FETCH SALES ITEMS
    // ==========================

    const items = await prisma.invoiceItem.findMany({
      where,

      include: {
        product: true,

        invoice: {
          select: {
            invoiceNumber: true,

            createdAt: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // ==========================
    // GROUP PRODUCTS
    // ==========================

    const productMap: any = {};

    let totalQuantity = 0;

    let totalRevenue = 0;

    for (const item of items) {
      if (!item.product) continue;

      const quantity = Number(item.quantity);

      const amount = Number(item.total);

      totalQuantity += quantity;

      totalRevenue += amount;

      const id = item.product.id;

      if (!productMap[id]) {
        productMap[id] = {
          id,

          name: item.product.name,

          quantity: 0,

          revenue: 0,

          invoices: 0,
        };
      }

      productMap[id].quantity += quantity;

      productMap[id].revenue += amount;

      productMap[id].invoices += 1;
    }

    const products = Object.values(productMap).sort(
      (a: any, b: any) => b.revenue - a.revenue,
    );

    // ==========================
    // RESPONSE
    // ==========================

    return NextResponse.json({
      summary: {
        totalProducts: products.length,

        totalQuantity,

        totalRevenue,

        totalInvoices: items.length,
      },

      products,
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
