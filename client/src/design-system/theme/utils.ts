// Design Token Utility Functions
// Helper functions for working with design tokens

import { cn } from "@/lib/utils";
import { tokens } from "../../lib/tokens";

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Get a color value from tokens
 * @param path - Dot notation path to color (e.g., 'semantic.status.success.DEFAULT')
 */
export const getColor = (path: string): string => {
  const keys = path.split(".");
  let value: unknown = tokens.colors;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return "";
    }
  }

  return typeof value === "string" ? value : "";
};

/**
 * Generate color classes with opacity
 * @param color - Base color class
 * @param opacity - Opacity value (0-100)
 */
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}/${opacity}`;
};

/**
 * Create a gradient from color tokens
 * @param type - Gradient type (linear, radial)
 * @param colors - Array of color values or token paths
 * @param direction - Gradient direction
 */
export const createGradient = (
  type: "linear" | "radial",
  colors: string[],
  direction = "135deg",
): string => {
  const colorValues = colors.map((c) => (c.includes(".") ? getColor(c) : c));

  if (type === "linear") {
    return `linear-gradient(${direction}, ${colorValues.join(", ")})`;
  }

  return `radial-gradient(circle, ${colorValues.join(", ")})`;
};

// ============================================
// TYPOGRAPHY UTILITIES
// ============================================

/**
 * Get typography classes for a preset
 * @param preset - Typography preset name
 */
export const getTypography = (_preset: string): string => {
  // Return empty string since presets don't exist in current tokens structure
  return "";
};

/**
 * Create responsive font size classes
 * @param mobile - Mobile size
 * @param tablet - Tablet size (optional)
 * @param desktop - Desktop size (optional)
 */
export const responsiveText = (
  mobile: string,
  tablet?: string,
  desktop?: string,
): string => {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  return cn(...classes);
};

/**
 * Apply fluid typography
 * @param min - Minimum font size
 * @param preferred - Preferred font size (viewport-based)
 * @param max - Maximum font size
 */
export const fluidText = (
  min: string,
  preferred: string,
  max: string,
): string => {
  return `clamp(${min}, ${preferred}, ${max})`;
};

// ============================================
// SPACING UTILITIES
// ============================================

/**
 * Get spacing value from tokens
 * @param size - Spacing size key
 */
export const getSpacing = (size: keyof typeof tokens.spacing): string => {
  return tokens.spacing[size];
};

/**
 * Create responsive spacing classes
 * @param property - CSS property (p, m, gap, etc.)
 * @param sizes - Object with breakpoint keys and size values
 */
export const responsiveSpacing = (
  property: string,
  sizes: { base?: string; sm?: string; md?: string; lg?: string; xl?: string },
): string => {
  const classes = [];

  if (sizes.base) classes.push(`${property}-${sizes.base}`);
  if (sizes.sm) classes.push(`sm:${property}-${sizes.sm}`);
  if (sizes.md) classes.push(`md:${property}-${sizes.md}`);
  if (sizes.lg) classes.push(`lg:${property}-${sizes.lg}`);
  if (sizes.xl) classes.push(`xl:${property}-${sizes.xl}`);

  return cn(...classes);
};

/**
 * Create container padding that scales with viewport
 */
export const containerPadding = (): string => {
  return cn("px-4", "sm:px-6", "lg:px-8", "xl:px-12");
};

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Get animation classes with optional conditions
 * @param animation - Animation name
 * @param options - Animation options
 */
export const getAnimation = (
  animation: keyof typeof tokens.animation,
  options?: {
    duration?: keyof typeof tokens.transitions.duration;
    easing?: string;
    delay?: string;
    iterationCount?: string | number;
  },
): string => {
  const classes = [`animate-${animation}`];

  if (options?.duration) {
    classes.push(`duration-${options.duration}`);
  }

  if (options?.easing) {
    classes.push(`ease-${options.easing}`);
  }

  return cn(...classes);
};

/**
 * Create staggered animation delays for list items
 * @param count - Number of items
 * @param baseDelay - Base delay in ms
 */
export const staggerAnimation = (count: number, baseDelay = 100): string[] => {
  return Array.from(
    { length: count },
    (_, i) => `animation-delay: ${i * baseDelay}ms`,
  );
};

/**
 * Apply transition with custom properties
 * @param properties - CSS properties to transition
 * @param options - Transition options
 */
export const transition = (
  properties: string | string[],
  options?: {
    duration?: keyof typeof tokens.transitions.duration;
    easing?: string;
  },
): string => {
  const props = Array.isArray(properties) ? properties.join(", ") : properties;
  const duration = options?.duration
    ? tokens.transitions.duration[options.duration]
    : "200ms";
  const easing = options?.easing || "ease";

  return `${props} ${duration} ${easing}`;
};

// ============================================
// EFFECT UTILITIES
// ============================================

/**
 * Apply shadow with optional color
 * @param elevation - Shadow elevation level
 * @param color - Optional shadow color
 */
export const getShadow = (
  elevation: keyof typeof tokens.shadows,
  color?: string,
): string => {
  const shadow = tokens.shadows[elevation];
  if (color && typeof shadow === "string") {
    return shadow.replace(/rgb\(0 0 0/g, color);
  }
  return shadow;
};

/**
 * Create glassmorphism effect
 * @param variant - Glass variant (light, dark, colored)
 */
export const glassMorphism = (
  variant: "light" | "dark" | "colored" = "light",
): object => {
  const variants = {
    light: {
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    dark: {
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    colored: {
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
  };
  return variants[variant];
};

/**
 * Apply blur effect
 * @param amount - Blur amount
 * @param backdrop - Whether to apply backdrop blur
 */
export const blur = (
  amount: "sm" | "md" | "lg" | "xl",
  backdrop = false,
): string => {
  return backdrop ? `backdrop-blur-${amount}` : `blur-${amount}`;
};

// ============================================
// BORDER UTILITIES
// ============================================

/**
 * Get border radius value
 * @param size - Radius size
 * @param corners - Specific corners to apply (optional)
 */
export const getRadius = (
  size: keyof typeof tokens.borderRadius,
  corners?: ("tl" | "tr" | "bl" | "br")[],
): string => {
  if (!corners) {
    return `rounded-${size}`;
  }

  return corners.map((corner) => `rounded-${corner}-${size}`).join(" ");
};

/**
 * Create border with custom properties
 * @param options - Border options
 */
export const border = (options: {
  width?: "0" | "1" | "2" | "4" | "8";
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  sides?: ("t" | "r" | "b" | "l")[];
}): string => {
  const { width = "1", style = "solid", color = "border", sides } = options;

  if (!sides) {
    return cn(
      `border-${width}`,
      style !== "solid" && `border-${style}`,
      color !== "border" && `border-${color}`,
    );
  }

  return sides
    .map((side) =>
      cn(
        `border-${side}-${width}`,
        style !== "solid" && `border-${side}-${style}`,
        color !== "border" && `border-${side}-${color}`,
      ),
    )
    .join(" ");
};

// ============================================
// RESPONSIVE UTILITIES
// ============================================

/**
 * Apply responsive classes based on breakpoints
 * @param classes - Object with breakpoint keys and class values
 */
export const responsive = (classes: {
  base?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
}): string => {
  const result = [];

  if (classes.base) result.push(classes.base);
  if (classes.xs) result.push(`xs:${classes.xs}`);
  if (classes.sm) result.push(`sm:${classes.sm}`);
  if (classes.md) result.push(`md:${classes.md}`);
  if (classes.lg) result.push(`lg:${classes.lg}`);
  if (classes.xl) result.push(`xl:${classes.xl}`);
  if (classes["2xl"]) result.push(`2xl:${classes["2xl"]}`);

  return cn(...result);
};

/**
 * Hide element at specific breakpoints
 * @param breakpoints - Breakpoints where element should be hidden
 */
export const hideAt = (
  ...breakpoints: ("xs" | "sm" | "md" | "lg" | "xl" | "2xl")[]
): string => {
  return cn(...breakpoints.map((bp) => `${bp}:hidden`));
};

/**
 * Show element only at specific breakpoints
 * @param breakpoints - Breakpoints where element should be visible
 */
export const showAt = (
  ...breakpoints: ("xs" | "sm" | "md" | "lg" | "xl" | "2xl")[]
): string => {
  const all: ("xs" | "sm" | "md" | "lg" | "xl" | "2xl")[] = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
  ];
  const hide = all.filter((bp) => !breakpoints.includes(bp));
  return cn("block", ...hide.map((bp) => `${bp}:hidden`));
};

// ============================================
// LAYOUT UTILITIES
// ============================================

/**
 * Create grid layout classes
 * @param cols - Number of columns or responsive column config
 * @param gap - Gap size
 */
export const grid = (
  cols: number | { base?: number; sm?: number; md?: number; lg?: number },
  gap?: keyof typeof tokens.spacing,
): string => {
  const classes = ["grid"];

  if (typeof cols === "number") {
    classes.push(`grid-cols-${cols}`);
  } else {
    if (cols.base) classes.push(`grid-cols-${cols.base}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  }

  if (gap) {
    classes.push(`gap-${gap}`);
  }

  return cn(...classes);
};

