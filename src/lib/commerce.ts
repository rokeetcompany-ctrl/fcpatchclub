/**
 * Camada de e-commerce abstrata.
 * Hoje serve produtos do JSON local. Pode ser plugada em Shopify (Storefront API)
 * sem alterar páginas/UI: basta implementar `ShopifyAdapter` e setar
 * `import.meta.env.VITE_SHOPIFY_DOMAIN` + `VITE_SHOPIFY_STOREFRONT_TOKEN`
 * (ou habilitar Shopify pelo Lovable e expor as credenciais via secrets).
 */

import { PRODUCTS, CONTINENTS, type Product, type Continent } from "@/data/products";
import type { CartItem } from "@/lib/cart";

export interface CommerceCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
}

export interface CheckoutLine {
  productId: string;
  variantId: string;
  qty: number;
  price: number;
}

export interface CheckoutResult {
  url: string;            // URL externa (Shopify) OU rota interna ("/checkout")
  external: boolean;
  totals: { subtotal: number; discount: number; total: number };
}

export interface CommerceAdapter {
  readonly id: "local" | "shopify";
  listCollections(): Promise<CommerceCollection[]>;
  listProducts(filter?: { collectionHandle?: string }): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  createCheckout(items: CartItem[]): Promise<CheckoutResult>;
}

/* ================== LOCAL ADAPTER ================== */

const localAdapter: CommerceAdapter = {
  id: "local",
  async listCollections() {
    return CONTINENTS.map(c => ({
      id: c.id,
      handle: c.id,
      title: c.name,
      description: c.desc,
    }));
  },
  async listProducts(filter) {
    if (filter?.collectionHandle) {
      return PRODUCTS.filter(p => p.continent === (filter.collectionHandle as Continent));
    }
    return PRODUCTS;
  },
  async getProduct(slug) {
    return PRODUCTS.find(p => p.slug === slug) ?? null;
  },
  async createCheckout(items) {
    const subtotal = items.reduce((s, i) => {
      const p = PRODUCTS.find(pp => pp.id === i.productId);
      return s + (p?.price ?? 0) * i.qty;
    }, 0);
    return {
      url: "/checkout",
      external: false,
      totals: { subtotal, discount: 0, total: subtotal },
    };
  },
};

/* ================== SHOPIFY ADAPTER (stub) ==================
 * Implementação real fica desativada até o Lovable Cloud + Shopify
 * estarem habilitados. Quando ativar, descomentar e preencher.
 *
 * const shopifyAdapter: CommerceAdapter = {
 *   id: "shopify",
 *   async listCollections() {
 *     const r = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, { ... });
 *     return ...;
 *   },
 *   ...
 * };
 */
const shopifyAdapter: CommerceAdapter | null = null;

/* ================== EXPORT ================== */

const SHOPIFY_DOMAIN = (import.meta as any).env?.VITE_SHOPIFY_DOMAIN as string | undefined;

export const commerce: CommerceAdapter =
  SHOPIFY_DOMAIN && shopifyAdapter ? shopifyAdapter : localAdapter;

export const isShopify = commerce.id === "shopify";
