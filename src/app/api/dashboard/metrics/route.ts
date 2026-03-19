import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { addDays, endOfDay, startOfDay, startOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);
  const in30days = addDays(now, 30);

  const [jobsToday, invoices, expiringContracts, techs, recentJobs] = await Promise.all([
    prisma.job.findMany({
      where: { companyId, scheduledAt: { gte: todayStart, lte: todayEnd } },
      include: { tech: true },
    }),
    prisma.invoice.findMany({ where: { companyId } }),
    prisma.maintenanceContract.findMany({
      where: { companyId, renewalDate: { lte: in30days }, status: { in: ["active", "expiring"] } },
      include: { customer: true },
    }),
    prisma.tech.findMany({ where: { companyId } }),
    prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { customer: true, tech: true },
    }),
  ]);

  const unassigned = jobsToday.filter((j) => !j.techId).length;
  const revenueMTD = invoices
    .filter((i) => i.status === "paid" && i.createdAt >= monthStart)
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const techUtilization = techs.map((t) => ({
    id: t.id,
    name: t.name,
    initials: t.name.split(" ").map((n) => n[0]).join(""),
    assigned: jobsToday.filter((j) => j.techId === t.id).length,
    capacity: 4,
    completed: jobsToday.filter((j) => j.techId === t.id && j.status === "completed").length,
  }));

  const activity = recentJobs.map((j) => ({
    id: j.id,
    type: j.status === "completed" ? "completed" : "created",
    text:
      j.status === "completed"
        ? `${j.tech?.name ?? "Tech"} completed ${j.jobType} — ${j.customer?.firstName ?? ""} ${j.customer?.lastName ?? ""}`.trim()
        : `New ${j.jobType} job — ${j.customer?.firstName ?? ""} ${j.customer?.lastName ?? ""}`.trim(),
    timestamp: j.createdAt.toISOString(),
  }));

  return NextResponse.json({
    jobsToday: jobsToday.length,
    unassigned,
    revenueMTD,
    outstanding,
    expiringContracts: expiringContracts.length,
    atRiskValue: expiringContracts.reduce((sum, c) => sum + c.price, 0),
    techUtilization,
    dispatchStatus: { assigned: jobsToday.length - unassigned, unassigned, total: jobsToday.length },
    recentActivity: activity,
  });
}
