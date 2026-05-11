import { createFileRoute } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { useState } from "react";
import { Box, Sparkles, Zap } from "lucide-react";
import boxImg from "@/assets/mystery-box.png";

export const Route = createFileRoute("/box")({
  head: () => ({ meta: [{ title: "Box Surpresa · PATCH CLUB" }, { name: "description", content: "Abra boxes e descubra camisas raras." }] }),
  component: BoxPage,
});

const BOXES = [
  { id: "normal", name: "BOX NORMAL", price: 229, color: "var(--silver)", chances: { Prata: 60, Ouro: 35, Épico: 5, Lendário: 0 } },
  { id: "epico", name: "BOX ÉPICO", price: 299, color: "var(--epic)", chances: { Prata: 20, Ouro: 50, Épico: 25, Lendário: 5 } },
  { id: "lendario", name: "BOX LENDÁRIO", price: 349, color: "var(--gold)", chances: { Prata: 0, Ouro: 30, Épico: 50, Lendário: 20 } },
];

function BoxPage() {
  const [sel, setSel] = useState("epico");
  const box = BOXES.find(b => b.id === sel)!;
  return (
    <GameLayout>
      <PageHero kicker="LOOT BOX · ROAD TO 2026" title="BOX SURPRESA" sub="Compre uma box e receba uma camisa real entregue em casa. Quanto maior a box, maiores as chances de raridade." />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
          <div className="grid place-items-center">
            <img src={boxImg} alt="Box" className="h-64 w-auto animate-float-y drop-shadow-[0_0_60px_oklch(0.62_0.27_305_/_0.7)] md:h-80" />
          </div>
          <div className="space-y-3">
            {BOXES.map(b => (
              <button key={b.id} onClick={() => setSel(b.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 transition ${sel === b.id ? "shadow-neon" : "hover:border-primary/50"}`}
                      style={{ borderColor: sel === b.id ? `${b.color}` : undefined, background: sel === b.id ? `${b.color}11` : undefined }}>
                <div className="flex items-center gap-3 text-left">
                  <Box className="h-6 w-6" style={{ color: b.color }} />
                  <div>
                    <p className="font-display text-base font-black uppercase tracking-widest" style={{ color: b.color }}>{b.name}</p>
                    <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">Camisa real · Frete grátis</p>
                  </div>
                </div>
                <p className="font-display text-xl font-black" style={{ color: b.color }}>R$ {b.price.toFixed(2)}</p>
              </button>
            ))}

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <p className="mb-3 font-tactical text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CHANCES DE DROP · {box.name}</p>
              <div className="space-y-2">
                {Object.entries(box.chances).map(([k, v]) => (
                  <div key={k}>
                    <div className="mb-0.5 flex justify-between font-tactical text-[11px] uppercase tracking-widest">
                      <span>{k}</span><span className="text-foreground font-bold">{v}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary shadow-neon" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" /> ABRIR {box.name} <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </GameLayout>
  );
}
