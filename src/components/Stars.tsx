import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, type Attempt } from '../lib/storage';

// Mastery is judged on recent form, so old misses fade out as you improve.
const WINDOW = 10;
const TIERS = [
  { n: 3, acc: 0.6, ms: Infinity },  // ★
  { n: 6, acc: 0.8, ms: Infinity },  // ★★
  { n: 10, acc: 0.9, ms: 8000 },     // ★★★  (and fast)
];

export function mastery(attempts: Attempt[]) {
  const recent = attempts.slice(-WINDOW);
  const right = recent.filter((a) => a.picked === a.answer);
  const acc = recent.length ? right.length / recent.length : 0;
  const ms = right.length ? right.reduce((s, a) => s + a.ms, 0) / right.length : Infinity;
  let stars = 0;
  for (const t of TIERS) {
    if (attempts.length >= t.n && acc >= t.acc && ms <= t.ms) stars++;
    else break;
  }
  const next = TIERS[stars];
  let hint = 'Mastered';
  if (next) {
    if (attempts.length < next.n) hint = `${next.n - attempts.length} more to next ★`;
    else if (acc < next.acc) hint = `${Math.round(next.acc * 100)}% recent accuracy for next ★`;
    else hint = `avg under ${next.ms / 1000}s for next ★`;
  }
  return { stars, hint, acc, n: attempts.length };
}

export default function Stars({ track, slug }: { track: string; slug: string }) {
  const [m, setM] = useState<ReturnType<typeof mastery> | null>(null);
  useEffect(() => {
    const refresh = () =>
      setM(mastery(loadAttempts().filter((a) => a.track === track && a.answer === slug)));
    refresh();
    addEventListener(CHANGED, refresh);
    return () => removeEventListener(CHANGED, refresh);
  }, []);
  if (!m) return null;
  const label = `${m.stars} of 3 mastery stars${m.n ? `, ${Math.round(m.acc * 100)}% recent accuracy` : ''}`;
  return (
    <div class={`mastery m${m.stars}`} title={label}>
      <span class="stars" role="img" aria-label={label}>
        {[0, 1, 2].map((i) => (
          <svg class={i < m.stars ? 'on' : ''} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
          </svg>
        ))}
      </span>
      <span class="mastery-hint">{m.n ? m.hint : 'Not started'}</span>
    </div>
  );
}
