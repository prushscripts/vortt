"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { useRouter } from "next/navigation";
import { useCompanyId } from "@/hooks/useCompanyId";
import type { Job, JobStatus } from "@/types";

export default function JobsPage() {
  const { companyId, loading: companyLoading } = useCompanyId();
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!companyId) return;
    setJobsLoading(true);
    fetch(`/api/jobs?companyId=${companyId}`)
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? d))
      .finally(() => setJobsLoading(false));
  }, [companyId]);

  const filteredJobs = filter === "all"
    ? jobs
    : jobs.filter((j) => j.status === filter);

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
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#F8F8FA]">Jobs</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            {jobs.length} total today · {jobs.filter((j) => !j.techId).length} unassigned
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
                ? "bg-[var(--orange)] text-white border-transparent"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--bg-border)]"
            }`}
          >
            {value === "all" ? "All" : label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {(companyLoading || jobsLoading) &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                animation: "pulse 1.5s infinite",
              }}
            >
              <div style={{ width: "40%", height: 12, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: 10 }} />
              <div style={{ width: "70%", height: 18, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: "55%", height: 12, background: "var(--bg-elevated)", borderRadius: 6 }} />
            </div>
          ))}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-[var(--bg-surface)] rounded-2xl border border-[var(--bg-border)]">
            <p className="text-[var(--text-secondary)]">No jobs found</p>
          </div>
        )}
        {filteredJobs.map((job) => (
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
