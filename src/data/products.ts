export type Rarity = "lendario" | "epico" | "ouro" | "prata";
export type Continent = "america-sul" | "europa" | "america-norte" | "asia" | "africa";
export type Variant = "home" | "away";

export interface Product {
  id: string;
  slug: string;
  name: string;          // "Brasil 2026"
  team: string;          // "Brasil"
  flag: string;          // emoji
  year: number;
  type: "current" | "legendary";
  rarity: Rarity;
  continent: Continent;
  ovr: number;
  attrs: { ata: number; tec: number; mist: number; hist: number };
  variants: Variant[];   // "home"|"away"
  price: number;         // BRL
  primary: string;       // jersey base color
  secondary: string;
  accent: string;
  description: string;
  images?: string[];     // Real photos from Shopify (CDN URLs). When empty, frontend renders the SVG <Jersey /> placeholder.
}

/**
 * Regras estritas de tier (Força da Camisa).
 * Toda camisa cai num tier; o preço é derivado do tier (com bônus por ano icônico
 * em legendárias). Editar aqui altera toda a vitrine.
 */
export const TIER_RULES: Record<Rarity, {
  label: string;
  ovrMin: number;
  ovrMax: number;
  basePrice: number;        // preço base camisa atual
  legendaryPrice: number;   // preço base camisa legendária
  color: string;
  desc: string;
}> = {
  lendario: { label: "LENDÁRIO", ovrMin: 92, ovrMax: 99, basePrice: 329, legendaryPrice: 449, color: "var(--gold)",   desc: "Tier máximo. Drops e relíquias." },
  epico:    { label: "ÉPICO",    ovrMin: 88, ovrMax: 93, basePrice: 279, legendaryPrice: 369, color: "var(--epic)",   desc: "Top de mercado. Hype garantido." },
  ouro:     { label: "OURO",     ovrMin: 82, ovrMax: 88, basePrice: 229, legendaryPrice: 299, color: "var(--gold)",   desc: "Premium acessível." },
  prata:    { label: "PRATA",    ovrMin: 75, ovrMax: 82, basePrice: 189, legendaryPrice: 249, color: "var(--silver)", desc: "Entrada e clássicos." },
};

const yearBoost = (year: number): number => {
  const iconic = new Set([1970, 1982, 1986, 1990, 1994, 1998, 2002, 2014, 2022]);
  return iconic.has(year) ? 30 : 0;
};

const c = (
  team: string,
  flag: string,
  continent: Continent,
  rarity: Rarity,
  ovr: number,
  primary: string,
  secondary: string,
  accent: string,
  desc: string
): Product => ({
  id: `cur-${team.toLowerCase().replace(/\s+/g, "-")}`,
  slug: `selecao-${team.toLowerCase().replace(/\s+/g, "-")}-2026`,
  name: `${team} 2026`,
  team,
  flag,
  year: 2026,
  type: "current",
  rarity,
  continent,
  ovr,
  attrs: { ata: ovr - 1, tec: ovr, mist: ovr - 2, hist: ovr - 3 },
  variants: ["home", "away"],
  price: TIER_RULES[rarity].basePrice,
  primary,
  secondary,
  accent,
  description: desc,
});

const l = (
  team: string,
  flag: string,
  continent: Continent,
  rarity: Rarity,
  year: number,
  variant: Variant,
  ovr: number,
  primary: string,
  secondary: string,
  accent: string,
  desc: string
): Product => ({
  id: `leg-${team.toLowerCase()}-${year}-${variant}`,
  slug: `lendaria-${team.toLowerCase()}-${year}-${variant}`,
  name: `${team} ${year}${variant === "away" ? " · Away" : ""}`,
  team,
  flag,
  year,
  type: "legendary",
  rarity,
  continent,
  ovr,
  attrs: { ata: ovr, tec: ovr - 1, mist: ovr - 2, hist: 99 },
  variants: [variant],
  price: TIER_RULES[rarity].legendaryPrice + yearBoost(year),
  primary,
  secondary,
  accent,
  description: desc,
});

