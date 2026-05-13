/**
 * Shopify Storefront API client + adapter for the PATCH CLUB catalog.
 *
 * It maps Shopify products + custom metafields into our internal `Product`
 * type so the rest of the app (pages, cart, gamification) stays untouched.
 *
 * Required env vars (set when activating Shopify):
 *  - VITE_SHOPIFY_DOMAIN              e.g. "patchclub.myshopify.com"
 *  - VITE_SHOPIFY_STOREFRONT_TOKEN    public Storefront API token
 *  - VITE_SHOPIFY_API_VERSION         optional, defaults to "2024-10"
 *
 * Metafields contract (see docs/shopify-metafields.md):
 *  patchclub.rarity      single_line_text  "lendario"|"epico"|"ouro"|"prata"
 *  patchclub.ovr         number_integer    1..99
 *  patchclub.stats       json              {ata,tec,mist,hist}
 *  patchclub.continent   single_line_text  "america-sul"|"europa"|...
 *  patchclub.team        single_line_text
 *  patchclub.flag        single_line_text  emoji
 *  patchclub.year        number_integer
 *  patchclub.type        single_line_text  "current"|"legendary"
 *  patchclub.colors      json              {primary,secondary,accent}
 */

import type {
  Product,
  Rarity,
  Continent,
  Variant,
} from "@/data/products";
import type {
  CommerceAdapter,
  CommerceCollection,
  CheckoutResult,
} from "@/lib/commerce";
import type { CartItem } from "@/lib/cart";

const env = (import.meta as any).env ?? {};
export const SHOPIFY_DOMAIN: string | undefined =
  env.VITE_SHOPIFY_DOMAIN as string | undefined;
const TOKEN: string | undefined =
  env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
const API_VERSION: string =
  (env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? "2024-10";

export const shopifyConfigured = Boolean(SHOPIFY_DOMAIN && TOKEN);

/* ============================ HTTP ============================ */

async function storefront<T = any>(
  query: string,
  variables: Record<string, any> = {},
): Promise<T> {
  if (!shopifyConfigured) {
    throw new Error(
      "Shopify Storefront API not configured: set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.",
    );
  }
  const r = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!r.ok) {
    throw new Error(`Shopify Storefront ${r.status}: ${await r.text()}`);
  }
  const json = await r.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

/* ============================ Mapping ============================ */

const VALID_RARITY: Rarity[] = ["lendario", "epico", "ouro", "prata"];
const VALID_CONTINENT: Continent[] = [
  "america-sul",
  "europa",
  "america-norte",
  "asia",
  "africa",
];

const PATCHCLUB_NS = "patchclub";

interface MetafieldNode {
  key: string;
  value: string | null;
}
interface ShopifyImage { url: string; altText: string | null; }
interface ShopifyVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
}
interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  metafields: (MetafieldNode | null)[];
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariantNode }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

function pickMeta(metafields: (MetafieldNode | null)[], key: string): string | null {
  for (const m of metafields) if (m && m.key === key) return m.value;
  return null;
}

function asJson<T>(v: string | null, fallback: T): T {
  if (!v) return fallback;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}

function asInt(v: string | null, fallback = 0): number {
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function asRarity(v: string | null, fallback: Rarity = "prata"): Rarity {
  return (VALID_RARITY as string[]).includes(v ?? "") ? (v as Rarity) : fallback;
}

function asContinent(v: string | null, fallback: Continent = "europa"): Continent {
  return (VALID_CONTINENT as string[]).includes(v ?? "")
    ? (v as Continent)
    : fallback;
}

function asVariants(node: ShopifyProductNode): Variant[] {
  // Read from Shopify "Style" option (Home/Away). Fallback: home only.
  const styles = new Set<Variant>();
  for (const e of node.variants.edges) {
    for (const o of e.node.selectedOptions) {
      const name = o.name.toLowerCase();
      const val = o.value.toLowerCase();
      if (name === "style" || name === "estilo" || name === "modelo") {
        if (val.includes("away") || val.includes("visit") || val.includes("away kit")) styles.add("away");
        else styles.add("home");
      }
    }
  }
  if (styles.size === 0) styles.add("home");
  return Array.from(styles);
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const rarity = asRarity(pickMeta(node.metafields, "rarity"));
  const continent = asContinent(pickMeta(node.metafields, "continent"));
  const ovr = asInt(pickMeta(node.metafields, "ovr"), 80);
  const year = asInt(pickMeta(node.metafields, "year"), new Date().getFullYear());
  const type = (pickMeta(node.metafields, "type") === "legendary"
    ? "legendary"
    : "current") as Product["type"];
  const stats = asJson(pickMeta(node.metafields, "stats"), {
    ata: ovr - 1, tec: ovr, mist: ovr - 2, hist: ovr - 3,
  });
  const colors = asJson(pickMeta(node.metafields, "colors"), {
    primary: "#10b981", secondary: "#0f172a", accent: "#facc15",
  });
  const team = pickMeta(node.metafields, "team") ?? node.title;
  const flag = pickMeta(node.metafields, "flag") ?? "🏳️";
  const price = Math.round(
    Number.parseFloat(node.priceRange.minVariantPrice.amount || "0"),
  );

  return {
    id: node.id,
    slug: node.handle,
    name: node.title,
    team,
    flag,
    year,
    type,
    rarity,
    continent,
    ovr,
    attrs: stats,
    variants: asVariants(node),
    price,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    description: node.description ?? "",
  };
}

/* ============================ Queries ============================ */

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    description
    productType
    tags
    featuredImage { url altText }
    images(first: 6) { edges { node { url altText } } }
    metafields(identifiers: [
      { namespace: "${PATCHCLUB_NS}", key: "rarity" },
      { namespace: "${PATCHCLUB_NS}", key: "ovr" },
      { namespace: "${PATCHCLUB_NS}", key: "stats" },
      { namespace: "${PATCHCLUB_NS}", key: "continent" },
      { namespace: "${PATCHCLUB_NS}", key: "team" },
      { namespace: "${PATCHCLUB_NS}", key: "flag" },
      { namespace: "${PATCHCLUB_NS}", key: "year" },
      { namespace: "${PATCHCLUB_NS}", key: "type" },
      { namespace: "${PATCHCLUB_NS}", key: "colors" }
    ]) { key value }
    variants(first: 30) {
      edges { node {
        id title availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      } }
    }
    priceRange { minVariantPrice { amount currencyCode } }
  }