/**
 * Create flex layout classes
 * @param options - Flex layout options
 */
export const flex = (options?: {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "stretch" | "baseline";
  wrap?: boolean | "reverse";
  gap?: keyof typeof tokens.spacing;
}): string => {
  const classes = ["flex"];

  if (options?.direction && options.direction !== "row") {
    classes.push(`flex-${options.direction}`);
  }

  if (options?.justify) {
    classes.push(`justify-${options.justify}`);
  }

  if (options?.align) {
    classes.push(`items-${options.align}`);
  }

  if (options?.wrap) {
    classes.push(
      options.wrap === "reverse" ? "flex-wrap-reverse" : "flex-wrap",
    );
  }

  if (options?.gap) {
    classes.push(`gap-${options.gap}`);
  }

  return cn(...classes);
};

// ============================================
// COMPOSITE UTILITIES
// ============================================

/**
 * Create card component classes
 * @param variant - Card variant
 * @param options - Additional options
 */
export const card = (
  variant: "default" | "hover" | "featured" = "default",
  options?: {
    padding?: keyof typeof tokens.spacing;
    radius?: keyof typeof tokens.borderRadius;
    shadow?: keyof typeof tokens.shadows;
  },
): string => {
  const base = ["bg-card", "text-card-foreground", "border", "border-border"];

  // Apply variant styles
  if (variant === "hover") {
    base.push("transition-shadow", "hover:shadow-md");
  } else if (variant === "featured") {
    base.push(
      "bg-gradient-to-br",
      "from-primary/5",
      "to-primary/10",
      "border-primary/20",
    );
  }

  // Apply options
  if (options?.padding) {
    base.push(`p-${options.padding}`);
  } else {
    base.push("p-6");
  }

  if (options?.radius) {
    base.push(getRadius(options.radius));
  } else {
    base.push("rounded-lg");
  }

  if (options?.shadow) {
    base.push(`shadow-${options.shadow}`);
  } else if (variant !== "hover") {
    base.push("shadow-sm");
  }

  return cn(...base);
};

