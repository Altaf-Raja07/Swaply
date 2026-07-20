import { cn } from "@/lib/utils";

interface SkillChipProps {
  label: string;
  variant?: "secondary" | "tertiary";
  className?: string;
  onRemove?: () => void;
}

export function SkillChip({
  label,
  variant = "secondary",
  className,
  onRemove,
}: SkillChipProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-label-caps font-bold inline-flex items-center gap-1",
        variant === "secondary"
          ? "bg-secondary/10 text-secondary"
          : "bg-tertiary/10 text-tertiary",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          className="material-symbols-outlined text-[16px] cursor-pointer"
          onClick={onRemove}
        >
          close
        </button>
      )}
    </span>
  );
}
