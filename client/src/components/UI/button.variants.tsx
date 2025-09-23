"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Primary CTA Button - Enhanced with design system
export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        className={cn("font-semibold hover-lift", className)}
        {...props}
      />
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";

// Secondary Button - Enhanced with design system
export const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        className={cn("hover-lift", className)}
        {...props}
      />
    );
  },
);
SecondaryButton.displayName = "SecondaryButton";

// Icon Button with Tooltip support - Enhanced with design system
export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("rounded-full aspect-square hover-grow", className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

// Cart Button
export const CartButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        size="icon"
        className={cn(
          "bg-primary hover:bg-primary/90 rounded-lg h-8 w-8",
          className,
        )}
        {...props}
      />
    );
  },
);
CartButton.displayName = "CartButton";

// CTA Link Button
export const CTALinkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="link"
        className={cn(
          "text-primary hover:text-primary/80 font-semibold p-0 h-auto",
          className,
        )}
        {...props}
      />
    );
  },
);
CTALinkButton.displayName = "CTALinkButton";

// Outline Button - Enhanced with design system
export const OutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn("hover-lift", className)}
        {...props}
      />
    );
  },
);
OutlineButton.displayName = "OutlineButton";
