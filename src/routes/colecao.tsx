import { createFileRoute, Link } from "@tanstack/react-router";
import { GameLayout, PageHero } from "@/components/game/Layout";
import { Package, CheckCircle2, Truck, Clock } from "lucide-react";

export const Route = createFileRoute("/colecao")({
  head: () => ({ meta: [{ title: "Meus Pedidos · PATCH CLUB" }] }),
  component: Orders,
});

const ORDERS = [
  { id: "PC-2026-0042", date: "10/05/2026", total: 458.00, status: "Em trânsito", icon: Truck, items: ["Brasil 2026 · M", "Argentina 2026 · M"] },
  { id: "PC-2026-0033", date: "01/05/2026", total: 249.00, status: "Entregue", icon: CheckCircle2, items: ["Brasil 2002 Lendária · G"] },
  { id: "PC-2026-0019", date: "20/04/2026", total: 687.00, status: "Processando", icon: Clock, items: ["França 1998 · M", "Alemanha 2014 · G", "Box Épico"] },
];

function Orders() {
  return (
    <GameLayout>
      <PageHero kicker="MEUS PEDIDOS · INVENTÁRIO" title="MEUS PEDIDOS" sub="Acompanhe suas missões compradas e o status da entrega." />
      <section className="mx-auto max-w-5xl space-y-3 px-4 py-8 md:px-6">
        {ORDERS.map(o => (
          <div key={o.id} className="rounded-xl border bg-card/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">{o.id}</p>
                <p className="mt-1 font-display text-base font-black uppercase">Pedido de {o.date}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-tactical text-[10px] font-bold uppercase tracking-widest text-primary">
                <o.icon className="h-3.5 w-3.5" /> {o.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 font-tactical text-sm">
              {o.items.map(i => <li key={i} className="flex items-center gap-2 text-muted-foreground"><Package className="h-3.5 w-3.5" /> {i}</li>)}
            </ul>
            <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="font-tactical text-[11px] uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-display text-xl font-black text-primary">R$ {o.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
        <Link to="/colecoes" className="block text-center font-tactical text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">← Continuar comprando</Link>
      </section>
    </GameLayout>
  );
}
