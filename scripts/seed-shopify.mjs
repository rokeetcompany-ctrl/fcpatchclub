#!/usr/bin/env node
/**
 * Seed Shopify with 3 test PATCH CLUB products + their custom metafields.
 *
 * Required env (run from a shell that has these):
 *   SHOPIFY_DOMAIN              e.g. patchclub.myshopify.com
 *   SHOPIFY_ADMIN_API_TOKEN     Admin API access token (Custom App)
 *   SHOPIFY_API_VERSION         optional, default "2024-10"
 *
 * Required Admin API scopes:
 *   write_products, write_inventory, write_publications
 *
 * Usage:
 *   SHOPIFY_DOMAIN=foo.myshopify.com SHOPIFY_ADMIN_API_TOKEN=shpat_... \
 *     node scripts/seed-shopify.mjs
 *
 * Idempotent: if a product with the same handle already exists, it is updated
 * instead of duplicated.
 */

const DOMAIN = process.env.SHOPIFY_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

if (!DOMAIN || !TOKEN) {
  console.error("Missing SHOPIFY_DOMAIN or SHOPIFY_ADMIN_API_TOKEN.");
  process.exit(1);
}

const ENDPOINT = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function gql(query, variables = {}) {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  const j = await r.json();
  if (j.errors) throw new Error(`GraphQL: ${JSON.stringify(j.errors)}`);
  return j.data;
}

/* ============================ Definitions ============================ */
// Run once. Idempotent: Shopify returns userErrors with code TAKEN if it
// already exists; we ignore those.

const NS = "patchclub";
const DEFINITIONS = [
  { key: "rarity",    name: "Raridade",     type: "single_line_text_field", description: "lendario|epico|ouro|prata" },
  { key: "ovr",       name: "OVR",          type: "number_integer",         description: "Força da Camisa 1-99" },
  { key: "stats",     name: "Stats",        type: "json",                   description: "{ata,tec,mist,hist}" },
  { key: "continent", name: "Continente",   type: "single_line_text_field", description: "america-sul|europa|america-norte|asia|africa" },
  { key: "team",      name: "Seleção",      type: "single_line_text_field" },
  { key: "flag",      name: "Bandeira",     type: "single_line_text_field" },
  { key: "year",      name: "Ano",          type: "number_integer" },
  { key: "type",      name: "Tipo",         type: "single_line_text_field", description: "current|legendary" },
  { key: "colors",    name: "Cores",        type: "json",                   description: "{primary,secondary,accent}" },
];

const M_DEF_CREATE = /* GraphQL */ `
  mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id key namespace }
      userErrors { field message code }
    }
  }
`;

async function ensureDefinitions() {
  for (const d of DEFINITIONS) {
    const data = await gql(M_DEF_CREATE, {
      definition: {
        name: d.name,
        namespace: NS,
        key: d.key,
        type: d.type,
        ownerType: "PRODUCT",
        description: d.description,
        pin: true,
      },
    });
    const errs = data.metafieldDefinitionCreate.userErrors;
    if (errs?.length) {
      const ok = errs.every(e => e.code === "TAKEN");
      if (!ok) console.warn(`metafield ${d.key}:`, errs);
      else console.log(`✓ metafield ${d.key} already exists`);
    } else {
      console.log(`✓ metafield ${d.key} created`);
    }
  }
}

/* ============================ Seed products ============================ */

/**
 * Each seed can carry an `images: string[]` of public HTTPS URLs that Shopify
 * will fetch and host on its CDN. They become available immediately via the
 * Storefront API (`product.images`) consumed by the frontend gallery.
 *
 * Tip: hosting the originals in your own bucket (S3, R2, Cloudinary) gives you
 * the most stable seeding. The strings below are placeholders — replace them
 * with the real product photography you upload.
 */
