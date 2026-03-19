import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.company.findFirst({ where: { ownerAuthId: user.id } });
  if (existing) return NextResponse.json({ companyId: existing.id });

  const company = await prisma.company.create({
    data: {
      name: (user.user_metadata?.company_name as string | undefined) ?? "My HVAC Company",
      ownerAuthId: user.id,
      phone: (user.user_metadata?.phone as string | undefined) ?? null,
    },
  });
  return NextResponse.json({ companyId: company.id });
}
