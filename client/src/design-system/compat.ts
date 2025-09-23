// Compatibility layer for existing designTokens usage
// This provides backward compatibility while we migrate to the new token structure

import { tokens } from "../lib/tokens";

// Create compatibility layer matching the old designTokens structure
export const designTokens = {
  // Typography mappings
  typography: {
    h1: "text-5xl font-bold tracking-tight",
    h2: "text-4xl font-bold tracking-tight",
    h3: "text-3xl font-bold tracking-tight",
    h4: "text-2xl font-bold tracking-tight",
    h5: "text-xl font-bold tracking-tight",
    h6: "text-lg font-bold tracking-tight",
    bodyLarge: "text-lg",
    body: "text-base",
    bodySmall: "text-sm",
    caption: "text-xs",
  },

  // Colors - mapped from new token structure
  colors: {
    // Status colors
    status: {
      success: tokens.colors.success[500],
      warning: tokens.colors.warning[500],
      error: tokens.colors.error[500],
      info: tokens.colors.info[500],
    },
    // Text colors
    text: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-muted-foreground",
    },
    // Condition colors (for badges)
    condition: {
      mint: tokens.colors.success[500],
      nearMint: tokens.colors.success[100],
      excellent: tokens.colors.info[500],
      good: tokens.colors.warning[500],
      fair: tokens.colors.warning[600],
      poor: tokens.colors.error[500],
    },
    // Badge colors
    badge: {
      new: "bg-emerald-500 text-white",
      featured: "bg-amber-500 text-white",
      sale: "bg-red-500 text-white",
    },
  },

  // Badge styles
  badge: {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    new: "bg-emerald-500 text-white",
    featured: "bg-amber-500 text-white",
    sale: "bg-red-500 text-white",
  },

  // Spacing
  spacing: {
    xs: tokens.spacing[1],
    sm: tokens.spacing[2],
    md: tokens.spacing[4],
    lg: tokens.spacing[6],
    xl: tokens.spacing[8],
    page: {
      padding: {
        xs: tokens.spacing[4],
        sm: tokens.spacing[6],
        md: tokens.spacing[8],
        lg: tokens.spacing[12],
      },
      section: {
        sm: "py-8",
        md: "py-12",
        lg: "py-16",
        xl: "py-20",
      },
    },
    component: {
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
  },

  // Grid
  grid: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
  },

  // Container
  container: {
    default: "max-w-7xl",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  },
};

// Re-export the new tokens as well for migration
export { tokens, tokens as newTokens } from "../lib/tokens";
