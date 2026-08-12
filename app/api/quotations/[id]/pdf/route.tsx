export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import QuotationPDF from "../../../../../components/pdf/QuotationPDF";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // ==========================
    // AUTH
    // ==========================

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ==========================
    // PARAMS
    // ==========================

    const { id } = await params;

    // ==========================
    // QUOTATION
    // ==========================

    const quotation = await prisma.quotation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
      include: {
        client: true,
        createdBy: true,
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
        { message: "Quotation not found" },
        { status: 404 },
      );
    }

    // ==========================
    // COMPANY
    // ==========================

    const company = await prisma.company.findUnique({
      where: {
        id: user.companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    // ==========================
    // FORMAT DATA
    // ==========================

    const formattedQuotation = {
      ...quotation,
      subtotal: Number(quotation.subtotal),
      discount: Number(quotation.discount),
      tax: Number(quotation.tax),
      total: Number(quotation.total),

      createdAt: quotation.createdAt.toISOString(),
      updatedAt: quotation.updatedAt.toISOString(),
      validUntil: quotation.validUntil?.toISOString() ?? null,
      approvedAt: quotation.approvedAt?.toISOString() ?? null,
      sentAt: quotation.sentAt?.toISOString() ?? null,
      convertedAt: quotation.convertedAt?.toISOString() ?? null,

      items: quotation.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
        createdAt: item.createdAt.toISOString(),
      })),
    };

    const formattedCompany = {
      ...company,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      defaultTax: 15,
    };

    // ==========================
    // GENERATE PDF
    // ==========================

    const stream = await renderToStream(
      <QuotationPDF
        quotation={formattedQuotation}
        company={formattedCompany}
      />,
    );

    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const pdfBuffer = Buffer.concat(chunks);

    // ==========================
    // RETURN
    // ==========================

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${quotation.quotationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Error:", error);

    return NextResponse.json(
      {
        message: "PDF generation failed",
      },
      {
        status: 500,
      },
    );
  }
}
