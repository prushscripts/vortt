"use client";

import { useState, useCallback } from "react";
import { Sparkles, CheckCircle, X, AlertTriangle, User, MapPin, Clock, Loader2, Navigation } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { DispatchMap } from "@/components/dispatch/DispatchMap";
import { formatDateTime } from "@/lib/utils/format";
import type { Job, Tech, DispatchSuggestion } from "@/types";

// Mock techs with current locations
const mockTechs: Tech[] = [
  { id: "t1", companyId: "c1", name: "Jake Torres", phone: "5120001111", skills: ["refrigerant_certified", "electrical"], isActive: true, lat: 30.2729, lng: -97.7444, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "t2", companyId: "c1", name: "Marcus Webb", phone: "5120002222", skills: ["electrical"], isActive: true, lat: 30.2951, lng: -97.7532, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "t3", companyId: "c1", name: "Devon Hall", phone: "5120003333", skills: ["refrigerant_certified"], isActive: true, lat: 30.2612, lng: -97.7261, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "t4", companyId: "c1", name: "Riley Chen", phone: "5120004444", skills: ["electrical", "commercial"], isActive: true, lat: 30.3121, lng: -97.7651, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
];

const mockJobs: Job[] = [
  {
    id: "j1", companyId: "c1", customerId: "c1", jobType: "emergency", status: "scheduled", priority: "emergency",
    scheduledAt: new Date().toISOString(),
    description: "Complete AC failure — 95°F inside. Elderly resident.",
    photos: [], invoiceSent: false, reviewSent: false, createdAt: new Date().toISOString(),
    customer: { id: "c1", companyId: "c1", firstName: "Sandra", lastName: "Kim", phone: "5122345678", address: "3341 Burnet Rd, Austin TX 78756", lat: 30.3012, lng: -97.7389, createdAt: new Date().toISOString() },
  },
  {
    id: "j2", companyId: "c1", customerId: "c2", jobType: "repair", status: "scheduled", priority: "high",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    description: "Heat pump not switching to cooling mode",
    photos: [], invoiceSent: false, reviewSent: false, createdAt: new Date().toISOString(),
    customer: { id: "c2", companyId: "c1", firstName: "James", lastName: "Whitfield", phone: "5129876543", address: "892 Riverside Dr, Austin TX 78704", lat: 30.2501, lng: -97.7620, createdAt: new Date().toISOString() },
  },
  {
    id: "j3", companyId: "c1", customerId: "c3", jobType: "maintenance", status: "scheduled", priority: "normal",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    description: "Annual maintenance + filter replacement",
    photos: [], invoiceSent: false, reviewSent: false, createdAt: new Date().toISOString(),
    customer: { id: "c3", companyId: "c1", firstName: "Maria", lastName: "Gonzalez", phone: "5121234567", address: "1420 Oak Street, Austin TX 78701", lat: 30.2695, lng: -97.7420, createdAt: new Date().toISOString() },
  },
  {
    id: "j4", companyId: "c1", customerId: "c4", jobType: "repair", status: "scheduled", priority: "normal",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    description: "Thermostat not responding — possible wiring issue",
    photos: [], invoiceSent: false, reviewSent: false, createdAt: new Date().toISOString(),
    customer: { id: "c4", companyId: "c1", firstName: "Robert", lastName: "Chen", phone: "5123456789", address: "4210 South Lamar, Austin TX 78704", lat: 30.2388, lng: -97.7703, createdAt: new Date().toISOString() },
  },
];

// Jobs that are already assigned
const assignedJobs: Job[] = [
  {
    id: "j5", companyId: "c1", customerId: "c5", techId: "t1", jobType: "install", status: "in_progress", priority: "normal",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    description: "New 5-ton Carrier install",
    photos: [], invoiceSent: false, reviewSent: false, createdAt: new Date().toISOString(),
    customer: { id: "c5", companyId: "c1", firstName: "Lisa", lastName: "Morales", phone: "5124567890", address: "7890 North Loop, Austin TX 78756", lat: 30.3211, lng: -97.7512, createdAt: new Date().toISOString() },
    tech: mockTechs[0],
  },
];

interface SuggestionCard {
  suggestion: DispatchSuggestion;
  job: Job;
  tech: Tech;
}

export default function DispatchPage() {
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [assignments, setAssignments] = useState<Map<string, string>>(new Map()); // jobId -> techId
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const unassignedJobs = mockJobs.filter(j => !assignments.has(j.id));
  const allJobs = [...assignedJobs, ...mockJobs.map(j => ({
    ...j,
    techId: assignments.get(j.id),
    tech: assignments.has(j.id) ? mockTechs.find(t => t.id === assignments.get(j.id)) : undefined,
    status: assignments.has(j.id) ? "scheduled" as const : j.status,
  }))];

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
          techs: mockTechs.map(t => ({
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
        const tech = mockTechs.find(t => t.id === s.techId);
        return job && tech ? { suggestion: s, job, tech } : null;
      }).filter(Boolean);

      setSuggestions(cards);
    } catch (err) {
      // Fallback: show demo suggestions
      const demoCards: SuggestionCard[] = unassignedJobs.slice(0, 3).map((job, i) => ({
        suggestion: {
          jobId: job.id,
          techId: mockTechs[i % mockTechs.length].id,
          reasoning: `${mockTechs[i % mockTechs.length].name} is closest to ${job.customer?.address} and has the right skills for this ${job.jobType}.`,
          estimatedDriveMinutes: 8 + i * 5,
        },
        job,
        tech: mockTechs[i % mockTechs.length],
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
      const customerMsg = `Your HVAC tech ${card.tech.name} is scheduled for ${
        card.job.scheduledAt ? new Date(card.job.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "today"
      }. You'll get a heads up when they're on the way.`;

      const techMsg = `New job assigned: ${card.job.customer?.firstName} ${card.job.customer?.lastName} at ${card.job.customer?.address}. ${card.job.description ?? ""}`;

      await Promise.all([
        fetch("/api/sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: card.job.customer?.phone, body: customerMsg, type: "customer_notification" }) }),
        fetch("/api/sms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: card.tech.phone, body: techMsg, type: "tech_assignment" }) }),
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
    { label: "Assigned", jobs: mockJobs.filter(j => assignments.has(j.id)), color: "text-vortt-green" },
    { label: "In Progress", jobs: assignedJobs.filter(j => j.status === "in_progress"), color: "text-vortt-orange" },
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
                className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <PriorityBadge priority={card.job.priority} />
                    <span className="text-xs font-semibold text-vortt-charcoal">
                      {card.job.customer?.firstName} {card.job.customer?.lastName}
                    </span>
                  </div>
                  <button onClick={() => dismissSuggestion(card.suggestion.jobId)} className="text-zinc-400 hover:text-zinc-600 p-1">
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
                    <p className="text-sm font-semibold text-vortt-charcoal">{card.tech.name}</p>
                    <p className="text-xs text-zinc-500">~{card.suggestion.estimatedDriveMinutes} min away</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 mb-3 leading-relaxed">{card.suggestion.reasoning}</p>

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
        {statusGroups.map(({ label, jobs, color }) => (
          jobs.length > 0 && (
            <div key={label}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color}`}>
                {label} ({jobs.length})
              </p>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                    className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
                      selectedJob?.id === job.id ? "border-vortt-orange shadow-md" : "border-zinc-100 shadow-sm hover:border-zinc-200"
                    }`}
                  >
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
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* RIGHT: Map Panel */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden">
        <DispatchMap
          techs={mockTechs}
          jobs={allJobs}
          selectedJobId={selectedJob?.id}
          assignments={assignments}
        />
      </div>
    </div>
  );
}
