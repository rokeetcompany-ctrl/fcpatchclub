import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { GameLayout } from "@/components/game/Layout";
import { findProduct, RARITY_META, type Product, type Variant } from "@/data/products";
import { Jersey } from "@/components/game/Jersey";
import { JerseyLightbox } from "@/components/game/JerseyLightbox";
import { OvrMeter } from "@/components/game/OvrMeter";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Heart, ShoppingCart, Zap, Truck, ShieldCheck, Award, Tag,
  ChevronRight, Star, Sparkles, Shirt, Trophy, History, Flame, Expand,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

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

type FabricKey = "torcedor" | "jogador" | "retro";

const FABRICS: Record<FabricKey, { label: string; sub: string; surcharge: number }> = {
  torcedor: { label: "TORCEDOR · DRY-FIT", sub: "Tecido leve respirável", surcharge: 0 },
  jogador:  { label: "JOGADOR · PRO MATCH", sub: "Versão idêntica à de campo", surcharge: 80 },
  retro:    { label: "RETRÔ · ALGODÃO 1990", sub: "Reedição fiel ao original", surcharge: 0 },
};

function ProductPage() {
  const { product: p } = Route.useLoaderData() as { product: Product };
  const meta = RARITY_META[p.rarity];
  const nav = useNavigate();
  const { add } = useCart();
  const [variant, setVariant] = useState<Variant>(p.variants[0]);
  const [size, setSize] = useState<string>("M");
  const [fav, setFav] = useState(false);

  const isLegendary = p.type === "legendary";
  const fabricOptions: FabricKey[] = isLegendary ? ["retro"] : ["torcedor", "jogador"];
  const [fabric, setFabric] = useState<FabricKey>(fabricOptions[0]);

  const sizes = ["P", "M", "G", "GG", "XGG"];
  const finalPrice = p.price + (FABRICS[fabric]?.surcharge ?? 0);
  const installments = finalPrice / 12;

  // Gallery: 4 angles built from the Jersey component
  const gallery = useMemo(() => ([
    { key: "front", label: "FRENTE", number: p.year % 100, useVariant: variant },
    { key: "back",  label: "COSTAS", number: 10,           useVariant: variant },
    { key: "alt",   label: p.variants.length > 1 ? "II" : "DETALHE", number: p.year % 100, useVariant: (p.variants[1] ?? variant) },
    { key: "patch", label: "PATCH",  number: p.ovr,        useVariant: variant },
  ]), [p, variant]);
  const [shotIdx, setShotIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const shot = gallery[shotIdx];

  const handleAdd = (buyNow = false) => {
    add(p.id, variant, 1);
    toast.success(`${p.team} (${size} · ${variant === "home" ? "I" : "II"}) no carrinho!`);
    if (buyNow) nav({ to: "/carrinho" });
  };

  const reasons = isLegendary ? [
    { icon: History, title: "Pedaço da história",     text: `Reedição fiel da camisa ${p.year}. Cada detalhe inspirado no original.` },
    { icon: Trophy,  title: "Edição colecionador",     text: "Tiragem limitada, numerada e com selo de autenticidade Patch Club." },
    { icon: Shirt,   title: "Algodão premium",         text: "Toque vintage, costuras reforçadas e gola ribana fiel à era." },
    { icon: Award,   title: "100% original",           text: "Embalagem premium com card de coleção e card de raridade físico." },
  ] : [
    { icon: Flame,   title: "Drop oficial Copa 2026",  text: `Hype na medida certa: a camisa que ${p.team} vai vestir nos jogos.` },
    { icon: Shirt,   title: "Tecnologia Dry-Fit",      text: "Tecido respirável que suporta 90 minutos de vibração no estádio ou no sofá." },
    { icon: Trophy,  title: `OVR ${p.ovr} · ${meta.label}`, text: "Card raro no nosso sistema. Quanto maior o OVR, mais valor de coleção." },
    { icon: ShieldCheck, title: "Garantia 30 dias",    text: "Não amou? Devolução grátis. Pagamento 100% seguro e antifraude." },
  ];

  return (
    <GameLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Link to="/colecoes" className="mb-4 inline-flex items-center gap-1 font-tactical text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* GALLERY */}
          <div className="space-y-3">
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
              <div className="absolute bottom-3 left-3 z-10 rounded-md bg-background/60 px-2 py-1 font-tactical text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur">
                {shot.label}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                aria-label="Ampliar imagem"
                className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 rounded-md border border-primary/60 bg-background/70 px-2 py-1 font-tactical text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur transition hover:bg-primary/20"
              >
                <Expand className="h-3.5 w-3.5" /> Zoom
              </button>
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="Abrir galeria em tela cheia"
                className="relative block aspect-square w-full cursor-zoom-in"
              >
                <Jersey
                  key={shot.key + shot.useVariant}
                  primary={p.primary} secondary={p.secondary} accent={p.accent}
                  variant={shot.useVariant} number={shot.number}
                  className="absolute inset-0 m-auto h-[85%] w-auto animate-fade-in drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
                />
              </button>
            </div>

            <JerseyLightbox
              open={lightbox}
              shots={gallery}
              index={shotIdx}
              onIndexChange={setShotIdx}
              onClose={() => setLightbox(false)}
              primary={p.primary}
              secondary={p.secondary}
              accent={p.accent}
              rarityColor={meta.color}
              team={p.team}
            />

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((g, i) => (
                <button key={g.key} onClick={() => setShotIdx(i)}
                        className={`ps2-cursor relative aspect-square overflow-hidden rounded-lg border bg-card/60 transition ${i === shotIdx ? "border-primary shadow-neon" : "border-border hover:border-primary/50"}`}
                        data-active={i === shotIdx}
                        aria-label={`Ver ${g.label}`}>
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="relative grid h-full place-items-center">
                    <Jersey primary={p.primary} secondary={p.secondary} accent={p.accent}
                            variant={g.useVariant} number={g.number} className="h-3/4 w-auto" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-background/70 py-0.5 text-center font-tactical text-[8px] font-bold uppercase tracking-widest">
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <div className="flex items-center gap-2 font-tactical text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
              <span>{p.flag}</span><span>{p.team}</span><span className="text-primary">·</span><span>{isLegendary ? `RETRÔ ${p.year}` : "DROP COPA 2026"}</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-4xl">{p.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />)}
              <span className="font-tactical text-xs text-muted-foreground">(248 avaliações)</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{p.description}</p>

            {/* PRICE */}
            <div className="mt-6 rounded-xl border border-primary/30 bg-card/60 p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-black text-primary text-glow">R$ {fmt(finalPrice)}</span>
                <span className="font-tactical text-xs text-muted-foreground line-through">R$ {fmt(finalPrice * 1.45)}</span>
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

            {/* VARIANT */}
            {p.variants.length > 1 && (
              <div className="mt-6">
                <p className="mb-2 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground">Modelo</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["home", "away"] as Variant[]).map(v => {
                    const sel = variant === v;
                    return (
                      <button key={v} onClick={() => setVariant(v)}
                              className={`ps2-cursor group flex items-center gap-3 rounded-lg border p-3 text-left transition ${sel ? "border-primary bg-primary/10 shadow-neon" : "border-border bg-card/40 hover:border-primary/50"}`}
                              data-active={sel}>
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

            {/* FABRIC */}
            <div className="mt-5">
              <p className="mb-2 font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground">Tecido</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {fabricOptions.map(f => {
                  const cfg = FABRICS[f]; const sel = fabric === f;
                  return (
                    <button key={f} onClick={() => setFabric(f)}
                            className={`ps2-cursor flex items-center justify-between rounded-lg border p-3 text-left transition ${sel ? "border-primary bg-primary/10 shadow-neon" : "border-border bg-card/40 hover:border-primary/50"}`}
                            data-active={sel}>
                      <div>
                        <p className={`font-display text-xs font-black uppercase tracking-widest ${sel ? "text-primary" : ""}`}>{cfg.label}</p>
                        <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">{cfg.sub}</p>
                      </div>
                      <span className="font-display text-xs font-black text-primary">
                        {cfg.surcharge ? `+R$ ${fmt(cfg.surcharge)}` : "INCLUSO"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-tactical text-xs font-bold uppercase tracking-widest text-muted-foreground">Tamanho</p>
                <button className="font-tactical text-[10px] uppercase tracking-widest text-primary hover:underline">Guia de medidas</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                          className={`ps2-cursor min-w-[48px] rounded-md border px-4 py-2 font-display text-sm font-black transition ${size === s ? "border-primary bg-primary text-primary-foreground shadow-neon" : "border-border bg-card hover:border-primary/50"}`}
                          data-active={size === s}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* FORÇA DA CAMISA — anel + breakdown */}
            <div className="mt-6">
              <OvrMeter product={p} size="lg" />
            </div>

            {/* CTA — sticky on mobile */}
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

            <div className="mt-5 flex flex-wrap gap-3 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5 text-primary" /> 100% Original</span>
              <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Entrega 7-15 dias</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Garantia 30 dias</span>
            </div>
          </div>
        </div>

        {/* WHY THIS JERSEY */}
        <section className="mt-12 rounded-2xl border bg-card/40 p-6 backdrop-blur md:p-8"
                 style={{ borderColor: `${meta.color}33` }}>
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: meta.color }} />
            <h2 className="font-display text-xl font-black uppercase tracking-tight md:text-2xl">
              POR QUE ESSA CAMISA?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map(r => (
              <div key={r.title} className="flex gap-3 rounded-xl border border-border bg-background/40 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border"
                     style={{ borderColor: meta.color, color: meta.color, background: `${meta.color}15` }}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-black uppercase tracking-wide">{r.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => handleAdd(false)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon hover:scale-[1.01] sm:w-auto">
            <ShoppingCart className="h-4 w-4" /> ADICIONAR AO CARRINHO · R$ {fmt(finalPrice)}
          </button>
        </section>
      </div>
    </GameLayout>
  );
}
