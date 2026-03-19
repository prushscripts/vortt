import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  companyId: z.string(),
  customerId: z.string(),
  tier: z.enum(["basic", "premium"]),
  price: z.number(),
  startDate: z.string().datetime(),
  renewalDate: z.string().datetime(),
  autoRenew: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const contracts = await prisma.maintenanceContract.findMany({
    where: { companyId },
    include: { customer: true },
    orderBy: { renewalDate: "asc" },
  });

  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const contract = await prisma.maintenanceContract.create({
    data: parsed.data,
    include: { customer: true },
  });

  return NextResponse.json(contract, { status: 201 });
}
