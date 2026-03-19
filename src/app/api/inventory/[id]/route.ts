import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const quantity = Number(body?.quantity);

  if (!Number.isFinite(quantity) || quantity < 0) {
    return NextResponse.json({ error: "quantity must be a non-negative number" }, { status: 400 });
  }

  const updated = await prisma.part.update({
    where: { id },
    data: { stockQty: Math.round(quantity) },
  });

  return NextResponse.json(updated);
}
