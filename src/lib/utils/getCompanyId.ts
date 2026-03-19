import { prisma } from "@/lib/prisma";

export async function getCompanyIdForUser(supabaseUserId: string): Promise<string | null> {
  const company = await prisma.company.findFirst({
    where: { ownerAuthId: supabaseUserId },
    select: { id: true },
  });
  return company?.id ?? null;
}
