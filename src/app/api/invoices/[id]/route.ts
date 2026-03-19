import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/twilio/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const status = body?.status as string | undefined;

  if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      status,
      sentAt: status === "sent" ? new Date() : undefined,
      paidAt: status === "paid" ? new Date() : undefined,
    },
    include: { customer: true },
  });

  if (status === "sent" && updated.customer.phone) {
    try {
      await sendSMS(
        updated.customer.phone,
        `Invoice ${updated.invoiceNo} is ready. Amount due: $${updated.totalAmount.toFixed(2)}.`
      );
    } catch {
      // SMS is optional
    }
  }

  return NextResponse.json(updated);
}
