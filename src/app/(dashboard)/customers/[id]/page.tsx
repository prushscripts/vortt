"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Phone, Mail, MapPin, Wrench, Plus, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatPhone, formatDate, formatDateTime } from "@/lib/utils/format";
import type { Customer, Job } from "@/types";

// Mock data
const mockCustomer: Customer = {
  id: "1",
  companyId: "c1",
  firstName: "Maria",
  lastName: "Gonzalez",
  phone: "5121234567",
  email: "maria@example.com",
  address: "1420 Oak Street, Austin TX 78701",
  equipment: [
    { type: "Split AC", brand: "Carrier", model: "24ACC636A", serial: "SN123456", installedYear: 2019 },
  ],
  notes: "Gate code: 1234. Dog in backyard.",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
};

const mockJobs: Job[] = [
  {
    id: "j1",
    companyId: "c1",
    customerId: "1",
    techId: "t1",
    jobType: "repair",
    status: "completed",
    priority: "high",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 90).toISOString(),
    description: "AC not cooling — refrigerant leak found in evaporator coil",
    totalAmount: 680,
    photos: [],
    invoiceSent: true,
    reviewSent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "j2",
    companyId: "c1",
    customerId: "1",
    jobType: "maintenance",
    status: "scheduled",
    priority: "normal",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    description: "Annual maintenance + filter replacement",
    photos: [],
    invoiceSent: false,
    reviewSent: false,
    createdAt: new Date().toISOString(),
  },
];

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customer = mockCustomer;
  const jobs = mockJobs;

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <button className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-bold text-2xl text-vortt-charcoal truncate">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-zinc-500 text-sm">Customer since {formatDate(customer.createdAt)}</p>
        </div>
        <Link href={`/jobs/new?customerId=${id}`}>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </Link>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <a href={`tel:${customer.phone}`}>
            <Button variant="ghost" size="sm">Call</Button>
          </a>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
              <Phone className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-vortt-charcoal">{formatPhone(customer.phone)}</p>
              <p className="text-xs text-zinc-400">Primary</p>
            </div>
          </div>
          {customer.email && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-vortt-charcoal">{customer.email}</p>
                <p className="text-xs text-zinc-400">Email</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-vortt-charcoal">{customer.address}</p>
              <p className="text-xs text-zinc-400">Service address</p>
            </div>
          </div>
        </div>
        {customer.notes && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <p className="text-xs font-semibold text-amber-700 mb-1">Notes for Tech</p>
            <p className="text-sm text-amber-800">{customer.notes}</p>
          </div>
        )}
      </Card>

      {/* Equipment */}
      {customer.equipment && customer.equipment.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-vortt-orange" />
              <CardTitle>Equipment</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {customer.equipment.map((eq, i) => (
              <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="font-semibold text-sm text-vortt-charcoal">{eq.brand} {eq.type}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {eq.model}{eq.serial ? ` · SN: ${eq.serial}` : ""}{eq.installedYear ? ` · Installed ${eq.installedYear}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Job History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Job History</CardTitle>
          </div>
          <span className="text-xs text-zinc-400">{jobs.length} jobs</span>
        </CardHeader>
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <PriorityBadge priority={job.priority} />
                  </div>
                  {job.totalAmount && (
                    <span className="text-sm font-semibold text-vortt-charcoal">
                      ${job.totalAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-vortt-charcoal capitalize font-medium">{job.jobType}</p>
                {job.description && (
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{job.description}</p>
                )}
                {job.scheduledAt && (
                  <p className="text-xs text-zinc-400 mt-1">{formatDateTime(job.scheduledAt)}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
