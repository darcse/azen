"use client";

import { useLayoutEffect } from "react";
import { applyThemeClass, readStoredTheme } from "@/lib/theme";

export const ThemeClassBridge = () => {
  useLayoutEffect(() => {
    applyThemeClass(readStoredTheme());
  }, []);

  return null;
};
