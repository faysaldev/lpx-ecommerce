"use client";

import * as React from "react";
import { cssVars, tokens } from "../tokens";

// ============================================
// THEME CONTEXT & TYPES
// ============================================

export type ThemeMode = "light" | "dark" | "system";
export type ThemeAccent =
  | "blue"
  | "purple"
  | "green"
  | "red"
  | "orange"
  | "teal";
export type ThemeRadius = "none" | "sm" | "md" | "lg" | "xl";
export type ThemeFont = "default" | "serif" | "mono";

interface ThemeConfig {
  mode: ThemeMode;
  accent: ThemeAccent;
  radius: ThemeRadius;
  font: ThemeFont;
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlind: boolean;
}

interface ThemeContextValue {
  config: ThemeConfig;
  setConfig: (config: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
  applyTheme: (theme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  tokens: typeof tokens;
}

const defaultConfig: ThemeConfig = {
  mode: "system",
  accent: "blue",
  radius: "md",
  font: "default",
  reducedMotion: false,
  highContrast: false,
  colorBlind: false,
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

// ============================================
// THEME PROVIDER COMPONENT
// ============================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = {},
  storageKey = "lpx-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [config, setConfigState] = React.useState<ThemeConfig>({
    ...defaultConfig,
    ...defaultTheme,
  });

  const [mounted, setMounted] = React.useState(false);

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfigState((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        if (process.env.NODE_ENV !== "production")
          console.error("Failed to parse stored theme:", e);
      }
    }
    setMounted(true);
  }, [storageKey]);

  // Apply theme changes
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const {
      mode,
      accent,
      radius,
      font,
      reducedMotion,
      highContrast,
      colorBlind,
    } = config;

    // Handle color mode
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const resolvedMode = mode === "system" ? systemMode : mode;

    // Only update if the theme class needs to change
    const currentTheme = root.classList.contains("dark") ? "dark" : "light";
    if (currentTheme !== resolvedMode) {
      root.classList.remove("light", "dark");
      root.classList.add(resolvedMode);
    }

    // Apply accent color
    applyAccentColor(accent);

    // Apply border radius
    root.style.setProperty("--radius", getRadiusValue(radius));

    // Apply font
    applyFontFamily(font);

    // Apply accessibility settings
    root.classList.toggle("reduced-motion", reducedMotion);
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("color-blind", colorBlind);

    // Apply custom CSS variables from tokens
    if (typeof window !== "undefined") {
      const vars = cssVars.generate();
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(config));
  }, [config, mounted, storageKey]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem || config.mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [config.mode, enableSystem]);

  // Listen for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setConfigState((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    mediaQuery.addEventListener("change", handleChange);

    // Set initial value
    if (mediaQuery.matches) {
      setConfigState((prev) => ({ ...prev, reducedMotion: true }));
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setConfig = React.useCallback(
    (newConfig: Partial<ThemeConfig>) => {
      if (disableTransitionOnChange) {
        document.documentElement.classList.add("[&_*]:!transition-none");
        window.setTimeout(() => {
          document.documentElement.classList.remove("[&_*]:!transition-none");
        }, 0);
      }

      setConfigState((prev) => ({ ...prev, ...newConfig }));
    },
    [disableTransitionOnChange],
  );

  const toggleMode = React.useCallback(() => {
    const modes: ThemeMode[] = enableSystem
      ? ["light", "dark", "system"]
      : ["light", "dark"];
    const currentIndex = modes.indexOf(config.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setConfig({ mode: modes[nextIndex] });
  }, [config.mode, enableSystem, setConfig]);

  const applyTheme = React.useCallback(
    (theme: Partial<ThemeConfig>) => {
      setConfig(theme);
    },
    [setConfig],
  );

  const resetTheme = React.useCallback(() => {
    setConfig(defaultConfig);
    localStorage.removeItem(storageKey);
  }, [setConfig, storageKey]);

  const value = React.useMemo(
    () => ({
      config,
      setConfig,
      toggleMode,
      applyTheme,
      resetTheme,
      tokens,
    }),
    [config, setConfig, toggleMode, applyTheme, resetTheme],
  );

  // Always render children to preserve SSR content; theme applies on mount
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ============================================
// HOOK TO USE THEME
// ============================================

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function applyAccentColor(accent: ThemeAccent) {
  const root = document.documentElement;

  const accentColors: Record<
    ThemeAccent,
    { primary: string; primaryForeground: string }
  > = {
    blue: {
      primary: "232 64% 52%",
      primaryForeground: "0 0% 100%",
    },
    purple: {
      primary: "271 91% 65%",
      primaryForeground: "0 0% 100%",
    },
    green: {
      primary: "142 71% 45%",
      primaryForeground: "0 0% 100%",
    },
    red: {
      primary: "0 84% 60%",
      primaryForeground: "0 0% 100%",
    },
    orange: {
      primary: "38 92% 50%",
      primaryForeground: "0 0% 100%",
    },
    teal: {
      primary: "172 66% 50%",
      primaryForeground: "0 0% 100%",
    },
  };

  const colors = accentColors[accent];
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
}

function getRadiusValue(radius: ThemeRadius): string {
  const radiusValues: Record<ThemeRadius, string> = {
    none: "0px",
    sm: "0.25rem",
    md: "0.625rem",
    lg: "1rem",
    xl: "1.5rem",
  };

  return radiusValues[radius];
}

function applyFontFamily(font: ThemeFont) {
  const root = document.documentElement;

  const fontFamilies: Record<ThemeFont, string> = {
    default: "var(--font-geist-sans), system-ui, sans-serif",
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'var(--font-geist-mono), ui-monospace, "Cascadia Code", monospace',
  };

  root.style.setProperty("--font-family", fontFamilies[font]);
  root.style.fontFamily = fontFamilies[font];
}

// ============================================
// THEME PRESETS
// ============================================

export const themePresets = {
  default: defaultConfig,

  dark: {
    ...defaultConfig,
    mode: "dark" as ThemeMode,
  },

  light: {
    ...defaultConfig,
    mode: "light" as ThemeMode,
  },

  ocean: {
    mode: "dark" as ThemeMode,
    accent: "blue" as ThemeAccent,
    radius: "lg" as ThemeRadius,
    font: "default" as ThemeFont,
  },

  forest: {
    mode: "dark" as ThemeMode,
    accent: "green" as ThemeAccent,
    radius: "md" as ThemeRadius,
    font: "default" as ThemeFont,
  },

  sunset: {
    mode: "light" as ThemeMode,
    accent: "orange" as ThemeAccent,
    radius: "xl" as ThemeRadius,
    font: "default" as ThemeFont,
  },

  minimal: {
    mode: "light" as ThemeMode,
    accent: "blue" as ThemeAccent,
    radius: "none" as ThemeRadius,
    font: "default" as ThemeFont,
  },

  playful: {
    mode: "light" as ThemeMode,
    accent: "purple" as ThemeAccent,
    radius: "xl" as ThemeRadius,
    font: "default" as ThemeFont,
  },

  professional: {
    mode: "light" as ThemeMode,
    accent: "blue" as ThemeAccent,
    radius: "sm" as ThemeRadius,
    font: "serif" as ThemeFont,
  },

  developer: {
    mode: "dark" as ThemeMode,
    accent: "green" as ThemeAccent,
    radius: "md" as ThemeRadius,
    font: "mono" as ThemeFont,
  },

  accessible: {
    mode: "light" as ThemeMode,
    accent: "blue" as ThemeAccent,
    radius: "md" as ThemeRadius,
    font: "default" as ThemeFont,
    reducedMotion: true,
    highContrast: true,
    colorBlind: false,
  },
};
