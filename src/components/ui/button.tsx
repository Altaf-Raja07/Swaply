import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-button text-button rounded-lg transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary whisper-shadow hover:opacity-90",
        secondary:
          "border-2 border-secondary text-secondary hover:bg-secondary/5",
        ghost:
          "text-on-surface-variant hover:text-primary hover:bg-surface-container-high",
        link: "text-primary font-bold hover:underline",
        danger: "bg-error text-on-error hover:opacity-90",
        "secondary-container":
          "bg-secondary-container text-on-secondary-container hover:brightness-95",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-label-caps",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
