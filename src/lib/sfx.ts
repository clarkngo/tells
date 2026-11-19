// Tiny synthesized sound kit (Web Audio, no files). Silent when muted or when
// the browser has no audio support.
const MUTE_KEY = 'tells:v1:muted';
export const SOUND_CHANGED = 'tells:sound-changed';

let ctx: AudioContext | null = null;

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(m: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, m ? '1' : '0');
  } catch {
    /* ignore */
  }
  dispatchEvent(new Event(SOUND_CHANGED));
}

function audio(): AudioContext | null {
  if (isMuted()) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOpts { type?: OscillatorType; gain?: number; slideTo?: number }

function tone(freq: number, start: number, dur: number, { type = 'sine', gain = 0.14, slideTo }: ToneOpts = {}) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

// Pentatonic steps above C5: each combo level climbs one step.
const STEPS = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];
const note = (semi: number) => 523.25 * 2 ** (semi / 12);

export const sfx = {
  correct(combo: number) {
    const i = Math.min(Math.max(combo - 1, 0), STEPS.length - 2);
    tone(note(STEPS[i]), 0, 0.12, { type: 'triangle' });
    tone(note(STEPS[i + 1]), 0.07, 0.24, { type: 'triangle' });
    if (combo >= 5) tone(note(STEPS[i + 1] + 12), 0.12, 0.2, { type: 'sine', gain: 0.05 });
  },
  wrong() {
    tone(190, 0, 0.28, { type: 'sawtooth', gain: 0.05, slideTo: 85 });
  },
  tick() {
    tone(1400, 0, 0.035, { type: 'square', gain: 0.025 });
  },
  tap(on: boolean) {
    tone(on ? 900 : 640, 0, 0.05, { gain: 0.06 });
  },
  allTells() {
    tone(note(12), 0, 0.1);
    tone(note(16), 0.06, 0.1);
    tone(note(19), 0.12, 0.3);
  },
  levelUp() {
    [0, 4, 7, 12, 16].forEach((s, i) => tone(note(s), i * 0.08, 0.35, { type: 'triangle', gain: 0.11 }));
  },
  fanfare() {
    [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((s, i) => tone(note(s), i * 0.07, 0.4, { type: 'triangle', gain: 0.09 }));
  },
  finish() {
    tone(note(7), 0, 0.15, { type: 'triangle' });
    tone(note(12), 0.1, 0.3, { type: 'triangle' });
  },
};

export function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
