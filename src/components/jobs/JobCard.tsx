"use client";

import { useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { MapPin, Clock, User, ChevronRight } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/format";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onSwipeRight?: (job: Job) => void;
  onSwipeLeft?: (job: Job) => void;
  onClick?: (job: Job) => void;
  compact?: boolean;
}

export function JobCard({ job, onSwipeRight, onSwipeLeft, onClick, compact = false }: JobCardProps) {
  const x = useMotionValue(0);
  const dragConstraintsRef = useRef(null);

  const customerName = job.customer
    ? `${job.customer.firstName} ${job.customer.lastName}`
    : "Unknown Customer";

  const handleDragEnd = async (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 80 && onSwipeRight) {
      await animate(x, 300, { duration: 0.2 });
      onSwipeRight(job);
      animate(x, 0, { duration: 0.3 });
    } else if (info.offset.x < -80 && onSwipeLeft) {
      await animate(x, -300, { duration: 0.2 });
      onSwipeLeft(job);
      animate(x, 0, { duration: 0.3 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div ref={dragConstraintsRef} className="relative overflow-hidden rounded-card">
      <motion.div
        style={{ x }}
        drag={(onSwipeLeft || onSwipeRight) ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={() => onClick?.(job)}
        className={cn(
          "rounded-card cursor-pointer transition-all hover:border-white/[0.12]",
          compact ? "p-3.5" : "p-4"
        )}
        style={{ background: "#111116", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {job.priority !== "normal" && <PriorityBadge priority={job.priority} />}
              <StatusBadge status={job.status} />
              <span className="text-[11px] text-[rgba(248,248,250,0.3)] font-mono-label uppercase">{job.jobType}</span>
            </div>

            <h3 className="font-heading font-semibold text-[#F8F8FA] text-sm leading-tight truncate">
              {customerName}
            </h3>

            {job.customer?.address && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-[rgba(248,248,250,0.28)] flex-shrink-0" />
                <p className="text-xs text-[rgba(248,248,250,0.45)] truncate">{job.customer.address}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {job.scheduledAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[rgba(248,248,250,0.28)]" />
                  <span className="text-xs text-[rgba(248,248,250,0.45)]">{formatDateTime(job.scheduledAt)}</span>
                </div>
              )}
              {job.tech ? (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#FF6B2B]" />
                  <span className="text-xs text-[#FF6B2B] font-medium">{job.tech.name}</span>
                </div>
              ) : (
                <span className="text-xs text-[#F43F5E] font-medium">Unassigned</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[rgba(248,248,250,0.2)] flex-shrink-0 mt-0.5" />
        </div>
      </motion.div>
    </div>
  );
}
