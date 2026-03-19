import { cn } from "@/lib/utils/cn";
import type { JobPriority, JobStatus, ContractStatus } from "@/types";

type BadgeVariant = "emergency" | "high" | "normal" | "completed" | "cancelled" | "scheduled" | "en_route" | "in_progress" | "active" | "expiring" | "expired" | "renewed";

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  emergency: "bg-red-100 text-vortt-red border-red-200",
  high: "bg-orange-100 text-vortt-orange border-orange-200",
  normal: "bg-zinc-100 text-zinc-600 border-zinc-200",
  completed: "bg-green-100 text-vortt-green border-green-200",
  cancelled: "bg-zinc-100 text-zinc-400 border-zinc-200",
  scheduled: "bg-blue-100 text-blue-600 border-blue-200",
  en_route: "bg-orange-100 text-vortt-orange border-orange-200",
  in_progress: "bg-yellow-100 text-yellow-700 border-yellow-200",
  active: "bg-green-100 text-vortt-green border-green-200",
  expiring: "bg-amber-100 text-vortt-amber border-amber-200",
  expired: "bg-red-100 text-vortt-red border-red-200",
  renewed: "bg-blue-100 text-blue-600 border-blue-200",
};

const variantLabels: Record<BadgeVariant, string> = {
  emergency: "Emergency",
  high: "High",
  normal: "Normal",
  completed: "Completed",
  cancelled: "Cancelled",
  scheduled: "Scheduled",
  en_route: "En Route",
  in_progress: "In Progress",
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
  renewed: "Renewed",
};

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
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
