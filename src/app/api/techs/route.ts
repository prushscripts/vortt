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

export async function POST(req: NextRequest) {
  try {
    const { companyId, name, phone, email, certifications } = await req.json()
    if (!companyId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const tech = await prisma.tech.create({
      data: { companyId, name, phone, email, skills: certifications ?? [] }
    })
    return NextResponse.json(tech)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create tech' }, { status: 500 })
  }
}
