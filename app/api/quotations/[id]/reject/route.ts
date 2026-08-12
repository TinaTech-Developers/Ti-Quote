import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const quotation = await prisma.quotation.update({
      where: {
        id,
      },

      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      message: "Quotation rejected",
      quotation,
    });
  } catch (error) {
    console.error("REJECT QUOTATION ERROR:", error);

    return NextResponse.json(
      {
        message: "Reject failed",
      },
      {
        status: 500,
      },
    );
  }
}
