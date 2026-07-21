import { StarRating } from "./star-rating";
import { SkillChip } from "./skill-chip";
import { Button } from "@/components/ui/button";

interface TeacherCardProps {
  name: string;
  imageUrl?: string;
  avatarSrc?: string;
  rating: number;
  reviewCount: number;
  credits: number;
  skills: string[];
  matchNote: string;
}

function renderBoldMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-on-surface">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function TeacherCard({
  name,
  imageUrl,
  avatarSrc,
  rating,
  reviewCount,
  credits,
  skills,
  matchNote,
}: TeacherCardProps) {
  return (
    <article className="bg-white border border-outline-variant/30 rounded-xl p-stack-md whisper-shadow flex flex-col hover:border-primary/30 transition-colors duration-300 group relative">
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="!w-9 !h-9 !rounded-full bg-white/80 hover:bg-white border border-outline-variant/30"
          aria-label="Add to favorites"
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </Button>
      </div>
      <div className="mb-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high shrink-0">
            <img src={avatarSrc || "/images/avatars/avatar-2.png"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors truncate">
                {name}
              </h3>
              <div className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0">
                {credits} CR
              </div>
            </div>
            <StarRating
              rating={rating}
              size="sm"
              showValue
              reviewCount={reviewCount}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <SkillChip key={skill} label={skill} />
        ))}
      </div>
      <div className="bg-surface-container-low rounded-xl p-4 mb-6 border-l-4 border-primary/20 overflow-hidden">
        <p className="text-body-md italic text-on-surface-variant line-clamp-3">
          {renderBoldMarkdown(matchNote)}
        </p>
      </div>
      <div className="mt-auto">
        <Button variant="primary" className="w-full">
          Book Session
        </Button>
      </div>
    </article>
  );
}
