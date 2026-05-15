# Shopify Metafields — PATCH CLUB Catalog

This document is the **single source of truth** for the custom catalog data the
PATCH CLUB frontend reads from Shopify. The adapter in `src/lib/shopify.ts`
expects the exact namespace, key, and type listed below. Adding/renaming a
field here requires a matching change there.

> **Namespace:** `patchclub`
> **Owner type:** `PRODUCT`
> **Pin to admin:** ✅ recommended for all fields below.

---

## 1. Required environment variables

Set these in **Workspace Settings → Build Secrets** (build-time) **and**
in the runtime secrets when calling Shopify from server code.

| Var | Scope | Description |
|---|---|---|
| `VITE_SHOPIFY_DOMAIN` | client/build | e.g. `patchclub.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | client/build | Public **Storefront API** access token |
| `VITE_SHOPIFY_API_VERSION` | client/build | Optional. Defaults to `2024-10` |
| `SHOPIFY_ADMIN_API_TOKEN` | server-only | **Admin API** token, only used by the seed script |

The Storefront token is public/read-only by design. The Admin token must
**never** appear in `VITE_*` and must never reach the client bundle.

---

## 2. Metafield Definitions (Product)

Create each one under **Settings → Custom data → Products → Add definition**.

### 2.1 `patchclub.rarity`
- **Type:** `single_line_text_field`
- **Validation:** allowed values
  - `lendario`
  - `epico`
  - `ouro`
  - `prata`
- **Use:** drives card border, OVR ring color, drop weights, filters.

### 2.2 `patchclub.ovr`
- **Type:** `number_integer`
- **Validation:** min `1`, max `99`
- **Use:** "Força da Camisa" meter on PDP and JerseyCard.

### 2.3 `patchclub.stats`
- **Type:** `json`
- **Schema:**
  ```json
  { "ata": 92, "tec": 95, "mist": 97, "hist": 99 }
  ```
- **Use:** OVR breakdown bars (Ataque, Técnica, Mística, História).
- **Defaults if missing:** derived from `ovr`.

### 2.4 `patchclub.continent`
- **Type:** `single_line_text_field`
- **Validation:** allowed values
  - `america-sul`
  - `europa`
  - `america-norte`
  - `asia`
  - `africa`
- **Use:** continent navigation page and Home filters.

### 2.5 `patchclub.team`
- **Type:** `single_line_text_field`
- **Use:** display name (`Brasil`, `Argentina`…). Falls back to product `title`.

### 2.6 `patchclub.flag`
- **Type:** `single_line_text_field` (single emoji)
- **Use:** emoji shown next to team name.

### 2.7 `patchclub.year`
- **Type:** `number_integer`
- **Validation:** min `1900`, max current year + 2
- **Use:** retrô / drops sorting; activates `yearBoost` for legendary tiers.

### 2.8 `patchclub.type`
- **Type:** `single_line_text_field`
- **Validation:** allowed values
  - `current` (camisa atual / drop oficial)
  - `legendary` (retrô / colecionador)
- **Use:** segregates Home rows ("HYPE COPA 2026" vs "CAMISAS LENDÁRIAS").

### 2.9 `patchclub.colors`
- **Type:** `json`
- **Schema:**
  ```json
  { "primary": "#FFCC00", "secondary": "#0066CC", "accent": "#FFFFFF" }
  ```
- **Use:** procedural `<Jersey>` SVG render when no real photo is available.

### 2.10 `patchclub.hype_score` *(optional, future)*
- **Type:** `number_integer` 0–100
- **Use:** "trending" sorting on Home.

### 2.11 `patchclub.fabric_options` *(optional, when not using variants)*
- **Type:** `json`
- **Schema:**
  ```json
  [
    { "id": "torcedor", "label": "Dry-Fit", "delta": 0 },
    { "id": "jogador",  "label": "Pro Match", "delta": 80 },
    { "id": "retro",    "label": "Algodão", "delta": 40 }
  ]
  ```
- **Note:** prefer modeling fabric as a real **variant option** so the Shopify
  cart and checkout handle pricing natively.

---

## 3. Variant options (native Shopify, not metafields)

| Option name | Values |
|---|---|
| `Size` | `P`, `M`, `G`, `GG`, `XGG` |
| `Style` | `Home`, `Away`  *(maps to `Variant`: `home`/`away`)* |
| `Fabric` *(optional)* | `Torcedor`, `Jogador`, `Retrô` |

The adapter reads the `Style` option to populate `Product.variants`.

---

## 4. Recommended Collections

Create one **Smart Collection per continent** + one per drop type. Handles must
match the values used in `patchclub.continent` so the adapter can fetch by
collection handle directly.

| Handle | Smart rule |
|---|---|
| `america-sul` | Product metafield `patchclub.continent` is equal to `america-sul` |
| `europa` | …`europa` |
| `america-norte` | …`america-norte` |
| `asia` | …`asia` |
| `africa` | …`africa` |
| `lendarias` | Product metafield `patchclub.type` equals `legendary` |
| `copa-2026` | Product tag equals `copa-2026` |

---

## 5. Activation checklist

- [ ] Add the 9 required metafield definitions above (sections 2.1–2.9).
- [ ] Pin them to the product admin form.
- [ ] Add native variant options `Size` and `Style`.
- [ ] Create the smart collections in §4.
- [ ] Run `node scripts/seed-shopify.mjs` to populate test products.
- [ ] Set `VITE_SHOPIFY_DOMAIN` + `VITE_SHOPIFY_STOREFRONT_TOKEN`.
- [ ] Verify `/colecoes` and a PDP load real Shopify data.
- [ ] Remove `src/data/products.ts` from production reads (keep as type/seed
      reference only).

---

## Imagens reais (galeria do PDP)

Imagens **não** vivem em metafields — são `Media` nativos do produto Shopify.
A Storefront API expõe via `product.images(first:N)` e o adapter
(`src/lib/shopify.ts`) já as mapeia para `Product.images: string[]` (URLs CDN).

Convenção de ordem (a galeria mostra na mesma ordem em que estão no Shopify):

| Posição | Conteúdo recomendado |
|---------|----------------------|
| 1       | Frente (mandante) — usada como `featuredImage` e capa OG |
| 2       | Costas com nome/número |
| 3       | Visitante (II) ou detalhe macro |
| 4       | Patch/etiqueta de raridade |

O frontend faz fallback automático para o `<Jersey />` SVG quando o produto
ainda não tem fotos, então é seguro popular o catálogo antes do shooting.

Para semear imagens em massa via Admin API, use o helper `attachImages` em
`scripts/seed-shopify.mjs` (cada seed aceita `images: string[]`). O Shopify
faz o fetch das URLs e re-hospeda no CDN dele.
