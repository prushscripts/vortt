import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createJobSchema = z.object({
  companyId: z.string(),
  customerId: z.string(),
  techId: z.string().optional(),
  jobType: z.enum(["maintenance", "repair", "install", "emergency"]),
  priority: z.enum(["emergency", "high", "normal"]).default("normal"),
  scheduledAt: z.string().datetime().optional(),
  description: z.string().optional(),
  totalAmount: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  let scheduledAtFilter = {};
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    scheduledAtFilter = { scheduledAt: { gte: start, lte: end } };
  }

  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      ...(status ? { status } : {}),
      ...scheduledAtFilter,
    },
    include: {
      customer: true,
      tech: true,
    },
    orderBy: [
      { priority: "desc" },
      { scheduledAt: "asc" },
    ],
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      photos: [],
    },
    include: { customer: true, tech: true },
  });

  return NextResponse.json(job, { status: 201 });
}
