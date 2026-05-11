import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, X, ShoppingCart, RefreshCw } from "lucide-react";
import { Jersey } from "./Jersey";
import { PRODUCTS, RARITY_META, type Product, type Rarity } from "@/data/products";
import { playBoxOpen } from "@/lib/stadium-audio";
import boxImg from "@/assets/mystery-box.png";

interface Props {
  open: boolean;
  onClose: () => void;
  boxName: string;
  chances: Record<string, number>; // {Prata, Ouro, Épico, Lendário}
  onAddToCart?: (p: Product) => void;
}

const KEY_TO_RARITY: Record<string, Rarity> = {
  Prata: "prata", Ouro: "ouro", Épico: "epico", Lendário: "lendario",
};

function pickByChance(chances: Record<string, number>): Rarity {
  const r = Math.random() * 100;
  let acc = 0;
  for (const [k, v] of Object.entries(chances)) {
    acc += v;
    if (r <= acc) return KEY_TO_RARITY[k] ?? "ouro";
  }
  return "ouro";
}

export function BoxOpen({ open, onClose, boxName, chances, onAddToCart }: Props) {
  const [phase, setPhase] = useState<"idle" | "shaking" | "burst" | "reveal">("idle");
  const [prize, setPrize] = useState<Product | null>(null);
  const timers = useRef<number[]>([]);

  const confettiPieces = useMemo(() => Array.from({ length: 36 }).map((_, i) => ({
    id: i,
    tx: (Math.random() - 0.5) * 80,
    ty: (Math.random() - 0.8) * 60,
    delay: Math.random() * 0.3,
    color: ["var(--primary)", "var(--gold)", "var(--epic)", "var(--cyan)"][i % 4],
    size: 6 + Math.random() * 8,
  })), [open, prize?.id]);

  useEffect(() => {
    if (!open) return;
    // pick rarity then a random product of that rarity
    const rarity = pickByChance(chances);
    const pool = PRODUCTS.filter(p => p.rarity === rarity);
    const fallback = PRODUCTS.filter(p => p.rarity === "ouro");
    const picked = (pool.length ? pool : fallback)[Math.floor(Math.random() * Math.max(1, pool.length || fallback.length))];
    setPrize(picked);
    setPhase("shaking");
    playBoxOpen(rarity);

    timers.current.push(window.setTimeout(() => setPhase("burst"), 2000));
    timers.current.push(window.setTimeout(() => setPhase("reveal"), 2400));

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [open, chances]);

  if (!open) return null;
  const meta = prize ? RARITY_META[prize.rarity] : RARITY_META.ouro;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-md p-4 animate-fade-in"
         role="dialog" aria-modal="true" aria-label="Abertura de box">
      <button onClick={onClose} aria-label="Fechar"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-card/70 text-muted-foreground hover:text-foreground">
        <X className="h-5 w-5" />
      </button>

      {/* Light rays background — only when revealing */}
      {phase === "reveal" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[200vmax] w-[200vmax] -translate-x-1/2 -translate-y-1/2 animate-ray-spin opacity-40"
               style={{
                 background: `repeating-conic-gradient(from 0deg, ${meta.color}33 0deg 8deg, transparent 8deg 18deg)`,
               }} />
        </div>
      )}

      {/* Confetti */}
      {phase === "reveal" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2">
          {confettiPieces.map(p => (
            <span key={p.id}
                  className="absolute left-0 top-0 block animate-[confetti_1.6s_ease-out_forwards] rounded-sm"
                  style={{
                    width: p.size, height: p.size,
                    background: p.color,
                    boxShadow: `0 0 12px ${p.color}`,
                    ["--tx" as any]: `${p.tx}px`,
                    ["--ty" as any]: `${p.ty}px`,
                    animationDelay: `${p.delay}s`,
                  }} />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-md text-center">
        {(phase === "shaking" || phase === "burst") && (
          <div className="flex flex-col items-center gap-4">
            <p className="font-tactical text-[11px] font-bold uppercase tracking-[0.4em] text-primary text-glow animate-pulse">
              ABRINDO {boxName}
            </p>
            <div className={phase === "shaking" ? "animate-box-shake" : "scale-150 opacity-0 transition-all duration-300"}>
              <img src={boxImg} alt="Box" className="h-56 w-auto drop-shadow-[0_0_60px_oklch(0.62_0.27_305_/_0.7)]" />
            </div>
            <p className="font-tactical text-xs uppercase tracking-widest text-muted-foreground">
              {phase === "shaking" ? "Sorteando raridade…" : "REVELANDO!"}
            </p>
          </div>
        )}

        {phase === "reveal" && prize && (
          <div className="animate-box-burst flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                 style={{ borderColor: meta.color, background: `${meta.color}22`, color: meta.color }}>
              <Sparkles className="h-4 w-4" />
              <span className="font-tactical text-[11px] font-black uppercase tracking-[0.4em]">{meta.label}!</span>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl border bg-card/80 p-6 backdrop-blur"
                 style={{ borderColor: meta.color, boxShadow: `0 0 60px ${meta.color}55, inset 0 0 0 1px ${meta.color}55` }}>
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute right-3 top-3 z-10 rounded-md border px-2 py-1 font-display text-xs font-black"
                   style={{ borderColor: meta.color, color: meta.color, background: "rgba(0,0,0,0.55)" }}>
                {prize.ovr} OVR
              </div>
              <div className="relative grid place-items-center">
                <Jersey primary={prize.primary} secondary={prize.secondary} accent={prize.accent}
                        variant={prize.variants[0]} number={prize.year % 100}
                        className="h-56 w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]" />
              </div>
              <div className="relative mt-2 text-center">
                <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">VOCÊ GANHOU</p>
                <p className="font-display text-xl font-black uppercase tracking-tight">
                  <span className="mr-1">{prize.flag}</span>{prize.name}
                </p>
                <p className="mt-1 font-tactical text-xs uppercase tracking-widest text-primary">
                  +{prize.ovr * 5} XP · +{Math.round(prize.price / 4)} moedas
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2">
              <button onClick={() => { setPhase("shaking"); setTimeout(() => onAddToCart?.(prize), 0); }}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/60 bg-primary/10 px-4 py-3 font-display text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/20"
                      style={{ display: "none" }}>
                <ShoppingCart className="h-4 w-4" /> Pegar
              </button>
              <button onClick={() => { onAddToCart?.(prize); }}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-display text-xs font-black uppercase tracking-widest text-primary-foreground shadow-neon hover:scale-[1.02]">
                <ShoppingCart className="h-4 w-4" /> ADICIONAR
              </button>
              <Link to="/produto/$slug" params={{ slug: prize.slug }}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 font-display text-xs font-black uppercase tracking-widest hover:border-primary/50">
                VER CAMISA
              </Link>
            </div>
            <button onClick={() => { setPrize(null); setPhase("shaking"); /* re-trigger via parent? */ onClose(); }}
                    className="mt-1 inline-flex items-center gap-1 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary">
              <RefreshCw className="h-3 w-3" /> Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
