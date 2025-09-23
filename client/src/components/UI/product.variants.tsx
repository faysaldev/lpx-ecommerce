import { designTokens } from "@/design-system/compat";

// Standardized product container design tokens
export const productStyles = {
  // Container styles for consistent product cards with defined shadows
  container: {
    base: "overflow-hidden shadow-md transition-all duration-300 cursor-pointer group bg-card rounded-lg border border-border flex flex-col",
    hover: "hover:border-primary/30 hover:shadow-xl hover:scale-[1.02]",
    active: "active:scale-[0.98]",
    // Fixed heights for different variants
    height: {
      default: "h-[420px]",
      compact: "h-[360px]",
      large: "h-[480px]",
    },
  },

  // Image container with fixed dimensions
  imageContainer: {
    base: "relative bg-muted overflow-hidden flex-shrink-0",
    hover: "group-hover:bg-muted/80",
    // Fixed heights for image area (roughly 60% of card height)
    height: {
      default: "h-[200px]", // Reduced from 240px
      compact: "h-[160px]", // Reduced from 200px
      large: "h-[240px]", // Reduced from 280px
    },
  },

  // Image styling with object-fit options
  image: {
    base: "w-full h-full transition-transform duration-500",
    hover: "group-hover:scale-110",
    // Object fit modes
    objectFit: {
      cover: "object-cover", // Crop to fill (default)
      contain: "object-contain", // Scale to fit
      fill: "object-fill", // Stretch to fill
      scale: "object-scale-down", // Scale down only if needed
    },
  },

  // Content padding and spacing
  content: {
    base: "p-3 space-y-1.5 flex flex-col flex-1",
    compact: "p-2.5 space-y-1 flex flex-col flex-1",
    large: "p-4 space-y-2 flex flex-col flex-1",
    // Min heights for content area
    height: {
      default: "min-h-[180px]", // Increased for better spacing
      compact: "min-h-[160px]", // Increased for better spacing
      large: "min-h-[200px]", // Increased for better spacing
    },
  },

  // Typography hierarchy with text truncation
  typography: {
    category:
      "text-xs font-medium text-muted-foreground uppercase tracking-wide truncate",
    title:
      "text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 h-10",
    vendor: "text-xs text-muted-foreground truncate",
    price: {
      current: "text-base font-bold text-foreground",
      original: "text-xs text-muted-foreground line-through",
      sale: "text-base font-bold text-destructive",
    },
    meta: "text-xs text-muted-foreground",
    rating: "text-xs font-medium text-muted-foreground",
  },

  // Rating display
  rating: {
    container: "flex items-center gap-0.5",
    star: "h-3 w-3 fill-yellow-400 text-yellow-400", // Keep as is - rating stars use specific yellow
    text: "text-xs font-medium text-muted-foreground ml-1",
  },

  // Badge design tokens
  badges: {
    // Positioning
    position: {
      topLeft: "absolute top-2 left-2 z-10",
      topRight: "absolute top-2 right-2 z-10",
      bottomLeft: "absolute bottom-2 left-2 z-10",
      bottomRight: "absolute bottom-2 right-2 z-10",
    },
    // Sizing
    size: {
      sm: "text-[10px] px-1.5 py-0 h-5",
      md: "text-xs px-2 py-0.5 h-6",
      lg: "text-sm px-2.5 py-1 h-7",
    },
    // Common styles
    base: "capitalize font-medium",
  },

  // Interactive elements
  actions: {
    container:
      "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300",
    buttonGroup:
      "absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0",
    button:
      "bg-background/95 backdrop-blur-sm border border-border shadow-lg hover:bg-background hover:shadow-xl transition-all duration-200",
    // Cart button sizes
    cartButton: {
      sm: "h-7 w-7 p-0",
      md: "h-8 w-8 p-0",
      lg: "h-9 w-9 p-0",
    },
    // Icon sizes
    icon: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },

  // Overlay effects
  overlay: {
    gradient:
      "absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
    blur: "absolute inset-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  },

  // Grid layouts
  grid: {
    base: "grid gap-6", // Removed auto-rows-fr since we use fixed heights
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
    },
  },

  // List view styles
  list: {
    container:
      "flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300",
    imageContainer:
      "w-32 h-32 flex-shrink-0 rounded-md overflow-hidden bg-muted",
    content: "flex-1 min-w-0 space-y-2",
    actions: "flex items-start gap-2",
  },

  // Loading states
  skeleton: {
    container: "animate-pulse",
    image: "bg-muted rounded-lg aspect-square",
    text: "h-4 bg-muted rounded",
    button: "h-8 w-8 bg-muted rounded",
  },

  // Status indicators
  status: {
    new: designTokens.colors.badge.new,
    featured: designTokens.colors.badge.featured,
    sale: designTokens.colors.badge.sale,
    soldOut:
      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20", // Not defined in tokens
    limited:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", // Not defined in tokens
  },

  // Form controls design tokens
  forms: {
    // Input sizes
    input: {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-9 px-3.5 text-sm rounded-md",
      lg: "h-10 px-4 text-base rounded-md",
    },
    // Button sizes (matching input heights)
    button: {
      sm: "h-8 px-3 text-xs font-medium rounded-md",
      md: "h-9 px-4 text-sm font-medium rounded-md",
      lg: "h-10 px-6 text-base font-medium rounded-md",
    },
    // Icon button sizes
    iconButton: {
      sm: "h-8 w-8 p-0 rounded-md",
      md: "h-9 w-9 p-0 rounded-md",
      lg: "h-10 w-10 p-0 rounded-md",
    },
    // Select/Dropdown
    select: {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-9 px-3.5 text-sm rounded-md",
      lg: "h-10 px-4 text-base rounded-md",
    },
    // Label
    label: {
      sm: "text-xs font-medium text-muted-foreground",
      md: "text-sm font-medium text-muted-foreground",
      lg: "text-base font-medium text-muted-foreground",
    },
    // Form icons
    icon: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
};

// Utility function to combine container classes
export const getProductClasses = (
  variant: "default" | "compact" | "large" = "default",
  className?: string,
) => {
  const baseClasses = [
    productStyles.container.base,
    productStyles.container.height[variant], // Apply fixed height
    productStyles.container.hover,
    productStyles.container.active,
  ].join(" ");

  return className ? `${baseClasses} ${className}` : baseClasses;
};

// Get content padding based on variant
export const getContentClasses = (
  variant: "default" | "compact" | "large" = "default",
) => {
  const baseContent = {
    compact: productStyles.content.compact,
    large: productStyles.content.large,
    default: productStyles.content.base,
  }[variant];

  const heightClass = productStyles.content.height[variant];

  return `${baseContent} ${heightClass}`;
};

// Get image container classes based on variant
export const getImageContainerClasses = (
  variant: "default" | "compact" | "large" = "default",
) => {
  return [
    productStyles.imageContainer.base,
    productStyles.imageContainer.height[variant],
    productStyles.imageContainer.hover,
  ].join(" ");
};

// Get image classes with object fit mode
export const getImageClasses = (
  objectFit: keyof typeof productStyles.image.objectFit = "contain",
) => {
  return [
    productStyles.image.base,
    productStyles.image.hover,
    productStyles.image.objectFit[objectFit],
  ].join(" ");
};
