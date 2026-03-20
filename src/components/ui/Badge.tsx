import { cn } from "@/lib/utils/cn";
import type { JobPriority, JobStatus, ContractStatus } from "@/types";

type BadgeVariant = "emergency" | "high" | "normal" | "completed" | "cancelled" | "scheduled" | "en_route" | "in_progress" | "active" | "expiring" | "expired" | "renewed";

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  emergency:   "bg-[rgba(244,63,94,0.15)]   text-[#F43F5E]  border-[rgba(244,63,94,0.25)]",
  high:        "bg-[rgba(255,107,43,0.15)]  text-[#FF6B2B]  border-[rgba(255,107,43,0.25)]",
  normal:      "bg-[rgba(142,142,147,0.15)] text-[rgba(248,248,250,0.5)] border-[rgba(142,142,147,0.25)]",
  completed:   "bg-[rgba(34,197,94,0.12)]   text-[#22C55E]  border-[rgba(34,197,94,0.2)]",
  cancelled:   "bg-[rgba(142,142,147,0.12)] text-[rgba(248,248,250,0.3)] border-[rgba(142,142,147,0.2)]",
  scheduled:   "bg-[rgba(59,130,246,0.12)]  text-[#3B82F6]  border-[rgba(59,130,246,0.2)]",
  en_route:    "bg-[rgba(255,107,43,0.12)]  text-[#FF6B2B]  border-[rgba(255,107,43,0.2)]",
  in_progress: "bg-[rgba(245,158,11,0.12)]  text-[#F59E0B]  border-[rgba(245,158,11,0.2)]",
  active:      "bg-[rgba(34,197,94,0.12)]   text-[#22C55E]  border-[rgba(34,197,94,0.2)]",
  expiring:    "bg-[rgba(245,158,11,0.12)]  text-[#F59E0B]  border-[rgba(245,158,11,0.2)]",
  expired:     "bg-[rgba(244,63,94,0.12)]   text-[#F43F5E]  border-[rgba(244,63,94,0.2)]",
  renewed:     "bg-[rgba(59,130,246,0.12)]  text-[#3B82F6]  border-[rgba(59,130,246,0.2)]",
};

const variantLabels: Record<BadgeVariant, string> = {
  emergency:   "Emergency",
  high:        "High",
  normal:      "Normal",
  completed:   "Completed",
  cancelled:   "Cancelled",
  scheduled:   "Scheduled",
  en_route:    "En Route",
  in_progress: "In Progress",
  active:      "Active",
  expiring:    "Expiring",
  expired:     "Expired",
  renewed:     "Renewed",
};

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-mono-label font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: JobPriority }) {
  return <Badge variant={priority} />;
}

export function StatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={status} />;
}

export function ContractBadge({ status }: { status: ContractStatus }) {
  return <Badge variant={status} />;
}
