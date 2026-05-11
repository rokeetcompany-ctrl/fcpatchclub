import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Crosshair, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PATCH CLUB · Rumo à Copa 2026 — Vista Futebol. Colecione Histórias." },
      { name: "description", content: "Plataforma gamificada de camisas das seleções para a Copa 2026. Lendárias, Épicas, Ouro e Prata. Compre 2 e leve 3." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* hero background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Estádio iluminado para a Copa do Mundo 2026"
          className="h-full w-full object-cover opacity-60"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />
      </div>

      {/* top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/60 font-display text-sm font-black text-primary text-glow">PC</div>
          <div className="font-display text-base font-black tracking-tight md:text-lg">
            PATCH <span className="text-primary text-glow">CLUB</span>
          </div>
        </div>
        <p className="hidden font-tactical text-xs uppercase tracking-[0.4em] text-primary/80 md:block animate-flicker">
          • Rumo à Copa 2026 •
        </p>
        <Link to="/home" className="font-tactical text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Pular intro →
        </Link>
      </header>

      {/* hero content */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-8 text-center md:pt-20">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-neon" />
          <span className="font-tactical text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
            Edição Limitada · World Cup 2026
          </span>
        </div>

        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-glow md:text-8xl">
          PATCH <span className="text-primary">CLUB</span>
        </h1>

        <p className="mt-4 font-tactical text-base uppercase tracking-[0.5em] text-muted-foreground md:text-xl">
          Escolha · Jogue · Colecione
        </p>

        <p className="mt-6 max-w-2xl text-sm text-muted-foreground md:text-base">
          A plataforma gamificada para caçar camisas <span className="text-primary">Lendárias</span>,{" "}
          <span className="text-[color:var(--epic)]">Épicas</span>, <span className="text-[color:var(--gold)]">Ouro</span> e{" "}
          <span className="text-foreground">Prata</span> das seleções da Copa do Mundo. Dropshipping rápido, frete grátis,
          <span className="font-bold text-primary"> Compre 2 & Leve 3</span>.
        </p>

        {/* START button */}
        <Link
          to="/loading"
          className="group relative mt-10 inline-flex items-center gap-3 rounded-md border-2 border-primary bg-primary/15 px-10 py-5 font-display text-2xl font-black uppercase tracking-[0.25em] text-primary transition animate-pulse-neon hover:bg-primary/25 md:text-3xl"
        >
          <Play className="h-7 w-7 fill-current" />
          START
          <ChevronRight className="h-7 w-7" />
        </Link>

        <Link to="/colecoes" className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-foreground">
          <Crosshair className="h-4 w-4" /> Ver drops da Copa
        </Link>

        {/* features strip */}
        <div className="mt-14 grid w-full grid-cols-2 gap-3 md:mt-20 md:grid-cols-4">
          {[
            { k: "365", l: "DIAS · COPA" },
            { k: "12.5K+", l: "USUÁRIOS ON" },
            { k: "150+", l: "PAÍSES" },
            { k: "100%", l: "DROPS LIMITADOS" },
          ].map((s, i) => (
            <div key={i} className="rounded-md border border-border/60 bg-card/60 px-4 py-3 backdrop-blur clip-corner">
              <p className="font-display text-xl font-black text-primary text-glow md:text-2xl">{s.k}</p>
              <p className="font-tactical text-[10px] tracking-widest text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer note */}
      <footer className="relative z-10 mt-16 border-t border-border/60 py-6 text-center font-tactical text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 md:mt-24">
        VISTA FUTEBOL · COLECIONE HISTÓRIAS · ROAD TO 2026
      </footer>
    </main>
  );
}
