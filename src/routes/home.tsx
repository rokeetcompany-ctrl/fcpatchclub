import { createFileRoute, Link } from "@tanstack/react-router";
import { GameLayout } from "@/components/game/Layout";
import { JerseyCard } from "@/components/game/JerseyCard";
import { CONTINENTS, PRODUCTS, legendaryProducts } from "@/data/products";
import { Box, Compass, Flame, Sparkles, Target, Trophy, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";
import boxImg from "@/assets/mystery-box.png";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Home · PATCH CLUB" }, { name: "description", content: "Hub gamificado da Copa 2026: drops, missões, lendárias e box surpresa." }],
  }),
  component: HomeHub,
});

function Countdown() {
  const target = new Date("2026-06-11T17:00:00Z").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, target - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center rounded-md border border-primary/40 bg-background/60 px-3 py-2 backdrop-blur min-w-[58px]">
      <span className="font-display text-2xl font-black text-primary text-glow md:text-3xl">{n.toString().padStart(2, "0")}</span>
      <span className="font-tactical text-[9px] tracking-widest text-muted-foreground">{l}</span>
    </div>
  );
  return <div className="flex gap-2">{cell(d, "DIAS")}{cell(h, "HRS")}{cell(m, "MIN")}{cell(s, "SEG")}</div>;
}

function HomeHub() {
  const tier1 = PRODUCTS.filter(p => p.type === "current").slice(0, 8);
  const legs = legendaryProducts().slice(0, 6);

  return (
    <GameLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1.3fr_1fr] md:items-center md:px-6 md:py-16">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="font-tactical text-[10px] font-bold uppercase tracking-[0.35em] text-primary">RUMO À COPA 2026</span>
            </div>
            <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
              VISTA <span className="text-primary text-glow">FUTEBOL</span>.<br />
              COLECIONE <span className="text-[color:var(--gold)] text-glow-gold">HISTÓRIAS</span>.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Camisas oficiais e lendárias entregues direto na sua casa. Compre 2 e leve 3 em todo o catálogo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/colecoes" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon hover:scale-[1.02] transition">
                <Target className="h-4 w-4" /> EXPLORAR DROPS <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/box" className="inline-flex items-center gap-2 rounded-md border border-[color:var(--epic)]/60 bg-[color:var(--epic)]/10 px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-[color:var(--epic)] hover:bg-[color:var(--epic)]/20">
                <Box className="h-4 w-4" /> BOX SURPRESA
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-card/70 p-5 backdrop-blur">
            <p className="font-tactical text-[10px] uppercase tracking-[0.4em] text-primary">CONTAGEM REGRESSIVA</p>
            <p className="mt-1 font-display text-xl font-black uppercase">Copa do Mundo 2026</p>
            <div className="mt-4"><Countdown /></div>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/50 pt-4 text-center">
              <div><p className="font-display text-base font-black text-primary">12</p><p className="font-tactical text-[9px] tracking-widest text-muted-foreground">SEU NÍVEL</p></div>
              <div><p className="font-display text-base font-black text-[color:var(--gold)]">2.450</p><p className="font-tactical text-[9px] tracking-widest text-muted-foreground">XP</p></div>
              <div><p className="font-display text-base font-black text-[color:var(--cyan)]">3.000</p><p className="font-tactical text-[9px] tracking-widest text-muted-foreground">PRÓX. NÍVEL</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINENTS */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">EXPLORAR</p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl">SELEÇÕES POR CONTINENTE</h2>
          </div>
          <Link to="/colecoes" className="hidden items-center gap-1 font-tactical text-xs font-bold uppercase tracking-widest text-primary hover:underline md:inline-flex">
            VER TUDO <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {CONTINENTS.map(c => (
            <Link key={c.id} to="/colecoes/$continent" params={{ continent: c.id }}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-neon">
              <div className="absolute inset-0 bg-grid opacity-10 transition group-hover:opacity-30" />
              <div className="relative">
                <span className="text-3xl">{c.emoji}</span>
                <p className="mt-2 font-display text-sm font-black uppercase tracking-wide">{c.name}</p>
                <p className="mt-0.5 font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TIER 1 — Hype Copa */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">DROP DA COPA</p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl">
              <Flame className="mr-2 inline h-6 w-6 text-primary" />HYPE COPA 2026
            </h2>
          </div>
          <Link to="/colecoes" className="font-tactical text-xs font-bold uppercase tracking-widest text-primary hover:underline">VER MAIS →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tier1.map(p => <JerseyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* TIER 2 — Lendárias */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--gold)]">RETRÔ COLECIONADOR</p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl text-glow-gold">
              <Trophy className="mr-2 inline h-6 w-6 text-[color:var(--gold)]" />CAMISAS LENDÁRIAS
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {legs.map(p => <JerseyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* PROMO BOX */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="relative overflow-hidden rounded-xl border border-[color:var(--epic)]/40 bg-gradient-to-r from-[color:var(--epic)]/15 via-background to-primary/10 p-6 md:p-10">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--epic)]">MODO COPA</p>
              <h3 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
                COMPRE 2 <span className="text-primary text-glow">LEVE 3</span>
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
                Promoção válida em todo o catálogo. O item de menor valor sai grátis automaticamente. Ainda ganhe <span className="text-primary font-bold">+150 XP</span> e <span className="text-[color:var(--gold)] font-bold">+100 moedas</span>.
              </p>
              <Link to="/colecoes" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon">
                ATIVAR DROP <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative grid place-items-center">
              <img src={boxImg} alt="Box surpresa" className="h-48 w-auto animate-float-y drop-shadow-[0_0_40px_oklch(0.62_0.27_305_/_0.6)] md:h-64" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </GameLayout>
  );
}
