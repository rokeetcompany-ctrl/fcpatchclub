import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { GameLayout } from "@/components/game/Layout";
import { findProduct, RARITY_META, type Variant } from "@/data/products";
import { Jersey } from "@/components/game/Jersey";
import { useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Zap, Truck, ShieldCheck, Award, Tag, ChevronRight, Star } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ params }) => {
    const p = findProduct(params.slug);
    return {
      meta: [
        { title: `${p?.name ?? "Camisa"} · PATCH CLUB` },
        { name: "description", content: p?.description ?? "Camisa oficial das seleções." },
        { property: "og:title", content: `${p?.name} · PATCH CLUB` },
        { property: "og:description", content: p?.description ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <GameLayout>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-black uppercase">Produto não encontrado</h1>
        <Link to="/colecoes" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    </GameLayout>
  ),
  errorComponent: ({ error }) => (
    <GameLayout><div className="p-12 text-center text-destructive">{error.message}</div></GameLayout>
  ),
  component: ProductPage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-tactical text-[10px] tracking-widest text-muted-foreground">{label}</span>
        <span className="font-display text-sm font-black text-primary">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-to-r from-primary to-[oklch(0.95_0.2_142)] shadow-neon" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const meta = RARITY_META[p.rarity];
  const nav = useNavigate();
  const { add } = useCart();
  const [variant, setVariant] = useState<Variant>(p.variants[0]);
  const [size, setSize] = useState<string>("M");
  const [fav, setFav] = useState(false);
  const sizes = ["P", "M", "G", "GG", "XGG"];
  const installments = (p.price / 12);

  const handleAdd = (buyNow = false) => {
    add(p.id, variant, 1);
    if (buyNow) nav({ to: "/carrinho" });
  };

  return (
    <GameLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Link to="/colecoes" className="mb-4 inline-flex items-center gap-1 font-tactical text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image / Card */}
          <div className="relative overflow-hidden rounded-2xl border bg-card/70 backdrop-blur"
               style={{ boxShadow: `inset 0 0 0 1px ${meta.color}55, 0 0 50px ${meta.color}25` }}>
            <div className="absolute inset-0 bg-grid opacity-15" />
            <div className="absolute left-3 top-3 z-10 rounded-md border px-2 py-1 font-display text-xs font-black"
                 style={{ borderColor: meta.color, color: meta.color, background: "rgba(0,0,0,0.55)" }}>
              {p.ovr} OVR
            </div>
            <div className="absolute right-3 top-3 z-10 rounded-md px-2 py-1 font-tactical text-[10px] font-bold tracking-widest"
                 style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}>
              {meta.label}
            </div>
            <div className="relative aspect-square">
              <Jersey primary={p.primary} secondary={p.secondary} accent={p.accent} variant={variant} number={p.year % 100}
                      className="absolute inset-0 m-auto h-[85%] w-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 font-tactical text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
              <span>{p.flag}</span><span>{p.team}</span><span className="text-primary">·</span><span>{p.type === "legendary" ? `RETRÔ ${p.year}` : "DROP COPA 2026"}</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-4xl">{p.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />)}
              <span className="font-tactical text-xs text-muted-foreground">(248 avaliações)</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{p.description}</p>

            {/* Price block */}
            <div className="mt-6 rounded-xl border border-primary/30 bg-card/60 p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-black text-primary text-glow">R$ {fmt(p.price)}</span>
                <span className="font-tactical text-xs text-muted-foreground line-through">R$ {fmt(p.price * 1.45)}</span>
                <span className="rounded-md bg-destructive/20 px-2 py-0.5 font-tactical text-[10px] font-black text-destructive">-31%</span>
              </div>
              <p className="mt-1 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">
                ou 12x de <span className="text-foreground font-bold">R$ {fmt(installments)}</span> sem juros
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
                <div className="flex items-center justify-center gap-1.5"><Truck className="h-4 w-4 text-primary" /><span className="font-tactical text-[10px] uppercase tracking-widest">FRETE GRÁTIS</span></div>
                <div className="flex items-center justify-center gap-1.5"><Tag className="h-4 w-4 text-primary" /><span className="font-tactical text-[10px] uppercase tracking-widest">2 LEVE 3</span></div>
                <div className="flex items-center justify-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /><span className="font-tactical text-[10px] uppercase tracking-widest">PAG. SEGURO</span></div>
              </div>
            </div>

            {/* Variant selector */}
            {p.variants.length > 1 && (
              <div className="mt-6">
                <p className="mb-2 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground">Modelo</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["home", "away"] as Variant[]).map(v => {
                    const sel = variant === v;
                    return (
                      <button key={v} onClick={() => setVariant(v)}
                              className={`group flex items-center gap-3 rounded-lg border p-3 text-left transition ${sel ? "border-primary bg-primary/10 shadow-neon" : "border-border bg-card/40 hover:border-primary/50"}`}>
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded bg-background/50">
                          <Jersey primary={p.primary} secondary={p.secondary} accent={p.accent} variant={v} number={p.year % 100} className="h-12 w-12" />
                        </div>
                        <div>
                          <p className={`font-display text-sm font-black uppercase ${sel ? "text-primary" : ""}`}>{v === "home" ? "CAMISA I · MANDANTE" : "CAMISA II · VISITANTE"}</p>
                          <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">Original · 2026</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mt-5">
              <p className="mb-2 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                          className={`min-w-[48px] rounded-md border px-4 py-2 font-display text-sm font-black ${size === s ? "border-primary bg-primary text-primary-foreground shadow-neon" : "border-border bg-card hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="mt-6 rounded-xl border bg-card/60 p-4" style={{ borderColor: `${meta.color}55` }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-sm font-black uppercase tracking-widest" style={{ color: meta.color }}>FORÇA DO CARD</p>
                <span className="font-display text-2xl font-black text-glow" style={{ color: meta.color }}>{p.ovr}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatBar label="ATA" value={p.attrs.ata} />
                <StatBar label="TÉC" value={p.attrs.tec} />
                <StatBar label="MÍST" value={p.attrs.mist} />
                <StatBar label="HIST" value={p.attrs.hist} />
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => handleAdd(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon transition hover:scale-[1.02]">
                <Zap className="h-4 w-4" /> COMPRAR AGORA <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => handleAdd(false)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md border border-primary/60 bg-primary/10 px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary hover:bg-primary/20">
                <ShoppingCart className="h-4 w-4" /> ADICIONAR
              </button>
              <button onClick={() => setFav(f => !f)} aria-label="Favoritar"
                      className={`grid h-[52px] w-[52px] place-items-center rounded-md border ${fav ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:text-foreground"}`}>
                <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Trust */}
            <div className="mt-5 flex flex-wrap gap-3 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5 text-primary" /> 100% Original</span>
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Entrega 7-15 dias</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Garantia 30 dias</span>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
