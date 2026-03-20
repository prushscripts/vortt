"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { MapPin, Clock, User, ChevronRight } from "lucide-react";
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

  const leftAccent = (() => {
    if (job.status === "completed") {
      return {
        borderLeftColor: "#30D158",
        background: "linear-gradient(90deg, rgba(48,209,88,0.05) 0%, transparent 40%)",
      };
    }
    if (job.status === "in_progress" || job.status === "en_route") {
      return {
        borderLeftColor: "#FF6B2B",
        background: "linear-gradient(90deg, rgba(255,107,43,0.07) 0%, transparent 40%)",
      };
    }
    if (job.priority === "emergency") {
      return {
        borderLeftColor: "#FF453A",
        background: "linear-gradient(90deg, rgba(255,69,58,0.08) 0%, transparent 40%)",
      };
    }
    if (job.priority === "high") {
      return {
        borderLeftColor: "#FFD60A",
        background: "linear-gradient(90deg, rgba(255,214,10,0.06) 0%, transparent 40%)",
      };
    }
    return {
      borderLeftColor: "#2A2A2E",
      background: undefined,
    };
  })();

  const badgeBase: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 9999,
    fontWeight: 700,
    letterSpacing: "0.03em",
    fontSize: 12,
    lineHeight: 1,
    border: "1px solid transparent",
    userSelect: "none",
  };

  const priorityBadge = (() => {
    if (job.priority === "emergency") {
      return { label: "Emergency", style: { ...badgeBase, background: "rgba(255,69,58,0.2)", color: "#FF453A", border: "1px solid rgba(255,69,58,0.4)" } };
    }
    if (job.priority === "high") {
      return { label: "High", style: { ...badgeBase, background: "rgba(255,214,10,0.15)", color: "#FFD60A", border: "1px solid rgba(255,214,10,0.35)" } };
    }
    return null;
  })();

  const statusBadge = (() => {
    if (job.status === "completed") {
      return { label: "Completed", style: { ...badgeBase, background: "rgba(48,209,88,0.15)", color: "#30D158", border: "1px solid rgba(48,209,88,0.35)" } };
    }
    if (job.status === "in_progress" || job.status === "en_route") {
      return { label: "In Progress", style: { ...badgeBase, background: "rgba(255,107,43,0.18)", color: "#FF6B2B", border: "1px solid rgba(255,107,43,0.4)" } };
    }
    if (job.status === "scheduled") {
      return { label: "Scheduled", style: { ...badgeBase, background: "rgba(142,142,147,0.15)", color: "#8E8E93", border: "1px solid rgba(142,142,147,0.3)" } };
    }
    return { label: "Cancelled", style: { ...badgeBase, background: "rgba(142,142,147,0.15)", color: "#8E8E93", border: "1px solid rgba(142,142,147,0.3)" } };
  })();

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
    <div
      ref={dragConstraintsRef}
      className="relative overflow-hidden rounded-card shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-150 ease-[ease] hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <motion.div
        style={{
          x,
          backgroundColor: "#111116",
          ...(leftAccent.background ? { backgroundImage: leftAccent.background } : {}),
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: `3px solid ${leftAccent.borderLeftColor}`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        }}
        whileHover={{
          y: -3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,43,0.15)",
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.98 }}
        drag={(onSwipeLeft || onSwipeRight) ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={() => onClick?.(job)}
        className={cn(
          "rounded-card cursor-pointer hover:border-white/[0.12]",
          compact ? "p-3.5" : "p-4"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {priorityBadge && <span style={priorityBadge.style}>{priorityBadge.label}</span>}
              <span style={statusBadge.style}>{statusBadge.label}</span>
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
