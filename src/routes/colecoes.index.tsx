import { createFileRoute, Link } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { CONTINENTS, PRODUCTS, legendaryProducts } from "@/data/products";
import { JerseyCard } from "@/components/game/JerseyCard";
import { ChevronRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/colecoes/")({
  head: () => ({
    meta: [{ title: "Coleções por Continente · PATCH CLUB" }, { name: "description", content: "Navegue pelas seleções da Copa 2026 organizadas por continente." }],
  }),
  component: ColecoesIndex,
});

function ColecoesIndex() {
  const legs = legendaryProducts();
  return (
    <GameLayout>
      <PageHero
        kicker="EXPLORAR · ROAD TO 2026"
        title="Selecione seu Continente"
        sub="Cada continente é um mapa. Cada camisa, uma missão. Escolha onde começar."
      />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONTINENTS.map(c => {
            const count = PRODUCTS.filter(p => p.continent === c.id && p.type === "current").length;
            return (
              <Link key={c.id} to="/colecoes/$continent" params={{ continent: c.id }}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-neon">
                <div className="absolute inset-0 bg-grid opacity-10 transition group-hover:opacity-25" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <span className="text-5xl">{c.emoji}</span>
                    <h3 className="mt-3 font-display text-xl font-black uppercase tracking-tight">{c.name}</h3>
                    <p className="mt-1 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">{c.desc}</p>
                    <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                      {count} SELEÇÕES
                    </p>
                  </div>
                  <ChevronRight className="h-8 w-8 text-primary opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--gold)]">RETRÔ</p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl text-glow-gold">
              <Trophy className="mr-2 inline h-6 w-6 text-[color:var(--gold)]" />ALA LENDÁRIA
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {legs.map(p => <JerseyCard key={p.id} p={p} />)}
        </div>
      </section>
    </GameLayout>
  );
}
