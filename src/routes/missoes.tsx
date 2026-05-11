import { createFileRoute } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { Check, Zap, Coins, Trophy } from "lucide-react";

export const Route = createFileRoute("/missoes")({
  head: () => ({ meta: [{ title: "Missões · PATCH CLUB" }] }),
  component: Missions,
});

const M = [
  { t: "Login diário", p: "1/1", xp: 50, done: true },
  { t: "Colecione 3 camisas", p: "2/3", xp: 100, done: false },
  { t: "Abra 1 box", p: "0/1", xp: 75, done: false },
  { t: "Compre 1 lendária", p: "1/1", xp: 200, done: true },
  { t: "Convide 1 amigo", p: "0/1", xp: 150, done: false },
];

function Missions() {
  return (
    <GameLayout>
      <PageHero kicker="MISSÕES · GANHE RECOMPENSAS" title="QUEST LOG" sub="Complete missões diárias e ganhe XP, moedas e camisas grátis." />
      <section className="mx-auto max-w-3xl space-y-3 px-4 py-8 md:px-6">
        {M.map((m, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-xl border p-4 ${m.done ? "border-primary/60 bg-primary/5" : "bg-card/60"}`}>
            <div className={`grid h-10 w-10 place-items-center rounded-full ${m.done ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              {m.done ? <Check className="h-5 w-5" /> : <Trophy className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-black uppercase">{m.t}</p>
              <p className="font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">Progresso {m.p}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-display text-xs font-black text-primary"><Zap className="h-3 w-3" /> {m.xp} XP</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-2 py-1 font-display text-xs font-black text-[color:var(--gold)]"><Coins className="h-3 w-3" /> {m.xp / 2}</span>
            </div>
          </div>
        ))}
      </section>
    </GameLayout>
  );
}
