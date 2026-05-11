import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Play,
  Crosshair,
  ChevronRight,
  Box,
  Trophy,
  Target,
  Sparkles,
  Globe,
  Shield,
  Zap,
  Star,
  Flame,
  Gift,
  Volume2,
} from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";
import boxImg from "@/assets/mystery-box.png";
import { useEffect, useRef, useState } from "react";
import { playStadiumBoot } from "@/lib/stadium-audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PATCH CLUB · Rumo à Copa 2026 — Vista Futebol. Colecione Histórias." },
      {
        name: "description",
        content:
          "Plataforma gamificada de camisas das seleções para a Copa 2026. Lendárias, Épicas, Ouro e Prata. Compre 2 e leve 3.",
      },
      { property: "og:title", content: "PATCH CLUB · Rumo à Copa 2026" },
      {
        property: "og:description",
        content:
          "Vista futebol e colecione histórias. E-commerce gamificado com drops limitados, missões e box surpresa.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Box, title: "DROPS LIMITADOS", desc: "Coleções inéditas toda semana com unidades contadas." },
  { icon: Gift, title: "BOX SURPRESA", desc: "Abra boxes Básica, Premium ou Lendária e descubra tesouros." },
  { icon: Target, title: "MISSÕES DIÁRIAS", desc: "Cumpra desafios e ganhe XP, moedas e camisas exclusivas." },
  { icon: Trophy, title: "RANKING GLOBAL", desc: "Suba no ranking da comunidade e dispute prêmios reais." },
  { icon: Shield, title: "PAGAMENTO 100% SEGURO", desc: "PIX, cartão e carteiras digitais — checkout em 1 minuto." },
  { icon: Zap, title: "FRETE EXPRESS", desc: "Envio rápido para todo o Brasil. Frete grátis acima de R$ 299." },
];

const STEPS = [
  { n: "01", t: "ESCOLHA SUA SELEÇÃO", d: "Navegue por continentes e descubra camisas de todas as eras." },
  { n: "02", t: "ABRA BOXES & CACE LENDÁRIAS", d: "Drops Épicos, Ouro e Lendários esperam você." },
  { n: "03", t: "COLECIONE & SUBA DE NÍVEL", d: "Cada compra rende XP, conquistas e itens exclusivos." },
];

const TESTIMONIALS = [
  { n: "Lucas P.", role: "Colecionador · Nível 28", t: "A Brasil 2002 chegou impecável. App parece um jogo, viciei em abrir boxes." },
  { n: "Marina S.", role: "Torcedora · Nível 14", t: "Comprei 2 e levei 3 — recebi a Argentina 2022 grátis. Top demais." },
  { n: "Ricardo A.", role: "Vintage Hunter · Nível 35", t: "Achei a França 1998 que procurava há anos. Atendimento nota mil." },
];

const FAQ = [
  { q: "Como funciona a promoção Compre 2 Leve 3?", a: "Adicione 3 camisas ao carrinho — a de menor valor sai grátis automaticamente." },
  { q: "Quanto tempo leva pra chegar?", a: "Envio em até 48h e entrega de 3 a 7 dias úteis. Você acompanha tudo pelo app." },
  { q: "As camisas são oficiais?", a: "Sim. Trabalhamos apenas com produtos licenciados ou retrôs autorizados, com selo de autenticidade." },
  { q: "O que são as raridades?", a: "Lendária, Épica, Ouro e Prata. Cada raridade dá XP diferente e influencia seu ranking." },
];

