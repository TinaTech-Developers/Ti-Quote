import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// =====================================================
// ADD STOCK MOVEMENT
// =====================================================

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("products.update");

    // Next.js 16
    const { id } = await params;

    const body = await req.json();

    const { type, quantity, reference, notes } = body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!type || quantity === undefined || quantity === null) {
      return NextResponse.json(
        {
          message: "Type and quantity required",
        },
        {
          status: 400,
        },
      );
    }

    const qty = Number(quantity);

    if (Number.isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        {
          message: "Quantity must be greater than zero",
        },
        {
          status: 400,
        },
      );
    }

    // =================================================
    // VALIDATE MOVEMENT TYPE
    // =================================================

    const validTypes = ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          message: "Invalid stock movement type",
        },
        {
          status: 400,
        },
      );
    }

    // =================================================
    // FIND PRODUCT
    // =================================================

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    // =================================================
    // UPDATE STOCK + CREATE MOVEMENT
    // =================================================

    const result = await prisma.$transaction(async (tx) => {
      let newStock = Number(product.stockQuantity);

      // -----------------------------------------------
      // STOCK IN
      // -----------------------------------------------

      if (type === "STOCK_IN") {
        newStock += qty;
      }

      // -----------------------------------------------
      // STOCK OUT
      // -----------------------------------------------

      if (type === "STOCK_OUT") {
        newStock -= qty;

        if (newStock < 0) {
          throw new Error("Insufficient stock");
        }
      }

      // -----------------------------------------------
      // ADJUSTMENT
      // -----------------------------------------------

      if (type === "ADJUSTMENT") {
        newStock = qty;
      }

      // -----------------------------------------------
      // UPDATE PRODUCT
      // -----------------------------------------------

      const updatedProduct = await tx.product.update({
        where: {
          id: product.id,
        },

        data: {
          stockQuantity: newStock,
        },
      });

      // -----------------------------------------------
      // CREATE STOCK MOVEMENT
      // -----------------------------------------------

      const movement = await tx.stockMovement.create({
        data: {
          companyId: user.companyId,

          productId: product.id,

          type,

          quantity: qty,

          reference: reference || null,

          notes: notes || null,
        },
      });

      return {
        updatedProduct,
        movement,
      };
    });

    // =================================================
    // ACTIVITY LOG
    // =================================================

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "STOCK_MOVEMENT",

        entity: "Product",

        entityId: product.id,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("STOCK MOVEMENT ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Stock update failed",
      },
      {
        status: 500,
      },
    );
  }
}
