// Advanced Color System with Semantic Tokens
// Based on modern design system principles

export const colors = {
  // ============================================
  // PRIMITIVE COLORS - Raw color values
  // ============================================
  primitive: {
    // Neutrals - Complete grayscale palette
    gray: {
      50: "hsl(210 40% 98%)",
      100: "hsl(210 40% 96%)",
      200: "hsl(214 32% 91%)",
      300: "hsl(213 27% 84%)",
      400: "hsl(215 20% 65%)",
      500: "hsl(215 16% 47%)",
      600: "hsl(215 19% 35%)",
      700: "hsl(215 25% 27%)",
      800: "hsl(217 33% 17%)",
      900: "hsl(222 47% 11%)",
      950: "hsl(229 84% 5%)",
    },

    // Blue palette
    blue: {
      50: "hsl(214 100% 97%)",
      100: "hsl(214 95% 93%)",
      200: "hsl(213 97% 87%)",
      300: "hsl(212 96% 78%)",
      400: "hsl(213 94% 68%)",
      500: "hsl(217 91% 60%)",
      600: "hsl(221 83% 53%)",
      700: "hsl(224 76% 48%)",
      800: "hsl(226 71% 40%)",
      900: "hsl(224 64% 33%)",
      950: "hsl(226 57% 21%)",
    },

    // Green palette
    green: {
      50: "hsl(138 76% 97%)",
      100: "hsl(141 84% 93%)",
      200: "hsl(141 79% 85%)",
      300: "hsl(142 77% 73%)",
      400: "hsl(142 69% 58%)",
      500: "hsl(142 71% 45%)",
      600: "hsl(142 76% 36%)",
      700: "hsl(142 72% 29%)",
      800: "hsl(143 64% 24%)",
      900: "hsl(144 61% 20%)",
      950: "hsl(145 80% 10%)",
    },

    // Red palette
    red: {
      50: "hsl(0 86% 97%)",
      100: "hsl(0 93% 94%)",
      200: "hsl(0 96% 89%)",
      300: "hsl(0 94% 82%)",
      400: "hsl(0 91% 71%)",
      500: "hsl(0 84% 60%)",
      600: "hsl(0 72% 51%)",
      700: "hsl(0 74% 42%)",
      800: "hsl(0 70% 35%)",
      900: "hsl(0 63% 31%)",
      950: "hsl(0 75% 15%)",
    },

    // Yellow palette
    yellow: {
      50: "hsl(55 92% 95%)",
      100: "hsl(55 97% 88%)",
      200: "hsl(53 98% 77%)",
      300: "hsl(50 98% 64%)",
      400: "hsl(48 96% 53%)",
      500: "hsl(45 93% 47%)",
      600: "hsl(41 96% 40%)",
      700: "hsl(35 92% 33%)",
      800: "hsl(32 81% 29%)",
      900: "hsl(28 73% 26%)",
      950: "hsl(26 83% 14%)",
    },

    // Purple palette
    purple: {
      50: "hsl(270 100% 98%)",
      100: "hsl(269 100% 95%)",
      200: "hsl(269 100% 92%)",
      300: "hsl(269 97% 85%)",
      400: "hsl(270 95% 75%)",
      500: "hsl(271 91% 65%)",
      600: "hsl(271 81% 56%)",
      700: "hsl(272 72% 47%)",
      800: "hsl(273 67% 39%)",
      900: "hsl(274 66% 32%)",
      950: "hsl(274 87% 21%)",
    },

    // Teal palette
    teal: {
      50: "hsl(166 76% 97%)",
      100: "hsl(167 85% 89%)",
      200: "hsl(168 84% 78%)",
      300: "hsl(171 77% 64%)",
      400: "hsl(172 66% 50%)",
      500: "hsl(173 80% 40%)",
      600: "hsl(175 84% 32%)",
      700: "hsl(175 77% 26%)",
      800: "hsl(176 69% 22%)",
      900: "hsl(176 61% 19%)",
      950: "hsl(177 79% 10%)",
    },
  },

  // ============================================
  // SEMANTIC COLORS - Purpose-driven colors
  // ============================================
  semantic: {
    // Background colors
    background: {
      primary: "hsl(var(--background))",
      secondary: "hsl(var(--muted))",
      tertiary: "hsl(var(--accent))",
      inverse: "hsl(var(--foreground))",
      overlay: "hsl(0 0% 0% / 0.5)",
      elevated: "hsl(var(--card))",
    },

    // Surface colors
    surface: {
      default: "hsl(var(--card))",
      raised: "hsl(var(--popover))",
      overlay: "hsl(var(--muted) / 0.8)",
      sunken: "hsl(var(--secondary))",
    },

    // Text colors
    text: {
      primary: "hsl(var(--foreground))",
      secondary: "hsl(var(--muted-foreground))",
      tertiary: "hsl(var(--muted-foreground) / 0.7)",
      inverse: "hsl(var(--background))",
      link: "hsl(var(--primary))",
      disabled: "hsl(var(--muted-foreground) / 0.5)",
    },

    // Border colors
    border: {
      default: "hsl(var(--border))",
      subtle: "hsl(var(--border) / 0.5)",
      strong: "hsl(var(--foreground) / 0.2)",
      focus: "hsl(var(--ring))",
    },

    // Status colors
    status: {
      success: {
        DEFAULT: "hsl(142 76% 36%)",
        light: "hsl(142 76% 36% / 0.1)",
        dark: "hsl(142 76% 26%)",
        foreground: "hsl(0 0% 100%)",
      },
      warning: {
        DEFAULT: "hsl(38 92% 50%)",
        light: "hsl(38 92% 50% / 0.1)",
        dark: "hsl(38 92% 40%)",
        foreground: "hsl(0 0% 100%)",
      },
      error: {
        DEFAULT: "hsl(var(--destructive))",
        light: "hsl(var(--destructive) / 0.1)",
        dark: "hsl(var(--destructive-foreground))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      info: {
        DEFAULT: "hsl(199 89% 48%)",
        light: "hsl(199 89% 48% / 0.1)",
        dark: "hsl(199 89% 38%)",
        foreground: "hsl(0 0% 100%)",
      },
    },

    // Interactive states
    interaction: {
      hover: "hsl(var(--primary) / 0.08)",
      active: "hsl(var(--primary) / 0.12)",
      selected: "hsl(var(--primary) / 0.15)",
      focus: "hsl(var(--ring))",
      disabled: "hsl(var(--muted))",
    },
  },

  // ============================================
  // BRAND COLORS - Brand-specific palette
  // ============================================
  brand: {
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
      hover: "hsl(var(--primary) / 0.9)",
      active: "hsl(var(--primary) / 0.8)",
      subtle: "hsl(var(--primary) / 0.1)",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
      hover: "hsl(var(--secondary) / 0.8)",
      active: "hsl(var(--secondary) / 0.7)",
      subtle: "hsl(var(--secondary) / 0.1)",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
      hover: "hsl(var(--accent) / 0.8)",
      active: "hsl(var(--accent) / 0.7)",
      subtle: "hsl(var(--accent) / 0.1)",
    },
  },

  // ============================================
  // DATA VISUALIZATION COLORS
  // ============================================
  dataViz: {
    categorical: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(270 95% 75%)",
      "hsl(172 66% 50%)",
      "hsl(48 96% 53%)",
    ],
    sequential: {
      blue: [
        "hsl(214 100% 97%)",
        "hsl(213 97% 87%)",
        "hsl(217 91% 60%)",
        "hsl(224 76% 48%)",
        "hsl(226 57% 21%)",
      ],
      green: [
        "hsl(138 76% 97%)",
        "hsl(141 79% 85%)",
        "hsl(142 71% 45%)",
        "hsl(142 72% 29%)",
        "hsl(145 80% 10%)",
      ],
      purple: [
        "hsl(270 100% 98%)",
        "hsl(269 97% 85%)",
        "hsl(271 91% 65%)",
        "hsl(272 72% 47%)",
        "hsl(274 87% 21%)",
      ],
    },
    diverging: {
      redBlue: [
        "hsl(0 84% 60%)",
        "hsl(0 96% 89%)",
        "hsl(210 40% 96%)",
        "hsl(213 97% 87%)",
        "hsl(217 91% 60%)",
      ],
      greenPurple: [
        "hsl(142 71% 45%)",
        "hsl(141 79% 85%)",
        "hsl(210 40% 96%)",
        "hsl(269 97% 85%)",
        "hsl(271 91% 65%)",
      ],
    },
  },

  // ============================================
  // GRADIENT PRESETS
  // ============================================
  gradients: {
    // Linear gradients
    linear: {
      primary:
        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
      secondary:
        "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.8))",
      accent:
        "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent) / 0.8))",
      sunset: "linear-gradient(135deg, hsl(0 84% 60%), hsl(38 92% 50%))",
      ocean: "linear-gradient(135deg, hsl(199 89% 48%), hsl(172 66% 50%))",
      forest: "linear-gradient(135deg, hsl(142 71% 45%), hsl(172 66% 50%))",
      aurora: "linear-gradient(135deg, hsl(271 91% 65%), hsl(199 89% 48%))",
      fire: "linear-gradient(135deg, hsl(0 84% 60%), hsl(48 96% 53%))",
    },
    // Radial gradients
    radial: {
      glow: "radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent)",
      spotlight:
        "radial-gradient(ellipse at top, hsl(var(--background)), hsl(var(--muted)))",
      pulse:
        "radial-gradient(circle at center, hsl(var(--accent) / 0.3), transparent)",
    },
    // Mesh gradients (for backgrounds)
    mesh: {
      subtle: `
        radial-gradient(at 40% 20%, hsl(var(--primary) / 0.05) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsl(var(--secondary) / 0.05) 0px, transparent 50%),
        radial-gradient(at 10% 50%, hsl(var(--accent) / 0.05) 0px, transparent 50%)
      `,
      vibrant: `
        radial-gradient(at 40% 20%, hsl(271 91% 65% / 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsl(199 89% 48% / 0.1) 0px, transparent 50%),
        radial-gradient(at 10% 50%, hsl(142 71% 45% / 0.1) 0px, transparent 50%)
      `,
    },
  },
} as const;

// Type exports
export type ColorPrimitive = keyof typeof colors.primitive;
export type ColorSemantic = keyof typeof colors.semantic;
export type ColorBrand = keyof typeof colors.brand;
export type ColorStatus = keyof typeof colors.semantic.status;
export type ColorGradient = keyof typeof colors.gradients.linear;
