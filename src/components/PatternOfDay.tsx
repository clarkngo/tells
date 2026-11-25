import { useEffect, useState } from 'preact/hooks';
import { loadAttempts } from '../lib/storage';
import { mastery } from './Stars';
import Glyph from './Glyph';

export interface DayPattern { track: string; short: string; slug: string; name: string; hue: number; blurb: string; signals: string[] }

const KEY = 'tells:v1:potd';
const dayNo = () => {
  const d = new Date();
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
};

/** One pick per day, kept for the whole day. Leans toward unmastered patterns in tracks you've started. */
function pick(all: DayPattern[]): DayPattern {
  const day = dayNo();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    const hit = saved?.day === day && all.find((p) => p.track === saved.track && p.slug === saved.slug);
    if (hit) return hit;
  } catch { /* fall through and pick again */ }
  const attempts = loadAttempts().filter((a) => !a.peeked);
  const started = new Set(attempts.map((a) => a.track));
  const pool = started.size
    ? all.filter((p) => started.has(p.track) && mastery(attempts.filter((a) => a.track === p.track && a.answer === p.slug)).stars < 3)
    : all;
  const from = pool.length ? pool : all;
  const chosen = from[(Math.imul(day, 2654435761) >>> 0) % from.length] ?? from[0];
  try { localStorage.setItem(KEY, JSON.stringify({ day, track: chosen.track, slug: chosen.slug })); } catch { /* not remembered */ }
  return chosen;
}

// Home card: one pattern a day, with its cue words and a focused drill.
export default function PatternOfDay({ patterns, base }: { patterns: DayPattern[]; base: string }) {
  const [p, setP] = useState<DayPattern | null>(null);
  useEffect(() => setP(pick(patterns)), []);
  if (!p) return null;
  return (
    <section class="potd" style={{ '--h': p.hue }}>
      <Glyph slug={p.slug} hue={p.hue} />
      <div class="potd-text">
        <p class="eyebrow">Pattern of the day · {p.short}</p>
        <p class="pname">{p.name}</p>
        <p class="potd-blurb">{p.blurb}</p>
        {p.signals.length > 0 && <ul class="apart-signals">{p.signals.map((s) => <li>{s}</li>)}</ul>}
        <div class="row">
          <a class="btn primary" href={`${base}${p.track}/drill/?focus=${p.slug}`}>Drill it →</a>
          <a class="btn ghost" href={`${base}${p.track}/patterns/`}>All {p.short} patterns</a>
        </div>
      </div>
    </section>
  );
}
