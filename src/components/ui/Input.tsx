"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[rgba(248,248,250,0.5)] font-mono-label uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 px-3.5 rounded-[10px] border text-sm transition-all",
            "text-[#F8F8FA] placeholder:text-[rgba(248,248,250,0.25)]",
            "focus:outline-none focus:border-[rgba(255,107,43,0.5)] focus:ring-1 focus:ring-[rgba(255,107,43,0.3)]",
            error
              ? "border-[rgba(244,63,94,0.4)] focus:border-[#F43F5E]"
              : "border-white/[0.08] hover:border-white/[0.14]",
            className
          )}
          style={{ background: "rgba(255,255,255,0.04)" }}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[rgba(248,248,250,0.38)]">{hint}</p>}
        {error && <p className="text-xs text-[#F43F5E] font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[rgba(248,248,250,0.5)] font-mono-label uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "px-3.5 py-2.5 rounded-[10px] border text-sm transition-all resize-none",
            "text-[#F8F8FA] placeholder:text-[rgba(248,248,250,0.25)]",
            "focus:outline-none focus:border-[rgba(255,107,43,0.5)] focus:ring-1 focus:ring-[rgba(255,107,43,0.3)]",
            error ? "border-[rgba(244,63,94,0.4)]" : "border-white/[0.08] hover:border-white/[0.14]",
            className
          )}
          style={{ background: "rgba(255,255,255,0.04)" }}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[rgba(248,248,250,0.38)]">{hint}</p>}
        {error && <p className="text-xs text-[#F43F5E] font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[rgba(248,248,250,0.5)] font-mono-label uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 px-3.5 rounded-[10px] border text-sm transition-all appearance-none",
            "text-[#F8F8FA] focus:outline-none focus:border-[rgba(255,107,43,0.5)] focus:ring-1 focus:ring-[rgba(255,107,43,0.3)]",
            error ? "border-[rgba(244,63,94,0.4)]" : "border-white/[0.08] hover:border-white/[0.14]",
            className
          )}
          style={{ background: "#111116" }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#111116" }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#F43F5E] font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
