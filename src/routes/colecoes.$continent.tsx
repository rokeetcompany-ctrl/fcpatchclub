import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { JerseyCard } from "@/components/game/JerseyCard";
import { CONTINENTS, productsByContinent, legendaryProducts, type Continent } from "@/data/products";
import { ArrowLeft } from "lucide-react";

const VALID = new Set<Continent>(["america-sul","europa","america-norte","asia","africa"]);

export const Route = createFileRoute("/colecoes/$continent")({
  loader: ({ params }) => {
    if (!VALID.has(params.continent as Continent)) throw notFound();
    return { continent: params.continent as Continent };
  },
  head: ({ params }) => {
    const c = CONTINENTS.find(x => x.id === params.continent);
    return {
      meta: [
        { title: `${c?.name ?? "Coleção"} · Camisas Copa 2026 · PATCH CLUB` },
        { name: "description", content: `Camisas oficiais e lendárias das seleções de ${c?.name}.` },
      ],
    };
  },
  notFoundComponent: () => (
    <GameLayout>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-black uppercase">Continente não encontrado</h1>
        <Link to="/colecoes" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    </GameLayout>
  ),
  errorComponent: ({ error }) => (
    <GameLayout>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    </GameLayout>
  ),
  component: ContinentPage,
});

function ContinentPage() {
  const { continent } = Route.useLoaderData();
  const meta = CONTINENTS.find(c => c.id === continent)!;
  const items = productsByContinent(continent);
  const legs = legendaryProducts().filter(p => p.continent === continent);

  return (
    <GameLayout>
      <PageHero
        kicker={`${meta.emoji}  ${meta.desc}`}
        title={meta.name}
        sub={`${items.length} seleções no drop oficial · ${legs.length} lendárias.`}
      />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Link to="/colecoes" className="mb-5 inline-flex items-center gap-1 font-tactical text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Continentes
        </Link>
        <h2 className="mb-4 font-display text-lg font-black uppercase tracking-tight">SELEÇÕES · COPA 2026</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(p => <JerseyCard key={p.id} p={p} />)}
        </div>

        {legs.length > 0 && (
          <>
            <h2 className="mb-4 mt-12 font-display text-lg font-black uppercase tracking-tight text-[color:var(--gold)] text-glow-gold">LENDÁRIAS DESSE CONTINENTE</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {legs.map(p => <JerseyCard key={p.id} p={p} />)}
            </div>
          </>
        )}
      </section>
    </GameLayout>
  );
}
