"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { applyThemeClass, readStoredTheme, THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

export type { ThemeMode } from "@/lib/theme";

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>("auto");

  useLayoutEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => applyThemeClass("auto");

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  const setMode = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyThemeClass(mode);
  };

  return {
    theme,
    setTheme: setMode,
  };
};
