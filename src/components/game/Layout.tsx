import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Library, Package, ShoppingCart, Trophy } from "lucide-react";
import { useCart } from "@/lib/cart";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import type { ReactNode } from "react";

const NAV = [
  { to: "/home" as const, label: "INÍCIO",   icon: Home },
  { to: "/colecoes" as const, label: "EXPLORAR", icon: Compass },
  { to: "/colecao" as const, label: "PEDIDOS", icon: Library },
  { to: "/box" as const, label: "BOX",      icon: Package },
  { to: "/carrinho" as const, label: "CARRINHO", icon: ShoppingCart },
];

export function GameLayout({ children }: { children: ReactNode }) {
  const { totals } = useCart();
  const loc = useLocation();
  return (
    <div className="relative min-h-screen pb-24 md:pb-0 md:pt-[68px]">
      {/* desktop top nav */}
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-border/60 bg-background/80 backdrop-blur md:block">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
          <Link to="/home" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/60 font-display text-sm font-black text-primary text-glow">PC</div>
            <div className="font-display text-lg font-black tracking-tight">
              PATCH <span className="text-primary text-glow">CLUB</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 font-tactical text-sm font-semibold uppercase tracking-widest">
            {NAV.slice(0, 4).map(n => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to}
                      className={`relative transition-colors ${active ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground"}`}>
                  {n.label}
                  {active && <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary shadow-neon" />}
                </Link>
              );
            })}
            <Link to="/missoes" className={`transition-colors ${loc.pathname.startsWith("/missoes") ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground"}`}>
              MISSÕES
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/carrinho" className="relative flex items-center gap-2 rounded-md border border-primary/60 bg-primary/10 px-4 py-2 font-tactical text-xs font-bold uppercase tracking-widest text-primary transition hover:bg-primary/20">
              <ShoppingCart className="h-4 w-4" />
              CARRINHO
              {totals.units > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground">{totals.units}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* mobile theme toggle (floating) */}
      <div className="fixed right-3 top-3 z-40 md:hidden">
        <ThemeToggle />
      </div>

      {children}

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map(n => {
            const active = loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <li key={n.to}>
                <Link to={n.to}
                      className={`relative flex flex-col items-center gap-1 py-2.5 font-tactical text-[10px] font-bold tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                  <span>{n.label}</span>
                  {n.to === "/carrinho" && totals.units > 0 && (
                    <span className="absolute right-3 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground">{totals.units}</span>
                  )}
                  {active && <span className="absolute inset-x-6 top-0 h-0.5 bg-primary shadow-neon" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHero({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border/60 bg-grid">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.18_0.06_240/.8),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        {kicker && <p className="mb-2 font-tactical text-xs font-bold uppercase tracking-[0.4em] text-primary text-glow">{kicker}</p>}
        <h1 className="font-display text-3xl font-black uppercase tracking-tight md:text-5xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{sub}</p>}
      </div>
    </div>
  );
}

export { Trophy };