function Landing() {
  const nav = useNavigate();
  const [audioReady, setAudioReady] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Pre-arm AudioContext on first interaction so the loading screen audio plays.
  useEffect(() => {
    const arm = () => {
      if (audioCtxRef.current) return;
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (AC) {
          audioCtxRef.current = new AC();
          audioCtxRef.current.resume?.();
          setAudioReady(true);
        }
      } catch {}
    };
    window.addEventListener("pointerdown", arm, { once: true });
    return () => window.removeEventListener("pointerdown", arm);
  }, []);

  const handleStart = () => {
    // Tiny click sound to confirm audio works, then navigate.
    try {
      playStadiumBoot(450);
    } catch {}
    setTimeout(() => nav({ to: "/loading" }), 120);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* HERO BACKGROUND */}
      <div className="absolute inset-0 h-[110vh]">
        <img
          src={heroImg}
          alt="Estádio iluminado para a Copa do Mundo 2026"
          className="h-full w-full object-cover opacity-55"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />
      </div>

      {/* TOP BAR */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/60 font-display text-sm font-black text-primary text-glow">
            PC
          </div>
          <div className="font-display text-base font-black tracking-tight md:text-lg">
            PATCH <span className="text-primary text-glow">CLUB</span>
          </div>
        </div>
        <p className="hidden font-tactical text-xs uppercase tracking-[0.4em] text-primary/80 md:block animate-flicker">
          • Rumo à Copa 2026 •
        </p>
        <Link
          to="/home"
          className="font-tactical text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Pular intro →
        </Link>
      </header>

      {/* HERO CONTENT */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-6 text-center md:pt-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-neon" />
          <span className="font-tactical text-[10px] font-bold uppercase tracking-[0.35em] text-primary md:text-[11px]">
            Edição Limitada · World Cup 2026
          </span>
        </div>

        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-glow md:text-8xl">
          PATCH <span className="text-primary">CLUB</span>
        </h1>

        <p className="mt-4 font-tactical text-sm uppercase tracking-[0.45em] text-muted-foreground md:text-xl md:tracking-[0.5em]">
          Escolha · Jogue · Colecione
        </p>

        <p className="mt-6 max-w-2xl text-sm text-muted-foreground md:text-base">
          A plataforma gamificada para caçar camisas{" "}
          <span className="text-primary">Lendárias</span>,{" "}
          <span className="text-[color:var(--epic)]">Épicas</span>,{" "}
          <span className="text-[color:var(--gold)]">Ouro</span> e{" "}
          <span className="text-foreground">Prata</span> das seleções da Copa do Mundo.
          Dropshipping rápido, frete grátis,
          <span className="font-bold text-primary"> Compre 2 & Leve 3</span>.
        </p>

        {/* START BUTTON — PS2 style */}
        <button
          onClick={handleStart}
          className="group relative mt-10 inline-flex items-center gap-3 rounded-md border-2 border-primary bg-primary/15 px-8 py-4 font-display text-xl font-black uppercase tracking-[0.25em] text-primary transition animate-pulse-neon hover:bg-primary/25 md:px-12 md:py-5 md:text-3xl"
        >
          <Play className="h-6 w-6 fill-current md:h-7 md:w-7" />
          START
          <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
        </button>

        <Link
          to="/colecoes"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-foreground"
        >
          <Crosshair className="h-4 w-4" /> Ver drops da Copa
        </Link>

        <p className="mt-3 inline-flex items-center gap-1.5 font-tactical text-[10px] uppercase tracking-widest text-muted-foreground/70">
          <Volume2 className="h-3 w-3" />
          {audioReady ? "Áudio ativado · som temático no loading" : "Toque na tela para ativar o som temático"}
        </p>

        {/* STATS STRIP */}
        <div className="mt-12 grid w-full grid-cols-2 gap-3 md:mt-16 md:grid-cols-4">
          {[
            { k: "365", l: "DIAS · COPA" },
            { k: "12.5K+", l: "USUÁRIOS ON" },
            { k: "150+", l: "PAÍSES" },
            { k: "100%", l: "DROPS LIMITADOS" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-md border border-border/60 bg-card/60 px-4 py-3 backdrop-blur clip-corner"
            >
              <p className="font-display text-xl font-black text-primary text-glow md:text-2xl">{s.k}</p>
              <p className="font-tactical text-[10px] tracking-widest text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="mb-8 text-center">
          <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary md:text-xs">
            POR QUE PATCH CLUB
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
            MUITO MAIS QUE UMA <span className="text-primary text-glow">LOJA</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            Uma experiência completa pra quem vive futebol. Compre, jogue, colecione e suba no ranking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-neon"
            >
              <div className="absolute inset-0 bg-grid opacity-10 transition group-hover:opacity-25" />
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-black uppercase tracking-wide">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary md:text-xs">
            COMO FUNCIONA
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
            EM 3 PASSOS <span className="text-primary text-glow">SIMPLES</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur"
            >
              <div className="absolute -right-4 -top-6 font-display text-7xl font-black text-primary/10">
                {s.n}
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
                  <span className="font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                    PASSO {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-black uppercase">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RARITIES */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="mb-8 text-center">
          <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--gold)] md:text-xs">
            SISTEMA DE RARIDADES
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
            CACE A SUA <span className="text-[color:var(--gold)] text-glow-gold">LENDÁRIA</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { n: "LENDÁRIA", color: "text-[color:var(--gold)]", border: "border-[color:var(--gold)]/40", desc: "Ícones eternos. +500 XP" },
            { n: "ÉPICA", color: "text-[color:var(--epic)]", border: "border-[color:var(--epic)]/40", desc: "Camisas marcantes. +250 XP" },
            { n: "OURO", color: "text-primary", border: "border-primary/40", desc: "Drops de elite. +120 XP" },
            { n: "PRATA", color: "text-[color:var(--silver)]", border: "border-[color:var(--silver)]/40", desc: "Essenciais do dia a dia. +50 XP" },
          ].map((r) => (
            <div key={r.n} className={`rounded-lg border ${r.border} bg-card/60 p-5 backdrop-blur`}>
              <div className="mb-3 flex items-center gap-2">
                <Star className={`h-4 w-4 ${r.color}`} />
                <span className={`font-display text-sm font-black uppercase tracking-widest ${r.color}`}>
                  {r.n}
                </span>
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BOX */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="relative overflow-hidden rounded-2xl border border-[color:var(--epic)]/40 bg-gradient-to-r from-[color:var(--epic)]/15 via-background to-primary/10 p-6 md:p-12">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--epic)] md:text-xs">
                MODO COPA
              </p>
              <h3 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-6xl">
                COMPRE 2 <span className="text-primary text-glow">LEVE 3</span>
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
                Promoção válida em todo o catálogo. O item de menor valor sai grátis automaticamente.
                Ainda ganhe <span className="text-primary font-bold">+150 XP</span> e{" "}
                <span className="text-[color:var(--gold)] font-bold">+100 moedas</span>.
              </p>
              <Link
                to="/colecoes"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon"
              >
                ATIVAR DROP <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative grid place-items-center">
              <img
                src={boxImg}
                alt="Box surpresa"
                className="h-44 w-auto animate-float-y drop-shadow-[0_0_40px_oklch(0.62_0.27_305_/_0.6)] md:h-72"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="mb-8 text-center">
          <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary md:text-xs">
            COMUNIDADE
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
            QUEM JÁ ENTROU <span className="text-primary text-glow">EM CAMPO</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.n} className="rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur">
              <div className="flex gap-0.5 text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">"{t.t}"</p>
              <div className="mt-4 border-t border-border/60 pt-3">
                <p className="font-display text-sm font-black uppercase">{t.n}</p>
                <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto mt-24 max-w-4xl px-5 md:mt-32">
        <div className="mb-8 text-center">
          <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary md:text-xs">
            FAQ
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
            DÚVIDAS <span className="text-primary text-glow">FREQUENTES</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur open:border-primary/40"
            >
              <summary className="flex cursor-pointer items-center justify-between font-display text-sm font-black uppercase tracking-wide md:text-base">
                {f.q}
                <ChevronRight className="h-5 w-5 text-primary transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 mx-auto mt-24 max-w-7xl px-5 md:mt-32">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/15 via-background to-background p-8 text-center md:p-16">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-20" />
          <div className="relative">
            <Flame className="mx-auto h-10 w-10 text-primary text-glow md:h-12 md:w-12" />
            <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight md:text-6xl text-glow">
              PRONTO PRA <span className="text-primary">ENTRAR EM CAMPO</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Aperte START e mergulhe no hub gamificado da Copa 2026. Som temático, drops limitados e a maior coleção de camisas do Brasil.
            </p>
            <button
              onClick={handleStart}
              className="mt-8 inline-flex items-center gap-3 rounded-md border-2 border-primary bg-primary/15 px-10 py-4 font-display text-xl font-black uppercase tracking-[0.25em] text-primary animate-pulse-neon hover:bg-primary/25 md:text-2xl"
            >
              <Play className="h-6 w-6 fill-current" />
              START
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-24 border-t border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/60 font-display text-sm font-black text-primary text-glow">
                  PC
                </div>
                <div className="font-display text-base font-black tracking-tight">
                  PATCH <span className="text-primary text-glow">CLUB</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Vista futebol. Colecione histórias. A loja gamificada da Copa 2026.
              </p>
            </div>
            <div>
              <p className="font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                EXPLORAR
              </p>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><Link to="/home" className="hover:text-foreground">Home</Link></li>
                <li><Link to="/colecoes" className="hover:text-foreground">Coleções</Link></li>
                <li><Link to="/box" className="hover:text-foreground">Box Surpresa</Link></li>
                <li><Link to="/missoes" className="hover:text-foreground">Missões</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                SUPORTE
              </p>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>Atendimento 24/7</li>
                <li>Política de Trocas</li>
                <li>Frete & Entregas</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
            <div>
              <p className="font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                COMUNIDADE
              </p>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li className="inline-flex items-center gap-1.5"><Globe className="h-3 w-3" /> 150+ países</li>
                <li className="inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> 12.540 jogadores online</li>
                <li className="inline-flex items-center gap-1.5"><Trophy className="h-3 w-3" /> 8.320 camisas coletadas</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/60 pt-5 text-center font-tactical text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
            © 2026 PATCH CLUB · VISTA FUTEBOL · COLECIONE HISTÓRIAS · ROAD TO 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
