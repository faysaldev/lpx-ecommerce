import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const cardHeaderVariants = cva("flex flex-col", {
  variants: {
    size: {
      sm: "space-y-1 p-3",
      md: "space-y-1.5 p-6",
      lg: "space-y-2 p-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const cardContentVariants = cva("", {
  variants: {
    size: {
      sm: "p-3 pt-0",
      md: "p-6 pt-0",
      lg: "p-8 pt-0",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const cardFooterVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "p-3 pt-0",
      md: "p-6 pt-0",
      lg: "p-8 pt-0",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type CardSize = "sm" | "md" | "lg";

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ size, className }))}
      {...props}
    />
  ),
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("typography-heading-sm", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("typography-body-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
