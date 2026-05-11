import { createFileRoute, Link } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { useCart } from "@/lib/cart";
import { Jersey } from "@/components/game/Jersey";
import { Minus, Plus, Trash2, ChevronRight, Gift, Coins, Zap, ShoppingBag } from "lucide-react";
import { RARITY_META } from "@/data/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho · PATCH CLUB" }, { name: "description", content: "Seu carrinho gamificado." }] }),
  component: CartPage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CartPage() {
  const { itemsDetailed, totals, setQty, remove } = useCart();
  const need = totals.units === 0 ? 3 : (3 - (totals.units % 3 || 3));
  const progress = totals.units === 0 ? 0 : ((totals.units % 3 || 3) / 3) * 100;

  return (
    <GameLayout>
      <PageHero kicker="MEU CARRINHO · CHECKOUT GAMIFICADO" title="MISSÃO · MONTAR ESQUADRÃO" sub="Compre 2 e leve 3. O item de menor valor sai grátis automaticamente." />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {itemsDetailed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-black uppercase">Seu carrinho está vazio</h2>
            <p className="mt-1 font-tactical text-xs uppercase tracking-widest text-muted-foreground">Comece sua coleção agora.</p>
            <Link to="/colecoes" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon">
              EXPLORAR DROPS <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_380px]">
            {/* Items */}
            <div className="space-y-3">
              {/* Progress bar to next free */}
              <div className="rounded-xl border border-primary/40 bg-card/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-sm font-black uppercase text-primary">
                    {need === 3 ? "Adicione 3 itens e ganhe 1 GRÁTIS" : need === 0 ? `🎁 ${totals.freeUnits} ITEM(NS) GRÁTIS DESBLOQUEADO!` : `Faltam ${need} item(ns) para o próximo grátis`}
                  </p>
                  <span className="font-tactical text-xs text-muted-foreground">{totals.units}/3</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-to-r from-primary to-[oklch(0.95_0.2_142)] shadow-neon transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {itemsDetailed.map(it => {
                const meta = RARITY_META[it.product.rarity];
                return (
                  <div key={`${it.productId}-${it.variant}`} className="flex gap-4 rounded-xl border bg-card/60 p-3 md:p-4" style={{ borderColor: `${meta.color}55` }}>
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-background/60">
                      <Jersey primary={it.product.primary} secondary={it.product.secondary} accent={it.product.accent} variant={it.variant} number={it.product.year % 100} className="h-full w-full p-1" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link to="/produto/$slug" params={{ slug: it.product.slug }} className="font-display text-sm font-black uppercase hover:text-primary md:text-base">
                          {it.product.flag} {it.product.name}
                        </Link>
                        <p className="font-tactical text-[10px] uppercase tracking-widest" style={{ color: meta.color }}>
                          {meta.label} · {it.variant === "home" ? "Mandante" : "Visitante"}
                        </p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1 rounded-md border border-border bg-background/40">
                          <button onClick={() => setQty(it.productId, it.variant, it.qty - 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-6 text-center font-display font-black">{it.qty}</span>
                          <button onClick={() => setQty(it.productId, it.variant, it.qty + 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-base font-black text-primary">R$ {fmt(it.lineTotal)}</p>
                          <button onClick={() => remove(it.productId, it.variant)} className="mt-0.5 inline-flex items-center gap-1 font-tactical text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" /> Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="h-fit space-y-3 rounded-xl border border-primary/40 bg-card/70 p-5 md:sticky md:top-20">
              <h2 className="font-display text-lg font-black uppercase tracking-tight">RESUMO DA MISSÃO</h2>
              <div className="space-y-1.5 border-y border-border/60 py-3 font-tactical text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({totals.units} item)</span><span>R$ {fmt(totals.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="text-primary">GRÁTIS</span></div>
                {totals.freeUnits > 0 && (
                  <div className="flex justify-between text-primary"><span className="inline-flex items-center gap-1"><Gift className="h-3.5 w-3.5" /> Desconto 2 leve 3</span><span>− R$ {fmt(totals.discount)}</span></div>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm font-black uppercase">TOTAL</span>
                <span className="font-display text-3xl font-black text-primary text-glow">R$ {fmt(totals.total)}</span>
              </div>
              <p className="font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">
                ou 12x de <span className="text-foreground font-bold">R$ {fmt(totals.total / 12)}</span>
              </p>

              {/* Bonus */}
              <div className="rounded-lg border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5 p-3">
                <p className="mb-2 font-tactical text-[10px] font-bold uppercase tracking-widest text-[color:var(--gold)]">BÔNUS DE MISSÃO</p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded border border-primary/40 bg-primary/10 py-2">
                    <Zap className="mx-auto h-4 w-4 text-primary" />
                    <p className="mt-1 font-display text-base font-black text-primary">+{totals.xpBonus}</p>
                    <p className="font-tactical text-[9px] tracking-widest text-muted-foreground">XP</p>
                  </div>
                  <div className="rounded border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 py-2">
                    <Coins className="mx-auto h-4 w-4 text-[color:var(--gold)]" />
                    <p className="mt-1 font-display text-base font-black text-[color:var(--gold)]">+{totals.coinBonus}</p>
                    <p className="font-tactical text-[9px] tracking-widest text-muted-foreground">MOEDAS</p>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon transition hover:scale-[1.02]">
                IR PARA PAGAMENTO <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/colecoes" className="block text-center font-tactical text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">← Continuar comprando</Link>
            </aside>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
