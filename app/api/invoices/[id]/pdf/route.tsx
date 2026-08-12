import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { renderToBuffer } from "@react-pdf/renderer";

import InvoicePDF from "../../../../../components/pdf/InvoicePDF";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // =========================
    // AUTH
    // =========================

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

    // =========================
    // GET INVOICE
    // =========================

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },

      include: {
        company: true,

        client: true,

        createdBy: true,

        quotation: true,

        items: {
          include: {
            product: true,

            service: true,
          },
        },

        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        {
          message: "Invoice not found",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // GENERATE PDF
    // =========================

    const pdfBuffer = await renderToBuffer(
      <InvoicePDF invoice={invoice} company={invoice.company} />,
    );

    // =========================
    // RESPONSE
    // =========================

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",

        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.log("Invoice PDF Error:", error);

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
