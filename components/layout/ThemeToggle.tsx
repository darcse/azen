"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { type ThemeMode, useTheme } from "@/hooks/useTheme";

const ORDER: ThemeMode[] = ["light", "dark", "auto"];

const getNextMode = (current: ThemeMode): ThemeMode => {
  const index = ORDER.indexOf(current);
  return ORDER[(index + 1) % ORDER.length];
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const nextMode = getNextMode(theme);

  return (
    <button
      type="button"
      onClick={() => setTheme(nextMode)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-foreground transition-colors hover:bg-muted/60"
      aria-label={`테마 변경: 현재 ${theme}, 다음 ${nextMode}`}
      title={`현재 테마: ${theme}`}
    >
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "auto" && <Monitor className="h-4 w-4" />}
    </button>
  );
};
