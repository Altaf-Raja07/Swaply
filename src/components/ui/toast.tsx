"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ToastVariant } from "@/lib/toast";

const iconMap: Record<ToastVariant, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

const toastVariants = cva(
  "flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-slide-up transition-all",
  {
    variants: {
      variant: {
        success:
          "bg-primary-container text-on-primary border-primary/20",
        error:
          "bg-error-container text-on-error-container border-error/20",
        warning:
          "bg-tertiary-container text-on-tertiary-container border-tertiary/20",
        info:
          "bg-surface-container-high text-on-surface border-outline-variant/50",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
  className?: string;
}

export function Toast({ message, variant, onClose, className }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(toastVariants({ variant }), className)}
    >
      <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
        {iconMap[variant]}
      </span>
      <p className="text-body-md flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 -mr-1 p-1 rounded-full hover:bg-black/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
