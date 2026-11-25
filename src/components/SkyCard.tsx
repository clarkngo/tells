import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, needsRetry, type Attempt } from '../lib/storage';
import { mastery } from './Stars';
import { waitingCount } from './MapLink';

export interface CardTrack { slug: string; short: string; patterns: string[] }

interface Sum { stars: number; max: number; frac: Map<string, number>; missing: Set<string>; waiting: number; answered: number }

function summarize(tracks: CardTrack[], all: Attempt[]): Sum {
  const frac = new Map<string, number>();
  const missing = new Set<string>();
  let stars = 0;
  let max = 0;
  for (const t of tracks) {
    const mine = all.filter((a) => a.track === t.slug && !a.peeked);
    let s = 0;
    for (const p of t.patterns) s += mastery(mine.filter((a) => a.answer === p)).stars;
    stars += s;
    max += t.patterns.length * 3;
    frac.set(t.slug, s / (t.patterns.length * 3 || 1));
  }
  const last = new Map<string, Attempt>();
  for (const a of all) last.set(`${a.track}:${a.id}`, a);
  for (const a of last.values()) if (needsRetry(a)) missing.add(a.track);
  return { stars, max, frac, missing, waiting: waitingCount(all), answered: all.length };
}

// Home-page card with a tiny live preview of the progress map. The whole card is
// one big tap target.
export default function SkyCard({ tracks, href }: { tracks: CardTrack[]; href: string }) {
  const [sum, setSum] = useState<Sum | null>(null);
  useEffect(() => {
    const r = () => setSum(summarize(tracks, loadAttempts()));
    r();
    addEventListener(CHANGED, r);
    return () => removeEventListener(CHANGED, r);
  }, []);
  if (!sum) return <a class="sky-card" href={href}><span class="sky-card-text"><strong>Your sky</strong></span></a>;
  const n = tracks.length;
  const line = sum.answered
    ? `${sum.stars} of ${sum.max} ★${sum.waiting ? ` · ${sum.waiting} misses waiting` : ''}`
    : 'Every track as a sun. Answer a few questions and it lights up.';
  return (
    <>
    <a class="sky-card" href={href}>
      <svg viewBox="-60 -60 120 120" aria-hidden="true">
        <circle r="44" class="sc-orbit" />
        <circle r="11" class="sc-core" style={{ opacity: 0.35 + (0.65 * sum.stars) / (sum.max || 1) }} />
        {tracks.map((t, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const f = sum.frac.get(t.slug) ?? 0;
          return (
            <circle cx={Math.cos(a) * 44} cy={Math.sin(a) * 44} r={4.6}
              class={`sc-sun ${f ? 'lit' : ''} ${sum.missing.has(t.slug) ? 'miss' : ''}`}
              style={f ? { fillOpacity: 0.3 + 0.7 * f } : undefined} />
          );
        })}
      </svg>
      <span class="sky-card-text">
        <strong>Your sky</strong>
        <span>{line}</span>
      </span>
      <span class="sky-card-go" aria-hidden="true">→</span>
    </a>
    {sum.waiting > 0 && (
      <a class="fix-card" href={`${href.replace(/map\/$/, '')}review/`}>
        <span class="fix-dot" aria-hidden="true" />
        <span class="fix-text"><strong>Fix my misses</strong><span class="muted">{Math.min(sum.waiting, 10)} {sum.waiting === 1 ? 'question' : 'questions'}, no timer</span></span>
        <span class="sky-card-go" aria-hidden="true">→</span>
      </a>
    )}
    </>
  );
}
