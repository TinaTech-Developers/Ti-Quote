import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const companyId = user.companyId;

    /*
     * =====================================================
     * PRODUCTS
     * =====================================================
     */

    const products = await prisma.product.findMany({
      where: {
        companyId,
        trackStock: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    /*
     * =====================================================
     * RECENT STOCK MOVEMENTS
     * =====================================================
     */

    const recentMovements = await prisma.stockMovement.findMany({
      where: {
        companyId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    /*
     * =====================================================
     * CALCULATE STATISTICS
     * =====================================================
     */

    const totalProducts = products.length;

    const totalStock = products.reduce((sum, product) => {
      return sum + Number(product.stockQuantity);
    }, 0);

    const lowStockProducts = products.filter((product) => {
      const quantity = Number(product.stockQuantity);
      const alertLevel = Number(product.lowStockAlert);

      return quantity > 0 && quantity <= alertLevel;
    });

    const outOfStockProducts = products.filter((product) => {
      return Number(product.stockQuantity) <= 0;
    });

    const inventoryValue = products.reduce((sum, product) => {
      return sum + Number(product.stockQuantity) * Number(product.price);
    }, 0);

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    return NextResponse.json({
      stats: {
        totalProducts,
        totalStock,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        inventoryValue,
      },

      currency: user.company?.currency || "USD",

      lowStockProducts: lowStockProducts.slice(0, 10).map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        unit: product.unit,
        stockQuantity: Number(product.stockQuantity),
        lowStockAlert: Number(product.lowStockAlert),
        price: Number(product.price),
      })),

      recentMovements: recentMovements.map((movement) => ({
        id: movement.id,
        type: movement.type,
        quantity: Number(movement.quantity),
        reference: movement.reference,
        notes: movement.notes,
        createdAt: movement.createdAt,

        product: {
          id: movement.product.id,
          name: movement.product.name,
          sku: movement.product.sku,
          unit: movement.product.unit,
        },
      })),
    });
  } catch (error) {
    console.error("Inventory dashboard error:", error);

    return NextResponse.json(
      {
        error: "Failed to load inventory data.",
      },
      {
        status: 500,
      },
    );
  }
}
