import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
        success:
          "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20",
        warning:
          "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "px-2 py-0.5 typography-caption-sm",
        default: "px-2.5 py-0.5 typography-caption-md",
        lg: "px-3 py-1 typography-label-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
