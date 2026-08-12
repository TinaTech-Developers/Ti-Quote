import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { NextResponse } from "next/server";

// =====================================================
// GET PRODUCT
// =====================================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("products.view");

    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        stockMovements: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

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

// =====================================================
// UPDATE PRODUCT
// =====================================================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("products.update");

    const { id } = await params;

    const body = await req.json();

    const { name, description, sku, unit, price, lowStockAlert, trackStock } =
      body;

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },

      data: {
        name,
        description,
        sku,
        unit,
        price,
        lowStockAlert,
        trackStock,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "UPDATE_PRODUCT",

        entity: "Product",

        entityId: product.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Update failed",
      },
      {
        status: 500,
      },
    );
  }
}

// =====================================================
// DELETE PRODUCT
// SOFT DELETE
// =====================================================

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requirePermission("products.delete");

    const { id } = await params;

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

    await prisma.product.update({
      where: {
        id,
      },

      data: {
        active: false,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId: user.companyId,

        userId: user.id,

        action: "DELETE_PRODUCT",

        entity: "Product",

        entityId: id,
      },
    });

    return NextResponse.json({
      message: "Product deactivated",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Delete failed",
      },
      {
        status: 500,
      },
    );
  }
}
