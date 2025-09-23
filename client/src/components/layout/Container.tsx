"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
  noPadding?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = "lg",
      as: Component = "div",
      noPadding = false,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-full",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full",
          sizeClasses[size],
          !noPadding && "px-4 sm:px-6 lg:px-8",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Container.displayName = "Container";

// Section Container with consistent spacing
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "primary" | "dark";
  containerSize?: ContainerSize;
  paddingSize?: "sm" | "md" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      size = "md",
      background = "default",
      containerSize = "lg",
      paddingSize = "md",
      children,
      ...props
    },
    ref,
  ) => {
    const sectionSizeClasses = {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-20",
    };

    const paddingSizeClasses = {
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
      xl: "px-10",
    };

    const backgroundClasses = {
      default: "",
      muted: "bg-gray-50 dark:bg-gray-800",
      primary: "bg-primary text-primary-foreground",
      dark: "bg-gray-900 text-white dark:bg-gray-950",
    };

    return (
      <section
        ref={ref}
        className={cn(
          sectionSizeClasses[size as keyof typeof sectionSizeClasses] ||
            sectionSizeClasses.md,
          paddingSizeClasses[paddingSize as keyof typeof paddingSizeClasses] ||
            paddingSizeClasses.md,
          backgroundClasses[background],
          className,
        )}
        {...props}
      >
        <Container size={containerSize} noPadding>
          {children}
        </Container>
      </section>
    );
  },
);
Section.displayName = "Section";

// Grid Layout Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = "md", children, ...props }, ref) => {
    const colsClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const gapClasses = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn("grid", colsClasses[cols], gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

// Flex Layout Component
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: boolean;
  gap?: "sm" | "md" | "lg" | "xl";
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction = "row",
      justify = "start",
      align = "stretch",
      wrap = false,
      gap = "md",
      children,
      ...props
    },
    ref,
  ) => {
    const directionClasses = {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    };

    const justifyClasses = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const alignClasses = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    const gapClasses = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          wrap && "flex-wrap",
          gapClasses[gap],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Flex.displayName = "Flex";

// Stack Component (vertical flex with gap)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg" | "xl";
  align?: "start" | "end" | "center" | "stretch";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = "md", align = "stretch", children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        align={align}
        gap={gap}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  },
);
Stack.displayName = "Stack";

// Center Component
interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: ContainerSize;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, maxWidth, children, ...props }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          maxWidth && maxWidthClasses[maxWidth],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Center.displayName = "Center";