/**
 * Create button component classes
 * @param variant - Button variant
 * @param size - Button size
 */
export const button = (
  variant: "primary" | "secondary" | "ghost" | "outline" = "primary",
  size: "xs" | "sm" | "md" | "lg" | "xl" = "md",
): string => {
  const base = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:opacity-50",
    "disabled:pointer-events-none",
    "rounded-md",
  ];

  // Size classes
  const sizeClasses = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base",
    xl: "h-12 px-8 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return cn(...base, sizeClasses[size], variantClasses[variant]);
};

// Export all utilities as a single object for convenience
export const theme = {
  color: {
    get: getColor,
    withOpacity,
    gradient: createGradient,
  },
  typography: {
    get: getTypography,
    responsive: responsiveText,
    fluid: fluidText,
  },
  spacing: {
    get: getSpacing,
    responsive: responsiveSpacing,
    container: containerPadding,
  },
  animation: {
    get: getAnimation,
    stagger: staggerAnimation,
    transition,
  },
  effect: {
    shadow: getShadow,
    glass: glassMorphism,
    blur,
  },
  border: {
    radius: getRadius,
    create: border,
  },
  responsive: {
    apply: responsive,
    hideAt,
    showAt,
  },
  layout: {
    grid,
    flex,
  },
  component: {
    card,
    button,
  },
};
