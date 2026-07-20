import { StarRating } from "./star-rating";

interface ReviewCardProps {
  authorName: string;
  rating: number;
  text: string;
  avatarSrc?: string;
}

export function ReviewCard({
  authorName,
  rating,
  text,
  avatarSrc,
}: ReviewCardProps) {
  return (
    <div className="bg-surface-container-low p-stack-md rounded-xl editorial-border whisper-shadow">
      <div className="flex items-center gap-stack-sm mb-stack-sm">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container-high">
          <img src={avatarSrc || "/images/avatars/avatar-4.png"} alt={authorName} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-on-surface">{authorName}</p>
          <StarRating rating={rating} size="sm" />
        </div>
      </div>
      <p className="text-body-md text-on-surface-variant italic">{text}</p>
    </div>
  );
}
