"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-all duration-150 active:scale-[0.97] focus-visible:outline-none select-none flex-shrink-0";

    const variants = {
      primary:   "bg-[#FF6B2B] text-white hover:bg-[#e55e22] shadow-[0_0_0_1px_rgba(255,107,43,0.4)]",
      secondary: "bg-[rgba(255,107,43,0.06)] text-[#F8F8FA] hover:bg-[rgba(255,107,43,0.12)] border border-white/[0.08]",
      ghost:     "bg-transparent text-[rgba(248,248,250,0.65)] hover:bg-[rgba(255,107,43,0.06)] hover:text-[#F8F8FA]",
      danger:    "bg-[rgba(244,63,94,0.15)] text-[#F43F5E] hover:bg-[rgba(244,63,94,0.25)] border border-[rgba(244,63,94,0.2)]",
      outline:   "bg-transparent text-[#F8F8FA] border border-white/[0.12] hover:border-[rgba(255,107,43,0.35)] hover:bg-[rgba(255,107,43,0.05)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs min-w-[44px]",
      md: "h-9 px-4 text-sm min-w-[44px]",
      lg: "h-11 px-5 text-sm min-w-[44px]",
    };

    return (
      <button
        ref={ref}
        data-variant={variant}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-40 cursor-not-allowed active:scale-100 pointer-events-none",
          className
        )}
        disabled={disabled || loading}
        onMouseEnter={(e) => {
          if ((variant === "secondary" || variant === "ghost" || variant === "outline") && !disabled && !loading) {
            e.currentTarget.style.borderColor = "rgba(255,107,43,0.4)";
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if ((variant === "secondary" || variant === "ghost" || variant === "outline") && !disabled && !loading) {
            e.currentTarget.style.borderColor = "var(--bg-border)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.transform = "translateY(0)";
          }
          onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if ((variant === "secondary" || variant === "ghost" || variant === "outline") && !disabled && !loading) {
            e.currentTarget.style.transform = "scale(0.98)";
          }
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          if ((variant === "secondary" || variant === "ghost" || variant === "outline") && !disabled && !loading) {
            e.currentTarget.style.transform = "translateY(-1px)";
          }
          onMouseUp?.(e);
        }}
        {...props}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
