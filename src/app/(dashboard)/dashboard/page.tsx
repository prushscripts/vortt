"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatRelative } from "@/lib/utils/format";
import type { DashboardMetrics } from "@/types";

const mockMetrics: DashboardMetrics = {
  todayJobs: 12,
  assignedJobs: 9,
  unassignedJobs: 3,
  revenueThisMonth: 48200,
  revenueCollected: 31500,
  revenueOutstanding: 16700,
  contractsExpiringSoon: 7,
  contractsExpiringValue: 9800,
  techUtilization: [
    { techId: "1", techName: "Jake Torres", jobsToday: 4, hoursWorked: 6.5, jobsCompleted: 3 },
    { techId: "2", techName: "Marcus Webb", jobsToday: 3, hoursWorked: 5, jobsCompleted: 2 },
    { techId: "3", techName: "Devon Hall", jobsToday: 3, hoursWorked: 4, jobsCompleted: 3 },
    { techId: "4", techName: "Riley Chen", jobsToday: 2, hoursWorked: 3, jobsCompleted: 1 },
  ],
  recentActivity: [
    { id: "1", type: "job_completed", description: "Jake completed AC repair — Smith Residence", timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: "2", type: "invoice_sent", description: "Invoice #1042 sent to Maria Gonzalez — $850", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "3", type: "job_created", description: "New emergency call — Johnson HVAC failure", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: "4", type: "review_sent", description: "Review request sent to Tom Bradley", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "5", type: "contract_renewed", description: "Contract renewed — Davis Family, $399/yr", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  ],
};

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Card>
      <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-2">{label}</p>
      <p className="font-heading font-bold text-3xl text-[#F8F8FA] leading-none" style={accent ? { color: accent } : {}}>
        {value}
      </p>
      {sub && <p className="text-xs text-[rgba(248,248,250,0.38)] mt-1.5">{sub}</p>}
    </Card>
  );
}

function DashboardBody({ m }: { m: DashboardMetrics }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h2 className="font-heading font-bold text-2xl text-[#F8F8FA]">Good morning</h2>
        </div>
        <Link href="/dispatch">
          <Button size="md">Run AI Dispatch</Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/jobs/new", label: "New Job" },
          { href: "/customers/new", label: "Add Customer" },
          { href: "/dispatch", label: "Dispatch" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}>
            <Card hover padding="sm" className="text-center py-4">
              <p className="text-xs font-medium text-[rgba(248,248,250,0.65)]">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Jobs Today" value={String(m.todayJobs)} sub={`${m.unassignedJobs} unassigned`} />
        <StatCard label="Revenue MTD" value={formatCurrency(m.revenueThisMonth)} sub="this month" />
        <StatCard label="Outstanding" value={formatCurrency(m.revenueOutstanding)} sub="uncollected" accent="#F59E0B" />
        <StatCard label="Expiring" value={String(m.contractsExpiringSoon)} sub={`${formatCurrency(m.contractsExpiringValue)} at risk`} accent="#F43F5E" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider">Tech Utilization</p>
            <Link href="/techs" className="text-xs text-[#FF6B2B] hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {m.techUtilization.map((tech) => {
              const pct = Math.round((tech.jobsCompleted / tech.jobsToday) * 100);
              return (
                <div key={tech.techId} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#FF6B2B]"
                    style={{ background: "rgba(255,107,43,0.12)" }}
                  >
                    {tech.techName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[#F8F8FA] truncate">{tech.techName}</p>
                      <span className="text-xs text-[rgba(248,248,250,0.38)] ml-2 flex-shrink-0">{tech.jobsCompleted}/{tech.jobsToday}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : "#FF6B2B" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider">Dispatch Status</p>
            <Link href="/dispatch" className="text-xs text-[#FF6B2B] hover:underline">Open →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Assigned", value: m.assignedJobs, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
              { label: "Unassigned", value: m.unassignedJobs, color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
              { label: "Total", value: m.todayJobs, color: "#F8F8FA", bg: "rgba(255,255,255,0.06)" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-[10px]" style={{ background: bg }}>
                <span className="text-sm text-[rgba(248,248,250,0.65)]">{label}</span>
                <span className="font-heading font-bold text-lg" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          {m.unassignedJobs > 0 && (
            <Link href="/dispatch">
              <Button fullWidth variant="outline" size="sm" className="mt-3">
                ⚡ Run AI Dispatch
              </Button>
            </Link>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-4">Recent Activity</p>
        <div className="space-y-1">
          {m.recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-white/[0.03] transition-colors">
                <span className="text-base w-6 flex-shrink-0">•</span>
                <p className="flex-1 text-sm text-[rgba(248,248,250,0.65)] min-w-0 truncate">{item.description}</p>
                <span className="text-xs text-[rgba(248,248,250,0.28)] flex-shrink-0 font-mono-label">{formatRelative(item.timestamp)}</span>
              </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function DashboardPageInner() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.companyId) return Promise.resolve(null);
        return fetch(`/api/dashboard/metrics?companyId=${d.companyId}`).then((r) => r.json());
      })
      .then((d: unknown) => {
        if (cancelled || !d || typeof d !== "object") return;
        const row = d as Record<string, unknown>;
        if ("error" in row && row.error) return;
        setMetrics({
          todayJobs: (row.jobsToday as number) ?? 0,
          assignedJobs: ((row.dispatchStatus as { assigned?: number })?.assigned) ?? 0,
          unassignedJobs: (row.unassigned as number) ?? 0,
          revenueThisMonth: (row.revenueMTD as number) ?? 0,
          revenueCollected: (row.revenueMTD as number) ?? 0,
          revenueOutstanding: (row.outstanding as number) ?? 0,
          contractsExpiringSoon: (row.expiringContracts as number) ?? 0,
          contractsExpiringValue: (row.atRiskValue as number) ?? 0,
          techUtilization: ((row.techUtilization as Array<{ id: string; name: string; assigned: number; completed: number }>) ?? []).map((t) => ({
            techId: t.id,
            techName: t.name,
            jobsToday: t.assigned || 1,
            hoursWorked: 0,
            jobsCompleted: t.completed || 0,
          })),
          recentActivity: ((row.recentActivity as Array<{ id: string; text: string; timestamp: string; type: string }>) ?? []).map((a) => ({
            id: a.id,
            type: a.type === "completed" ? "job_completed" : "job_created",
            description: a.text,
            timestamp: a.timestamp,
          })),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("subscribed") === "true") {
      setToastVisible(true);
      const timer = setTimeout(() => {
        setToastVisible(false);
        router.replace("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const m = useMemo(() => metrics ?? mockMetrics, [metrics]);

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardBody m={m} />
      {toastVisible ? (
        <div
          className="fixed bottom-6 right-6 rounded-[14px] px-5 py-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--green)" }}
        >
          <p className="text-sm text-[var(--text-primary)]">
            Welcome to VORTT! Your 14-day free trial has started.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<div className="space-y-6 animate-fade-in"><DashboardBody m={mockMetrics} /></div>}>
      <DashboardPageInner />
    </ErrorBoundary>
  );
}
