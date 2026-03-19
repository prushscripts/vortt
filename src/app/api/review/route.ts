import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/twilio/client";
import { z } from "zod";

const schema = z.object({
  jobId: z.string(),
  action: z.enum(["draft", "send"]),
  companyName: z.string().optional(),
  reviewLink: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { jobId, action, companyName, reviewLink } = parsed.data;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true, tech: true },
  });

  if (!job || !job.customer) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const techFirstName = job.tech?.name?.split(" ")[0] ?? "Your tech";
  const customerFirstName = job.customer.firstName;
  const jobTypeLabel: Record<string, string> = {
    repair: "repair",
    maintenance: "tune-up",
    install: "installation",
    emergency: "emergency service",
  };
  const serviceLabel = jobTypeLabel[job.jobType] ?? "service";
  const link = reviewLink ?? process.env.NEXT_PUBLIC_GOOGLE_REVIEW_LINK ?? "https://g.page/r/review";
  const company = companyName ?? "Us";

  const message = `Hi ${customerFirstName}, ${techFirstName} just finished your ${serviceLabel}. Hope everything's working great! If you have 30 seconds, a Google review helps us a ton: ${link} Thanks! - ${company}`;

  if (action === "draft") {
    return NextResponse.json({
      draft: message,
      customer: { name: `${job.customer.firstName} ${job.customer.lastName}`, phone: job.customer.phone },
    });
  }

  // Send
  await sendSMS(job.customer.phone, message);
  await prisma.job.update({
    where: { id: jobId },
    data: { reviewSent: true },
  });

  return NextResponse.json({ sent: true });
}
