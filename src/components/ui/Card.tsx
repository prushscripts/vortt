import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  glow?: boolean;
}

export function Card({ hover = false, padding = "md", glow = false, className, children, ...props }: CardProps) {
  const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

  return (
    <div
      className={cn(
        "rounded-card transition-all duration-200",
        paddings[padding],
        hover && "cursor-pointer hover:border-white/[0.12] hover:-translate-y-px active:scale-[0.995]",
        glow && "shadow-[0_0_24px_rgba(255,107,43,0.12)]",
        className
      )}
      style={{
        background: "#111116",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-heading font-semibold text-sm text-[#F8F8FA]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn("w-full h-px my-4", className)}
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}
