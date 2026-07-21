"use client";

import { useToast } from "@/lib/toast";
import { Toast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast
            message={t.message}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
          />
        </div>
      ))}
    </div>
  );
}
