import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/twilio/client";

export async function POST(req: NextRequest) {
  const { jobId, type, message } = await req.json();
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true, tech: true },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const map: Record<string, { to: string; body: string }[]> = {
    tech_assigned: job.tech?.phone
      ? [
          {
            to: job.tech.phone,
            body: `VORTT: You've been assigned a ${job.jobType} job at ${job.customer.address}. Customer: ${job.customer.firstName} ${job.customer.lastName}.`,
          },
        ]
      : [],
    customer_eta: job.customer.phone
      ? [
          {
            to: job.customer.phone,
            body: `Hi ${job.customer.firstName}, your HVAC tech ${job.tech?.name ?? "is"} is on the way. ETA: 30 minutes.`,
          },
        ]
      : [],
    job_complete: job.customer.phone
      ? [
          {
            to: job.customer.phone,
            body: `Hi ${job.customer.firstName}, your ${job.jobType} service is complete. Thank you for choosing us.`,
          },
        ]
      : [],
  };

  const toSend = message && job.customer.phone ? [{ to: job.customer.phone, body: message }] : map[type] ?? [];
  await Promise.all(toSend.map((m) => sendSMS(m.to, m.body)));
  return NextResponse.json({ sent: toSend.length });
}
