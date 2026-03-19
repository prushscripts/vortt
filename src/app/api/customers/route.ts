import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCustomerSchema = z.object({
  companyId: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().optional(),
  equipment: z.array(z.object({
    type: z.string(),
    brand: z.string(),
    model: z.string(),
    serial: z.string().optional(),
    installedYear: z.number().optional(),
  })).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const search = searchParams.get("search") ?? "";

  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const customers = await prisma.customer.findMany({
    where: {
      companyId,
      OR: search
        ? [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
            { address: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, ...data } = parsed.data;

  const customer = await prisma.customer.create({
    data: {
      ...data,
      email: email || null,
      equipment: data.equipment ?? [],
    },
  });

  return NextResponse.json(customer, { status: 201 });
}
