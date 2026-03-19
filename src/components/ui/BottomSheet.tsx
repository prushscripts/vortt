"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-2xl",
              "max-h-[90vh] overflow-y-auto",
              className
            )}
            style={{ background: "#111116", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-8 h-1 rounded-full absolute left-1/2 -translate-x-1/2 top-3" style={{ background: "rgba(255,255,255,0.15)" }} />
              {title && (
                <h2 className="font-heading font-semibold text-base text-[#F8F8FA]">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4 text-[rgba(248,248,250,0.5)]" />
              </button>
            </div>
            <div className="p-5 pb-safe">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
