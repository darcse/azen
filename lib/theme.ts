export type ThemeMode = "light" | "dark" | "auto";

export const THEME_STORAGE_KEY = "theme";

export const getSystemPrefersDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const readStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "auto";
  const v = localStorage.getItem(THEME_STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "auto") return v;
  return "auto";
};

export const applyThemeClass = (mode: ThemeMode) => {
  const shouldUseDark = mode === "dark" || (mode === "auto" && getSystemPrefersDark());
  document.documentElement.classList.toggle("dark", shouldUseDark);
};
