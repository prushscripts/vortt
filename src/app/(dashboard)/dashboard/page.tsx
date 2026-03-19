"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatRelative } from "@/lib/utils/format";
import type { DashboardMetrics, ActivityItem } from "@/types";

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
    { techId: "1", techName: "Jake Torres",  jobsToday: 4, hoursWorked: 6.5, jobsCompleted: 3 },
    { techId: "2", techName: "Marcus Webb",  jobsToday: 3, hoursWorked: 5,   jobsCompleted: 2 },
    { techId: "3", techName: "Devon Hall",   jobsToday: 3, hoursWorked: 4,   jobsCompleted: 3 },
    { techId: "4", techName: "Riley Chen",   jobsToday: 2, hoursWorked: 3,   jobsCompleted: 1 },
  ],
  recentActivity: [
    { id: "1", type: "job_completed",   description: "Jake completed AC repair — Smith Residence",       timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: "2", type: "invoice_sent",    description: "Invoice #1042 sent to Maria Gonzalez — $850",      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "3", type: "job_created",     description: "New emergency call — Johnson HVAC failure",        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: "4", type: "review_sent",     description: "Review request sent to Tom Bradley",              timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "5", type: "contract_renewed",description: "Contract renewed — Davis Family, $399/yr",        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  ],
};

const activityConfig: Record<ActivityItem["type"], { emoji: string; color: string }> = {
  job_completed:   { emoji: "✅", color: "#22C55E" },
  invoice_sent:    { emoji: "📤", color: "#3B82F6" },
  contract_renewed:{ emoji: "🔄", color: "#FF6B2B" },
  job_created:     { emoji: "🆕", color: "#F59E0B" },
  review_sent:     { emoji: "⭐", color: "#A78BFA" },
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

export default function DashboardPage() {
  const m = mockMetrics;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h2 className="font-heading font-bold text-2xl text-[#F8F8FA]">Good morning 👋</h2>
        </div>
        <Link href="/dispatch">
          <Button size="md">⚡ AI Dispatch</Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/jobs/new",      emoji: "🔧", label: "New Job" },
          { href: "/customers/new", emoji: "👤", label: "Add Customer" },
          { href: "/dispatch",      emoji: "🗺️", label: "Dispatch" },
        ].map(({ href, emoji, label }) => (
          <Link key={href} href={href}>
            <Card hover padding="sm" className="text-center py-4">
              <div className="text-2xl mb-1.5">{emoji}</div>
              <p className="text-xs font-medium text-[rgba(248,248,250,0.65)]">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Jobs Today"   value={String(m.todayJobs)}  sub={`${m.unassignedJobs} unassigned`} />
        <StatCard label="Revenue MTD"  value={formatCurrency(m.revenueThisMonth)} sub="this month" />
        <StatCard label="Outstanding"  value={formatCurrency(m.revenueOutstanding)} sub="uncollected" accent="#F59E0B" />
        <StatCard label="Expiring"     value={String(m.contractsExpiringSoon)} sub={`${formatCurrency(m.contractsExpiringValue)} at risk`} accent="#F43F5E" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tech Utilization */}
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
                    {tech.techName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[#F8F8FA] truncate">{tech.techName}</p>
                      <span className="text-xs text-[rgba(248,248,250,0.38)] ml-2 flex-shrink-0">{tech.jobsCompleted}/{tech.jobsToday}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : "#FF6B2B" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Dispatch Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider">Dispatch Status</p>
            <Link href="/dispatch" className="text-xs text-[#FF6B2B] hover:underline">Open →</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Assigned",   value: m.assignedJobs,   color: "#22C55E",  bg: "rgba(34,197,94,0.1)" },
              { label: "Unassigned", value: m.unassignedJobs, color: "#F43F5E",  bg: "rgba(244,63,94,0.1)" },
              { label: "Total",      value: m.todayJobs,      color: "#F8F8FA",  bg: "rgba(255,255,255,0.06)" },
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

      {/* Activity Feed */}
      <Card>
        <p className="text-xs font-mono-label text-[rgba(248,248,250,0.38)] uppercase tracking-wider mb-4">Recent Activity</p>
        <div className="space-y-1">
          {m.recentActivity.map((item, i) => {
            const cfg = activityConfig[item.type];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-base w-6 flex-shrink-0">{cfg.emoji}</span>
                <p className="flex-1 text-sm text-[rgba(248,248,250,0.65)] min-w-0 truncate">{item.description}</p>
                <span className="text-xs text-[rgba(248,248,250,0.28)] flex-shrink-0 font-mono-label">
                  {formatRelative(item.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
