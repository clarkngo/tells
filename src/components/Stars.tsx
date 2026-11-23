import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, repeatWeight, type Attempt } from '../lib/storage';

// Mastery is judged on recent form, so old misses fade out as you improve.
// Each attempt is weighted by how fresh the question was: a new question is
// worth a full mastery point, a repeat less (see repeatWeight).
const WINDOW = 10;
const TIERS = [
  { n: 3, acc: 0.6, ms: Infinity },  // ★
  { n: 6, acc: 0.8, ms: Infinity },  // ★★
  { n: 10, acc: 0.9, ms: 8000 },     // ★★★  (and fast)
];

export function mastery(attempts: Attempt[]) {
  const prior = new Map<string, number>();
  const weighted = attempts.map((a) => {
    const k = prior.get(a.id) ?? 0;
    prior.set(a.id, k + 1);
    return { a, w: repeatWeight(k) };
  });
  const pts = weighted.reduce((s, x) => s + x.w, 0);
  const recent = weighted.slice(-WINDOW);
  const recentW = recent.reduce((s, x) => s + x.w, 0);
  const right = recent.filter((x) => x.a.picked === x.a.answer);
  const acc = recentW ? right.reduce((s, x) => s + x.w, 0) / recentW : 0;
  const ms = right.length ? right.reduce((s, x) => s + x.a.ms, 0) / right.length : Infinity;
  let stars = 0;
  for (const t of TIERS) {
    if (pts >= t.n - 1e-9 && acc >= t.acc && ms <= t.ms) stars++;
    else break;
  }
  const next = TIERS[stars];
  let hint = 'Mastered';
  if (next) {
    const need = next.n - pts;
    if (need > 1e-9) hint = `${need % 1 ? need.toFixed(1) : need} mastery pts to next ★`;
    else if (acc < next.acc) hint = `${Math.round(next.acc * 100)}% recent accuracy for next ★`;
    else hint = `avg under ${next.ms / 1000}s for next ★`;
  }
  return { stars, hint, acc, n: attempts.length, pts, unique: prior.size };
}

export default function Stars({ track, slug }: { track: string; slug: string }) {
  const [m, setM] = useState<ReturnType<typeof mastery> | null>(null);
  useEffect(() => {
    const refresh = () =>
      setM(mastery(loadAttempts().filter((a) => a.track === track && a.answer === slug && !a.peeked)));
    refresh();
    addEventListener(CHANGED, refresh);
    return () => removeEventListener(CHANGED, refresh);
  }, []);
  if (!m) return null;
  const label = `${m.stars} of 3 mastery stars${m.n
    ? `, ${m.pts.toFixed(1)} mastery pts from ${m.unique} different questions, ${Math.round(m.acc * 100)}% recent accuracy. Repeated questions earn fewer mastery pts.`
    : ''}`;
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
