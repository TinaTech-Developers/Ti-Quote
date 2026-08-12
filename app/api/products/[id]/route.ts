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
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error);

    if (error?.status === 403) {
      return NextResponse.json(
        {
          message: "You do not have permission to view products.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to load product.",
      },
      {
        status: 500,
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

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          message: "Product name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return NextResponse.json(
        {
          message: "A valid product price is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      lowStockAlert !== undefined &&
      lowStockAlert !== null &&
      Number(lowStockAlert) < 0
    ) {
      return NextResponse.json(
        {
          message: "Low stock alert cannot be negative.",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------------------------------
    // FIND PRODUCT
    // -------------------------------------------------

    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    // -------------------------------------------------
    // SKU DUPLICATE CHECK
    // -------------------------------------------------

    if (sku && sku.trim()) {
      const duplicateSku = await prisma.product.findFirst({
        where: {
          companyId: user.companyId,
          sku: sku.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateSku) {
        return NextResponse.json(
          {
            message: "A product with this SKU already exists.",
          },
          {
            status: 409,
          },
        );
      }
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    const product = await prisma.product.update({
      where: {
        id,
      },

      data: {
        name: name.trim(),
        description:
          description && description.trim() ? description.trim() : null,

        sku: sku && sku.trim() ? sku.trim() : null,

        unit: unit && unit.trim() ? unit.trim() : null,

        price: Number(price),

        lowStockAlert: trackStock ? Number(lowStockAlert || 0) : 0,

        trackStock: Boolean(trackStock),
      },
    });

    // -------------------------------------------------
    // ACTIVITY LOG
    // -------------------------------------------------

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
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR:", error);

    if (error?.status === 403) {
      return NextResponse.json(
        {
          message: "You do not have permission to update products.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Update failed.",
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

    // -------------------------------------------------
    // FIND PRODUCT
    // -------------------------------------------------

    const product = await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        },
      );
    }

    // -------------------------------------------------
    // SOFT DELETE
    // -------------------------------------------------

    await prisma.product.update({
      where: {
        id,
      },

      data: {
        active: false,
      },
    });

    // -------------------------------------------------
    // ACTIVITY LOG
    // -------------------------------------------------

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
      message: "Product deactivated successfully.",
    });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR:", error);

    // IMPORTANT:
    // Don't turn ForbiddenError into a 500.
    if (error?.status === 403) {
      return NextResponse.json(
        {
          message: "You do not have permission to delete products.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Delete failed.",
      },
      {
        status: 500,
      },
    );
  }
}
