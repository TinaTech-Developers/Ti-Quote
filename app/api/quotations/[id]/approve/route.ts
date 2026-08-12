import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
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

    const quotation = await prisma.quotation.update({
      where: {
        id: id,
      },

      data: {
        status: "APPROVED",

        approvedById: user.userId,

        approvedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Quotation approved",

      quotation,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Approval failed",
      },
      {
        status: 500,
      },
    );
  }
}
