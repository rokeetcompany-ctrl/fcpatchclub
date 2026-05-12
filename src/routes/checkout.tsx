import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import {
  CreditCard, Smartphone, Wallet, ShieldCheck, ChevronRight, Lock, Check,
  Zap, Coins, Gift, ArrowLeft, Truck, BadgeCheck,
} from "lucide-react";
import { commerce } from "@/lib/commerce";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · PATCH CLUB" },
      { name: "description", content: "Checkout rápido, seguro e protegido. Frete grátis e Compre 2 Leve 3." },
    ],
  }),
  component: CheckoutPage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Wrapper que força tema claro independente da preferência do usuário. */
function LightShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link to="/carrinho" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao carrinho
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xs font-black">PC</div>
            <span className="font-display text-base font-black tracking-tight">PATCH <span className="text-primary">CLUB</span></span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground md:flex">
            <Lock className="h-4 w-4 text-primary" /> SSL 256 · Ambiente protegido
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-xs text-muted-foreground md:px-6">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra protegida</span>
          <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> 100% original</span>
          <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Frete grátis</span>
          <span>© Patch Club</span>
        </div>
      </footer>
    </div>
  );
}

function CheckoutPage() {
  const { totals, itemsDetailed, clear } = useCart();
  const nav = useNavigate();
  const [pay, setPay] = useState<"pix" | "card" | "wallet">("pix");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Plugar adapter (local agora, Shopify quando habilitado)
    const result = await commerce.createCheckout(itemsDetailed.map(i => ({
      productId: i.productId, variant: i.variant, qty: i.qty,
    })));
    if (result.external) {
      window.location.href = result.url;
      return;
    }
    setTimeout(() => { setDone(true); setLoading(false); }, 800);
    setTimeout(() => { clear(); nav({ to: "/colecao" }); }, 2800);
  };

  if (done) {
    return (
      <LightShell>
        <div className="grid min-h-[70vh] place-items-center px-6">
          <div className="rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black uppercase tracking-tight">Pedido confirmado!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Você receberá o código de rastreio em até 24h.</p>
            <div className="mt-5 flex justify-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Zap className="h-3.5 w-3.5" /> +{totals.xpBonus} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.62_0.16_85)]/10 px-3 py-1 text-xs font-bold text-[oklch(0.55_0.16_85)]">
                <Coins className="h-3.5 w-3.5" /> +{totals.coinBonus} moedas
              </span>
            </div>
          </div>
        </div>
      </LightShell>
    );
  }

  if (itemsDetailed.length === 0) {
    return (
      <LightShell>
        <div className="px-6 py-20 text-center">
          <p className="font-display text-lg uppercase">Carrinho vazio.</p>
          <Link to="/colecoes" className="mt-4 inline-block text-primary underline">Voltar à loja</Link>
        </div>
      </LightShell>
    );
  }

  return (
    <LightShell>
      {/* trust strip */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:px-6">
          <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-primary" /> Pagamento criptografado</span>
          <span className="inline-flex items-center gap-1"><Truck className="h-3 w-3 text-primary" /> Frete grátis</span>
          <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3 text-primary" /> 30 dias para devolver</span>
          <span className="inline-flex items-center gap-1"><Gift className="h-3 w-3 text-primary" /> 2 Leve 3 ativo</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight md:text-3xl">Finalizar compra</h1>
        <p className="mt-1 text-sm text-muted-foreground">Leva menos de 1 minuto. Sem cadastro obrigatório.</p>

        <form onSubmit={submit} className="mt-6 grid gap-6 md:grid-cols-[1fr_400px]">
          <div className="space-y-5">
            {/* contact */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">1 · Contato</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input required placeholder="E-mail" type="email" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <input required placeholder="Celular (WhatsApp)" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">2 · Entrega</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input required placeholder="Nome completo" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
                <input required placeholder="CEP" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                <input required placeholder="Cidade · UF" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                <input required placeholder="Endereço" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
                <input placeholder="Número" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                <input placeholder="Complemento" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">3 · Pagamento</h2>
              <div className="grid gap-2 md:grid-cols-3">
                {([
                  { id: "pix", label: "PIX", desc: "5% OFF · aprovação na hora", Icon: Smartphone },
                  { id: "card", label: "Cartão", desc: "12x sem juros", Icon: CreditCard },
                  { id: "wallet", label: "Carteira", desc: "Apple/Google Pay", Icon: Wallet },
                ] as const).map(o => (
                  <button type="button" key={o.id} onClick={() => setPay(o.id)}
                          className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${pay === o.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-background hover:border-primary/40"}`}>
                    <o.Icon className={`h-5 w-5 ${pay === o.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`font-display text-sm font-black uppercase ${pay === o.id ? "text-primary" : ""}`}>{o.label}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {pay === "card" && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input required placeholder="Número do cartão" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
                  <input required placeholder="Validade MM/AA" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  <input required placeholder="CVV" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
              )}
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" /> Conexão criptografada · SSL 256
              </p>
            </section>
          </div>

          {/* summary */}
          <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm md:sticky md:top-20">
            <h2 className="font-display text-sm font-black uppercase tracking-widest">Resumo do pedido</h2>
            <ul className="max-h-48 space-y-2 overflow-y-auto border-y border-border py-3 text-xs">
              {itemsDetailed.map(it => (
                <li key={`${it.productId}-${it.variant}`} className="flex justify-between gap-2">
                  <span className="truncate">{it.qty}× {it.product.flag} {it.product.name}</span>
                  <span className="font-semibold">R$ {fmt(it.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R$ {fmt(totals.subtotal)}</span></div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span className="inline-flex items-center gap-1"><Gift className="h-3.5 w-3.5" /> 2 Leve 3</span>
                  <span>− R$ {fmt(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="font-semibold text-primary">GRÁTIS</span></div>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <span className="font-display text-sm font-black uppercase">Total</span>
              <span className="font-display text-3xl font-black text-primary">R$ {fmt(totals.total)}</span>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              ou 12x de <span className="font-bold text-foreground">R$ {fmt(totals.total / 12)}</span> sem juros
            </p>

            {/* gamification rewards */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Recompensas desta missão</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border border-primary/30 bg-background p-2 text-center">
                  <Zap className="mx-auto h-4 w-4 text-primary" />
                  <p className="mt-0.5 font-display text-base font-black text-primary">+{totals.xpBonus}</p>
                  <p className="text-[9px] tracking-widest text-muted-foreground">XP</p>
                </div>
                <div className="rounded border border-[oklch(0.62_0.16_85)]/30 bg-background p-2 text-center">
                  <Coins className="mx-auto h-4 w-4 text-[oklch(0.55_0.16_85)]" />
                  <p className="mt-0.5 font-display text-base font-black text-[oklch(0.55_0.16_85)]">+{totals.coinBonus}</p>
                  <p className="text-[9px] tracking-widest text-muted-foreground">MOEDAS</p>
                </div>
              </div>
              {totals.freeUnits > 0 && (
                <p className="mt-2 text-center text-[11px] font-semibold text-primary">
                  🎁 {totals.freeUnits} item{totals.freeUnits > 1 ? "s" : ""} grátis aplicado
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-[0_8px_24px_oklch(0.55_0.18_142/0.35)] transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "PROCESSANDO…" : <>FINALIZAR PAGAMENTO <ChevronRight className="h-4 w-4" /></>}
            </button>
            <p className="inline-flex w-full items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra protegida pelo Patch Club
            </p>
          </aside>
        </form>
      </div>
    </LightShell>
  );
}
