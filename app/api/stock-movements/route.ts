import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requirePermission("products.view");

    const movements = await prisma.stockMovement.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed fetching stock history",
      },
      {
        status: 500,
      },
    );
  }
}
