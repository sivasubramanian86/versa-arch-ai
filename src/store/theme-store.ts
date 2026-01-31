import { create } from "zustand";

type Theme = "light" | "dark";

export const useThemeStore = create<{
    theme: Theme;
    toggle: () => void;
}>(set => ({
    theme: "dark",
    toggle: () =>
        set(state => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
