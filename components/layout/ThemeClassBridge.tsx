"use client";

import { useLayoutEffect } from "react";
import { applyThemeClass } from "@/lib/theme";

export const ThemeClassBridge = () => {
  useLayoutEffect(() => {
    applyThemeClass("light");
  }, []);

  return null;
};
