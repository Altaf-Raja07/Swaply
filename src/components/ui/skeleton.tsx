import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse bg-surface-container-high", {
  variants: {
    variant: {
      text: "h-4 rounded",
      heading: "h-8 rounded",
      avatar: "rounded-full",
      card: "rounded-xl",
      button: "h-12 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
}

export function Skeleton({
  className,
  variant,
  width,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={{ ...(width ? { width } : {}), ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}
