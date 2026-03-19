"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Map,
  DollarSign,
  FileText,
  Users,
  Activity,
  Plus,
  UserPlus,
  Zap,
  CheckCircle,
  Send,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatRelative } from "@/lib/utils/format";
import type { DashboardMetrics, ActivityItem } from "@/types";

// Placeholder data — replace with real API calls
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

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const icons = {
    job_completed: <CheckCircle className="w-4 h-4 text-vortt-green" />,
    invoice_sent: <Send className="w-4 h-4 text-blue-500" />,
    contract_renewed: <RefreshCw className="w-4 h-4 text-vortt-orange" />,
    job_created: <Plus className="w-4 h-4 text-vortt-amber" />,
    review_sent: <TrendingUp className="w-4 h-4 text-purple-500" />,
  };
  return icons[type] ?? <Activity className="w-4 h-4 text-zinc-400" />;
}

export default function DashboardPage() {
  const metrics = mockMetrics;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{greeting}</p>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">
            Operations
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dispatch">
            <Button size="sm" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">AI Dispatch</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/jobs/new">
          <Card hover padding="sm" className="text-center">
            <Plus className="w-5 h-5 text-vortt-orange mx-auto mb-1" />
            <p className="text-xs font-semibold text-vortt-charcoal">New Job</p>
          </Card>
        </Link>
        <Link href="/customers/new">
          <Card hover padding="sm" className="text-center">
            <UserPlus className="w-5 h-5 text-vortt-orange mx-auto mb-1" />
            <p className="text-xs font-semibold text-vortt-charcoal">Add Customer</p>
          </Card>
        </Link>
        <Link href="/dispatch">
          <Card hover padding="sm" className="text-center">
            <Map className="w-5 h-5 text-vortt-orange mx-auto mb-1" />
            <p className="text-xs font-semibold text-vortt-charcoal">Dispatch</p>
          </Card>
        </Link>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Today's Dispatch */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-vortt-orange" />
              <CardTitle>Today&apos;s Dispatch</CardTitle>
            </div>
            <Link href="/dispatch" className="text-xs text-vortt-orange font-medium">View →</Link>
          </CardHeader>
          <div className="mt-1">
            <div className="flex items-end gap-1 mb-3">
              <span className="font-heading font-bold text-4xl text-vortt-charcoal">{metrics.todayJobs}</span>
              <span className="text-zinc-500 text-sm mb-1">jobs today</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="font-heading font-bold text-xl text-vortt-green">{metrics.assignedJobs}</p>
                <p className="text-xs text-zinc-500">Assigned</p>
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-vortt-red">{metrics.unassignedJobs}</p>
                <p className="text-xs text-zinc-500">Unassigned</p>
              </div>
            </div>
            {metrics.unassignedJobs > 0 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-vortt-orange flex-shrink-0" />
                <p className="text-xs text-vortt-orange font-medium">{metrics.unassignedJobs} jobs need assignment</p>
              </div>
            )}
          </div>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-vortt-green" />
              <CardTitle>Revenue This Month</CardTitle>
            </div>
            <Link href="/invoices" className="text-xs text-vortt-orange font-medium">View →</Link>
          </CardHeader>
          <div className="mt-1 space-y-3">
            <div>
              <div className="flex items-end gap-1">
                <span className="font-heading font-bold text-4xl text-vortt-charcoal">
                  {formatCurrency(metrics.revenueThisMonth)}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Total invoiced</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="font-heading font-bold text-lg text-vortt-green">
                  {formatCurrency(metrics.revenueCollected)}
                </p>
                <p className="text-xs text-zinc-500">Collected</p>
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-vortt-amber">
                  {formatCurrency(metrics.revenueOutstanding)}
                </p>
                <p className="text-xs text-zinc-500">Outstanding</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contracts Expiring */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-vortt-amber" />
              <CardTitle>Expiring Contracts</CardTitle>
            </div>
            <Link href="/contracts" className="text-xs text-vortt-orange font-medium">View →</Link>
          </CardHeader>
          <div className="mt-1">
            <div className="flex items-end gap-1 mb-1">
              <span className="font-heading font-bold text-4xl text-vortt-charcoal">{metrics.contractsExpiringSoon}</span>
              <span className="text-zinc-500 text-sm mb-1">this month</span>
            </div>
            <p className="text-sm text-vortt-red font-semibold">
              {formatCurrency(metrics.contractsExpiringValue)} at risk
            </p>
            <Link href="/contracts">
              <Button variant="secondary" size="sm" className="mt-3 w-full">
                Send Renewals
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Tech Utilization */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Tech Utilization</CardTitle>
          </div>
          <Link href="/techs" className="text-xs text-vortt-orange font-medium">All techs →</Link>
        </CardHeader>
        <div className="space-y-3 mt-1">
          {metrics.techUtilization.map((tech) => (
            <div key={tech.techId} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-vortt-orange/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-vortt-orange">
                  {tech.techName.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-vortt-charcoal truncate">{tech.techName}</p>
                  <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">{tech.hoursWorked}h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-100 rounded-full h-1.5">
                    <div
                      className="bg-vortt-orange h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((tech.jobsCompleted / tech.jobsToday) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 flex-shrink-0">
                    {tech.jobsCompleted}/{tech.jobsToday} jobs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4 mt-1">
          {metrics.recentActivity.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ActivityIcon type={item.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-vortt-charcoal leading-snug">{item.description}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{formatRelative(item.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
