import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addYears } from "date-fns";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await prisma.maintenanceContract.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.maintenanceContract.update({
    where: { id },
    data: {
      renewalDate: addYears(current.renewalDate, 1),
      status: "active",
      outreachSent: true,
    },
    include: { customer: true },
  });
  return NextResponse.json(updated);
}
