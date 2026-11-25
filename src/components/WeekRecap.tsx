import type { Attempt } from '../lib/storage';
import { mastery } from './Stars';
import type { MapTrack } from './SkyMap';

const DAY = 86400000;

function totalStars(tracks: MapTrack[], all: Attempt[]) {
  let s = 0;
  for (const t of tracks) {
    const mine = all.filter((a) => a.track === t.slug && !a.peeked);
    if (!mine.length) continue;
    for (const p of t.patterns) s += mastery(mine.filter((a) => a.answer === p.slug)).stars;
  }
  return s;
}

const clean = (a: Attempt) => a.picked === a.answer && !a.peeked;

function lastBy(attempts: Attempt[]) {
  const m = new Map<string, Attempt>();
  for (const a of attempts) m.set(`${a.track}:${a.id}`, a);
  return m;
}

// This week against last week: answers, accuracy, stars gained, misses cleared,
// which days you practised, and the pair you mixed up most.
export default function WeekRecap({ tracks, attempts }: { tracks: MapTrack[]; attempts: Attempt[] }) {
  const now = Date.now();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const weekStart = start.getTime() - 6 * DAY; // today and the six days before
  const prevStart = weekStart - 7 * DAY;
  const week = attempts.filter((a) => a.at >= weekStart);
  const prev = attempts.filter((a) => a.at >= prevStart && a.at < weekStart);
  if (!week.length && !prev.length) return null;

  const before = attempts.filter((a) => a.at < weekStart);
  const gained = totalStars(tracks, attempts) - totalStars(tracks, before);
  const was = lastBy(before);
  const nowLast = lastBy(attempts);
  let cleared = 0;
  for (const [k, a] of was) if (!clean(a) && clean(nowLast.get(k)!)) cleared++;

  const pct = (xs: Attempt[]) => (xs.length ? Math.round((100 * xs.filter(clean).length) / xs.length) : 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d0 = weekStart + i * DAY;
    return { label: new Date(d0).toLocaleDateString(undefined, { weekday: 'narrow' }), on: week.some((a) => a.at >= d0 && a.at < d0 + DAY) };
  });

  const pairs = new Map<string, number>();
  for (const a of week) {
    if (a.peeked || !a.picked || a.picked === a.answer) continue;
    const k = `${a.track}|${[a.answer, a.picked].sort().join('|')}`;
    pairs.set(k, (pairs.get(k) ?? 0) + 1);
  }
  const top = [...pairs.entries()].sort((a, b) => b[1] - a[1])[0];
  let pair = '';
  if (top && top[1] > 1) {
    const [t, x, y] = top[0].split('|');
    const tr = tracks.find((z) => z.slug === t);
    const name = (s: string) => tr?.patterns.find((p) => p.slug === s)?.name ?? s;
    pair = `${name(x)} ↔ ${name(y)} (${tr?.short ?? t}, ${top[1]}×)`;
  }

  const delta = (a: number, b: number, unit = '') => {
    if (!prev.length) return null;
    const d = a - b;
    return <span class={`wr-delta ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>{d > 0 ? '▲' : d < 0 ? '▼' : '='} {d ? `${Math.abs(d)}${unit}` : 'same'}</span>;
  };

  return (
    <div class="week-recap">
      <h3>This week</h3>
      <div class="wr-days" aria-label={`Practised ${days.filter((d) => d.on).length} of the last 7 days`}>
        {days.map((d) => <span class={d.on ? 'on' : ''}><i />{d.label}</span>)}
      </div>
      <div class="wr-stats">
        <div><strong>{week.length}</strong><span>answers</span>{delta(week.length, prev.length)}</div>
        <div><strong>{week.length ? `${pct(week)}%` : '–'}</strong><span>clean</span>{week.length > 0 && delta(pct(week), pct(prev), '%')}</div>
        <div><strong>{gained > 0 ? `+${gained}` : gained}</strong><span>stars</span></div>
        <div><strong>{cleared}</strong><span>misses fixed</span></div>
      </div>
      {pair && <p class="muted wr-pair">Most mixed up: {pair}</p>}
      {!week.length && <p class="muted wr-pair">Nothing yet this week. Last week you answered {prev.length}.</p>}
    </div>
  );
}
