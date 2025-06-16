import React, { createContext, useContext, useEffect } from "react";

import { useLocalStorage } from "@/hooks";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "dark");

  // Get the actual theme (resolve system preference)
  const getActualTheme = (): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  const [actualTheme, setActualTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return getActualTheme();
    }
    return "dark";
  });

  useEffect(() => {
    const updateActualTheme = () => {
      const newActualTheme = getActualTheme();
      setActualTheme(newActualTheme);

      // Update document class for Tailwind
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newActualTheme);

      // Update CSS custom properties for advanced theming
      const root = document.documentElement;

      if (newActualTheme === "dark") {
        root.style.setProperty("--color-primary", "255 255 255");
        root.style.setProperty("--color-secondary", "0 0 0");
        root.style.setProperty("--color-background", "10 10 10");
        root.style.setProperty("--color-surface", "24 24 27");
      } else {
        root.style.setProperty("--color-primary", "0 0 0");
        root.style.setProperty("--color-secondary", "255 255 255");
        root.style.setProperty("--color-background", "255 255 255");
        root.style.setProperty("--color-surface", "249 250 251");
      }
    };

    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
