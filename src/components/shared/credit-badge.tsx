import { cn } from "@/lib/utils";

interface CreditBadgeProps {
  credits: number;
  className?: string;
  showIcon?: boolean;
}

export function CreditBadge({
  credits,
  className,
  showIcon = true,
}: CreditBadgeProps) {
  return (
    <div
      className={cn(
        "bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-label-caps font-label-caps coin-bevel flex items-center gap-1",
        className
      )}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-[16px]">toll</span>
      )}
      {credits} Credits
    </div>
  );
}
