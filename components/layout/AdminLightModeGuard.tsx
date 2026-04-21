"use client";

import { useEffect } from "react";

export const AdminLightModeGuard = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");

    return () => {
      const mode = localStorage.getItem("theme") || "auto";
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = mode === "dark" || (mode === "auto" && prefersDark);
      root.classList.toggle("dark", isDark);
    };
  }, []);

  return null;
};
