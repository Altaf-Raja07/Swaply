import { StarRating } from "./star-rating";

interface ReviewCardProps {
  authorName: string;
  rating: number;
  text: string;
  imageUrl?: string;
}

export function ReviewCard({
  authorName,
  rating,
  text,
  imageUrl,
}: ReviewCardProps) {
  return (
    <div className="bg-surface-container-low p-stack-md rounded-xl editorial-border whisper-shadow">
      <div className="flex items-center gap-stack-sm mb-stack-sm">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container-high">
          {imageUrl ? (
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt={authorName}
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high" />
          )}
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
