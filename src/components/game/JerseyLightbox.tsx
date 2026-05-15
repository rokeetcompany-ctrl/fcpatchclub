import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Jersey } from "./Jersey";
import type { Variant } from "@/data/products";
import { playCursorTick } from "@/lib/stadium-audio";

export interface LightboxShot {
  key: string;
  label: string;
  number: number;
  useVariant: Variant;
  /** Real photo URL (Shopify CDN). When present, renders <img> instead of the SVG fallback. */
  image?: string;
}

interface Props {
  open: boolean;
  shots: LightboxShot[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  primary: string;
  secondary: string;
  accent: string;
  rarityColor: string;
  team: string;
}

const ZOOM_STEPS = [1, 1.6, 2.4, 3.2];

export function JerseyLightbox({
  open, shots, index, onIndexChange, onClose,
  primary, secondary, accent, rarityColor, team,
}: Props) {
  const [zoomIdx, setZoomIdx] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const zoom = ZOOM_STEPS[zoomIdx];
  const shot = shots[index];

  const reset = () => { setZoomIdx(0); setPan({ x: 0, y: 0 }); };

  const next = () => { onIndexChange((index + 1) % shots.length); reset(); playCursorTick(); };
  const prev = () => { onIndexChange((index - 1 + shots.length) % shots.length); reset(); playCursorTick(); };

  useEffect(() => { if (open) reset(); }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "+" || e.key === "=") setZoomIdx(z => Math.min(z + 1, ZOOM_STEPS.length - 1));
      else if (e.key === "-") { setZoomIdx(z => Math.max(z - 1, 0)); setPan({ x: 0, y: 0 }); }
      else if (e.key === "0") reset();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, index]);

  if (!open || !shot) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom === 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: pan.x, oy: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPan({ x: dragRef.current.ox + (e.clientX - dragRef.current.x), y: dragRef.current.oy + (e.clientY - dragRef.current.y) });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current || zoom !== 1) { touchRef.current = null; return; }
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const dt = Date.now() - touchRef.current.t;
    if (dt < 500 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next(); else prev();
    }
    touchRef.current = null;
  };

  const toggleZoom = () => {
    setZoomIdx(z => (z + 1) % ZOOM_STEPS.length);
    if (zoomIdx === ZOOM_STEPS.length - 1) setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria · ${team}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-xs font-black uppercase tracking-widest" style={{ color: rarityColor }}>
            {team}
          </p>
          <p className="font-tactical text-[10px] uppercase tracking-widest text-muted-foreground">
            {shot.label} · {index + 1}/{shots.length}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setZoomIdx(z => Math.max(z - 1, 0)); setPan({ x: 0, y: 0 }); }}
            disabled={zoomIdx === 0}
            aria-label="Diminuir zoom"
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[44px] text-center font-display text-xs font-black text-primary">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoomIdx(z => Math.min(z + 1, ZOOM_STEPS.length - 1))}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            aria-label="Aumentar zoom"
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            aria-label="Resetar zoom"
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-1 grid h-10 w-10 place-items-center rounded-md border border-primary/60 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        className="relative flex-1 overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onDoubleClick={toggleZoom}
        style={{ cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in", touchAction: zoom > 1 ? "none" : "pan-y" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div
          className="absolute inset-0 grid place-items-center transition-transform duration-200 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <Jersey
            key={shot.key + shot.useVariant}
            primary={primary} secondary={secondary} accent={accent}
            variant={shot.useVariant} number={shot.number}
            className="h-[70vh] max-h-[70vh] w-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Imagem anterior"
          className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-primary/40 bg-background/70 text-primary backdrop-blur transition hover:scale-110 hover:bg-primary/20 md:left-6 md:h-14 md:w-14"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Próxima imagem"
          className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-primary/40 bg-background/70 text-primary backdrop-blur transition hover:scale-110 hover:bg-primary/20 md:right-6 md:h-14 md:w-14"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1 font-tactical text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
          Toque duplo para zoom · Arraste para mover · Deslize para trocar
        </p>
      </div>

      {/* Thumbnails */}
      <div className="border-t border-border/60 px-3 py-3">
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto">
          {shots.map((g, i) => (
            <button
              key={g.key}
              onClick={() => { onIndexChange(i); reset(); playCursorTick(); }}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-card/60 transition ${i === index ? "border-primary shadow-neon" : "border-border hover:border-primary/50"}`}
              aria-label={`Ver ${g.label}`}
              aria-current={i === index}
            >
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative grid h-full place-items-center">
                <Jersey primary={primary} secondary={secondary} accent={accent} variant={g.useVariant} number={g.number} className="h-3/4 w-auto" />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-background/70 py-0.5 text-center font-tactical text-[8px] font-bold uppercase tracking-widest">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
