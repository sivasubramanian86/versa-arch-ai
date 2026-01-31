"use client";

import { useThemeStore } from "@/store/theme-store";
import { useEffect } from "react";

export function ThemeEffect() {
    const { theme } = useThemeStore();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return null;
}
