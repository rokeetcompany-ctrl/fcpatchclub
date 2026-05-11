import { Link } from "@tanstack/react-router";
import { Jersey } from "./Jersey";
import { RARITY_META, type Product } from "@/data/products";

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function JerseyCard({ p }: { p: Product }) {
  const meta = RARITY_META[p.rarity];
  const isLeg = p.type === "legendary";
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: p.slug }}
      className={`group relative block overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur transition-all hover:-translate-y-1 hover:border-[color:${meta.color}] ${meta.glow}`}
      style={{ boxShadow: `inset 0 0 0 1px ${meta.color}33` }}
    >
      {/* OVR badge */}
      <div className="absolute left-2 top-2 z-10 rounded-md border px-2 py-1 font-display text-xs font-black"
           style={{ borderColor: meta.color, color: meta.color, background: "rgba(0,0,0,0.55)" }}>
        {p.ovr} OVR
      </div>
      {/* rarity tag */}
      <div className="absolute right-2 top-2 z-10 rounded-md px-2 py-1 font-tactical text-[10px] font-bold tracking-widest"
           style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}>
        {meta.label}
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-background/40 to-background">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Jersey
            primary={p.primary}
            secondary={p.secondary}
            accent={p.accent}
            variant="home"
            number={p.year % 100}
            className="h-[90%] w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="space-y-1 px-3 pb-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider">
            <span className="mr-1">{p.flag}</span>{p.team}
          </h3>
          {isLeg && (
            <span className="font-tactical text-[10px] tracking-widest text-[color:var(--gold)]">RETRÔ {p.year}</span>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="font-display text-base font-black text-primary text-glow">R$ {fmt(p.price)}</p>
          <span className="font-tactical text-[10px] text-muted-foreground">12x s/ juros</span>
        </div>
      </div>
    </Link>
  );
}
