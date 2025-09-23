// Main Design Tokens Export
// Central hub for all design system tokens

export * from "./borders";
export * from "./colors";
export * from "./effects";
export * from "./motion";
export * from "./spacing";
export * from "./typography";

import { borders } from "./borders";
// Re-export as unified tokens object
import { colors } from "./colors";
import { effects } from "./effects";
import { motion } from "./motion";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const tokens = {
  colors,
  typography,
  spacing,
  motion,
  effects,
  borders,

  // ============================================
  // Z-INDEX SYSTEM
  // ============================================
  zIndex: {
    auto: "auto",
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    // Component layers
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    commandPalette: 1090,
    max: 9999,
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "1920px",
    "4xl": "2560px",
  },

  // ============================================
  // ASPECT RATIOS
  // ============================================
  aspectRatio: {
    auto: "auto",
    square: "1 / 1",
    video: "16 / 9",
    ultrawide: "21 / 9",
    golden: "1.618 / 1",
    portrait: "3 / 4",
    landscape: "4 / 3",
    cinema: "2.39 / 1",
  },

  // ============================================
  // GRID SYSTEM
  // ============================================
  grid: {
    cols: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9",
      10: "10",
      11: "11",
      12: "12",
    },
    rows: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
    },
    gap: spacing.scale,
  },

  // ============================================
  // CURSORS
  // ============================================
  cursor: {
    auto: "auto",
    default: "default",
    pointer: "pointer",
    wait: "wait",
    text: "text",
    move: "move",
    help: "help",
    notAllowed: "not-allowed",
    none: "none",
    contextMenu: "context-menu",
    progress: "progress",
    cell: "cell",
    crosshair: "crosshair",
    verticalText: "vertical-text",
    alias: "alias",
    copy: "copy",
    noDrop: "no-drop",
    grab: "grab",
    grabbing: "grabbing",
    allScroll: "all-scroll",
    colResize: "col-resize",
    rowResize: "row-resize",
    nResize: "n-resize",
    eResize: "e-resize",
    sResize: "s-resize",
    wResize: "w-resize",
    neResize: "ne-resize",
    nwResize: "nw-resize",
    seResize: "se-resize",
    swResize: "sw-resize",
    ewResize: "ew-resize",
    nsResize: "ns-resize",
    neswResize: "nesw-resize",
    nwseResize: "nwse-resize",
    zoomIn: "zoom-in",
    zoomOut: "zoom-out",
  },
} as const;

// ============================================
// MEDIA QUERIES
// ============================================
export const media = {
  // Breakpoint queries
  xs: `@media (min-width: ${tokens.breakpoints.xs})`,
  sm: `@media (min-width: ${tokens.breakpoints.sm})`,
  md: `@media (min-width: ${tokens.breakpoints.md})`,
  lg: `@media (min-width: ${tokens.breakpoints.lg})`,
  xl: `@media (min-width: ${tokens.breakpoints.xl})`,
  "2xl": `@media (min-width: ${tokens.breakpoints["2xl"]})`,

  // Max width queries
  xsMax: `@media (max-width: ${tokens.breakpoints.xs})`,
  smMax: `@media (max-width: ${tokens.breakpoints.sm})`,
  mdMax: `@media (max-width: ${tokens.breakpoints.md})`,
  lgMax: `@media (max-width: ${tokens.breakpoints.lg})`,
  xlMax: `@media (max-width: ${tokens.breakpoints.xl})`,
  "2xlMax": `@media (max-width: ${tokens.breakpoints["2xl"]})`,

  // Range queries
  smOnly: `@media (min-width: ${tokens.breakpoints.sm}) and (max-width: ${tokens.breakpoints.md})`,
  mdOnly: `@media (min-width: ${tokens.breakpoints.md}) and (max-width: ${tokens.breakpoints.lg})`,
  lgOnly: `@media (min-width: ${tokens.breakpoints.lg}) and (max-width: ${tokens.breakpoints.xl})`,

  // Feature queries
  hover: "@media (hover: hover)",
  touch: "@media (hover: none) and (pointer: coarse)",
  prefersReducedMotion: "@media (prefers-reduced-motion: reduce)",
  prefersDark: "@media (prefers-color-scheme: dark)",
  prefersLight: "@media (prefers-color-scheme: light)",
  prefersHighContrast: "@media (prefers-contrast: high)",

  // Orientation
  portrait: "@media (orientation: portrait)",
  landscape: "@media (orientation: landscape)",

  // Print
  print: "@media print",
  screen: "@media screen",
};

// ============================================
// CSS CUSTOM PROPERTIES
// ============================================
export const cssVars = {
  // Generate CSS variables from tokens
  generate: () => {
    const vars: Record<string, string> = {};

    // Colors
    Object.entries(colors.primitive).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        vars[`--color-${colorName}-${shade}`] = value;
      });
    });

    // Spacing
    Object.entries(spacing.scale).forEach(([key, value]) => {
      vars[`--spacing-${key}`] = value;
    });

    // Typography
    Object.entries(typography.scale.body).forEach(([size, config]) => {
      vars[`--font-size-${size}`] = config.fontSize;
      vars[`--line-height-${size}`] = config.lineHeight;
    });

    // Shadows
    Object.entries(effects.shadows.elevation).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value;
    });

    // Border radius
    Object.entries(borders.radius).forEach(([key, value]) => {
      if (typeof value === "string") {
        vars[`--radius-${key}`] = value;
      }
    });

    // Motion
    Object.entries(motion.duration).forEach(([key, value]) => {
      vars[`--duration-${key}`] = value;
    });

    return vars;
  },
};

export default tokens;
