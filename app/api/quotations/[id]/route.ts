import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// =====================================================
// GET SINGLE QUOTATION
// =====================================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const { id } = await params;

    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        client: true,

        createdBy: true,

        approvedBy: true,

        items: {
          include: {
            product: true,
            service: true,
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        {
          message: "Quotation not found",
        },
        {
          status: 404,
        },
      );
    }

    console.log("Quotation status:", quotation.status);
    console.log("Quotation:", quotation);

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("GET QUOTATION ERROR:", error);

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

// =====================================================
// UPDATE QUOTATION
// =====================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const { id } = await params;

    const body = await req.json();

    const { clientId, items, discount = 0, tax = 0, notes, validUntil } = body;

    // -------------------------------------------------
    // VALIDATE ITEMS
    // -------------------------------------------------

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message: "Quotation requires items",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------------------------------
    // FIND EXISTING QUOTATION
    // -------------------------------------------------

    const existing = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "Quotation not found",
        },
        {
          status: 404,
        },
      );
    }

    // -------------------------------------------------
    // PREVENT EDITING CONVERTED QUOTATION
    // -------------------------------------------------

    if (existing.status === "CONVERTED") {
      return NextResponse.json(
        {
          message: "Converted quotation cannot be edited",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------------------------------
    // CALCULATE SUBTOTAL
    // -------------------------------------------------

    let subtotal = 0;

    const quotationItems = items.map((item: any) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      const total = quantity * unitPrice;

      subtotal += total;

      return {
        description: item.description,

        quantity,

        unitPrice,

        total,

        productId: item.productId || null,

        serviceId: item.serviceId || null,
      };
    });

    // -------------------------------------------------
    // UPDATE QUOTATION
    // -------------------------------------------------

    const updated = await prisma.$transaction(async (tx) => {
      // Delete old items
      await tx.quotationItem.deleteMany({
        where: {
          quotationId: id,
        },
      });

      // Create new items
      return tx.quotation.update({
        where: {
          id,
        },

        data: {
          clientId,

          subtotal,

          discount: Number(discount),

          tax: Number(tax),

          total: subtotal - Number(discount) + Number(tax),

          notes,

          validUntil: validUntil ? new Date(validUntil) : null,

          items: {
            create: quotationItems,
          },
        },

        include: {
          client: true,

          items: {
            include: {
              product: true,
              service: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE QUOTATION ERROR:", error);

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

// =====================================================
// DELETE QUOTATION
// =====================================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const { id } = await params;

    // -------------------------------------------------
    // FIND QUOTATION
    // -------------------------------------------------

    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        invoice: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        {
          message: "Quotation not found",
        },
        {
          status: 404,
        },
      );
    }

    // -------------------------------------------------
    // PREVENT DELETING CONVERTED QUOTATION
    // -------------------------------------------------

    if (quotation.invoice) {
      return NextResponse.json(
        {
          message: "Quotation already converted to invoice",
        },
        {
          status: 400,
        },
      );
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await prisma.quotation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error("DELETE QUOTATION ERROR:", error);

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

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyToken } from "@/lib/auth";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const token = req.cookies.get("token")?.value;

//     if (!token)
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const user: any = await verifyToken(token);

//     const quotation = await prisma.quotation.findFirst({
//       where: {
//         id: params.id,
//         companyId: user.companyId,
//       },

//       include: {
//         client: true,

//         createdBy: true,

//         approvedBy: true,

//         items: {
//           include: {
//             product: true,
//             service: true,
//           },
//         },
//       },
//     });

//     if (!quotation)
//       return NextResponse.json(
//         { message: "Quotation not found" },
//         { status: 404 },
//       );

//     return NextResponse.json(quotation);
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const quotation = await prisma.quotation.delete({
//       where: {
//         id: params.id,
//       },
//     });

//     return NextResponse.json({
//       message: "Quotation deleted",
//       quotation,
//     });
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       { message: "Cannot delete quotation" },
//       { status: 500 },
//     );
//   }
// }
