import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET SERVICE SALES REPORT
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

    const search = searchParams.get("search");

    // ==========================================
    // FETCH INVOICE ITEMS
    // ==========================================

    const invoiceItems = await prisma.invoiceItem.findMany({
      where: {
        serviceId: {
          not: null,
        },

        invoice: {
          companyId: user.companyId,

          ...(from || to ?
            {
              createdAt: {
                ...(from ?
                  {
                    gte: new Date(from),
                  }
                : {}),

                ...(to ?
                  {
                    lte: (() => {
                      const end = new Date(to);
                      end.setHours(23, 59, 59, 999);
                      return end;
                    })(),
                  }
                : {}),
              },
            }
          : {}),
        },

        ...(search ?
          {
            service: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : {}),
      },

      include: {
        service: true,

        invoice: {
          select: {
            id: true,
          },
        },
      },
    });

    // ==========================================
    // GROUP SERVICES
    // ==========================================

    const serviceMap: Record<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        revenue: number;
        invoices: Set<string>;
      }
    > = {};

    for (const item of invoiceItems) {
      if (!item.service) continue;

      const serviceId = item.service.id;

      if (!serviceMap[serviceId]) {
        serviceMap[serviceId] = {
          id: serviceId,
          name: item.service.name,
          quantity: 0,
          revenue: 0,
          invoices: new Set(),
        };
      }

      serviceMap[serviceId].quantity += Number(item.quantity);

      serviceMap[serviceId].revenue += Number(item.total);

      serviceMap[serviceId].invoices.add(item.invoice.id);
    }

    const services = Object.values(serviceMap).map((service) => ({
      id: service.id,

      name: service.name,

      quantity: service.quantity,

      revenue: service.revenue,

      invoices: service.invoices.size,
    }));

    // ==========================================
    // SUMMARY
    // ==========================================

    const summary = {
      totalServices: services.length,

      totalQuantity: services.reduce((sum, item) => sum + item.quantity, 0),

      totalRevenue: services.reduce((sum, item) => sum + item.revenue, 0),

      totalInvoices: new Set(invoiceItems.map((item) => item.invoice.id)).size,
    };

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      summary,

      services,
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
