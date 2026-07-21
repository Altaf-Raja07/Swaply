import { cn } from "@/lib/utils";

interface MatchConfidenceProps {
  confidence: number;
  showLabel?: boolean;
  className?: string;
}

function getColor(confidence: number): string {
  if (confidence >= 70) return "bg-secondary";
  if (confidence >= 40) return "bg-tertiary";
  return "bg-error";
}

function getLabel(confidence: number): string {
  if (confidence >= 90) return "Excellent match";
  if (confidence >= 70) return "Strong match";
  if (confidence >= 40) return "Good match";
  if (confidence >= 20) return "Fair match";
  return "Low match";
}

export function MatchConfidence({
  confidence,
  showLabel = false,
  className,
}: MatchConfidenceProps) {
  const clamped = Math.min(100, Math.max(0, confidence));

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${getLabel(clamped)}: ${clamped}%`}
    >
      <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-label-caps font-label-caps text-on-surface-variant shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
}
