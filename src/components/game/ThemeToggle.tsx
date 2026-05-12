import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={`group relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-card/60 px-1 transition hover:border-primary/60 ${className}`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-neon transition-transform duration-300 ${isDark ? "translate-x-0" : "translate-x-7"}`}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 font-tactical text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        <Moon className="h-3 w-3" />
        <Sun className="h-3 w-3" />
      </span>
    </button>
  );
}