export const PRODUCTS: Product[] = [
  // ==================== CURRENT — América do Sul ====================
  c("Brasil",    "🇧🇷", "america-sul", "lendario", 95, "#FFDF00", "#009C3B", "#002776", "Hexa em mira. A camisa da seleção mais vitoriosa da história, pronta para a Copa 2026."),
  c("Argentina", "🇦🇷", "america-sul", "epico",    93, "#75AADB", "#FFFFFF", "#FCBF49", "Atual campeã do mundo. Vista a camisa da Albiceleste e defenda o título."),
  c("Uruguai",   "🇺🇾", "america-sul", "ouro",     86, "#5CBFEB", "#000000", "#FFFFFF", "A garra charrúa em campo. Tradição e raça."),
  c("Colombia",  "🇨🇴", "america-sul", "ouro",     84, "#FCD116", "#003893", "#CE1126", "Os cafeteros chegam com elenco renovado e muita técnica."),
  c("Equador",   "🇪🇨", "america-sul", "prata",    79, "#FFD800", "#034EA2", "#ED1C24", "A Tri equatoriana volta firme com base jovem."),
  c("Paraguai",  "🇵🇾", "america-sul", "prata",    77, "#FFFFFF", "#0038A8", "#D52B1E", "Albirroja com retorno histórico à Copa do Mundo."),
  // ==================== CURRENT — Europa ====================
  c("Franca",    "🇫🇷", "europa", "epico", 93, "#1E2A78", "#FFFFFF", "#EF4135", "Mbappé e cia. A potência francesa quer o tri mundial."),
  c("Alemanha",  "🇩🇪", "europa", "epico", 90, "#FFFFFF", "#000000", "#DD0000", "A Mannschaft renasce com nova geração ofensiva."),
  c("Inglaterra","🇬🇧", "europa", "epico", 91, "#FFFFFF", "#001489", "#CE1124", "Os Three Lions buscam encerrar o jejum desde 1966."),
  c("Portugal",  "🇵🇹", "europa", "epico", 90, "#006A4E", "#DA020E", "#FFD700", "Cristiano Ronaldo e a nova geração lusa em busca da glória."),
  c("Espanha",   "🇪🇸", "europa", "epico", 91, "#C60B1E", "#FFC400", "#000000", "La Roja volta dominante após o Euro. Tiki-taka 2.0."),
  c("Holanda",   "🇳🇱", "europa", "epico", 89, "#FF6900", "#000000", "#FFFFFF", "A Laranja Mecânica afiada para conquistar o inédito."),
  c("Belgica",   "🇧🇪", "europa", "ouro",  85, "#ED2939", "#000000", "#FAE042", "Os Diabos Vermelhos em ciclo renovado."),
  c("Croacia",   "🇭🇷", "europa", "ouro",  84, "#FFFFFF", "#171796", "#FF0000", "Vice em 2018, terceiros em 2022. Sempre presente."),
  c("Suecia",    "🇸🇪", "europa", "ouro",  82, "#FECC02", "#005AA0", "#FFFFFF", "Os vikings nórdicos retornam com força total."),
  c("Suica",     "🇨🇭", "europa", "prata", 80, "#FF0000", "#FFFFFF", "#000000", "Tradicional e disciplinada. A Nati nunca decepciona."),
  c("Turquia",   "🇹🇷", "europa", "prata", 81, "#E30A17", "#FFFFFF", "#000000", "A nova geração turca surpreende a Europa."),
  c("Austria",   "🇦🇹", "europa", "prata", 80, "#ED2939", "#FFFFFF", "#000000", "Liderada por Alaba, a Áustria volta após 8 anos."),
  c("Escocia",   "🏴", "europa", "prata", 78, "#0065BD", "#FFFFFF", "#FFD700", "Os Tartan Army de volta à elite mundial."),
  c("Noruega",   "🇳🇴", "europa", "ouro",  85, "#EF2B2D", "#FFFFFF", "#002868", "Haaland & Ødegaard finalmente em uma Copa."),
  // ==================== CURRENT — América do Norte ====================
  c("EUA",       "🇺🇸", "america-norte", "ouro",  82, "#FFFFFF", "#002868", "#BF0A30", "Anfitriões com elenco europeu e ambição máxima."),
  c("Mexico",    "🇲🇽", "america-norte", "ouro",  82, "#006847", "#FFFFFF", "#CE1126", "El Tri joga em casa. Nunca passou da quinta partida."),
  // ==================== CURRENT — Ásia ====================
  c("Japao",     "🇯🇵", "asia", "ouro",  83, "#0033A0", "#FFFFFF", "#BC002D", "Os Samurai Blue assustaram o mundo em 2022."),
  c("Coreia do Sul","🇰🇷","asia", "prata", 80, "#E60012", "#FFFFFF", "#003478", "Son Heung-min lidera os Tigres Asiáticos."),
  // ==================== CURRENT — África ====================
  c("Marrocos",  "🇲🇦", "africa", "ouro",  84, "#C1272D", "#006233", "#FFFFFF", "Semifinalista em 2022. A revolução africana continua."),
  c("Egito",     "🇪🇬", "africa", "prata", 80, "#CE1126", "#FFFFFF", "#000000", "Mo Salah lidera os Faraós rumo à glória."),
  c("Senegal",   "🇸🇳", "africa", "ouro",  82, "#00853F", "#FDEF42", "#E31B23", "Os Leões da Teranga chegam fortes."),
  c("Costa do Marfim","🇨🇮","africa", "prata", 79, "#FF8200", "#FFFFFF", "#009E60", "Os Elefantes campeões africanos voltam à elite."),
  c("Gana",      "🇬🇭", "africa", "prata", 78, "#FCD116", "#006B3F", "#CE1126", "Black Stars com nova geração de craques."),
  c("Tunisia",   "🇹🇳", "africa", "prata", 77, "#E70013", "#FFFFFF", "#000000", "As Águias de Cartago de volta à festa mundial."),
  c("Argelia",   "🇩🇿", "africa", "prata", 78, "#006233", "#FFFFFF", "#D21034", "Raposas do Deserto retornam após eliminação dolorosa."),
  c("Camaroes",  "🇨🇲", "africa", "prata", 78, "#007A5E", "#CE1126", "#FCD116", "Leões Indomáveis: tradição em todas as Copas."),
  c("Nigeria",   "🇳🇬", "africa", "ouro",  82, "#008751", "#FFFFFF", "#000000", "Super Eagles. A camisa mais cobiçada da África."),
  c("Africa do Sul","🇿🇦","africa", "prata", 76, "#007749", "#FFB81C", "#000000", "Bafana Bafana volta à Copa após anos."),
  c("Mali",      "🇲🇱", "africa", "prata", 76, "#FCD116", "#14B53A", "#CE1126", "Geração de ouro chega à primeira Copa."),

  // ==================== CURRENT — América do Norte / Central ====================
  c("Canada",    "🇨🇦", "america-norte", "prata", 80, "#FF0000", "#FFFFFF", "#000000", "Co-anfitriões. A geração Davies/David em casa."),
  c("Costa Rica","🇨🇷", "america-norte", "prata", 76, "#CE1126", "#FFFFFF", "#002B7F", "Los Ticos: sempre uma surpresa em Copas."),
  c("Jamaica",   "🇯🇲", "america-norte", "prata", 75, "#009B3A", "#FED100", "#000000", "Reggae Boyz inspiram pelo seu retorno."),
  c("Panama",    "🇵🇦", "america-norte", "prata", 75, "#005AA7", "#FFFFFF", "#D21034", "La Marea Roja na segunda Copa do Mundo."),
  c("Honduras",  "🇭🇳", "america-norte", "prata", 75, "#0073CF", "#FFFFFF", "#FFFFFF", "Los Catrachos cravam vaga inédita."),

  // ==================== CURRENT — América do Sul (extras) ====================
  c("Chile",     "🇨🇱", "america-sul", "prata", 79, "#D52B1E", "#FFFFFF", "#0039A6", "La Roja chilena volta em ciclo renovado."),
  c("Peru",      "🇵🇪", "america-sul", "prata", 77, "#FFFFFF", "#D91023", "#FFD700", "La Blanquirroja: garra e tradição andina."),
  c("Bolivia",   "🇧🇴", "america-sul", "prata", 75, "#007A33", "#FFD700", "#D52B1E", "La Verde joga em altitude e quer surpreender."),
  c("Venezuela", "🇻🇪", "america-sul", "prata", 76, "#7B1113", "#FFD100", "#003893", "La Vinotinto na primeira Copa da história."),

  // ==================== CURRENT — Europa (extras) ====================
  c("Italia",    "🇮🇹", "europa", "epico", 89, "#0066CC", "#FFFFFF", "#FFD700", "Azzurra de volta após dois fora. Hora da redenção."),
  c("Dinamarca", "🇩🇰", "europa", "ouro",  84, "#C60C30", "#FFFFFF", "#000000", "Os Dynamite Reds com talento europeu."),
  c("Polonia",   "🇵🇱", "europa", "ouro",  82, "#FFFFFF", "#DC143C", "#000000", "Lewandowski lidera os Bialo-Czerwoni."),
  c("Ucrania",   "🇺🇦", "europa", "ouro",  82, "#FFD500", "#0057B7", "#000000", "A Zhovto-Sini joga por mais que três pontos."),
  c("Servia",    "🇷🇸", "europa", "ouro",  83, "#C6363C", "#FFFFFF", "#0C4076", "Os Orlovi com uma das gerações mais ofensivas."),
  c("Hungria",   "🇭🇺", "europa", "prata", 80, "#CE2939", "#FFFFFF", "#477050", "A Mighty Magyars de volta à elite mundial."),
  c("Romenia",   "🇷🇴", "europa", "prata", 79, "#FCD116", "#002B7F", "#CE1126", "Os Tricolorii regressam após 28 anos."),
  c("Pais de Gales","🏴","europa", "prata", 79, "#D30731", "#FFFFFF", "#006233", "Os Dragões querem repetir o épico de 2022."),
  c("Republica Tcheca","🇨🇿","europa","prata", 78, "#D7141A", "#FFFFFF", "#11457E", "Os Národní Tým com base sólida e veterana."),

  // ==================== CURRENT — Ásia (extras) ====================
  c("Iran",      "🇮🇷", "asia", "ouro",  82, "#FFFFFF", "#239F40", "#DA0000", "Team Melli: maior potência do continente."),
  c("Arabia Saudita","🇸🇦","asia", "prata", 78, "#FFFFFF", "#006C35", "#000000", "Os Falcões Verdes que humilharam a Argentina em 2022."),
  c("Australia", "🇦🇺", "asia", "ouro",  81, "#FFD200", "#00843D", "#000000", "Socceroos firmes na sua sexta Copa seguida."),
  c("Catar",     "🇶🇦", "asia", "prata", 77, "#8A1538", "#FFFFFF", "#FFFFFF", "O atual campeão da Ásia volta como visitante."),
  c("Iraque",    "🇮🇶", "asia", "prata", 76, "#FFFFFF", "#007A3D", "#CE1126", "Os Leões da Mesopotâmia em uma Copa histórica."),
  c("Uzbequistao","🇺🇿","asia", "prata", 76, "#FFFFFF", "#1EB53A", "#0099B5", "Lobos Brancos estreantes no maior palco."),

  // ==================== CURRENT — Oceania ====================
  c("Nova Zelandia","🇳🇿","asia", "prata", 75, "#FFFFFF", "#000000", "#CE1126", "All Whites garantiram vaga direta da Oceania."),


  // ==================== LEGENDARY ====================
  l("Brasil",    "🇧🇷", "america-sul", "lendario", 1994, "home", 95, "#FFDF00", "#009C3B", "#002776", "Tetracampeã. Romário & Bebeto eternos."),
  l("Brasil",    "🇧🇷", "america-sul", "lendario", 1998, "home", 94, "#FFDF00", "#009C3B", "#002776", "Ronaldo Fenômeno em sua melhor forma."),
  l("Brasil",    "🇧🇷", "america-sul", "lendario", 2002, "home", 97, "#FFDF00", "#009C3B", "#002776", "Pentacampeã do mundo. Ronaldo, Rivaldo e Ronaldinho."),
  l("Brasil",    "🇧🇷", "america-sul", "lendario", 2006, "home", 92, "#FFDF00", "#009C3B", "#002776", "Quarteto mágico. Histórica geração."),
  l("Argentina", "🇦🇷", "america-sul", "lendario", 2022, "home", 96, "#75AADB", "#FFFFFF", "#FCBF49", "Messi finalmente conquistou o mundo. Lusail eterno."),
  l("Franca",    "🇫🇷", "europa",      "lendario", 1998, "home", 95, "#1E2A78", "#FFFFFF", "#EF4135", "Zidane e a primeira estrela francesa em casa."),
  l("Franca",    "🇫🇷", "europa",      "epico",    2006, "away", 90, "#FFFFFF", "#1E2A78", "#EF4135", "A camisa branca da campanha de Berlim."),
  l("Franca",    "🇫🇷", "europa",      "lendario", 2018, "home", 94, "#1E2A78", "#FFFFFF", "#EF4135", "Bicampeã. Mbappé surge para o mundo."),
  l("Alemanha",  "🇩🇪", "europa",      "epico",    1990, "home", 92, "#FFFFFF", "#000000", "#DD0000", "A camisa icônica de Klinsmann e Matthäus."),
  l("Alemanha",  "🇩🇪", "europa",      "lendario", 2014, "home", 95, "#FFFFFF", "#000000", "#DD0000", "Tetracampeã. 7×1 inesquecível no Mineirão."),
  l("Espanha",   "🇪🇸", "europa",      "lendario", 2010, "home", 95, "#C60B1E", "#FFC400", "#000000", "La Roja primeira estrela. Iniesta no 116'."),
  l("Holanda",   "🇳🇱", "europa",      "epico",    2010, "home", 90, "#FF6900", "#000000", "#FFFFFF", "Vice mundial. Robben & Sneijder."),
  l("Holanda",   "🇳🇱", "europa",      "epico",    2014, "home", 91, "#FF6900", "#000000", "#FFFFFF", "Tricampeã do bronze. Van Persie voa."),
];