const SEEDS = [
  {
    handle: "selecao-brasil-2026",
    title: "Brasil 2026",
    descriptionHtml: "<p>Camisa oficial da seleção brasileira para a Copa 2026. Tecido Dry-Fit Pro.</p>",
    productType: "Camisa de Seleção",
    tags: ["copa-2026", "current", "drop-oficial"],
    price: "329.00",
    images: [
      "https://cdn.example.com/patchclub/brasil-2026/front.jpg",
      "https://cdn.example.com/patchclub/brasil-2026/back.jpg",
      "https://cdn.example.com/patchclub/brasil-2026/away.jpg",
      "https://cdn.example.com/patchclub/brasil-2026/patch.jpg",
    ],
    metafields: {
      rarity: "lendario",
      ovr: 94,
      stats: { ata: 96, tec: 95, mist: 97, hist: 99 },
      continent: "america-sul",
      team: "Brasil",
      flag: "🇧🇷",
      year: 2026,
      type: "current",
      colors: { primary: "#FFD700", secondary: "#0066CC", accent: "#009C3B" },
    },
  },
  {
    handle: "selecao-argentina-2022",
    title: "Argentina 2022",
    descriptionHtml: "<p>Edição comemorativa do tricampeonato. Retrô oficial autorizado.</p>",
    productType: "Camisa Lendária",
    tags: ["legendary", "campea-mundial"],
    price: "449.00",
    images: [
      "https://cdn.example.com/patchclub/argentina-2022/front.jpg",
      "https://cdn.example.com/patchclub/argentina-2022/back.jpg",
      "https://cdn.example.com/patchclub/argentina-2022/detail.jpg",
      "https://cdn.example.com/patchclub/argentina-2022/patch.jpg",
    ],
    metafields: {
      rarity: "lendario",
      ovr: 99,
      stats: { ata: 98, tec: 99, mist: 99, hist: 99 },
      continent: "america-sul",
      team: "Argentina",
      flag: "🇦🇷",
      year: 2022,
      type: "legendary",
      colors: { primary: "#74ACDF", secondary: "#FFFFFF", accent: "#FCBF49" },
    },
  },
  {
    handle: "selecao-franca-1998",
    title: "França 1998",
    descriptionHtml: "<p>Retrô da campanha do título mundial. Algodão pesado.</p>",
    productType: "Camisa Lendária",
    tags: ["legendary", "retro-90s"],
    price: "369.00",
    images: [
      "https://cdn.example.com/patchclub/franca-1998/front.jpg",
      "https://cdn.example.com/patchclub/franca-1998/back.jpg",
      "https://cdn.example.com/patchclub/franca-1998/detail.jpg",
      "https://cdn.example.com/patchclub/franca-1998/patch.jpg",
    ],
    metafields: {
      rarity: "epico",
      ovr: 92,
      stats: { ata: 90, tec: 92, mist: 95, hist: 98 },
      continent: "europa",
      team: "França",
      flag: "🇫🇷",
      year: 1998,
      type: "legendary",
      colors: { primary: "#0055A4", secondary: "#FFFFFF", accent: "#EF4135" },
    },
  },
  {
    handle: "selecao-marrocos-2026",
    title: "Marrocos 2026",
    descriptionHtml: "<p>Camisa oficial dos Leões do Atlas. Edição Copa 2026.</p>",
    productType: "Camisa de Seleção",
    tags: ["copa-2026", "current"],
    price: "299.00",
    images: [
      "https://cdn.example.com/patchclub/marrocos-2026/front.jpg",
      "https://cdn.example.com/patchclub/marrocos-2026/back.jpg",
      "https://cdn.example.com/patchclub/marrocos-2026/away.jpg",
      "https://cdn.example.com/patchclub/marrocos-2026/patch.jpg",
    ],
    metafields: {
      rarity: "ouro",
      ovr: 84,
      stats: { ata: 82, tec: 85, mist: 86, hist: 80 },
      continent: "africa",
      team: "Marrocos",
      flag: "🇲🇦",
      year: 2026,
      type: "current",
      colors: { primary: "#C1272D", secondary: "#006233", accent: "#FFFFFF" },
    },
  },
  {
    handle: "selecao-japao-2026",
    title: "Japão 2026",
    descriptionHtml: "<p>Os Samurais Azuis em sua edição mais ousada.</p>",
    productType: "Camisa de Seleção",
    tags: ["copa-2026", "current"],
    price: "299.00",
    images: [
      "https://cdn.example.com/patchclub/japao-2026/front.jpg",
      "https://cdn.example.com/patchclub/japao-2026/back.jpg",
      "https://cdn.example.com/patchclub/japao-2026/away.jpg",
      "https://cdn.example.com/patchclub/japao-2026/patch.jpg",
    ],
    metafields: {
      rarity: "ouro",
      ovr: 83,
      stats: { ata: 80, tec: 86, mist: 84, hist: 78 },
      continent: "asia",
      team: "Japão",
      flag: "🇯🇵",
      year: 2026,
      type: "current",
      colors: { primary: "#0033A0", secondary: "#FFFFFF", accent: "#BC002D" },
    },
  },
];

const Q_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) { id title }
  }
