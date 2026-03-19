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
  ({ variant = "primary", size = "md", loading = false, fullWidth = false, className, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-all duration-150 active:scale-[0.97] focus-visible:outline-none select-none flex-shrink-0";

    const variants = {
      primary:   "bg-[#FF6B2B] text-white hover:bg-[#e55e22] shadow-[0_0_0_1px_rgba(255,107,43,0.4)]",
      secondary: "bg-white/[0.08] text-[#F8F8FA] hover:bg-white/[0.12] border border-white/[0.08]",
      ghost:     "bg-transparent text-[rgba(248,248,250,0.65)] hover:bg-white/[0.06] hover:text-[#F8F8FA]",
      danger:    "bg-[rgba(244,63,94,0.15)] text-[#F43F5E] hover:bg-[rgba(244,63,94,0.25)] border border-[rgba(244,63,94,0.2)]",
      outline:   "bg-transparent text-[#F8F8FA] border border-white/[0.12] hover:border-white/[0.2] hover:bg-white/[0.04]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs min-w-[44px]",
      md: "h-9 px-4 text-sm min-w-[44px]",
      lg: "h-11 px-5 text-sm min-w-[44px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-40 cursor-not-allowed active:scale-100 pointer-events-none",
          className
        )}
        disabled={disabled || loading}
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
