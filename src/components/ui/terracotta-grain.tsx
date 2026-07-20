import { cn } from "@/lib/utils";

interface TerracottaGrainProps {
  className?: string;
  children?: React.ReactNode;
}

export function TerracottaGrain({ className, children }: TerracottaGrainProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 terracotta-grain opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
