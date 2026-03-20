import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/twilio/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const data: {
    techId?: string | null;
    status?: string;
    startedAt?: Date;
    completedAt?: Date;
  } = {};

  if (typeof body?.techId !== "undefined") data.techId = body.techId || null;
  if (typeof body?.status === "string") {
    data.status = body.status;
    if (body.status === "in_progress") data.startedAt = new Date();
    if (body.status === "completed") data.completedAt = new Date();
  }

  const updated = await prisma.job.update({
    where: { id },
    data,
    include: { customer: true, tech: true },
  });

  if (data.techId && updated.tech?.phone) {
    try {
      await sendSMS(
        updated.tech.phone,
        `VORTT: New job assigned at ${updated.customer.address}. ${updated.jobType} - ${updated.priority} priority.`
      );
    } catch {
      // optional SMS
    }
  }

  if (data.status === "completed" && updated.customer.phone) {
    try {
      await sendSMS(
        updated.customer.phone,
        `Hi ${updated.customer.firstName}, your ${updated.jobType} service is complete. Thank you for choosing us.`
      );
    } catch {
      // optional SMS
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
