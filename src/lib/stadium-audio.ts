/**
 * PS2-style boot sound + stadium crowd cheer, synthesized in the browser.
 * No external assets needed.
 */
export function playStadiumBoot(durationMs = 2800) {
  if (typeof window === "undefined") return () => {};
  const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
  if (!AC) return () => {};

  let ctx: AudioContext;
  try { ctx = new AC(); } catch { return () => {}; }
  const now = ctx.currentTime;
  const dur = durationMs / 1000;

  const master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  // 1) Crowd noise — filtered white noise, swelling
  const bufferSize = ctx.sampleRate * dur;
  const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // pink-ish noise
    data[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / 8000));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = false;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 800;
  noiseFilter.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.55, now + dur * 0.55);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  noise.start(now);
  noise.stop(now + dur);

  // 2) PS2-like deep boot pad — sub sweep
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(40, now);
  sub.frequency.exponentialRampToValueAtTime(110, now + dur * 0.7);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.0001, now);
  subGain.gain.exponentialRampToValueAtTime(0.55, now + 0.6);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  sub.connect(subGain).connect(master);
  sub.start(now);
  sub.stop(now + dur);

  // 3) Bright "intro chime" — two-note neon arpeggio
  const playNote = (freq: number, t0: number, len: number, gain = 0.18) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now + t0);
    g.gain.exponentialRampToValueAtTime(gain, now + t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + t0 + len);
    o.connect(g).connect(master);
    o.start(now + t0);
    o.stop(now + t0 + len + 0.05);
  };
  playNote(523.25, 0.05, 0.45); // C5
  playNote(659.25, 0.35, 0.45); // E5
  playNote(987.77, 0.7, 0.7, 0.22); // B5
  playNote(1318.51, 1.1, 0.9, 0.2); // E6

  // 4) Whistle — referee blow at 30%
  const whistle = ctx.createOscillator();
  whistle.type = "sawtooth";
  whistle.frequency.setValueAtTime(2400, now + 1.5);
  whistle.frequency.linearRampToValueAtTime(2700, now + 1.85);
  const wGain = ctx.createGain();
  wGain.gain.setValueAtTime(0.0001, now + 1.5);
  wGain.gain.exponentialRampToValueAtTime(0.18, now + 1.55);
  wGain.gain.exponentialRampToValueAtTime(0.001, now + 1.95);
  const wFilter = ctx.createBiquadFilter();
  wFilter.type = "bandpass";
  wFilter.frequency.value = 2500;
  wFilter.Q.value = 12;
  whistle.connect(wFilter).connect(wGain).connect(master);
  whistle.start(now + 1.5);
  whistle.stop(now + 2);

  return () => {
    try {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      setTimeout(() => ctx.close(), 250);
    } catch {}
  };
}

/** Box opening: tense build-up + reveal whoosh + rarity chime */
export function playBoxOpen(rarity: "lendario" | "epico" | "ouro" | "prata" = "ouro") {
  if (typeof window === "undefined") return;
  const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
  if (!AC) return;
  let ctx: AudioContext;
  try { ctx = new AC(); } catch { return; }
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 0.25;
  master.connect(ctx.destination);

  // Tense rumble — shake phase 0..2.0s
  const sub = ctx.createOscillator();
  sub.type = "sawtooth";
  sub.frequency.setValueAtTime(55, now);
  sub.frequency.exponentialRampToValueAtTime(140, now + 2.0);
  const subFilter = ctx.createBiquadFilter();
  subFilter.type = "lowpass";
  subFilter.frequency.value = 320;
  const subG = ctx.createGain();
  subG.gain.setValueAtTime(0.0001, now);
  subG.gain.exponentialRampToValueAtTime(0.45, now + 1.7);
  subG.gain.exponentialRampToValueAtTime(0.001, now + 2.05);
  sub.connect(subFilter).connect(subG).connect(master);
  sub.start(now); sub.stop(now + 2.1);

  // Crowd swell
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2.2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const nF = ctx.createBiquadFilter();
  nF.type = "bandpass"; nF.frequency.value = 900; nF.Q.value = 0.6;
  const nG = ctx.createGain();
  nG.gain.setValueAtTime(0.0001, now);
  nG.gain.exponentialRampToValueAtTime(0.4, now + 1.9);
  nG.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
  noise.connect(nF).connect(nG).connect(master);
  noise.start(now); noise.stop(now + 2.2);

  // Whoosh reveal at 2.0s
  const whoosh = ctx.createOscillator();
  whoosh.type = "sawtooth";
  whoosh.frequency.setValueAtTime(800, now + 2.0);
  whoosh.frequency.exponentialRampToValueAtTime(120, now + 2.35);
  const wG = ctx.createGain();
  wG.gain.setValueAtTime(0.0001, now + 2.0);
  wG.gain.exponentialRampToValueAtTime(0.3, now + 2.05);
  wG.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
  whoosh.connect(wG).connect(master);
  whoosh.start(now + 2.0); whoosh.stop(now + 2.45);

  // Rarity chord at 2.15s — more notes for higher rarity
  const chordMap: Record<string, number[]> = {
    prata:    [523.25, 659.25],
    ouro:     [523.25, 659.25, 783.99],
    epico:    [523.25, 659.25, 783.99, 987.77],
    lendario: [392, 523.25, 659.25, 783.99, 987.77, 1318.51],
  };
  const chord = chordMap[rarity];
  chord.forEach((f, idx) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = ctx.createGain();
    const t0 = now + 2.15 + idx * 0.04;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4);
    o.connect(g).connect(master);
    o.start(t0); o.stop(t0 + 1.5);
  });

  setTimeout(() => { try { ctx.close(); } catch {} }, 4200);
}

/** Soft UI tick used by PS2-style selection cursor */
export function playCursorTick() {
  if (typeof window === "undefined") return;
  const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
  if (!AC) return;
  let ctx: AudioContext;
  try { ctx = new AC(); } catch { return; }
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "square";
  o.frequency.setValueAtTime(880, now);
  o.frequency.exponentialRampToValueAtTime(1320, now + 0.05);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  o.connect(g).connect(ctx.destination);
  o.start(now); o.stop(now + 0.12);
  setTimeout(() => { try { ctx.close(); } catch {} }, 200);
}
