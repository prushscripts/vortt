import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }
  const parts = await prisma.part.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(parts);
}
