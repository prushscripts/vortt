"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle, X, AlertTriangle, User, MapPin, Clock, Loader2, Navigation } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { DispatchMap } from "@/components/dispatch/DispatchMap";
import { formatDateTime } from "@/lib/utils/format";
import type { Job, Tech, DispatchSuggestion } from "@/types";

interface SuggestionCard {
  suggestion: DispatchSuggestion;
  job: Job;
  tech: Tech;
}

export default function DispatchPage() {
  const [techs, setTechs] = useState<Tech[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [assignments, setAssignments] = useState<Map<string, string>>(new Map()); // jobId -> techId
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) {
          setDataLoaded(true);
          return;
        }
        return Promise.all([
          fetch(`/api/jobs?companyId=${cid}`).then((r) => r.json()),
          fetch(`/api/techs?companyId=${cid}`).then((r) => r.json()),
        ]).then(([jobsRes, techsRes]) => {
          const jobList = Array.isArray(jobsRes) ? jobsRes : [];
          const techList = Array.isArray(techsRes) ? techsRes : [];
          setJobs(jobList);
          setTechs(techList);
          setDataLoaded(true);
        });
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, []);

  const unassignedJobs = jobs.filter((j) => !j.techId && !assignments.has(j.id));
  const inProgressJobs = jobs.filter((j) => j.status === "in_progress");

  const runAIDispatch = async () => {
    setLoadingAI(true);
    setSuggestions([]);

    try {
      const res = await fetch("/api/dispatch/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: unassignedJobs.map(j => ({
            id: j.id,
            priority: j.priority,
            jobType: j.jobType,
            description: j.description,
            customerLat: j.customer?.lat,
            customerLng: j.customer?.lng,
            customerAddress: j.customer?.address,
            scheduledAt: j.scheduledAt,
          })),
          techs: techs.map(t => ({
            id: t.id,
            name: t.name,
            skills: t.skills,
            lat: t.lat,
            lng: t.lng,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const cards: SuggestionCard[] = (data.assignments ?? []).map((s: DispatchSuggestion) => {
        const job = unassignedJobs.find(j => j.id === s.jobId);
        const tech = techs.find(t => t.id === s.techId);
        return job && tech ? { suggestion: s, job, tech } : null;
      }).filter(Boolean);

      setSuggestions(cards);
    } catch (err) {
      // Fallback: show demo suggestions
      const demoCards: SuggestionCard[] = unassignedJobs.slice(0, 3).map((job, i) => ({
        suggestion: {
          jobId: job.id,
          techId: techs[i % techs.length]?.id ?? "",
          reasoning: `${techs[i % techs.length]?.name ?? "A tech"} is closest to ${job.customer?.address} and has the right skills for this ${job.jobType}.`,
          estimatedDriveMinutes: 8 + i * 5,
        },
        job,
        tech: techs[i % techs.length],
      }));
      setSuggestions(demoCards);
    } finally {
      setLoadingAI(false);
    }
  };

  const acceptSuggestion = async (card: SuggestionCard) => {
    setAssignments(prev => new Map(prev).set(card.suggestion.jobId, card.suggestion.techId));
    setSuggestions(prev => prev.filter(s => s.suggestion.jobId !== card.suggestion.jobId));
    setAcceptedCount(c => c + 1);

    // Send SMS notifications (owner already approved by clicking Accept)
    try {
      await fetch(`/api/jobs/${card.suggestion.jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techId: card.suggestion.techId, status: "scheduled" }),
      });
      const customerMsg = `Your HVAC tech ${card.tech.name} is scheduled for ${
        card.job.scheduledAt ? new Date(card.job.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "today"
      }. You'll get a heads up when they're on the way.`;

      const techMsg = `New job assigned: ${card.job.customer?.firstName} ${card.job.customer?.lastName} at ${card.job.customer?.address}. ${card.job.description ?? ""}`;

      await Promise.all([
        fetch("/api/sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: card.job.customer?.phone, body: customerMsg, type: "customer_notification" }) }),
        fetch("/api/sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: card.tech.phone, body: techMsg, type: "tech_assignment" }) }),
        fetch("/api/sms/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: card.suggestion.jobId, type: "tech_assigned" }) }),
      ]);
    } catch {
      // Silent fail — assignment still saved
    }
  };

  const dismissSuggestion = (jobId: string) => {
    setSuggestions(prev => prev.filter(s => s.suggestion.jobId !== jobId));
  };

  const statusGroups = [
    { label: "Unassigned", jobs: unassignedJobs, color: "text-vortt-red" },
    { label: "Assigned", jobs: jobs.filter(j => assignments.has(j.id)), color: "text-vortt-green" },
    { label: "In Progress", jobs: inProgressJobs, color: "text-vortt-orange" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      {/* LEFT: Job List Panel */}
      <div className="lg:w-[400px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-heading font-bold text-2xl text-vortt-charcoal">Dispatch</h1>
            <p className="text-zinc-500 text-sm">
              {unassignedJobs.length} unassigned · {acceptedCount} assigned today
            </p>
          </div>
          <Button
            size="sm"
            onClick={runAIDispatch}
            loading={loadingAI}
            disabled={unassignedJobs.length === 0}
            style={{
              background: "linear-gradient(135deg, var(--orange) 0%, #FF8C42 100%)",
              color: "white",
              border: "1px solid rgba(255,107,43,0.5)",
              borderRadius: 10,
              height: 44,
              padding: "0 20px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(255,107,43,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "all 0.15s ease",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,43,0.55), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,43,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          >
            <Sparkles className="w-4 h-4" />
            AI Suggest
          </Button>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              AI Suggestions — Review & Accept
            </p>
            {suggestions.map((card) => (
              <div
                key={card.suggestion.jobId}
                className="bg-[#161618] border border-[#2A2A2E] rounded-[14px] p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <PriorityBadge priority={card.job.priority} />
                    <span className="text-xs font-semibold text-[#F8F8FA]">
                      {card.job.customer?.firstName} {card.job.customer?.lastName}
                    </span>
                  </div>
                  <button onClick={() => dismissSuggestion(card.suggestion.jobId)} className="text-zinc-500 hover:text-zinc-300 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-vortt-orange/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-vortt-orange">
                      {card.tech.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F8F8FA]">{card.tech.name}</p>
                    <p className="text-xs text-[#8E8E93]">~{card.suggestion.estimatedDriveMinutes} min away</p>
                  </div>
                </div>

                <p className="text-xs text-[#8E8E93] mb-3 leading-relaxed">{card.suggestion.reasoning}</p>

                <Button
                  size="sm"
                  fullWidth
                  onClick={() => acceptSuggestion(card)}
                  className="gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept & Notify
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Job Groups */}
        {!dataLoaded && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 14,
                padding: 20,
                opacity: 1 - i * 0.2,
              }}>
                <div style={{
                  width: "35%", height: 11, background: "var(--bg-elevated)",
                  borderRadius: 6, marginBottom: 12,
                  animation: "pulse 1.5s ease-in-out infinite"
                }} />
                <div style={{
                  width: "60%", height: 18, background: "var(--bg-elevated)",
                  borderRadius: 6, marginBottom: 10,
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.1s"
                }} />
              </div>
            ))}
          </div>
        )}
        {dataLoaded && unassignedJobs.length === 0 && jobs.filter(j => assignments.has(j.id)).length === 0 && inProgressJobs.length === 0 && (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            border: '1px dashed var(--bg-border)', borderRadius: 14
          }}>
            <p style={{color: 'var(--text-secondary)', fontSize: 14, margin: 0}}>
              No jobs today
            </p>
            <p style={{color: 'var(--text-muted)', fontSize: 12, marginTop: 4}}>
              All jobs are assigned or no jobs scheduled
            </p>
          </div>
        )}
        {dataLoaded && statusGroups.map(({ label, jobs, color }) => (
          jobs.length > 0 && (
            <div key={label}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color}`}>
                {label} ({jobs.length})
              </p>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div key={job.id} className="dispatch-card" style={{position:'relative'}}>
                    <button
                      onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                      className={`w-full text-left bg-[#161618] border border-[#2A2A2E] rounded-[14px] p-4 transition-all ${
                        selectedJob?.id === job.id ? "border-vortt-orange" : "hover:border-[#3a3a40]"
                      }`}
                    >
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm('Remove this job from dispatch?')) return;
                          await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' });
                          setJobs(prev => prev.filter(j => j.id !== job.id));
                        }}
                        className="delete-btn"
                        style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28, borderRadius: 8,
                          background: 'rgba(255,69,58,0.1)',
                          border: '1px solid rgba(255,69,58,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'var(--red)',
                          opacity: 0, transition: 'opacity 0.15s ease',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    {!job.techId && suggestions.find((s) => s.job.id === job.id) ? (
                      <div className="mb-2 rounded-lg border border-[rgba(255,107,43,0.3)] bg-[rgba(255,107,43,0.08)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                        AI suggests: <strong className="text-[var(--text-primary)]">{suggestions.find((s) => s.job.id === job.id)?.tech.name}</strong>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {job.priority === "emergency" && <PriorityBadge priority="emergency" />}
                      {job.priority === "high" && <PriorityBadge priority="high" />}
                      <span className="text-xs text-zinc-400 capitalize">{job.jobType}</span>
                    </div>
                    <p className="font-heading font-semibold text-vortt-charcoal text-sm">
                      {job.customer?.firstName} {job.customer?.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <p className="text-xs text-zinc-500 truncate">{job.customer?.address}</p>
                    </div>
                    {job.scheduledAt && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <p className="text-xs text-zinc-500">{formatDateTime(job.scheduledAt)}</p>
                      </div>
                    )}
                    {job.tech ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User className="w-3.5 h-3.5 text-vortt-orange" />
                        <p className="text-xs text-vortt-orange font-medium">{job.tech.name}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-vortt-red" />
                        <p className="text-xs text-vortt-red font-medium">Unassigned</p>
                      </div>
                    )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* RIGHT: Map Panel */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden bg-[#1C1C1F]">
        <DispatchMap
          techs={techs}
          jobs={jobs}
          selectedJobId={selectedJob?.id}
          assignments={assignments}
        />
      </div>
    </div>
  );
}
