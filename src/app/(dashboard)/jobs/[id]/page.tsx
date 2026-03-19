"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Clock, User, CheckCircle, Navigation, AlertTriangle, Camera, DollarSign, Send } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatDateTime, formatPhone, formatMinutes } from "@/lib/utils/format";
import type { Job } from "@/types";

const mockJob: Job = {
  id: "j1",
  companyId: "c1",
  customerId: "1",
  techId: "t1",
  jobType: "repair",
  status: "en_route",
  priority: "high",
  scheduledAt: new Date().toISOString(),
  description: "AC not cooling — customer reports warm air. Unit is a 2019 Carrier split-system.",
  techNotes: "Found refrigerant level low, checking for leaks",
  photos: [],
  laborMinutes: 90,
  totalAmount: 680,
  invoiceSent: false,
  reviewSent: false,
  createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  customer: {
    id: "1", companyId: "c1", firstName: "Maria", lastName: "Gonzalez",
    phone: "5121234567", email: "maria@example.com",
    address: "1420 Oak Street, Austin TX 78701",
    equipment: [{ type: "Split AC", brand: "Carrier", model: "24ACC636A", serial: "SN123456", installedYear: 2019 }],
    notes: "Gate code: 1234. Dog in backyard.",
    createdAt: new Date().toISOString(),
  },
  tech: {
    id: "t1", companyId: "c1", name: "Jake Torres", phone: "5120001111",
    skills: ["refrigerant_certified", "electrical"], isActive: true,
    lat: 30.2729, lng: -97.7444,
    createdAt: new Date().toISOString(),
  },
};

const STATUS_FLOW = ["scheduled", "en_route", "in_progress", "completed"] as const;

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState(mockJob);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const currentIdx = STATUS_FLOW.indexOf(job.status as typeof STATUS_FLOW[number]);
  const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

  const statusActionLabel: Record<string, string> = {
    en_route: "Mark En Route",
    in_progress: "Start Job",
    completed: "Complete Job",
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setJob(prev => ({ ...prev, status: newStatus as Job["status"] }));
    setUpdatingStatus(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/jobs">
          <button className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50">
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
            <span className="text-xs text-zinc-400 capitalize">{job.jobType}</span>
          </div>
          <h1 className="font-heading font-bold text-xl text-vortt-charcoal mt-0.5">
            {job.customer?.firstName} {job.customer?.lastName}
          </h1>
        </div>
      </div>

      {/* Status action */}
      {nextStatus && (
        <Button
          fullWidth
          size="lg"
          loading={updatingStatus}
          onClick={() => handleStatusUpdate(nextStatus)}
          className="text-base"
        >
          {nextStatus === "en_route" && <Navigation className="w-5 h-5" />}
          {nextStatus === "in_progress" && <CheckCircle className="w-5 h-5" />}
          {nextStatus === "completed" && <CheckCircle className="w-5 h-5" />}
          {statusActionLabel[nextStatus]}
        </Button>
      )}

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Customer</CardTitle>
          </div>
          <a href={`tel:${job.customer?.phone}`}>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
              Call
            </Button>
          </a>
        </CardHeader>
        <div className="space-y-2">
          <p className="font-semibold text-vortt-charcoal">{job.customer?.firstName} {job.customer?.lastName}</p>
          {job.customer?.phone && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Phone className="w-4 h-4" />
              {formatPhone(job.customer.phone)}
            </div>
          )}
          {job.customer?.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(job.customer.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-vortt-orange hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {job.customer.address}
            </a>
          )}
          {job.customer?.notes && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-amber-700 mb-1">Site Notes</p>
              <p className="text-sm text-amber-800">{job.customer.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Equipment */}
      {job.customer?.equipment && job.customer.equipment.length > 0 && (
        <Card>
          <CardTitle className="mb-3">Equipment</CardTitle>
          {job.customer.equipment.map((eq, i) => (
            <div key={i} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <p className="font-semibold text-sm text-vortt-charcoal">{eq.brand} {eq.type}</p>
              <p className="text-xs text-zinc-500">{eq.model} · {eq.installedYear ? `Installed ${eq.installedYear}` : ""}</p>
              {eq.serial && <p className="text-xs text-zinc-400">SN: {eq.serial}</p>}
            </div>
          ))}
        </Card>
      )}

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {job.scheduledAt && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-600">{formatDateTime(job.scheduledAt)}</span>
            </div>
          )}
          {job.tech && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-600">{job.tech.name}</span>
            </div>
          )}
          {job.description && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">Description</p>
              <p className="text-sm text-vortt-charcoal">{job.description}</p>
            </div>
          )}
          {job.techNotes && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-1">Tech Notes</p>
              <p className="text-sm text-vortt-charcoal">{job.techNotes}</p>
            </div>
          )}
          {job.laborMinutes && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-600">Labor: {formatMinutes(job.laborMinutes)}</span>
            </div>
          )}
          {job.totalAmount && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-vortt-green" />
              <span className="font-heading font-bold text-lg text-vortt-charcoal">
                ${job.totalAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      {job.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Job</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Button fullWidth variant="secondary">
              <Camera className="w-4 h-4" />
              Add Photos
            </Button>
            {!job.invoiceSent && (
              <Button fullWidth>
                <Send className="w-4 h-4" />
                Send Invoice
              </Button>
            )}
            {job.invoiceSent && !job.reviewSent && (
              <Button fullWidth variant="ghost">
                Request Google Review
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
