// Advanced Typography System
// Responsive and accessible type scale

export const typography = {
  // ============================================
  // FONT FAMILIES
  // ============================================
  fonts: {
    sans: {
      DEFAULT:
        'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: "var(--font-geist-sans), system-ui, sans-serif",
      body: "var(--font-geist-sans), system-ui, sans-serif",
    },
    serif: {
      DEFAULT: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      display: "Playfair Display, ui-serif, Georgia, serif",
      body: "Merriweather, ui-serif, Georgia, serif",
    },
    mono: {
      DEFAULT:
        'var(--font-geist-mono), ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
      code: 'var(--font-geist-mono), "Fira Code", "Source Code Pro", monospace',
    },
  },

  // ============================================
  // TYPE SCALE - Fluid responsive sizing
  // ============================================
  scale: {
    // Display sizes (for hero sections)
    display: {
      "2xl": {
        fontSize: "clamp(3rem, 8vw, 6rem)", // 48px → 96px
        lineHeight: "1",
        letterSpacing: "-0.02em",
        fontWeight: "800",
      },
      xl: {
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)", // 40px → 72px
        lineHeight: "1.1",
        letterSpacing: "-0.02em",
        fontWeight: "700",
      },
      lg: {
        fontSize: "clamp(2rem, 5vw, 3.75rem)", // 32px → 60px
        lineHeight: "1.1",
        letterSpacing: "-0.01em",
        fontWeight: "700",
      },
    },

    // Heading sizes
    heading: {
      h1: {
        fontSize: "clamp(2rem, 4vw, 3rem)", // 32px → 48px
        lineHeight: "1.2",
        letterSpacing: "-0.02em",
        fontWeight: "700",
      },
      h2: {
        fontSize: "clamp(1.5rem, 3vw, 2.25rem)", // 24px → 36px
        lineHeight: "1.3",
        letterSpacing: "-0.01em",
        fontWeight: "600",
      },
      h3: {
        fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)", // 20px → 30px
        lineHeight: "1.4",
        letterSpacing: "-0.01em",
        fontWeight: "600",
      },
      h4: {
        fontSize: "clamp(1.125rem, 2vw, 1.5rem)", // 18px → 24px
        lineHeight: "1.4",
        letterSpacing: "0",
        fontWeight: "600",
      },
      h5: {
        fontSize: "clamp(1rem, 1.5vw, 1.25rem)", // 16px → 20px
        lineHeight: "1.5",
        letterSpacing: "0",
        fontWeight: "500",
      },
      h6: {
        fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)", // 14px → 18px
        lineHeight: "1.5",
        letterSpacing: "0",
        fontWeight: "500",
      },
    },

    // Body text sizes
    body: {
      xl: {
        fontSize: "1.25rem", // 20px
        lineHeight: "1.75",
        letterSpacing: "0",
      },
      lg: {
        fontSize: "1.125rem", // 18px
        lineHeight: "1.75",
        letterSpacing: "0",
      },
      base: {
        fontSize: "1rem", // 16px
        lineHeight: "1.6",
        letterSpacing: "0",
      },
      sm: {
        fontSize: "0.875rem", // 14px
        lineHeight: "1.5",
        letterSpacing: "0",
      },
      xs: {
        fontSize: "0.75rem", // 12px
        lineHeight: "1.5",
        letterSpacing: "0",
      },
    },

    // Special text styles
    label: {
      lg: {
        fontSize: "0.875rem", // 14px
        lineHeight: "1.2",
        letterSpacing: "0",
        fontWeight: "500",
      },
      base: {
        fontSize: "0.75rem", // 12px
        lineHeight: "1.2",
        letterSpacing: "0",
        fontWeight: "500",
      },
      sm: {
        fontSize: "0.625rem", // 10px
        lineHeight: "1.2",
        letterSpacing: "0.05em",
        fontWeight: "600",
        textTransform: "uppercase" as const,
      },
    },

    // Code/mono text
    code: {
      lg: {
        fontSize: "1rem", // 16px
        lineHeight: "1.5",
        fontFamily: "var(--font-geist-mono)",
      },
      base: {
        fontSize: "0.875rem", // 14px
        lineHeight: "1.5",
        fontFamily: "var(--font-geist-mono)",
      },
      sm: {
        fontSize: "0.75rem", // 12px
        lineHeight: "1.5",
        fontFamily: "var(--font-geist-mono)",
      },
    },
  },

  // ============================================
  // FONT WEIGHTS
  // ============================================
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  // ============================================
  // LETTER SPACING
  // ============================================
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  // ============================================
  // LINE HEIGHT
  // ============================================
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // ============================================
  // TEXT DECORATION
  // ============================================
  textDecoration: {
    underline: {
      offset: "0.1em",
      thickness: "1px",
      color: "currentColor",
    },
    strikethrough: {
      thickness: "1px",
      color: "currentColor",
    },
    link: {
      DEFAULT: "underline",
      hover: "none",
      offset: "0.1em",
      thickness: "1px",
    },
  },

  // ============================================
  // TEXT TRANSFORM
  // ============================================
  textTransform: {
    none: "none",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
  },

  // ============================================
  // TEXT STYLES PRESETS
  // ============================================
  presets: {
    // Hero text
    hero: {
      title:
        "font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight",
      subtitle:
        "text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed",
    },

    // Section headers
    section: {
      title: "font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight",
      subtitle: "text-base md:text-lg text-muted-foreground",
    },

    // Card text
    card: {
      title: "font-semibold text-lg md:text-xl",
      description: "text-sm text-muted-foreground leading-relaxed",
    },

    // Form elements
    form: {
      label: "text-sm font-medium",
      helper: "text-xs text-muted-foreground",
      error: "text-xs text-destructive",
    },

    // Button text
    button: {
      xs: "text-xs font-medium",
      sm: "text-sm font-medium",
      base: "text-sm font-medium",
      lg: "text-base font-medium",
      xl: "text-lg font-medium",
    },

    // Badge text
    badge: {
      DEFAULT: "text-xs font-medium",
      sm: "text-[10px] font-semibold uppercase tracking-wider",
      lg: "text-sm font-medium",
    },

    // Navigation
    nav: {
      link: "text-sm font-medium hover:text-primary transition-colors",
      active: "text-sm font-semibold text-primary",
    },

    // Code blocks
    codeblock: {
      inline: "font-mono text-sm bg-muted px-1 py-0.5 rounded",
      block: "font-mono text-sm leading-relaxed",
    },

    // Quotes
    quote: {
      DEFAULT: "italic text-lg leading-relaxed",
      citation: "text-sm text-muted-foreground",
    },
  },

  // ============================================
  // RESPONSIVE TYPOGRAPHY UTILITIES
  // ============================================
  responsive: {
    // Fluid typography using CSS clamp()
    fluid: {
      xs: "clamp(0.75rem, 1vw, 0.875rem)", // 12px → 14px
      sm: "clamp(0.875rem, 1.5vw, 1rem)", // 14px → 16px
      base: "clamp(1rem, 2vw, 1.125rem)", // 16px → 18px
      lg: "clamp(1.125rem, 2.5vw, 1.25rem)", // 18px → 20px
      xl: "clamp(1.25rem, 3vw, 1.5rem)", // 20px → 24px
      "2xl": "clamp(1.5rem, 4vw, 2rem)", // 24px → 32px
      "3xl": "clamp(2rem, 5vw, 2.5rem)", // 32px → 40px
      "4xl": "clamp(2.5rem, 6vw, 3rem)", // 40px → 48px
    },
  },
} as const;

// Type exports
export type FontFamily = keyof typeof typography.fonts;
export type TypeScale = keyof typeof typography.scale;
export type FontWeight = keyof typeof typography.fontWeight;
export type TextPreset = keyof typeof typography.presets;
