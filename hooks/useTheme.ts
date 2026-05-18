"use client";

import { useLayoutEffect, useState } from "react";
import { applyThemeClass, THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

export type { ThemeMode } from "@/lib/theme";

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useLayoutEffect(() => {
    setTheme("light");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    applyThemeClass("light");
  }, []);

  const setMode = (_mode: ThemeMode) => {
    setTheme("light");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    applyThemeClass("light");
  };

  return {
    theme,
    setTheme: setMode,
  };
};
