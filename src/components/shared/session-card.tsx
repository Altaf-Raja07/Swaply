import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SessionRole = "teaching" | "learning";

interface SessionCardProps {
  role: SessionRole;
  title: string;
  subtitle: string;
  with: string;
  dateTime: string;
  imageSrc?: string;
  actionLabel: string;
  actionVariant?: "primary" | "secondary";
}

export function SessionCard({
  role,
  title,
  subtitle,
  with: mentor,
  dateTime,
  imageSrc,
  actionLabel,
  actionVariant = "primary",
}: SessionCardProps) {
  const borderColor =
    role === "teaching" ? "border-l-primary" : "border-l-secondary";
  const badgeBg =
    role === "teaching" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary";

  return (
    <div
      className={cn(
        "group bg-surface-container-lowest border-l-4 border-t border-r border-b border-outline-variant/20 rounded-lg p-stack-md flex flex-col md:flex-row items-center gap-stack-md whisper-shadow hover:bg-surface-container-low transition-all duration-200 cursor-pointer",
        borderColor
      )}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-surface-container overflow-hidden">
        <img src={imageSrc || "/images/illustrations/illustration-13.png"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
              badgeBg
            )}
          >
            {role === "teaching" ? "Teaching" : "Learning"}
          </span>
          <span className="text-on-surface-variant text-label-caps font-label-caps">
            {subtitle}
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
          {title}
        </h3>
        <p className="text-on-surface-variant font-body-md">
          with {mentor} &bull; {dateTime}
        </p>
      </div>
      <div className="flex-shrink-0 flex gap-2">
        {actionVariant === "primary" ? (
          <Button variant="primary" size="sm">
            {actionLabel}
          </Button>
        ) : (
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        )}
        <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}
