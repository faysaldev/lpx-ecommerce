// Visual Effects Design Tokens
// Shadows, blurs, overlays, and other effects

export const effects = {
  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    // Elevation shadows (Material Design inspired)
    elevation: {
      none: "none",
      xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      "3xl": "0 35px 60px -15px rgb(0 0 0 / 0.3)",
    },

    // Colored shadows
    colored: {
      primary: "0 10px 40px -10px hsl(var(--primary) / 0.35)",
      secondary: "0 10px 40px -10px hsl(var(--secondary) / 0.35)",
      success: "0 10px 40px -10px hsl(142 76% 36% / 0.35)",
      warning: "0 10px 40px -10px hsl(38 92% 50% / 0.35)",
      error: "0 10px 40px -10px hsl(var(--destructive) / 0.35)",
      info: "0 10px 40px -10px hsl(199 89% 48% / 0.35)",
    },

    // Inset shadows
    inset: {
      sm: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      lg: "inset 0 4px 6px 0 rgb(0 0 0 / 0.1)",
      xl: "inset 0 8px 12px 0 rgb(0 0 0 / 0.15)",
    },

    // Directional shadows
    directional: {
      top: "0 -4px 6px -1px rgb(0 0 0 / 0.1)",
      right: "4px 0 6px -1px rgb(0 0 0 / 0.1)",
      bottom: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      left: "-4px 0 6px -1px rgb(0 0 0 / 0.1)",
    },

    // Neumorphism shadows
    neumorphic: {
      flat: "0 0 0 rgb(0 0 0 / 0)",
      concave:
        "inset 2px 2px 5px rgb(0 0 0 / 0.1), inset -2px -2px 5px rgb(255 255 255 / 0.5)",
      convex:
        "2px 2px 5px rgb(0 0 0 / 0.1), -2px -2px 5px rgb(255 255 255 / 0.5)",
      pressed:
        "inset 3px 3px 7px rgb(0 0 0 / 0.15), inset -3px -3px 7px rgb(255 255 255 / 0.5)",
    },

    // Glassmorphism shadows
    glass: {
      sm: "0 2px 8px 0 rgb(0 0 0 / 0.04)",
      md: "0 8px 32px 0 rgb(0 0 0 / 0.08)",
      lg: "0 16px 64px 0 rgb(0 0 0 / 0.12)",
    },
  },

  // ============================================
  // BLUR EFFECTS
  // ============================================
  blur: {
    none: "0",
    xs: "2px",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px",

    // Backdrop blur (for glassmorphism)
    backdrop: {
      none: "0",
      xs: "2px",
      sm: "4px",
      DEFAULT: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
    },
  },

  // ============================================
  // OPACITY
  // ============================================
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    15: "0.15",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    35: "0.35",
    40: "0.4",
    45: "0.45",
    50: "0.5",
    55: "0.55",
    60: "0.6",
    65: "0.65",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    85: "0.85",
    90: "0.9",
    95: "0.95",
    100: "1",
  },

  // ============================================
  // OVERLAYS
  // ============================================
  overlay: {
    // Dark overlays
    dark: {
      subtle: "rgb(0 0 0 / 0.1)",
      light: "rgb(0 0 0 / 0.3)",
      medium: "rgb(0 0 0 / 0.5)",
      strong: "rgb(0 0 0 / 0.7)",
      heavy: "rgb(0 0 0 / 0.9)",
    },

    // Light overlays
    light: {
      subtle: "rgb(255 255 255 / 0.1)",
      light: "rgb(255 255 255 / 0.3)",
      medium: "rgb(255 255 255 / 0.5)",
      strong: "rgb(255 255 255 / 0.7)",
      heavy: "rgb(255 255 255 / 0.9)",
    },

    // Colored overlays
    colored: {
      primary: "hsl(var(--primary) / 0.1)",
      secondary: "hsl(var(--secondary) / 0.1)",
      accent: "hsl(var(--accent) / 0.1)",
      success: "hsl(142 76% 36% / 0.1)",
      warning: "hsl(38 92% 50% / 0.1)",
      error: "hsl(var(--destructive) / 0.1)",
    },
  },

  // ============================================
  // FILTERS
  // ============================================
  filters: {
    // Brightness
    brightness: {
      0: "0",
      50: "0.5",
      75: "0.75",
      90: "0.9",
      95: "0.95",
      100: "1",
      105: "1.05",
      110: "1.1",
      125: "1.25",
      150: "1.5",
      200: "2",
    },

    // Contrast
    contrast: {
      0: "0",
      50: "0.5",
      75: "0.75",
      100: "1",
      125: "1.25",
      150: "1.5",
      200: "2",
    },

    // Saturation
    saturation: {
      0: "0",
      50: "0.5",
      100: "1",
      150: "1.5",
      200: "2",
    },

    // Grayscale
    grayscale: {
      0: "0",
      100: "1",
    },

    // Sepia
    sepia: {
      0: "0",
      100: "1",
    },

    // Hue rotate
    hueRotate: {
      0: "0deg",
      15: "15deg",
      30: "30deg",
      45: "45deg",
      60: "60deg",
      90: "90deg",
      180: "180deg",
      270: "270deg",
    },

    // Invert
    invert: {
      0: "0",
      100: "1",
    },
  },

  // ============================================
  // GLASSMORPHISM
  // ============================================
  glass: {
    // Glass surface styles
    surface: {
      light: {
        background: "rgb(255 255 255 / 0.7)",
        backdropFilter: "blur(10px) saturate(180%)",
        border: "1px solid rgb(255 255 255 / 0.3)",
      },
      dark: {
        background: "rgb(0 0 0 / 0.7)",
        backdropFilter: "blur(10px) saturate(180%)",
        border: "1px solid rgb(255 255 255 / 0.1)",
      },
      colored: {
        background: "hsl(var(--primary) / 0.1)",
        backdropFilter: "blur(10px) saturate(200%)",
        border: "1px solid hsl(var(--primary) / 0.2)",
      },
    },
  },

  // ============================================
  // MASKS
  // ============================================
  masks: {
    // Gradient masks for text/image effects
    gradient: {
      toTop: "linear-gradient(to top, transparent, black)",
      toBottom: "linear-gradient(to bottom, transparent, black)",
      toLeft: "linear-gradient(to left, transparent, black)",
      toRight: "linear-gradient(to right, transparent, black)",
      radial: "radial-gradient(circle, black, transparent)",
    },

    // Edge fade masks
    fade: {
      top: "linear-gradient(to bottom, transparent 0%, black 10%, black 100%)",
      bottom: "linear-gradient(to top, transparent 0%, black 10%, black 100%)",
      horizontal:
        "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      vertical:
        "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
    },
  },

  // ============================================
  // TRANSFORMS
  // ============================================
  transforms: {
    // Scale
    scale: {
      0: "0",
      50: "0.5",
      75: "0.75",
      90: "0.9",
      95: "0.95",
      100: "1",
      105: "1.05",
      110: "1.1",
      125: "1.25",
      150: "1.5",
    },

    // Rotate
    rotate: {
      0: "0deg",
      1: "1deg",
      2: "2deg",
      3: "3deg",
      6: "6deg",
      12: "12deg",
      45: "45deg",
      90: "90deg",
      180: "180deg",
      270: "270deg",
    },

    // Skew
    skew: {
      0: "0deg",
      1: "1deg",
      2: "2deg",
      3: "3deg",
      6: "6deg",
      12: "12deg",
    },

    // Translate (uses spacing scale)
    translate: {
      0: "0",
      px: "1px",
      0.5: "0.125rem",
      1: "0.25rem",
      2: "0.5rem",
      4: "1rem",
      8: "2rem",
      16: "4rem",
      full: "100%",
    },

    // 3D transforms
    perspective: {
      none: "none",
      sm: "250px",
      DEFAULT: "500px",
      lg: "750px",
      xl: "1000px",
    },
  },
} as const;

// Type exports
export type ShadowElevation = keyof typeof effects.shadows.elevation;
export type BlurAmount = keyof typeof effects.blur;
export type OpacityLevel = keyof typeof effects.opacity;
export type FilterType = keyof typeof effects.filters;
export type TransformType = keyof typeof effects.transforms;
