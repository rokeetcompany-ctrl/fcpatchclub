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
