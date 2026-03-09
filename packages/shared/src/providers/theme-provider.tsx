"use client";

import { createContext, use, useCallback, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
}

interface ThemeMeta {
  isLoading: boolean;
}

interface ThemeContextValue {
  state: ThemeState;
  actions: ThemeActions;
  meta: ThemeMeta;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * ThemeProvider - Client Component
 * Manages theme state using React 19 patterns
 */
export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setIsLoading(true);
    setThemeState(newTheme);

    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }

    setIsLoading(false);
  }, []);

  const value: ThemeContextValue = {
    state: { theme },
    actions: { setTheme },
    meta: { isLoading },
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

/**
 * useTheme hook - uses React 19 use() API
 */
export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Re-export types for consumers
export type { Theme, ThemeContextValue };
