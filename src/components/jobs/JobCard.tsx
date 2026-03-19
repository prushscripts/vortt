"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MapPin, Clock, Phone, ChevronRight, User } from "lucide-react";
import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { formatDateTime, formatRelative } from "@/lib/utils/format";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onSwipeRight?: (job: Job) => void;
  onSwipeLeft?: (job: Job) => void;
  onClick?: (job: Job) => void;
  compact?: boolean;
}

export function JobCard({ job, onSwipeRight, onSwipeLeft, onClick, compact = false }: JobCardProps) {
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgb(255,59,48)", "rgb(255,255,255)", "rgb(52,199,89)"]
  );
  const dragConstraintsRef = useRef(null);

  const customerName = job.customer
    ? `${job.customer.firstName} ${job.customer.lastName}`
    : "Unknown Customer";

  const handleDragEnd = async (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 80 && onSwipeRight) {
      setSwiping("right");
      await animate(x, 300, { duration: 0.2 });
      onSwipeRight(job);
      animate(x, 0, { duration: 0.3 });
      setSwiping(null);
    } else if (info.offset.x < -80 && onSwipeLeft) {
      setSwiping("left");
      await animate(x, -300, { duration: 0.2 });
      onSwipeLeft(job);
      animate(x, 0, { duration: 0.3 });
      setSwiping(null);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div ref={dragConstraintsRef} className="relative overflow-hidden rounded-2xl">
      {/* Swipe hints */}
      <div className="absolute inset-0 flex items-center justify-between px-6 rounded-2xl pointer-events-none">
        <div className="flex items-center gap-2 text-white font-semibold text-sm opacity-0 transition-opacity" style={{ opacity: swiping === "right" ? 1 : 0 }}>
          <MapPin className="w-4 h-4" /> En Route
        </div>
        <div className="flex items-center gap-2 text-white font-semibold text-sm opacity-0 transition-opacity" style={{ opacity: swiping === "left" ? 1 : 0 }}>
          <Phone className="w-4 h-4" /> Call
        </div>
      </div>

      <motion.div
        style={{ x, background }}
        drag={(onSwipeLeft || onSwipeRight) ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={() => onClick?.(job)}
        className={cn(
          "bg-white rounded-2xl border border-zinc-100 shadow-sm cursor-pointer",
          "active:shadow-md transition-shadow",
          compact ? "p-3" : "p-4"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {job.priority === "emergency" && (
                <PriorityBadge priority="emergency" />
              )}
              {job.priority === "high" && <PriorityBadge priority="high" />}
              <StatusBadge status={job.status} />
              <span className="text-xs text-zinc-400 capitalize">{job.jobType}</span>
            </div>

            <h3 className="font-heading font-semibold text-vortt-charcoal text-base leading-tight truncate">
              {customerName}
            </h3>

            {job.customer?.address && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <p className="text-sm text-zinc-500 truncate">{job.customer.address}</p>
              </div>
            )}

            {job.description && !compact && (
              <p className="text-sm text-zinc-500 mt-1.5 line-clamp-2">{job.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {job.scheduledAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-500">{formatDateTime(job.scheduledAt)}</span>
                </div>
              )}
              {job.tech ? (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-vortt-orange" />
                  <span className="text-xs text-vortt-orange font-medium">{job.tech.name}</span>
                </div>
              ) : (
                <span className="text-xs text-vortt-red font-medium">Unassigned</span>
              )}
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-zinc-300 flex-shrink-0 mt-1" />
        </div>
      </motion.div>
    </div>
  );
}
