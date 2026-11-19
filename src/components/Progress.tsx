import { useEffect, useState } from 'preact/hooks';
import { CHANGED, loadAttempts, type Attempt } from '../lib/storage';
import type { Pattern } from '../lib/types';

export default function Progress({ track, patterns }: { track: string; patterns: Pattern[] }) {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  useEffect(() => {
    const refresh = () => setAttempts(loadAttempts().filter((a) => a.track === track));
    refresh();
    addEventListener(CHANGED, refresh);
    return () => removeEventListener(CHANGED, refresh);
  }, []);
  if (!attempts) return null;
  if (!attempts.length) {
    return <p class="muted">No drills yet. Your accuracy and weakest pattern will show up here.</p>;
  }

  const right = attempts.filter((a) => a.picked === a.answer);
  const avgMs = right.length ? right.reduce((s, a) => s + a.ms, 0) / right.length : 0;
  const byPattern = new Map<string, { n: number; ok: number }>();
  for (const a of attempts) {
    const s = byPattern.get(a.answer) ?? { n: 0, ok: 0 };
    s.n++;
    if (a.picked === a.answer) s.ok++;
    byPattern.set(a.answer, s);
  }
  const weakest = [...byPattern.entries()]
    .filter(([, s]) => s.n >= 3)
    .sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)[0];
  const weakName = weakest && patterns.find((p) => p.slug === weakest[0])?.name;

  return (
    <div class="stats">
      <div class="stat"><span class="stat-v">{attempts.length}</span><span class="stat-l">answered</span></div>
      <div class="stat"><span class="stat-v">{Math.round((right.length / attempts.length) * 100)}%</span><span class="stat-l">accuracy</span></div>
      <div class="stat"><span class="stat-v">{avgMs ? (avgMs / 1000).toFixed(1) + 's' : '–'}</span><span class="stat-l">avg spot time</span></div>
      <div class="stat"><span class="stat-v stat-small">{weakName ?? '–'}</span><span class="stat-l">weakest pattern</span></div>
    </div>
  );
}
