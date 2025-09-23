// Comprehensive Spacing System
// Based on 4px base unit with consistent scale

export const spacing = {
  // ============================================
  // BASE SPACING SCALE
  // ============================================
  scale: {
    px: "1px",
    0: "0",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px - base unit
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // ============================================
  // SEMANTIC SPACING
  // ============================================
  semantic: {
    // Component internal spacing
    component: {
      xs: "0.25rem", // 4px - tight spacing
      sm: "0.5rem", // 8px - small components
      md: "1rem", // 16px - default
      lg: "1.5rem", // 24px - spacious
      xl: "2rem", // 32px - very spacious
    },

    // Layout spacing
    layout: {
      xs: "0.5rem", // 8px - minimal gap
      sm: "1rem", // 16px - small gap
      md: "1.5rem", // 24px - default gap
      lg: "2rem", // 32px - large gap
      xl: "3rem", // 48px - extra large gap
      "2xl": "4rem", // 64px - section spacing
      "3xl": "6rem", // 96px - page sections
    },

    // Content spacing
    content: {
      paragraph: "1rem", // 16px - between paragraphs
      section: "2rem", // 32px - between sections
      subsection: "1.5rem", // 24px - between subsections
      list: "0.5rem", // 8px - between list items
      inline: "0.25rem", // 4px - inline elements
    },

    // Form spacing
    form: {
      field: "1rem", // 16px - between fields
      group: "1.5rem", // 24px - between groups
      label: "0.5rem", // 8px - label to input
      helper: "0.25rem", // 4px - input to helper text
    },

    // Grid/Flex gaps
    gap: {
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      "2xl": "3rem", // 48px
    },
  },

  // ============================================
  // INSET SPACING (Padding)
  // ============================================
  inset: {
    // Symmetrical insets
    xs: {
      all: "0.25rem", // 4px all sides
      x: "0.25rem", // 4px horizontal
      y: "0.25rem", // 4px vertical
    },
    sm: {
      all: "0.5rem", // 8px all sides
      x: "0.5rem", // 8px horizontal
      y: "0.5rem", // 8px vertical
    },
    md: {
      all: "1rem", // 16px all sides
      x: "1rem", // 16px horizontal
      y: "1rem", // 16px vertical
    },
    lg: {
      all: "1.5rem", // 24px all sides
      x: "1.5rem", // 24px horizontal
      y: "1.5rem", // 24px vertical
    },
    xl: {
      all: "2rem", // 32px all sides
      x: "2rem", // 32px horizontal
      y: "2rem", // 32px vertical
    },

    // Asymmetrical insets
    squish: {
      sm: { x: "0.5rem", y: "0.25rem" }, // 8px x 4px
      md: { x: "1rem", y: "0.5rem" }, // 16px x 8px
      lg: { x: "1.5rem", y: "0.75rem" }, // 24px x 12px
    },
    stretch: {
      sm: { x: "0.25rem", y: "0.5rem" }, // 4px x 8px
      md: { x: "0.5rem", y: "1rem" }, // 8px x 16px
      lg: { x: "0.75rem", y: "1.5rem" }, // 12px x 24px
    },
  },

  // ============================================
  // STACK SPACING (Vertical rhythm)
  // ============================================
  stack: {
    xs: "0.25rem", // 4px - minimal
    sm: "0.5rem", // 8px - tight
    md: "1rem", // 16px - default
    lg: "1.5rem", // 24px - loose
    xl: "2rem", // 32px - very loose
    "2xl": "3rem", // 48px - sections
    "3xl": "4rem", // 64px - major sections
  },

  // ============================================
  // INLINE SPACING (Horizontal rhythm)
  // ============================================
  inline: {
    xs: "0.25rem", // 4px - minimal
    sm: "0.5rem", // 8px - tight
    md: "0.75rem", // 12px - default
    lg: "1rem", // 16px - loose
    xl: "1.5rem", // 24px - very loose
  },

  // ============================================
  // CONTAINER SPACING
  // ============================================
  container: {
    padding: {
      mobile: "1rem", // 16px
      tablet: "1.5rem", // 24px
      desktop: "2rem", // 32px
      wide: "3rem", // 48px
    },
    maxWidth: {
      xs: "20rem", // 320px
      sm: "24rem", // 384px
      md: "28rem", // 448px
      lg: "32rem", // 512px
      xl: "36rem", // 576px
      "2xl": "42rem", // 672px
      "3xl": "48rem", // 768px
      "4xl": "56rem", // 896px
      "5xl": "64rem", // 1024px
      "6xl": "72rem", // 1152px
      "7xl": "80rem", // 1280px
      "8xl": "90rem", // 1440px
      full: "100%",
      prose: "65ch", // Optimal reading width
    },
  },

  // ============================================
  // RESPONSIVE SPACING
  // ============================================
  responsive: {
    // Section padding that scales with viewport
    section: {
      mobile: "2rem 1rem", // 32px 16px
      tablet: "3rem 1.5rem", // 48px 24px
      desktop: "4rem 2rem", // 64px 32px
      wide: "6rem 3rem", // 96px 48px
    },

    // Component padding that scales
    component: {
      mobile: "0.75rem", // 12px
      tablet: "1rem", // 16px
      desktop: "1.5rem", // 24px
    },

    // Gap spacing that scales
    gap: {
      mobile: "0.5rem", // 8px
      tablet: "1rem", // 16px
      desktop: "1.5rem", // 24px
    },
  },

  // ============================================
  // NEGATIVE SPACING (for overlaps)
  // ============================================
  negative: {
    xs: "-0.25rem", // -4px
    sm: "-0.5rem", // -8px
    md: "-1rem", // -16px
    lg: "-1.5rem", // -24px
    xl: "-2rem", // -32px
    "2xl": "-3rem", // -48px
  },
} as const;

// Utility functions
export const spacingUtils = {
  // Convert number to rem
  toRem: (px: number) => `${px / 16}rem`,

  // Convert rem to px
  toPx: (rem: string) => {
    const value = parseFloat(rem);
    return value * 16;
  },

  // Get responsive spacing
  getResponsive: (base: number, scale = 1.5) => ({
    mobile: `${base}px`,
    tablet: `${base * scale}px`,
    desktop: `${base * scale * scale}px`,
  }),

  // Create fluid spacing with clamp
  fluid: (min: string, preferred: string, max: string) =>
    `clamp(${min}, ${preferred}, ${max})`,
};

// Type exports
export type SpacingScale = keyof typeof spacing.scale;
export type SpacingSemantic = keyof typeof spacing.semantic;
export type SpacingInset = keyof typeof spacing.inset;
export type SpacingStack = keyof typeof spacing.stack;
export type SpacingContainer = keyof typeof spacing.container;
