import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet, ShieldCheck, ChevronRight, Lock, Check, Zap, Coins, Gift, ArrowLeft } from "lucide-react";
import { commerce } from "@/lib/commerce";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · PATCH CLUB" }, { name: "description", content: "Checkout rápido e seguro." }] }),
  component: CheckoutPage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CheckoutPage() {
  const { totals, itemsDetailed, clear } = useCart();
  const nav = useNavigate();
  const [pay, setPay] = useState<"pix" | "card" | "wallet">("pix");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => { clear(); nav({ to: "/colecao" }); }, 1800);
  };

  if (done) {
    return (
      <GameLayout>
        <div className="grid min-h-[70vh] place-items-center px-6">
          <div className="rounded-xl border border-primary/60 bg-card/70 p-10 text-center shadow-neon">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></div>
            <h1 className="mt-4 font-display text-2xl font-black uppercase tracking-tight text-glow">PEDIDO CONFIRMADO!</h1>
            <p className="mt-2 font-tactical text-xs uppercase tracking-widest text-muted-foreground">+{totals.xpBonus} XP · +{totals.coinBonus} moedas</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (itemsDetailed.length === 0) {
    return (
      <GameLayout>
        <div className="px-6 py-20 text-center">
          <p className="font-display text-lg uppercase">Carrinho vazio.</p>
          <Link to="/colecoes" className="mt-4 inline-block text-primary underline">Voltar à loja</Link>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <PageHero kicker="CHECKOUT · PROTOCOLO SEGURO" title="FINALIZAR MISSÃO" sub="Checkout em 1 minuto · Compra 100% segura" />

      <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1fr_380px] md:px-6">
        <div className="space-y-5">
          {/* contact */}
          <section className="rounded-xl border bg-card/60 p-5">
            <h2 className="mb-3 font-display text-sm font-black uppercase tracking-widest text-primary">1 · CONTATO</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input required placeholder="E-mail" type="email" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input required placeholder="Celular (WhatsApp)" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </section>

          <section className="rounded-xl border bg-card/60 p-5">
            <h2 className="mb-3 font-display text-sm font-black uppercase tracking-widest text-primary">2 · ENTREGA</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input required placeholder="Nome completo" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
              <input required placeholder="CEP" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input required placeholder="Cidade · UF" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input required placeholder="Endereço" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
              <input placeholder="Número" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input placeholder="Complemento" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </section>

          <section className="rounded-xl border bg-card/60 p-5">
            <h2 className="mb-3 font-display text-sm font-black uppercase tracking-widest text-primary">3 · PAGAMENTO</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {([
                { id: "pix", label: "PIX", desc: "5% OFF · aprovação na hora", Icon: Smartphone },
                { id: "card", label: "CARTÃO", desc: "12x sem juros", Icon: CreditCard },
                { id: "wallet", label: "CARTEIRA", desc: "Apple/Google Pay", Icon: Wallet },
              ] as const).map(o => (
                <button type="button" key={o.id} onClick={() => setPay(o.id)}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${pay === o.id ? "border-primary bg-primary/10 shadow-neon" : "border-border bg-background/40 hover:border-primary/50"}`}>
                  <o.Icon className={`h-5 w-5 ${pay === o.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className={`font-display text-sm font-black uppercase ${pay === o.id ? "text-primary" : ""}`}>{o.label}</p>
                    <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">{o.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input required placeholder="Número do cartão" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary md:col-span-2" />
                <input required placeholder="Validade MM/AA" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
                <input required placeholder="CVV" className="rounded-md border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
            )}
            <p className="mt-3 inline-flex items-center gap-1.5 font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-primary" /> Conexão criptografada · SSL 256
            </p>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-3 rounded-xl border border-primary/40 bg-card/70 p-5 md:sticky md:top-20">
          <h2 className="font-display text-sm font-black uppercase tracking-widest text-primary">RESUMO DO PEDIDO</h2>
          <ul className="max-h-48 space-y-2 overflow-y-auto border-y border-border/60 py-3 font-tactical text-xs">
            {itemsDetailed.map(it => (
              <li key={`${it.productId}-${it.variant}`} className="flex justify-between gap-2">
                <span className="truncate">{it.qty}× {it.product.flag} {it.product.name}</span>
                <span>R$ {fmt(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R$ {fmt(totals.subtotal)}</span></div>
            {totals.discount > 0 && <div className="flex justify-between text-primary"><span>Desconto 2 leve 3</span><span>− R$ {fmt(totals.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="text-primary">GRÁTIS</span></div>
          </div>
          <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
            <span className="font-display text-sm font-black uppercase">TOTAL</span>
            <span className="font-display text-3xl font-black text-primary text-glow">R$ {fmt(totals.total)}</span>
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground shadow-neon transition hover:scale-[1.02]">
            FINALIZAR PAGAMENTO <ChevronRight className="h-4 w-4" />
          </button>
          <p className="inline-flex w-full items-center justify-center gap-1 font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra protegida
          </p>
        </aside>
      </form>
    </GameLayout>
  );
}
