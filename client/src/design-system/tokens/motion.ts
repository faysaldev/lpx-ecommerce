// Motion & Animation Design Tokens
// Based on Material Motion and modern animation principles

export const motion = {
  // ============================================
  // DURATION TOKENS
  // ============================================
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    moderate: "300ms",
    slow: "400ms",
    slower: "600ms",
    slowest: "900ms",

    // Semantic durations
    enter: "250ms",
    exit: "200ms",
    complex: "400ms",

    // Specific use cases
    ripple: "600ms",
    tooltip: "150ms",
    menu: "200ms",
    modal: "300ms",
    drawer: "350ms",
    page: "450ms",
  },

  // ============================================
  // EASING FUNCTIONS
  // ============================================
  easing: {
    // Standard easings
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",

    // Custom cubic-bezier easings
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)", // Material standard
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)", // Enter/appear
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)", // Exit/disappear
    sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)", // Quick actions

    // Spring-like easings
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    bounce: "cubic-bezier(0.87, -0.41, 0.19, 1.44)",

    // Smooth easings
    smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    smoothOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    smoothIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transition: {
    // Base transitions
    all: {
      property: "all",
      duration: "200ms",
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },

    // Common property transitions
    opacity: {
      property: "opacity",
      duration: "200ms",
      easing: "linear",
    },

    transform: {
      property: "transform",
      duration: "200ms",
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },

    colors: {
      property: "color, background-color, border-color, fill, stroke",
      duration: "200ms",
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },

    shadow: {
      property: "box-shadow, filter",
      duration: "200ms",
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },

    // Complex transitions
    smooth: {
      property: "all",
      duration: "300ms",
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },

    bounce: {
      property: "transform",
      duration: "400ms",
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },

    // Micro-interactions
    micro: {
      property: "transform, opacity",
      duration: "150ms",
      easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    },
  },

  // ============================================
  // KEYFRAME ANIMATIONS
  // ============================================
  keyframes: {
    // Fade animations
    fadeIn: {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },

    fadeOut: {
      from: { opacity: "1" },
      to: { opacity: "0" },
    },

    // Scale animations
    scaleIn: {
      from: { transform: "scale(0.9)", opacity: "0" },
      to: { transform: "scale(1)", opacity: "1" },
    },

    scaleOut: {
      from: { transform: "scale(1)", opacity: "1" },
      to: { transform: "scale(0.9)", opacity: "0" },
    },

    // Slide animations
    slideInUp: {
      from: { transform: "translateY(100%)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },

    slideInDown: {
      from: { transform: "translateY(-100%)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },

    slideInLeft: {
      from: { transform: "translateX(-100%)", opacity: "0" },
      to: { transform: "translateX(0)", opacity: "1" },
    },

    slideInRight: {
      from: { transform: "translateX(100%)", opacity: "0" },
      to: { transform: "translateX(0)", opacity: "1" },
    },

    // Rotate animations
    rotate: {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },

    // Pulse animation
    pulse: {
      "0%, 100%": { transform: "scale(1)", opacity: "1" },
      "50%": { transform: "scale(1.05)", opacity: "0.8" },
    },

    // Bounce animation
    bounce: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-20px)" },
    },

    // Shake animation
    shake: {
      "0%, 100%": { transform: "translateX(0)" },
      "25%": { transform: "translateX(-10px)" },
      "75%": { transform: "translateX(10px)" },
    },

    // Skeleton loading
    shimmer: {
      "0%": { backgroundPosition: "-1000px 0" },
      "100%": { backgroundPosition: "1000px 0" },
    },

    // Ripple effect
    ripple: {
      "0%": {
        transform: "scale(0)",
        opacity: "1",
      },
      "100%": {
        transform: "scale(4)",
        opacity: "0",
      },
    },

    // Spin/Loading
    spin: {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },

    // Float animation
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" },
    },
  },

  // ============================================
  // ANIMATION PRESETS
  // ============================================
  animations: {
    // Entrance animations
    fadeIn: "fadeIn 200ms ease-out",
    scaleIn: "scaleIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1)",
    slideInUp: "slideInUp 300ms cubic-bezier(0.0, 0.0, 0.2, 1)",
    slideInDown: "slideInDown 300ms cubic-bezier(0.0, 0.0, 0.2, 1)",
    slideInLeft: "slideInLeft 300ms cubic-bezier(0.0, 0.0, 0.2, 1)",
    slideInRight: "slideInRight 300ms cubic-bezier(0.0, 0.0, 0.2, 1)",

    // Exit animations
    fadeOut: "fadeOut 150ms ease-in",
    scaleOut: "scaleOut 150ms cubic-bezier(0.4, 0.0, 1, 1)",

    // Continuous animations
    spin: "spin 1s linear infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite",
    float: "float 3s ease-in-out infinite",
    shimmer: "shimmer 2s linear infinite",

    // Interaction animations
    shake: "shake 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    ripple: "ripple 600ms ease-out",
    rotate: "rotate 0.5s ease-in-out",
  },

  // ============================================
  // STAGGER DELAYS
  // ============================================
  stagger: {
    fast: "50ms",
    normal: "100ms",
    slow: "150ms",
    slower: "200ms",

    // Generate stagger delays for lists
    generateDelays: (count: number, delay = 100) => {
      return Array.from({ length: count }, (_, i) => ({
        delay: `${i * delay}ms`,
      }));
    },
  },

  // ============================================
  // SPRING CONFIGURATIONS
  // ============================================
  spring: {
    // Framer Motion style spring configs
    default: { type: "spring", stiffness: 100, damping: 10 },
    gentle: { type: "spring", stiffness: 50, damping: 20 },
    wobbly: { type: "spring", stiffness: 200, damping: 10 },
    stiff: { type: "spring", stiffness: 300, damping: 35 },
    slow: { type: "spring", stiffness: 40, damping: 60 },
  },

  // ============================================
  // GESTURE ANIMATIONS
  // ============================================
  gesture: {
    tap: {
      scale: 0.95,
      duration: "100ms",
      easing: "ease-out",
    },
    hover: {
      scale: 1.05,
      duration: "200ms",
      easing: "ease-out",
    },
    drag: {
      scale: 1.1,
      duration: "200ms",
      easing: "ease-out",
    },
  },
} as const;

// Type exports
export type Duration = keyof typeof motion.duration;
export type Easing = keyof typeof motion.easing;
export type Animation = keyof typeof motion.animations;
export type Keyframe = keyof typeof motion.keyframes;
export type Spring = keyof typeof motion.spring;
