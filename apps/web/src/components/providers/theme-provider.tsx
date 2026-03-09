"use client";

import { createContext, use, useCallback, useState } from "react";

interface ThemeContextValue {
  state: {
    theme: "light" | "dark" | "system";
  };
  actions: {
    setTheme: (theme: "light" | "dark" | "system") => void;
  };
  meta: {
    isLoading: boolean;
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider - Client Component
 * Manages theme state using React 19 patterns
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const [isLoading, setIsLoading] = useState(false);

  const setTheme = useCallback((newTheme: "light" | "dark" | "system") => {
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
export function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
