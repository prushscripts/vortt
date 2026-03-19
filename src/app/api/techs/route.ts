import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }
  const techs = await prisma.tech.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(techs);
}
