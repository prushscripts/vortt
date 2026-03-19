import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import React from "react";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { customer: true },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await renderToBuffer(React.createElement(InvoicePDF, { invoice }) as any);
  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNo}.pdf"`,
    },
  });
}
