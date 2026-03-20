"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { useRouter } from "next/navigation";
import type { Job, JobStatus } from "@/types";


export default function JobsPage() {
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then(({ companyId: cid }: { companyId?: string }) => {
        if (!cid) {
          setDataLoaded(true);
          return;
        }
        return fetch(`/api/jobs?companyId=${cid}`)
          .then((r) => r.json())
          .then((data: Job[] | { jobs?: Job[]; error?: string }) => {
            const list = Array.isArray(data) ? data : (data?.jobs ?? []);
            setJobs(list);
            setDataLoaded(true);
          });
      })
      .catch(() => {
        setDataLoaded(true);
      });
  }, []);

  const filteredJobs = filter === "all"
    ? jobs
    : jobs.filter((j) => j.status === filter);

  const unassignedCount = jobs.filter((j) => !j.techId).length;

  const handleSwipeRight = (job: Job) => {
    console.log("Mark en route:", job.id);
  };

  const handleSwipeLeft = (job: Job) => {
    if (job.customer?.phone) {
      window.location.href = `tel:${job.customer.phone}`;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{
            fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 30,
            color: '#F5F5F7', margin: 0, letterSpacing: '-0.02em'
          }}>
            Jobs
          </h1>
          <p style={{ color: '#8E8E93', fontSize: 14, marginTop: 4 }}>
            {jobs.length} total today · {unassignedCount} unassigned
          </p>
        </div>
        <Link href="/jobs/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Job</span>
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar mb-1">
        {[{ label: "All", value: "all" as const }, ...jobs.reduce((acc, j) => {
          if (!acc.find(a => a.value === j.status)) {
            acc.push({ label: j.status.replace("_", " "), value: j.status as JobStatus });
          }
          return acc;
        }, [] as { label: string; value: JobStatus }[])].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`whitespace-nowrap rounded-[20px] border px-4 py-1.5 text-[13px] transition-all ${
              filter === value
                ? "bg-[var(--orange)] text-white border-transparent shadow-[0_2px_12px_rgba(255,107,43,0.35)] font-bold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--bg-border)] hover:border-[rgba(255,107,43,0.3)] hover:text-[var(--text-primary)]"
            }`}
          >
            {value === "all" ? "All" : label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {!dataLoaded &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 14,
                padding: 20,
                marginBottom: 10,
                opacity: 1 - i * 0.2,
              }}
            >
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
              <div style={{
                width: "45%", height: 11, background: "var(--bg-elevated)",
                borderRadius: 6,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: "0.2s"
              }} />
            </div>
          ))}
        {dataLoaded && filteredJobs.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 20px', gap: 16, textAlign: 'center'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div>
              <p style={{fontFamily:'Space Grotesk', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:0}}>
                No jobs yet
              </p>
              <p style={{color:'var(--text-secondary)', fontSize:14, marginTop:6, margin:'6px 0 0'}}>
                Create your first job to start tracking work
              </p>
            </div>
            <a href="/jobs/new" style={{
              background: 'var(--orange)', color: 'white', borderRadius: 10,
              padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', marginTop: 8,
              boxShadow: '0 4px 16px rgba(255,107,43,0.3)'
            }}>+ Create First Job</a>
          </div>
        )}
        {dataLoaded && filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onClick={(j) => router.push(`/jobs/${j.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
