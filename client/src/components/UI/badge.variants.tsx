"use client";

import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";

// Status Badge
export const StatusBadge = ({ className, ...props }: BadgeProps) => {
  return <Badge className={cn("font-medium", className)} {...props} />;
};

// Featured Badge
export const FeaturedBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, children, ...props }, _ref) => {
    return (
      <Badge
        variant="warning"
        className={cn("w-fit font-semibold", className)}
        {...props}
      >
        {children}
      </Badge>
    );
  },
);
FeaturedBadge.displayName = "FeaturedBadge";

// Discount Badge
export const DiscountBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, _ref) => {
    return (
      <Badge
        variant="default"
        className={cn("w-fit font-bold", className)}
        {...props}
      />
    );
  },
);
DiscountBadge.displayName = "DiscountBadge";

// Stock Badge
export const StockBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & { stock: number }
>(({ className, stock, ...props }, _ref) => {
  const variant =
    stock === 0 ? "destructive" : stock <= 5 ? "outline" : "default";
  const text =
    stock === 0
      ? "Out of stock"
      : stock <= 5
        ? `Only ${stock} left`
        : "In stock";

  return (
    <Badge
      variant={variant}
      className={cn(
        "w-fit",
        stock <= 5 && stock > 0 && designTokens.colors.status.warning,
        className,
      )}
      {...props}
    >
      {text}
    </Badge>
  );
});
StockBadge.displayName = "StockBadge";

// Sealed Badge
export const SealedBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, children, ...props }, _ref) => {
    return (
      <Badge
        variant="info"
        className={cn("w-fit font-semibold", className)}
        {...props}
      >
        {children || "Sealed"}
      </Badge>
    );
  },
);
SealedBadge.displayName = "SealedBadge";

// Grading Badge
export const GradingBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & { company: string; grade: string }
>(({ className, company, grade, children, ...props }, _ref) => {
  const gradingColors: Record<string, string> = {
    PSA: "text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10",
    CGC: "text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/10",
    BGS: "text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/10",
    SGC: "text-orange-600 dark:text-orange-400 border-orange-500/20 bg-orange-500/10",
  };

  const color =
    gradingColors[company.toUpperCase()] ||
    "text-gray-600 dark:text-gray-400 border-gray-500/20 bg-gray-500/10";

  return (
    <Badge
      variant="outline"
      className={cn("w-fit font-semibold", color, className)}
      {...props}
    >
      {children || `${company} ${grade}`}
    </Badge>
  );
});
GradingBadge.displayName = "GradingBadge";

// Category Badge
export const CategoryBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, _ref) => {
    return (
      <Badge
        variant="outline"
        className={cn("text-xs border-primary text-primary", className)}
        {...props}
      />
    );
  },
);
CategoryBadge.displayName = "CategoryBadge";

// New Badge
export const NewBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, _ref) => {
    return (
      <Badge variant="success" className={cn("w-fit", className)} {...props}>
        NEW
      </Badge>
    );
  },
);
NewBadge.displayName = "NewBadge";

// Condition Badge
export const ConditionBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & { condition: string }
>(({ className, condition, ...props }, _ref) => {
  const conditionColors: Record<string, string> = {
    mint: designTokens.colors.condition.mint,
    "near-mint": designTokens.colors.condition.nearMint,
    excellent: designTokens.colors.condition.excellent,
    good: designTokens.colors.condition.good,
    fair: designTokens.colors.condition.fair,
    poor: designTokens.colors.condition.poor,
  };

  const color =
    conditionColors[condition] || designTokens.colors.condition.poor;

  return (
    <Badge variant="outline" className={cn("gap-1", className)} {...props}>
      <div className={cn("w-2 h-2 rounded-full", color)} />
      {condition
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </Badge>
  );
});
ConditionBadge.displayName = "ConditionBadge";

// Rarity Badge
export const RarityBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & { rarity: string }
>(({ className, rarity, children, ...props }, _ref) => {
  const rarityColors: Record<string, string> = {
    common: designTokens.colors.status.info,
    uncommon: designTokens.colors.status.success,
    rare: designTokens.colors.status.info,
    epic: "text-purple-600 dark:text-purple-400",
    legendary: designTokens.colors.status.warning,
    mythic: designTokens.colors.status.error,
  };

  const color = rarityColors[rarity] || designTokens.colors.status.info;

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1", color, className)}
      {...props}
    >
      <svg
        className="w-3 h-3"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Rarity star</title>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {children || rarity.charAt(0).toUpperCase() + rarity.slice(1)}
    </Badge>
  );
});
RarityBadge.displayName = "RarityBadge";

// Sale Badge
export const SaleBadge = React.forwardRef<
  HTMLDivElement,
  BadgeProps & { percentage?: number }
>(({ className, percentage, children, ...props }, _ref) => {
  return (
    <Badge
      variant="destructive"
      className={cn("w-fit font-bold", className)}
      {...props}
    >
      {percentage ? `-${percentage}%` : children || "SALE"}
    </Badge>
  );
});
SaleBadge.displayName = "SaleBadge";
