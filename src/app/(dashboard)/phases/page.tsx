"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PhaseTask {
  label: string;
  complete: boolean;
  href?: string;
}

interface Phase {
  id: number;
  title: string;
  status: "completed" | "active" | "upcoming";
  summary: string;
  tasks: PhaseTask[];
}

const phases: Phase[] = [
  {
    id: 0,
    title: "Foundation",
    status: "completed",
    summary: "Brand + setup decisions completed enough to start product.",
    tasks: [
      { label: "Initial product prompt and architecture", complete: true },
      { label: "Project scaffolding and deployment flow", complete: true },
      { label: "Core integrations selected (Supabase, Twilio, OpenAI)", complete: true },
    ],
  },
  {
    id: 1,
    title: "MVP Build",
    status: "completed",
    summary: "Phase 1 complete: dispatch-first MVP with supporting operations.",
    tasks: [
      { label: "AI dispatch suggestions", complete: true, href: "/dispatch" },
      { label: "Dispatch board with assignments", complete: true, href: "/dispatch" },
      { label: "Customer database", complete: true, href: "/customers" },
      { label: "Job cards and status flow", complete: true, href: "/jobs" },
      { label: "Basic invoicing", complete: true, href: "/invoices" },
      { label: "Mobile-first dashboard shell", complete: true, href: "/dashboard" },
    ],
  },
  {
    id: 2,
    title: "Beta + Iteration",
    status: "active",
    summary: "Next target: retention metrics + maintenance renewal AI + quote automation.",
    tasks: [
      { label: "Maintenance renewal outreach AI", complete: false, href: "/contracts" },
      { label: "Photo-to-quote improvements", complete: false, href: "/jobs" },
      { label: "Usage instrumentation dashboard", complete: false, href: "/dashboard" },
    ],
  },
  {
    id: 3,
    title: "Growth",
    status: "upcoming",
    summary: "Go-to-market scale and pricing expansion.",
    tasks: [
      { label: "Contractor acquisition loops", complete: false },
      { label: "Tiered pricing rollout", complete: false },
    ],
  },
];

const statusStyles: Record<Phase["status"], string> = {
  completed: "text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10",
  active: "text-[#FF6B2B] border-[#FF6B2B]/30 bg-[#FF6B2B]/10",
  upcoming: "text-[rgba(248,248,250,0.5)] border-white/10 bg-white/[0.03]",
};

export default function PhasesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#F8F8FA]">Build Phases</h1>
          <p className="text-sm text-[rgba(248,248,250,0.65)] mt-1">
            Tracking roadmap execution. Phase 1 is marked complete.
          </p>
        </div>
        <span className="rounded-pill border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-mono-label text-[#22C55E]">
          PHASE 1 COMPLETE
        </span>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>
                  Phase {phase.id}: {phase.title}
                </CardTitle>
                <span className={`rounded-pill border px-2.5 py-1 text-[10px] font-mono-label uppercase ${statusStyles[phase.status]}`}>
                  {phase.status}
                </span>
              </div>
            </CardHeader>

            <p className="text-sm text-[rgba(248,248,250,0.65)] mb-4">{phase.summary}</p>

            <div className="space-y-2.5">
              {phase.tasks.map((task) => (
                <div key={task.label} className="flex items-center justify-between gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                  <div className="flex items-center gap-2">
                    {task.complete ? (
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    ) : (
                      <Circle className="h-4 w-4 text-[rgba(248,248,250,0.38)]" />
                    )}
                    <span className={task.complete ? "text-sm text-[#F8F8FA]" : "text-sm text-[rgba(248,248,250,0.65)]"}>
                      {task.label}
                    </span>
                  </div>
                  {task.href ? (
                    <Link href={task.href}>
                      <Button size="sm" variant="ghost">
                        Open
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
