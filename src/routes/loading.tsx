import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/loading")({
  component: LoadingScreen,
});

const TIPS = [
  "DICA: Compre 2 e leve 3 — o item de menor valor sai grátis.",
  "PRO TIP: Camisas Lendárias dão +XP no seu perfil.",
  "FATO: Brasil 2002 é a camisa mais cobiçada do mundo.",
  "DICA: Cards Épicos e Lendários sobem seu nível mais rápido.",
  "AVISO: Drops da Copa 2026 são limitados.",
];

function LoadingScreen() {
  const nav = useNavigate();
  const [pct, setPct] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 2800;
    const t = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setPct(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => nav({ to: "/home" }), 350);
      }
    }, 60);
    const tipT = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 1100);
    return () => { clearInterval(t); clearInterval(tipT); };
  }, [nav]);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background">
      {/* PS2-like swirling background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.12_240/.6),oklch(0.06_0.01_260)_70%)]" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary/70 shadow-neon animate-scan" />

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <p className="font-tactical text-xs uppercase tracking-[0.4em] text-primary text-glow animate-flicker">
          INITIALIZING · PATCHCLUB.OS
        </p>

        <div className="mt-6 font-display text-4xl font-black uppercase tracking-tight md:text-5xl text-glow">
          PATCH <span className="text-primary">CLUB</span>
        </div>

        {/* spinning ball */}
        <div className="mx-auto mt-10 grid h-24 w-24 place-items-center">
          <div className="relative h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary shadow-neon" />
        </div>

        {/* progress bar */}
        <div className="mt-10">
          <div className="relative h-3 overflow-hidden rounded-sm border border-primary/40 bg-background/60">
            <div
              className="h-full bg-gradient-to-r from-[oklch(0.72_0.22_160)] via-primary to-[oklch(0.95_0.2_142)] shadow-neon"
              style={{ width: `${pct}%`, transition: "width 60ms linear" }}
            />
          </div>
          <div className="mt-2 flex justify-between font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>CARREGANDO ASSETS</span>
            <span className="text-primary">{Math.floor(pct)}%</span>
          </div>
        </div>

        <p className="mt-10 min-h-[2.5rem] font-tactical text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {TIPS[tipIdx]}
        </p>
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-center font-tactical text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
        Press start · do not turn off your console
      </p>
    </main>
  );
}
