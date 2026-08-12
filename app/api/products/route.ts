import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// GET PRODUCTS
export async function GET() {
  try {
    const user = await requirePermission("products.view");

    const products = await prisma.product.findMany({
      where: {
        companyId: user.companyId,
      },

      include: {
        _count: {
          select: {
            stockMovements: true,
            quotationItems: true,
            invoiceItems: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }
}

// CREATE PRODUCT
export async function POST(req: Request) {
  try {
    const user = await requirePermission("products.create");

    const body = await req.json();

    const {
      name,
      description,
      sku,
      unit,
      price,
      stockQuantity,
      lowStockAlert,
      trackStock,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        {
          message: "Name and price required",
        },
        {
          status: 400,
        },
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name,

          description,

          sku,

          unit,

          price,

          stockQuantity: stockQuantity ?? 0,

          lowStockAlert: lowStockAlert ?? 5,

          trackStock: trackStock ?? true,

          companyId: user.companyId,
        },
      });

      // CREATE OPENING STOCK MOVEMENT

      if (stockQuantity && Number(stockQuantity) > 0) {
        await tx.stockMovement.create({
          data: {
            companyId: user.companyId,

            productId: createdProduct.id,

            type: "STOCK_IN",

            quantity: stockQuantity,

            reference: "OPENING STOCK",

            notes: "Initial product stock",
          },
        });
      }

      return createdProduct;
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "CREATE_PRODUCT",

        entity: "Product",

        entityId: product.id,
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed creating product",
      },
      {
        status: 500,
      },
    );
  }
}
