import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
const KEY = "patchclub-theme";
const DEFAULT_THEME: Theme = "light";

const Ctx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
} | null>(null);

function readInitial(): Theme {
  if (typeof document !== "undefined") {
    // Inline script in __root.tsx already set the class before hydration.
    if (document.documentElement.classList.contains("dark")) return "dark";
    if (document.documentElement.classList.contains("light")) return "light";
    try {
      const s = window.localStorage.getItem(KEY);
      if (s === "dark" || s === "light") return s;
    } catch {}
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitial);
  const [userChose, setUserChose] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return !!window.localStorage.getItem(KEY); } catch { return false; }
  });

  // Apply theme class
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
    if (userChose) { try { window.localStorage.setItem(KEY, theme); } catch {} }
  }, [theme, userChose]);

  // Follow system preference until the user makes a choice
  useEffect(() => {
    if (typeof window === "undefined" || userChose) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [userChose]);

  const wrappedSet = (t: Theme) => { setUserChose(true); setTheme(t); };

  return (
    <Ctx.Provider value={{ theme, setTheme: wrappedSet, toggle: () => wrappedSet(theme === "dark" ? "light" : "dark") }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme outside provider");
  return v;
}
