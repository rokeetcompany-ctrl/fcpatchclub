import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product, type Variant } from "@/data/products";

export interface CartItem {
  productId: string;
  variant: Variant;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (productId: string, variant: Variant, qty?: number) => void;
  remove: (productId: string, variant: Variant) => void;
  setQty: (productId: string, variant: Variant, qty: number) => void;
  clear: () => void;
  totals: {
    units: number;
    subtotal: number;
    discount: number;        // value of free items
    freeUnits: number;       // count of free items
    total: number;
    xpBonus: number;
    coinBonus: number;
  };
  itemsDetailed: Array<CartItem & { product: Product; lineTotal: number }>;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "patchclub-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add: CartCtx["add"] = (productId, variant, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === productId && i.variant === variant);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, variant, qty }];
    });
  };
  const remove: CartCtx["remove"] = (productId, variant) =>
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variant === variant)));
  const setQty: CartCtx["setQty"] = (productId, variant, qty) =>
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => !(i.productId === productId && i.variant === variant))
        : prev.map(i => (i.productId === productId && i.variant === variant ? { ...i, qty } : i))
    );
  const clear = () => setItems([]);

  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map(i => {
        const product = PRODUCTS.find(p => p.id === i.productId);
        return product ? { ...i, product, lineTotal: product.price * i.qty } : null;
      })
      .filter(Boolean) as Array<CartItem & { product: Product; lineTotal: number }>;

    // Buy 3, pay 2 — for every group of 3 units across the cart, the cheapest counts free
    const flat: number[] = [];
    detailed.forEach(d => { for (let k = 0; k < d.qty; k++) flat.push(d.product.price); });
    flat.sort((a, b) => b - a); // most expensive first
    const freeUnits = Math.floor(flat.length / 3);
    let discount = 0;
    // The cheapest within each set of 3 is free → take cheapest items overall = last freeUnits in desc-sorted = ascending sort
    const asc = [...flat].sort((a, b) => a - b);
    for (let i = 0; i < freeUnits; i++) discount += asc[i] ?? 0;

    const subtotal = flat.reduce((s, n) => s + n, 0);
    const units = flat.length;
    const total = subtotal - discount;
    const xpBonus = freeUnits * 150 + units * 25;
    const coinBonus = freeUnits * 100;

    return {
      items,
      add, remove, setQty, clear,
      itemsDetailed: detailed,
      totals: { units, subtotal, discount, freeUnits, total, xpBonus, coinBonus },
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
};
