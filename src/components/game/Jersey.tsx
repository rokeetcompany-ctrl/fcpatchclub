import type { Variant } from "@/data/products";

interface Props {
  primary: string;
  secondary: string;
  accent: string;
  variant?: Variant;
  number?: number;
  className?: string;
}

export function Jersey({ primary, secondary, accent, variant = "home", number = 10, className }: Props) {
  const body = variant === "away" ? secondary : primary;
  const stripe = variant === "away" ? primary : secondary;
  const text = variant === "away" ? primary : "#0a0a0a";
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`g-${primary}-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={body} stopOpacity="1" />
          <stop offset="100%" stopColor={body} stopOpacity="0.85" />
        </linearGradient>
        <filter id="jersey-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dy="4" />
          <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#jersey-shadow)">
        {/* sleeves */}
        <path d="M20 50 L50 30 L70 55 L55 90 L20 80 Z" fill={stripe} />
        <path d="M180 50 L150 30 L130 55 L145 90 L180 80 Z" fill={stripe} />
        {/* body */}
        <path d="M55 35 Q70 25 100 25 Q130 25 145 35 L150 200 Q120 215 100 215 Q80 215 50 200 Z"
              fill={`url(#g-${primary}-${variant})`} />
        {/* collar */}
        <path d="M85 25 Q100 45 115 25 L115 35 Q100 50 85 35 Z" fill={accent} />
        {/* center vertical detail */}
        <rect x="98" y="40" width="4" height="160" fill={accent} opacity="0.35" />
        {/* number */}
        <text x="100" y="155" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900"
              fontSize="78" fill={text}>{number}</text>
      </g>
    </svg>
  );
}
