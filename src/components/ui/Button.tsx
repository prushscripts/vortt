"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none";

    const variants = {
      primary:
        "bg-vortt-orange text-white hover:bg-orange-600 focus:ring-vortt-orange shadow-sm",
      secondary:
        "bg-vortt-slate text-white hover:bg-zinc-700 focus:ring-vortt-slate shadow-sm",
      ghost:
        "bg-transparent text-vortt-charcoal hover:bg-zinc-100 focus:ring-zinc-300",
      danger:
        "bg-vortt-red text-white hover:bg-red-600 focus:ring-vortt-red shadow-sm",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm min-w-[44px]",
      md: "h-11 px-5 text-sm min-w-[44px]",
      lg: "h-14 px-6 text-base min-w-[44px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          (disabled || loading) && "opacity-50 cursor-not-allowed active:scale-100",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
