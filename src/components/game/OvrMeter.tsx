import type { Product } from "@/data/products";
import { RARITY_META } from "@/data/products";

interface Props {
  product: Pick<Product, "ovr" | "attrs" | "rarity">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OvrMeter({ product, size = "md", className = "" }: Props) {
  const meta = RARITY_META[product.rarity];
  const ovr = product.ovr;
  const r = size === "lg" ? 46 : size === "sm" ? 30 : 38;
  const stroke = size === "lg" ? 8 : 6;
  const dim = (r + stroke) * 2;
  const C = 2 * Math.PI * r;
  const dash = (ovr / 100) * C;

  const bars: { label: string; key: keyof Product["attrs"] }[] = [
    { label: "ATA", key: "ata" },
    { label: "TÉC", key: "tec" },
    { label: "MÍST", key: "mist" },
    { label: "HIST", key: "hist" },
  ];

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-card/60 p-4 ${className}`}
      style={{ borderColor: `${meta.color}55`, boxShadow: `0 0 30px ${meta.color}22` }}
    >
      <div className="relative shrink-0" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90" aria-hidden="true">
          <circle cx={dim / 2} cy={dim / 2} r={r} stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} fill="none" className="text-muted-foreground" />
          <circle
            cx={dim / 2} cy={dim / 2} r={r}
            stroke={meta.color} strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            style={{ filter: `drop-shadow(0 0 6px ${meta.color})`, transition: "stroke-dasharray .9s cubic-bezier(.2,.9,.2,1.2)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-display text-2xl font-black leading-none text-glow" style={{ color: meta.color }}>{ovr}</p>
            <p className="font-tactical text-[8px] font-bold uppercase tracking-widest text-muted-foreground">OVR</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
            FORÇA DA CAMISA
          </p>
          <span className="rounded-md px-2 py-0.5 font-tactical text-[9px] font-black tracking-widest"
                style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}>
            {meta.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {bars.map(b => {
            const v = product.attrs[b.key];
            return (
              <div key={b.key} className="min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-tactical text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{b.label}</span>
                  <span className="font-display text-[11px] font-black" style={{ color: meta.color }}>{v}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${v}%`, background: `linear-gradient(90deg, ${meta.color}, var(--primary))`, boxShadow: `0 0 8px ${meta.color}88` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
