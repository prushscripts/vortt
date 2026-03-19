"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { useRouter } from "next/navigation";
import type { Job, JobStatus } from "@/types";

const mockJobs: Job[] = [
  {
    id: "j1",
    companyId: "c1",
    customerId: "1",
    techId: "t1",
    jobType: "emergency",
    status: "en_route",
    priority: "emergency",
    scheduledAt: new Date().toISOString(),
    description: "Complete AC failure — temp 95°F inside",
    photos: [],
    invoiceSent: false,
    reviewSent: false,
    createdAt: new Date().toISOString(),
    customer: {
      id: "1", companyId: "c1", firstName: "Sandra", lastName: "Kim",
      phone: "5122345678", address: "3341 Burnet Rd, Austin TX 78756",
      createdAt: new Date().toISOString(),
    },
    tech: {
      id: "t1", companyId: "c1", name: "Jake Torres", phone: "5120001111",
      skills: ["refrigerant_certified", "electrical"], isActive: true,
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "j2",
    companyId: "c1",
    customerId: "2",
    jobType: "repair",
    status: "scheduled",
    priority: "high",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    description: "Heat pump not switching modes",
    photos: [],
    invoiceSent: false,
    reviewSent: false,
    createdAt: new Date().toISOString(),
    customer: {
      id: "2", companyId: "c1", firstName: "James", lastName: "Whitfield",
      phone: "5129876543", address: "892 Riverside Dr, Austin TX 78704",
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "j3",
    companyId: "c1",
    customerId: "3",
    techId: "t2",
    jobType: "maintenance",
    status: "scheduled",
    priority: "normal",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    description: "Annual tune-up + filter change",
    photos: [],
    invoiceSent: false,
    reviewSent: false,
    createdAt: new Date().toISOString(),
    customer: {
      id: "3", companyId: "c1", firstName: "Maria", lastName: "Gonzalez",
      phone: "5121234567", address: "1420 Oak Street, Austin TX 78701",
      createdAt: new Date().toISOString(),
    },
    tech: {
      id: "t2", companyId: "c1", name: "Marcus Webb", phone: "5120002222",
      skills: ["electrical"], isActive: true, createdAt: new Date().toISOString(),
    },
  },
  {
    id: "j4",
    companyId: "c1",
    customerId: "4",
    techId: "t1",
    jobType: "install",
    status: "in_progress",
    priority: "normal",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    description: "New 5-ton Carrier install — new construction",
    photos: [],
    invoiceSent: false,
    reviewSent: false,
    createdAt: new Date().toISOString(),
    customer: {
      id: "4", companyId: "c1", firstName: "Robert", lastName: "Chen",
      phone: "5123456789", address: "4210 South Lamar, Austin TX 78704",
      createdAt: new Date().toISOString(),
    },
    tech: {
      id: "t1", companyId: "c1", name: "Jake Torres", phone: "5120001111",
      skills: ["refrigerant_certified", "electrical"], isActive: true, createdAt: new Date().toISOString(),
    },
  },
  {
    id: "j5",
    companyId: "c1",
    customerId: "5",
    techId: "t3",
    jobType: "repair",
    status: "completed",
    priority: "normal",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    description: "Thermostat replacement + recalibration",
    totalAmount: 320,
    photos: [],
    invoiceSent: true,
    reviewSent: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    customer: {
      id: "5", companyId: "c1", firstName: "Lisa", lastName: "Morales",
      phone: "5124567890", address: "7890 North Loop, Austin TX 78756",
      createdAt: new Date().toISOString(),
    },
    tech: {
      id: "t3", companyId: "c1", name: "Devon Hall", phone: "5120003333",
      skills: ["electrical"], isActive: true, createdAt: new Date().toISOString(),
    },
  },
];

const STATUS_GROUPS: { label: string; statuses: JobStatus[] }[] = [
  { label: "Active", statuses: ["emergency", "en_route", "in_progress"] as unknown as JobStatus[] },
  { label: "Scheduled", statuses: ["scheduled"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Cancelled", statuses: ["cancelled"] },
];

export default function JobsPage() {
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const router = useRouter();

  const filteredJobs = filter === "all"
    ? mockJobs
    : mockJobs.filter((j) => j.status === filter);

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
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Jobs</h1>
          <p className="text-zinc-500 text-sm">{mockJobs.length} total today</p>
        </div>
        <Link href="/jobs/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Job</span>
          </Button>
        </Link>
      </div>

      {/* Swipe hint for mobile */}
      <div className="md:hidden bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-xs text-blue-600 font-medium">
          ← Swipe left to call · Swipe right to mark en route →
        </span>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {[{ label: "All", value: "all" as const }, ...mockJobs.reduce((acc, j) => {
          if (!acc.find(a => a.value === j.status)) {
            acc.push({ label: j.status.replace("_", " "), value: j.status as JobStatus });
          }
          return acc;
        }, [] as { label: string; value: JobStatus }[])].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === value
                ? "bg-vortt-charcoal text-white"
                : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
            }`}
          >
            {value === "all" ? "All" : label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-zinc-100">
            <p className="text-zinc-400">No jobs found</p>
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