export const CONTINENTS: { id: Continent; name: string; emoji: string; desc: string }[] = [
  { id: "america-sul",   name: "América do Sul",   emoji: "🌎", desc: "Berço do futebol-arte" },
  { id: "europa",        name: "Europa",           emoji: "🌍", desc: "Potências mundiais" },
  { id: "america-norte", name: "América do Norte", emoji: "🌎", desc: "Anfitriões da Copa" },
  { id: "asia",          name: "Ásia",             emoji: "🌏", desc: "Os tigres do Oriente" },
  { id: "africa",        name: "África",           emoji: "🌍", desc: "Garra e talento puro" },
];

export const RARITY_META: Record<Rarity, { label: string; color: string; glow: string; ring: string }> = {
  lendario: { label: "LENDÁRIO", color: "var(--gold)",   glow: "shadow-gold",  ring: "ring-[oklch(0.78_0.16_85)]" },
  epico:    { label: "ÉPICO",    color: "var(--epic)",   glow: "shadow-epic",  ring: "ring-[oklch(0.62_0.27_305)]" },
  ouro:     { label: "OURO",     color: "var(--gold)",   glow: "shadow-gold",  ring: "ring-[oklch(0.78_0.16_85)]" },
  prata:    { label: "PRATA",    color: "var(--silver)", glow: "",             ring: "ring-[oklch(0.78_0.01_260)]" },
};

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const productsByContinent = (id: Continent) => PRODUCTS.filter(p => p.continent === id && p.type === "current");
export const legendaryProducts = () => PRODUCTS.filter(p => p.type === "legendary");