`;

const Q_LIST = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ...ProductCard } }
    }
  }
`;

const Q_LIST_BY_COLLECTION = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) { edges { node { ...ProductCard } } }
    }
  }
`;

const Q_PRODUCT = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query Product($handle: String!) {
    product(handle: $handle) { ...ProductCard }
  }
`;

const Q_COLLECTIONS = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges { node { id handle title description } }
    }
  }
`;

const M_CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
`;

/* ============================ Adapter ============================ */

export const shopifyAdapter: CommerceAdapter = {
  id: "shopify",

  async listCollections(): Promise<CommerceCollection[]> {
    const data = await storefront<{
      collections: { edges: { node: { id: string; handle: string; title: string; description: string } }[] };
    }>(Q_COLLECTIONS, { first: 50 });
    return data.collections.edges.map(e => ({
      id: e.node.id,
      handle: e.node.handle,
      title: e.node.title,
      description: e.node.description,
    }));
  },

  async listProducts(filter) {
    if (filter?.collectionHandle) {
      const data = await storefront<{
        collection: { products: { edges: { node: ShopifyProductNode }[] } } | null;
      }>(Q_LIST_BY_COLLECTION, { handle: filter.collectionHandle, first: 100 });
      return (data.collection?.products.edges ?? []).map(e => mapShopifyProduct(e.node));
    }
    const data = await storefront<{
      products: { edges: { node: ShopifyProductNode }[] };
    }>(Q_LIST, { first: 100 });
    return data.products.edges.map(e => mapShopifyProduct(e.node));
  },

  async getProduct(slug: string): Promise<Product | null> {
    const data = await storefront<{ product: ShopifyProductNode | null }>(
      Q_PRODUCT,
      { handle: slug },
    );
    return data.product ? mapShopifyProduct(data.product) : null;
  },

  async createCheckout(items: CartItem[]): Promise<CheckoutResult> {
    // Map our CartItem (productId + variant: "home"|"away") into Shopify
    // merchandise IDs by looking up each product's matching variant.
    // To minimize calls we batch-fetch each product once.
    const uniqueProductIds = Array.from(new Set(items.map(i => i.productId)));
    const productsByGid = new Map<string, ShopifyProductNode>();

    // Items can carry either a Shopify GID (gid://shopify/Product/...) or a
    // local slug. We support both: GIDs are looked up via `node`, slugs via
    // `productByHandle`.
    const Q_NODE = /* GraphQL */ `
      ${PRODUCT_FIELDS}
      query Node($id: ID!) { node(id: $id) { ... on Product { ...ProductCard } } }
    `;
    for (const pid of uniqueProductIds) {
      if (pid.startsWith("gid://")) {
        const data = await storefront<{ node: ShopifyProductNode | null }>(Q_NODE, { id: pid });
        if (data.node) productsByGid.set(pid, data.node);
      } else {
        const data = await storefront<{ product: ShopifyProductNode | null }>(Q_PRODUCT, { handle: pid });
        if (data.product) productsByGid.set(pid, data.product);
      }
    }

    const lines: { merchandiseId: string; quantity: number }[] = [];
    for (const i of items) {
      const node = productsByGid.get(i.productId);
      if (!node) continue;
      // Pick the variant whose Style option matches our internal "home"/"away".
      const target = i.variant === "away" ? "away" : "home";
      const match =
        node.variants.edges.find(e =>
          e.node.selectedOptions.some(o => {
            const k = o.name.toLowerCase();
            return (k === "style" || k === "estilo" || k === "modelo") &&
              o.value.toLowerCase().includes(target);
          }),
        ) ?? node.variants.edges[0];
      if (match) lines.push({ merchandiseId: match.node.id, quantity: i.qty });
    }

    if (lines.length === 0) {
      return { url: "/checkout", external: false, totals: { subtotal: 0, discount: 0, total: 0 } };
    }

    const data = await storefront<{
      cartCreate: {
        cart: {
          id: string;
          checkoutUrl: string;
          cost: { subtotalAmount: { amount: string }; totalAmount: { amount: string } };
        } | null;
        userErrors: { message: string }[];
      };
    }>(M_CART_CREATE, { lines });

    const cart = data.cartCreate.cart;
    if (!cart) {
      throw new Error(
        `Shopify cartCreate failed: ${data.cartCreate.userErrors.map(e => e.message).join(", ")}`,
      );
    }
    const subtotal = Number.parseFloat(cart.cost.subtotalAmount.amount);
    const total = Number.parseFloat(cart.cost.totalAmount.amount);
    return {
      url: cart.checkoutUrl,
      external: true,
      totals: { subtotal, discount: subtotal - total, total },
    };
  },
};