`;

const M_PRODUCT_CREATE = /* GraphQL */ `
  mutation ProductCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product { id handle title }
      userErrors { field message }
    }
  }
`;

const M_PRODUCT_UPDATE = /* GraphQL */ `
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id handle title }
      userErrors { field message }
    }
  }
`;

const M_METAFIELDS_SET = /* GraphQL */ `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key namespace }
      userErrors { field message code }
    }
  }
`;

/**
 * Attaches gallery images to a product. Shopify will fetch each URL and host
 * it on its own CDN, so the URLs you pass here only need to be publicly
 * reachable at seed time. Already-attached images (matched by alt text) are
 * skipped so the seed stays idempotent.
 */
const Q_PRODUCT_IMAGES = /* GraphQL */ `
  query ProductImages($id: ID!) {
    product(id: $id) {
      images(first: 20) { edges { node { id altText } } }
    }
  }
`;

const M_PRODUCT_CREATE_MEDIA = /* GraphQL */ `
  mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { ... on MediaImage { id alt } }
      mediaUserErrors { field message code }
    }
  }
`;

async function attachImages(productId, handle, urls) {
  if (!urls?.length) return;
  const existing = await gql(Q_PRODUCT_IMAGES, { id: productId });
  const present = new Set(
    (existing.product?.images.edges ?? []).map(e => e.node.altText).filter(Boolean),
  );
  const fresh = urls
    .map((u, i) => ({ url: u, alt: `${handle}-${i + 1}` }))
    .filter(m => !present.has(m.alt));
  if (!fresh.length) {
    console.log(`  ↳ images already attached (${urls.length})`);
    return;
  }
  const data = await gql(M_PRODUCT_CREATE_MEDIA, {
    productId,
    media: fresh.map(m => ({
      originalSource: m.url,
      alt: m.alt,
      mediaContentType: "IMAGE",
    })),
  });
  const errs = data.productCreateMedia.mediaUserErrors;
  if (errs?.length) console.warn(`  ! image errors:`, errs);
  console.log(`  ↳ images attached (${fresh.length}/${urls.length})`);
}

function metafieldsFor(productId, mfs) {
  return Object.entries(mfs).map(([key, raw]) => {
    const def = DEFINITIONS.find(d => d.key === key);
    const type = def?.type ?? "single_line_text_field";
    const value =
      type === "json" ? JSON.stringify(raw) :
      type === "number_integer" ? String(raw) :
      String(raw);
    return { ownerId: productId, namespace: NS, key, type, value };
  });
}

async function upsertProduct(seed) {
  const existing = await gql(Q_PRODUCT_BY_HANDLE, { handle: seed.handle });
  let productId = existing.productByHandle?.id;

  const baseInput = {
    title: seed.title,
    handle: seed.handle,
    descriptionHtml: seed.descriptionHtml,
    productType: seed.productType,
    tags: seed.tags,
    status: "ACTIVE",
    variants: [{
      price: seed.price,
      inventoryPolicy: "CONTINUE",
      options: ["Default"],
    }],
    options: ["Style"],
  };

  if (!productId) {
    const data = await gql(M_PRODUCT_CREATE, { input: baseInput });
    const errs = data.productCreate.userErrors;
    if (errs?.length) throw new Error(`productCreate ${seed.handle}: ${JSON.stringify(errs)}`);
    productId = data.productCreate.product.id;
    console.log(`✓ created ${seed.handle}`);
  } else {
    await gql(M_PRODUCT_UPDATE, { input: { id: productId, ...baseInput } });
    console.log(`✓ updated ${seed.handle}`);
  }

  const data = await gql(M_METAFIELDS_SET, {
    metafields: metafieldsFor(productId, seed.metafields),
  });
  const errs = data.metafieldsSet.userErrors;
  if (errs?.length) throw new Error(`metafieldsSet ${seed.handle}: ${JSON.stringify(errs)}`);
  console.log(`  ↳ metafields set (${Object.keys(seed.metafields).length})`);

  await attachImages(productId, seed.handle, seed.images);
}

/* ============================ Main ============================ */

(async () => {
  console.log(`▶ Seeding ${DOMAIN} (api ${API_VERSION})`);
  console.log("→ Ensuring metafield definitions");
  await ensureDefinitions();
  console.log("→ Upserting products");
  for (const s of SEEDS) await upsertProduct(s);
  console.log("✅ Done.");
})().catch(err => {
  console.error("✖ seed failed:", err.message);
  process.exit(1);
});
