// Border & Shape Design Tokens
// Comprehensive border system

export const borders = {
  // ============================================
  // BORDER WIDTH
  // ============================================
  width: {
    0: "0px",
    hairline: "0.5px",
    thin: "1px",
    DEFAULT: "1px",
    medium: "2px",
    thick: "3px",
    heavy: "4px",
    bold: "6px",
    extrabold: "8px",
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: "0px",
    xs: "0.125rem", // 2px
    sm: "0.25rem", // 4px - subtle rounding
    DEFAULT: "0.375rem", // 6px - default
    md: "0.5rem", // 8px - medium rounding
    lg: "0.75rem", // 12px - large rounding
    xl: "1rem", // 16px - extra large
    "2xl": "1.25rem", // 20px
    "3xl": "1.5rem", // 24px
    "4xl": "2rem", // 32px
    full: "9999px", // pill shape

    // Component-specific radii
    button: {
      sm: "0.25rem", // 4px
      md: "0.375rem", // 6px
      lg: "0.5rem", // 8px
      full: "9999px", // pill
    },

    card: {
      sm: "0.5rem", // 8px
      md: "0.75rem", // 12px
      lg: "1rem", // 16px
      xl: "1.5rem", // 24px
    },

    input: {
      DEFAULT: "0.375rem", // 6px
      sm: "0.25rem", // 4px
      lg: "0.5rem", // 8px
    },

    modal: {
      sm: "0.5rem", // 8px
      md: "0.75rem", // 12px
      lg: "1rem", // 16px
    },
  },

  // ============================================
  // BORDER STYLES
  // ============================================
  style: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    double: "double",
    hidden: "hidden",
    none: "none",
  },

  // ============================================
  // BORDER COLORS
  // ============================================
  color: {
    // Default borders
    DEFAULT: "hsl(var(--border))",
    subtle: "hsl(var(--border) / 0.5)",
    strong: "hsl(var(--foreground) / 0.2)",

    // Interactive borders
    interactive: {
      DEFAULT: "hsl(var(--border))",
      hover: "hsl(var(--foreground) / 0.3)",
      focus: "hsl(var(--ring))",
      active: "hsl(var(--primary))",
      disabled: "hsl(var(--border) / 0.3)",
    },

    // Status borders
    status: {
      success: "hsl(142 76% 36%)",
      warning: "hsl(38 92% 50%)",
      error: "hsl(var(--destructive))",
      info: "hsl(199 89% 48%)",
    },

    // Transparent
    transparent: "transparent",

    // Current color
    current: "currentColor",
  },

  // ============================================
  // OUTLINE STYLES
  // ============================================
  outline: {
    // Width
    width: {
      0: "0px",
      thin: "1px",
      DEFAULT: "2px",
      thick: "3px",
      bold: "4px",
    },

    // Offset
    offset: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Style
    style: {
      none: "none",
      solid: "solid",
      dashed: "dashed",
      dotted: "dotted",
      double: "double",
    },

    // Colors
    color: {
      DEFAULT: "hsl(var(--ring))",
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      error: "hsl(var(--destructive))",
      current: "currentColor",
    },
  },

  // ============================================
  // RING (Focus rings)
  // ============================================
  ring: {
    // Width
    width: {
      0: "0px",
      1: "1px",
      2: "2px",
      DEFAULT: "3px",
      4: "4px",
      8: "8px",
    },

    // Offset
    offset: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Colors
    color: {
      DEFAULT: "hsl(var(--ring))",
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      accent: "hsl(var(--accent))",
      error: "hsl(var(--destructive))",
      transparent: "transparent",
    },

    // Inset rings
    inset: {
      DEFAULT: "inset",
      none: "",
    },
  },

  // ============================================
  // DIVIDER STYLES
  // ============================================
  divider: {
    // Horizontal dividers
    horizontal: {
      thin: {
        height: "1px",
        background: "hsl(var(--border))",
      },
      medium: {
        height: "2px",
        background: "hsl(var(--border))",
      },
      thick: {
        height: "4px",
        background: "hsl(var(--border))",
      },
      gradient: {
        height: "1px",
        background:
          "linear-gradient(to right, transparent, hsl(var(--border)), transparent)",
      },
    },

    // Vertical dividers
    vertical: {
      thin: {
        width: "1px",
        background: "hsl(var(--border))",
      },
      medium: {
        width: "2px",
        background: "hsl(var(--border))",
      },
      thick: {
        width: "4px",
        background: "hsl(var(--border))",
      },
      gradient: {
        width: "1px",
        background:
          "linear-gradient(to bottom, transparent, hsl(var(--border)), transparent)",
      },
    },
  },

  // ============================================
  // SPECIAL BORDER EFFECTS
  // ============================================
  effects: {
    // Gradient borders
    gradient: {
      primary:
        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.5))",
      rainbow:
        "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #feca57 75%, #48c9b0 100%)",
      subtle: "linear-gradient(135deg, hsl(var(--border)), transparent)",
    },

    // Animated borders
    animated: {
      pulse: "border-pulse 2s infinite",
      spin: "border-spin 3s linear infinite",
      glow: "border-glow 2s ease-in-out infinite alternate",
    },

    // Double borders
    double: {
      spacing: {
        sm: "2px",
        md: "4px",
        lg: "6px",
      },
    },
  },

  // ============================================
  // CORNER-SPECIFIC RADIUS
  // ============================================
  corners: {
    // Top corners
    top: {
      none: { tl: "0", tr: "0" },
      sm: { tl: "0.25rem", tr: "0.25rem" },
      md: { tl: "0.5rem", tr: "0.5rem" },
      lg: { tl: "0.75rem", tr: "0.75rem" },
      xl: { tl: "1rem", tr: "1rem" },
      full: { tl: "9999px", tr: "9999px" },
    },

    // Bottom corners
    bottom: {
      none: { bl: "0", br: "0" },
      sm: { bl: "0.25rem", br: "0.25rem" },
      md: { bl: "0.5rem", br: "0.5rem" },
      lg: { bl: "0.75rem", br: "0.75rem" },
      xl: { bl: "1rem", br: "1rem" },
      full: { bl: "9999px", br: "9999px" },
    },

    // Left corners
    left: {
      none: { tl: "0", bl: "0" },
      sm: { tl: "0.25rem", bl: "0.25rem" },
      md: { tl: "0.5rem", bl: "0.5rem" },
      lg: { tl: "0.75rem", bl: "0.75rem" },
      xl: { tl: "1rem", bl: "1rem" },
      full: { tl: "9999px", bl: "9999px" },
    },

    // Right corners
    right: {
      none: { tr: "0", br: "0" },
      sm: { tr: "0.25rem", br: "0.25rem" },
      md: { tr: "0.5rem", br: "0.5rem" },
      lg: { tr: "0.75rem", br: "0.75rem" },
      xl: { tr: "1rem", br: "1rem" },
      full: { tr: "9999px", br: "9999px" },
    },
  },
} as const;

// Type exports
export type BorderWidth = keyof typeof borders.width;
export type BorderRadius = keyof typeof borders.radius;
export type BorderStyle = keyof typeof borders.style;
export type BorderColor = keyof typeof borders.color;
export type RingWidth = keyof typeof borders.ring.width;
