import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  className,
  showValue,
  reviewCount,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeMap = { sm: "text-[14px]", md: "text-[18px]", lg: "text-4xl" };

  return (
    <div className={cn("flex items-center gap-1 text-tertiary", className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <span
          key={i}
          className={cn(
            "material-symbols-outlined",
            sizeMap[size],
            interactive && "cursor-pointer hover:scale-110 transition-transform"
          )}
          style={{
            fontVariationSettings: `'FILL' ${i < Math.round(rating) ? 1 : 0}`,
          }}
          onClick={() => interactive && onRate?.(i + 1)}
        >
          star
        </span>
      ))}
      {showValue && (
        <span className="text-body-md font-bold ml-1">{rating}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-label-caps text-outline ml-1">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
