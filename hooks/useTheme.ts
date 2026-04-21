"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "theme";

const getSystemPrefersDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyThemeClass = (mode: ThemeMode) => {
  const shouldUseDark = mode === "dark" || (mode === "auto" && getSystemPrefersDark());
  document.documentElement.classList.toggle("dark", shouldUseDark);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>("auto");

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

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
